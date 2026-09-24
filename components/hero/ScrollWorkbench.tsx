"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { useLenis } from "lenis/react";
import { gsap, registerGsap, ScrollTrigger } from "@/lib/gsap/setup";
import styles from "./workbench.module.css";

/** Real documents first; enhance after layout settles, including cold font loads. */
export function ScrollWorkbench({ children }: { children: ReactNode }) {
  const root = useRef<HTMLDivElement>(null);
  const lenis = useLenis();
  useEffect(() => {
    if (!root.current) return;
    registerGsap();
    const el = root.current;
    const stage = el.querySelector<HTMLElement>("[data-deck-stage]")!;
    const cards = Array.from(el.querySelectorAll<HTMLElement>("[data-deck-card]"));
    const tabs = Array.from(el.querySelectorAll<HTMLElement>("[data-deck-jump]"));
    const media = window.matchMedia("(min-width: 1100px) and (min-height: 680px) and (prefers-reduced-motion: no-preference)");
    let context: gsap.Context | undefined;
    let timeline: gsap.core.Timeline | undefined;
    let frame = 0;
    let disposed = false;
    let active = -1;

    function activate(index: number) {
      if (active === index) return;
      active = index;
      cards.forEach((card, i) => { card.inert = i !== index; card.setAttribute("aria-hidden", String(i !== index)); });
      tabs.forEach((tab, i) => { if (i === index) tab.setAttribute("aria-current", "step"); else tab.removeAttribute("aria-current"); });
    }
    function reset() {
      context?.revert();
      context = undefined;
      timeline = undefined;
      active = -1;
      delete el.dataset.deck;
      stage.style.height = "";
      cards.forEach((card) => { card.inert = false; card.removeAttribute("aria-hidden"); });
      tabs.forEach((tab) => tab.removeAttribute("aria-current"));
    }
    function sync() {
      if (disposed) return;
      const height = Math.max(...cards.map((card) => card.offsetHeight));
      if (!media.matches || height + 130 > window.innerHeight || cards.length < 2) {
        if (context) { reset(); ScrollTrigger.refresh(); }
        return;
      }
      const nextHeight = height + 60;
      if (context) {
        if (Math.abs(stage.offsetHeight - nextHeight) > 1) {
          stage.style.height = `${nextHeight}px`;
          ScrollTrigger.refresh();
        }
        return;
      }
      stage.style.height = `${nextHeight}px`;
      el.dataset.deck = "enhanced";
      context = gsap.context(() => {
        cards.forEach((card, i) => gsap.set(card, { yPercent: i ? 105 : 0, rotation: i ? 2 : -2, zIndex: i + 1, autoAlpha: i ? 0 : 1 }));
        activate(0);
        timeline = gsap.timeline({ scrollTrigger: {
          trigger: el, start: "top 100px", end: () => `+=${window.innerHeight * 1.2 * (cards.length - 1)}`, pin: true,
          scrub: .45, invalidateOnRefresh: true, anticipatePin: 1,
        }});
        timeline.to({}, { duration: .35 });
        for (let i = 0; i < cards.length - 1; i++) {
          const at = .35 + i * 1.35;
          timeline.to(cards[i], { yPercent: -105, rotation: -5, autoAlpha: 0, duration: .8, ease: "none" }, at);
          timeline.to(cards[i + 1], { yPercent: 0, rotation: -2, autoAlpha: 1, duration: .8, ease: "none" }, at);
          timeline.to({}, { duration: .55 }, at + .8);
        }
        timeline.eventCallback("onUpdate", () => {
          activate(Math.min(cards.length - 1, Math.max(0, Math.floor((timeline!.time() - .75) / 1.35) + 1)));
        });
      }, el);
      ScrollTrigger.refresh();
    }
    function scheduleSync() {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(sync);
    }
    const onClick = (event: MouseEvent) => {
      const tab = (event.target as Element).closest<HTMLElement>("[data-deck-jump]");
      if (!tab || !timeline) return;
      const index = Number(tab.dataset.deckJump);
      const trigger = timeline.scrollTrigger!;
      const time = index === 0 ? 0 : .35 + (index - 1) * 1.35 + .9;
      const target = trigger.start + (trigger.end - trigger.start) * time / timeline.duration();
      event.preventDefault();
      if (lenis) lenis.scrollTo(target, { duration: .65 });
      else window.scrollTo({ top: target, behavior: "smooth" });
    };
    // Observe even when the first measurement cannot fit. Fonts/images arriving
    // later must be able to enable the deck without a reload or a breakpoint change.
    const resize = new ResizeObserver(scheduleSync);
    cards.forEach((card) => resize.observe(card));
    media.addEventListener("change", scheduleSync);
    window.addEventListener("resize", scheduleSync);
    document.fonts.ready.then(() => { if (!disposed) scheduleSync(); });
    el.addEventListener("click", onClick);
    scheduleSync();
    return () => {
      disposed = true;
      cancelAnimationFrame(frame);
      resize.disconnect();
      media.removeEventListener("change", scheduleSync);
      window.removeEventListener("resize", scheduleSync);
      el.removeEventListener("click", onClick);
      reset();
    };
  }, [lenis]);
  return <div ref={root} className={styles.workbench}>{children}</div>;
}
