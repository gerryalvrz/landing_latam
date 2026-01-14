"use client";

import Image from "next/image";
import Link from "next/link";
import { Container, Section, SectionHeader } from "@/components/section";
import { ThemeToggle } from "@/components/theme-toggle";
import { Card, MobileNav } from "@/components/home/home-ui";
import Squares from "@/components/home/Squares";
import RegisterButton from "@/components/register/RegisterButton";
import { INFO, NAV_LINKS, COMMUNITIES } from "@/app/home-content";

export default function SponsorshipGuidePage() {
  return (
    <div className="min-h-dvh bg-background text-foreground">
      <div className="pointer-events-none fixed inset-0 z-0">
        <Squares
          direction="diagonal"
          speed={0.5}
          squareSize={40}
          className="opacity-24"
        />
      </div>

      <header className="sticky top-0 z-20 border-b border-black/5 bg-background/80 backdrop-blur-xl dark:border-white/10">
        <Container className="flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-3 transition-opacity hover:opacity-80">
            <div className="relative h-10 w-10 overflow-hidden rounded-lg bg-[var(--celo-yellow)] shadow-sm ring-1 ring-black/5 transition-transform hover:scale-105 dark:ring-white/10">
              <Image
                src="/brand/Celo_Favicon.png"
                alt="Celo logo"
                fill
                sizes="40px"
                className="object-contain"
                priority
              />
            </div>
            <div className="leading-tight">
              <div className="text-sm font-semibold tracking-tight">{INFO.name}</div>
              <div className="text-xs text-black/60 dark:text-white/60">
                Buildathon • LATAM
              </div>
            </div>
          </Link>

          <nav className="hidden items-center gap-6 text-sm text-black/70 dark:text-white/70 md:flex">
            {NAV_LINKS.map((l) => (
              <a key={l.href} className="transition-colors hover:text-foreground" href={l.href}>
                {l.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <MobileNav links={NAV_LINKS} />
            <RegisterButton label="Apply" variant="secondary" size="sm" />
            <ThemeToggle />
          </div>
        </Container>
      </header>

      <main>
        <Section className="pt-14 sm:pt-20">
          <Container>
            <SectionHeader
              eyebrow="Human.tech × Celo LATAM Buildathon"
              title="Collaboration Execution Guidelines"
              description="These guidelines define the operational flow, financial handling, and coordination responsibilities for the $1,000 USD sponsorship provided by Human.tech to the Celo LATAM Buildathon."
            />
          </Container>
        </Section>

        <Section>
          <Container>
            <div className="grid gap-6 md:grid-cols-2">
              <Card className="p-8">
                <div className="text-base font-semibold">1. Purpose</div>
                <p className="mt-4 text-sm leading-relaxed text-black/70 dark:text-white/70">
                  These guidelines define the operational flow, financial handling, and coordination
                  responsibilities for the{" "}
                  <span className="font-semibold">$1,000 USD sponsorship</span> provided by Human.tech to
                  the Celo LATAM Buildathon. The goal is to ensure clarity, accountability, and transparent
                  execution for all parties involved.
                </p>
              </Card>

              <Card className="p-8">
                <div className="text-base font-semibold">2. Sponsorship Scope</div>
                <p className="mt-4 text-sm leading-relaxed text-black/70 dark:text-white/70">
                  Human.tech is sponsoring the Buildathon with{" "}
                  <span className="font-semibold">$1,000 USD</span>, earmarked exclusively for:
                </p>
                <ul className="mt-4 space-y-2 text-sm leading-relaxed text-black/70 dark:text-white/70">
                  <li className="flex gap-2">
                    <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-[var(--celo-yellow)]" />
                    <span>Builder rewards (prizes for winning teams)</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-[var(--celo-yellow)]" />
                    <span>
                      Optional mentoring, workshops, or educational resources provided by Human.tech
                    </span>
                  </li>
                </ul>
              </Card>
            </div>
          </Container>
        </Section>

        <Section>
          <Container>
            <SectionHeader
              title="3. Fund Handling — Available Options"
              description="Human.tech may choose one of the following options for managing the sponsorship funds."
            />

            <div className="mt-10 grid gap-6 md:grid-cols-2">
              <Card className="p-8">
                <div className="text-base font-semibold">Option A — Human.tech Custody</div>
                <p className="mt-4 text-sm leading-relaxed text-black/70 dark:text-white/70">
                  Human.tech retains custody of the $1,000 USD. Human.tech commits to:
                </p>
                <ul className="mt-4 space-y-2 text-sm leading-relaxed text-black/70 dark:text-white/70">
                  <li className="flex gap-2">
                    <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-[var(--celo-yellow)]" />
                    <span>Disbursing prizes directly to the selected winners</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-[var(--celo-yellow)]" />
                    <span>
                      Aligning on prize structure, timing, and delivery format with the Celo LATAM team
                    </span>
                  </li>
                  <li className="flex gap-2">
                    <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-[var(--celo-yellow)]" />
                    <span>
                      Sharing proof of payout (transaction hash, receipt, or confirmation) after
                      disbursement for reporting and transparency
                    </span>
                  </li>
                </ul>
              </Card>

              <Card className="p-8">
                <div className="text-base font-semibold">Option B — Celo LATAM Treasury Custody</div>
                <p className="mt-4 text-sm leading-relaxed text-black/70 dark:text-white/70">
                  Human.tech transfers the full $1,000 USD to the Celo LATAM treasury. The Celo LATAM team
                  will:
                </p>
                <ul className="mt-4 space-y-2 text-sm leading-relaxed text-black/70 dark:text-white/70">
                  <li className="flex gap-2">
                    <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-[var(--celo-yellow)]" />
                    <span>Hold the funds in custody</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-[var(--celo-yellow)]" />
                    <span>Coordinate prize disbursement transparently with Human.tech</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-[var(--celo-yellow)]" />
                    <span>
                      Share a clear breakdown of payouts and on-chain/off-chain confirmations after
                      execution
                    </span>
                  </li>
                </ul>
                <div className="mt-6 rounded-lg border border-black/10 bg-black/[0.02] p-4 dark:border-white/10 dark:bg-white/[0.02]">
                  <div className="text-xs font-semibold text-black/60 dark:text-white/60">
                    Treasury Address (for Option B):
                  </div>
                  <code className="mt-2 block rounded bg-black/[0.04] px-3 py-2 text-xs font-mono text-black/80 dark:bg-white/[0.06] dark:text-white/80">
                    0xb81e33b770d5B2858263484Fe27D7015e5Fd15C1
                  </code>
                </div>
              </Card>
            </div>

            <Card className="mt-6 border-[color:var(--celo-yellow)]/30 bg-[var(--celo-yellow-weak)] p-6">
              <p className="text-sm leading-relaxed text-black/80 dark:text-white/80">
                <span className="font-semibold">Note:</span> Human.tech should confirm the selected option
                explicitly with the Celo LATAM team before proceeding.
              </p>
            </Card>
          </Container>
        </Section>

        <Section>
          <Container>
            <SectionHeader
              title="4. Coordination & Execution"
              description="Regardless of the selected fund-handling option, both parties will coordinate on the following areas."
            />

            <Card className="mt-10 p-8">
              <div className="grid gap-6 sm:grid-cols-2">
                <div>
                  <div className="text-sm font-semibold">Prize Structure</div>
                  <p className="mt-2 text-sm leading-relaxed text-black/70 dark:text-white/70">
                    Number of winners, amounts, and criteria
                  </p>
                </div>
                <div>
                  <div className="text-sm font-semibold">Timeline</div>
                  <p className="mt-2 text-sm leading-relaxed text-black/70 dark:text-white/70">
                    Announcement, judging, and payout dates
                  </p>
                </div>
                <div>
                  <div className="text-sm font-semibold">Mentorship</div>
                  <p className="mt-2 text-sm leading-relaxed text-black/70 dark:text-white/70">
                    Optional participation by Human.tech in office hours, workshops, and technical
                    mentoring sessions
                  </p>
                </div>
                <div>
                  <div className="text-sm font-semibold">Educational Resources</div>
                  <p className="mt-2 text-sm leading-relaxed text-black/70 dark:text-white/70">
                    Documentation, tooling, credits, or learning material Human.tech wishes to provide to
                    builders
                  </p>
                </div>
                <div>
                  <div className="text-sm font-semibold">Judging</div>
                  <p className="mt-2 text-sm leading-relaxed text-black/70 dark:text-white/70">
                    Optional participation by Human.tech in judging Human.Tech track. If Human.tech chooses to handle
                    judging, they will coordinate with the Celo LATAM team on criteria and process.
                  </p>
                </div>
              </div>
              <div className="mt-6 rounded-lg border border-black/10 bg-black/[0.02] p-4 dark:border-white/10 dark:bg-white/[0.02]">
                <p className="text-sm leading-relaxed text-black/70 dark:text-white/70">
                  All activities should be aligned in advance by both teams to avoid last-minute changes.
                </p>
              </div>
            </Card>
          </Container>
        </Section>

        <Section>
          <Container>
            <SectionHeader
              title="5. Transparency & Reporting"
              description="Post-Buildathon, the following information will be shared with both teams for transparency and accountability."
            />

            <Card className="mt-10 p-8">
              <ul className="space-y-3 text-sm leading-relaxed text-black/70 dark:text-white/70">
                <li className="flex gap-2">
                  <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-[var(--celo-yellow)]" />
                  <span>Final list of winners</span>
                </li>
                <li className="flex gap-2">
                  <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-[var(--celo-yellow)]" />
                  <span>Prize allocation summary</span>
                </li>
                <li className="flex gap-2">
                  <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-[var(--celo-yellow)]" />
                  <span>Confirmation of fund disbursement</span>
                </li>
                <li className="flex gap-2">
                  <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-[var(--celo-yellow)]" />
                  <span>
                    Summary of mentoring or educational contributions from Human.tech (if applicable)
                  </span>
                </li>
              </ul>
              <div className="mt-6 rounded-lg border border-black/10 bg-black/[0.02] p-4 dark:border-white/10 dark:bg-white/[0.02]">
                <p className="text-sm leading-relaxed text-black/70 dark:text-white/70">
                  This information may be used for internal reporting and public recap content, subject to
                  mutual agreement between Human.tech and the Celo LATAM organizers.
                </p>
              </div>
            </Card>
          </Container>
        </Section>
      </main>

      <footer className="border-t border-black/5 py-12 dark:border-white/10">
        <Container>
          <div className="flex flex-col gap-8">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="text-sm text-black/60 dark:text-white/60">
                © {new Date().getFullYear()} {INFO.name}. Built for LATAM builders.
              </div>
              <div className="flex flex-wrap items-center gap-5 text-sm">
                {NAV_LINKS.filter((l) => l.href !== "#prizes").map((l) => (
                  <a
                    key={l.href}
                    className="text-black/70 transition-colors hover:text-foreground dark:text-white/70"
                    href={l.href}
                  >
                    {l.label}
                  </a>
                ))}
                <a
                  className="text-black/70 transition-colors hover:text-foreground dark:text-white/70"
                  href="/terms"
                >
                  Terms & Conditions
                </a>
                <a
                  className="text-black/70 transition-colors hover:text-foreground dark:text-white/70"
                  href="/privacy"
                >
                  Privacy Policy
                </a>
              </div>
            </div>

            <div className="flex flex-col gap-3 border-t border-black/5 pt-6 dark:border-white/10">
              <div className="text-xs font-semibold uppercase tracking-wider text-black/60 dark:text-white/60">
                Regional Celo Communities
              </div>
              <div className="flex flex-wrap gap-3 text-sm">
                {COMMUNITIES.map((community) =>
                  community.url ? (
                    <a
                      key={community.name}
                      href={community.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-black/70 transition-colors hover:text-foreground hover:underline dark:text-white/70"
                    >
                      {community.name}
                    </a>
                  ) : (
                    <span key={community.name} className="text-black/50 dark:text-white/50">
                      {community.name}
                    </span>
                  ),
                )}
              </div>
            </div>
          </div>
        </Container>
      </footer>
    </div>
  );
}
