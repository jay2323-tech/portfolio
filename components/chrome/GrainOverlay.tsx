"use client";

import { useSafeReducedMotion } from "@/lib/motion/useSafeReducedMotion";

/**
 * Fixed site-wide film-grain overlay.
 * Hidden when prefers-reduced-motion (after mount — SSR always renders).
 */
export function GrainOverlay() {
  const reduce = useSafeReducedMotion();
  if (reduce) return null;

  return (
    <div className="site-grain pointer-events-none fixed inset-0 z-[5]" aria-hidden>
      <div className="site-grain__layer" />
    </div>
  );
}
