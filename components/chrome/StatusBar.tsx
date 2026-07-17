"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

const SECTIONS = [
  { id: "top", label: "0 — INTRO", short: "INTRO" },
  { id: "work", label: "01 — WORK", short: "WORK" },
  { id: "articles", label: "02 — ARTICLES", short: "ARTICLES" },
  { id: "lab", label: "03 — LAB", short: "LAB" },
  { id: "about", label: "04 — ABOUT", short: "ABOUT" },
  { id: "contact", label: "05 — CONTACT", short: "CONTACT" },
] as const;

function formatClock(d: Date) {
  const hh = String(d.getHours()).padStart(2, "0");
  const mm = String(d.getMinutes()).padStart(2, "0");
  const ss = String(d.getSeconds()).padStart(2, "0");
  const offsetMin = -d.getTimezoneOffset();
  const sign = offsetMin >= 0 ? "+" : "−";
  const abs = Math.abs(offsetMin);
  const oh = String(Math.floor(abs / 60)).padStart(2, "0");
  const om = String(abs % 60).padStart(2, "0");
  return `${hh}:${mm}:${ss} ${sign}${oh}:${om}`;
}

type SectionInfo = (typeof SECTIONS)[number];

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
 * Fixed bottom status bar — SCRL / CRSR / section / theme / clock.
 * xs: SCRL + short section only; CRSR from sm; theme/clock from md.
 */
export function StatusBar() {
  const [ready, setReady] = useState(false);
  const [scroll, setScroll] = useState(0);
  const [cursor, setCursor] = useState({ x: 0, y: 0 });
  const [section, setSection] = useState<SectionInfo>(SECTIONS[0]);
  const [clock, setClock] = useState("--:--:--");

  useEffect(() => {
    setReady(true);
    setClock(formatClock(new Date()));

    function onScroll() {
      const doc = document.documentElement;
      const max = doc.scrollHeight - window.innerHeight;
      const p = max > 0 ? window.scrollY / max : 0;
      setScroll(Math.min(1, Math.max(0, p)));
      setSection(activeSection());
    }

    function onMove(e: MouseEvent) {
      setCursor({ x: e.clientX, y: e.clientY });
    }

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("mousemove", onMove, { passive: true });
    const tick = window.setInterval(() => setClock(formatClock(new Date())), 1000);

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("mousemove", onMove);
      window.clearInterval(tick);
    };
  }, []);

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
        <div className="flex min-w-0 items-center gap-x-3 sm:gap-x-5">
          <span className="shrink-0 tabular-nums">
            SCRL {ready ? scroll.toFixed(2) : "0.00"}
          </span>
          <span className="hidden shrink-0 tabular-nums sm:inline">
            CRSR{" "}
            {ready
              ? `${cursor.x.toFixed(0)}.${String(Math.floor(cursor.y)).padStart(3, "0")}`
              : "0.000"}
          </span>
          <span className="truncate sm:hidden">
            {ready ? section.short : "INTRO"}
          </span>
          <span className="hidden truncate sm:inline">
            {ready ? section.label : "0 — INTRO"}
          </span>
        </div>

        <div className="hidden shrink-0 items-center gap-3 md:flex lg:gap-5">
          <span className="inline-flex items-center gap-1.5">
            THEME
            <span
              className="inline-block h-2.5 w-2.5 border border-ink/15"
              style={{ background: "var(--mint)" }}
            />
            #C3FFFC
          </span>
          <span className="tabular-nums">{clock}</span>
        </div>
      </div>
    </div>
  );
}
