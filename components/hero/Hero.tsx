"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion, type MotionStyle } from "framer-motion";
import { HeroRole } from "./HeroRole";
import { HeroName } from "./HeroName";
import { HeroMeta } from "./HeroMeta";
import { HeroScrollCue } from "./HeroScrollCue";
import { HeroDitherPortrait } from "./HeroDitherPortrait";
import { HeroEdgeTab } from "./HeroEdgeTab";
import { HeroParticles } from "./HeroParticles";
import { HeroShaderField } from "@/components/webgl/HeroShaderField";
import { useHeroScroll } from "@/hooks/useHeroScroll";
import { gsap, registerGsap, ScrollTrigger } from "@/lib/gsap/setup";
import { scrambleText } from "@/lib/motion/scramble";
import { countUp } from "@/lib/motion/countUp";

export type HeroContent = {
  firstName: string;
  lastName: string;
  roleTitle: string;
  roleSubtitle: string;
  metaLines: string[];
  edgeTabLabel?: string;
  portraitSrc?: string;
};

/**
 * Hero — sequenced scramble → role words → meta/count-up → cue bob.
 * Stacked on ≤md; absolute composition on desktop.
 */
export function Hero({
  firstName = "JAYANTH",
  lastName = "KRISHNA",
  roleTitle = "AI ENGINEER",
  roleSubtitle = "PRODUCTION RAG · SYSTEMS · FULL-STACK",
  metaLines = [
    "3 SYSTEMS SHIPPED / IN BUILD",
    "BASED IN BENGALURU, INDIA",
    "OPEN TO WORK ALL AROUND",
  ],
  edgeTabLabel = "OPEN",
  portraitSrc = "/portrait.jpg",
}: HeroContent) {
  const sectionRef = useRef<HTMLElement>(null);
  const nameWrapRef = useRef<HTMLDivElement>(null);
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
    const letters = Array.from(
      root.querySelectorAll<HTMLElement>("[data-hero-letter]"),
    );
    const words = root.querySelectorAll<HTMLElement>("[data-hero-word]");
    const chips = root.querySelectorAll<HTMLElement>("[data-hero-chip]");
    const role = root.querySelector<HTMLElement>("[data-hero-role]");
    const meta = root.querySelector<HTMLElement>("[data-hero-meta]");
    const portrait = root.querySelector<HTMLElement>("[data-hero-portrait]");
    const cue = root.querySelector<HTMLElement>("[data-hero-cue]");
    const kills: Array<() => void> = [];

    const finals = letters.map(
      (el) => el.dataset.char ?? el.textContent ?? "",
    );
    const finalText = finals.join("");

    gsap.set(letters, {
      opacity: 1,
      y: 0,
      rotateX: -75,
      transformPerspective: 480,
    });
    letters.forEach((el) => {
      const inner = el.querySelector("span") ?? el;
      inner.textContent = "·";
    });

    if (words.length) gsap.set(words, { y: 20, opacity: 0 });
    if (role) gsap.set(role, { opacity: 1 });
    if (chips.length) gsap.set(chips, { y: 16, opacity: 0 });
    if (meta) gsap.set(meta, { opacity: 1 });
    if (portrait) gsap.set(portrait, { opacity: 0, filter: "blur(14px)" });
    if (cue) gsap.set(cue, { y: 12, opacity: 0 });

    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

    // 0) Letters tumble upright in 3D while the scramble decodes below
    tl.to(letters, {
      rotateX: 0,
      duration: 0.6,
      stagger: 0.03,
      ease: "back.out(1.6)",
    });

    // 1) Scramble-decode name (promise wrapped into timeline)
    tl.add(() => {
      const cancel = scrambleText({
        text: finalText,
        charDuration: 40,
        cycles: 3,
        onUpdate: (display) => {
          const chars = display.split("");
          letters.forEach((el, i) => {
            const inner = el.querySelector("span") ?? el;
            const ch = chars[i] ?? finals[i] ?? "";
            inner.textContent = ch === " " ? "\u00A0" : ch;
          });
        },
        onComplete: () => {
          letters.forEach((el, i) => {
            const inner = el.querySelector("span") ?? el;
            inner.textContent = finals[i] === " " ? "\u00A0" : finals[i];
          });
        },
      });
      kills.push(cancel);
    });

    // Hold timeline for scramble duration (~800ms for JAYANTHKRISHNA)
    const scrambleHold = Math.min(
      900,
      Math.max(600, (finalText.replace(/[ .]/g, "").length) * 40 + 120),
    );
    tl.to({}, { duration: scrambleHold / 1000 });

    // 2) Role / tagline words
    if (words.length) {
      tl.to(words, {
        y: 0,
        opacity: 1,
        duration: 0.55,
        stagger: 0.05,
        ease: "power3.out",
      });
    }

    // 3) Meta chips + count-up
    if (chips.length) {
      tl.to(
        chips,
        {
          y: 0,
          opacity: 1,
          duration: 0.5,
          stagger: 0.08,
          ease: "power3.out",
          onStart: () => {
            root.querySelectorAll<HTMLElement>("[data-count-up]").forEach((el) => {
              const target = Number(el.dataset.countUp ?? "0");
              if (!Number.isFinite(target)) return;
              kills.push(countUp(el, target, { duration: 0.7 }));
            });
          },
        },
        "-=0.15",
      );
    }

    // Portrait + cue in parallel with late meta
    if (portrait) {
      tl.to(
        portrait,
        { opacity: 1, filter: "blur(0px)", duration: 1.05 },
        "-=0.55",
      );
    }
    if (cue) {
      tl.to(cue, { y: 0, opacity: 1, duration: 0.5 }, "-=0.4");
      const bob = gsap.to(cue, {
        y: 4,
        duration: 1.4,
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1,
        delay: 0.5,
      });
      kills.push(() => bob.kill());

      const st = ScrollTrigger.create({
        trigger: root,
        start: "top top",
        end: "bottom top",
        onLeave: () => {
          gsap.to(cue, { opacity: 0, duration: 0.35, overwrite: true });
          bob.pause();
        },
        onEnterBack: () => {
          gsap.to(cue, { opacity: 1, duration: 0.35 });
          bob.play();
        },
      });
      kills.push(() => st.kill());
    }

    return () => {
      tl.kill();
      kills.forEach((k) => k());
    };
  }, [reduce]);

  // Whole-name magnetic drift — leans a few px toward the cursor anywhere
  // in the section, layered under HeroName's own per-letter proximity bulge.
  useEffect(() => {
    if (reduce) return;
    const section = sectionRef.current;
    const wrap = nameWrapRef.current;
    if (!section || !wrap) return;
    if (window.matchMedia("(pointer: coarse)").matches) return;

    registerGsap();
    const xTo = gsap.quickTo(wrap, "x", { duration: 0.9, ease: "power3.out" });
    const yTo = gsap.quickTo(wrap, "y", { duration: 0.9, ease: "power3.out" });
    const MAX_X = 10;
    const MAX_Y = 6;

    function onMove(e: MouseEvent) {
      const rect = section!.getBoundingClientRect();
      const nx = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const ny = ((e.clientY - rect.top) / rect.height) * 2 - 1;
      xTo(nx * MAX_X);
      yTo(ny * MAX_Y);
    }
    function onLeave() {
      xTo(0);
      yTo(0);
    }

    section.addEventListener("mousemove", onMove);
    section.addEventListener("mouseleave", onLeave);
    return () => {
      section.removeEventListener("mousemove", onMove);
      section.removeEventListener("mouseleave", onLeave);
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
      <HeroParticles className="z-0" />

      <div className="section-pad relative z-[1] order-1 w-full pt-8 md:absolute md:left-0 md:top-10 md:w-[52%] md:pt-0 lg:w-[48%]">
        <HeroRole
          title={roleTitle}
          subtitle={roleSubtitle}
          style={fadeStyle}
        />
      </div>

      <HeroShaderField className="order-2 hidden md:block md:absolute md:inset-y-0 md:right-0 md:w-[48%] lg:w-[45%]" />

      <HeroDitherPortrait
        src={portraitSrc}
        className="relative order-2 mx-auto mt-6 h-52 w-[min(100%,20rem)] shrink-0 sm:h-60 md:absolute md:inset-y-0 md:right-0 md:mx-0 md:mt-0 md:h-auto md:w-[48%] lg:w-[45%]"
      />

      <div
        ref={nameWrapRef}
        className="section-pad relative z-[1] order-3 w-full pt-6 will-change-transform md:absolute md:bottom-28 md:left-0 md:w-[52%] md:pt-0 lg:w-[48%]"
      >
        <HeroName
          first={firstName}
          last={lastName}
          headingId="hero-heading"
          y={scrollReady ? scroll.nameY : undefined}
          opacity={scrollReady ? scroll.nameOpacity : undefined}
        />
        <HeroMeta
          lines={metaLines}
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

      <HeroEdgeTab label={edgeTabLabel} />
    </section>
  );
}
