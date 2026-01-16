"use client";

import * as React from "react";

import { Button } from "@/components/ui/button";
import Squares from "@/components/home/Squares";
import SubmitModal from "@/components/submit/SubmitModal";
import { cn } from "@/lib/cn";

export default function SubmitButton({
  label = "Submit",
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
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  // Check if current date is within the submission period (Jan 19 - Feb 27, 2026 UTC)
  const now = new Date();
  const startDate = new Date("2026-01-19T00:00:00Z");
  const endDate = new Date("2026-02-27T23:59:59Z");
  const isSubmissionPeriodActive = now >= startDate && now <= endDate;

  return (
    <>
      <Button
        variant={variant}
        size={size}
        disabled={!isSubmissionPeriodActive}
        className={cn(
          withSquares ? "relative overflow-hidden" : null,
          withSquares && variant === "primary"
            ? "[--grid-border-color:rgba(0,0,0,0.10)] [--grid-hover-color:rgba(0,0,0,0.07)]"
            : null,
          // Secondary buttons are white in light mode and black in dark mode → invert grid for contrast.
          withSquares && variant !== "primary"
            ? "[--grid-border-color:rgba(0,0,0,0.10)] [--grid-hover-color:rgba(0,0,0,0.07)] dark:[--grid-border-color:rgba(255,255,255,0.18)] dark:[--grid-hover-color:rgba(255,255,255,0.11)]"
            : null,
          className,
        )}
        type="button"
        onClick={() => setOpen(true)}
        title={
          !isSubmissionPeriodActive
            ? "Project submission is only available from Jan 19, 2026 to Feb 27, 2026 (UTC)"
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
      {mounted && isSubmissionPeriodActive ? (
        <SubmitModal open={open} onOpenChange={setOpen} />
      ) : null}
    </>
  );
}
