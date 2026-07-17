"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";
import { gsap, registerGsap, ScrollTrigger } from "@/lib/gsap/setup";
import { cn } from "@/lib/utils";

type Props = {
  text: string;
  className?: string;
};

function prefersCoarsePointer() {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(hover: none), (pointer: coarse)").matches;
}

/**
 * Section title: infinite wheel + scroll scrub (scrub off on touch).
 */
export function SectionMarquee({ text, className }: Props) {
  const rootRef = useRef<HTMLDivElement>(null);
  const scrubRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const [coarse, setCoarse] = useState(false);

  const joined = text.replace(/\s+/g, "");
  const sequence = joined.repeat(8);

  useEffect(() => {
    setCoarse(prefersCoarsePointer());
    const mq = window.matchMedia("(hover: none), (pointer: coarse)");
    const onChange = () => setCoarse(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    if (reduce || !rootRef.current || !scrubRef.current || !trackRef.current) {
      return;
    }
    registerGsap();

    const root = rootRef.current;
    const scrub = scrubRef.current;
    const track = trackRef.current;

    const ctx = gsap.context(() => {
      const loop = gsap.to(track, {
        xPercent: -50,
        duration: coarse ? 40 : 28,
        ease: "none",
        repeat: -1,
      });

      if (!coarse) {
        gsap.fromTo(
          scrub,
          { x: 80 },
          {
            x: -220,
            ease: "none",
            scrollTrigger: {
              trigger: root,
              start: "top bottom",
              end: "bottom top",
              scrub: 0.35,
              onUpdate(self) {
                loop.timeScale(self.direction === -1 ? -1 : 1);
              },
            },
          },
        );
      }
    }, root);

    ScrollTrigger.refresh();

    return () => ctx.revert();
  }, [reduce, text, coarse]);

  return (
    <div
      ref={rootRef}
      className={cn(
        "relative mt-4 overflow-hidden border-y border-ink/8 py-2 md:mt-5 md:py-4",
        className,
      )}
      aria-hidden
    >
      <div ref={scrubRef} className="will-change-transform">
        <div
          ref={trackRef}
          className="flex w-max whitespace-nowrap font-sans text-[clamp(2.25rem,11vw,9rem)] font-bold uppercase leading-none tracking-[-0.04em] text-ink/[0.1] will-change-transform"
        >
          <span>{sequence}</span>
          <span>{sequence}</span>
        </div>
      </div>
    </div>
  );
}
