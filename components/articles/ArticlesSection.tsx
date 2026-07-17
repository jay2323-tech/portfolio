"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { useReducedMotion } from "framer-motion";
import entries from "@/content/build-log/entries.json";
import { SectionHeader } from "@/components/chrome/SectionHeader";
import { gsap, registerGsap, ScrollTrigger } from "@/lib/gsap/setup";
import { cn } from "@/lib/utils";

type Entry = {
  date: string;
  tag?: string;
  body: string;
};

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

function titleFromBody(body: string) {
  return body.length > 90 ? `${body.slice(0, 90).trim()}…` : body;
}

/**
 * Juba Recent Articles — section marquee title + mint L→R swipe rows.
 */
export function ArticlesSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();

  const items = (entries as Entry[])
    .slice()
    .sort((a, b) => (a.date < b.date ? 1 : -1));

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

      rows.forEach((row) => {
        gsap.fromTo(
          row,
          { y: 28, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.6,
            ease: "power2.out",
            clearProps: "transform,opacity",
            scrollTrigger: {
              trigger: row,
              start: "top 90%",
              toggleActions: "play none none none",
            },
          },
        );
      });
    }, root);

    ScrollTrigger.refresh();
    return () => ctx.revert();
  }, [reduce]);

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

      <ul className="mt-10 md:mt-14">
        {items.map((entry, i) => {
          const n = String(i + 1).padStart(3, "0");
          const title = titleFromBody(entry.body);
          return (
            <li
              key={`${entry.date}-${entry.tag ?? i}`}
              data-article-row
              className="border-t border-ink/10 last:border-b"
            >
              <Link
                href="#articles"
                className={cn(
                  "article-row-swipe group block outline-none",
                  "text-ink",
                )}
              >
                <div className="section-pad mx-auto grid max-w-[var(--content-max)] gap-3 py-8 sm:grid-cols-[4.5rem_1fr_auto] sm:items-start sm:gap-8 sm:py-10">
                <span
                  className={cn(
                    "font-mono-data text-xs tracking-[0.12em] text-muted",
                    "transition-colors duration-500 delay-100 ease-out motion-reduce:transition-none motion-reduce:delay-0",
                    "group-hover:text-ink group-focus-visible:text-ink",
                  )}
                >
                  {n}
                </span>

                <div className="min-w-0">
                  <div
                    className={cn(
                      "flex flex-wrap items-center gap-x-3 gap-y-1 font-mono-data text-[10px] uppercase tracking-[0.14em] text-muted",
                      "transition-colors duration-500 delay-100 ease-out motion-reduce:transition-none motion-reduce:delay-0",
                      "group-hover:text-ink group-focus-visible:text-ink",
                    )}
                  >
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

                  <h3
                    className={cn(
                      "font-display mt-3 text-[clamp(1.5rem,3vw,2.25rem)] leading-[0.9] tracking-tight text-ink",
                      "transition-colors duration-500 delay-100 ease-out motion-reduce:transition-none motion-reduce:delay-0",
                    )}
                  >
                    <span className="relative z-[1] block">{title}</span>
                    <span
                      className="pointer-events-none -mt-[0.42em] block select-none text-ink/[0.12]"
                      aria-hidden
                    >
                      {title}
                    </span>
                  </h3>
                </div>

                <span
                  className={cn(
                    "font-mono-data text-[11px] tracking-[0.14em] text-accent-clay sm:pt-1",
                    "transition-colors duration-500 delay-100 ease-out motion-reduce:transition-none motion-reduce:delay-0",
                    "group-hover:text-ink group-focus-visible:text-ink inline-block transition-transform duration-250 group-hover:translate-x-1",
                  )}
                >
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
