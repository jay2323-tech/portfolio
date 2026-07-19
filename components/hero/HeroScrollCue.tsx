"use client";

import { motion, type MotionValue } from "framer-motion";
import { cn } from "@/lib/utils";

type Props = {
  href?: string;
  className?: string;
  opacity?: MotionValue<number>;
  delay?: number;
};

/** ▼ SCROLL cue — looping draw-on line + fade/opacity owned by parent GSAP. */
export function HeroScrollCue({
  href = "#work",
  className,
  opacity,
}: Props) {
  return (
    <motion.div style={opacity != null ? { opacity } : undefined}>
      <a
        href={href}
        data-cursor="view"
        className={cn(
          "group inline-flex flex-col items-center gap-2 font-mono-data text-[11px] tracking-[0.18em] text-ink",
          "transition-colors hover:text-accent-clay",
          className,
        )}
      >
        <svg
          width="14"
          height="22"
          viewBox="0 0 14 22"
          fill="none"
          aria-hidden
          className="scroll-cue-svg text-current"
        >
          <path
            d="M7 1V19"
            stroke="currentColor"
            strokeWidth="1.4"
            strokeLinecap="round"
            className="scroll-cue-line"
          />
          <path
            d="M2 14L7 20L12 14"
            stroke="currentColor"
            strokeWidth="1.4"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="scroll-cue-chevron"
          />
        </svg>
        SCROLL
      </a>
    </motion.div>
  );
}
