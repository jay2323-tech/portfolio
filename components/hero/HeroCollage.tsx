"use client";

import { useLayoutEffect, useRef } from "react";
import { useReducedMotion } from "framer-motion";
import { HeroParticles } from "./HeroParticles";
import { HeroScrollCue } from "./HeroScrollCue";
import { TornEdge } from "@/components/collage/TornEdge";
import { Sticker } from "@/components/collage/Sticker";
import { gsap, registerGsap } from "@/lib/gsap/setup";
import { scrambleText } from "@/lib/motion/scramble";

export type HeroCollageContent = {
  greetingLines?: string[];
  firstName: string;
  lastName: string;
  roleTitle: string;
  roleSubtitle: string;
  metaLines: string[];
  portraitSrc?: string;
};

/**
 * HeroCollage — Detroit-style stacked greeting (HELLO / I'M / JAYANTH),
 * scramble-decoded name, cutout portrait on a paper blob, scattered stickers,
 * and a torn-paper base. Reuses the sequenced GSAP entrance from the old Hero
 * (words rise → name decodes → caption → portrait blur-in), all gated by
 * prefers-reduced-motion via the shared [data-hero-*] CSS.
 */
export function HeroCollage({
  greetingLines = ["HELLO", "I'M"],
  firstName = "JAYANTH",
  lastName = "KRISHNA",
  roleTitle = "AI ENGINEER",
  roleSubtitle = "PRODUCTION RAG · SYSTEMS · FULL-STACK",
  metaLines = [],
  portraitSrc = "/portrait.jpg",
}: HeroCollageContent) {
  const sectionRef = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const nameChars = firstName.split("");

  useLayoutEffect(() => {
    if (!sectionRef.current) return;
    if (reduce) {
      sectionRef.current.querySelectorAll<HTMLElement>("[data-hero-letter]").forEach((el) => {
        const inner = el.querySelector("span") ?? el;
        inner.textContent = el.dataset.char ?? "";
      });
      return;
    }
    registerGsap();
    const root = sectionRef.current;

    const ctx = gsap.context(() => {
      const words = root.querySelectorAll<HTMLElement>("[data-hero-word]");
      const letters = Array.from(
        root.querySelectorAll<HTMLElement>("[data-hero-letter]"),
      );
      const chips = root.querySelectorAll<HTMLElement>("[data-hero-chip]");
      const portrait = root.querySelector<HTMLElement>("[data-hero-portrait]");
      const cue = root.querySelector<HTMLElement>("[data-hero-cue]");
      // Float stickers own their transform via a CSS keyframe, so GSAP only
      // touches their opacity — animating scale here too would leave two
      // owners of `transform` and make ctx.revert() unable to reset it.
      const stickersPop = root.querySelectorAll<HTMLElement>(
        "[data-hero-sticker]:not(.collage-sticker--float)",
      );
      const stickersFloat = root.querySelectorAll<HTMLElement>(
        "[data-hero-sticker].collage-sticker--float",
      );
      const kills: Array<() => void> = [];

      const finals = letters.map((el) => el.dataset.char ?? el.textContent ?? "");
      const finalText = finals.join("");

      if (words.length) gsap.set(words, { y: 28, opacity: 0 });
      if (chips.length) gsap.set(chips, { y: 16, opacity: 0 });
      if (portrait) gsap.set(portrait, { opacity: 0, filter: "blur(14px)", scale: 0.96 });
      if (cue) gsap.set(cue, { y: 12, opacity: 0 });
      if (stickersPop.length) gsap.set(stickersPop, { scale: 0, opacity: 0, transformOrigin: "center" });
      if (stickersFloat.length) gsap.set(stickersFloat, { opacity: 0 });
      letters.forEach((el) => {
        const inner = el.querySelector("span") ?? el;
        inner.textContent = "·";
      });

      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      // 1) Greeting words rise
      if (words.length) {
        tl.to(words, { y: 0, opacity: 1, duration: 0.6, stagger: 0.12 });
      }

      // 2) Name scramble-decodes
      tl.add(() => {
        const cancel = scrambleText({
          text: finalText,
          charDuration: 42,
          cycles: 3,
          onUpdate: (display) => {
            const chars = display.split("");
            letters.forEach((el, i) => {
              const inner = el.querySelector("span") ?? el;
              const ch = chars[i] ?? finals[i] ?? "";
              inner.textContent = ch === " " ? " " : ch;
            });
          },
          onComplete: () => {
            letters.forEach((el, i) => {
              const inner = el.querySelector("span") ?? el;
              inner.textContent = finals[i] === " " ? " " : finals[i];
            });
          },
        });
        kills.push(cancel);
      });
      const hold = Math.min(900, Math.max(500, finalText.length * 42 + 120));
      tl.to({}, { duration: hold / 1000 });

      // 3) Caption chips
      if (chips.length) {
        tl.to(chips, { y: 0, opacity: 1, duration: 0.5, stagger: 0.08 }, "-=0.2");
      }

      // 4) Portrait blur-in (parallel with late caption)
      if (portrait) {
        tl.to(portrait, { opacity: 1, filter: "blur(0px)", scale: 1, duration: 1 }, "-=0.7");
      }

      // 5) Stickers appear — non-float ones pop with scale, float ones fade
      //    (their transform belongs to the CSS float keyframe).
      if (stickersPop.length) {
        tl.to(
          stickersPop,
          { scale: 1, opacity: 1, duration: 0.5, stagger: 0.09, ease: "back.out(2)" },
          "-=0.5",
        );
      }
      if (stickersFloat.length) {
        tl.to(
          stickersFloat,
          { opacity: 1, duration: 0.5, stagger: 0.09 },
          "-=0.5",
        );
      }

      // 6) Cue + bob
      if (cue) {
        tl.to(cue, { y: 0, opacity: 1, duration: 0.5 }, "-=0.3");
        const bob = gsap.to(cue, {
          y: 5,
          duration: 1.4,
          ease: "sine.inOut",
          yoyo: true,
          repeat: -1,
          delay: 0.4,
        });
        kills.push(() => bob.kill());
      }

      return () => kills.forEach((k) => k());
    }, sectionRef);

    // kill() (not revert()) — the intro should persist; reverting scale back to
    // 0 both undoes the entrance and trips GSAP's "scale not eligible for reset"
    // warning. The next mount re-runs gsap.set() to re-establish initial state.
    return () => ctx.kill();
  }, [reduce]);

  return (
    <section
      ref={sectionRef}
      id="top"
      className="hero-collage relative flex min-h-[42rem] flex-col overflow-hidden pb-16 md:min-h-[calc(100dvh-4rem)] md:pb-28"
      aria-labelledby="hero-heading"
    >
      <HeroParticles className="z-0" />

      <div className="section-pad relative z-[1] grid flex-1 items-center gap-3 pt-5 md:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] md:gap-10 md:pt-0">
        {/* Left — greeting + name + caption */}
        <div className="order-2 md:order-1">
          <p
            data-hero-word
            className="font-mono-data mb-4 text-[11px] tracking-[0.2em] text-muted"
          >
            A QUICK HELLO —
          </p>

          <h1 id="hero-heading" className="font-display leading-[0.86]">
            <span className="sr-only">
              {greetingLines.join(" ")} {firstName} {lastName}
            </span>
            {greetingLines.map((word) => (
              <span
                key={word}
                data-hero-word
                aria-hidden="true"
                className="block text-[clamp(2.75rem,8vw,7rem)] font-black tracking-[-0.03em] text-ink"
              >
                {word}
              </span>
            ))}
            <span
              aria-hidden="true"
              className="block whitespace-nowrap text-[clamp(2.75rem,8vw,7rem)] font-black tracking-[-0.03em] text-accent-clay"
            >
              {nameChars.map((ch, i) => (
                <span
                  key={`${ch}-${i}`}
                  data-hero-letter
                  data-char={ch}
                  className="inline-block"
                >
                  <span>{ch}</span>
                </span>
              ))}
            </span>
            <span
              data-hero-word
              aria-hidden="true"
              className="mt-2 block text-[clamp(1.4rem,4vw,2.6rem)] font-semibold tracking-[0.02em] text-ink"
            >
              {lastName}
            </span>
          </h1>

          <div data-hero-chip className="mt-5 max-w-md md:mt-7">
            <p className="font-display text-lg font-medium text-ink">
              {roleTitle} · <span className="text-mint-deep">{roleSubtitle}</span>
            </p>
            {metaLines.length > 0 && (
              <ul className="font-mono-data mt-4 space-y-1.5 text-[11px] tracking-[0.12em] text-muted">
                {metaLines.map((line) => (
                  <li key={line} className="flex items-center gap-2">
                    <span className="text-mint-deep">→</span>
                    {line}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* Right — cutout portrait on a paper blob */}
        <div className="order-1 md:order-2 md:justify-self-end">
          <div
            data-hero-portrait
            className="relative mx-auto aspect-[4/5] w-[min(62%,15rem)] md:ml-auto md:mr-0 md:w-[min(100%,20rem)]"
          >
            <img
              src="/images/editorial/blob-sky.svg"
              alt=""
              aria-hidden="true"
              className="absolute -inset-8 -z-10 h-[calc(100%+4rem)] w-[calc(100%+4rem)] opacity-90"
            />
            <div
              className="relative h-full w-full overflow-hidden border-[6px] border-white bg-surface shadow-[0_30px_70px_-30px_rgba(20,20,20,0.45)]"
              style={{ borderRadius: "46% 54% 52% 48% / 54% 46% 55% 45%", contain: "paint" }}
            >
              <img
                src={portraitSrc}
                alt="Jayanth Krishna"
                className="h-full w-full origin-left scale-[1.45] object-cover"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Scattered stickers — fixed rotations (deterministic) */}
      <Sticker
        src="asterisk-mint.svg"
        size={54}
        rotate={8}
        float
        top="14%"
        left="6%"
        className="hidden md:block"
        data-hero-sticker
      />
      <Sticker
        src="sparkle-clay.svg"
        size={44}
        rotate={-14}
        top="8%"
        left="40%"
        className="hidden md:block"
        data-hero-sticker
      />
      <Sticker
        src="eye.svg"
        size={58}
        rotate={12}
        float
        top="12%"
        right="8%"
        data-hero-sticker
      />
      <Sticker
        src="squiggle-clay.svg"
        size={120}
        rotate={-3}
        bottom="13%"
        left="35%"
        className="hidden md:block"
        data-hero-sticker
      />

      <div data-hero-cue className="absolute bottom-14 right-6 z-[3] hidden md:block md:bottom-28 md:right-10">
        <HeroScrollCue delay={0} />
      </div>

      <TornEdge side="bottom" variant={2} fill="var(--surface)" height={48} className="!translate-y-0" />
    </section>
  );
}
