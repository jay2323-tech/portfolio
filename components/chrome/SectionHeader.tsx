"use client";

import { SectionMarquee } from "./SectionMarquee";
import { MarqueeText } from "./MarqueeText";
import { cn } from "@/lib/utils";

type Props = {
  index: string;
  title: string;
  meta?: string;
  /** Thin looping strip (legacy / optional) */
  marquee?: string;
  marqueeTint?: "mint" | "blush" | "sky" | "none";
  /**
   * Giant infinite + scroll-scrub title marquee.
   * When set, the visual H2 is replaced by the wheel (title kept for a11y).
   */
  bgMarquee?: string;
  className?: string;
  headingId?: string;
};

/**
 * Section chrome: index + meta + H2,
 * or index + meta + SectionMarquee title wheel.
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
  const useMarqueeTitle = Boolean(bgMarquee);

  return (
    <div className={cn("relative", className)}>
      <div className="section-pad relative z-[1] mx-auto max-w-[var(--content-max)]">
        <p
          data-section-meta
          className="font-mono-data text-[11px] tracking-[0.16em] text-muted"
        >
          <span className="text-ink">{index}</span>
          {meta ? (
            <>
              <span className="mx-2 text-ink/20">/</span>
              <span>{meta}</span>
            </>
          ) : null}
        </p>

        {useMarqueeTitle ? (
          <h2 id={headingId} data-section-heading className="sr-only">
            {title}
          </h2>
        ) : (
          <h2
            id={headingId}
            data-section-heading
            className="font-display mt-3 text-[clamp(2.25rem,5vw,4rem)] leading-[0.95] tracking-tight text-ink"
          >
            {title}
          </h2>
        )}
      </div>

      {bgMarquee ? <SectionMarquee text={bgMarquee} /> : null}

      {marquee ? (
        <MarqueeText text={marquee} tint={marqueeTint} className="relative z-[1] mt-8" />
      ) : null}
    </div>
  );
}
