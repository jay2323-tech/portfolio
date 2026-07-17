"use client";

import { motion, useReducedMotion, type MotionValue } from "framer-motion";
import { cn } from "@/lib/utils";

type Props = {
  href?: string;
  className?: string;
  opacity?: MotionValue<number>;
  delay?: number;
};

/** Editorial-style ▼ SCROLL cue — entrance owned by parent GSAP when delay=0. */
export function HeroScrollCue({
  href = "#work",
  className,
  opacity,
}: Props) {
  const reduce = useReducedMotion();

  return (
    <motion.div style={opacity != null ? { opacity } : undefined}>
      <a
        href={href}
        className={cn(
          "inline-flex items-center gap-2 font-mono-data text-[11px] tracking-[0.18em] text-ink",
          "transition-colors hover:text-accent-clay",
          className,
        )}
      >
        <motion.span
          aria-hidden
          className="inline-block text-sm leading-none"
          animate={reduce ? undefined : { y: [0, 4, 0] }}
          transition={
            reduce
              ? undefined
              : {
                  duration: 1.6,
                  repeat: Infinity,
                  ease: "easeInOut",
                }
          }
        >
          ▼
        </motion.span>
        SCROLL
      </a>
    </motion.div>
  );
}
