"use client";

import { useEffect, useRef, useState } from "react";
import { useLenis } from "lenis/react";
import { gsap, registerGsap } from "@/lib/gsap/setup";
import { cn } from "@/lib/utils";

const SECTIONS = [
  { id: "top", index: "00", name: "INTRO" },
  { id: "work", index: "01", name: "WORK" },
  { id: "articles", index: "02", name: "ARTICLES" },
  { id: "lab", index: "03", name: "LAB" },
  { id: "about", index: "04", name: "ABOUT" },
  { id: "contact", index: "05", name: "CONTACT" },
] as const;

type SectionInfo = (typeof SECTIONS)[number];

type Accent = "mint" | "blush" | "sky";

const ACCENTS: Record<
  Accent,
  { hex: string; varName: "--mint" | "--blush" | "--sky"; next: Accent }
> = {
  mint: { hex: "#c3fffc", varName: "--mint", next: "blush" },
  blush: { hex: "#f4e4e0", varName: "--blush", next: "sky" },
  sky: { hex: "#e3edf5", varName: "--sky", next: "mint" },
};

function formatClock(d: Date) {
  const hh = String(d.getHours()).padStart(2, "0");
  const mm = String(d.getMinutes()).padStart(2, "0");
  const ss = String(d.getSeconds()).padStart(2, "0");
  const offsetMin = -d.getTimezoneOffset();
  const sign = offsetMin >= 0 ? "+" : "−";
  const abs = Math.abs(offsetMin);
  const oh = String(Math.floor(abs / 60)).padStart(2, "0");
  const om = abs % 60;
  const offset = om === 0 ? oh : `${oh}:${String(om).padStart(2, "0")}`;
  return { time: `${hh}:${mm}:${ss}`, offset: `${sign}${offset}` };
}

function activeSection(): SectionInfo {
  const y = window.scrollY + window.innerHeight * 0.35;
  let current: SectionInfo = SECTIONS[0];
  for (const s of SECTIONS) {
    if (s.id === "top") continue;
    const el = document.getElementById(s.id);
    if (!el) continue;
    if (el.offsetTop <= y) current = s;
  }
  if (window.scrollY < window.innerHeight * 0.55) {
    return SECTIONS[0];
  }
  return current;
}

/**
 * Fixed bottom HUD — SCRL/CRSR via quickTo (no React thrash),
 * section label, theme accent bounce, live clock.
 */
export function StatusBar() {
  const scrollRef = useRef<HTMLSpanElement>(null);
  const crsrRef = useRef<HTMLSpanElement>(null);
  const swatchRef = useRef<HTMLSpanElement>(null);
  const [section, setSection] = useState<SectionInfo>(SECTIONS[0]);
  const [clock, setClock] = useState({ time: "--:--:--", offset: "" });
  const [accent, setAccent] = useState<Accent>("mint");
  const lenis = useLenis();

  useEffect(() => {
    registerGsap();
    setClock(formatClock(new Date()));
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    const scrollProxy = { v: 0 };
    const crsrProxy = { v: 0 };

    const scrollTo = gsap.quickTo(scrollProxy, "v", {
      duration: 0.35,
      ease: "power3.out",
      onUpdate: () => {
        if (scrollRef.current) {
          scrollRef.current.textContent = scrollProxy.v.toFixed(2);
        }
      },
    });

    const crsrTo = gsap.quickTo(crsrProxy, "v", {
      duration: 0.2,
      ease: "power3.out",
      onUpdate: () => {
        if (crsrRef.current) {
          crsrRef.current.textContent = crsrProxy.v.toFixed(3);
        }
      },
    });

    let moveRaf = 0;
    let lastMove = 0;
    let lastY = lenis ? lenis.scroll : window.scrollY;
    let lastT = performance.now();
    let pulseCooldown = 0;

    function syncScrollProgress() {
      const doc = document.documentElement;
      const max = doc.scrollHeight - window.innerHeight;
      const y = lenis ? lenis.scroll : window.scrollY;
      const p = max > 0 ? y / max : 0;
      scrollTo(Math.min(1, Math.max(0, p)));
      setSection(activeSection());

      const now = performance.now();
      const dt = now - lastT;
      if (dt > 16) {
        const velocity = Math.abs(y - lastY) / dt;
        lastY = y;
        lastT = now;
        if (
          !reduceMotion &&
          velocity > 1.6 &&
          now > pulseCooldown &&
          scrollRef.current
        ) {
          pulseCooldown = now + 400;
          gsap.fromTo(
            scrollRef.current,
            { color: "#c77d3c", scale: 1.35 },
            {
              color: "#141414",
              scale: 1,
              duration: 0.4,
              ease: "power2.out",
              clearProps: "color,scale",
            },
          );
        }
      }
    }

    function onMove(e: MouseEvent) {
      const now = performance.now();
      if (now - lastMove < 16) return;
      lastMove = now;
      if (moveRaf) return;
      moveRaf = requestAnimationFrame(() => {
        moveRaf = 0;
        const w = window.innerWidth || 1;
        crsrTo(Math.min(1, Math.max(0, e.clientX / w)));
      });
    }

    syncScrollProgress();
    window.addEventListener("scroll", syncScrollProgress, { passive: true });
    window.addEventListener("mousemove", onMove, { passive: true });
    const offLenis = lenis?.on("scroll", syncScrollProgress);

    const tick = window.setInterval(() => setClock(formatClock(new Date())), 1000);

    return () => {
      window.removeEventListener("scroll", syncScrollProgress);
      window.removeEventListener("mousemove", onMove);
      offLenis?.();
      window.clearInterval(tick);
      if (moveRaf) cancelAnimationFrame(moveRaf);
    };
  }, [lenis]);

  useEffect(() => {
    document.documentElement.dataset.accent = accent;
  }, [accent]);

  function cycleAccent() {
    const next = ACCENTS[accent].next;
    setAccent(next);
    if (swatchRef.current) {
      registerGsap();
      gsap.fromTo(
        swatchRef.current,
        { scale: 0.55 },
        { scale: 1, duration: 0.45, ease: "back.out(2)" },
      );
    }
  }

  const theme = ACCENTS[accent];

  return (
    <div
      className={cn(
        "pointer-events-none fixed inset-x-0 bottom-0 z-[var(--z-hud)]",
        "flex h-8 items-center border-t border-ink/10 bg-bg/90 px-3 backdrop-blur-md md:px-5",
        "font-mono-data text-[10px] uppercase tracking-[0.14em] text-muted",
      )}
      aria-hidden
    >
      <div className="mx-auto flex w-full max-w-[var(--content-max)] items-center justify-between gap-2">
        <div className="flex min-w-0 shrink-0 items-center gap-x-3 sm:gap-x-5">
          <span className="tabular-nums">
            SCRL <span ref={scrollRef} className="inline-block text-ink">0.00</span>
          </span>
          <span className="hidden tabular-nums lg:inline">
            CRSR <span ref={crsrRef} className="text-ink">0.000</span>
          </span>
        </div>

        <span className="hidden truncate sm:inline">
          <span className="text-ink">{section.index}</span> — {section.name}
        </span>

        <div className="flex shrink-0 items-center gap-3 lg:gap-5">
          <button
            type="button"
            onClick={cycleAccent}
            className="pointer-events-auto inline-flex items-center gap-1.5 outline-none"
            aria-label="Cycle theme accent"
            data-cursor="open"
          >
            <span className="hidden sm:inline">THEME</span>
            <span
              ref={swatchRef}
              className="inline-block h-2.5 w-2.5 border border-ink/15"
              style={{ background: `var(${theme.varName})` }}
            />
            <span className="text-ink normal-case">{theme.hex}</span>
          </button>
          <span className="tabular-nums">
            {clock.time} <span className="opacity-75">{clock.offset}</span>
          </span>
        </div>
      </div>
    </div>
  );
}
