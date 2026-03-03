"use client";

import { useEffect, useState } from "react";
import SubmitButton from "@/components/submit/SubmitButton";

const SUBMISSION_END_DATE = new Date("2026-03-08T23:59:59Z");

type TimeLeft = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  total: number;
};

function calculateTimeLeft(): TimeLeft {
  const now = new Date();
  const difference = SUBMISSION_END_DATE.getTime() - now.getTime();

  if (difference <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, total: 0 };
  }

  return {
    days: Math.floor(difference / (1000 * 60 * 60 * 24)),
    hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((difference / (1000 * 60)) % 60),
    seconds: Math.floor((difference / 1000) % 60),
    total: difference,
  };
}

export function useSubmissionDeadline() {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>(() => calculateTimeLeft());
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const isExpired = timeLeft.total <= 0;
  const isUrgent = timeLeft.total > 0 && timeLeft.days === 0 && timeLeft.hours < 6;

  return { timeLeft, isExpired, isUrgent, mounted };
}

export function Countdown({ className }: { className?: string }) {
  const { timeLeft, isExpired, isUrgent, mounted } = useSubmissionDeadline();

  // Prevent hydration mismatch
  if (!mounted) {
    return (
      <div className={className}>
        <div className="flex items-center justify-center gap-1 text-sm text-black/60 dark:text-white/60">
          Loading...
        </div>
      </div>
    );
  }

  if (isExpired) {
    return (
      <div className={className}>
        <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-6 text-center">
          <div className="text-lg font-semibold text-red-700 dark:text-red-300">
            Submissions Closed
          </div>
          <p className="mt-2 text-sm text-red-600 dark:text-red-400">
            The submission deadline has passed. Winners will be announced on Mar 16, 2026.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={className}>
      <div
        className={`rounded-2xl border p-6 ${
          isUrgent
            ? "border-red-500/40 bg-red-500/10 animate-pulse"
            : "border-amber-500/30 bg-amber-500/10"
        }`}
      >
        <div className="text-center">
          <div
            className={`text-xs font-semibold uppercase tracking-wider mb-3 ${
              isUrgent
                ? "text-red-700 dark:text-red-300"
                : "text-amber-700 dark:text-amber-300"
            }`}
          >
            {isUrgent ? "⚠️ Deadline approaching!" : "⏰ Time remaining to submit"}
          </div>

          <div className="flex items-center justify-center gap-3 sm:gap-4">
            <TimeUnit value={timeLeft.days} label="days" isUrgent={isUrgent} />
            <Separator isUrgent={isUrgent} />
            <TimeUnit value={timeLeft.hours} label="hours" isUrgent={isUrgent} />
            <Separator isUrgent={isUrgent} />
            <TimeUnit value={timeLeft.minutes} label="min" isUrgent={isUrgent} />
            <Separator isUrgent={isUrgent} />
            <TimeUnit value={timeLeft.seconds} label="sec" isUrgent={isUrgent} />
          </div>

          <div
            className={`mt-3 text-xs ${
              isUrgent
                ? "text-red-600 dark:text-red-400"
                : "text-amber-600 dark:text-amber-400"
            }`}
          >
            Deadline: Mar 8, 2026 at 23:59:59 UTC
          </div>

          {/* Compact timezone conversions */}
          <div className="mt-4 pt-4 border-t border-amber-300/30 dark:border-amber-600/30">
            <div className="text-[10px] sm:text-xs text-amber-700 dark:text-amber-300 mb-2">
              In your timezone (approx):
            </div>
            <div className="flex flex-wrap justify-center gap-2 text-[10px] sm:text-xs">
              <span className="px-2 py-1 rounded bg-white/50 dark:bg-black/20 text-amber-800 dark:text-amber-200">
                🇲🇽 5:59 PM
              </span>
              <span className="px-2 py-1 rounded bg-white/50 dark:bg-black/20 text-amber-800 dark:text-amber-200">
                🇨🇴 6:59 PM
              </span>
              <span className="px-2 py-1 rounded bg-white/50 dark:bg-black/20 text-amber-800 dark:text-amber-200">
                🇦🇷🇧🇷 8:59 PM
              </span>
            </div>
          </div>

          {/* Submit button */}
          <div className="mt-6">
            <SubmitButton
              label="Submit now"
              variant="primary"
              withSquares
              className="w-full sm:w-auto"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function TimeUnit({
  value,
  label,
  isUrgent,
}: {
  value: number;
  label: string;
  isUrgent: boolean;
}) {
  return (
    <div className="flex flex-col items-center">
      <div
        className={`text-2xl sm:text-3xl font-bold tabular-nums ${
          isUrgent
            ? "text-red-900 dark:text-red-100"
            : "text-amber-900 dark:text-amber-100"
        }`}
      >
        {String(value).padStart(2, "0")}
      </div>
      <div
        className={`text-[10px] sm:text-xs uppercase tracking-wider ${
          isUrgent
            ? "text-red-700 dark:text-red-300"
            : "text-amber-700 dark:text-amber-300"
        }`}
      >
        {label}
      </div>
    </div>
  );
}

function Separator({ isUrgent }: { isUrgent: boolean }) {
  return (
    <div
      className={`text-xl font-bold ${
        isUrgent
          ? "text-red-400 dark:text-red-500"
          : "text-amber-400 dark:text-amber-500"
      }`}
    >
      :
    </div>
  );
}

export default Countdown;
