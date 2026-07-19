"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { useReducedMotion } from "framer-motion";
import { SectionHeader } from "@/components/chrome/SectionHeader";
import { gsap, registerGsap, ScrollTrigger } from "@/lib/gsap/setup";
import { onRowGlowMove } from "@/lib/motion/rowGlow";
import { cn } from "@/lib/utils";
import type { ArticleEntry } from "@/lib/content/site";

function formatDate(iso: string) {
  const d = new Date(`${iso}T12:00:00`);
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  const yyyy = d.getFullYear();
  return `${mm}/${dd}/${yyyy}`;
}

function estimateRead(body: string) {
  const mins = Math.max(1, Math.ceil(body.split(/\s+/).length / 40));
  return `${mins} MIN READ`;
}

function titleFromBody(body: string, label?: string) {
  if (label) return label;
  return body.length > 56 ? `${body.slice(0, 56).trim()}…` : body;
}

type Props = {
  entries: ArticleEntry[];
};

/**
 * Recent Articles — L→R mint swipe + row x-stagger on scroll.
 */
export function ArticlesSection({ entries }: Props) {
  const sectionRef = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const items = entries;

  useEffect(() => {
    if (reduce || !sectionRef.current) return;
    registerGsap();
    const root = sectionRef.current;

    const ctx = gsap.context(() => {
      const meta = root.querySelector<HTMLElement>("[data-section-meta]");
      const rows = root.querySelectorAll<HTMLElement>("[data-article-row]");

      if (meta) {
        gsap.fromTo(
          meta,
          { y: 16, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.55,
            ease: "power2.out",
            clearProps: "transform,opacity",
            scrollTrigger: {
              trigger: meta,
              start: "top 90%",
              toggleActions: "play none none none",
            },
          },
        );
      }

      gsap.fromTo(
        rows,
        {
          x: -20,
          opacity: 0,
          rotateX: -12,
          transformPerspective: 900,
          transformOrigin: "50% 100%",
        },
        {
          x: 0,
          opacity: 1,
          rotateX: 0,
          duration: 0.55,
          stagger: 0.06,
          ease: "power2.out",
          clearProps: "transform,opacity",
          scrollTrigger: {
            trigger: root.querySelector(".article-list") ?? root,
            start: "top 88%",
            toggleActions: "play none none none",
          },
        },
      );
    }, root);

    ScrollTrigger.refresh();
    return () => ctx.revert();
  }, [reduce, items.length]);

  return (
    <section
      ref={sectionRef}
      id="articles"
      className="scroll-mt-20 border-b border-ink/8 bg-tint-blush py-[var(--section-gap-mobile)] md:py-[var(--section-gap-desktop)]"
      aria-labelledby="articles-heading"
    >
      <SectionHeader
        index="02"
        meta={`${items.length} LIVE`}
        title="Recent articles"
        bgMarquee="RECENT ARTICLES"
        headingId="articles-heading"
      />

      <ul className="article-list mt-10 md:mt-14">
        {items.map((entry, i) => {
          const n = String(i + 1).padStart(3, "0");
          const title = titleFromBody(entry.body, entry.label);
          return (
            <li
              key={entry.slug}
              data-article-row
              onMouseMove={onRowGlowMove}
              className="row-glow border-t border-ink/10 last:border-b"
            >
              <Link
                href="#articles"
                data-cursor="view"
                className={cn(
                  "article-row-swipe group block text-ink outline-none",
                )}
              >
                <div className="section-pad relative z-[1] mx-auto grid max-w-[var(--content-max)] gap-3 py-6 sm:grid-cols-[2.5rem_1fr_auto] sm:items-center sm:gap-6">
                  <span className="min-w-[40px] font-mono-data text-xs tracking-[0.12em] text-muted transition-colors duration-300 group-hover:text-ink">
                    {n}
                  </span>

                  <div className="min-w-0">
                    <div className="hidden items-center gap-x-3 font-mono-data text-[10px] uppercase tracking-[0.14em] text-muted sm:flex">
                      <time dateTime={entry.date}>{formatDate(entry.date)}</time>
                      {entry.tag ? (
                        <>
                          <span className="opacity-40" aria-hidden>
                            ·
                          </span>
                          <span>{entry.tag}</span>
                        </>
                      ) : null}
                      <span className="opacity-40" aria-hidden>
                        ·
                      </span>
                      <span>{estimateRead(entry.body)}</span>
                    </div>

                    <h3 className="font-display mt-2 text-[clamp(1.25rem,2.6vw,1.85rem)] leading-[0.95] tracking-tight text-ink">
                      {title}
                    </h3>

                    <p className="mt-2 max-w-xl truncate text-sm text-muted transition-colors duration-300 group-hover:text-ink/80">
                      {entry.body}
                    </p>
                  </div>

                  <span className="font-mono-data text-[11px] tracking-[0.14em] text-accent-clay transition-transform duration-250 ease-out group-hover:translate-x-1 group-hover:text-ink">
                    READ →
                  </span>
                </div>
              </Link>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
