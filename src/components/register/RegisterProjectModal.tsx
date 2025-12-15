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
import SuccessModal from "@/components/register/SuccessModal";
import { cn } from "@/lib/cn";

interface RegisterProjectModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

type Status = "idle" | "loading" | "success" | "error";

export default function RegisterProjectModal({
  open,
  onOpenChange,
}: RegisterProjectModalProps) {
  const [teamName, setTeamName] = React.useState("");
  const [members, setMembers] = React.useState<Array<{ memberName: string; memberGithub: string }>>([
    { memberName: "", memberGithub: "" },
  ]);
  const [status, setStatus] = React.useState<Status>("idle");
  const [showSuccessModal, setShowSuccessModal] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);

  const canSubmit =
    teamName.trim().length > 0 && members.some((m) => m.memberName.trim().length > 0);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    setErrorMessage(null);

    try {
      const payload = {
        teamName: teamName.trim(),
        members: members
          .map((m) => ({
            memberName: m.memberName.trim(),
            memberGithub: m.memberGithub.trim(),
          }))
          .filter((m) => m.memberName.length > 0)
          .map((m) => ({
            memberName: m.memberName,
            ...(m.memberGithub ? { memberGithub: m.memberGithub.replace(/^@/, "") } : {}),
          })),
      };

      if (!payload.teamName) {
        setStatus("error");
        setErrorMessage("Team name is required.");
        return;
      }

      if (payload.members.length === 0) {
        setStatus("error");
        setErrorMessage("Please add at least one team member.");
        return;
      }

      const res = await fetch("/api/buildathon/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setStatus("success");
        setTeamName("");
        setMembers([{ memberName: "", memberGithub: "" }]);
        onOpenChange(false);
        setShowSuccessModal(true);
        setStatus("idle");
      } else {
        setStatus("error");
        try {
          const json = (await res.json()) as { error?: string };
          setErrorMessage(json?.error || "Error registering. Please try again.");
        } catch {
          setErrorMessage("Error registering. Please try again.");
        }
      }
    } catch {
      setStatus("error");
      setErrorMessage("Network error. Please try again.");
    }
  }

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Apply / Register</DialogTitle>
            <DialogDescription>
              Pre-register your team. You can create projects and submit milestones after.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="mt-5 space-y-6">
            <Field label="Team name *">
              <input
                type="text"
                required
                value={teamName}
                onChange={(e) => setTeamName(e.target.value)}
                className={inputClassName}
                placeholder="My awesome project"
              />
            </Field>

            <Field label="Team members *">
              <div className="space-y-4">
                {members.map((m, idx) => (
                  <div key={idx} className="rounded-lg border border-black/10 p-3 dark:border-white/15">
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <div>
                        <label className="mb-1 block text-xs font-medium text-black/70 dark:text-white/70">
                          Name *
                        </label>
                        <input
                          type="text"
                          required={idx === 0}
                          value={m.memberName}
                          onChange={(e) => {
                            const next = members.slice();
                            next[idx] = { ...next[idx], memberName: e.target.value };
                            setMembers(next);
                          }}
                          className={inputClassName}
                          placeholder="Jane Doe"
                        />
                      </div>
                      <div>
                        <label className="mb-1 block text-xs font-medium text-black/70 dark:text-white/70">
                          GitHub (optional)
                        </label>
                        <input
                          type="text"
                          value={m.memberGithub}
                          onChange={(e) => {
                            const next = members.slice();
                            next[idx] = { ...next[idx], memberGithub: e.target.value };
                            setMembers(next);
                          }}
                          className={inputClassName}
                          placeholder="@username"
                        />
                      </div>
                    </div>

                    {members.length > 1 ? (
                      <div className="mt-3 flex justify-end">
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => setMembers(members.filter((_, i) => i !== idx))}
                          disabled={status === "loading"}
                        >
                          Remove
                        </Button>
                      </div>
                    ) : null}
                  </div>
                ))}

                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => setMembers([...members, { memberName: "", memberGithub: "" }])}
                  disabled={status === "loading"}
                  className="w-full"
                >
                  + Add member
                </Button>
              </div>
            </Field>

            <Button
              type="submit"
              disabled={status === "loading" || !canSubmit}
              className="w-full rounded-full"
            >
              {status === "loading" ? "Registering..." : "Register"}
            </Button>

            {status === "error" ? (
              <div className="rounded-lg border border-red-500/40 bg-red-500/10 p-3 text-sm text-red-700 dark:text-red-300">
                {errorMessage || "Error registering. Please try again."}
              </div>
            ) : null}
          </form>
        </DialogContent>
      </Dialog>

      <SuccessModal open={showSuccessModal} onOpenChange={setShowSuccessModal} />
    </>
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


