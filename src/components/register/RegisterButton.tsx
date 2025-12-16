"use client";

import * as React from "react";

import { Button } from "@/components/ui/button";
import Squares from "@/components/home/Squares";
import RegisterProjectModal from "@/components/register/RegisterProjectModal";
import { cn } from "@/lib/cn";

export default function RegisterButton({
  label = "Apply",
  variant = "secondary",
  size = "md",
  withSquares = false,
  autoOpen = false,
  className,
}: {
  label?: string;
  variant?: React.ComponentProps<typeof Button>["variant"];
  size?: React.ComponentProps<typeof Button>["size"];
  withSquares?: boolean;
  autoOpen?: boolean;
  className?: string;
}) {
  const [open, setOpen] = React.useState(false);
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
    if (autoOpen) {
      // Small delay to ensure proper rendering
      const timer = setTimeout(() => setOpen(true), 100);
      return () => clearTimeout(timer);
    }
  }, [autoOpen]);

  return (
    <>
      <Button
        variant={variant}
        size={size}
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
      {mounted ? <RegisterProjectModal open={open} onOpenChange={setOpen} /> : null}
    </>
  );
}


