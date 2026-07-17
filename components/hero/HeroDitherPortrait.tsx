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

      const logical = document.createElement("canvas");
      logical.width = w;
      logical.height = h;
      const lctx = logical.getContext("2d");
      if (!lctx) return;

      const img = new Image();
      img.decoding = "async";

      try {
        await new Promise<void>((resolve, reject) => {
          img.onload = () => resolve();
          img.onerror = () => reject(new Error("missing"));
          img.src = src;
        });
        if (cancelled) return;
        const scale = Math.max(w / img.naturalWidth, h / img.naturalHeight);
        const dw = img.naturalWidth * scale;
        const dh = img.naturalHeight * scale;
        lctx.fillStyle = "#fafaf8";
        lctx.fillRect(0, 0, w, h);
        lctx.filter = "grayscale(1) contrast(1.08)";
        lctx.drawImage(img, (w - dw) / 2, (h - dh) / 2, dw, dh);
        lctx.filter = "none";
      } catch {
        if (cancelled) return;
        drawSilhouette(lctx, w, h);
      }

      const dithered = ditherImageData(lctx.getImageData(0, 0, w, h), 2);
      lctx.putImageData(dithered, 0, 0);

      canvas!.width = Math.floor(w * dpr);
      canvas!.height = Math.floor(h * dpr);
      canvas!.style.width = `${w}px`;
      canvas!.style.height = `${h}px`;
      ctx!.setTransform(1, 0, 0, 1, 0, 0);
      ctx!.clearRect(0, 0, canvas!.width, canvas!.height);
      ctx!.imageSmoothingEnabled = false;
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx!.drawImage(logical, 0, 0, w, h);
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
        "pointer-events-none overflow-hidden",
        className ??
          "absolute inset-y-0 right-0 w-full md:w-[48%] lg:w-[45%]",
      )}
    >
      <canvas
        ref={canvasRef}
        className="h-full w-full object-cover opacity-90 mix-blend-multiply"
        aria-hidden
      />
    </div>
  );
}
