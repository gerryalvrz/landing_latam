"use client";

import Image from "next/image";
import Link from "next/link";
import {
  GlobeIcon,
  LightningBoltIcon,
  RocketIcon,
  StarIcon,
} from "@radix-ui/react-icons";

import { Faq } from "@/components/faq";
import RegisterButton from "@/components/register/RegisterButton";
import SubmitButton from "@/components/submit/SubmitButton";
import EditTeamButton from "@/components/edit-team/EditTeamButton";
import { Container, Section, SectionHeader } from "@/components/section";
import { ThemeToggle } from "@/components/theme-toggle";
import {
  Card,
  ChecklistItem,
  MobileNav,
  RuleItem,
  Stat,
} from "@/components/home/home-ui";
import Squares from "@/components/home/Squares";
import { ButtonLink } from "@/components/ui/button";
import { SquaresButtonLink } from "@/components/ui/squares-button-link";
import { cn } from "@/lib/cn";
import {
  COMMUNITIES,
  FAQ,
  HIGHLIGHTS,
  INFO,
  NAV_LINKS,
  RESOURCES,
  SPONSORS,
  TIMELINE,
  TRACKS,
} from "@/app/home-content";

export default function Home() {
  const iconByKey = {
    rocket: <RocketIcon className="h-5 w-5" />,
    globe: <GlobeIcon className="h-5 w-5" />,
    star: <StarIcon className="h-5 w-5" />,
    bolt: <LightningBoltIcon className="h-5 w-5" />,
  } as const;

  return (
    <div className="min-h-dvh bg-background text-foreground overflow-x-hidden">
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
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
          <div className="relative overflow-hidden">
            <Container className="relative z-10">
              <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-[1.1fr,0.9fr] items-center lg:gap-12">
                <div className="max-w-3xl">
                  <div className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white/80 px-3 py-2 text-xs sm:text-sm sm:px-4 font-medium text-black/70 shadow-sm dark:border-white/15 dark:bg-white/[0.03] dark:text-white/70">
                    <span className="relative inline-flex h-2.5 w-2.5 shrink-0">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500"></span>
                    </span>
                    <span className="whitespace-nowrap">Pre-registrations: Dec 18, 2025 → Jan 16, 2026</span>
                  </div>
                  <h1 className="mt-8 text-balance text-4xl font-title font-[200] leading-[1.1] tracking-tight sm:text-6xl sm:leading-[1.1]">
                    {INFO.tagline}
                  </h1>
                  <p className="mt-8 max-w-2xl text-pretty text-lg leading-[1.75] text-black/70 dark:text-white/70">
                    {INFO.subtag}
                  </p>

                  <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center">
                    <RegisterButton
                      label="Pre-register now"
                      variant="primary"
                      withSquares
                      autoOpen
                      className="shadow-lg shadow-[var(--celo-yellow)]/20"
                    />
                    <SquaresButtonLink variant="secondary" href="#schedule">
                      View schedule
                    </SquaresButtonLink>
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

                  <div className="mt-8 pt-8 border-t border-black/10 dark:border-white/10">
                    <div className="mb-2 text-xs font-medium text-black/60 dark:text-white/60">
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
                </div>

                <div className="relative w-full max-w-[520px] justify-self-end overflow-hidden rounded-3xl border border-black/10 bg-white/70 shadow-xl ring-1 ring-black/5 dark:border-white/10 dark:bg-white/[0.05] dark:ring-white/5 sm:mx-auto lg:mx-0 self-center aspect-[16/9]">
                  <Image
                    src="/hero/latambuildathon.png"
                    alt="Latam Buildathon visual"
                    fill
                    sizes="(min-width: 1024px) 560px, 100vw"
                    className="object-contain"
                    priority
                  />
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-black/10 via-transparent to-white/10 dark:from-black/40 dark:via-black/25 dark:to-transparent" />
                </div>
              </div>

              <div className="mt-12 grid gap-3 sm:gap-4 grid-cols-2 sm:grid-cols-3">
                <Stat label="Buildathon" value="Jan 19 → Feb 27, 2026" />
                <Stat label="Winners" value="Mar 6, 2026" />
                <Stat label="Region" value="Latin America" />
              </div>

              <div className="mt-3 sm:mt-4 grid gap-3 sm:gap-4 grid-cols-3">
                <Stat label="1st place" value="TBA" />
                <Stat label="2nd place" value="TBA" />
                <Stat label="3rd place" value="TBA" />
              </div>

              <div className="mt-16 grid gap-6 sm:grid-cols-2">
                <Card className="group rounded-2xl p-8 transition-all hover:shadow-lg hover:shadow-black/5 dark:hover:shadow-white/5">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="text-base font-semibold">Designed for shipping</div>
                      <p className="mt-3 text-sm leading-relaxed text-black/70 dark:text-white/70">
                        Clear milestones, strong feedback loops, and a community that pushes you to finish.
                      </p>
                    </div>
                    <div className="grid h-11 w-11 shrink-0 place-items-center rounded-lg bg-foreground text-background transition-transform group-hover:scale-110">
                      <LightningBoltIcon className="h-5 w-5" />
                    </div>
                  </div>

                  <div className="mt-6 grid gap-4 grid-cols-1 sm:grid-cols-2">
                    {HIGHLIGHTS.map((h) => (
                      <div key={h.title} className="flex items-start gap-2">
                        <div className="mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-black/[0.05] text-foreground dark:bg-white/[0.08]">
                          {iconByKey[h.icon]}
                        </div>
                        <div className="min-w-0">
                          <div className="text-xs font-semibold">{h.title}</div>
                          <p className="mt-0.5 text-xs leading-5 text-black/70 dark:text-white/70">
                            {h.description}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>

                <Card className="group rounded-2xl p-8 transition-all hover:shadow-lg hover:shadow-black/5 dark:hover:shadow-white/5">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="text-base font-semibold">Your deliverable</div>
                      <p className="mt-3 text-sm leading-relaxed text-black/70 dark:text-white/70">
                        A Karma Gap project link containing your GitHub repo, deck, and demo.
                      </p>
                    </div>
                    <div className="grid h-11 w-11 shrink-0 place-items-center rounded-lg bg-foreground text-background transition-transform group-hover:scale-110">
                      <RocketIcon className="h-5 w-5" />
                    </div>
                  </div>

                  <div className="mt-6 space-y-3 text-sm">
                    <ChecklistItem>Register using the form in this website</ChecklistItem>
                    <ChecklistItem>Mark milestones as completed in this website</ChecklistItem>
                    <ChecklistItem>Submit your project by end of Buildathon</ChecklistItem>
                  </div>

                  <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                    <RegisterButton
                      label="Pre-register now"
                      variant="primary"
                      withSquares
                      className="w-full sm:w-auto"
                    />
                    <SquaresButtonLink
                      className="w-full sm:w-auto"
                      variant="secondary"
                      href={INFO.rulesUrl}
                    >
                      Rules
                    </SquaresButtonLink>
                  </div>
                </Card>
              </div>

              <div className="mt-10">
                <div className="text-base font-semibold text-center mb-6">Sponsors</div>
                <div className="grid gap-4 sm:grid-cols-3">
                  {SPONSORS.map((sponsor) => {
                    if (sponsor.website) {
                      return (
                        <Link
                          key={sponsor.name}
                          href={sponsor.website}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <Card className="group p-6 text-center transition-all hover:shadow-lg hover:shadow-black/5 dark:hover:shadow-white/5 cursor-pointer">
                            <div className="text-base font-semibold">{sponsor.name}</div>
                          </Card>
                        </Link>
                      );
                    }
                    return (
                      <Card
                        key={sponsor.name}
                        className="group p-6 text-center transition-all hover:shadow-lg hover:shadow-black/5 dark:hover:shadow-white/5"
                      >
                        <div className="text-base font-semibold">{sponsor.name}</div>
                      </Card>
                    );
                  })}
                </div>
              </div>
            </Container>
          </div>
        </Section>

        <Section id="schedule" className="scroll-mt-20">
          <Container>
            <SectionHeader
              title="Dates that matter."
              description="Pre-register, build during the official window, and submit before the deadline."
            />

            <div className="mt-10 grid gap-6 lg:grid-cols-3">
              {TIMELINE.map((t) => (
                <Card key={t.title} className="group p-8 transition-all hover:shadow-lg hover:shadow-black/5 dark:hover:shadow-white/5">
                  <div className="text-base font-semibold">{t.title}</div>
                  <div className="mt-3 text-sm font-medium text-black/70 dark:text-white/70">
                    {t.range}
                  </div>
                  <div className="mt-4 text-sm leading-relaxed text-black/60 dark:text-white/60">
                    {t.note}
                  </div>
                </Card>
              ))}
            </div>

            {/* Timezone Disclosure */}
            <div className="mt-16 rounded-2xl border border-amber-500/30 bg-amber-500/5 p-8 dark:border-amber-400/30 dark:bg-amber-400/5">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  <svg className="h-6 w-6 text-amber-600 dark:text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-amber-900 dark:text-amber-100">
                    ⏰ Important: All times are in UTC
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-amber-800 dark:text-amber-200">
                    <strong>UTC (Coordinated Universal Time)</strong> is the global time standard. All dates and deadlines for this buildathon are based on UTC to ensure fairness across all participating countries.
                  </p>

                  <div className="mt-4">
                    <p className="text-sm font-semibold text-amber-900 dark:text-amber-100">
                      UTC time conversions for Latin America:
                    </p>
                    <div className="mt-3 grid gap-2 grid-cols-1 sm:grid-cols-2">
                      <div className="rounded-lg bg-white/50 px-3 py-2 text-xs sm:text-sm dark:bg-black/20">
                        <span className="font-medium">🇲🇽 Mexico (CST/CDT):</span>
                        <span className="ml-1 sm:ml-2 text-amber-800 dark:text-amber-200">UTC -6 / -5</span>
                      </div>
                      <div className="rounded-lg bg-white/50 px-3 py-2 text-xs sm:text-sm dark:bg-black/20">
                        <span className="font-medium">🇨🇴 Colombia:</span>
                        <span className="ml-1 sm:ml-2 text-amber-800 dark:text-amber-200">UTC -5</span>
                      </div>
                      <div className="rounded-lg bg-white/50 px-3 py-2 text-xs sm:text-sm dark:bg-black/20">
                        <span className="font-medium">🇦🇷 Argentina:</span>
                        <span className="ml-1 sm:ml-2 text-amber-800 dark:text-amber-200">UTC -3</span>
                      </div>
                      <div className="rounded-lg bg-white/50 px-3 py-2 text-xs sm:text-sm dark:bg-black/20">
                        <span className="font-medium">🇧🇷 Brazil (BRT/BRST):</span>
                        <span className="ml-1 sm:ml-2 text-amber-800 dark:text-amber-200">UTC -3 / -2</span>
                      </div>
                    </div>
                  </div>

                  <p className="mt-4 text-xs text-amber-700 dark:text-amber-300">
                    💡 <strong>Tip:</strong> When a deadline is "Jan 16, 2026 00:00 UTC", it means Jan 15 at 6:00 PM in Mexico City, 7:00 PM in Bogotá, and 9:00 PM in Buenos Aires/São Paulo. Use a <a href="https://www.timeanddate.com/worldclock/converter.html" target="_blank" rel="noopener noreferrer" className="underline hover:text-amber-900 dark:hover:text-amber-100">UTC converter</a> to check your local time.
                  </p>
                </div>
              </div>
            </div>
          </Container>
        </Section>

        <Section id="submit" className="scroll-mt-20">
          <Container>
            <SectionHeader
              title="Submit your project"
              description="Once you&apos;ve pre-registered and built your project, submit it here with your Karma Gap link."
            />

            <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              <Card className="p-8">
                <div className="text-base font-semibold">Pre-registration (Dec 18 - Jan 16)</div>
                <p className="mt-3 text-sm leading-relaxed text-black/70 dark:text-white/70">
                  Register your team using the form on this website. You&apos;ll provide your team name,
                  member details, and an EVM wallet address to receive 3 CELO for deployments.
                </p>
                <div className="mt-6">
                  <RegisterButton
                    label="Pre-register now"
                    variant="primary"
                    withSquares
                    className="w-full sm:w-auto"
                  />
                </div>
              </Card>

              <Card className="p-8">
                <div className="text-base font-semibold">Edit Team (Dec 18 - Feb 27)</div>
                <p className="mt-3 text-sm leading-relaxed text-black/70 dark:text-white/70">
                  Already registered? Update your team name, wallet address, or add/remove members.
                  Enter any team member&apos;s email to find your team.
                </p>
                <div className="mt-6">
                  <EditTeamButton
                    label="Edit team"
                    variant="secondary"
                    withSquares
                    className="w-full sm:w-auto"
                  />
                </div>
              </Card>

              <Card className="p-8">
                <div className="text-base font-semibold">Submission (Jan 16 - Feb 27)</div>
                <p className="mt-3 text-sm leading-relaxed text-black/70 dark:text-white/70">
                  Submit your Karma Gap project link. Your Karma Gap profile must include your
                  GitHub repo, demo video, presentation deck, and live demo URL.
                </p>
                <div className="mt-6">
                  <SubmitButton
                    label="Submit project"
                    variant="secondary"
                    withSquares
                    className="w-full sm:w-auto"
                  />
                </div>
              </Card>
            </div>

            <Card className="mt-6 border-[color:var(--celo-border)] bg-background/70 p-6">
              <div className="text-sm font-semibold text-foreground mb-4">Submission Requirements</div>
              <p className="text-sm text-black/70 dark:text-white/70 mb-4">
                You&apos;ll submit your Karma Gap project link via the form. Your Karma Gap profile must include:
              </p>
              <div className="space-y-3 text-sm">
                <ChecklistItem>GitHub repository link (repo should be public)</ChecklistItem>
                <ChecklistItem>Live demo URL (deployed on Celo Mainnet)</ChecklistItem>
                <ChecklistItem>Presentation deck explaining your project</ChecklistItem>
                <ChecklistItem>Demo video showing your application in action</ChecklistItem>
              </div>
            </Card>
          </Container>
        </Section>

        <Section id="rules" className="scroll-mt-20">
          <Container>
            <SectionHeader
              title="Rules & requirements"
              description="Make sure your project meets these requirements before final submission."
            />

            <Card className="mt-10 border-[color:var(--celo-border)] bg-background/70 p-7">
              <div className="text-sm font-semibold text-foreground">Rules</div>
              <ul className="mt-4 space-y-2 text-sm text-foreground">
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
              </ul>
              <div className="mt-4 text-xs text-[color:var(--celo-muted)]">
                Notes: you can register without a GitHub repo and add it later. For final submission, ensure your
                project is deployed on Celo Mainnet and your Karma Gap profile contains all required links.
              </div>
            </Card>
          </Container>
        </Section>

        <Section id="tracks" className="scroll-mt-20">
          <Container>
            <SectionHeader
              title="Available track(s)."
              description="You can apply to as many tracks as you want. Pick the tracks that best match your app and integrations."
            />

            <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {TRACKS.map((t) => (
                <Card
                  key={t.title}
                  className={cn(
                    "group p-8 transition-all",
                    t.available
                      ? "hover:shadow-lg hover:shadow-black/5 dark:hover:shadow-white/5"
                      : "opacity-60",
                    t.title === "Open Track"
                      ? "border-[color:var(--celo-yellow)]/40 ring-2 ring-[color:var(--celo-yellow-weak)] dark:ring-[color:var(--celo-yellow)]/30"
                      : undefined,
                  )}
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="text-base font-semibold">{t.title}</div>
                    {!t.available ? (
                      <span className="rounded-full border border-black/10 bg-black/5 px-2.5 py-1 text-[11px] font-medium text-black/60 dark:border-white/10 dark:bg-white/5 dark:text-white/60">
                        Not available
                      </span>
                    ) : null}
                  </div>
                  <p className="mt-4 text-sm leading-relaxed text-black/70 dark:text-white/70">
                    {t.description}
                  </p>
                  {"logoLight" in t && "logoDark" in t && (() => {
                    const track = t as typeof t & { logoLight: string; logoDark: string; logoUrl?: string };
                    const logoContent = (
                      <>
                        <Image
                          src={track.logoLight}
                          alt={`${track.title} logo`}
                          width={120}
                          height={28}
                          className="h-7 w-auto object-contain dark:hidden"
                        />
                        <Image
                          src={track.logoDark}
                          alt={`${track.title} logo`}
                          width={120}
                          height={28}
                          className="hidden h-7 w-auto object-contain dark:block"
                        />
                      </>
                    );
                    return (
                      <div className="mt-4">
                        {track.logoUrl ? (
                          <a
                            href={track.logoUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-block transition-opacity hover:opacity-70"
                          >
                            {logoContent}
                          </a>
                        ) : (
                          logoContent
                        )}
                      </div>
                    );
                  })()}
                </Card>
              ))}
            </div>
          </Container>
        </Section>

        <Section id="apply" className="scroll-mt-20">
          <Container>
            <div
              className={cn(
                "relative overflow-hidden rounded-2xl border border-black/10 bg-foreground p-10 text-background shadow-lg dark:border-white/10",
                // When bg-foreground is dark (light theme), use light grid.
                "[--grid-border-color:rgba(255,255,255,0.26)] [--grid-hover-color:rgba(255,255,255,0.14)]",
                // When bg-foreground is light (dark theme), use dark grid.
                "dark:[--grid-border-color:rgba(0,0,0,0.10)] dark:[--grid-hover-color:rgba(0,0,0,0.08)]",
              )}
            >
              <Squares
                interaction="element"
                direction="diagonal"
                speed={0.45}
                squareSize={26}
                className="opacity-60"
              />
              <div className="relative z-10 flex flex-col gap-8 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <div className="text-base font-semibold">Ready to build?</div>
                  <p className="mt-3 text-sm leading-relaxed text-background/80">
                    Applications take ~2 minutes. Spots are limited.
                  </p>
                </div>
                <div className="flex flex-col gap-3 sm:flex-row">
                  <RegisterButton
                    label="Pre-register now"
                    variant="primary"
                    withSquares
                    className="bg-white text-black shadow-md hover:opacity-95 hover:shadow-lg"
                  />
                  <SquaresButtonLink
                    href={INFO.discordUrl}
                    variant="secondary"
                    className="border-white/25 bg-transparent text-white hover:bg-white/10"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Join community
                  </SquaresButtonLink>
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

            <div className="mt-10 flex flex-col gap-4 sm:flex-row">
              <SquaresButtonLink href={INFO.discordUrl} target="_blank" rel="noopener noreferrer">
                Join Discord
              </SquaresButtonLink>
              <RegisterButton label="Pre-register now" variant="secondary" withSquares />
            </div>
          </Container>
        </Section>

        <Section id="resources" className="scroll-mt-20">
          <Container>
            <SectionHeader
              title="Resources"
              description="Curated learning resources for builders in LATAM. Filter by language."
            />

            <div className="mt-10 grid gap-6 lg:grid-cols-3">
              <div className="rounded-2xl border border-black/10 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-white/[0.03]">
                <div className="text-xs font-semibold uppercase tracking-wider text-black/60 dark:text-white/60">
                  Español
                </div>
                <div className="mt-4 space-y-5">
                  {RESOURCES.spanish.map((group) => (
                    <div key={group.title}>
                      <div className="text-sm font-semibold">{group.title}</div>
                      <div className="mt-2 space-y-2 text-sm">
                        {group.links.map((l) => (
                          <a
                            key={l.url}
                            href={l.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block text-black/70 transition-colors hover:text-foreground hover:underline dark:text-white/70"
                          >
                            {l.label}
                          </a>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-2xl border border-black/10 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-white/[0.03]">
                <div className="text-xs font-semibold uppercase tracking-wider text-black/60 dark:text-white/60">
                  English
                </div>
                <div className="mt-4 space-y-5">
                  {RESOURCES.english.map((group) => (
                    <div key={group.title}>
                      <div className="text-sm font-semibold">{group.title}</div>
                      <div className="mt-2 space-y-2 text-sm">
                        {group.links.map((l) => (
                          <a
                            key={l.url}
                            href={l.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block text-black/70 hover:text-foreground hover:underline dark:text-white/70"
                          >
                            {l.label}
                          </a>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-2xl border border-black/10 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-white/[0.03]">
                <div className="text-xs font-semibold uppercase tracking-wider text-black/60 dark:text-white/60">
                  Português
                </div>
                <div className="mt-4 space-y-5">
                  {RESOURCES.portuguese.map((group) => (
                    <div key={group.title}>
                      <div className="text-sm font-semibold">{group.title}</div>
                      <div className="mt-2 space-y-2 text-sm">
                        {group.links.map((l) => (
                          <a
                            key={l.url}
                            href={l.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block text-black/70 transition-colors hover:text-foreground hover:underline dark:text-white/70"
                          >
                            {l.label}
                          </a>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
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
