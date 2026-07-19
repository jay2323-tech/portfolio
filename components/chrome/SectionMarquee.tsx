"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "framer-motion";
import { gsap, registerGsap, ScrollTrigger } from "@/lib/gsap/setup";
import { cn } from "@/lib/utils";

type Props = {
  text: string;
  className?: string;
  /** Opposite direction from other section wheels */
  reverse?: boolean;
};

/**
 * Section title wheel — moves only while scrolling (scrubbed to the
 * parent section). Idle = still. Featured Work uses WorkStageMarquee
 * for the infinite loop.
 */
export function SectionMarquee({ text, className, reverse = false }: Props) {
  const rootRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();

  // Tight word gap + small separator between repeats
  const unit = `${text.trim().replace(/\s+/g, "\u2006").toUpperCase()} `;
  const sequence = unit.repeat(8);

  useEffect(() => {
    if (reduce === true) return;

    const root = rootRef.current;
    const track = trackRef.current;
    if (!root || !track) return;

    registerGsap();

    const section =
      (root.closest("section") as HTMLElement | null) ?? root;

    const setFromProgress = (progress: number) => {
      const travel = Math.max(480, Math.min(track.scrollWidth * 0.4, 1400));
      const x = reverse
        ? -travel + progress * travel
        : -progress * travel;
      gsap.set(track, { x });
    };

    const st = ScrollTrigger.create({
      trigger: section,
      start: "top bottom",
      end: "bottom top",
      invalidateOnRefresh: true,
      onUpdate: (self) => setFromProgress(self.progress),
      onRefresh: (self) => setFromProgress(self.progress),
    });

    // WorkStage pin / fonts can shift layout — refresh a few times
    const t1 = window.setTimeout(() => ScrollTrigger.refresh(), 100);
    const t2 = window.setTimeout(() => ScrollTrigger.refresh(), 600);
    const onLoad = () => ScrollTrigger.refresh();
    window.addEventListener("load", onLoad);

    return () => {
      window.clearTimeout(t1);
      window.clearTimeout(t2);
      window.removeEventListener("load", onLoad);
      st.kill();
    };
  }, [reduce, text, reverse]);

  return (
    <div
      ref={rootRef}
      className={cn(
        "relative mt-4 overflow-hidden border-y border-ink/8 py-2 md:mt-5 md:py-4",
        className,
      )}
      aria-hidden
    >
      <div
        ref={trackRef}
        className="flex w-max whitespace-nowrap font-mono text-[clamp(2.25rem,11vw,9rem)] font-medium uppercase leading-none tracking-[-0.04em] text-ink/[0.14] will-change-transform"
      >
        <span>{sequence}</span>
        <span>{sequence}</span>
      </div>
    </div>
  );
}
