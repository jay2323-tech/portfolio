"use client";

import { motion, type MotionStyle } from "framer-motion";
import { cn } from "@/lib/utils";

type Props = {
  title: string;
  subtitle: string;
  className?: string;
  style?: MotionStyle;
};

/** Static role stack — GSAP handles entrance via [data-hero-role]. */
export function HeroRole({ title, subtitle, className, style }: Props) {
  return (
    <motion.div
      data-hero-role
      style={style}
      className={cn("space-y-1", className)}
    >
      <p className="font-mono-data text-[11px] uppercase tracking-[0.2em] text-ink md:text-xs">
        {title}
      </p>
      <p className="font-mono-data text-[10px] uppercase tracking-[0.16em] text-muted md:text-[11px]">
        {subtitle}
      </p>
    </motion.div>
  );
}
