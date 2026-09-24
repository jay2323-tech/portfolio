"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { useLenis } from "lenis/react";
import { registerGsap, ScrollTrigger } from "@/lib/gsap/setup";

/** Keep a source/section deep link aligned while scroll pins and fonts settle. */
export function AnchorNavigation() {
  const pathname = usePathname();
  const lenis = useLenis();

  useEffect(() => {
    registerGsap();
    let active = Boolean(window.location.hash);
    let frame = 0;
    let disposed = false;

    function align() {
      cancelAnimationFrame(frame);
      if (!active || disposed) return;
      frame = requestAnimationFrame(() => {
        let id: string;
        try { id = decodeURIComponent(window.location.hash.slice(1)); }
        catch { return; }
        const target = document.getElementById(id);
        if (!target) return;
        const margin = parseFloat(getComputedStyle(target).scrollMarginTop) || 80;
        const top = target.getBoundingClientRect().top + window.scrollY - margin;
        if (lenis) lenis.scrollTo(top, { immediate: true, force: true });
        else window.scrollTo({ top, behavior: "instant" });
      });
    }
    function onHashChange() { active = Boolean(window.location.hash); align(); }
    // Once the visitor starts exploring, never snap them back to the old hash.
    function release() { active = false; cancelAnimationFrame(frame); }
    const inputs = ["wheel", "touchstart", "pointerdown", "keydown"] as const;
    inputs.forEach((event) => window.addEventListener(event, release, { passive: true }));
    window.addEventListener("hashchange", onHashChange);
    ScrollTrigger.addEventListener("refresh", align);
    document.fonts.ready.then(align);
    align();
    return () => {
      disposed = true;
      cancelAnimationFrame(frame);
      inputs.forEach((event) => window.removeEventListener(event, release));
      window.removeEventListener("hashchange", onHashChange);
      ScrollTrigger.removeEventListener("refresh", align);
    };
  }, [pathname, lenis]);

  return null;
}
