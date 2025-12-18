"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import Squares from "@/components/home/Squares";
import EditTeamModal from "./EditTeamModal";
import { cn } from "@/lib/cn";

export default function EditTeamButton({
  label = "Edit Team",
  variant = "secondary",
  size = "md",
  withSquares = false,
  className,
}: {
  label?: string;
  variant?: React.ComponentProps<typeof Button>["variant"];
  size?: React.ComponentProps<typeof Button>["size"];
  withSquares?: boolean;
  className?: string;
}) {
  const [open, setOpen] = React.useState(false);

  // Check if current date is within the edit period (Dec 18, 2025 - Feb 27, 2026 UTC)
  const now = new Date();
  const startDate = new Date("2025-12-18T00:00:00Z");
  const endDate = new Date("2026-02-27T23:59:59Z");
  const isEditPeriodActive = now >= startDate && now <= endDate;

  return (
    <>
      <Button
        variant={variant}
        size={size}
        disabled={!isEditPeriodActive}
        className={cn(
          withSquares ? "relative overflow-hidden" : null,
          withSquares && variant === "primary"
            ? "[--grid-border-color:rgba(0,0,0,0.10)] [--grid-hover-color:rgba(0,0,0,0.07)]"
            : null,
          withSquares && variant !== "primary"
            ? "[--grid-border-color:rgba(0,0,0,0.10)] [--grid-hover-color:rgba(0,0,0,0.07)] dark:[--grid-border-color:rgba(255,255,255,0.18)] dark:[--grid-hover-color:rgba(255,255,255,0.11)]"
            : null,
          className,
        )}
        type="button"
        onClick={() => setOpen(true)}
        title={
          !isEditPeriodActive
            ? "Team editing is only available from Dec 18, 2025 to Feb 27, 2026 (UTC)"
            : undefined
        }
      >
        {withSquares ? (
          <>
            <Squares
              interaction="element"
              direction="diagonal"
              speed={0.1}
              squareSize={18}
              className={cn(
                "opacity-25",
                variant !== "primary" ? "dark:opacity-40" : null,
              )}
            />
            <span className="relative z-10">{label}</span>
          </>
        ) : (
          label
        )}
      </Button>
      {isEditPeriodActive && <EditTeamModal open={open} onOpenChange={setOpen} />}
    </>
  );
}
