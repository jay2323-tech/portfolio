"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "framer-motion";
import { gsap, registerGsap } from "@/lib/gsap/setup";
import { ditherImageData, drawSilhouette } from "@/lib/dither/bayer";
import { cn } from "@/lib/utils";

type Props = {
  className?: string;
  /** Path under /public — falls back to silhouette if missing */
  src?: string;
};

/** Draws the source image into a canvas at (w/dot × h/dot) then dithers it. */
async function renderDither(
  canvas: HTMLCanvasElement,
  img: HTMLImageElement | null,
  w: number,
  h: number,
  dot: number,
) {
  const dw = Math.max(1, Math.round(w / dot));
  const dh = Math.max(1, Math.round(h / dot));
  canvas.width = dw;
  canvas.height = dh;
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  if (img) {
    const scale = Math.max(dw / img.naturalWidth, dh / img.naturalHeight);
    const sdw = img.naturalWidth * scale;
    const sdh = img.naturalHeight * scale;
    ctx.fillStyle = "#fafaf8";
    ctx.fillRect(0, 0, dw, dh);
    ctx.filter = "grayscale(1) contrast(1.15)";
    ctx.drawImage(img, (dw - sdw) / 2, (dh - sdh) / 2, sdw, sdh);
    ctx.filter = "none";
  } else {
    drawSilhouette(ctx, dw, dh);
  }

  const dithered = ditherImageData(ctx.getImageData(0, 0, dw, dh));
  ctx.putImageData(dithered, 0, 0);
}

/** Blit a small dithered buffer onto the visible canvas at (w × h), crisp. */
function blit(
  visible: HTMLCanvasElement,
  small: HTMLCanvasElement,
  w: number,
  h: number,
  dpr: number,
) {
  const ctx = visible.getContext("2d");
  if (!ctx) return;
  visible.width = Math.floor(w * dpr);
  visible.height = Math.floor(h * dpr);
  visible.style.width = `${w}px`;
  visible.style.height = `${h}px`;
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.clearRect(0, 0, visible.width, visible.height);
  ctx.imageSmoothingEnabled = false;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.drawImage(small, 0, 0, small.width, small.height, 0, 0, w, h);
}

/**
 * Bayer 4×4 dithered portrait — right visual plane.
 * Parallax scrub via ScrollTrigger (~0.6×). A second, finer-grained dither
 * pass is revealed in a soft circle that follows the cursor — a "detail
 * spotlight" on top of the coarse base halftone.
 */
export function HeroDitherPortrait({
  className,
  src = "/portrait.jpg",
}: Props) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const detailRef = useRef<HTMLCanvasElement>(null);
  const reduce = useReducedMotion();

  useEffect(() => {
    const canvas = canvasRef.current;
    const detail = detailRef.current;
    const wrap = wrapRef.current;
    if (!canvas || !detail || !wrap) return;

    let cancelled = false;
    let parallaxTween: gsap.core.Tween | undefined;

    async function renderClean() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const rect = wrap!.getBoundingClientRect();
      const w = Math.max(1, Math.floor(rect.width));
      const h = Math.max(1, Math.floor(rect.height));

      const img = new Image();
      img.decoding = "async";
      let loaded: HTMLImageElement | null = null;
      try {
        await new Promise<void>((resolve, reject) => {
          img.onload = () => resolve();
          img.onerror = () => reject(new Error("missing"));
          img.src = src;
        });
        if (cancelled) return;
        loaded = img;
      } catch {
        if (cancelled) return;
      }

      // Base layer: coarse dots (dot=5), always visible.
      const small = document.createElement("canvas");
      await renderDither(small, loaded, w, h, 5);
      blit(canvas!, small, w, h, dpr);

      // Detail layer: fine dots (dot=2), revealed only near the cursor.
      const fine = document.createElement("canvas");
      await renderDither(fine, loaded, w, h, 2);
      blit(detail!, fine, w, h, dpr);
    }

    void renderClean();

    let resizeTimer: number | undefined;
    const onResize = () => {
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(() => {
        void renderClean();
      }, 200);
    };
    window.addEventListener("resize", onResize);

    if (!reduce) {
      registerGsap();
      const isDesktop = window.matchMedia("(min-width: 768px)").matches;
      if (isDesktop) {
        const section = wrap.closest("section") ?? wrap;
        parallaxTween = gsap.to(wrap, {
          yPercent: 12,
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: "bottom top",
            scrub: 0.6,
          },
        });
      }
    }

    return () => {
      cancelled = true;
      window.removeEventListener("resize", onResize);
      window.clearTimeout(resizeTimer);
      parallaxTween?.scrollTrigger?.kill();
      parallaxTween?.kill();
    };
  }, [src, reduce]);

  // Cursor-follow detail spotlight. The wrap is pointer-events-none (it must
  // stay click-through), so this listens on window like CustomCursor does
  // and hit-tests the wrap's rect manually instead of relying on DOM events.
  useEffect(() => {
    if (reduce) return;
    const wrap = wrapRef.current;
    const detail = detailRef.current;
    if (!wrap || !detail) return;
    if (window.matchMedia("(pointer: coarse)").matches) return;

    function onMove(e: MouseEvent) {
      const rect = wrap!.getBoundingClientRect();
      const inside =
        e.clientX >= rect.left &&
        e.clientX <= rect.right &&
        e.clientY >= rect.top &&
        e.clientY <= rect.bottom;

      if (!inside) {
        detail!.style.opacity = "0";
        return;
      }

      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      detail!.style.maskImage = `radial-gradient(circle 160px at ${x}px ${y}px, black 0%, transparent 100%)`;
      detail!.style.webkitMaskImage = detail!.style.maskImage;
      detail!.style.opacity = "1";
    }

    window.addEventListener("mousemove", onMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMove);
  }, [reduce]);

  return (
    <div
      ref={wrapRef}
      data-hero-portrait
      className={cn(
        "hero-portrait-fade pointer-events-none overflow-hidden",
        className ??
          "absolute inset-y-0 right-0 w-full md:w-[48%] lg:w-[45%]",
      )}
    >
      <canvas
        ref={canvasRef}
        className="h-full w-full object-cover opacity-85 mix-blend-multiply"
        aria-hidden
      />
      <canvas
        ref={detailRef}
        className="absolute inset-0 h-full w-full object-cover opacity-0 mix-blend-multiply transition-opacity duration-300 ease-out"
        aria-hidden
      />
    </div>
  );
}
