"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion, type MotionStyle } from "framer-motion";
import { HeroRole } from "./HeroRole";
import { HeroName } from "./HeroName";
import { HeroMeta } from "./HeroMeta";
import { HeroScrollCue } from "./HeroScrollCue";
import { HeroDitherPortrait } from "./HeroDitherPortrait";
import { HeroEdgeTab } from "./HeroEdgeTab";
import { useHeroScroll } from "@/hooks/useHeroScroll";
import { gsap, registerGsap } from "@/lib/gsap/setup";

const META = [
  "3 SYSTEMS SHIPPED / IN BUILD",
  "BASED IN BENGALURU, INDIA",
  "OPEN TO WORK ALL AROUND",
] as const;

/**
 * Hero — stacked on ≤md (portrait above name), absolute on desktop.
 */
export function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const scroll = useHeroScroll(sectionRef);
  const [scrollReady, setScrollReady] = useState(false);

  useEffect(() => {
    setScrollReady(true);
  }, []);

  useEffect(() => {
    if (reduce || !sectionRef.current) return;

    registerGsap();
    const root = sectionRef.current;
    const letters = root.querySelectorAll<HTMLElement>("[data-hero-letter]");
    const role = root.querySelector<HTMLElement>("[data-hero-role]");
    const meta = root.querySelector<HTMLElement>("[data-hero-meta]");
    const portrait = root.querySelector<HTMLElement>("[data-hero-portrait]");
    const cue = root.querySelector<HTMLElement>("[data-hero-cue]");

    gsap.set(letters, { y: 40, opacity: 0 });
    if (role) gsap.set(role, { y: 24, opacity: 0 });
    if (meta) gsap.set(meta, { y: 24, opacity: 0 });
    if (portrait) gsap.set(portrait, { opacity: 0, filter: "blur(14px)" });
    if (cue) gsap.set(cue, { y: 12, opacity: 0 });

    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

    tl.to(letters, {
      y: 0,
      opacity: 1,
      duration: 0.75,
      stagger: 0.04,
    })
      .to(role, { y: 0, opacity: 1, duration: 0.65 }, "-=0.45")
      .to(meta, { y: 0, opacity: 1, duration: 0.65 }, "-=0.4")
      .to(
        portrait,
        { opacity: 1, filter: "blur(0px)", duration: 1.05 },
        "-=0.85",
      )
      .to(cue, { y: 0, opacity: 1, duration: 0.5 }, "-=0.35");

    return () => {
      tl.kill();
    };
  }, [reduce]);

  const fadeStyle: MotionStyle | undefined = scrollReady
    ? { opacity: scroll.marqueeOpacity }
    : undefined;

  return (
    <section
      ref={sectionRef}
      className="relative flex min-h-[36rem] flex-col overflow-hidden border-b border-ink/8 pb-16 md:block md:h-[calc(100dvh-3.5rem)] md:pb-10"
      aria-labelledby="hero-heading"
    >
      {/* Role — top */}
      <div className="section-pad relative z-[1] order-1 w-full pt-8 md:absolute md:left-0 md:top-10 md:w-[52%] md:pt-0 lg:w-[48%]">
        <HeroRole
          title="AI ENGINEER"
          subtitle="PRODUCTION RAG · SYSTEMS · FULL-STACK"
          style={fadeStyle}
        />
      </div>

      {/* Portrait — between role and name on mobile; right plane on desktop */}
      <HeroDitherPortrait className="relative order-2 mx-auto mt-6 h-52 w-[min(100%,20rem)] shrink-0 sm:h-60 md:absolute md:inset-y-0 md:right-0 md:mx-0 md:mt-0 md:h-auto md:w-[48%] lg:w-[45%]" />

      {/* Name + meta */}
      <div className="section-pad relative z-[1] order-3 w-full pt-6 md:absolute md:bottom-28 md:left-0 md:w-[52%] md:pt-0 lg:w-[48%]">
        <HeroName
          first="JAYANTH"
          last="KRISHNA"
          headingId="hero-heading"
          y={scrollReady ? scroll.nameY : undefined}
          opacity={scrollReady ? scroll.nameOpacity : undefined}
        />
        <HeroMeta
          lines={[...META]}
          className="mt-5 md:mt-8"
          style={fadeStyle}
        />
      </div>

      <div
        data-hero-cue
        className="absolute bottom-8 right-4 z-[2] md:bottom-12 md:right-10"
      >
        <HeroScrollCue
          opacity={scrollReady ? scroll.cueOpacity : undefined}
          delay={0}
        />
      </div>

      {/* Edge tab — desktop only */}
      <HeroEdgeTab label="OPEN" />
    </section>
  );
}
