"use client";

import { motion, useScroll } from "framer-motion";

/**
 * Slim fixed top-edge bar reflecting page scroll progress via scaleX.
 * Not gated on reduced-motion — it's a 1:1 reflection of scroll position,
 * not an autoplaying effect (same precedent as StatusBar's SCRL value).
 */
export function ScrollProgressBar() {
  const { scrollYProgress } = useScroll();

  return (
    <motion.div
      className="pointer-events-none fixed inset-x-0 top-0 z-[var(--z-hud)] h-px origin-left bg-accent-clay"
      style={{ scaleX: scrollYProgress }}
      aria-hidden
    />
  );
}
