import Link from "next/link";

import { prisma } from "@/lib/prisma";
import { Container } from "@/components/section";
import { AdminDeleteButton } from "@/components/admin/AdminDeleteButtons";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type MilestoneRow = {
  id: string;
  milestoneType:
    | "REGISTRATION"
    | "TESTNET"
    | "KARMA_GAP"
    | "MAINNET"
    | "FARCASTER"
    | "FINAL_SUBMISSION";
  createdAt: Date;
  updatedAt: Date;
  contractAddress: string | null;
  karmaGapLink: string | null;
  farcasterLink: string | null;
  slidesLink: string | null;
  pitchDeckLink: string | null;
};

type ProjectRow = {
  id: string;
  projectName: string;
  githubRepo: string | null;
  milestones: MilestoneRow[];
};

type MemberRow = {
  id: string;
  memberName: string;
  memberGithub: string | null;
};

type TeamWithRelations = {
  id: string;
  createdAt: Date;
  teamName: string;
  members: MemberRow[];
  projects: ProjectRow[];
};

const db = prisma as unknown as {
  team: {
    findMany: (args: unknown) => Promise<TeamWithRelations[]>;
  };
};

const MILESTONE_ORDER = [
  { type: "REGISTRATION", label: "Registration" },
  { type: "TESTNET", label: "Testnet" },
  { type: "KARMA_GAP", label: "Karma Gap" },
  { type: "MAINNET", label: "Mainnet" },
  { type: "FARCASTER", label: "Farcaster" },
  { type: "FINAL_SUBMISSION", label: "Final" },
] as const;

function formatDate(date: Date) {
  try {
    return new Date(date).toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return String(date);
  }
}

async function getTeams() {
  try {
    const teams = await db.team.findMany({
      include: {
        members: true,
        projects: {
          include: {
            milestones: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });
    return teams;
  } catch (error) {
    console.error("Error fetching teams:", error);
    return [];
  }
}

export default async function AdminPage() {
  const teams = await getTeams();

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b border-black/5 bg-background dark:border-white/10">
        <Container className="flex h-16 items-center justify-between">
          <h1 className="text-lg font-semibold">Admin Dashboard</h1>
          <Link
            href="/"
            className="text-sm text-black/70 hover:text-foreground dark:text-white/70"
          >
            ← Back to home
          </Link>
        </Container>
      </header>

      <main className="py-8">
        <Container>
          <div className="mb-6">
            <h2 className="text-2xl font-semibold">Registered Teams</h2>
            <p className="mt-2 text-sm text-black/70 dark:text-white/70">
              Total teams: {teams.length}
            </p>
          </div>

          {teams.length === 0 ? (
            <div className="rounded-lg border border-black/10 bg-white p-8 text-center dark:border-white/10 dark:bg-white/[0.03]">
              <p className="text-sm text-black/60 dark:text-white/60">
                No teams registered yet
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {teams.map((team: TeamWithRelations) => (
                <div
                  key={team.id}
                  className="overflow-hidden rounded-lg border border-black/10 bg-white dark:border-white/10 dark:bg-white/[0.03]"
                >
                  <div className="border-b border-black/10 bg-black/[0.02] px-6 py-4 dark:border-white/10 dark:bg-white/[0.03]">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-lg font-semibold">{team.teamName}</h3>
                        <p className="mt-1 text-xs text-black/60 dark:text-white/60">
                          Registered on {new Date(team.createdAt).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </p>
                      </div>
                      <AdminDeleteButton id={team.id} label={team.teamName} kind="team" />
                    </div>
                  </div>

                  <div className="px-6 py-4">
                    <div className="mb-4">
                      <h4 className="mb-2 text-sm font-semibold">
                        Team Members ({team.members.length})
                      </h4>
                      <div className="space-y-1">
                        {team.members.map((member: TeamWithRelations["members"][number]) => (
                          <div
                            key={member.id}
                            className="flex items-center gap-2 text-sm text-black/80 dark:text-white/80"
                          >
                            <span>•</span>
                            <span>{member.memberName}</span>
                            {member.memberGithub && (
                              <a
                                href={`https://github.com/${member.memberGithub}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:underline dark:text-blue-400"
                              >
                                @{member.memberGithub}
                              </a>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>

                    {team.projects.length > 0 && (
                      <div>
                        <h4 className="mb-2 text-sm font-semibold">
                          Projects ({team.projects.length})
                        </h4>
                        <div className="space-y-2">
                          {team.projects.map((project: TeamWithRelations["projects"][number]) => (
                            <div
                              key={project.id}
                              className="rounded-md border border-black/10 bg-black/[0.02] p-3 dark:border-white/10 dark:bg-white/[0.02]"
                            >
                              <div className="flex items-start justify-between">
                                <div>
                                  <p className="font-medium">{project.projectName}</p>
                                  {project.githubRepo && (
                                    <a
                                      href={project.githubRepo}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="mt-1 text-xs text-blue-600 hover:underline dark:text-blue-400"
                                    >
                                      {project.githubRepo}
                                    </a>
                                  )}
                                </div>
                                <div className="flex items-center gap-2">
                                  <span className="text-xs text-black/60 dark:text-white/60">
                                    {project.milestones.length} milestone{project.milestones.length !== 1 ? "s" : ""}
                                  </span>
                                  <AdminDeleteButton
                                    id={project.id}
                                    label={project.projectName}
                                    kind="project"
                                  />
                                </div>
                              </div>

                              <div className="mt-3 flex flex-wrap gap-1.5">
                                {(() => {
                                  const completed = new Set<ProjectRow["milestones"][number]["milestoneType"]>(
                                    project.milestones.map((m: MilestoneRow) => m.milestoneType),
                                  );
                                  return MILESTONE_ORDER.map((m) => {
                                    const ok = completed.has(m.type);
                                    return (
                                      <span
                                        key={m.type}
                                        className={[
                                          "inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] font-medium",
                                          ok
                                            ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300"
                                            : "border-black/10 bg-black/[0.02] text-black/60 dark:border-white/10 dark:bg-white/[0.03] dark:text-white/60",
                                        ].join(" ")}
                                      >
                                        <span
                                          className={[
                                            "inline-block text-[11px] leading-none",
                                            ok ? "text-emerald-600 dark:text-emerald-300" : "text-black/40 dark:text-white/40",
                                          ].join(" ")}
                                        >
                                          {ok ? "✓" : "•"}
                                        </span>
                                        <span className="whitespace-nowrap">{m.label}</span>
                                      </span>
                                    );
                                  });
                                })()}
                              </div>

                              <details className="mt-3">
                                <summary className="cursor-pointer select-none text-xs font-medium text-black/70 hover:text-black dark:text-white/70 dark:hover:text-white">
                                  View milestone submissions
                                </summary>
                                <div className="mt-3 space-y-3">
                                  {(() => {
                                    const byType = new Map<
                                      ProjectRow["milestones"][number]["milestoneType"],
                                      MilestoneRow
                                    >(project.milestones.map((m: MilestoneRow) => [m.milestoneType, m]));

                                    return MILESTONE_ORDER.map((item) => {
                                      const row = byType.get(item.type) || null;
                                      const ok = Boolean(row);
                                      return (
                                        <div
                                          key={item.type}
                                          className="rounded-md border border-black/10 bg-white p-3 dark:border-white/10 dark:bg-white/[0.02]"
                                        >
                                          <div className="flex flex-wrap items-center justify-between gap-2">
                                            <div className="flex items-center gap-2">
                                              <span
                                                className={[
                                                  "inline-flex h-5 w-5 items-center justify-center rounded-full text-xs",
                                                  ok
                                                    ? "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300"
                                                    : "border border-black/10 text-black/40 dark:border-white/10 dark:text-white/40",
                                                ].join(" ")}
                                              >
                                                {ok ? "✓" : "•"}
                                              </span>
                                              <div className="text-sm font-semibold">{item.label}</div>
                                            </div>
                                            {row ? (
                                              <div className="text-[11px] text-black/60 dark:text-white/60">
                                                Updated {formatDate(row.updatedAt)}
                                              </div>
                                            ) : (
                                              <div className="text-[11px] text-black/50 dark:text-white/50">
                                                Not submitted
                                              </div>
                                            )}
                                          </div>

                                          {row ? (
                                            <div className="mt-2 grid gap-2 text-xs text-black/70 dark:text-white/70">
                                              {row.contractAddress ? (
                                                <div className="grid gap-1">
                                                  <div className="font-medium text-black/80 dark:text-white/80">
                                                    Contract address
                                                  </div>
                                                  <div className="break-all rounded-md border border-black/10 bg-black/[0.02] px-2 py-1 font-mono text-[11px] dark:border-white/10 dark:bg-white/[0.03]">
                                                    {row.contractAddress}
                                                  </div>
                                                </div>
                                              ) : null}

                                              <div className="flex flex-wrap items-center justify-between gap-2">
                                                <div className="text-[11px] text-black/55 dark:text-white/55">
                                                  Created {formatDate(row.createdAt)}
                                                </div>
                                                <AdminDeleteButton
                                                  id={row.id}
                                                  label={`${project.projectName} • ${item.label}`}
                                                  kind="milestone"
                                                />
                                              </div>

                                              <div className="grid gap-2 sm:grid-cols-2">
                                                {row.karmaGapLink ? (
                                                  <a
                                                    href={row.karmaGapLink}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="truncate text-blue-600 hover:underline dark:text-blue-400"
                                                  >
                                                    Karma Gap link
                                                  </a>
                                                ) : null}
                                                {row.farcasterLink ? (
                                                  <a
                                                    href={row.farcasterLink}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="truncate text-blue-600 hover:underline dark:text-blue-400"
                                                  >
                                                    Farcaster link
                                                  </a>
                                                ) : null}
                                                {row.slidesLink ? (
                                                  <a
                                                    href={row.slidesLink}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="truncate text-blue-600 hover:underline dark:text-blue-400"
                                                  >
                                                    Slides link
                                                  </a>
                                                ) : null}
                                                {row.pitchDeckLink ? (
                                                  <a
                                                    href={row.pitchDeckLink}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="truncate text-blue-600 hover:underline dark:text-blue-400"
                                                  >
                                                    Pitch deck link
                                                  </a>
                                                ) : null}
                                              </div>
                                            </div>
                                          ) : null}
                                        </div>
                                      );
                                    });
                                  })()}
                                </div>
                              </details>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </Container>
      </main>
    </div>
  );
}
