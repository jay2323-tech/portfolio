"use client";

import { useEffect, useState } from "react";
import { motion, type MotionStyle } from "framer-motion";
import { cn } from "@/lib/utils";
import { clipRevealLeft, clipRevealRight } from "@/lib/motion/variants";
import { editorialEase } from "@/lib/motion/easing";

type Props = {
  text: string;
  speed?: number;
  className?: string;
  muted?: boolean;
  reverse?: boolean;
  /** Scroll-scrubbed style (e.g. opacity) from parent */
  style?: MotionStyle;
  /** Entrance delay in seconds */
  delay?: number;
};

export function HeroRoleMarquee({
  text,
  speed = 32,
  className,
  muted = false,
  reverse = false,
  style,
  delay = 0,
}: Props) {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const onChange = () => setReduced(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  if (reduced) {
    return (
      <p
        className={cn(
          "font-mono-data text-[11px] uppercase tracking-[0.22em] md:text-xs",
          muted ? "text-muted" : "text-ink/70",
          className,
        )}
      >
        {text}
      </p>
    );
  }

  const items = Array.from({ length: 12 }, (_, i) => (
    <span key={i} className="mx-5 inline-block whitespace-nowrap md:mx-8">
      {text}
    </span>
  ));

  return (
    <motion.div
      className={cn("group overflow-hidden py-1", className)}
      style={style}
      variants={reverse ? clipRevealRight : clipRevealLeft}
      initial="hidden"
      animate="visible"
      transition={{ delay, ease: editorialEase }}
      aria-hidden
    >
      <div
        className={cn(
          "flex w-max font-mono-data text-[11px] uppercase tracking-[0.22em] md:text-xs",
          muted ? "text-muted" : "text-ink/65",
          reverse ? "marquee-track-reverse" : "marquee-track",
        )}
        style={{ animationDuration: `${speed}s` }}
      >
        {items}
        {items}
      </div>
      <span className="sr-only">{text}</span>
    </motion.div>
  );
}
