"use client";

import { useEffect, useState } from "react";
import {
  motion,
  useReducedMotion,
  useSpring,
  useMotionValue,
  type MotionValue,
} from "framer-motion";

type Props = {
  /** Scroll-scrubbed scale from useHeroScroll */
  scale?: MotionValue<number>;
  /** Scroll-scrubbed opacity from useHeroScroll */
  opacity?: MotionValue<number>;
};

/**
 * Colorful abstract shapes — float + cursor parallax + scroll scale/fade.
 */
export function HeroShapes({ scale, opacity }: Props) {
  const reduce = useReducedMotion();
  const [isTouch, setIsTouch] = useState(false);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, { stiffness: 40, damping: 20 });
  const springY = useSpring(mouseY, { stiffness: 40, damping: 20 });

  useEffect(() => {
    const touch = window.matchMedia("(pointer: coarse)").matches;
    setIsTouch(touch);
    if (touch || reduce) return;

    function onMove(e: MouseEvent) {
      const x = (e.clientX / window.innerWidth - 0.5) * 24;
      const y = (e.clientY / window.innerHeight - 0.5) * 24;
      mouseX.set(x);
      mouseY.set(y);
    }

    window.addEventListener("mousemove", onMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMove);
  }, [mouseX, mouseY, reduce]);

  const float = reduce
    ? {}
    : {
        animate: {
          y: [0, -14, 0],
          rotate: [0, 4, 0],
        },
        transition: {
          duration: 9,
          repeat: Infinity,
          ease: "easeInOut" as const,
        },
      };

  const floatSlow = reduce
    ? {}
    : {
        animate: {
          y: [0, 18, 0],
          x: [0, 10, 0],
        },
        transition: {
          duration: 12,
          repeat: Infinity,
          ease: "easeInOut" as const,
        },
      };

  return (
    <motion.div
      className="pointer-events-none absolute inset-0 overflow-hidden"
      style={
        scale != null || opacity != null
          ? {
              ...(scale != null ? { scale } : {}),
              ...(opacity != null ? { opacity } : {}),
            }
          : undefined
      }
      aria-hidden
    >
      {/* Largest mint blob — cursor parallax on wrapper, float on inner */}
      <motion.div
        className="absolute -right-[8%] -top-[12%] h-[min(52vw,420px)] w-[min(52vw,420px)]"
        style={
          !reduce && !isTouch
            ? { x: springX, y: springY }
            : undefined
        }
      >
        <motion.div
          className="h-full w-full rounded-full bg-mint/65 blur-[1px]"
          {...float}
        />
      </motion.div>
      <motion.div
        className="absolute right-[12%] top-[28%] h-32 w-32 rounded-full bg-mint-deep/25 md:h-44 md:w-44"
        {...floatSlow}
      />

      <motion.svg
        className="absolute -left-[6%] bottom-[18%] h-48 w-48 md:h-64 md:w-64"
        viewBox="0 0 200 200"
        fill="none"
        {...floatSlow}
      >
        <path
          d="M40 120c20-60 80-90 140-80s100 50 100 100-50 70-110 60S20 180 40 120Z"
          fill="#E8A090"
          fillOpacity="0.45"
        />
      </motion.svg>

      <motion.div
        className="absolute bottom-[8%] right-[6%] h-24 w-24 rotate-12 rounded-[2rem] bg-butter md:h-36 md:w-36"
        {...float}
      />

      <motion.svg
        className="absolute left-[38%] top-[12%] h-28 w-28 md:h-40 md:w-40"
        viewBox="0 0 120 120"
        fill="none"
        animate={reduce ? undefined : { rotate: [0, 360] }}
        transition={
          reduce
            ? undefined
            : { duration: 48, repeat: Infinity, ease: "linear" }
        }
      >
        <circle cx="60" cy="60" r="48" fill="#E3EDF5" fillOpacity="0.9" />
        <circle cx="78" cy="42" r="22" fill="#5ECFC9" fillOpacity="0.35" />
      </motion.svg>

      <motion.div
        className="absolute left-[8%] top-[22%] h-3 w-3 rounded-full bg-accent-clay/70 md:h-4 md:w-4"
        {...float}
      />
      <motion.div
        className="absolute bottom-[32%] left-[22%] h-5 w-5 rounded-full bg-mint-deep/50"
        {...floatSlow}
      />

      <motion.svg
        className="absolute right-[28%] bottom-[22%] h-20 w-20 opacity-80"
        viewBox="0 0 80 80"
        fill="none"
        {...float}
      >
        <rect
          x="10"
          y="10"
          width="50"
          height="50"
          rx="14"
          fill="#C77D3C"
          fillOpacity="0.22"
          transform="rotate(18 35 35)"
        />
      </motion.svg>
    </motion.div>
  );
}
