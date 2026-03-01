import Link from "next/link";
import LogoutButton from "../../components/admin/LogoutButton";

import { prisma } from "@/lib/prisma";
import { Container } from "@/components/section";
import { AdminStats } from "@/components/admin/AdminStats";
import { CountryStats } from "@/components/admin/CountryStats";
import { ExportEmailsButton } from "@/components/admin/ExportEmailsButton";
import { TeamsList } from "@/components/admin/TeamsList";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type MemberRow = {
  id: string;
  memberName: string;
  memberEmail: string;
  memberGithub: string | null;
  country: string | null;
};

async function getTeams() {
  try {
    const teams = await prisma.team.findMany({
      include: {
        members: true,
        submission: true,
      },
      orderBy: { createdAt: "desc" },
    });
    // Convert dates to strings for client component
    return teams.map((team) => ({
      ...team,
      createdAt: team.createdAt.toISOString(),
      submission: team.submission
        ? {
            ...team.submission,
            createdAt: team.submission.createdAt.toISOString(),
            updatedAt: team.submission.updatedAt.toISOString(),
          }
        : null,
    }));
  } catch (error) {
    console.error("Error fetching teams:", error);
    return [];
  }
}

export default async function AdminPage() {
  const teams = await getTeams();

  // Get all members for country statistics
  const allMembers = teams.flatMap((team) => team.members);

  // Calculate stats
  const teamsWithSubmission = teams.filter((t) => t.submission !== null).length;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b border-black/5 bg-background dark:border-white/10">
        <Container className="flex h-16 items-center justify-between">
          <h1 className="text-lg font-semibold">Admin Dashboard</h1>
          <div className="flex items-center gap-3">
            <ExportEmailsButton />
            <LogoutButton />
            <Link
              href="/"
              className="text-sm text-black/70 hover:text-foreground dark:text-white/70"
            >
              ← Back to home
            </Link>
          </div>
        </Container>
      </header>

      <main className="py-8">
        <Container>
          <div className="mb-8">
            <h2 className="text-2xl font-semibold">Dashboard Overview</h2>
            <p className="mt-2 text-sm text-black/60 dark:text-white/60">
              Real-time statistics and analytics for the buildathon
            </p>
          </div>

          {/* Stats Charts */}
          {teams.length > 0 && (
            <div className="mb-10">
              <AdminStats teams={teams} />
            </div>
          )}

          {/* Country Stats */}
          {allMembers.length > 0 && (
            <div className="mb-10">
              <h3 className="text-lg font-semibold mb-4">Country Distribution (All Members)</h3>
              <CountryStats members={allMembers} />
            </div>
          )}

          {/* Teams List */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold">Teams</h3>
            <p className="mt-1 text-sm text-black/60 dark:text-white/60">
              {teams.length} teams registered • {teamsWithSubmission} submitted
            </p>
          </div>

          <TeamsList teams={teams} />
        </Container>
      </main>
    </div>
  );
}
