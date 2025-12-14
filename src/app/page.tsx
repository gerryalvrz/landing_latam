"use client";

import { useState } from "react";
import {
  GlobeIcon,
  LightningBoltIcon,
  RocketIcon,
  StarIcon,
} from "@radix-ui/react-icons";

import { Faq } from "@/components/faq";
import { MilestoneModal } from "@/components/milestones/MilestoneModal";
import RegisterButton from "@/components/register/RegisterButton";
import { Container, Section, SectionHeader } from "@/components/section";
import { ThemeToggle } from "@/components/theme-toggle";
import {
  Card,
  ChecklistItem,
  MobileNav,
  RuleItem,
  Stat,
} from "@/components/home/home-ui";
import { ButtonLink } from "@/components/ui/button";
import { cn } from "@/lib/cn";
import {
  COMMUNITIES,
  FAQ,
  HIGHLIGHTS,
  INFO,
  MILESTONES,
  NAV_LINKS,
  TIMELINE,
  TRACKS,
  type MilestoneType,
} from "@/app/home-content";

export default function Home() {
  const [selectedMilestone, setSelectedMilestone] = useState<{
    step: string;
    type: MilestoneType;
  } | null>(null);
  const iconByKey = {
    rocket: <RocketIcon className="h-5 w-5" />,
    globe: <GlobeIcon className="h-5 w-5" />,
    star: <StarIcon className="h-5 w-5" />,
    bolt: <LightningBoltIcon className="h-5 w-5" />,
  } as const;

  return (
    <div className="min-h-dvh bg-background text-foreground">
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute -top-24 left-1/2 h-[28rem] w-[28rem] -translate-x-1/2 rounded-full bg-[var(--celo-yellow-weak)] blur-3xl dark:bg-white/[0.08]" />
        <div className="absolute bottom-[-10rem] right-[-8rem] h-[26rem] w-[26rem] rounded-full bg-black/[0.03] blur-3xl dark:bg-white/[0.06]" />
      </div>

      <header className="sticky top-0 z-20 border-b border-black/5 bg-background/80 backdrop-blur-xl dark:border-white/10">
        <Container className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-lg bg-[var(--celo-yellow)] text-black shadow-sm transition-transform hover:scale-105">
              <span className="text-sm font-bold">LB</span>
            </div>
            <div className="leading-tight">
              <div className="text-sm font-semibold tracking-tight">{INFO.name}</div>
              <div className="text-xs text-black/60 dark:text-white/60">
                Buildathon • LATAM
              </div>
            </div>
          </div>

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
            <div className="grid gap-10 lg:grid-cols-12 lg:items-center">
              <div className="lg:col-span-7">
                <div className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white/80 px-4 py-2 text-sm font-medium text-black/70 shadow-sm dark:border-white/15 dark:bg-white/[0.03] dark:text-white/70">
                  <span className="relative inline-flex h-2.5 w-2.5">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500"></span>
                  </span>
                  Pre-registrations: Dec 15, 2025 → Jan 16, 2026
                </div>
                <h1 className="mt-6 text-balance text-4xl font-title font-[200] leading-[1.1] tracking-tight sm:text-6xl sm:leading-[1.1]">
                  {INFO.tagline}
                </h1>
                <p className="mt-6 max-w-2xl text-pretty text-lg leading-[1.75] text-black/70 dark:text-white/70">
                  {INFO.subtag}
                </p>

                <div className="mt-6 pt-6 border-t border-black/10 dark:border-white/10">
                  <div className="text-xs font-medium text-black/60 dark:text-white/60 mb-2">
                    Supported by regional communities
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {COMMUNITIES.map((community) =>
                      community.url ? (
                        <a
                          key={community.name}
                          href={community.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs px-3 py-1.5 rounded-full border border-black/10 bg-white/60 text-black/70 shadow-sm hover:bg-white/80 hover:text-black hover:shadow dark:border-white/15 dark:bg-white/[0.03] dark:text-white/70 dark:hover:bg-white/[0.06] dark:hover:text-white transition-all"
                        >
                          {community.name}
                        </a>
                      ) : (
                        <span
                          key={community.name}
                          className="text-xs px-3 py-1.5 rounded-full border border-black/10 bg-white/40 text-black/50 dark:border-white/10 dark:bg-white/[0.02] dark:text-white/50"
                        >
                          {community.name}
                        </span>
                      ),
                    )}
                  </div>
                </div>

                <div className="mt-10 grid gap-3 sm:grid-cols-3">
                  <Stat label="Buildathon" value="Jan 19 → Feb 27, 2026" />
                  <Stat label="Winners" value="Mar 6, 2026" />
                  <Stat label="Region" value="Latin America" />
                </div>

                <div className="mt-3 grid gap-3 sm:grid-cols-3">
                  <Stat label="1st place" value="TBA" />
                  <Stat label="2nd place" value="TBA" />
                  <Stat label="3rd place" value="TBA" />
                </div>

                <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
                  <RegisterButton
                    label="Apply now"
                    variant="primary"
                    className="shadow-lg shadow-[var(--celo-yellow)]/20"
                  />
                  <ButtonLink variant="secondary" href="#schedule">
                    View schedule
                  </ButtonLink>
                  <ButtonLink
                    variant="ghost"
                    href={INFO.discordUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group"
                  >
                    Join community{" "}
                    <span className="inline-block transition-transform group-hover:translate-x-1">
                      →
                    </span>
                  </ButtonLink>
                </div>
              </div>

              <div className="lg:col-span-5 space-y-4">
                <Card className="group rounded-2xl p-6 transition-all hover:shadow-lg hover:shadow-black/5 dark:hover:shadow-white/5">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="text-base font-semibold">Designed for shipping</div>
                      <p className="mt-2 text-sm leading-relaxed text-black/70 dark:text-white/70">
                        Clear milestones, strong feedback loops, and a community that pushes you to finish.
                      </p>
                    </div>
                    <div className="grid h-11 w-11 shrink-0 place-items-center rounded-lg bg-foreground text-background transition-transform group-hover:scale-110">
                      <LightningBoltIcon className="h-5 w-5" />
                    </div>
                  </div>

                  <div className="mt-5 grid gap-3 grid-cols-2">
                    {HIGHLIGHTS.map((h) => (
                      <div key={h.title} className="flex items-start gap-2">
                        <div className="mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-black/[0.05] text-foreground dark:bg-white/[0.08]">
                          {iconByKey[h.icon]}
                        </div>
                        <div>
                          <div className="text-xs font-semibold">{h.title}</div>
                          <p className="mt-0.5 text-xs leading-5 text-black/70 dark:text-white/70">
                            {h.description}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>

                <Card className="group rounded-2xl p-6 transition-all hover:shadow-lg hover:shadow-black/5 dark:hover:shadow-white/5">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="text-base font-semibold">Your deliverable</div>
                      <p className="mt-2 text-sm leading-relaxed text-black/70 dark:text-white/70">
                        A Karma Gap project link containing your GitHub repo, deck, and demo.
                      </p>
                    </div>
                    <div className="grid h-11 w-11 shrink-0 place-items-center rounded-lg bg-foreground text-background transition-transform group-hover:scale-110">
                      <RocketIcon className="h-5 w-5" />
                    </div>
                  </div>

                  <div className="mt-5 space-y-3 text-sm">
                    <ChecklistItem>Register using the form in this website</ChecklistItem>
                    <ChecklistItem>Mark milestones as completed in this website</ChecklistItem>
                    <ChecklistItem>Submit your project by end of Buildathon</ChecklistItem>
                  </div>

                  <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                    <ButtonLink className="w-full sm:w-auto" href={INFO.applyUrl}>
                      Get started
                    </ButtonLink>
                    <ButtonLink
                      className="w-full sm:w-auto"
                      variant="secondary"
                      href={INFO.rulesUrl}
                    >
                      Rules
                    </ButtonLink>
                  </div>
                </Card>
              </div>
            </div>
          </Container>
        </Section>

        <Section id="schedule" className="scroll-mt-20">
          <Container>
            <SectionHeader
              title="Dates that matter."
              description="Pre-register, build during the official window, and submit before the deadline."
            />

            <div className="mt-10 grid gap-4 lg:grid-cols-3">
              {TIMELINE.map((t) => (
                <Card key={t.title} className="group p-6 transition-all hover:shadow-lg hover:shadow-black/5 dark:hover:shadow-white/5">
                  <div className="text-base font-semibold">{t.title}</div>
                  <div className="mt-2 text-sm font-medium text-black/70 dark:text-white/70">
                    {t.range}
                  </div>
                  <div className="mt-3 text-sm leading-relaxed text-black/60 dark:text-white/60">
                    {t.note}
                  </div>
                </Card>
              ))}
            </div>
          </Container>
        </Section>

        <Section id="rules" className="scroll-mt-20">
          <Container>
            <SectionHeader
              title="Rules & requirements"
              description="Make sure your project meets these requirements before final submission."
            />

            <Card className="mt-10 border-[color:var(--celo-border)] bg-background/70 p-5">
              <div className="text-sm font-semibold text-foreground">Rules</div>
              <ul className="mt-3 space-y-2 text-sm text-foreground">
                <li>
                  <RuleItem>
                    Submit via form, include a{" "}
                    <span className="font-medium">Karma Gap project link</span> with{" "}
                    <span className="font-medium">GitHub repo</span>,{" "}
                    <span className="font-medium">deck</span>, and{" "}
                    <span className="font-medium">demo</span>.
                  </RuleItem>
                </li>
                <li>
                  <RuleItem>
                    Projects must be <span className="font-medium">deployed on Celo Mainnet</span>.
                  </RuleItem>
                </li>
                <li>
                  <RuleItem>
                    Projects must have a <span className="font-medium">live public URL</span> for the demo.
                  </RuleItem>
                </li>
                <li>
                  <RuleItem>
                    GitHub repos should have <span className="font-medium">no code</span> before the
                    buildathon start date (<span className="font-medium">2026-01-19</span>).
                    Only README, LICENSE, and .gitignore files are allowed.
                  </RuleItem>
                </li>
              </ul>
              <div className="mt-3 text-xs text-[color:var(--celo-muted)]">
                Notes: you can register without a GitHub repo and add it later. For final submission, ensure your
                project is deployed on Celo Mainnet and your Karma Gap profile contains all required links.
              </div>
            </Card>
          </Container>
        </Section>

        <Section id="tracks" className="scroll-mt-20">
          <Container>
            <SectionHeader
              title="Pick your track(s)."
              description="You can apply to as many tracks as you want. Pick the tracks that best match your app and integrations."
            />

            <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {TRACKS.map((t) => (
                <Card
                  key={t.title}
                  className={cn(
                    "group p-6 transition-all hover:shadow-lg hover:shadow-black/5 dark:hover:shadow-white/5",
                    t.title === "Open Track"
                      ? "border-[color:var(--celo-yellow)]/40 ring-2 ring-[color:var(--celo-yellow-weak)] dark:ring-[color:var(--celo-yellow)]/30"
                      : undefined,
                  )}
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="text-base font-semibold">{t.title}</div>
                    {t.title === "Open Track" ? (
                      <span className="rounded-full border border-[color:var(--celo-yellow)]/50 bg-[var(--celo-yellow-weak)] px-2.5 py-1 text-[11px] font-semibold text-foreground shadow-sm">
                        Recommended
                      </span>
                    ) : null}
                  </div>
                  <p className="mt-3 text-sm leading-relaxed text-black/70 dark:text-white/70">
                    {t.description}
                  </p>
                </Card>
              ))}
            </div>
          </Container>
        </Section>

        <Section id="milestones" className="scroll-mt-20">
          <Container>
            <SectionHeader
              title="Milestones & points"
              description="Buildathon is milestone-based. Each milestone is worth Celo Mainnet points."
            />

            <div className="mt-10 overflow-hidden rounded-xl border border-border bg-background/70 backdrop-blur dark:border-[color:var(--celo-border)] dark:bg-white/[0.03]">
              <div className="grid grid-cols-12 gap-0 border-b border-border bg-[var(--celo-yellow-weak)] px-4 py-3 text-xs font-semibold text-foreground dark:border-[color:var(--celo-border)]">
                <div className="col-span-8 sm:col-span-9">Milestone</div>
                <div className="col-span-4 sm:col-span-3 text-right">Points</div>
              </div>
              <div className="divide-y divide-border dark:divide-[color:var(--celo-border)]">
                {MILESTONES.map((m) => (
                  <button
                    key={m.step}
                    onClick={() => setSelectedMilestone({ step: m.step, type: m.type })}
                    className="grid w-full grid-cols-12 px-4 py-3 text-left transition-colors hover:bg-black/[0.03] dark:hover:bg-white/[0.06]"
                  >
                    <div className="col-span-8 sm:col-span-9 text-sm text-black/80 dark:text-white/80">
                      {m.step}
                    </div>
                    <div className="col-span-4 sm:col-span-3 text-right text-sm font-medium">
                      {m.points}{" "}
                      <span className="text-[color:var(--celo-muted)]">{m.unit}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <p className="mt-4 text-center text-sm text-black/60 dark:text-white/60">
              Click on any milestone to submit your progress
            </p>
          </Container>
        </Section>

        <Section id="apply" className="scroll-mt-20">
          <Container>
            <div className="rounded-2xl border border-black/10 bg-foreground p-8 text-background shadow-lg dark:border-white/10">
              <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <div className="text-base font-semibold">Ready to build?</div>
                  <p className="mt-2 text-sm leading-relaxed text-background/80">
                    Applications take ~2 minutes. Spots are limited.
                  </p>
                </div>
                <div className="flex flex-col gap-3 sm:flex-row">
                  <RegisterButton
                    label="Apply now"
                    variant="primary"
                    className="bg-white text-black shadow-md hover:opacity-95 hover:shadow-lg"
                  />
                  <ButtonLink
                    href={INFO.discordUrl}
                    variant="secondary"
                    className="border-white/25 bg-transparent text-white hover:bg-white/10"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Join community
                  </ButtonLink>
                </div>
              </div>
            </div>
          </Container>
        </Section>

        <Section id="community" className="scroll-mt-20">
          <Container>
            <SectionHeader
              title="Build with people who ship."
              description="Share progress, find collaborators, and get help unblocked. Replace the links below with your real Discord/community URLs."
            />

            <div className="mt-10 flex flex-col gap-3 sm:flex-row">
              <ButtonLink href={INFO.discordUrl} target="_blank" rel="noopener noreferrer">
                Join Discord
              </ButtonLink>
              <RegisterButton label="Register" variant="secondary" />
            </div>
          </Container>
        </Section>

        <Section id="faq" className="scroll-mt-20">
          <Container>
            <SectionHeader
              title="Everything you need to know."
              description="If you have more questions, link your Discord / email here."
            />
            <div className="mt-10">
              <Faq items={FAQ} />
            </div>
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
              <div className="flex items-center gap-5 text-sm">
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
                  href="https://www.radix-ui.com/primitives/docs/overview/introduction"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Radix
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

      <MilestoneModal
        isOpen={selectedMilestone !== null}
        onClose={() => setSelectedMilestone(null)}
        milestone={selectedMilestone || { step: "", type: "registration" }}
      />
    </div>
  );
}
