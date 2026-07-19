"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";
import { scrambleDuration, scrambleText } from "@/lib/motion/scramble";
import { cn } from "@/lib/utils";

const NAME = "JAYANTH KRISHNA";
const STORAGE_KEY = "jk-preloader-seen";

/**
 * First-load scramble preloader — 600–900ms, once per session.
 */
export function Preloader() {
  const reduce = useReducedMotion();
  const [show, setShow] = useState(false);
  const [exiting, setExiting] = useState(false);
  const textRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    if (reduce) return;
    try {
      if (sessionStorage.getItem(STORAGE_KEY)) return;
    } catch {
      /* private mode */
    }
    setShow(true);
  }, [reduce]);

  useEffect(() => {
    if (!show || !textRef.current) return;

    const el = textRef.current;
    const ac = new AbortController();
    const started = performance.now();
    const minMs = 600;
    const maxMs = 900;
    const natural = scrambleDuration(NAME, 36, 2);
    const target = Math.min(maxMs, Math.max(minMs, natural));

    const finish = () => {
      try {
        sessionStorage.setItem(STORAGE_KEY, "1");
      } catch {
        /* ignore */
      }
      setExiting(true);
      window.setTimeout(() => setShow(false), 280);
    };

    const cancel = scrambleText({
      text: NAME,
      charDuration: 36,
      cycles: 2,
      signal: ac.signal,
      onUpdate: (display) => {
        el.textContent = display;
      },
      onComplete: () => {
        const waited = performance.now() - started;
        const rest = Math.max(0, target - waited);
        window.setTimeout(finish, rest);
      },
    });

    const safety = window.setTimeout(finish, maxMs + 50);

    return () => {
      cancel();
      ac.abort();
      window.clearTimeout(safety);
    };
  }, [show]);

  if (!show) return null;

  return (
    <div
      className={cn(
        "fixed inset-0 z-[var(--z-preloader)] flex items-center justify-center bg-bg",
        "transition-opacity duration-300 ease-out",
        exiting ? "opacity-0" : "opacity-100",
      )}
      aria-hidden
    >
      <p
        ref={textRef}
        className="font-mono-data text-sm tracking-[0.22em] text-ink tabular-nums md:text-base"
      >
        {NAME.replace(/./g, (c) => (c === " " ? " " : "·"))}
      </p>
    </div>
  );
}
