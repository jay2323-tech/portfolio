import type { MouseEvent } from "react";

/**
 * Shared row-hover handler — writes cursor position into --mx/--my so the
 * `.row-glow` CSS radial-gradient (see globals.css) can track it. Pure DOM
 * write, no state, safe to reuse as an inline onMouseMove across rows.
 */
export function onRowGlowMove(e: MouseEvent<HTMLElement>) {
  const el = e.currentTarget;
  const rect = el.getBoundingClientRect();
  el.style.setProperty("--mx", `${e.clientX - rect.left}px`);
  el.style.setProperty("--my", `${e.clientY - rect.top}px`);
}
