"use client";

import { useLayoutEffect, useRef } from "react";
import Link from "next/link";
import { ArchitectureDiagramCanvas } from "@/components/architecture-diagram/ArchitectureDiagram";
import { gsap, registerGsap } from "@/lib/gsap/setup";
import { consumeWorkFlip, playWorkFlip } from "@/lib/motion/flipNav";
import { useSafeReducedMotion } from "@/lib/motion/useSafeReducedMotion";
import type { CaseStudy } from "@/lib/case-studies/types";

type Props = {
  study: CaseStudy;
};

/**
 * Case study detail — FLIP title from work row (custom Invert/Play, no Club plugin).
 */
export function CaseStudyDetail({ study }: Props) {
  const showDiagram = study.slug === "company-brain";
  const titleRef = useRef<HTMLHeadingElement>(null);
  const descRef = useRef<HTMLParagraphElement>(null);
  const metricsRef = useRef<HTMLDListElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);
  const reduce = useSafeReducedMotion();

  useLayoutEffect(() => {
    if (reduce || !titleRef.current) return;

    const payload = consumeWorkFlip(study.slug);
    registerGsap();

    if (payload) {
      // Hide non-FLIP targets before paint (sessionStorage can't run during SSR).
      if (descRef.current) gsap.set(descRef.current, { opacity: 0 });
      if (metricsRef.current) gsap.set(metricsRef.current, { opacity: 0 });
      if (bodyRef.current) gsap.set(bodyRef.current, { opacity: 0, y: 18 });

      const flips: Promise<void>[] = [];
      const fallbackFades: HTMLElement[] = [];

      for (const [ref, key] of [
        [titleRef, "title"],
        [descRef, "description"],
        [metricsRef, "metrics"],
      ] as const) {
        const el = ref.current;
        if (!el) continue;
        const rect = payload.rects[key];
        if (rect) {
          gsap.set(el, { opacity: 1 });
          flips.push(playWorkFlip(el, rect));
        } else {
          fallbackFades.push(el);
        }
      }

      if (fallbackFades.length) {
        gsap.fromTo(
          fallbackFades,
          { opacity: 0, y: 16 },
          { opacity: 1, y: 0, duration: 0.5, stagger: 0.06, ease: "power2.out" },
        );
      }

      void Promise.all(flips).then(() => {
        if (!bodyRef.current) return;
        gsap.to(bodyRef.current, {
          opacity: 1,
          y: 0,
          duration: 0.55,
          ease: "power2.out",
          clearProps: "transform,opacity",
        });
      });
      return;
    }

    const els = [
      titleRef.current,
      descRef.current,
      metricsRef.current,
      bodyRef.current,
    ].filter(Boolean) as HTMLElement[];
    gsap.fromTo(
      els,
      { opacity: 0, y: 16 },
      {
        opacity: 1,
        y: 0,
        duration: 0.55,
        stagger: 0.08,
        ease: "power2.out",
        clearProps: "transform,opacity",
      },
    );
  }, [study.slug, reduce]);

  return (
    <article className="section-pad mx-auto max-w-[var(--content-max)] py-16 md:py-24">
      <p className="section-eyebrow mb-4">{study.eyebrow}</p>
      <h1
        ref={titleRef}
        data-flip-title
        className="font-display origin-top-left text-[clamp(2rem,6vw,3.75rem)] leading-[0.9] tracking-tight text-ink will-change-transform"
      >
        {study.title}
      </h1>

      <p
        ref={descRef}
        className="mt-5 max-w-3xl text-lg leading-snug text-muted md:text-xl will-change-transform"
      >
        {study.headline}
      </p>

      <dl
        ref={metricsRef}
        className="mt-10 grid grid-cols-2 gap-6 border-y border-ink/8 py-8 sm:grid-cols-3 will-change-transform"
      >
        {study.metrics.map((metric) => (
          <div key={metric.label}>
            <dt className="font-mono-data text-[10px] uppercase tracking-wider text-muted">
              {metric.label}
            </dt>
            <dd className="font-mono-data mt-1 text-lg text-ink md:text-xl">
              {metric.value}
            </dd>
          </div>
        ))}
      </dl>

      <div ref={bodyRef}>
        <section id={study.sectionIds.context} className="mt-14 scroll-mt-24">
          <h2 className="font-mono-data text-xs uppercase tracking-wider text-accent-clay">
            Context
          </h2>
          <p className="mt-3 max-w-2xl text-base text-ink/90">{study.who}</p>
          <ul className="mt-5 max-w-2xl space-y-2 text-sm text-muted">
            {study.constraints.map((item) => (
              <li key={item} className="flex gap-3">
                <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-muted" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </section>

        <section
          id={study.sectionIds.architecture}
          className="mt-14 scroll-mt-24 border-t border-ink/8 pt-14"
        >
          <h2 className="font-mono-data text-xs uppercase tracking-wider text-accent-clay">
            Architecture
          </h2>
          <p className="mt-3 max-w-2xl text-base text-ink/90">
            {study.architectureSummary}
          </p>
          {showDiagram && (
            <div className="mt-8">
              <ArchitectureDiagramCanvas />
            </div>
          )}
        </section>

        <section
          id={study.sectionIds.decisions}
          className="mt-14 scroll-mt-24 border-t border-ink/8 pt-14"
        >
          <h2 className="font-mono-data text-xs uppercase tracking-wider text-accent-clay">
            Decisions & tradeoffs
          </h2>
          <ul className="mt-6 space-y-8">
            {study.decisions.map((decision) => (
              <li key={decision.title} className="max-w-2xl">
                <h3 className="text-lg text-ink">{decision.title}</h3>
                <p className="mt-2 text-sm text-muted">{decision.body}</p>
              </li>
            ))}
          </ul>
        </section>

        <section
          id={study.sectionIds.whatBroke}
          className="mt-14 scroll-mt-24 border-t border-ink/8 pt-14"
        >
          <h2 className="font-mono-data text-xs uppercase tracking-wider text-accent-clay">
            What broke / what I&apos;d change
          </h2>
          <p className="mt-3 max-w-2xl text-base text-ink/90">{study.whatBroke}</p>
        </section>

        <section
          id={study.sectionIds.metrics}
          className="mt-14 scroll-mt-24 border-t border-ink/8 pt-14"
        >
          <h2 className="font-mono-data text-xs uppercase tracking-wider text-accent-clay">
            Metrics
          </h2>
          <dl className="mt-6 grid grid-cols-2 gap-6 sm:grid-cols-3">
            {study.metrics.map((metric) => (
              <div key={metric.label}>
                <dt className="font-mono-data text-[10px] uppercase tracking-wider text-muted">
                  {metric.label}
                </dt>
                <dd className="font-mono-data mt-1 text-lg text-ink">
                  {metric.value}
                </dd>
              </div>
            ))}
          </dl>
        </section>

        {study.links.length > 0 && (
          <div className="mt-14 flex flex-wrap gap-4 border-t border-ink/8 pt-10">
            {study.links.map((link) =>
              link.external ? (
                <a
                  key={link.href}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-accent-clay hover:opacity-80"
                >
                  {link.label} ↗
                </a>
              ) : (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm text-accent-clay hover:opacity-80"
                >
                  {link.label}
                </Link>
              ),
            )}
            <Link href="/#work" className="text-sm text-muted hover:text-ink">
              ← All work
            </Link>
          </div>
        )}
      </div>
    </article>
  );
}
