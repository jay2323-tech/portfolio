"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "framer-motion";
import { SectionHeader } from "@/components/chrome/SectionHeader";
import { TimelineLine } from "./TimelineLine";
import { TiltCard } from "./TiltCard";
import { gsap, registerGsap, ScrollTrigger } from "@/lib/gsap/setup";
import { onRowGlowMove } from "@/lib/motion/rowGlow";
import { cn } from "@/lib/utils";
import type { SiteAbout } from "@/lib/content/reader";

type Props = {
  content: SiteAbout;
};

/**
 * About — timeline border draw-in, foundations back.out, toolkit bump.
 */
export function AboutSection({ content }: Props) {
  const sectionRef = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const {
    coordinates,
    statement,
    blurb,
    facts,
    resumeHref,
    resumeLabel,
    experience,
    study,
    foundations,
    competencies,
    toolkit,
  } = content;

  useEffect(() => {
    if (reduce || !sectionRef.current) return;
    registerGsap();
    const root = sectionRef.current;

    const ctx = gsap.context(() => {
      const intro = root.querySelectorAll<HTMLElement>("[data-about-block]");
      intro.forEach((el) => {
        gsap.fromTo(
          el,
          { y: 28, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.65,
            ease: "power2.out",
            clearProps: "transform,opacity",
            scrollTrigger: {
              trigger: el,
              start: "top 90%",
              toggleActions: "play none none none",
            },
          },
        );
      });

      root.querySelectorAll<HTMLElement>("[data-timeline-row]").forEach((row) => {
        gsap.fromTo(
          row,
          { x: -12, opacity: 0 },
          {
            x: 0,
            opacity: 1,
            duration: 0.5,
            ease: "power2.out",
            clearProps: "transform,opacity",
            scrollTrigger: {
              trigger: row,
              start: "top 88%",
              toggleActions: "play none none none",
            },
          },
        );
      });

      const foundations = root.querySelectorAll<HTMLElement>(
        "[data-foundation-cell]",
      );
      if (foundations.length) {
        gsap.fromTo(
          foundations,
          { y: 30, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.55,
            stagger: 0.08,
            ease: "back.out(1.4)",
            clearProps: "transform,opacity",
            scrollTrigger: {
              trigger: root.querySelector("[data-foundations]"),
              start: "top 85%",
              toggleActions: "play none none none",
            },
          },
        );
      }

      const tools = root.querySelectorAll<HTMLElement>("[data-toolkit-item]");
      if (tools.length) {
        gsap.fromTo(
          tools,
          { y: 16, opacity: 0, scale: 0.94 },
          {
            y: 0,
            opacity: 1,
            scale: 1,
            duration: 0.45,
            stagger: 0.05,
            ease: "power2.out",
            clearProps: "transform,opacity",
            scrollTrigger: {
              trigger: root.querySelector("[data-toolkit]"),
              start: "top 88%",
              toggleActions: "play none none none",
            },
          },
        );
      }
    }, root);

    ScrollTrigger.refresh();
    return () => ctx.revert();
  }, [reduce]);

  return (
    <section
      ref={sectionRef}
      id="about"
      className="scroll-mt-20 border-b border-ink/8 bg-tint-butter py-[var(--section-gap-mobile)] md:py-[var(--section-gap-desktop)]"
      aria-labelledby="about-heading"
    >
      <SectionHeader
        index="04"
        meta="CAREER"
        title="About me"
        bgMarquee="ABOUT ME"
        headingId="about-heading"
      />

      <div className="section-pad mx-auto mt-10 max-w-[var(--content-max)] md:mt-14">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
          <div data-about-block>
            <p className="font-mono-data text-[11px] tracking-[0.16em] text-muted">
              {coordinates}
            </p>

            <h3 className="font-display mt-6 text-[clamp(1.75rem,3.5vw,2.75rem)] leading-[0.9] tracking-tight text-ink">
              {statement}
            </h3>

            <p className="mt-6 max-w-md text-sm leading-relaxed text-muted md:text-base">
              {blurb}
            </p>

            <ul className="mt-6 space-y-1 font-mono-data text-[11px] uppercase tracking-[0.14em] text-muted">
              {facts.map((fact) => (
                <li key={fact}>{fact}</li>
              ))}
            </ul>

            <a
              href={resumeHref}
              className="mt-8 inline-block font-mono-data text-[11px] tracking-[0.14em] text-ink underline-offset-4 transition-colors hover:text-accent-clay hover:underline"
            >
              {resumeLabel}
            </a>
          </div>

          <div className="space-y-10">
            <div>
              <h4 className="font-mono-data text-[10px] tracking-[0.18em] text-muted">
                WORK EXPERIENCE
              </h4>
              <div className="relative">
                <TimelineLine color="var(--accent-clay)" />
                <ol className="mt-4 border-y border-ink/10">
                {experience.map((item) => (
                  <li
                    key={item.org}
                    data-timeline-row
                    className="relative border-b border-ink/10 last:border-b-0"
                  >
                    <div className="group flex flex-wrap items-baseline justify-between gap-2 py-5 pl-4 transition-transform duration-250 ease-out hover:translate-x-1">
                      <div>
                        <p className="font-display text-xl tracking-tight text-ink transition-colors group-hover:text-accent-clay">
                          {item.org}
                        </p>
                        <p className="mt-1 font-mono-data text-[10px] tracking-[0.14em] text-muted">
                          {item.role}
                        </p>
                      </div>
                      <span className="font-mono-data text-[11px] text-muted">
                        {item.years}
                      </span>
                    </div>
                  </li>
                ))}
                </ol>
              </div>
            </div>

            <div>
              <h4 className="font-mono-data text-[10px] tracking-[0.18em] text-muted">
                STUDY
              </h4>
              <div className="relative">
                <TimelineLine color="var(--ink)" />
                <ol className="mt-4 border-y border-ink/10">
                {study.map((item) => (
                  <li
                    key={item.title}
                    data-timeline-row
                    className="relative border-b border-ink/10 last:border-b-0"
                  >
                    <div className="flex flex-wrap items-baseline justify-between gap-2 py-5 pl-4">
                      <div>
                        <p className="font-display text-xl tracking-tight text-ink">
                          {item.title}
                        </p>
                        <p className="mt-1 text-sm text-muted">{item.place}</p>
                      </div>
                      <span className="font-mono-data text-[11px] text-muted">
                        {item.years}
                      </span>
                    </div>
                  </li>
                ))}
                </ol>
              </div>
            </div>
          </div>
        </div>

        <div data-foundations className="mt-16 md:mt-20">
          <h4 className="font-mono-data text-[10px] tracking-[0.18em] text-muted">
            CORE FOUNDATIONS
          </h4>
          <div className="mt-8 overflow-hidden rounded-2xl border border-ink/10 bg-mint/25 md:rounded-3xl">
            <ul className="flex flex-col divide-y divide-ink/10 sm:flex-row sm:divide-x sm:divide-y-0">
              {foundations.map((f) => (
                <li
                  key={f.n}
                  data-foundation-cell
                  onMouseMove={onRowGlowMove}
                  className="foundation-spotlight group flex-1 px-5 py-6 transition-colors duration-250 hover:bg-mint/40 md:px-6 md:py-8"
                >
                  <p className="font-mono-data text-xs text-accent-clay">{f.n}</p>
                  <h5 className="mt-2 font-display text-lg tracking-tight text-ink transition-colors group-hover:text-accent-clay md:text-xl">
                    {f.title}
                  </h5>
                  <p className="mt-2 text-sm leading-relaxed text-muted">{f.body}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div data-about-block className="mt-16 md:mt-20">
          <h4 className="font-mono-data text-[10px] tracking-[0.18em] text-muted">
            CORE COMPETENCIES
          </h4>
          <ol className="mt-4 divide-y divide-ink/10 border-y border-ink/10">
            {competencies.map((c, i) => (
              <li key={c}>
                <div className="group flex items-baseline gap-4 py-4 transition-transform duration-250 ease-out hover:translate-x-1">
                  <span className="font-mono-data text-[10px] text-muted transition-colors group-hover:text-accent-clay">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="font-display text-lg text-ink transition-colors group-hover:text-accent-clay">
                    {c}
                  </span>
                </div>
              </li>
            ))}
          </ol>
        </div>

        <div data-toolkit className="mt-16 md:mt-20">
          <h4 className="font-mono-data text-[10px] tracking-[0.18em] text-muted">
            MY TOOLKIT
          </h4>
          <ul className="mt-6 grid list-none grid-cols-2 gap-3 md:grid-cols-4">
            {toolkit.map((t) => (
              <li key={t.name} data-toolkit-item>
                <TiltCard
                  className={cn(
                    "toolkit-item rounded-sm border border-ink/10 px-4 py-4",
                    "transition-[opacity,filter,border-color,background-color] duration-300 ease-out",
                  )}
                >
                  <span
                    aria-hidden
                    className="flex h-10 w-10 items-center justify-center rounded-sm font-mono-data text-xs font-semibold text-bg"
                    style={{ background: t.tint }}
                  >
                    {t.initial}
                  </span>
                  <p className="mt-3 font-medium text-ink">{t.name}</p>
                  <p className="mt-1 font-mono-data text-[10px] tracking-[0.12em] text-muted">
                    {t.role}
                  </p>
                </TiltCard>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
