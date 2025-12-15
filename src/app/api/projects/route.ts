import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Avoid Prisma delegate typing flakiness in some tooling.
const db = prisma as unknown as {
  project: {
    findMany: (args: unknown) => Promise<unknown>;
    findFirst: (args: unknown) => Promise<unknown>;
    create: (args: unknown) => Promise<unknown>;
    update: (args: unknown) => Promise<unknown>;
    delete: (args: unknown) => Promise<unknown>;
  };
  milestone: {
    deleteMany: (args: unknown) => Promise<unknown>;
  };
  $transaction: (arg: unknown) => Promise<unknown>;
};

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const teamIdRaw = searchParams.get("teamId");
    // Treat missing/placeholder values as "no filter" to keep the UI resilient.
    const teamId =
      teamIdRaw &&
      teamIdRaw !== "undefined" &&
      teamIdRaw !== "null"
        ? teamIdRaw
        : null;

    const projects = await db.project.findMany({
      where: teamId ? { teamId } : undefined,
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(
      { projects },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch (error) {
    console.error("Database error:", error);
    return NextResponse.json(
      { error: "Failed to fetch projects" },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { projectName, githubRepo, teamId } = body;

    if (!projectName || !teamId) {
      return NextResponse.json(
        { error: "Project name and team ID are required" },
        { status: 400 },
      );
    }

    if (!githubRepo) {
      return NextResponse.json(
        { error: "GitHub repository is required" },
        { status: 400 },
      );
    }

    // Enforce 1 project per team (registration milestone is project creation).
    const project = await db.$transaction(async (txUnknown: unknown) => {
      const tx = txUnknown as unknown as { project: typeof db.project };
      const existing = await tx.project.findFirst({
        where: { teamId },
        select: { id: true },
      });
      if (existing) {
        // 409 conveys "conflict" (resource state doesn't allow this operation).
        throw new Error("TEAM_ALREADY_HAS_PROJECT");
      }

      return tx.project.create({
        data: {
          projectName,
          githubRepo,
          teamId,
        },
        include: {
          team: {
            include: {
              members: true,
            },
          },
        },
      });
    });

    return NextResponse.json({ project });
  } catch (error) {
    if (error instanceof Error && error.message === "TEAM_ALREADY_HAS_PROJECT") {
      return NextResponse.json(
        { error: "This team already has a project. You cannot create another one." },
        { status: 409 },
      );
    }
    console.error("Database error:", error);
    return NextResponse.json(
      { error: "Failed to create project" },
      { status: 500 },
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const body = (await request.json()) as {
      projectId?: string;
      projectName?: string;
      githubRepo?: string;
    };

    const projectId = typeof body.projectId === "string" ? body.projectId : "";
    const projectName = typeof body.projectName === "string" ? body.projectName.trim() : "";
    const githubRepo = typeof body.githubRepo === "string" ? body.githubRepo.trim() : "";

    if (!projectId) {
      return NextResponse.json({ error: "Project ID is required" }, { status: 400 });
    }
    if (!projectName) {
      return NextResponse.json({ error: "Project name is required" }, { status: 400 });
    }
    if (!githubRepo) {
      return NextResponse.json({ error: "GitHub repository is required" }, { status: 400 });
    }

    const project = await db.project.update({
      where: { id: projectId },
      data: { projectName, githubRepo },
    });

    return NextResponse.json(
      { project },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch (error) {
    console.error("Database error:", error);
    return NextResponse.json(
      { error: "Failed to update project" },
      { status: 500 },
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const projectId = searchParams.get("projectId");

    if (!projectId) {
      return NextResponse.json(
        { error: "Project ID is required" },
        { status: 400 },
      );
    }

    // Be robust even if DB-level cascades are not in place yet.
    await db.$transaction([
      db.milestone.deleteMany({ where: { projectId } }),
      db.project.delete({ where: { id: projectId } }),
    ]);

    return NextResponse.json(
      { ok: true },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch (error) {
    console.error("Database error:", error);
    return NextResponse.json(
      { error: "Failed to delete project" },
      { status: 500 },
    );
  }
}
