"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

const SECTIONS = [
  { id: "top", index: "00", name: "INTRO" },
  { id: "work", index: "01", name: "WORK" },
  { id: "articles", index: "02", name: "ARTICLES" },
  { id: "lab", index: "03", name: "LAB" },
  { id: "about", index: "04", name: "ABOUT" },
  { id: "contact", index: "05", name: "CONTACT" },
] as const;

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
 * Fixed bottom status bar — SCRL/CRSR (left), section (center), theme/clock (right).
 * Mirrors the reference site's hud-label bar: CRSR only ≥lg, section label ≥sm,
 * THEME text ≥sm — swatch/hex/clock always show.
 */
export function StatusBar() {
  const [ready, setReady] = useState(false);
  const [scroll, setScroll] = useState(0);
  const [cursor, setCursor] = useState({ x: 0, y: 0 });
  const [section, setSection] = useState<SectionInfo>(SECTIONS[0]);
  const [clock, setClock] = useState({ time: "--:--:--", offset: "" });

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
        <div className="flex min-w-0 shrink-0 items-center gap-x-3 sm:gap-x-5">
          <span className="tabular-nums">
            SCRL <span className="text-ink">{ready ? scroll.toFixed(2) : "0.00"}</span>
          </span>
          <span className="hidden tabular-nums lg:inline">
            CRSR{" "}
            {ready
              ? `${String(Math.round(cursor.x)).padStart(3, "0")}.${String(Math.round(cursor.y)).padStart(3, "0")}`
              : "000.000"}
          </span>
        </div>

        <span className="hidden truncate sm:inline">
          <span className="text-ink">{ready ? section.index : "00"}</span> —{" "}
          {ready ? section.name : "INTRO"}
        </span>

        <div className="flex shrink-0 items-center gap-3 lg:gap-5">
          <span className="inline-flex items-center gap-1.5">
            <span className="hidden sm:inline">THEME</span>
            <span
              className="inline-block h-2.5 w-2.5 border border-ink/15"
              style={{ background: "var(--mint)" }}
            />
            <span className="text-ink normal-case">#c3fffc</span>
          </span>
          <span className="tabular-nums">
            {clock.time} <span className="opacity-75">{clock.offset}</span>
          </span>
        </div>
      </div>
    </div>
  );
}
