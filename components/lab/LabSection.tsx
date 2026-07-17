"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "framer-motion";
import { ArchitectureDiagramCanvas } from "@/components/architecture-diagram/ArchitectureDiagram";
import { SectionHeader } from "@/components/chrome/SectionHeader";
import { useAsk } from "@/components/ask-my-work/AskContext";
import { gsap, registerGsap, ScrollTrigger } from "@/lib/gsap/setup";
import { cn } from "@/lib/utils";

const EXPERIMENTS = [
  {
    n: "001",
    tags: ["TYPESCRIPT", "RAG", "SSE"],
    title: "ASK-MY-WORK",
    body: "A live retrieval widget over this portfolio corpus — hybrid lexical + dense ranking, streamed answers, clickable source chips. The site proves the skill it describes.",
    cta: "OPEN ASK →",
    action: "ask" as const,
  },
  {
    n: "002",
    tags: ["SVG", "SYSTEMS", "INTERACTIVE"],
    title: "COMPANYBRAIN-ARCH",
    body: "Interactive architecture diagram for CompanyBrain — hover/focus nodes, highlight edges, deep-link into the case study. Proof that system design can be explored, not just illustrated.",
    cta: "SEE DIAGRAM ↓",
    action: "diagram" as const,
  },
  {
    n: "003",
    tags: ["HYBRID", "CORPUS", "LOCAL"],
    title: "PORTFOLIO-CORPUS",
    body: "Curated chunk store with build-time embeddings and a serverless retrieve path — no vector DB required at this scale. Rate-limited, inspectable, cheap to run.",
    cta: "VIEW WORK →",
    href: "/#work",
    action: "link" as const,
  },
] as const;

/**
 * Juba Experiment Lab — section marquee + experiment rows + Ask / diagram.
 */
export function LabSection() {
  const { openAsk } = useAsk();
  const sectionRef = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();

  useEffect(() => {
    if (reduce || !sectionRef.current) return;
    registerGsap();
    const root = sectionRef.current;

    const ctx = gsap.context(() => {
      const meta = root.querySelector<HTMLElement>("[data-section-meta]");
      const rows = root.querySelectorAll<HTMLElement>("[data-lab-row]");

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
          { y: 30, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.65,
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
    }, root);

    ScrollTrigger.refresh();
    return () => ctx.revert();
  }, [reduce]);

  return (
    <section
      ref={sectionRef}
      id="lab"
      className="scroll-mt-20 border-b border-ink/8 bg-tint-mint py-[var(--section-gap-mobile)] md:py-[var(--section-gap-desktop)]"
      aria-labelledby="lab-heading"
    >
      <SectionHeader
        index="03"
        meta="PROOF OF BUILD"
        title="Experiment lab"
        bgMarquee="EXPERIMENT LAB"
        headingId="lab-heading"
      />

      <ul className="lab-list mt-10 md:mt-14">
        {EXPERIMENTS.map((exp) => (
          <li
            key={exp.n}
            data-lab-row
            className="lab-row group border-t border-ink/10 transition-[background-color,opacity] duration-250 ease-out last:border-b"
          >
            <div className="section-pad mx-auto grid max-w-[var(--content-max)] gap-4 py-10 md:grid-cols-[minmax(0,1fr)_auto] md:items-start md:gap-10 md:py-12">
              <div className="min-w-0">
                <p className="font-mono-data text-[10px] tracking-[0.16em] text-muted">
                  {exp.n}
                  <span className="mx-2 text-ink/20">·</span>
                  {exp.tags.join(" · ")}
                </p>
                <h3 className="font-display mt-3 text-[clamp(1.75rem,3.5vw,2.75rem)] leading-[0.85] tracking-tight text-ink transition-transform duration-250 ease-out origin-left group-hover:scale-[1.02]">
                  <span className="relative z-[1] block">{exp.title}</span>
                  <span
                    className="pointer-events-none -mt-[0.42em] block select-none text-ink/[0.12]"
                    aria-hidden
                  >
                    {exp.title}
                  </span>
                </h3>
                <p className="mt-4 max-w-2xl text-sm leading-relaxed text-muted md:text-base">
                  {exp.body}
                </p>
              </div>

              <div className="flex shrink-0 items-start md:pt-8">
                {exp.action === "ask" && (
                  <button
                    type="button"
                    onClick={() => openAsk()}
                    className={cn(
                      "font-mono-data text-[11px] tracking-[0.14em] text-accent-clay",
                      "transition-transform duration-250 ease-out group-hover:translate-x-1",
                    )}
                  >
                    {exp.cta}
                  </button>
                )}
                {exp.action === "diagram" && (
                  <a
                    href="#lab-diagram"
                    className={cn(
                      "font-mono-data text-[11px] tracking-[0.14em] text-accent-clay",
                      "transition-transform duration-250 ease-out group-hover:translate-x-1",
                    )}
                  >
                    {exp.cta}
                  </a>
                )}
                {exp.action === "link" && "href" in exp && (
                  <a
                    href={exp.href}
                    className={cn(
                      "font-mono-data text-[11px] tracking-[0.14em] text-accent-clay",
                      "transition-transform duration-250 ease-out group-hover:translate-x-1",
                    )}
                  >
                    {exp.cta}
                  </a>
                )}
              </div>
            </div>
          </li>
        ))}
      </ul>

      <div
        id="lab-diagram"
        className="section-pad mx-auto mt-10 max-w-[var(--content-max)] scroll-mt-24 md:mt-14"
      >
        <div className="border border-ink/10 bg-sky/35 px-5 py-8 md:px-8 md:py-10">
          <p className="font-mono-data text-[10px] tracking-[0.16em] text-muted">
            DIAGRAM · COMPANYBRAIN
          </p>
          <div className="mt-4">
            <ArchitectureDiagramCanvas />
          </div>
        </div>
      </div>

      <div className="section-pad mx-auto mt-10 max-w-[var(--content-max)]">
        <a
          href="https://github.com"
          target="_blank"
          rel="noopener noreferrer"
          className="font-mono-data text-[11px] tracking-[0.14em] text-ink underline-offset-4 hover:text-accent-clay hover:underline"
        >
          ALL CODE · GITHUB →
        </a>
      </div>
    </section>
  );
}
