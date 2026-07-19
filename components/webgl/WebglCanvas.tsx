"use client";

import dynamic from "next/dynamic";
import { useEffect, useState, type ReactNode } from "react";
import { useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

const Canvas = dynamic(
  () => import("@react-three/fiber").then((m) => m.Canvas),
  { ssr: false },
);

type Props = {
  children: ReactNode;
  className?: string;
};

/**
 * Lazy-loaded R3F canvas host — the three.js bundle only downloads where
 * this mounts. Gated off entirely on reduced-motion / coarse pointers so
 * low-power devices never pay for it.
 */
export function WebglCanvas({ children, className }: Props) {
  const reduce = useReducedMotion();
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    if (reduce) return;
    const mq = window.matchMedia("(pointer: coarse)");
    const sync = () => setEnabled(!mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, [reduce]);

  if (reduce || !enabled) return null;

  return (
    <div
      className={cn("pointer-events-none absolute inset-0", className)}
      aria-hidden
    >
      <Canvas
        dpr={[1, 1.75]}
        gl={{ alpha: true, antialias: true }}
        camera={{ position: [0, 0, 5], fov: 45 }}
      >
        {children}
      </Canvas>
    </div>
  );
}
