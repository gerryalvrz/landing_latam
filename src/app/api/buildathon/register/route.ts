import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

// IMPORTANT: Keep this in sync with the timeline shown on the landing page.
const BUILDATHON_START_AT = new Date("2026-01-19T00:00:00.000Z");

type RegisterPayload = {
  teamName: string;
  teamMembers: string;
  githubRepo?: string;
  karmaGapLink?: string;
};

function isValidOptionalUrl(value: unknown) {
  if (value === undefined || value === null || value === "") return true;
  if (typeof value !== "string") return false;
  try {
    // If URL.canParse exists (Node 20+), use it; otherwise fall back to constructor.
    if (typeof URL.canParse === "function") return URL.canParse(value);
    const _url = new URL(value);
    void _url;
    return true;
  } catch {
    return false;
  }
}

function parseGithubRepoUrl(urlString: string): { owner: string; repo: string } | null {
  let url: URL;
  try {
    url = new URL(urlString);
  } catch {
    return null;
  }

  const host = url.hostname.toLowerCase();
  if (host !== "github.com" && host !== "www.github.com") return null;

  // Accept:
  // - https://github.com/owner/repo
  // - https://github.com/owner/repo/
  // - https://github.com/owner/repo.git
  // - https://github.com/owner/repo/tree/main (etc)
  const parts = url.pathname.split("/").filter(Boolean);
  if (parts.length < 2) return null;

  const owner = parts[0]?.trim();
  const repo = parts[1]?.trim().replace(/\.git$/i, "");
  if (!owner || !repo) return null;

  return { owner, repo };
}

function githubHeaders() {
  const headers: Record<string, string> = {
    accept: "application/vnd.github+json",
    "user-agent": "landing_latam/buildathon-registration",
  };

  // Optional: helps avoid strict unauthenticated rate limits.
  const token = process.env.GITHUB_TOKEN;
  if (token) headers.authorization = `Bearer ${token}`;

  return headers;
}

async function assertGithubRepoHasNoPreBuildathonActivity(repoUrl: string) {
  const parsed = parseGithubRepoUrl(repoUrl);
  if (!parsed) return;

  const { owner, repo } = parsed;
  const startAt = BUILDATHON_START_AT;
  const beforeStartAtIso = new Date(startAt.getTime() - 1).toISOString();

  const repoRes = await fetch(`https://api.github.com/repos/${owner}/${repo}`, {
    headers: githubHeaders(),
    cache: "no-store",
  });

  if (repoRes.status === 404) {
    throw new Error(
      "GitHub repo not found (or private). Please provide a public repo URL, or leave it blank and add it later.",
    );
  }
  if (!repoRes.ok) {
    throw new Error("Could not verify GitHub repo activity. Please try again later.");
  }

  // We allow repos to be created before the buildathon start date,
  // as long as they have no commits before that date.
  // This enables pre-registration with empty repos.

  // Check commits strictly before start.
  const commitsRes = await fetch(
    `https://api.github.com/repos/${owner}/${repo}/commits?per_page=1&until=${encodeURIComponent(beforeStartAtIso)}`,
    { headers: githubHeaders(), cache: "no-store" },
  );

  // If commits endpoint fails (permissions/rate limit), fail closed to keep the rule enforceable.
  if (!commitsRes.ok) {
    throw new Error(
      "Could not verify GitHub repo commit history. Please provide a public repo URL, or leave it blank and add it later.",
    );
  }

  const commitsJson = (await commitsRes.json()) as unknown;
  if (Array.isArray(commitsJson) && commitsJson.length > 0) {
    throw new Error(
      `GitHub repos should have no activity before the buildathon start date (${startAt.toISOString().slice(0, 10)}).`,
    );
  }
}

export async function POST(req: Request) {
  let body: RegisterPayload;
  try {
    body = (await req.json()) as RegisterPayload;
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const teamName = typeof body.teamName === "string" ? body.teamName.trim() : "";
  const teamMembers =
    typeof body.teamMembers === "string" ? body.teamMembers.trim() : "";
  const githubRepo =
    typeof body.githubRepo === "string" ? body.githubRepo.trim() : "";
  const karmaGapLink =
    typeof body.karmaGapLink === "string" ? body.karmaGapLink.trim() : "";

  if (!teamName || !teamMembers) {
    return NextResponse.json(
      { error: "teamName and teamMembers are required" },
      { status: 400 },
    );
  }

  if (!isValidOptionalUrl(githubRepo) || !isValidOptionalUrl(karmaGapLink)) {
    return NextResponse.json(
      { error: "Invalid URL in githubRepo or karmaGapLink" },
      { status: 400 },
    );
  }

  try {
    if (githubRepo) await assertGithubRepoHasNoPreBuildathonActivity(githubRepo);
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Invalid GitHub repo" },
      { status: 400 },
    );
  }

  // Save registration to database
  try {
    await prisma.buildathonRegistration.create({
      data: {
        teamName,
        teamMembers,
        githubRepo: githubRepo || null,
        karmaGapLink: karmaGapLink || null,
        userAgent: req.headers.get("user-agent") || null,
      },
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Database error:", error);
    return NextResponse.json(
      { error: "Failed to save registration. Please try again." },
      { status: 500 },
    );
  }
}


