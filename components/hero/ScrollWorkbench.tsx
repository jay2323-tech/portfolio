"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { useLenis } from "lenis/react";
import { gsap, registerGsap, ScrollTrigger } from "@/lib/gsap/setup";
import styles from "./workbench.module.css";

/** Progressive enhancement: real documents first, a reversible paper deck when it fits. */
export function ScrollWorkbench({ children }: { children: ReactNode }) {
  const root = useRef<HTMLDivElement>(null);
  const lenis = useLenis();
  useEffect(() => {
    if (!root.current) return;
    registerGsap();
    const el = root.current;
    const media = gsap.matchMedia();
    media.add("(min-width: 1100px) and (min-height: 680px) and (prefers-reduced-motion: no-preference)", () => {
      const stage = el.querySelector<HTMLElement>("[data-deck-stage]")!;
      const cards = Array.from(el.querySelectorAll<HTMLElement>("[data-deck-card]"));
      const tabs = Array.from(el.querySelectorAll<HTMLElement>("[data-deck-jump]"));
      const height = Math.max(...cards.map((card) => card.offsetHeight));
      if (height + 130 > innerHeight) return;
      stage.style.height = `${height + 60}px`;
      el.dataset.deck = "enhanced";
      function activate(index: number) {
        cards.forEach((card, i) => { card.inert = i !== index; card.setAttribute("aria-hidden", String(i !== index)); });
        tabs.forEach((tab, i) => { if (i === index) tab.setAttribute("aria-current", "step"); else tab.removeAttribute("aria-current"); });
      }
      cards.forEach((card, i) => gsap.set(card, { yPercent: i ? 105 : 0, rotation: i ? 2 : -2, zIndex: i + 1, autoAlpha: i ? 0 : 1 }));
      activate(0);
      const timeline = gsap.timeline({ scrollTrigger: {
        trigger: el, start: "top 100px", end: () => `+=${innerHeight * 2.4}`, pin: true,
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
        const time = timeline.time();
        activate(time < .75 ? 0 : time < 2.1 ? 1 : 2);
      });
      const onClick = (event: MouseEvent) => {
        const tab = (event.target as Element).closest<HTMLElement>("[data-deck-jump]");
        if (!tab) return;
        const index = Number(tab.dataset.deckJump);
        const trigger = timeline.scrollTrigger!;
        const time = index === 0 ? 0 : .35 + (index - 1) * 1.35 + .9;
        const target = trigger.start + (trigger.end - trigger.start) * time / timeline.duration();
        event.preventDefault();
        if (lenis) lenis.scrollTo(target, { duration: .65 });
        else window.scrollTo({ top: target, behavior: "smooth" });
      };
      el.addEventListener("click", onClick);
      const resize = new ResizeObserver(() => {
        const nextHeight = Math.max(...cards.map((card) => card.offsetHeight)) + 60;
        if (Math.abs(stage.offsetHeight - nextHeight) > 1) {
          stage.style.height = `${nextHeight}px`;
          ScrollTrigger.refresh();
        }
      });
      cards.forEach((card) => resize.observe(card));
      ScrollTrigger.refresh();
      return () => {
        resize.disconnect();
        el.removeEventListener("click", onClick);
        delete el.dataset.deck;
        stage.style.height = "";
        cards.forEach((card) => { card.inert = false; card.removeAttribute("aria-hidden"); });
        tabs.forEach((tab) => tab.removeAttribute("aria-current"));
      };
    });
    return () => media.revert();
  }, [lenis]);
  return <div ref={root} className={styles.workbench}>{children}</div>;
}
