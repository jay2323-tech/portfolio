"use client";

import { useReducedMotion, useScroll, useTransform, type MotionValue } from "framer-motion";
import type { RefObject } from "react";

export type HeroScrollValues = {
  nameY: MotionValue<number>;
  nameOpacity: MotionValue<number>;
  shapesScale: MotionValue<number>;
  shapesOpacity: MotionValue<number>;
  marqueeOpacity: MotionValue<number>;
  cueOpacity: MotionValue<number>;
  progress: MotionValue<number>;
};

/**
 * Scroll-scrubbed transforms for the hero section.
 * Offset: section top at viewport top → section bottom at viewport top.
 */
export function useHeroScroll(
  ref: RefObject<HTMLElement | null>,
): HeroScrollValues {
  const reduce = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const nameY = useTransform(
    scrollYProgress,
    [0, 1],
    reduce ? [0, 0] : [0, 80],
  );
  const nameOpacity = useTransform(
    scrollYProgress,
    [0, 1],
    reduce ? [1, 1] : [1, 0.25],
  );
  const shapesScale = useTransform(
    scrollYProgress,
    [0, 1],
    reduce ? [1, 1] : [1, 1.12],
  );
  const shapesOpacity = useTransform(
    scrollYProgress,
    [0, 1],
    reduce ? [1, 1] : [1, 0.35],
  );
  const marqueeOpacity = useTransform(
    scrollYProgress,
    [0, 1],
    reduce ? [1, 1] : [1, 0.45],
  );
  const cueOpacity = useTransform(
    scrollYProgress,
    [0, 0.3],
    reduce ? [1, 1] : [1, 0],
  );

  return {
    nameY,
    nameOpacity,
    shapesScale,
    shapesOpacity,
    marqueeOpacity,
    cueOpacity,
    progress: scrollYProgress,
  };
}
