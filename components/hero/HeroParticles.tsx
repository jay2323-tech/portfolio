"use client";

import { useEffect, useRef } from "react";
import { useSafeReducedMotion } from "@/lib/motion/useSafeReducedMotion";
import { cn } from "@/lib/utils";

const COLORS = ["#c3fffc", "#c77d3c", "#e3edf5", "#f4e4e0"];
const COUNT = 34;

type Mote = {
  x: number;
  y: number;
  size: number;
  vx: number;
  vy: number;
  color: string;
  alpha: number;
};

function makeMotes(w: number, h: number): Mote[] {
  return Array.from({ length: COUNT }, () => ({
    x: Math.random() * w,
    y: Math.random() * h,
    size: 2 + Math.random() * 4,
    vx: (Math.random() - 0.5) * 0.12,
    vy: -0.05 - Math.random() * 0.12,
    color: COLORS[(Math.random() * COLORS.length) | 0]!,
    alpha: 0.25 + Math.random() * 0.35,
  }));
}

/**
 * Ambient drifting square motes behind the hero name — ownership: this
 * canvas alone, no GSAP/Framer. Pauses via IntersectionObserver + reduced
 * motion / coarse pointer.
 */
export function HeroParticles({ className }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reduce = useSafeReducedMotion();

  useEffect(() => {
    if (reduce) return;
    if (window.matchMedia("(pointer: coarse)").matches) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let raf = 0;
    let running = true;
    let motes: Mote[] = [];
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    function resize() {
      const parent = canvas!.parentElement;
      if (!parent) return;
      const rect = parent.getBoundingClientRect();
      canvas!.width = Math.floor(rect.width * dpr);
      canvas!.height = Math.floor(rect.height * dpr);
      canvas!.style.width = `${rect.width}px`;
      canvas!.style.height = `${rect.height}px`;
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
      motes = makeMotes(rect.width, rect.height);
    }

    function tick() {
      if (!running) return;
      const w = canvas!.clientWidth;
      const h = canvas!.clientHeight;
      ctx!.clearRect(0, 0, w, h);

      for (const m of motes) {
        m.x += m.vx;
        m.y += m.vy;
        if (m.y < -10) m.y = h + 10;
        if (m.x < -10) m.x = w + 10;
        if (m.x > w + 10) m.x = -10;

        ctx!.globalAlpha = m.alpha;
        ctx!.fillStyle = m.color;
        ctx!.fillRect(m.x, m.y, m.size, m.size);
      }
      ctx!.globalAlpha = 1;

      raf = requestAnimationFrame(tick);
    }

    resize();
    raf = requestAnimationFrame(tick);

    const io = new IntersectionObserver(
      ([entry]) => {
        running = Boolean(entry?.isIntersecting);
        if (running) raf = requestAnimationFrame(tick);
        else cancelAnimationFrame(raf);
      },
      { threshold: 0 },
    );
    io.observe(canvas);

    let resizeTimer: number | undefined;
    const onResize = () => {
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(resize, 200);
    };
    window.addEventListener("resize", onResize);

    return () => {
      running = false;
      cancelAnimationFrame(raf);
      io.disconnect();
      window.removeEventListener("resize", onResize);
      window.clearTimeout(resizeTimer);
    };
  }, [reduce]);

  if (reduce) return null;

  return (
    <canvas
      ref={canvasRef}
      className={cn("pointer-events-none absolute inset-0", className)}
      aria-hidden
    />
  );
}
