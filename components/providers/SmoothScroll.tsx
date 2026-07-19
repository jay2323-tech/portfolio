"use client";

import { ReactLenis, useLenis } from "lenis/react";
import { useEffect, useState, type ReactNode } from "react";
import { setupGsapWithLenis, registerGsap } from "@/lib/gsap/setup";
import { useSafeReducedMotion } from "@/lib/motion/useSafeReducedMotion";
import "lenis/dist/lenis.css";

type Props = {
  children: ReactNode;
};

function GsapLenisBridge() {
  const lenis = useLenis();

  useEffect(() => {
    registerGsap();
    if (!lenis) return;
    return setupGsapWithLenis(lenis);
  }, [lenis]);

  return null;
}

function useCoarsePointer() {
  const [coarse, setCoarse] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(pointer: coarse), (hover: none)");
    const sync = () => setCoarse(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  return coarse;
}

/**
 * Site-wide Lenis smooth scroll + GSAP ticker sync.
 * Off for reduced-motion and coarse pointers (native momentum).
 * Always wraps with Lenis until after mount so SSR HTML matches hydration.
 */
export function SmoothScrollProvider({ children }: Props) {
  const reduce = useSafeReducedMotion();
  const coarse = useCoarsePointer();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    registerGsap();
    setReady(true);
  }, []);

  // Match SSR (Lenis on) until client preferences are known.
  if (ready && (reduce || coarse)) {
    return <>{children}</>;
  }

  return (
    <ReactLenis
      root
      options={{
        lerp: 0.1,
        duration: 1.2,
        smoothWheel: true,
        autoRaf: false,
      }}
    >
      <GsapLenisBridge />
      {children}
    </ReactLenis>
  );
}
