"use client";

import { useReducedMotion } from "framer-motion";

/**
 * Fixed site-wide film-grain overlay.
 * Hidden when prefers-reduced-motion.
 */
export function GrainOverlay() {
  const reduce = useReducedMotion();
  if (reduce) return null;

  return (
    <div className="site-grain pointer-events-none fixed inset-0 z-[5]" aria-hidden>
      <div className="site-grain__layer" />
    </div>
  );
}
