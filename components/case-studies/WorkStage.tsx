"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useReducedMotion } from "framer-motion";
import { WorkStageMarquee } from "./WorkStageMarquee";
import { gsap, registerGsap, ScrollTrigger } from "@/lib/gsap/setup";
import { cn } from "@/lib/utils";
import type { CaseStudy } from "@/lib/case-studies/types";

type Props = {
  studies: CaseStudy[];
};

/**
 * Pinned Featured Work — one full card per project.
 * Scroll lifts the front card up the stack, revealing the next underneath.
 */
export function WorkStage({ studies }: Props) {
  const sectionRef = useRef<HTMLElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  const stackRef = useRef<HTMLDivElement>(null);
  const marqueeScrubRef = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const [active, setActive] = useState(0);
  const activeRef = useRef(0);

  useEffect(() => {
    if (
      reduce ||
      !sectionRef.current ||
      !pinRef.current ||
      !stackRef.current ||
      studies.length < 1
    ) {
      return;
    }
    registerGsap();

    const root = sectionRef.current;
    const pin = pinRef.current;
    const cards = gsap.utils.toArray<HTMLElement>(
      root.querySelectorAll("[data-work-card]"),
    );
    const n = cards.length;
    if (n !== studies.length) return;

    const ctx = gsap.context(() => {
      // Deck: only front + immediate next are visible (opaque cards, no bleed)
      cards.forEach((card, i) => {
        gsap.set(card, {
          yPercent: 0,
          y: i === 0 ? 0 : 18,
          scale: i === 0 ? 1 : 0.985,
          autoAlpha: i <= 1 ? 1 : 0,
          filter: "blur(0px)",
          zIndex: n - i,
          transformOrigin: "50% 100%",
        });
      });

      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: pin,
          start: "top top",
          end: () => `+=${Math.max(n, 1) * 110}%`,
          pin: true,
          scrub: 0.6,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate(self) {
            const idx = Math.min(n - 1, Math.round(self.progress * (n - 1)));
            if (idx !== activeRef.current) {
              activeRef.current = idx;
              setActive(idx);
            }
          },
        },
      });

      for (let i = 0; i < n - 1; i++) {
        const next = i + 1;

        // Front card slides up off the stack (stays opaque until mostly gone)
        tl.to(
          cards[i],
          {
            yPercent: -112,
            scale: 0.96,
            autoAlpha: 0,
            duration: 1,
          },
          i,
        );

        // Next card rises into the front slot
        tl.to(
          cards[next],
          {
            y: 0,
            scale: 1,
            autoAlpha: 1,
            duration: 1,
          },
          i,
        );

        // Bring the following card into the peek slot (still fully opaque)
        if (next + 1 < n) {
          tl.fromTo(
            cards[next + 1],
            { y: 28, scale: 0.97, autoAlpha: 0 },
            { y: 18, scale: 0.985, autoAlpha: 1, duration: 1 },
            i,
          );
        }
      }

      if (marqueeScrubRef.current) {
        gsap.fromTo(
          marqueeScrubRef.current,
          { x: 40 },
          {
            x: -160,
            ease: "none",
            scrollTrigger: {
              trigger: pin,
              start: "top top",
              end: () => `+=${Math.max(n, 1) * 110}%`,
              scrub: 0.5,
            },
          },
        );
      }
    }, root);

    ScrollTrigger.refresh();
    return () => ctx.revert();
  }, [reduce, studies]);

  if (studies.length === 0) return null;

  if (reduce) {
    return (
      <section
        id="work"
        className="scroll-mt-20 border-b border-ink/8 py-[var(--section-gap-mobile)] md:py-[var(--section-gap-desktop)]"
        aria-labelledby="work-heading"
      >
        <div className="section-pad mx-auto max-w-[var(--content-max)]">
          <p className="font-mono-data text-[10px] tracking-[0.16em] text-muted">
            01 — {studies.length} PROJECTS
          </p>
          <h2
            id="work-heading"
            className="font-display mt-2 text-[clamp(2rem,5vw,3rem)] tracking-tight text-ink"
          >
            Featured work
          </h2>
        </div>
        <ul className="section-pad mx-auto mt-10 flex max-w-[var(--content-max)] flex-col gap-8">
          {studies.map((study) => (
            <li key={study.slug}>
              <div className="work-stage-card overflow-hidden rounded-[var(--radius-hero)] border border-ink/12">
                <WorkCard study={study} interactive />
              </div>
            </li>
          ))}
        </ul>
      </section>
    );
  }

  const current = studies[active] ?? studies[0];
  const n = studies.length;

  return (
    <section
      ref={sectionRef}
      id="work"
      className="relative scroll-mt-20 border-b border-ink/8"
      aria-labelledby="work-heading"
    >
      <h2 id="work-heading" className="sr-only">
        Featured work
      </h2>

      <div
        ref={pinRef}
        className="relative flex h-[100dvh] min-h-[640px] flex-col justify-end overflow-hidden bg-bg pb-[max(1.25rem,env(safe-area-inset-bottom))] pt-[min(14vh,120px)] md:pb-8"
      >
        <WorkStageMarquee scrubRef={marqueeScrubRef} />

        <div className="relative z-[1] mx-auto mt-auto flex w-full max-w-[1680px] flex-col px-3 sm:px-4 md:px-6 lg:px-8">
          <div className="mb-2 flex items-baseline justify-between gap-4 md:mb-3">
            <p className="font-mono-data text-[10px] tracking-[0.16em] text-muted">
              01 — {String(active + 1).padStart(2, "0")} /{" "}
              {String(n).padStart(2, "0")}
            </p>
            <p className="font-mono-data text-[10px] tracking-[0.14em] text-muted">
              {current.statusLabel}
            </p>
          </div>

          {/* Stack stage — each project is its own opaque card */}
          <div
            ref={stackRef}
            className="relative h-[min(72dvh,800px)] min-h-[420px] w-full overflow-hidden"
            style={{ perspective: "1200px" }}
          >
            {/* Depth shelf under the deck */}
            <div
              aria-hidden
              className="pointer-events-none absolute inset-x-4 bottom-0 top-8 rounded-[var(--radius-hero)] border border-ink/10 bg-surface md:inset-x-6"
            />

            {studies.map((study, i) => (
              <article
                key={study.slug}
                data-work-card
                data-tint={i % 3}
                className={cn(
                  "work-stage-card absolute inset-0 overflow-hidden rounded-[var(--radius-hero)] border border-ink/12 will-change-transform",
                  i !== active && "pointer-events-none",
                )}
                style={{ zIndex: n - i }}
                aria-hidden={i !== active}
              >
                <WorkCard study={study} interactive={i === active} />
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function WorkCard({
  study,
  interactive,
}: {
  study: CaseStudy;
  interactive: boolean;
}) {
  return (
    <div className="grid h-full md:grid-cols-2">
      <div className="flex h-full min-h-0 flex-col px-6 py-6 md:px-10 md:py-9 lg:px-14 lg:py-12">
        <p className="font-mono-data text-[11px] uppercase tracking-[0.16em] text-muted md:text-[12px]">
          {study.domain}
          <span className="mx-2 text-ink/20">·</span>
          {study.year}
        </p>
        <h3 className="font-display mt-4 text-[clamp(2.75rem,8.5vw,6.25rem)] leading-[0.82] tracking-tight text-mint-deep md:mt-5">
          {interactive ? (
            <Link
              href={`/work/${study.slug}`}
              data-cursor="view"
              className="block"
            >
              {study.title}
            </Link>
          ) : (
            study.title
          )}
        </h3>
        <p className="mt-5 max-w-xl text-base leading-relaxed text-ink/75 md:mt-6 md:text-lg">
          {study.problem}
        </p>
        <dl className="mt-auto grid grid-cols-3 gap-4 border-t border-ink/10 pt-6 md:gap-6 md:pt-8">
          {study.metrics.slice(0, 3).map((m) => (
            <div key={m.label}>
              <dd className="font-mono-data text-[18px] font-semibold tracking-tight text-ink md:text-[22px] lg:text-[26px]">
                {m.value}
              </dd>
              <dt className="mt-1.5 font-mono-data text-[9px] uppercase tracking-[0.12em] text-muted md:text-[10px]">
                {m.label}
              </dt>
            </div>
          ))}
        </dl>
        {interactive ? (
          <Link
            href={`/work/${study.slug}`}
            data-cursor="view"
            className="mt-6 inline-flex font-mono-data text-[11px] tracking-[0.14em] text-ink transition-colors hover:text-mint-deep md:mt-8"
          >
            OPEN CASE →
          </Link>
        ) : (
          <span className="mt-6 inline-flex font-mono-data text-[11px] tracking-[0.14em] text-muted md:mt-8">
            OPEN CASE →
          </span>
        )}
      </div>

      <div className="relative min-h-[200px] border-t border-ink/10 bg-surface md:min-h-0 md:border-l md:border-t-0">
        {interactive ? (
          <Link
            href={`/work/${study.slug}`}
            data-cursor="view"
            aria-label={`Open case study: ${study.title}`}
            className="work-stage-card-media group absolute inset-3 block overflow-hidden rounded-[calc(var(--radius-hero)-6px)] md:inset-4 lg:inset-5"
          >
            <CardMedia src={study.coverImage} />
          </Link>
        ) : (
          <div className="work-stage-card-media absolute inset-3 overflow-hidden rounded-[calc(var(--radius-hero)-6px)] md:inset-4 lg:inset-5">
            <CardMedia src={study.coverImage} />
          </div>
        )}
      </div>
    </div>
  );
}

function CardMedia({ src }: { src: string }) {
  return (
    <>
      <Image
        src={src}
        alt=""
        fill
        unoptimized={src.endsWith(".svg")}
        sizes="(max-width: 768px) 100vw, 50vw"
        className="object-contain p-6 transition-transform duration-500 ease-out group-hover:scale-[1.03] md:p-10 lg:p-12"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-3 rounded-[calc(var(--radius-hero)-12px)] border border-ink/8 md:inset-4"
      />
    </>
  );
}
