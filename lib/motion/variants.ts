import type { Variants } from "framer-motion";
import { editorialEase } from "./easing";

/** Line-level typographic reveal (overflow clip + rise) */
export const lineReveal: Variants = {
  hidden: { opacity: 0, y: "110%" },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.85,
      ease: editorialEase,
    },
  },
};

/** Horizontal clip reveal for marquees (left → right) */
export const clipRevealLeft: Variants = {
  hidden: { clipPath: "inset(0 100% 0 0)" },
  visible: {
    clipPath: "inset(0 0% 0 0)",
    transition: {
      duration: 0.9,
      ease: editorialEase,
    },
  },
};

/** Horizontal clip reveal for marquees (right → left) */
export const clipRevealRight: Variants = {
  hidden: { clipPath: "inset(0 0 0 100%)" },
  visible: {
    clipPath: "inset(0 0% 0 0)",
    transition: {
      duration: 0.9,
      ease: editorialEase,
    },
  },
};

/** Container that staggers children */
export const staggerContainer = (stagger = 0.08, delayChildren = 0): Variants => ({
  hidden: {},
  visible: {
    transition: {
      staggerChildren: stagger,
      delayChildren,
    },
  },
});

/** Simple fade-up for scroll-in reveals */
export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 18 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.55,
      ease: editorialEase,
    },
  },
};

/** Slightly stronger rise for list rows */
export const fadeUpStrong: Variants = {
  hidden: { opacity: 0, y: 28, filter: "blur(4px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: {
      duration: 0.65,
      ease: editorialEase,
    },
  },
};

/** Slide in from the right — mobile nav links, drawer-style panels */
export const slideInRight: Variants = {
  hidden: { opacity: 0, x: 28 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.5,
      ease: editorialEase,
    },
  },
};
