"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";
import { lineReveal } from "@/lib/motion/variants";
import { cn } from "@/lib/utils";

type Props = {
  children: ReactNode;
  className?: string;
  /** Delay before this line animates (seconds) */
  delay?: number;
  /** When false, skip entrance (useful if parent drives timeline) */
  animate?: boolean;
};

/**
 * Overflow-hidden wrapper: child rises from below (Juba line reveal).
 * Line-level only — not per-character.
 */
export function TextLine({
  children,
  className,
  delay = 0,
  animate = true,
}: Props) {
  const reduce = useReducedMotion();

  if (reduce || !animate) {
    return <div className={cn("overflow-hidden", className)}>{children}</div>;
  }

  return (
    <div className={cn("overflow-hidden", className)}>
      <motion.div
        variants={lineReveal}
        initial="hidden"
        animate="visible"
        transition={{ delay }}
      >
        {children}
      </motion.div>
    </div>
  );
}
