"use client";

import { motion, type MotionStyle } from "framer-motion";
import { cn } from "@/lib/utils";

type Props = {
  lines: string[];
  className?: string;
  style?: MotionStyle;
};

/**
 * Hero meta chips — GSAP via [data-hero-meta] / [data-hero-chip].
 * Leading digits get [data-count-up] for odometer.
 */
export function HeroMeta({ lines, className, style }: Props) {
  return (
    <motion.div data-hero-meta style={style} className={className}>
      <ul
        className={cn(
          "flex flex-col gap-2.5 font-mono-data text-[10px] uppercase tracking-[0.14em] text-muted sm:flex-row sm:flex-wrap sm:items-center sm:gap-x-8 sm:gap-y-2 md:text-[11px]",
        )}
      >
        {lines.map((line) => {
          const match = line.match(/^(\d+)(.*)$/);
          return (
            <li
              key={line}
              data-hero-chip
              className="flex items-center gap-2 will-change-transform"
            >
              <span
                className="inline-block h-1.5 w-1.5 shrink-0 bg-mint-deep"
                aria-hidden
              />
              {match ? (
                <span>
                  <span data-count-up={match[1]} className="text-ink tabular-nums">
                    0
                  </span>
                  {match[2]}
                </span>
              ) : (
                line
              )}
            </li>
          );
        })}
      </ul>
    </motion.div>
  );
}
