"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "framer-motion";
import { gsap, registerGsap, ScrollTrigger } from "@/lib/gsap/setup";

const DEFAULT_ORGS = [
  "CompanyBrain",
  "Factory Attendance",
  "DesiFit",
  "FastAPI",
  "Qdrant",
  "Next.js",
  "Anthropic",
  "OpenAI",
  "TypeScript",
  "Python",
  "Vercel",
  "PostgreSQL",
];

type Props = {
  items?: string[];
};

/** Tools strip — GSAP infinite loop (~40px/s), pause this tween on hover. */
export function LogoMarquee({ items = DEFAULT_ORGS }: Props) {
  const trackRef = useRef<HTMLDivElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const orgs = items.length ? items : DEFAULT_ORGS;
  const row = [...orgs, ...orgs];
  const orgsKey = orgs.join("|");

  useEffect(() => {
    if (reduce || !trackRef.current || !wrapRef.current) return;
    registerGsap();

    const track = trackRef.current;
    const wrap = wrapRef.current;

    // duration ≈ distance / 16px/s — calm loop
    const half = track.scrollWidth / 2;
    const duration = Math.max(36, half / 16);

    const loop = gsap.to(track, {
      x: -half,
      duration,
      ease: "none",
      repeat: -1,
    });

    const onEnter = () => loop.pause();
    const onLeave = () => loop.resume();
    wrap.addEventListener("mouseenter", onEnter);
    wrap.addEventListener("mouseleave", onLeave);

    // Scroll velocity boosts (and can reverse) the loop's speed — the
    // strip briefly races when you scroll fast, settling back to 1×.
    const st = ScrollTrigger.create({
      trigger: wrap,
      start: "top bottom",
      end: "bottom top",
      onUpdate: (self) => {
        const v = self.getVelocity();
        const boost = gsap.utils.clamp(0.55, 2.2, 1 + Math.abs(v) / 3500);
        loop.timeScale(self.direction === -1 ? -boost : boost);
      },
      onLeaveBack: () => loop.timeScale(1),
      onLeave: () => loop.timeScale(1),
    });

    return () => {
      wrap.removeEventListener("mouseenter", onEnter);
      wrap.removeEventListener("mouseleave", onLeave);
      st.kill();
      loop.kill();
    };
  }, [reduce, orgsKey]);

  return (
    <section
      className="border-b border-ink/8 py-10 md:py-12"
      aria-labelledby="orgs-heading"
    >
      <div className="section-pad mx-auto max-w-[var(--content-max)]">
        <h2
          id="orgs-heading"
          className="font-mono-data text-[10px] uppercase tracking-[0.2em] text-muted"
        >
          SOME OF THE SYSTEMS & TOOLS I&apos;VE WORKED WITH
        </h2>
      </div>
      <div
        ref={wrapRef}
        className="mt-6 overflow-hidden border-y border-ink/8 py-4"
        style={{ perspective: "700px" }}
        aria-hidden
      >
        <div
          className="[transform-style:preserve-3d] [transform:rotateX(7deg)]"
        >
          <div
            ref={trackRef}
            className="flex w-max gap-14 px-6 will-change-transform md:gap-16"
          >
            {row.map((name, i) => (
              <span
                key={`${name}-${i}`}
                className="logo-marquee-item shrink-0 font-display text-xl tracking-tight text-ink md:text-2xl"
              >
                {name}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
