"use client";

/**
 * ScaleBlurLayer — iOS-style “recede” for underlying content.
 *
 * When `useReceded().isReceded` is true (any overlay opened via RecedeProvider),
 * this wrapper scales down, rounds corners, blurs, and dims its children so the
 * foreground panel feels layered on top.
 *
 * Hook up a new screen:
 *   1. Wrap the background section: <ScaleBlurLayer>{…}</ScaleBlurLayer>
 *   2. On open:  useReceded().open({ id: "my-panel" })
 *   3. On close: useReceded().close()
 *   4. Render your foreground with AnimatePresence + spring enter/exit
 *
 * Tunables live in styles/glass.css: --recede-scale, --recede-blur,
 * --recede-radius, --recede-dim.
 */

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useReceded } from "./RecedeContext";
import { useSafeReducedMotion } from "@/lib/motion/useSafeReducedMotion";
import { cn } from "@/lib/utils";

const SPRING = {
  type: "spring" as const,
  stiffness: 300,
  damping: 30,
  mass: 0.8,
};

type RecedeTokens = {
  scale: number;
  blurPx: number;
  radiusPx: number;
  dim: number;
};

const DEFAULTS: RecedeTokens = {
  scale: 0.9,
  blurPx: 14,
  radiusPx: 22,
  dim: 0.22,
};

function readRecedeTokens(): RecedeTokens {
  if (typeof window === "undefined") return DEFAULTS;
  const s = getComputedStyle(document.documentElement);
  const scale = parseFloat(s.getPropertyValue("--recede-scale"));
  const blurPx = parseFloat(s.getPropertyValue("--recede-blur"));
  const radiusPx = parseFloat(s.getPropertyValue("--recede-radius"));
  const dim = parseFloat(s.getPropertyValue("--recede-dim"));
  return {
    scale: Number.isFinite(scale) ? scale : DEFAULTS.scale,
    blurPx: Number.isFinite(blurPx) ? blurPx : DEFAULTS.blurPx,
    radiusPx: Number.isFinite(radiusPx) ? radiusPx : DEFAULTS.radiusPx,
    dim: Number.isFinite(dim) ? dim : DEFAULTS.dim,
  };
}

type Props = {
  children: React.ReactNode;
  className?: string;
  /** Override shared context (tests / local demos) */
  active?: boolean;
};

export function ScaleBlurLayer({ children, className, active }: Props) {
  const { isReceded } = useReceded();
  const reduce = useSafeReducedMotion();
  const on = active ?? isReceded;
  const [tokens, setTokens] = useState<RecedeTokens>(DEFAULTS);

  useEffect(() => {
    setTokens(readRecedeTokens());
  }, []);

  return (
    <div className={cn("relative", className)}>
      <motion.div
        className="origin-center overflow-hidden will-change-[transform,filter]"
        initial={false}
        animate={
          reduce
            ? { opacity: on ? 0.55 : 1 }
            : {
                scale: on ? tokens.scale : 1,
                borderRadius: on ? tokens.radiusPx : 0,
                filter: on
                  ? `blur(${tokens.blurPx}px) brightness(0.92)`
                  : "blur(0px) brightness(1)",
              }
        }
        transition={reduce ? { duration: 0.2 } : SPRING}
      >
        {children}
      </motion.div>

      {!reduce ? (
        <motion.div
          aria-hidden
          className="pointer-events-none absolute inset-0 z-[1] bg-ink"
          initial={false}
          animate={{
            opacity: on ? tokens.dim : 0,
            borderRadius: on ? tokens.radiusPx : 0,
          }}
          transition={SPRING}
        />
      ) : null}
    </div>
  );
}
