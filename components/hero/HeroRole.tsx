"use client";

import { motion, type MotionStyle } from "framer-motion";
import { cn } from "@/lib/utils";

type Props = {
  title: string;
  subtitle: string;
  className?: string;
  style?: MotionStyle;
};

function WordLine({ text, className }: { text: string; className?: string }) {
  const words = text.split(/\s+/).filter(Boolean);
  return (
    <p className={className}>
      {words.map((word, i) => (
        <span key={`${word}-${i}`} className="inline-block overflow-hidden">
          <span data-hero-word className="inline-block will-change-transform">
            {word}
            {i < words.length - 1 ? "\u00A0" : ""}
          </span>
        </span>
      ))}
    </p>
  );
}

/** Role stack — word spans for sequenced GSAP entrance. */
export function HeroRole({ title, subtitle, className, style }: Props) {
  return (
    <motion.div
      data-hero-role
      style={style}
      className={cn("space-y-1", className)}
    >
      <WordLine
        text={title}
        className="font-mono-data text-[11px] uppercase tracking-[0.2em] text-ink md:text-xs"
      />
      <WordLine
        text={subtitle}
        className="font-mono-data text-[10px] uppercase tracking-[0.16em] text-muted md:text-[11px]"
      />
    </motion.div>
  );
}
