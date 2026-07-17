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
 * Keep ScrollTrigger in sync with Lenis smooth scroll.
 * Call from a child of ReactLenis when the Lenis instance is ready.
 */
export function setupGsapWithLenis(lenis: Lenis) {
  registerGsap();

  const onScroll = () => {
    ScrollTrigger.update();
  };

  lenis.on("scroll", onScroll);
  ScrollTrigger.refresh();

  return () => {
    lenis.off("scroll", onScroll);
  };
}

export { gsap, ScrollTrigger };
