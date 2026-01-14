import * as React from "react";

import { cn } from "@/lib/cn";

export function Container({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  return <div className={cn("mx-auto w-full max-w-6xl px-4 sm:px-6", className)} {...props} />;
}

export function Section({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"section">) {
  return (
    <section className={cn("py-8 sm:py-12", className)} {...props} />
  );
}

export function SectionHeader({
  title,
  eyebrow,
  description,
  className,
}: {
  title: string;
  eyebrow?: string;
  description?: string;
  className?: string;
}) {
  return (
    <div className={cn("max-w-2xl", className)}>
      {eyebrow ? (
        <div className="text-sm font-semibold uppercase tracking-wider text-[color:var(--celo-muted)]">
          {eyebrow}
        </div>
      ) : null}
      <h2 className="mt-4 text-balance text-3xl font-title font-[200] leading-[1.15] tracking-tight sm:text-4xl">
        {title}
      </h2>
      {description ? (
        <p className="mt-6 text-pretty text-base leading-[1.75] text-black/70 dark:text-white/70">
          {description}
        </p>
      ) : null}
    </div>
  );
}


