"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "framer-motion";
import { SectionHeader } from "@/components/chrome/SectionHeader";
import { gsap, registerGsap, ScrollTrigger } from "@/lib/gsap/setup";
import { cn } from "@/lib/utils";

const EXPERIENCE = [
  {
    org: "PORTFOLIO / FREELANCE",
    role: "AI ENGINEER",
    years: "[2024—]",
  },
  {
    org: "COMPANYBRAIN",
    role: "GRAPH RAG PRODUCT",
    years: "[2025—]",
  },
  {
    org: "FACTORY ATTENDANCE",
    role: "CV SYSTEM · PRODUCTION",
    years: "[2024—]",
  },
  {
    org: "DESIFIT",
    role: "DPDP-AWARE PRODUCT",
    years: "[2025—]",
  },
] as const;

const STUDY = [
  {
    title: "B.TECH · COMPUTER SCIENCE",
    place: "In progress / recent",
    years: "[—]",
  },
] as const;

const FOUNDATIONS = [
  {
    n: "01",
    title: "Prove, don't claim",
    body: "Ship systems you can inspect — retrieval traces, metrics, and tradeoffs in the open.",
  },
  {
    n: "02",
    title: "Constraints first",
    body: "Compliance, latency, and ops limits shape the architecture before the demo does.",
  },
  {
    n: "03",
    title: "Earn the outcome",
    body: "Measured impact — uptime, latency, citations — proof over opinion.",
  },
  {
    n: "04",
    title: "Handoff that sticks",
    body: "Docs and runbooks — if it only works while I'm watching logs, it isn't done.",
  },
] as const;

const COMPETENCIES = [
  "AI & Retrieval Systems",
  "Full-stack Delivery",
  "System Architecture",
  "Evaluation & Observability",
  "Product Engineering",
] as const;

const TOOLKIT = [
  { name: "Claude / GPT", role: "Generation" },
  { name: "Qdrant", role: "Vectors" },
  { name: "FastAPI", role: "API" },
  { name: "Next.js", role: "Frontend" },
  { name: "TypeScript", role: "Typing" },
  { name: "Python", role: "Pipelines" },
  { name: "PostgreSQL", role: "Data" },
  { name: "Vercel", role: "Deploy" },
] as const;

const STATEMENT =
  "Building production RAG and computer-vision systems — as product and as code.";

/**
 * Juba About — two-column intro + timelines, foundations, toolkit hover.
 */
export function AboutSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();

  useEffect(() => {
    if (reduce || !sectionRef.current) return;
    registerGsap();
    const root = sectionRef.current;

    const ctx = gsap.context(() => {
      const blocks = root.querySelectorAll<HTMLElement>("[data-about-block]");
      blocks.forEach((el) => {
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
        {/* Two-column intro */}
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
          <div data-about-block>
            <p className="font-mono-data text-[11px] tracking-[0.16em] text-muted">
              12.9716° N, 77.5946° E — BENGALURU
            </p>

            <h3 className="font-display mt-6 text-[clamp(1.75rem,3.5vw,2.75rem)] leading-[0.9] tracking-tight text-ink">
              <span className="relative z-[1] block">{STATEMENT}</span>
              <span
                className="pointer-events-none -mt-[0.42em] block select-none text-ink/[0.12]"
                aria-hidden
              >
                {STATEMENT}
              </span>
            </h3>

            <p className="mt-6 max-w-md text-sm leading-relaxed text-muted md:text-base">
              This site is itself a demo: Ask My Work retrieves over my case
              studies with sources you can inspect.
            </p>

            <ul className="mt-6 space-y-1 font-mono-data text-[11px] uppercase tracking-[0.14em] text-muted">
              <li>LOCATION — BENGALURU, INDIA</li>
              <li>RELOCATION — OPEN, GLOBAL</li>
              <li>OPEN TO — INTERNSHIPS · FREELANCE · FULL-TIME</li>
            </ul>

            <a
              href="mailto:hello@jayanthkrishna.dev?subject=Resume%20request"
              className="mt-8 inline-block font-mono-data text-[11px] tracking-[0.14em] text-ink underline-offset-4 transition-colors hover:text-accent-clay hover:underline"
            >
              DOWNLOAD RESUMÉ / CV →
            </a>
          </div>

          <div data-about-block className="space-y-10">
            <div>
              <h4 className="font-mono-data text-[10px] tracking-[0.18em] text-muted">
                WORK EXPERIENCE
              </h4>
              <ol className="mt-4 divide-y divide-ink/10 border-y border-ink/10">
                {EXPERIENCE.map((item) => (
                  <li key={item.org}>
                    <div className="group flex flex-wrap items-baseline justify-between gap-2 py-5 transition-transform duration-250 ease-out hover:translate-x-1">
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

            <div>
              <h4 className="font-mono-data text-[10px] tracking-[0.18em] text-muted">
                STUDY
              </h4>
              <ol className="mt-4 divide-y divide-ink/10 border-y border-ink/10">
                {STUDY.map((item) => (
                  <li key={item.title}>
                    <div className="flex flex-wrap items-baseline justify-between gap-2 py-5">
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

        {/* Foundations — one tile, inline row */}
        <div data-about-block className="mt-16 md:mt-20">
          <h4 className="font-mono-data text-[10px] tracking-[0.18em] text-muted">
            CORE FOUNDATIONS
          </h4>
          <div className="mt-8 overflow-hidden rounded-2xl border border-ink/10 bg-mint/25 md:rounded-3xl">
            <ul className="flex flex-col divide-y divide-ink/10 sm:flex-row sm:divide-x sm:divide-y-0">
              {FOUNDATIONS.map((f) => (
                <li
                  key={f.n}
                  className="group flex-1 px-5 py-6 transition-colors duration-250 hover:bg-mint/40 md:px-6 md:py-8"
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

        {/* Competencies */}
        <div data-about-block className="mt-16 md:mt-20">
          <h4 className="font-mono-data text-[10px] tracking-[0.18em] text-muted">
            CORE COMPETENCIES
          </h4>
          <ol className="mt-4 divide-y divide-ink/10 border-y border-ink/10">
            {COMPETENCIES.map((c, i) => (
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

        {/* Toolkit — grayscale → color */}
        <div data-about-block className="mt-16 md:mt-20">
          <h4 className="font-mono-data text-[10px] tracking-[0.18em] text-muted">
            MY TOOLKIT
          </h4>
          <ul className="mt-6 grid list-none gap-3 sm:grid-cols-2 md:grid-cols-4">
            {TOOLKIT.map((t) => (
              <li key={t.name}>
                <div
                  className={cn(
                    "toolkit-item border border-ink/10 px-4 py-4",
                    "transition-[opacity,filter,border-color,background-color] duration-300 ease-out",
                  )}
                >
                  <p className="font-medium text-ink">{t.name}</p>
                  <p className="mt-1 font-mono-data text-[10px] tracking-[0.12em] text-muted">
                    {t.role}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
