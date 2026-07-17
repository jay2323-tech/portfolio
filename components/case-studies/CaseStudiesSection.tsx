"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "framer-motion";
import { CaseStudyCard } from "./CaseStudyCard";
import { SectionHeader } from "@/components/chrome/SectionHeader";
import { gsap, registerGsap, ScrollTrigger } from "@/lib/gsap/setup";
import type { CaseStudy } from "@/lib/case-studies/types";

type Props = {
  studies: CaseStudy[];
};

export function CaseStudiesSection({ studies }: Props) {
  const sectionRef = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();

  useEffect(() => {
    if (reduce || !sectionRef.current) return;
    registerGsap();
    const root = sectionRef.current;

    const ctx = gsap.context(() => {
      const heading = root.querySelector<HTMLElement>("[data-section-heading]");
      const headerMeta = root.querySelector<HTMLElement>("[data-section-meta]");
      const rows = root.querySelectorAll<HTMLElement>("[data-work-row]");

      if (heading && !heading.classList.contains("sr-only")) {
        gsap.fromTo(
          heading,
          { clipPath: "inset(0 100% 0 0)" },
          {
            clipPath: "inset(0 0% 0 0)",
            duration: 1,
            ease: "power3.out",
            clearProps: "clipPath",
            scrollTrigger: {
              trigger: heading,
              start: "top 85%",
              toggleActions: "play none none none",
            },
          },
        );
      }

      if (headerMeta) {
        gsap.fromTo(
          headerMeta,
          { y: 16, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.55,
            ease: "power2.out",
            clearProps: "transform,opacity",
            scrollTrigger: {
              trigger: headerMeta,
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
            // Drop inline opacity so CSS sibling-dim / mint hover can win
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
  }, [reduce, studies]);

  return (
    <section
      ref={sectionRef}
      id="work"
      className="scroll-mt-20 border-b border-ink/8 py-[var(--section-gap-mobile)] md:py-[var(--section-gap-desktop)]"
      aria-labelledby="work-heading"
    >
      <SectionHeader
        index="01"
        meta={`${studies.length} PROJECTS`}
        title="Featured work"
        bgMarquee="FEATURED WORK"
        headingId="work-heading"
      />

      <div className="work-list mt-10 md:mt-14">
        {studies.map((study) => (
          <CaseStudyCard key={study.slug} study={study} />
        ))}
      </div>
    </section>
  );
}
