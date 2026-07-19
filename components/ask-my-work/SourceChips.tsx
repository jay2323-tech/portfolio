"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { useReducedMotion } from "framer-motion";
import { gsap, registerGsap } from "@/lib/gsap/setup";
import { cn } from "@/lib/utils";
import type { RetrievedMeta } from "@/lib/rag/client";

type Props = {
  chunks: RetrievedMeta[];
  className?: string;
};

/** Citation chips — stagger fade-up when sources arrive. */
export function SourceChips({ chunks, className }: Props) {
  const listRef = useRef<HTMLUListElement>(null);
  const reduce = useReducedMotion();

  useEffect(() => {
    if (reduce || !listRef.current || !chunks.length) return;
    registerGsap();
    const chips = listRef.current.querySelectorAll<HTMLElement>("[data-source-chip]");
    gsap.fromTo(
      chips,
      { y: 8, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.35,
        stagger: 0.15,
        ease: "power2.out",
        clearProps: "transform,opacity",
      },
    );
  }, [chunks, reduce]);

  if (!chunks.length) return null;

  return (
    <ul
      ref={listRef}
      className={cn("mt-3 flex flex-wrap gap-2", className)}
      aria-label="Retrieved sources"
    >
      {chunks.map((chunk) => {
        const href = chunk.href || "/#work";
        return (
          <li key={chunk.id} data-source-chip>
            <Link
              href={href}
              data-cursor="view"
              className="inline-flex max-w-full items-center gap-2 rounded-full border border-ink/12 bg-bg px-2.5 py-1 font-mono-data text-[10px] text-ink transition-colors hover:border-accent-clay/50 hover:text-accent-clay"
              title={chunk.title}
            >
              <span className="truncate">{chunk.title}</span>
              <span className="shrink-0 text-ok-signal">
                {chunk.score.toFixed(2)}
              </span>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
