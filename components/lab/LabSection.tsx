"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArchitectureDiagramCanvas } from "@/components/architecture-diagram/ArchitectureDiagram";
import { LabNetworkCanvas } from "./LabNetworkCanvas";
import { SectionHeader } from "@/components/chrome/SectionHeader";
import { useAsk } from "@/components/ask-my-work/AskContext";
import { gsap, registerGsap, ScrollTrigger } from "@/lib/gsap/setup";
import { onRowGlowMove } from "@/lib/motion/rowGlow";
import { cn } from "@/lib/utils";
import type { SiteLab } from "@/lib/content/reader";

type Props = {
  content: SiteLab;
};

/**
 * Experiment Lab — section marquee + experiment rows + Ask / diagram.
 */
export function LabSection({ content }: Props) {
  const { openAsk } = useAsk();
  const sectionRef = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const [diagramOpen, setDiagramOpen] = useState(true);
  const experiments = content.experiments ?? [];

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
          {
            y: 30,
            opacity: 0,
            rotateX: -12,
            transformPerspective: 900,
            transformOrigin: "50% 100%",
          },
          {
            y: 0,
            opacity: 1,
            rotateX: 0,
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
        meta={content.meta || "PROOF OF BUILD"}
        title="Experiment lab"
        bgMarquee="EXPERIMENT LAB"
        headingId="lab-heading"
      />

      <div className="relative">
        <LabNetworkCanvas />
        <ul className="lab-list relative mt-10 md:mt-14">
        {experiments.map((exp) => (
          <li
            key={exp.n}
            data-lab-row
            onMouseMove={onRowGlowMove}
            className="lab-row row-glow group border-t border-ink/10 transition-[background-color,opacity] duration-250 ease-out last:border-b"
          >
            <div className="section-pad mx-auto grid max-w-[var(--content-max)] gap-4 py-10 md:grid-cols-[minmax(0,1fr)_auto] md:items-start md:gap-10 md:py-12">
              <div className="min-w-0">
                <p className="font-mono-data text-[10px] tracking-[0.16em] text-muted">
                  {exp.n}
                  <span className="mx-2 text-ink/20">·</span>
                  {exp.tags.join(" · ")}
                </p>
                <h3 className="font-display mt-3 text-[clamp(1.75rem,3.5vw,2.75rem)] leading-[0.85] tracking-tight text-ink transition-transform duration-250 ease-out origin-left group-hover:scale-[1.02]">
                  {exp.title}
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
                {exp.action === "link" && exp.href && (
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
      </div>

      <div
        id="lab-diagram"
        className="section-pad mx-auto mt-10 max-w-[var(--content-max)] scroll-mt-24 md:mt-14"
      >
        <div className="border border-ink/10 bg-sky/35 px-5 py-8 md:px-8 md:py-10">
          <button
            type="button"
            onClick={() => setDiagramOpen((v) => !v)}
            aria-expanded={diagramOpen}
            aria-controls="lab-diagram-panel"
            className="flex w-full items-center justify-between gap-4 font-mono-data text-[10px] tracking-[0.16em] text-muted"
          >
            <span>DIAGRAM · COMPANYBRAIN</span>
            <span aria-hidden className="text-ink">
              {diagramOpen ? "▴ COLLAPSE" : "▾ EXPAND"}
            </span>
          </button>
          <AnimatePresence initial={false}>
            {diagramOpen && (
              <motion.div
                key="lab-diagram-panel"
                id="lab-diagram-panel"
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                className="overflow-hidden"
              >
                <div className="mt-4">
                  <ArchitectureDiagramCanvas />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
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
