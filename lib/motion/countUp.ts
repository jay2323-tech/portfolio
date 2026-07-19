import { gsap } from "@/lib/gsap/setup";

/**
 * Count a numeric display from 0 → target. Non-digit suffix stays static.
 * Returns a kill function.
 */
export function countUp(
  el: HTMLElement,
  target: number,
  opts: { duration?: number; ease?: string; suffix?: string } = {},
): () => void {
  const { duration = 0.6, ease = "power2.out", suffix = "" } = opts;
  const state = { v: 0 };
  const tween = gsap.to(state, {
    v: target,
    duration,
    ease,
    onUpdate: () => {
      el.textContent = `${Math.round(state.v)}${suffix}`;
    },
  });
  return () => {
    tween.kill();
  };
}

/** Parse leading integer from strings like "3 PROJECTS" or "5 LIVE". */
export function parseLeadingCount(meta: string): {
  count: number;
  rest: string;
} | null {
  const m = meta.trim().match(/^(\d+)\s*(.*)$/);
  if (!m) return null;
  return { count: Number(m[1]), rest: m[2] ?? "" };
}
