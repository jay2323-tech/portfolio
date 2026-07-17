"use client";

import { motion, type MotionStyle } from "framer-motion";
import { cn } from "@/lib/utils";

type Props = {
  lines: string[];
  className?: string;
  style?: MotionStyle;
};

/** Juba meta: horizontal square-bullet stats — GSAP via [data-hero-meta]. */
export function HeroMeta({ lines, className, style }: Props) {
  return (
    <motion.div data-hero-meta style={style} className={className}>
      <ul
        className={cn(
          "flex flex-col gap-2.5 font-mono-data text-[10px] uppercase tracking-[0.14em] text-muted sm:flex-row sm:flex-wrap sm:items-center sm:gap-x-8 sm:gap-y-2 md:text-[11px]",
        )}
      >
        {lines.map((line) => (
          <li key={line} className="flex items-center gap-2">
            <span
              className="inline-block h-1.5 w-1.5 shrink-0 bg-mint-deep"
              aria-hidden
            />
            {line}
          </li>
        ))}
      </ul>
    </motion.div>
  );
}
