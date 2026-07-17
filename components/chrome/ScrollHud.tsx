"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

/** Juba-style dual HUD: SCRL + CRSR + intro label near top */
export function ScrollHud() {
  const [scroll, setScroll] = useState(0);
  const [cursor, setCursor] = useState({ x: 0, y: 0 });
  const [inIntro, setInIntro] = useState(true);

  useEffect(() => {
    function onScroll() {
      const doc = document.documentElement;
      const max = doc.scrollHeight - window.innerHeight;
      const p = max > 0 ? window.scrollY / max : 0;
      setScroll(Math.min(1, Math.max(0, p)));
      setInIntro(window.scrollY < window.innerHeight * 0.8);
    }
    function onMove(e: MouseEvent) {
      const x = e.clientX / window.innerWidth;
      const y = e.clientY / window.innerHeight;
      setCursor({
        x: Math.min(1, Math.max(0, x)),
        y: Math.min(1, Math.max(0, y)),
      });
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("mousemove", onMove);
    };
  }, []);

  return (
    <div
      className={cn(
        "pointer-events-none fixed bottom-4 left-4 z-[var(--z-hud)]",
        "hidden font-mono-data text-[10px] tracking-[0.18em] text-muted sm:flex sm:flex-col sm:gap-1",
      )}
      aria-hidden
    >
      <span>SCRL {scroll.toFixed(2)}</span>
      <span>
        CRSR {cursor.x.toFixed(3)} {cursor.y.toFixed(3)}
      </span>
      {inIntro ? <span>0 — INTRO</span> : null}
    </div>
  );
}
