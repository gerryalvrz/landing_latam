"use client";

import * as React from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";

type Props = {
  id: string;
  label: string;
  kind: "team" | "project" | "milestone";
};

export function AdminDeleteButton({ id, label, kind }: Props) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = React.useState(false);

  async function onDelete() {
    const confirmText =
      kind === "team"
        ? `Delete team "${label}"?\n\nThis will delete all its members, projects, and milestones.`
        : kind === "project"
          ? `Delete project "${label}"?\n\nThis will delete all its milestones.`
          : `Delete milestone "${label}"?`;

    if (!window.confirm(confirmText)) return;

    setIsDeleting(true);
    try {
      const url =
        kind === "team"
          ? `/api/teams?teamId=${encodeURIComponent(id)}`
          : kind === "project"
            ? `/api/projects?projectId=${encodeURIComponent(id)}`
            : `/api/milestones?milestoneId=${encodeURIComponent(id)}`;

      const res = await fetch(url, { method: "DELETE" });
      if (!res.ok) {
        const json = (await res.json().catch(() => null)) as { error?: string } | null;
        throw new Error(json?.error || "Delete failed");
      }

      router.refresh();
    } catch (err) {
      // Keep it simple and visible for admins
      alert(err instanceof Error ? err.message : "Delete failed");
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <Button
      type="button"
      variant="ghost"
      size="sm"
      onClick={onDelete}
      disabled={isDeleting}
      className="text-red-600 hover:bg-red-500/10 hover:text-red-700 dark:text-red-400 dark:hover:bg-red-500/10 dark:hover:text-red-300"
    >
      {isDeleting ? "Deleting..." : "Delete"}
    </Button>
  );
}

