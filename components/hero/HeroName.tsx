"use client";

import { useCallback, useEffect, useRef } from "react";
import { motion, useReducedMotion, type MotionValue } from "framer-motion";
import { cn } from "@/lib/utils";

type Props = {
  first: string;
  last: string;
  className?: string;
  headingId?: string;
  y?: MotionValue<number>;
  opacity?: MotionValue<number>;
};

/** Subtle proximity — soft bulge, not a warp */
const RADIUS = 100;
const MAX_SCALE = 1.08;
const MAX_LIFT = -6;
const MAX_PUSH = 2.5;
const MAX_SKEW = 2.5;
const WEIGHT_FROM = 600;
const WEIGHT_TO = 720;
const SMOOTH = 0.14;

function proximityFalloff(distance: number, radius: number) {
  if (distance >= radius) return 0;
  const n = distance / radius;
  return Math.exp(-n * n * 3.2);
}

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

type MouseState = { x: number; y: number; inside: boolean };

type LetterState = {
  scale: number;
  lift: number;
  push: number;
  skew: number;
  weight: number;
};

type LineProps = {
  text: string;
  className?: string;
  mouse: React.MutableRefObject<MouseState>;
  reduce: boolean | null;
};

/**
 * Letter spans for GSAP entrance (`data-hero-letter`) + proximity hover.
 */
function ProximityLine({ text, className, mouse, reduce }: LineProps) {
  const letterRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const stateRefs = useRef<LetterState[]>([]);
  const raf = useRef<number>(0);

  const tick = useCallback(() => {
    const { x, y, inside } = mouse.current;

    letterRefs.current.forEach((el, i) => {
      if (!el) return;

      if (!stateRefs.current[i]) {
        stateRefs.current[i] = {
          scale: 1,
          lift: 0,
          push: 0,
          skew: 0,
          weight: WEIGHT_FROM,
        };
      }
      const s = stateRefs.current[i];

      let tScale = 1;
      let tLift = 0;
      let tPush = 0;
      let tSkew = 0;
      let tWeight = WEIGHT_FROM;

      if (inside) {
        const rect = el.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        const dx = x - cx;
        const dy = y - cy;
        const dist = Math.hypot(dx, dy);
        const p = proximityFalloff(dist, RADIUS);

        if (p > 0.002) {
          tScale = 1 + (MAX_SCALE - 1) * p;
          tLift = MAX_LIFT * p;
          tPush = -Math.sign(dx || 1) * MAX_PUSH * p;
          tSkew = (dx > 0 ? -1 : 1) * MAX_SKEW * p;
          tWeight = WEIGHT_FROM + (WEIGHT_TO - WEIGHT_FROM) * p;
        }
      }

      s.scale = lerp(s.scale, tScale, SMOOTH);
      s.lift = lerp(s.lift, tLift, SMOOTH);
      s.push = lerp(s.push, tPush, SMOOTH);
      s.skew = lerp(s.skew, tSkew, SMOOTH);
      s.weight = lerp(s.weight, tWeight, SMOOTH);

      const idle =
        Math.abs(s.scale - 1) < 0.001 &&
        Math.abs(s.lift) < 0.05 &&
        Math.abs(s.push) < 0.05;

      if (idle && !inside) {
        el.style.transform = "";
        el.style.fontVariationSettings = "";
        return;
      }

      el.style.transform = `translate3d(${s.push.toFixed(2)}px, ${s.lift.toFixed(2)}px, 0) scale(${s.scale.toFixed(4)}) skewX(${s.skew.toFixed(2)}deg)`;
      el.style.fontVariationSettings = `'wght' ${s.weight.toFixed(0)}`;
    });

    raf.current = requestAnimationFrame(tick);
  }, [mouse]);

  useEffect(() => {
    if (reduce) return;
    raf.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf.current);
  }, [tick, reduce]);

  if (reduce) {
    return <span className={className}>{text}</span>;
  }

  return (
    <span className={cn("inline-block", className)} aria-label={text}>
      {text.split("").map((char, i) => (
        <span
          key={`${char}-${i}`}
          data-hero-letter
          className="inline-block will-change-transform"
          style={{ transformOrigin: "50% 70%" }}
          aria-hidden
        >
          <span
            ref={(el) => {
              letterRefs.current[i] = el;
            }}
            className="inline-block will-change-transform"
            style={{ transformOrigin: "50% 70%" }}
          >
            {char === " " ? "\u00A0" : char}
          </span>
        </span>
      ))}
    </span>
  );
}

/**
 * Juba name stack — GSAP owns entrance; Framer proximity on hover.
 */
export function HeroName({
  first,
  last,
  className,
  headingId,
  y,
  opacity,
}: Props) {
  const reduce = useReducedMotion();
  const mouse = useRef<MouseState>({ x: 0, y: 0, inside: false });
  const lastText = last.replace(/\.$/, "");

  return (
    <motion.div
      style={
        y != null || opacity != null
          ? {
              ...(y != null ? { y } : {}),
              ...(opacity != null ? { opacity } : {}),
            }
          : undefined
      }
      className={cn(className)}
    >
      <h1
        id={headingId}
        className="font-sans cursor-default font-medium tracking-[-0.02em] uppercase"
        onMouseMove={(e) => {
          mouse.current = { x: e.clientX, y: e.clientY, inside: true };
        }}
        onMouseLeave={() => {
          mouse.current.inside = false;
        }}
      >
        <ProximityLine
          text={first}
          className="block text-[clamp(3.5rem,10vw,7rem)] font-normal leading-[0.9] text-ink"
          mouse={mouse}
          reduce={reduce}
        />
        <ProximityLine
          text={`${lastText}.`}
          className="block text-[clamp(4rem,12vw,9rem)] font-bold leading-[0.88] text-mint-deep"
          mouse={mouse}
          reduce={reduce}
        />
      </h1>
    </motion.div>
  );
}
