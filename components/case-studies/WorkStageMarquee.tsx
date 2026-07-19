"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "framer-motion";
import { gsap, registerGsap } from "@/lib/gsap/setup";
import { cn } from "@/lib/utils";

type Props = {
  className?: string;
  /** Ref forwarded for pin-scrubbed x motion from WorkStage */
  scrubRef?: React.RefObject<HTMLDivElement | null>;
};

/**
 * Giant FEATURED WORK wheel — FEATURED muted, WORK highlighted.
 * Infinite loop (only section marquee that auto-scrolls).
 */
export function WorkStageMarquee({ className, scrubRef }: Props) {
  const trackRef = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();

  useEffect(() => {
    if (reduce || !trackRef.current) return;
    registerGsap();
    const track = trackRef.current;
    const tween = gsap.to(track, {
      xPercent: -50,
      duration: 90,
      ease: "none",
      repeat: -1,
    });
    return () => {
      tween.kill();
    };
  }, [reduce]);

  return (
    <div
      className={cn(
        "pointer-events-none absolute inset-x-0 top-[4%] overflow-hidden opacity-75 md:top-[6%]",
        className,
      )}
      aria-hidden
    >
      <div ref={scrubRef} className="will-change-transform">
        <div
          ref={trackRef}
          className="flex w-max whitespace-nowrap font-mono text-[clamp(4rem,12vw,9.5rem)] font-medium uppercase leading-none tracking-[-0.05em] will-change-transform"
        >
          <MarqueeChunk />
          <MarqueeChunk />
        </div>
      </div>
    </div>
  );
}

function MarqueeChunk() {
  const unit = (
    <span className="inline-flex items-baseline">
      <span className="work-stage-mq-muted">FEATURED</span>
      <span className="inline-block w-[0.28em]" aria-hidden>
        {" "}
      </span>
      <span className="work-stage-mq-fill">WORK</span>
      <span className="inline-block w-[0.45em]" aria-hidden>
        {" "}
      </span>
    </span>
  );

  return (
    <span className="inline-flex">
      {unit}
      {unit}
      {unit}
      {unit}
      {unit}
      {unit}
    </span>
  );
}
