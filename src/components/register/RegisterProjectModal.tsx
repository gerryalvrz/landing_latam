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

const LATIN_AMERICAN_COUNTRIES = [
  "Non Latin America Country",
  "Argentina",
  "Belize",
  "Bolivia",
  "Brazil",
  "Chile",
  "Colombia",
  "Costa Rica",
  "Cuba",
  "Dominican Republic",
  "Ecuador",
  "El Salvador",
  "Guatemala",
  "Honduras",
  "Mexico",
  "Nicaragua",
  "Panama",
  "Paraguay",
  "Peru",
  "Puerto Rico",
  "Uruguay",
  "Venezuela",
] as const;

type Team = {
  id: string;
  teamName: string;
  members: Array<{
    id: string;
    memberName: string;
    memberGithub: string | null;
    country: string | null;
  }>;
};

export default function RegisterProjectModal({
  open,
  onOpenChange,
}: RegisterProjectModalProps) {
  // Default to create mode so the public registration flow works without any admin-only APIs.
  const [mode, setMode] = React.useState<"select" | "create" | "edit">("create");
  const [selectedTeamId, setSelectedTeamId] = React.useState<string>("");
  const [teams, setTeams] = React.useState<Team[]>([]);
  const [loadingTeams, setLoadingTeams] = React.useState(false);
  const [teamName, setTeamName] = React.useState("");
  const [members, setMembers] = React.useState<Array<{ memberName: string; memberGithub: string; country: string }>>([
    { memberName: "", memberGithub: "", country: "" },
  ]);
  const [status, setStatus] = React.useState<Status>("idle");
  const [showSuccessModal, setShowSuccessModal] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);

  const canSubmit =
    teamName.trim().length > 0 && members.some((m) => m.memberName.trim().length > 0);

  // Fetch teams when modal opens
  React.useEffect(() => {
    if (open) {
      setLoadingTeams(true);
      fetch("/api/buildathon/teams")
        .then(async (res) => {
          if (!res.ok) return null; // e.g. 401 when not an admin session
          return (await res.json()) as { teams?: Team[] };
        })
        .then((data) => {
          setTeams(data?.teams || []);
        })
        .catch((err) => {
          console.error("Failed to fetch teams:", err);
          setTeams([]);
        })
        .finally(() => {
          setLoadingTeams(false);
        });
    }
  }, [open]);

  // Handle team selection
  function handleTeamSelect(teamId: string) {
    if (teamId === "new") {
      setMode("create");
      setSelectedTeamId("");
      setTeamName("");
      setMembers([{ memberName: "", memberGithub: "", country: "" }]);
    } else {
      const team = teams.find((t) => t.id === teamId);
      if (team) {
        setMode("edit");
        setSelectedTeamId(teamId);
        setTeamName(team.teamName);
        setMembers(
          team.members.map((m) => ({
            memberName: m.memberName,
            memberGithub: m.memberGithub || "",
            country: m.country || "",
          }))
        );
      }
    }
  }

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
            country: m.country.trim(),
          }))
          .filter((m) => m.memberName.length > 0)
          .map((m) => ({
            memberName: m.memberName,
            ...(m.memberGithub ? { memberGithub: m.memberGithub.replace(/^@/, "") } : {}),
            ...(m.country ? { country: m.country } : {}),
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

      // Check if all members have a country selected
      const membersWithoutCountry = payload.members.filter((m) => !m.country);
      if (membersWithoutCountry.length > 0) {
        setStatus("error");
        setErrorMessage("Please select a country for all team members.");
        return;
      }

      const isEditMode = mode === "edit" && selectedTeamId;
      const url = isEditMode
        ? `/api/buildathon/teams/${selectedTeamId}`
        : "/api/buildathon/register";
      const method = isEditMode ? "PATCH" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(isEditMode ? { members: payload.members } : payload),
      });

      if (res.ok) {
        setStatus("success");
        setMode("select");
        setSelectedTeamId("");
        setTeamName("");
        setMembers([{ memberName: "", memberGithub: "", country: "" }]);
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
        <DialogContent className="max-h-[90vh] max-w-md overflow-hidden">
          <DialogHeader>
            <DialogTitle>Apply / Register</DialogTitle>
            <DialogDescription>
              Pre-register your team. You can create projects and submit milestones after.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="mt-5 flex flex-col">
            <div className="max-h-[calc(90vh-16rem)] space-y-6 overflow-y-auto pr-2">
              {mode === "select" && (
                <Field label="Select your team or create new">
                  <select
                    value={selectedTeamId}
                    onChange={(e) => handleTeamSelect(e.target.value)}
                    className={inputClassName}
                    disabled={loadingTeams}
                  >
                    <option value="">
                      {loadingTeams ? "Loading teams..." : "-- Select a team --"}
                    </option>
                    <option value="new">+ Create New Team</option>
                    {teams.map((team) => (
                      <option key={team.id} value={team.id}>
                        {team.teamName} ({team.members.length} members)
                      </option>
                    ))}
                  </select>
                </Field>
              )}

              {(mode === "create" || mode === "edit") && (
                <>
                  <div className="flex items-start gap-2">
                    <div className="flex-1">
                      <Field label="Team name *">
                        <input
                          type="text"
                          required
                          value={teamName}
                          onChange={(e) => setTeamName(e.target.value)}
                          className={inputClassName}
                          placeholder="My awesome project"
                          disabled={mode === "edit"}
                        />
                      </Field>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setMode("select");
                        setSelectedTeamId("");
                        setTeamName("");
                        setMembers([{ memberName: "", memberGithub: "", country: "" }]);
                      }}
                      className="mt-8"
                    >
                      Cancel
                    </Button>
                  </div>

                  <Field label="Team members *">
                <div className="space-y-4">
                  {members.map((m, idx) => (
                    <div key={idx} className="rounded-lg border border-black/10 p-3 dark:border-white/15">
                    <div className="grid grid-cols-1 gap-4">
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
                      <div>
                        <label className="mb-1 block text-xs font-medium text-black/70 dark:text-white/70">
                          Country *
                        </label>
                        <select
                          value={m.country}
                          onChange={(e) => {
                            const next = members.slice();
                            next[idx] = { ...next[idx], country: e.target.value };
                            setMembers(next);
                          }}
                          className={inputClassName}
                          disabled={status === "loading"}
                          required={idx === 0 || m.memberName.trim().length > 0}
                        >
                          <option value="">Select a country...</option>
                          {LATIN_AMERICAN_COUNTRIES.map((country) => (
                            <option key={country} value={country}>
                              {country}
                            </option>
                          ))}
                        </select>
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
                      onClick={() => setMembers([...members, { memberName: "", memberGithub: "", country: "" }])}
                      disabled={status === "loading"}
                      className="w-full"
                    >
                      + Add member
                    </Button>
                  </div>
                </Field>
                </>
              )}
            </div>

            {(mode === "create" || mode === "edit") && (
              <div className="mt-6 space-y-4">
                <Button
                  type="submit"
                  disabled={status === "loading" || !canSubmit}
                  className="w-full rounded-full"
                >
                  {status === "loading"
                    ? mode === "edit"
                      ? "Updating..."
                      : "Registering..."
                    : mode === "edit"
                    ? "Update Team"
                    : "Register"}
                </Button>

                {status === "error" ? (
                  <div className="rounded-lg border border-red-500/40 bg-red-500/10 p-3 text-sm text-red-700 dark:text-red-300">
                    {errorMessage || "Error registering. Please try again."}
                  </div>
                ) : null}
              </div>
            )}
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


