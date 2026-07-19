"use client";

import { useEffect, useMemo, useRef } from "react";
import { SectionMarquee } from "./SectionMarquee";
import { MarqueeText } from "./MarqueeText";
import { gsap, registerGsap, ScrollTrigger } from "@/lib/gsap/setup";
import { countUp, parseLeadingCount } from "@/lib/motion/countUp";
import { useSafeReducedMotion } from "@/lib/motion/useSafeReducedMotion";
import { cn } from "@/lib/utils";

type Props = {
  index: string;
  title: string;
  meta?: string;
  /** Thin looping strip (legacy / optional) */
  marquee?: string;
  marqueeTint?: "mint" | "blush" | "sky" | "none";
  /** Giant infinite + scroll-scrub title marquee behind / below H2 */
  bgMarquee?: string;
  className?: string;
  headingId?: string;
};

/**
 * Section chrome: index + meta (count-up) + clip-path H2 + optional marquee wheel.
 */
export function SectionHeader({
  index,
  title,
  meta,
  marquee,
  marqueeTint = "mint",
  bgMarquee,
  className,
  headingId,
}: Props) {
  const rootRef = useRef<HTMLDivElement>(null);
  const reduce = useSafeReducedMotion();
  const parsed = useMemo(
    () => (meta ? parseLeadingCount(meta) : null),
    [meta],
  );

  useEffect(() => {
    if (reduce || !rootRef.current) return;
    registerGsap();
    const root = rootRef.current;
    const heading = root.querySelector<HTMLElement>("[data-section-heading]");
    const countEl = root.querySelector<HTMLElement>("[data-section-count]");
    const kills: Array<() => void> = [];

    const ctx = gsap.context(() => {
      if (heading && !heading.classList.contains("sr-only")) {
        gsap.fromTo(
          heading,
          { clipPath: "inset(0 100% 0 0)" },
          {
            clipPath: "inset(0 0% 0 0)",
            duration: 0.8,
            ease: "power4.inOut",
            scrollTrigger: {
              trigger: heading,
              start: "top 80%",
              toggleActions: "play none none none",
            },
          },
        );
      }

      if (countEl && parsed) {
        ScrollTrigger.create({
          trigger: countEl,
          start: "top 85%",
          once: true,
          onEnter: () => {
            kills.push(
              countUp(countEl, parsed.count, { duration: 0.6 }),
            );
          },
        });
      }
    }, root);

    ScrollTrigger.refresh();
    return () => {
      ctx.revert();
      kills.forEach((k) => k());
    };
  }, [reduce, parsed, title]);

  return (
    <div ref={rootRef} className={cn("relative", className)}>
      <div className="section-pad relative z-[1] mx-auto max-w-[var(--content-max)]">
        <p
          data-section-meta
          className="font-mono-data text-[11px] tracking-[0.16em] text-muted"
        >
          <span className="text-ink">{index}</span>
          {meta ? (
            <>
              <span className="mx-2 text-ink/20">/</span>
              {parsed ? (
                <span>
                  <span data-section-count className="text-ink tabular-nums">
                    0
                  </span>
                  {parsed.rest ? ` ${parsed.rest}` : ""}
                </span>
              ) : (
                <span>{meta}</span>
              )}
            </>
          ) : null}
        </p>

        <h2
          id={headingId}
          data-section-heading
          className="font-display mt-3 text-[clamp(2.25rem,5vw,4rem)] leading-[0.95] tracking-tight text-ink"
          style={reduce ? undefined : { clipPath: "inset(0 100% 0 0)" }}
        >
          {title}
        </h2>
      </div>

      {bgMarquee ? <SectionMarquee text={bgMarquee} reverse /> : null}

      {marquee ? (
        <MarqueeText text={marquee} tint={marqueeTint} className="relative z-[1] mt-8" />
      ) : null}
    </div>
  );
}
