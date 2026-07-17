"use client";

import { ReactLenis, useLenis } from "lenis/react";
import { useReducedMotion } from "framer-motion";
import { useEffect, type ReactNode } from "react";
import { setupGsapWithLenis, registerGsap } from "@/lib/gsap/setup";
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

/**
 * Site-wide Lenis smooth scroll + GSAP ScrollTrigger sync.
 * Disabled when prefers-reduced-motion (native scroll; GSAP still registered).
 */
export function SmoothScrollProvider({ children }: Props) {
  const reduce = useReducedMotion();

  useEffect(() => {
    registerGsap();
  }, []);

  if (reduce) {
    return <>{children}</>;
  }

  return (
    <ReactLenis
      root
      options={{
        duration: 1.1,
        smoothWheel: true,
        autoRaf: true,
      }}
    >
      <GsapLenisBridge />
      {children}
    </ReactLenis>
  );
}
