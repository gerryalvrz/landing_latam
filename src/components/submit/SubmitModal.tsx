"use client";

import * as React from "react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/cn";

interface SubmitModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

type Status = "idle" | "loading" | "success" | "error";
type Step = "email" | "submit";

type TeamData = {
  id: string;
  teamName: string;
  submission: {
    karmaGapLink: string;
    trackOpenTrack: boolean;
    trackFarcasterMiniapp: boolean;
    trackSelf: boolean;
    trackV0: boolean;
  } | null;
};

export default function SubmitModal({
  open,
  onOpenChange,
}: SubmitModalProps) {
  const [step, setStep] = React.useState<Step>("email");
  const [email, setEmail] = React.useState("");
  const [status, setStatus] = React.useState<Status>("idle");
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);
  const [teamData, setTeamData] = React.useState<TeamData | null>(null);
  const [karmaGapLink, setKarmaGapLink] = React.useState("");
  const [selectedTracks, setSelectedTracks] = React.useState({
    open: false,
    miniapp: false,
    humantech: false,
    v0: false,
  });

  // Reset state when modal closes
  React.useEffect(() => {
    if (!open) {
      setStep("email");
      setEmail("");
      setStatus("idle");
      setErrorMessage(null);
      setTeamData(null);
      setKarmaGapLink("");
      setSelectedTracks({ open: false, miniapp: false, humantech: false, v0: false });
    }
  }, [open]);

  async function handleFindTeam(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    setErrorMessage(null);

    try {
      const res = await fetch(
        `/api/buildathon/team/find?email=${encodeURIComponent(email.trim())}`
      );

      if (res.ok) {
        const data = (await res.json()) as { team: TeamData };
        setTeamData(data.team);
        setKarmaGapLink(data.team.submission?.karmaGapLink || "");
        // Set selected tracks based on existing submission
        setSelectedTracks({
          open: data.team.submission?.trackOpenTrack || false,
          miniapp: data.team.submission?.trackFarcasterMiniapp || false,
          humantech: data.team.submission?.trackSelf || false,
          v0: data.team.submission?.trackV0 || false,
        });
        setStep("submit");
        setStatus("idle");
      } else {
        const json = (await res.json()) as { error?: string };
        setStatus("error");
        setErrorMessage(
          json?.error || "Team not found. Please check the email address."
        );
      }
    } catch {
      setStatus("error");
      setErrorMessage("Network error. Please try again.");
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    setErrorMessage(null);

    try {
      if (!karmaGapLink.trim()) {
        setStatus("error");
        setErrorMessage("Karma Gap link is required.");
        return;
      }

      // Basic URL validation
      try {
        new URL(karmaGapLink);
      } catch {
        setStatus("error");
        setErrorMessage("Please enter a valid URL.");
        return;
      }

      // Validate at least one primary track is selected (Open Track or MiniApps)
      if (!selectedTracks.open && !selectedTracks.miniapp) {
        setStatus("error");
        setErrorMessage("Please select at least one primary track: Open Track or MiniApps.");
        return;
      }

      const res = await fetch("/api/buildathon/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          teamId: teamData?.id,
          karmaGapLink: karmaGapLink.trim(),
          trackOpenTrack: selectedTracks.open,
          trackFarcasterMiniapp: selectedTracks.miniapp,
          trackSelf: selectedTracks.humantech,
          trackV0: selectedTracks.v0,
        }),
      });

      if (res.ok) {
        setStatus("success");
        setTimeout(() => {
          onOpenChange(false);
        }, 2000);
      } else {
        setStatus("error");
        try {
          const json = (await res.json()) as { error?: string };
          setErrorMessage(json?.error || "Error submitting. Please try again.");
        } catch {
          setErrorMessage("Error submitting. Please try again.");
        }
      }
    } catch {
      setStatus("error");
      setErrorMessage("Network error. Please try again.");
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Submit Project</DialogTitle>
          <DialogDescription>
            {step === "email"
              ? "Enter your team member email to find your team"
              : `Submit your Karma Gap link for ${teamData?.teamName}`}
          </DialogDescription>
        </DialogHeader>

        {step === "email" ? (
          <form onSubmit={handleFindTeam} className="mt-5 space-y-6">
            <Field label="Team Member Email *">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={inputClassName}
                placeholder="team@example.com"
                pattern="[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}"
                title="Please enter a valid email address (e.g., user@example.com)"
                disabled={status === "loading"}
              />
              <p className="mt-1 text-xs text-black/60 dark:text-white/60">
                Enter the email of any team member
              </p>
            </Field>

            <div className="space-y-4">
              <Button
                type="submit"
                disabled={status === "loading" || !email.trim()}
                className="w-full rounded-full"
              >
                {status === "loading" ? "Finding team..." : "Find Team"}
              </Button>

              {status === "error" && (
                <div className="rounded-lg border border-red-500/40 bg-red-500/10 p-3 text-sm text-red-700 dark:text-red-300">
                  {errorMessage || "Error finding team. Please try again."}
                </div>
              )}
            </div>
          </form>
        ) : (
          <form onSubmit={handleSubmit} className="mt-5 space-y-6">
            <div className="rounded-lg border border-black/10 bg-black/[0.02] p-4 dark:border-white/10 dark:bg-white/[0.02]">
              <div className="text-sm font-medium">Team: {teamData?.teamName}</div>
              <button
                type="button"
                onClick={() => setStep("email")}
                className="mt-2 text-xs text-black/60 hover:text-foreground dark:text-white/60"
              >
                ← Change team
              </button>
            </div>

            <Field label="Karma Gap Link *">
              <input
                type="url"
                required
                value={karmaGapLink}
                onChange={(e) => setKarmaGapLink(e.target.value)}
                className={inputClassName}
                placeholder="https://gap.karmahq.xyz/..."
                disabled={status === "loading"}
              />
              <p className="mt-1 text-xs text-black/60 dark:text-white/60">
                Link to your Karma Gap project
              </p>
            </Field>

            <Field label="Tracks *">
              <div className="space-y-3">
                <label className={cn(
                  "flex items-start gap-3 rounded-lg border p-3 cursor-pointer transition-colors",
                  selectedTracks.open
                    ? "border-black/30 bg-black/[0.06] dark:border-white/30 dark:bg-white/[0.06]"
                    : "border-black/10 bg-black/[0.02] hover:bg-black/[0.04] dark:border-white/10 dark:bg-white/[0.02] dark:hover:bg-white/[0.04]"
                )}>
                  <input
                    type="checkbox"
                    checked={selectedTracks.open}
                    onChange={(e) => setSelectedTracks({ ...selectedTracks, open: e.target.checked })}
                    disabled={status === "loading"}
                    className="mt-0.5"
                  />
                  <div className="flex-1">
                    <div className="text-sm font-medium">Open Track</div>
                    <div className="text-xs text-black/60 dark:text-white/60">
                      Build anything you&apos;re most excited about
                    </div>
                  </div>
                </label>

                <label className={cn(
                  "flex items-start gap-3 rounded-lg border p-3 cursor-pointer transition-colors",
                  selectedTracks.miniapp
                    ? "border-black/30 bg-black/[0.06] dark:border-white/30 dark:bg-white/[0.06]"
                    : "border-black/10 bg-black/[0.02] hover:bg-black/[0.04] dark:border-white/10 dark:bg-white/[0.02] dark:hover:bg-white/[0.04]"
                )}>
                  <input
                    type="checkbox"
                    checked={selectedTracks.miniapp}
                    onChange={(e) => setSelectedTracks({ ...selectedTracks, miniapp: e.target.checked })}
                    disabled={status === "loading"}
                    className="mt-0.5"
                  />
                  <div className="flex-1">
                    <div className="text-sm font-medium">MiniApps (Farcaster/MiniPay)</div>
                    <div className="text-xs text-black/60 dark:text-white/60">
                      Build and launch a cool MiniApp on Farcaster or MiniPay and get exposure from Celo Account in Farcaster in their MiniApp Mondays!
                    </div>
                  </div>
                </label>

                <label className={cn(
                  "flex items-start gap-3 rounded-lg border p-3 cursor-pointer transition-colors",
                  selectedTracks.humantech
                    ? "border-black/30 bg-black/[0.06] dark:border-white/30 dark:bg-white/[0.06]"
                    : "border-black/10 bg-black/[0.02] hover:bg-black/[0.04] dark:border-white/10 dark:bg-white/[0.02] dark:hover:bg-white/[0.04]"
                )}>
                  <input
                    type="checkbox"
                    checked={selectedTracks.humantech}
                    onChange={(e) => setSelectedTracks({ ...selectedTracks, humantech: e.target.checked })}
                    disabled={status === "loading"}
                    className="mt-0.5"
                  />
                  <div className="flex-1">
                    <div className="text-sm font-medium">Human.Tech</div>
                    <div className="text-xs text-black/60 dark:text-white/60">
                      Build with Human.Tech stack (WaaP/Human Passport)
                    </div>
                  </div>
                </label>

                <label className={cn(
                  "flex items-start gap-3 rounded-lg border p-3 cursor-pointer transition-colors",
                  selectedTracks.v0
                    ? "border-black/30 bg-black/[0.06] dark:border-white/30 dark:bg-white/[0.06]"
                    : "border-black/10 bg-black/[0.02] hover:bg-black/[0.04] dark:border-white/10 dark:bg-white/[0.02] dark:hover:bg-white/[0.04]"
                )}>
                  <input
                    type="checkbox"
                    checked={selectedTracks.v0}
                    onChange={(e) => setSelectedTracks({ ...selectedTracks, v0: e.target.checked })}
                    disabled={status === "loading"}
                    className="mt-0.5"
                  />
                  <div className="flex-1">
                    <div className="text-sm font-medium">v0</div>
                    <div className="text-xs text-black/60 dark:text-white/60">
                      Build with v0 and show the v0 branding on your site. Projects must be published as public templates in the v0 directory at https://v0.app/templates
                    </div>
                  </div>
                </label>
              </div>
              <p className="mt-2 text-xs text-black/60 dark:text-white/60">
                Select at least one primary track (Open Track or MiniApps). You can also select additional sponsor tracks (Human.Tech and/or v0).
              </p>
            </Field>

            <div className="space-y-4">
              <Button
                type="submit"
                disabled={status === "loading" || !karmaGapLink.trim()}
                className="w-full rounded-full"
              >
                {status === "loading" ? "Submitting..." : teamData?.submission ? "Update Submission" : "Submit"}
              </Button>

              {status === "error" && (
                <div className="rounded-lg border border-red-500/40 bg-red-500/10 p-3 text-sm text-red-700 dark:text-red-300">
                  {errorMessage || "Error submitting. Please try again."}
                </div>
              )}

              {status === "success" && (
                <div className="rounded-lg border border-emerald-500/40 bg-emerald-500/10 p-3 text-sm text-emerald-700 dark:text-emerald-300">
                  Submission successful!
                </div>
              )}
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="mb-3 block text-sm font-medium">{label}</label>
      {children}
    </div>
  );
}

const inputClassName = cn(
  "w-full rounded-lg border border-black/10 bg-white px-4 py-3 text-sm text-foreground shadow-sm",
  "dark:border-white/15 dark:bg-black",
  "focus:outline-none focus:ring-2 focus:ring-black/20 dark:focus:ring-white/25",
);
