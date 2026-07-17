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

/**
 * Bayer 4×4 dithered portrait — right visual plane.
 * Parallax scrub via ScrollTrigger (~0.6×).
 */
export function HeroDitherPortrait({
  className,
  src = "/portrait.jpg",
}: Props) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reduce = useReducedMotion();

  useEffect(() => {
    const canvas = canvasRef.current;
    const wrap = wrapRef.current;
    if (!canvas || !wrap) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let cancelled = false;
    let parallaxTween: gsap.core.Tween | undefined;

    async function renderClean() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const rect = wrap!.getBoundingClientRect();
      const w = Math.max(1, Math.floor(rect.width));
      const h = Math.max(1, Math.floor(rect.height));

      // Dot size in CSS px. Dither at (w/DOT × h/DOT), then upscale with
      // smoothing off — that's what makes each dithered pixel read as a
      // visible halftone dot instead of a near-invisible fleck.
      const DOT = 5;
      const dw2 = Math.max(1, Math.round(w / DOT));
      const dh2 = Math.max(1, Math.round(h / DOT));

      const small = document.createElement("canvas");
      small.width = dw2;
      small.height = dh2;
      const sctx = small.getContext("2d");
      if (!sctx) return;

      const img = new Image();
      img.decoding = "async";

      try {
        await new Promise<void>((resolve, reject) => {
          img.onload = () => resolve();
          img.onerror = () => reject(new Error("missing"));
          img.src = src;
        });
        if (cancelled) return;
        const scale = Math.max(
          dw2 / img.naturalWidth,
          dh2 / img.naturalHeight,
        );
        const sdw = img.naturalWidth * scale;
        const sdh = img.naturalHeight * scale;
        sctx.fillStyle = "#fafaf8";
        sctx.fillRect(0, 0, dw2, dh2);
        sctx.filter = "grayscale(1) contrast(1.15)";
        sctx.drawImage(img, (dw2 - sdw) / 2, (dh2 - sdh) / 2, sdw, sdh);
        sctx.filter = "none";
      } catch {
        if (cancelled) return;
        drawSilhouette(sctx, dw2, dh2);
      }

      const dithered = ditherImageData(sctx.getImageData(0, 0, dw2, dh2));
      sctx.putImageData(dithered, 0, 0);

      canvas!.width = Math.floor(w * dpr);
      canvas!.height = Math.floor(h * dpr);
      canvas!.style.width = `${w}px`;
      canvas!.style.height = `${h}px`;
      ctx!.setTransform(1, 0, 0, 1, 0, 0);
      ctx!.clearRect(0, 0, canvas!.width, canvas!.height);
      ctx!.imageSmoothingEnabled = false;
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx!.drawImage(small, 0, 0, dw2, dh2, 0, 0, w, h);
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
    </div>
  );
}
