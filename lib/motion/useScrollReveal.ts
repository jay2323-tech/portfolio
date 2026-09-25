"use client";

import { useEffect, type RefObject } from "react";
import { gsap } from "@/lib/gsap/setup";

/** Observe actual viewport intersections, independent of pinned-section measurements. */
export function useScrollReveal(
  root: RefObject<HTMLElement | null>,
  selector: string,
  { x = 0, y = 24, stagger = 0 }: { x?: number; y?: number; stagger?: number } = {},
) {
  useEffect(() => {
    if (!root.current) return;
    const elements = Array.from(root.current.querySelectorAll<HTMLElement>(selector));
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const originals = elements.map((el) => el.getAttribute("style"));
    let observer: IntersectionObserver | undefined;
    const tweens = new Map<Element, gsap.core.Tween>();
    function stop() {
      observer?.disconnect();
      tweens.forEach((tween) => tween.kill());
      tweens.clear();
      elements.forEach((el, i) => {
        if (originals[i] === null) el.removeAttribute("style");
        else el.setAttribute("style", originals[i]!);
      });
    }
    function start() {
      stop();
      if (media.matches) return;
      observer = new IntersectionObserver((entries) => {
        const entering = entries.filter((entry) => entry.isIntersecting);
        entering.forEach((entry, index) => {
          // Content is visible by default. Start the reveal only when actually
          // on screen, and replay on a later visit rather than consuming it early.
          if (tweens.get(entry.target)?.isActive()) return;
          tweens.set(entry.target, gsap.fromTo(entry.target,
            { x, y, opacity: 0 },
            { x: 0, y: 0, opacity: 1, duration: .7, delay: Math.min(index, 3) * stagger,
              ease: "power3.out", clearProps: "transform,opacity", overwrite: "auto" },
          ));
        });
      }, { rootMargin: "0px 0px -7% 0px", threshold: 0 });
      elements.forEach((el) => observer!.observe(el));
    }
    start();
    media.addEventListener("change", start);
    return () => { media.removeEventListener("change", start); stop(); };
  }, [root, selector, x, y, stagger]);
}
