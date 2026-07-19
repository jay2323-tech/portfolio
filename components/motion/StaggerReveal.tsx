"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";
import { staggerContainer, fadeUp } from "@/lib/motion/variants";
import { useSafeReducedMotion } from "@/lib/motion/useSafeReducedMotion";
import { cn } from "@/lib/utils";

type Props = {
  children: ReactNode;
  className?: string;
  /** Stagger between children (seconds) */
  stagger?: number;
  /** Delay before first child (seconds) */
  delayChildren?: number;
  /** Use as list container — renders motion.ul / motion.ol */
  as?: "div" | "ul" | "ol";
  /** Trigger on scroll into view (default) vs on mount */
  mode?: "inView" | "mount";
};

/**
 * Staggers children with fade-up. Children should be direct motion-friendly nodes
 * or wrap each child so it can inherit variants.
 */
export function StaggerReveal({
  children,
  className,
  stagger = 0.08,
  delayChildren = 0,
  as = "div",
  mode = "inView",
}: Props) {
  const reduce = useSafeReducedMotion();
  const MotionTag =
    as === "ul" ? motion.ul : as === "ol" ? motion.ol : motion.div;

  if (reduce) {
    const Tag = as === "ul" ? "ul" : as === "ol" ? "ol" : "div";
    return <Tag className={className}>{children}</Tag>;
  }

  const shared = {
    className: cn(className),
    variants: staggerContainer(stagger, delayChildren),
    initial: "hidden" as const,
  };

  if (mode === "mount") {
    return (
      <MotionTag {...shared} animate="visible">
        {children}
      </MotionTag>
    );
  }

  return (
    <MotionTag
      {...shared}
      whileInView="visible"
      viewport={{ once: true, margin: "-60px" }}
    >
      {children}
    </MotionTag>
  );
}

/** Child item for StaggerReveal — applies fadeUp variant */
export function StaggerItem({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const reduce = useSafeReducedMotion();

  if (reduce) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div className={className} variants={fadeUp}>
      {children}
    </motion.div>
  );
}

/** List-item variant for StaggerReveal as="ul" */
export function StaggerItemLi({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const reduce = useSafeReducedMotion();

  if (reduce) {
    return <li className={className}>{children}</li>;
  }

  return (
    <motion.li className={className} variants={fadeUp}>
      {children}
    </motion.li>
  );
}
