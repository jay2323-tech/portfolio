"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";
import { gsap, registerGsap } from "@/lib/gsap/setup";
import { cn } from "@/lib/utils";

type CursorLabel = "VIEW" | "ASK" | "OPEN" | "";

function labelForTarget(el: Element | null): CursorLabel {
  if (!el) return "";
  const hit = el.closest<HTMLElement>(
    "a, button, [data-cursor], [role='button']",
  );
  if (!hit) return "";

  const explicit = hit.getAttribute("data-cursor")?.toUpperCase();
  if (explicit === "VIEW" || explicit === "ASK" || explicit === "OPEN") {
    return explicit;
  }

  const text = (hit.textContent ?? "").toUpperCase();
  if (text.includes("ASK")) return "ASK";
  if (text.includes("OPEN") || text.includes("SEND") || text.includes("GET IN")) {
    return "OPEN";
  }
  if (hit.tagName === "A" || hit.tagName === "BUTTON") return "VIEW";
  return "";
}

function isTextField(el: Element | null) {
  if (!el) return false;
  return Boolean(
    el.closest("input, textarea, select, [contenteditable='true']"),
  );
}

/**
 * Two-layer custom cursor — dot (1:1) + lerped ring with hover labels.
 * Hidden on touch / reduced-motion.
 */
export function CustomCursor() {
  const reduce = useReducedMotion();
  const [enabled, setEnabled] = useState(false);
  const [label, setLabel] = useState<CursorLabel>("");
  const [hidden, setHidden] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (reduce) return;
    const mq = window.matchMedia("(pointer: fine) and (hover: hover)");
    const sync = () => setEnabled(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, [reduce]);

  useEffect(() => {
    if (!enabled) return;
    registerGsap();

    const ring = ringRef.current;
    const dot = dotRef.current;
    if (!ring || !dot) return;

    document.documentElement.classList.add("has-custom-cursor");

    const xTo = gsap.quickTo(ring, "x", { duration: 0.5, ease: "power3.out" });
    const yTo = gsap.quickTo(ring, "y", { duration: 0.5, ease: "power3.out" });
    const scaleTo = gsap.quickTo(ring, "scale", {
      duration: 0.35,
      ease: "power3.out",
    });

    gsap.set([ring, dot], { xPercent: -50, yPercent: -50 });

    function onMove(e: MouseEvent) {
      const t = e.target as Element | null;
      const overField = isTextField(t);
      setHidden(overField);

      gsap.set(dot, { x: e.clientX, y: e.clientY });
      xTo(e.clientX);
      yTo(e.clientY);

      const next = overField ? "" : labelForTarget(t);
      setLabel(next);
      scaleTo(next ? 2.4 : 1);
    }

    function onLeave() {
      setHidden(true);
    }

    function onEnter() {
      setHidden(false);
    }

    window.addEventListener("mousemove", onMove, { passive: true });
    document.documentElement.addEventListener("mouseleave", onLeave);
    document.documentElement.addEventListener("mouseenter", onEnter);

    return () => {
      document.documentElement.classList.remove("has-custom-cursor");
      window.removeEventListener("mousemove", onMove);
      document.documentElement.removeEventListener("mouseleave", onLeave);
      document.documentElement.removeEventListener("mouseenter", onEnter);
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <div
      ref={rootRef}
      className={cn(
        "pointer-events-none fixed inset-0 z-[var(--z-cursor)]",
        hidden && "opacity-0",
      )}
      aria-hidden
    >
      <div
        ref={dotRef}
        className="absolute left-0 top-0 h-1.5 w-1.5 rounded-full bg-ink"
      />
      <div
        ref={ringRef}
        className="absolute left-0 top-0 flex h-8 w-8 items-center justify-center rounded-full border border-ink/40"
      >
        <span
          className={cn(
            "font-mono-data text-[8px] tracking-[0.16em] text-ink transition-opacity duration-200",
            label ? "opacity-100" : "opacity-0",
          )}
        >
          {label}
        </span>
      </div>
    </div>
  );
}
