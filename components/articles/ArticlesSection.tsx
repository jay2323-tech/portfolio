"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { useReducedMotion } from "framer-motion";
import entries from "@/content/build-log/entries.json";
import { SectionHeader } from "@/components/chrome/SectionHeader";
import { gsap, registerGsap, ScrollTrigger } from "@/lib/gsap/setup";

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
  return body.length > 56 ? `${body.slice(0, 56).trim()}…` : body;
}

/**
 * Recent Articles — section marquee title + tint/sibling-dim rows.
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

      <ul className="article-list mt-10 md:mt-14">
        {items.map((entry, i) => {
          const n = String(i + 1).padStart(3, "0");
          const title = titleFromBody(entry.body);
          return (
            <li
              key={`${entry.date}-${entry.tag ?? i}`}
              data-article-row
              className="article-row border-t border-ink/10 transition-[background-color,opacity] duration-250 ease-out last:border-b"
            >
              <Link
                href="#articles"
                className="group block text-ink outline-none"
              >
                <div className="section-pad mx-auto grid max-w-[var(--content-max)] gap-3 py-6 sm:grid-cols-[2.5rem_1fr_auto] sm:items-center sm:gap-6">
                  <span className="min-w-[40px] font-mono-data text-xs tracking-[0.12em] text-muted">
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
                      <span className="relative z-[1] block">{title}</span>
                      <span
                        className="pointer-events-none -mt-[0.42em] block select-none text-ink/[0.12]"
                        aria-hidden
                      >
                        {title}
                      </span>
                    </h3>

                    <p className="mt-2 max-w-xl truncate text-sm text-muted">
                      {entry.body}
                    </p>
                  </div>

                  <span className="work-row-arrow font-mono-data text-[11px] tracking-[0.14em] text-accent-clay transition-transform duration-250 ease-out group-hover:translate-x-1">
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
