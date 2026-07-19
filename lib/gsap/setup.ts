import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type Lenis from "lenis";

let registered = false;

/** Register GSAP plugins once (client only). */
export function registerGsap() {
  if (registered || typeof window === "undefined") return;
  gsap.registerPlugin(ScrollTrigger);
  registered = true;
}

/**
 * Keep ScrollTrigger in sync with Lenis; drive Lenis from GSAP ticker
 * so scrubbed timelines stay locked to smooth scroll.
 */
export function setupGsapWithLenis(lenis: Lenis) {
  registerGsap();

  // Keep ScrollTrigger in lockstep with Lenis (scrubbed marquees / pins)
  const onScroll = () => {
    ScrollTrigger.update();
  };

  const onTick = (time: number) => {
    lenis.raf(time * 1000);
  };

  lenis.on("scroll", onScroll);
  gsap.ticker.add(onTick);
  gsap.ticker.lagSmoothing(0);

  // After Lenis mounts, recalculate all triggers (section marquees, work pin)
  requestAnimationFrame(() => {
    ScrollTrigger.refresh();
  });

  return () => {
    lenis.off("scroll", onScroll);
    gsap.ticker.remove(onTick);
  };
}

export { gsap, ScrollTrigger };
