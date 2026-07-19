"use client";

import { useRef, type ReactNode } from "react";
import { useReducedMotion } from "framer-motion";
import { gsap, registerGsap } from "@/lib/gsap/setup";
import { cn } from "@/lib/utils";

type Props = {
  children: ReactNode;
  className?: string;
  /** Max pull in px */
  strength?: number;
};

/**
 * Magnetic pull on pointer move — clamp ±strength, spring home with back.out(2).
 * Skips on reduced-motion / coarse pointer.
 */
export function Magnetic({ children, className, strength = 12 }: Props) {
  const wrapRef = useRef<HTMLSpanElement>(null);
  const innerRef = useRef<HTMLSpanElement>(null);
  const xTo = useRef<ReturnType<typeof gsap.quickTo> | null>(null);
  const yTo = useRef<ReturnType<typeof gsap.quickTo> | null>(null);
  const reduce = useReducedMotion();

  function ensure() {
    const el = innerRef.current;
    if (!el || xTo.current) return;
    registerGsap();
    xTo.current = gsap.quickTo(el, "x", { duration: 0.45, ease: "power3.out" });
    yTo.current = gsap.quickTo(el, "y", { duration: 0.45, ease: "power3.out" });
  }

  function onMove(e: React.MouseEvent<HTMLSpanElement>) {
    if (reduce) return;
    if (typeof window !== "undefined" && window.matchMedia("(pointer: coarse)").matches) {
      return;
    }
    const wrap = wrapRef.current;
    if (!wrap) return;
    ensure();
    const rect = wrap.getBoundingClientRect();
    const nx = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    const ny = ((e.clientY - rect.top) / rect.height) * 2 - 1;
    xTo.current?.(nx * strength);
    yTo.current?.(ny * strength);
  }

  function onLeave() {
    if (!innerRef.current) return;
    registerGsap();
    gsap.to(innerRef.current, {
      x: 0,
      y: 0,
      duration: 0.7,
      ease: "back.out(2)",
    });
  }

  return (
    <span
      ref={wrapRef}
      className={cn("inline-flex", className)}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
    >
      <span ref={innerRef} className="inline-flex will-change-transform">
        {children}
      </span>
    </span>
  );
}
