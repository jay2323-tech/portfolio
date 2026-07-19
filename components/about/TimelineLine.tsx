"use client";

import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";

type Props = {
  color?: string;
};

/**
 * Continuous line that draws down its container as you scroll past it —
 * a scroll-scrubbed alternative to per-row entrance bars. Absolutely
 * positioned against a `position: relative` parent (the timeline `<ol>`).
 */
export function TimelineLine({ color = "var(--accent-clay)" }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 85%", "end 65%"],
  });
  const scaleY = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <div
      ref={ref}
      className="pointer-events-none absolute inset-y-0 left-0 w-[2px]"
      aria-hidden
    >
      <motion.div
        className="h-full w-full"
        style={{
          background: color,
          transformOrigin: "top",
          scaleY: reduce ? 1 : scaleY,
        }}
      />
    </div>
  );
}
