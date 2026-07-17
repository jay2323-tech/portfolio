"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";
import { editorialEase } from "@/lib/motion/easing";

type Props = {
  children: ReactNode;
  className?: string;
  delay?: number;
};

export function Reveal({
  children,
  className,
  delay = 0,
}: Props) {
  const reduce = useReducedMotion();

  if (reduce) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{
        duration: 0.6,
        delay,
        ease: editorialEase,
      }}
    >
      {children}
    </motion.div>
  );
}
