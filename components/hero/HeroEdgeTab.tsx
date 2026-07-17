"use client";

import { cn } from "@/lib/utils";

type Props = {
  label?: string;
  className?: string;
};

/** Fixed right-edge rotated tab ("Nominee" pattern). */
export function HeroEdgeTab({ label = "OPEN", className }: Props) {
  return (
    <div
      className={cn(
        "pointer-events-none absolute right-0 top-1/2 z-[2] hidden -translate-y-1/2 md:block",
        className,
      )}
      aria-hidden
    >
      <div className="origin-center translate-x-[42%] -rotate-90">
        <span className="inline-flex items-center gap-2 border border-ink/15 bg-surface px-3 py-1.5 font-mono-data text-[10px] tracking-[0.2em] text-ink shadow-sm">
          <span className="inline-block h-1.5 w-1.5 bg-mint-deep" />
          {label}
        </span>
      </div>
    </div>
  );
}
