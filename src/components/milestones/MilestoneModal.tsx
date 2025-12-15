"use client";

import { useCallback, useEffect, useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { Cross2Icon } from "@radix-ui/react-icons";
import { Button } from "@/components/ui/button";

import type { MilestoneType } from "@/app/home-content";

interface Project {
  id: string;
  projectName: string;
  githubRepo?: string | null;
  teamId?: string;
}

interface Team {
  id: string;
  teamName: string;
}

interface MilestoneSubmission {
  contractAddress?: string;
  karmaGapLink?: string;
  farcasterLink?: string;
  slidesLink?: string;
  pitchDeckLink?: string;
}

type SubmissionApiItem = {
  milestoneType: string;
  contractAddress?: string | null;
  karmaGapLink?: string | null;
  farcasterLink?: string | null;
  slidesLink?: string | null;
  pitchDeckLink?: string | null;
};

interface MilestoneModalProps {
  isOpen: boolean;
  onClose: () => void;
  milestone: {
    step: string;
    type: MilestoneType;
  };
}

export function MilestoneModal({
  isOpen,
  onClose,
  milestone,
}: MilestoneModalProps) {
  const [selectedProject, setSelectedProject] = useState("");
  const [projects, setProjects] = useState<Project[]>([]);
  const [projectSubmissions, setProjectSubmissions] = useState<Record<string, MilestoneSubmission>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    contractAddress: "",
    karmaGapLink: "",
    farcasterLink: "",
    slidesLink: "",
    pitchDeckLink: "",
  });
  const [hasUserEdited, setHasUserEdited] = useState(false);

  // Registration milestone state
  const [teams, setTeams] = useState<Team[]>([]);
  const [selectedTeam, setSelectedTeam] = useState("");
  const [selectedTeamHasProject, setSelectedTeamHasProject] = useState(false);
  const [selectedTeamProjectName, setSelectedTeamProjectName] = useState<string | null>(null);
  const [selectedTeamProjectId, setSelectedTeamProjectId] = useState<string | null>(null);
  const [selectedTeamProjectGithubRepo, setSelectedTeamProjectGithubRepo] = useState<string | null>(null);
  const [projectName, setProjectName] = useState("");
  const [githubRepo, setGithubRepo] = useState("");
  const [isCreatingProject, setIsCreatingProject] = useState(false);

  type PrismaMilestoneKey =
    | "REGISTRATION"
    | "TESTNET"
    | "KARMA_GAP"
    | "MAINNET"
    | "FARCASTER"
    | "FINAL_SUBMISSION";

  const milestonePrereqByType: Record<MilestoneType, PrismaMilestoneKey | null> = {
    registration: null,
    testnet: "REGISTRATION",
    "karma-gap": "TESTNET",
    mainnet: "KARMA_GAP",
    farcaster: "MAINNET",
    "final-submission": "MAINNET",
  };

  const milestoneLabelByKey: Record<PrismaMilestoneKey, string> = {
    REGISTRATION: "Registration",
    TESTNET: "Testnet",
    KARMA_GAP: "Karma Gap",
    MAINNET: "Mainnet",
    FARCASTER: "Farcaster",
    FINAL_SUBMISSION: "Final submission",
  };

  const prismaKeyByMilestoneType: Record<MilestoneType, PrismaMilestoneKey> = {
    registration: "REGISTRATION",
    testnet: "TESTNET",
    "karma-gap": "KARMA_GAP",
    mainnet: "MAINNET",
    farcaster: "FARCASTER",
    "final-submission": "FINAL_SUBMISSION",
  };

  const activePrismaKey = prismaKeyByMilestoneType[milestone.type];
  const activeSubmission = projectSubmissions[activePrismaKey];
  const hasActiveSubmission =
    milestone.type !== "registration" &&
    Boolean(selectedProject) &&
    Boolean(activeSubmission) &&
    Object.values(activeSubmission).some((v) => Boolean(v));

  const prereqKey = milestonePrereqByType[milestone.type];
  const isLocked =
    milestone.type !== "registration" &&
    Boolean(selectedProject) &&
    Boolean(prereqKey) &&
    !((prereqKey as PrismaMilestoneKey) in projectSubmissions);

  const setField = (key: keyof typeof formData, value: string) => {
    setHasUserEdited(true);
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const renderExistingSubmissionNotice = () => {
    if (!selectedProject || milestone.type === "registration") return null;
    if (isLocked) return null;
    if (!hasActiveSubmission) return null;

    const s = activeSubmission || {};
    const showField = (label: string, value?: string) => {
      if (!value) return null;
      const isUrl = /^https?:\/\//i.test(value);
      return (
        <div className="flex flex-col gap-1">
          <div className="text-[11px] font-semibold text-black/60 dark:text-white/60">
            {label}
          </div>
          {isUrl ? (
            <a
              href={value}
              target="_blank"
              rel="noopener noreferrer"
              className="truncate text-xs text-blue-600 hover:underline dark:text-blue-400"
            >
              {value}
            </a>
          ) : (
            <div className="break-all rounded-md border border-black/10 bg-black/[0.02] px-2 py-1 font-mono text-[11px] text-black/80 dark:border-white/10 dark:bg-white/[0.03] dark:text-white/80">
              {value}
            </div>
          )}
        </div>
      );
    };

    const fields: Array<React.ReactNode> = [];
    if (milestone.type === "testnet" || milestone.type === "mainnet") {
      fields.push(showField("Contract address", s.contractAddress));
    }
    if (milestone.type === "karma-gap") {
      fields.push(showField("Karma Gap link", s.karmaGapLink));
    }
    if (milestone.type === "farcaster") {
      fields.push(showField("Farcaster link", s.farcasterLink));
    }
    if (milestone.type === "final-submission") {
      fields.push(showField("Slides link", s.slidesLink));
      fields.push(showField("Pitch deck link", s.pitchDeckLink));
    }

    const visibleFields = fields.filter(Boolean);

    return (
      <div className="rounded-lg border border-black/10 bg-black/[0.02] p-3 text-sm text-black/70 dark:border-white/10 dark:bg-white/[0.03] dark:text-white/70">
        <div className="text-xs font-semibold text-black/70 dark:text-white/70">
          Existing submission found
        </div>
        <p className="mt-1 text-xs text-black/60 dark:text-white/60">
          The fields below are pre-filled with the saved values. You can update and submit again.
        </p>
        {visibleFields.length > 0 ? (
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            {visibleFields}
          </div>
        ) : null}
      </div>
    );
  };

  const fetchTeams = useCallback(async () => {
    setIsLoading(true);
    setError("");
    try {
      const response = await fetch("/api/teams", { cache: "no-store" });
      if (!response.ok) {
        throw new Error("Failed to fetch teams");
      }
      const data = (await response.json()) as { teams?: Team[] };
      setTeams(data.teams || []);
    } catch (err) {
      // Silently fail if database is not available (frontend-only development)
      setTeams([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchProjects = useCallback(async (teamId?: string) => {
    setIsLoading(true);
    setError("");
    try {
      const url = teamId
        ? `/api/projects?teamId=${encodeURIComponent(teamId)}`
        : "/api/projects";
      const response = await fetch(url, { cache: "no-store" });
      if (!response.ok) {
        let details = "";
        try {
          const json = (await response.json()) as { error?: string };
          if (json?.error) details = ` (${json.error})`;
        } catch {
          // ignore
        }
        throw new Error(`Failed to fetch projects: ${response.status}${details}`);
      }
      const data = (await response.json()) as { projects?: Project[] };
      setProjects(data.projects || []);
    } catch (err) {
      setError("Failed to load projects. Please try again.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchMilestoneData = useCallback(async (projectId: string) => {
    try {
      const response = await fetch(`/api/milestones?projectId=${projectId}`);
      if (!response.ok) throw new Error("Failed to fetch milestone data");
      const data = (await response.json()) as { submissions?: SubmissionApiItem[] };

      const submissionMap: Record<string, MilestoneSubmission> = {};
      data.submissions?.forEach((sub) => {
        submissionMap[sub.milestoneType] = {
          contractAddress: sub.contractAddress || "",
          karmaGapLink: sub.karmaGapLink || "",
          farcasterLink: sub.farcasterLink || "",
          slidesLink: sub.slidesLink || "",
          pitchDeckLink: sub.pitchDeckLink || "",
        };
      });

      setProjectSubmissions(submissionMap);
    } catch (err) {
      console.error("Failed to fetch milestone data:", err);
    }
  }, []);

  useEffect(() => {
    if (isOpen) {
      // For ALL milestones, team selection is the first step.
      // - registration: select team, then create project
      // - others: select team, then select project and submit
      fetchTeams();
    }
  }, [isOpen, fetchTeams]);

  // For the registration milestone: if a team already has a project, block new project creation.
  useEffect(() => {
    if (!isOpen || milestone.type !== "registration") return;
    setSelectedTeamHasProject(false);
    setSelectedTeamProjectName(null);
    setSelectedTeamProjectId(null);
    setSelectedTeamProjectGithubRepo(null);
    if (!selectedTeam) return;

    (async () => {
      try {
        const res = await fetch(`/api/projects?teamId=${encodeURIComponent(selectedTeam)}`, {
          cache: "no-store",
        });
        const json = (await res.json()) as {
          projects?: Array<{ id: string; projectName?: string | null; githubRepo?: string | null }>;
        };
        const first = json.projects?.[0] ?? null;
        const firstName = first?.projectName ?? null;
        const firstId = first?.id ?? null;
        const firstRepo = first?.githubRepo ?? null;
        const has = Array.isArray(json.projects) && json.projects.length > 0;
        setSelectedTeamHasProject(has);
        setSelectedTeamProjectName(firstName);
        setSelectedTeamProjectId(firstId);
        setSelectedTeamProjectGithubRepo(firstRepo);
        if (has) {
          // Pre-fill edit fields with current values
          setProjectName(firstName || "");
          setGithubRepo(firstRepo || "");
        }
      } catch (err) {
        console.error("Failed to check team projects:", err);
        // Fail open (do not block) if the check fails.
        setSelectedTeamHasProject(false);
        setSelectedTeamProjectName(null);
        setSelectedTeamProjectId(null);
        setSelectedTeamProjectGithubRepo(null);
      }
    })();
  }, [isOpen, milestone.type, selectedTeam]);

  useEffect(() => {
    if (selectedProject) {
      setHasUserEdited(false);
      fetchMilestoneData(selectedProject);
    }
  }, [selectedProject, fetchMilestoneData]);

  useEffect(() => {
    if (selectedTeam && milestone.type !== "registration") {
      setSelectedProject("");
      setProjectSubmissions({});
      setHasUserEdited(false);
      fetchProjects(selectedTeam);
    }
  }, [selectedTeam, milestone.type, fetchProjects]);

  useEffect(() => {
    // Reset local form state when switching milestone types
    setHasUserEdited(false);
    setError("");
  }, [milestone.type]);

  // Prefill current milestone data (if already submitted) and keep inputs editable.
  // Avoid overwriting while the user is typing.
  useEffect(() => {
    if (!selectedProject) return;
    if (milestone.type === "registration") return;
    if (hasUserEdited) return;

    const sub = projectSubmissions[activePrismaKey];
    setFormData({
      contractAddress: sub?.contractAddress || "",
      karmaGapLink: sub?.karmaGapLink || "",
      farcasterLink: sub?.farcasterLink || "",
      slidesLink: sub?.slidesLink || "",
      pitchDeckLink: sub?.pitchDeckLink || "",
    });
  }, [activePrismaKey, hasUserEdited, milestone.type, projectSubmissions, selectedProject]);

  const renderTeamSelector = () => (
    <div>
      <label className="mb-3 block text-sm font-medium">Select Your Team *</label>
      <select
        value={selectedTeam}
        onChange={(e) => setSelectedTeam(e.target.value)}
        className="w-full rounded-md border border-black/10 bg-white px-3 py-2 text-sm dark:border-white/20 dark:bg-black"
        required
        disabled={isSubmitting}
      >
        <option value="">Select a team...</option>
        {teams.map((team) => (
          <option key={team.id} value={team.id}>
            {team.teamName}
          </option>
        ))}
      </select>
    </div>
  );

  const renderProjectSelector = () => (
    <div>
      <label className="mb-3 block text-sm font-medium">Select Project *</label>
      <select
        value={selectedProject}
        onChange={(e) => setSelectedProject(e.target.value)}
        className="w-full rounded-md border border-black/10 bg-white px-3 py-2 text-sm dark:border-white/20 dark:bg-black"
        required
        disabled={isSubmitting || !selectedTeam}
      >
        <option value="">{selectedTeam ? "Select a project..." : "Select a team first..."}</option>
        {projects.map((project) => (
          <option key={project.id} value={project.id}>
            {project.projectName}
          </option>
        ))}
      </select>
    </div>
  );

  const renderNoTeamsNotice = () => (
    <div className="space-y-4">
      <p className="text-sm text-black/70 dark:text-white/70">
        You need to complete pre-registration first to create a team.
      </p>
      <Button
        type="button"
        onClick={() => {
          window.location.href = "#apply";
          onClose();
        }}
        className="w-full"
      >
        Go to Pre-Registration Form
      </Button>
    </div>
  );

  const renderNonRegistrationGate = (content: React.ReactNode) => {
    if (isLoading && teams.length === 0) {
      return <p className="text-sm text-black/70 dark:text-white/70">Loading teams...</p>;
    }
    if (teams.length === 0) return renderNoTeamsNotice();
    if (isLoading) {
      return <p className="text-sm text-black/70 dark:text-white/70">Loading projects...</p>;
    }
    return <>{content}</>;
  };

  const handleCreateProject = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsCreatingProject(true);
    setError("");

    try {
      if (selectedTeamHasProject) {
        throw new Error("This team already has a project. Update it instead.");
      }

      // Create the project
      const projectResponse = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          projectName,
          githubRepo,
          teamId: selectedTeam,
        }),
      });

      if (!projectResponse.ok) {
        const data = (await projectResponse.json()) as { error?: string };
        throw new Error(data.error || "Failed to create project");
      }

      const projectData = (await projectResponse.json()) as { project: { id: string } };

      // Submit the REGISTRATION milestone
      const milestoneResponse = await fetch("/api/milestones", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          projectId: projectData.project.id,
          milestoneType: "registration",
        }),
      });

      if (!milestoneResponse.ok) {
        throw new Error("Failed to submit registration milestone");
      }

      // Success - reset form and close modal
      setProjectName("");
      setGithubRepo("");
      setSelectedTeam("");
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create project. Please try again.");
      console.error(err);
    } finally {
      setIsCreatingProject(false);
    }
  };

  const handleUpdateRegistrationProject = async () => {
    setIsCreatingProject(true);
    setError("");
    try {
      if (!selectedTeamProjectId) throw new Error("Could not determine project to update.");
      if (!projectName.trim()) throw new Error("Project name is required.");
      if (!githubRepo.trim()) throw new Error("GitHub repository is required.");

      const res = await fetch("/api/projects", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          projectId: selectedTeamProjectId,
          projectName,
          githubRepo,
        }),
      });

      if (!res.ok) {
        const data = (await res.json().catch(() => null)) as { error?: string } | null;
        throw new Error(data?.error || "Failed to update project");
      }

      // Ensure REGISTRATION milestone exists (idempotent upsert).
      await fetch("/api/milestones", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          projectId: selectedTeamProjectId,
          milestoneType: "registration",
        }),
      });

      setSelectedTeamProjectName(projectName.trim());
      setSelectedTeamProjectGithubRepo(githubRepo.trim());
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update project. Please try again.");
    } finally {
      setIsCreatingProject(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      if (isLocked && prereqKey) {
        throw new Error(
          `Locked: complete "${milestoneLabelByKey[prereqKey]}" before submitting "${milestone.step}".`,
        );
      }

      const response = await fetch("/api/milestones", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          projectId: selectedProject,
          milestoneType: milestone.type,
          ...formData,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to submit milestone");
      }

      onClose();
      setFormData({
        contractAddress: "",
        karmaGapLink: "",
        farcasterLink: "",
        slidesLink: "",
        pitchDeckLink: "",
      });
      setHasUserEdited(false);
      setSelectedProject("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to submit. Please try again.");
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderForm = () => {
    switch (milestone.type) {
      case "registration":
        return (
          <div className="space-y-6">
            {isLoading ? (
              <p className="text-sm text-black/70 dark:text-white/70">Loading teams...</p>
            ) : teams.length === 0 ? (
              <div className="space-y-6">
                <p className="text-sm text-black/70 dark:text-white/70">
                  You need to complete pre-registration first to create a team.
                </p>
                <Button
                  type="button"
                  onClick={() => {
                    window.location.href = "#apply";
                    onClose();
                  }}
                  className="w-full"
                >
                  Go to Pre-Registration Form
                </Button>
              </div>
            ) : (
              <form onSubmit={handleCreateProject}>
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium mb-3">
                      Select Your Team *
                    </label>
                    <select
                      value={selectedTeam}
                      onChange={(e) => setSelectedTeam(e.target.value)}
                      className="w-full rounded-md border border-black/10 bg-white px-3 py-2 text-sm dark:border-white/20 dark:bg-black"
                      required
                      disabled={isCreatingProject}
                    >
                      <option value="">Select a team...</option>
                      {teams.map((team) => (
                        <option key={team.id} value={team.id}>
                          {team.teamName}
                        </option>
                      ))}
                    </select>
                  </div>

                  {selectedTeam && (
                    <>
                      {selectedTeamHasProject ? (
                        <div className="rounded-lg border border-black/10 bg-black/[0.02] p-3 text-sm text-black/70 dark:border-white/10 dark:bg-white/[0.03] dark:text-white/70">
                          <div className="flex items-center justify-between gap-3">
                            <div>
                              <div className="text-xs font-semibold text-black/70 dark:text-white/70">
                                Existing project
                              </div>
                              <div className="mt-1 text-sm font-semibold">
                                {selectedTeamProjectName || "Untitled"}
                              </div>
                              {selectedTeamProjectGithubRepo ? (
                                <a
                                  href={selectedTeamProjectGithubRepo}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="mt-1 block truncate text-xs text-blue-600 hover:underline dark:text-blue-400"
                                >
                                  {selectedTeamProjectGithubRepo}
                                </a>
                              ) : null}
                            </div>
                          </div>
                          <p className="mt-2 text-xs text-black/60 dark:text-white/60">
                            Only one project per team. Update the name/repo below if needed.
                          </p>
                        </div>
                      ) : null}

                      <div>
                        <label className="block text-sm font-medium mb-3">
                          Project Name *
                        </label>
                        <input
                          type="text"
                          value={projectName}
                          onChange={(e) => setProjectName(e.target.value)}
                          placeholder="My Awesome Project"
                          className="w-full rounded-md border border-black/10 bg-white px-3 py-2 text-sm dark:border-white/20 dark:bg-black"
                          required
                          disabled={isCreatingProject}
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-3">
                          GitHub Repository *
                        </label>
                        <input
                          type="url"
                          value={githubRepo}
                          onChange={(e) => setGithubRepo(e.target.value)}
                          placeholder="https://github.com/username/project"
                          className="w-full rounded-md border border-black/10 bg-white px-3 py-2 text-sm dark:border-white/20 dark:bg-black"
                          required
                          disabled={isCreatingProject}
                        />
                        <p className="mt-2 text-xs text-black/60 dark:text-white/60">
                          Rule: GitHub repos should have no code before the buildathon start date (2026-01-19). Only README, LICENSE, and .gitignore files are allowed.
                        </p>
                      </div>

                      {error && (
                        <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
                      )}

                      {selectedTeamHasProject ? (
                        <Button
                          type="button"
                          className="w-full"
                          disabled={isCreatingProject}
                          onClick={handleUpdateRegistrationProject}
                        >
                          {isCreatingProject ? "Updating..." : "Update project"}
                        </Button>
                      ) : (
                        <Button type="submit" className="w-full" disabled={isCreatingProject}>
                          {isCreatingProject ? "Creating Project..." : "Create Project & Register"}
                        </Button>
                      )}
                    </>
                  )}
                </div>
              </form>
            )}
          </div>
        );

      case "testnet":
        return (
          <div className="space-y-6">
            {renderNonRegistrationGate(
              <>
                {renderTeamSelector()}
                {renderProjectSelector()}
                {selectedProject && isLocked && prereqKey ? (
                  <div className="rounded-lg border border-amber-500/40 bg-amber-500/10 p-3 text-sm text-amber-800 dark:text-amber-200">
                    Complete <span className="font-semibold">{milestoneLabelByKey[prereqKey]}</span> first to unlock this milestone.
                  </div>
                ) : null}
                {renderExistingSubmissionNotice()}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Testnet Contract Address
                  </label>
                  <input
                    type="text"
                    value={formData.contractAddress}
                    onChange={(e) => setField("contractAddress", e.target.value)}
                    placeholder="0x..."
                    className="w-full rounded-md border border-black/10 bg-white px-3 py-2 text-sm dark:border-white/20 dark:bg-black"
                    required
                    disabled={isSubmitting || isLocked}
                  />
                </div>
                {error && (
                  <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
                )}
                <Button type="submit" className="w-full" disabled={isSubmitting || isLocked}>
                  {isSubmitting
                    ? "Submitting..."
                    : hasActiveSubmission
                      ? "Update Testnet Deployment"
                      : "Submit Testnet Deployment"}
                </Button>
              </>,
            )}
          </div>
        );

      case "karma-gap":
        return (
          <div className="space-y-6">
            {renderNonRegistrationGate(
              <>
                {renderTeamSelector()}
                {renderProjectSelector()}
                {selectedProject && isLocked && prereqKey ? (
                  <div className="rounded-lg border border-amber-500/40 bg-amber-500/10 p-3 text-sm text-amber-800 dark:text-amber-200">
                    Complete <span className="font-semibold">{milestoneLabelByKey[prereqKey]}</span> first to unlock this milestone.
                  </div>
                ) : null}
                {renderExistingSubmissionNotice()}

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Karma Gap Project Link
                  </label>
                  <input
                    type="url"
                    value={formData.karmaGapLink}
                    onChange={(e) => setField("karmaGapLink", e.target.value)}
                    placeholder="https://www.karmahq.xyz/project/..."
                    pattern="https://www\.karmahq\.xyz/project/.*"
                    className="w-full rounded-md border border-black/10 bg-white px-3 py-2 text-sm dark:border-white/20 dark:bg-black"
                    required
                    disabled={isSubmitting || isLocked}
                  />
                </div>
                {error && (
                  <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
                )}
                <Button type="submit" className="w-full" disabled={isSubmitting || isLocked}>
                  {isSubmitting
                    ? "Submitting..."
                    : hasActiveSubmission
                      ? "Update Karma Gap Project"
                      : "Submit Karma Gap Project"}
                </Button>
              </>,
            )}
          </div>
        );

      case "mainnet":
        return (
          <div className="space-y-6">
            {renderNonRegistrationGate(
              <>
                {renderTeamSelector()}
                {renderProjectSelector()}
                {selectedProject && isLocked && prereqKey ? (
                  <div className="rounded-lg border border-amber-500/40 bg-amber-500/10 p-3 text-sm text-amber-800 dark:text-amber-200">
                    Complete <span className="font-semibold">{milestoneLabelByKey[prereqKey]}</span> first to unlock this milestone.
                  </div>
                ) : null}
                {renderExistingSubmissionNotice()}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Mainnet Contract Address
                  </label>
                  <input
                    type="text"
                    value={formData.contractAddress}
                    onChange={(e) => setField("contractAddress", e.target.value)}
                    placeholder="0x..."
                    className="w-full rounded-md border border-black/10 bg-white px-3 py-2 text-sm dark:border-white/20 dark:bg-black"
                    required
                    disabled={isSubmitting || isLocked}
                  />
                </div>
                {error && (
                  <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
                )}
                <Button type="submit" className="w-full" disabled={isSubmitting || isLocked}>
                  {isSubmitting
                    ? "Submitting..."
                    : hasActiveSubmission
                      ? "Update Mainnet Deployment"
                      : "Submit Mainnet Deployment"}
                </Button>
              </>,
            )}
          </div>
        );

      case "farcaster":
        return (
          <div className="space-y-6">
            {renderNonRegistrationGate(
              <>
                {renderTeamSelector()}
                {renderProjectSelector()}
                {selectedProject && isLocked && prereqKey ? (
                  <div className="rounded-lg border border-amber-500/40 bg-amber-500/10 p-3 text-sm text-amber-800 dark:text-amber-200">
                    Complete <span className="font-semibold">{milestoneLabelByKey[prereqKey]}</span> first to unlock this milestone.
                  </div>
                ) : null}
                {renderExistingSubmissionNotice()}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Farcaster Miniapp Link
                  </label>
                  <input
                    type="url"
                    value={formData.farcasterLink}
                    onChange={(e) => setField("farcasterLink", e.target.value)}
                    placeholder="https://..."
                    className="w-full rounded-md border border-black/10 bg-white px-3 py-2 text-sm dark:border-white/20 dark:bg-black"
                    required
                    disabled={isSubmitting || isLocked}
                  />
                </div>
                <p className="text-xs text-black/60 dark:text-white/60">
                  Optional milestone - only submit if applicable to your project
                </p>
                {error && (
                  <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
                )}
                <Button type="submit" className="w-full" disabled={isSubmitting || isLocked}>
                  {isSubmitting
                    ? "Submitting..."
                    : hasActiveSubmission
                      ? "Update Farcaster Integration"
                      : "Submit Farcaster Integration"}
                </Button>
              </>,
            )}
          </div>
        );

      case "final-submission":
        return (
          <div className="space-y-6">
            {renderNonRegistrationGate(
              <>
                {renderTeamSelector()}
                {renderProjectSelector()}
                {selectedProject && isLocked && prereqKey ? (
                  <div className="rounded-lg border border-amber-500/40 bg-amber-500/10 p-3 text-sm text-amber-800 dark:text-amber-200">
                    Complete <span className="font-semibold">{milestoneLabelByKey[prereqKey]}</span> first to unlock this milestone.
                  </div>
                ) : null}
                {renderExistingSubmissionNotice()}

                {selectedProject && projectSubmissions && (
                  <div className="rounded-lg border border-black/10 bg-black/5 p-4 dark:border-white/10 dark:bg-white/5">
                    <h4 className="text-sm font-semibold mb-2">Project Details</h4>
                    <div className="space-y-1 text-xs text-black/70 dark:text-white/70">
                      {projectSubmissions.TESTNET?.contractAddress && (
                        <p>
                          <strong>Testnet:</strong> {projectSubmissions.TESTNET.contractAddress}
                        </p>
                      )}
                      {projectSubmissions.MAINNET?.contractAddress && (
                        <p>
                          <strong>Mainnet:</strong> {projectSubmissions.MAINNET.contractAddress}
                        </p>
                      )}
                      {projectSubmissions.KARMA_GAP?.karmaGapLink && (
                        <p>
                          <strong>Karma Gap:</strong> {projectSubmissions.KARMA_GAP.karmaGapLink}
                        </p>
                      )}
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Slides Link
                  </label>
                  <input
                    type="url"
                    value={formData.slidesLink}
                    onChange={(e) => setField("slidesLink", e.target.value)}
                    placeholder="https://docs.google.com/presentation/..."
                    className="w-full rounded-md border border-black/10 bg-white px-3 py-2 text-sm dark:border-white/20 dark:bg-black"
                    required
                    disabled={isSubmitting || isLocked}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Pitch Deck Link
                  </label>
                  <input
                    type="url"
                    value={formData.pitchDeckLink}
                    onChange={(e) => setField("pitchDeckLink", e.target.value)}
                    placeholder="https://..."
                    className="w-full rounded-md border border-black/10 bg-white px-3 py-2 text-sm dark:border-white/20 dark:bg-black"
                    required
                    disabled={isSubmitting || isLocked}
                  />
                </div>

                {error && (
                  <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
                )}
                <Button type="submit" className="w-full" disabled={isSubmitting || isLocked}>
                  {isSubmitting
                    ? "Submitting..."
                    : hasActiveSubmission
                      ? "Update Final Project"
                      : "Submit Final Project"}
                </Button>
              </>,
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Dialog.Root
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm" />
        <Dialog.Content className="fixed left-1/2 top-1/2 z-50 w-full max-w-md -translate-x-1/2 -translate-y-1/2 rounded-xl border border-black/10 bg-background p-8 shadow-xl dark:border-white/10">
          <Dialog.Title className="text-lg font-semibold">
            {milestone.step}
          </Dialog.Title>
          <Dialog.Description className="mt-2 text-sm text-black/70 dark:text-white/70">
            Submit your progress for this milestone
          </Dialog.Description>

          <div className="mt-8">
            {milestone.type === "registration" ? (
              renderForm()
            ) : (
              <form onSubmit={handleSubmit}>{renderForm()}</form>
            )}
          </div>

          <Dialog.Close asChild>
            <button
              className="absolute right-4 top-4 rounded-md p-2 text-black/50 hover:bg-black/5 hover:text-black dark:text-white/50 dark:hover:bg-white/5 dark:hover:text-white"
              aria-label="Close"
            >
              <Cross2Icon />
            </button>
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
