"use client";

import { useEffect, useRef } from "react";

const COLORS = ["#c3fffc", "#c77d3c", "#5ecfc9", "#f4e4e0"];
const COUNT = 20;

type Mote = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  life: number;
};

/**
 * One-shot Canvas2D burst — ~20 motes launched from center, gravity-fall,
 * fade out. Mounts, plays once, unmounts itself. No reduced-motion gate
 * needed here since the parent only mounts this after a real user action
 * (form submit success), and it's a few hundred ms, not an ambient loop.
 */
export function ConfettiBurst({ onDone }: { onDone?: () => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const rect = canvas.parentElement?.getBoundingClientRect();
    const w = rect?.width ?? canvas.clientWidth;
    const h = rect?.height ?? canvas.clientHeight;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    canvas.style.width = `${w}px`;
    canvas.style.height = `${h}px`;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const cx = w / 2;
    const cy = h * 0.3;
    const motes: Mote[] = Array.from({ length: COUNT }, () => {
      const angle = Math.random() * Math.PI * 2;
      const speed = 1.5 + Math.random() * 2.5;
      return {
        x: cx,
        y: cy,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 1.5,
        size: 3 + Math.random() * 3,
        color: COLORS[(Math.random() * COLORS.length) | 0]!,
        life: 1,
      };
    });

    let raf = 0;
    function tick() {
      ctx!.clearRect(0, 0, w, h);
      let alive = false;
      for (const m of motes) {
        m.x += m.vx;
        m.y += m.vy;
        m.vy += 0.12;
        m.life -= 0.018;
        if (m.life > 0) {
          alive = true;
          ctx!.globalAlpha = Math.max(0, m.life);
          ctx!.fillStyle = m.color;
          ctx!.fillRect(m.x, m.y, m.size, m.size);
        }
      }
      ctx!.globalAlpha = 1;
      if (alive) {
        raf = requestAnimationFrame(tick);
      } else {
        onDone?.();
      }
    }
    raf = requestAnimationFrame(tick);

    return () => cancelAnimationFrame(raf);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none absolute inset-0 h-full w-full"
      aria-hidden
    />
  );
}
