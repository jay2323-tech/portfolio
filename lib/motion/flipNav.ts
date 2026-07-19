import { gsap, registerGsap } from "@/lib/gsap/setup";

const STORAGE_KEY = "portfolio-work-flip";
const MAX_AGE_MS = 4500;

export type FlipRect = {
  top: number;
  left: number;
  width: number;
  height: number;
};

export type FlipPayload = {
  slug: string;
  rects: Record<string, FlipRect>;
  ts: number;
};

function rectFromEl(el: Element): FlipRect {
  const r = el.getBoundingClientRect();
  return {
    top: r.top,
    left: r.left,
    width: Math.max(r.width, 1),
    height: Math.max(r.height, 1),
  };
}

/**
 * Persist First state before navigating to /work/[slug]. Pass every
 * element that should FLIP into place on the detail page, keyed by role
 * (e.g. "title", "metrics", "description") — the detail page looks up
 * each key independently and falls back to a plain fade for any it doesn't
 * find (e.g. content that only exists in one place).
 */
export function captureWorkFlip(
  slug: string,
  elements: Record<string, Element>,
) {
  if (typeof window === "undefined") return;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  const rects: Record<string, FlipRect> = {};
  for (const [key, el] of Object.entries(elements)) {
    rects[key] = rectFromEl(el);
  }

  const payload: FlipPayload = { slug, rects, ts: Date.now() };
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  } catch {
    /* private mode / quota */
  }
}

function readPayload(slug: string): FlipPayload | null {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const data = JSON.parse(raw) as FlipPayload;
    if (data.slug !== slug) return null;
    if (Date.now() - data.ts > MAX_AGE_MS) return null;
    if (!data.rects || Object.keys(data.rects).length === 0) return null;
    return data;
  } catch {
    return null;
  }
}

/** Peek without clearing — used to avoid FOUC before Invert. */
export function peekWorkFlip(slug: string): FlipPayload | null {
  if (typeof window === "undefined") return null;
  return readPayload(slug);
}

/** Read + clear First state if it matches this slug and is fresh. */
export function consumeWorkFlip(slug: string): FlipPayload | null {
  if (typeof window === "undefined") return null;
  const data = readPayload(slug);
  try {
    sessionStorage.removeItem(STORAGE_KEY);
  } catch {
    /* ignore */
  }
  return data;
}

/**
 * Invert → Play: place target at First, animate to Last (identity).
 * Returns a Promise that resolves when the tween finishes.
 */
export function playWorkFlip(
  el: HTMLElement,
  first: FlipRect,
): Promise<void> {
  return new Promise((resolve) => {
    registerGsap();
    const last = rectFromEl(el);
    const dx = first.left - last.left;
    const dy = first.top - last.top;
    const sx = first.width / last.width;
    const sy = first.height / last.height;

    gsap.fromTo(
      el,
      {
        x: dx,
        y: dy,
        scaleX: sx,
        scaleY: sy,
        transformOrigin: "top left",
      },
      {
        x: 0,
        y: 0,
        scaleX: 1,
        scaleY: 1,
        duration: 0.78,
        ease: "power3.inOut",
        clearProps: "transform",
        onComplete: () => resolve(),
      },
    );
  });
}
