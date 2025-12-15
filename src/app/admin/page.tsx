import Link from "next/link";

import { prisma } from "@/lib/prisma";
import { Container } from "@/components/section";
import { ExportButton } from "@/components/admin/ExportButton";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

async function getRegistrations() {
  try {
    const registrations = await prisma.buildathonRegistration.findMany({
      orderBy: { createdAt: "desc" },
    });
    return registrations;
  } catch (error) {
    console.error("Error fetching registrations:", error);
    return [];
  }
}

export default async function AdminPage() {
  const registrations = await getRegistrations();

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
            <h2 className="text-2xl font-semibold">Pre-registrations</h2>
            <p className="mt-2 text-sm text-black/70 dark:text-white/70">
              Total registrations: {registrations.length}
            </p>
          </div>

          <div className="overflow-hidden rounded-lg border border-black/10 bg-white dark:border-white/10 dark:bg-white/[0.03]">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b border-black/10 bg-black/[0.02] dark:border-white/10 dark:bg-white/[0.03]">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-semibold">
                      Date
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold">
                      Team Name
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold">
                      Team Members
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold">
                      GitHub Repo
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold">
                      Karma Gap
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-black/5 dark:divide-white/5">
                  {registrations.length === 0 ? (
                    <tr>
                      <td
                        colSpan={5}
                        className="px-4 py-8 text-center text-sm text-black/60 dark:text-white/60"
                      >
                        No registrations yet
                      </td>
                    </tr>
                  ) : (
                    registrations.map((reg) => (
                      <tr
                        key={reg.id}
                        className="hover:bg-black/[0.02] dark:hover:bg-white/[0.02]"
                      >
                        <td className="px-4 py-3 text-xs text-black/70 dark:text-white/70">
                          {new Date(reg.createdAt).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </td>
                        <td className="px-4 py-3 text-sm font-medium">
                          {reg.teamName}
                        </td>
                        <td className="px-4 py-3 text-sm text-black/80 dark:text-white/80">
                          {reg.teamMembers}
                        </td>
                        <td className="px-4 py-3 text-sm">
                          {reg.githubRepo ? (
                            <a
                              href={reg.githubRepo}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:underline dark:text-blue-400"
                            >
                              View repo →
                            </a>
                          ) : (
                            <span className="text-black/40 dark:text-white/40">
                              —
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-sm">
                          {reg.karmaGapLink ? (
                            <a
                              href={reg.karmaGapLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:underline dark:text-blue-400"
                            >
                              View link →
                            </a>
                          ) : (
                            <span className="text-black/40 dark:text-white/40">
                              —
                            </span>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Export button */}
          {registrations.length > 0 && (
            <div className="mt-6">
              <ExportButton registrations={registrations} />
            </div>
          )}
        </Container>
      </main>
    </div>
  );
}
