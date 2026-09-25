"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap/setup";
import { useScrollReveal } from "@/lib/motion/useScrollReveal";
import { cn } from "@/lib/utils";

type Props = { text: string; className?: string; reverse?: boolean };

/** One soft entrance, then restrained scroll drift. No continuous racing loop. */
export function SectionMarquee({ text, className, reverse = false }: Props) {
  const rootRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  useScrollReveal(rootRef, "[data-marquee-entrance]", { x: reverse ? -64 : 64, y: 0 });

  useEffect(() => {
    const root = rootRef.current;
    const track = trackRef.current;
    if (!root || !track) return;
    const media = gsap.matchMedia();
    let update = () => {};
    media.add("(prefers-reduced-motion: no-preference)", () => {
      // Measure the current viewport position, so upstream pin changes cannot
      // leave a stale start/end and consume this section's movement offscreen.
      const move = gsap.quickTo(track, "x", { duration: 1.2, ease: "power2.out" });
      let frame = 0;
      const position = () => {
        const rect = root.getBoundingClientRect();
        const progress = gsap.utils.clamp(0, 1, (window.innerHeight - rect.top) / (window.innerHeight + rect.height));
        const travel = Math.min(120, window.innerWidth * .09);
        return reverse ? -travel + progress * travel : -progress * travel;
      };
      update = () => {
        cancelAnimationFrame(frame);
        frame = requestAnimationFrame(() => move(position()));
      };
      gsap.set(track, { x: position() });
      window.addEventListener("scroll", update, { passive: true });
      window.addEventListener("resize", update);
      return () => {
        cancelAnimationFrame(frame);
        window.removeEventListener("scroll", update);
        window.removeEventListener("resize", update);
        move.tween.kill();
      };
    });
    let disposed = false;
    document.fonts.ready.then(() => { if (!disposed) update(); });
    return () => { disposed = true; media.revert(); };
  }, [text, reverse]);

  return <div ref={rootRef} className={cn("relative mt-6 overflow-hidden border-y border-ink/8 px-6 py-6 md:mt-8 md:px-12 md:py-9", className)} aria-hidden>
    <div data-marquee-entrance>
      <div ref={trackRef} className="flex w-max items-center gap-10 whitespace-nowrap font-mono text-[clamp(2.25rem,9vw,8rem)] font-medium uppercase leading-[1.1] tracking-[-0.04em] text-ink/[0.14] md:gap-16">
        {Array.from({length: 5}, (_, index) => <span key={index}>{text.toUpperCase()} <span className="ml-10 opacity-40 md:ml-16">·</span></span>)}
      </div>
    </div>
  </div>;
}
