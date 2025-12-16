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

interface EditTeamModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

type Status = "idle" | "loading" | "success" | "error";
type Step = "email" | "edit";

type TeamMember = {
  id: string;
  memberName: string;
  memberEmail: string;
  memberGithub: string | null;
  country: string | null;
};

type TeamData = {
  id: string;
  teamName: string;
  walletAddress: string;
  members: TeamMember[];
};

export default function EditTeamModal({
  open,
  onOpenChange,
}: EditTeamModalProps) {
  const [step, setStep] = React.useState<Step>("email");
  const [email, setEmail] = React.useState("");
  const [status, setStatus] = React.useState<Status>("idle");
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);
  const [teamData, setTeamData] = React.useState<TeamData | null>(null);

  // Form state
  const [teamName, setTeamName] = React.useState("");
  const [walletAddress, setWalletAddress] = React.useState("");
  const [members, setMembers] = React.useState<TeamMember[]>([]);

  // Reset state when modal closes
  React.useEffect(() => {
    if (!open) {
      setStep("email");
      setEmail("");
      setStatus("idle");
      setErrorMessage(null);
      setTeamData(null);
      setTeamName("");
      setWalletAddress("");
      setMembers([]);
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
        setTeamName(data.team.teamName);
        setWalletAddress(data.team.walletAddress);
        setMembers(data.team.members);
        setStep("edit");
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

  async function handleUpdateTeam(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    setErrorMessage(null);

    try {
      if (!teamData) return;

      const res = await fetch(`/api/buildathon/team/update`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          teamId: teamData.id,
          teamName: teamName.trim(),
          walletAddress: walletAddress.trim(),
          members: members.map((m) => ({
            id: m.id,
            memberName: m.memberName.trim(),
            memberEmail: m.memberEmail.trim(),
            memberGithub: m.memberGithub?.trim() || null,
            country: m.country?.trim() || null,
          })),
        }),
      });

      if (res.ok) {
        setStatus("success");
        setTimeout(() => {
          onOpenChange(false);
        }, 2000);
      } else {
        const json = (await res.json()) as { error?: string };
        setStatus("error");
        setErrorMessage(
          json?.error || "Error updating team. Please try again."
        );
      }
    } catch {
      setStatus("error");
      setErrorMessage("Network error. Please try again.");
    }
  }

  function addMember() {
    setMembers([
      ...members,
      {
        id: `new-${Date.now()}`,
        memberName: "",
        memberEmail: "",
        memberGithub: null,
        country: null,
      },
    ]);
  }

  function removeMember(index: number) {
    setMembers(members.filter((_, i) => i !== index));
  }

  function updateMember(
    index: number,
    field: keyof TeamMember,
    value: string
  ) {
    const updated = [...members];
    updated[index] = { ...updated[index], [field]: value };
    setMembers(updated);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Team</DialogTitle>
          <DialogDescription>
            {step === "email"
              ? "Enter the email address of any team member to find your team."
              : "Update your team information and members."}
          </DialogDescription>
        </DialogHeader>

        {step === "email" && (
          <form onSubmit={handleFindTeam} className="mt-5 space-y-6">
            <Field label="Team Member Email *">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={inputClassName}
                placeholder="member@example.com"
                disabled={status === "loading"}
              />
              <p className="mt-1 text-xs text-black/60 dark:text-white/60">
                Enter the email of any registered team member
              </p>
            </Field>

            <div className="space-y-4">
              <Button
                type="submit"
                disabled={status === "loading" || !email.trim()}
                className="w-full rounded-full"
              >
                {status === "loading" ? "Searching..." : "Find Team"}
              </Button>

              {status === "error" && (
                <div className="rounded-lg border border-red-500/40 bg-red-500/10 p-3 text-sm text-red-700 dark:text-red-300">
                  {errorMessage || "Team not found."}
                </div>
              )}
            </div>
          </form>
        )}

        {step === "edit" && (
          <form onSubmit={handleUpdateTeam} className="mt-5 space-y-6">
            <Field label="Team Name *">
              <input
                type="text"
                required
                value={teamName}
                onChange={(e) => setTeamName(e.target.value)}
                className={inputClassName}
                disabled={status === "loading"}
              />
            </Field>

            <Field label="Wallet Address *">
              <input
                type="text"
                required
                value={walletAddress}
                onChange={(e) => setWalletAddress(e.target.value)}
                className={inputClassName}
                placeholder="0x..."
                disabled={status === "loading"}
              />
              <p className="mt-1 text-xs text-black/60 dark:text-white/60">
                EVM wallet address to receive 3 CELO for deployments
              </p>
            </Field>

            <div>
              <div className="mb-3 flex items-center justify-between">
                <label className="text-sm font-medium">Team Members *</label>
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  onClick={addMember}
                  disabled={status === "loading"}
                  className="text-xs"
                >
                  + Add Member
                </Button>
              </div>

              <div className="space-y-4">
                {members.map((member, index) => (
                  <div
                    key={member.id}
                    className="rounded-lg border border-black/10 p-4 dark:border-white/15"
                  >
                    <div className="mb-3 flex items-center justify-between">
                      <span className="text-sm font-medium">
                        Member {index + 1}
                      </span>
                      {members.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeMember(index)}
                          disabled={status === "loading"}
                          className="text-xs text-red-600 hover:text-red-700 dark:text-red-400"
                        >
                          Remove
                        </button>
                      )}
                    </div>

                    <div className="space-y-3">
                      <input
                        type="text"
                        required
                        value={member.memberName}
                        onChange={(e) =>
                          updateMember(index, "memberName", e.target.value)
                        }
                        placeholder="Full Name *"
                        className={inputClassName}
                        disabled={status === "loading"}
                      />

                      <input
                        type="email"
                        required
                        value={member.memberEmail}
                        onChange={(e) =>
                          updateMember(index, "memberEmail", e.target.value)
                        }
                        placeholder="Email *"
                        className={inputClassName}
                        disabled={status === "loading"}
                      />

                      <input
                        type="text"
                        value={member.memberGithub || ""}
                        onChange={(e) =>
                          updateMember(index, "memberGithub", e.target.value)
                        }
                        placeholder="GitHub Username (optional)"
                        className={inputClassName}
                        disabled={status === "loading"}
                      />

                      <input
                        type="text"
                        required
                        value={member.country || ""}
                        onChange={(e) =>
                          updateMember(index, "country", e.target.value)
                        }
                        placeholder="Country *"
                        className={inputClassName}
                        disabled={status === "loading"}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex gap-3">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => setStep("email")}
                  disabled={status === "loading"}
                  className="rounded-full"
                >
                  Back
                </Button>
                <Button
                  type="submit"
                  disabled={status === "loading"}
                  className="flex-1 rounded-full"
                >
                  {status === "loading" ? "Updating..." : "Update Team"}
                </Button>
              </div>

              {status === "error" && (
                <div className="rounded-lg border border-red-500/40 bg-red-500/10 p-3 text-sm text-red-700 dark:text-red-300">
                  {errorMessage || "Error updating team."}
                </div>
              )}

              {status === "success" && (
                <div className="rounded-lg border border-emerald-500/40 bg-emerald-500/10 p-3 text-sm text-emerald-700 dark:text-emerald-300">
                  Team updated successfully!
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
