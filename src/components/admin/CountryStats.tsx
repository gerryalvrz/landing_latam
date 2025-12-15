"use client";

type CountryDistribution = {
  country: string;
  count: number;
  percentage: number;
};

type CountryStatsProps = {
  members: Array<{ country: string | null }>;
};

export function CountryStats({ members }: CountryStatsProps) {
  // Calculate country distribution
  const countryMap = new Map<string, number>();
  let totalMembers = 0;

  members.forEach((member) => {
    if (member.country) {
      totalMembers++;
      const current = countryMap.get(member.country) || 0;
      countryMap.set(member.country, current + 1);
    }
  });

  // Convert to array and sort by count (descending)
  const distribution: CountryDistribution[] = Array.from(countryMap.entries())
    .map(([country, count]) => ({
      country,
      count,
      percentage: totalMembers > 0 ? (count / totalMembers) * 100 : 0,
    }))
    .sort((a, b) => b.count - a.count);

  if (distribution.length === 0) {
    return (
      <div className="rounded-lg border border-black/10 bg-white p-6 dark:border-white/10 dark:bg-white/[0.03]">
        <h3 className="mb-4 text-lg font-semibold">Country Distribution</h3>
        <p className="text-sm text-black/60 dark:text-white/60">
          No country data available yet
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-black/10 bg-white p-6 dark:border-white/10 dark:bg-white/[0.03]">
      <div className="mb-4">
        <h3 className="text-lg font-semibold">Country Distribution</h3>
        <p className="mt-1 text-sm text-black/60 dark:text-white/60">
          Total members: {totalMembers} across {distribution.length} countries
        </p>
      </div>

      <div className="space-y-3">
        {distribution.map((item) => (
          <div key={item.country} className="space-y-1">
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium text-black/80 dark:text-white/80">
                {item.country}
              </span>
              <div className="flex items-center gap-2">
                <span className="text-black/60 dark:text-white/60">
                  {item.count} {item.count === 1 ? "member" : "members"}
                </span>
                <span className="min-w-[3rem] text-right font-semibold text-black/80 dark:text-white/80">
                  {item.percentage.toFixed(1)}%
                </span>
              </div>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-black/5 dark:bg-white/10">
              <div
                className="h-full rounded-full bg-gradient-to-r from-blue-500 to-purple-500"
                style={{ width: `${item.percentage}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 grid grid-cols-2 gap-4 rounded-lg border border-black/10 bg-black/[0.02] p-4 dark:border-white/10 dark:bg-white/[0.02] sm:grid-cols-3">
        <div>
          <div className="text-xs text-black/60 dark:text-white/60">
            Total Countries
          </div>
          <div className="mt-1 text-2xl font-bold">{distribution.length}</div>
        </div>
        <div>
          <div className="text-xs text-black/60 dark:text-white/60">
            Total Members
          </div>
          <div className="mt-1 text-2xl font-bold">{totalMembers}</div>
        </div>
        <div className="col-span-2 sm:col-span-1">
          <div className="text-xs text-black/60 dark:text-white/60">
            Top Country
          </div>
          <div className="mt-1 truncate text-lg font-bold">
            {distribution[0].country}
          </div>
          <div className="text-xs text-black/60 dark:text-white/60">
            {distribution[0].count} members ({distribution[0].percentage.toFixed(1)}%)
          </div>
        </div>
      </div>
    </div>
  );
}
