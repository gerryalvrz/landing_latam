"use client";

import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

type SubmissionRow = {
  id: string;
  karmaGapLink: string;
  trackOpenTrack: boolean;
  trackFarcasterMiniapp: boolean;
  trackSelf: boolean;
  trackV0: boolean;
  createdAt: string;
  updatedAt: string;
};

type MemberRow = {
  id: string;
  memberName: string;
  memberEmail: string;
  memberGithub: string | null;
  country: string | null;
};

type TeamWithRelations = {
  id: string;
  createdAt: string;
  teamName: string;
  walletAddress: string;
  members: MemberRow[];
  submission: SubmissionRow | null;
};

const COLORS = {
  submitted: "#22c55e", // green-500
  notSubmitted: "#f59e0b", // amber-500
  openTrack: "#a855f7", // purple-500
  miniapps: "#6366f1", // indigo-500
  humanTech: "#ec4899", // pink-500
  v0: "#06b6d4", // cyan-500
};

export function AdminStats({ teams }: { teams: TeamWithRelations[] }) {
  const submitted = teams.filter((t) => t.submission !== null).length;
  const notSubmitted = teams.length - submitted;

  // Submission status pie chart data
  const submissionStatusData = [
    { name: "Submitted", value: submitted, color: COLORS.submitted },
    { name: "Not Submitted", value: notSubmitted, color: COLORS.notSubmitted },
  ];

  // Track distribution data
  const trackData = [
    {
      name: "Open Track",
      count: teams.filter((t) => t.submission?.trackOpenTrack).length,
      color: COLORS.openTrack,
    },
    {
      name: "MiniApps",
      count: teams.filter((t) => t.submission?.trackFarcasterMiniapp).length,
      color: COLORS.miniapps,
    },
    {
      name: "Human.Tech",
      count: teams.filter((t) => t.submission?.trackSelf).length,
      color: COLORS.humanTech,
    },
    {
      name: "v0",
      count: teams.filter((t) => t.submission?.trackV0).length,
      color: COLORS.v0,
    },
  ];

  // Country distribution - members from teams that submitted
  const submittedTeams = teams.filter((t) => t.submission !== null);
  const countryCount: Record<string, number> = {};
  submittedTeams.forEach((team) => {
    // Count each member from submitted teams
    team.members.forEach((member) => {
      const country = member.country || "Unknown";
      countryCount[country] = (countryCount[country] || 0) + 1;
    });
  });

  const countryData = Object.entries(countryCount)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 8); // Top 8 countries

  // Registration timeline (by day)
  const registrationByDay: Record<string, number> = {};
  teams.forEach((team) => {
    const date = new Date(team.createdAt).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
    registrationByDay[date] = (registrationByDay[date] || 0) + 1;
  });

  const registrationData = Object.entries(registrationByDay)
    .map(([date, count]) => ({ date, registrations: count }))
    .slice(-14); // Last 14 days

  // Submission timeline
  const submissionByDay: Record<string, number> = {};
  submittedTeams.forEach((team) => {
    if (team.submission) {
      const date = new Date(team.submission.createdAt).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
      submissionByDay[date] = (submissionByDay[date] || 0) + 1;
    }
  });

  const submissionTimelineData = Object.entries(submissionByDay)
    .map(([date, count]) => ({ date, submissions: count }))
    .slice(-14);

  return (
    <div className="space-y-8">
      {/* Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <StatCard
          label="Total Teams"
          value={teams.length}
          color="bg-blue-500"
        />
        <StatCard
          label="Submitted"
          value={submitted}
          color="bg-green-500"
          percentage={teams.length > 0 ? Math.round((submitted / teams.length) * 100) : 0}
        />
        <StatCard
          label="Not Submitted"
          value={notSubmitted}
          color="bg-amber-500"
          percentage={teams.length > 0 ? Math.round((notSubmitted / teams.length) * 100) : 0}
        />
        <StatCard
          label="Total Members"
          value={teams.reduce((acc, t) => acc + t.members.length, 0)}
          color="bg-purple-500"
        />
      </div>

      {/* Charts Grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Submission Status Pie Chart */}
        <div className="rounded-xl border border-black/10 bg-white p-6 dark:border-white/10 dark:bg-white/[0.03]">
          <h3 className="text-sm font-semibold mb-4">Submission Status</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={submissionStatusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                  label={({ name, percent }) => `${name} (${((percent ?? 0) * 100).toFixed(0)}%)`}
                >
                  {submissionStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Track Distribution Bar Chart */}
        <div className="rounded-xl border border-black/10 bg-white p-6 dark:border-white/10 dark:bg-white/[0.03]">
          <h3 className="text-sm font-semibold mb-4">Submissions by Track</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={trackData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                <XAxis type="number" allowDecimals={false} />
                <YAxis dataKey="name" type="category" width={80} tick={{ fontSize: 12 }} />
                <Tooltip />
                <Bar dataKey="count" radius={[0, 4, 4, 0]}>
                  {trackData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Registration Timeline */}
        <div className="rounded-xl border border-black/10 bg-white p-6 dark:border-white/10 dark:bg-white/[0.03]">
          <h3 className="text-sm font-semibold mb-4">Registration Timeline</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={registrationData}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                <XAxis dataKey="date" tick={{ fontSize: 10 }} />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="registrations" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Submission Timeline */}
        <div className="rounded-xl border border-black/10 bg-white p-6 dark:border-white/10 dark:bg-white/[0.03]">
          <h3 className="text-sm font-semibold mb-4">Submission Timeline</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={submissionTimelineData}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                <XAxis dataKey="date" tick={{ fontSize: 10 }} />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="submissions" fill="#22c55e" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Country Distribution (Submitted Teams) */}
        {countryData.length > 0 && (
          <div className="rounded-xl border border-black/10 bg-white p-6 dark:border-white/10 dark:bg-white/[0.03] lg:col-span-2">
            <h3 className="text-sm font-semibold mb-4">Members from Submitted Teams by Country (Top 8)</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={countryData}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                  <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Bar dataKey="count" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function StatCard({
  label,
  value,
  color,
  percentage,
}: {
  label: string;
  value: number;
  color: string;
  percentage?: number;
}) {
  return (
    <div className="rounded-xl border border-black/10 bg-white p-4 dark:border-white/10 dark:bg-white/[0.03]">
      <div className="flex items-center gap-3">
        <div className={`h-3 w-3 rounded-full ${color}`} />
        <span className="text-xs font-medium text-black/60 dark:text-white/60">{label}</span>
      </div>
      <div className="mt-2 flex items-baseline gap-2">
        <span className="text-2xl font-bold">{value}</span>
        {percentage !== undefined && (
          <span className="text-sm text-black/50 dark:text-white/50">({percentage}%)</span>
        )}
      </div>
    </div>
  );
}
