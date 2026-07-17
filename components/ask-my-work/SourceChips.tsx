"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import type { RetrievedMeta } from "@/lib/rag/client";

type Props = {
  chunks: RetrievedMeta[];
  className?: string;
};

export function SourceChips({ chunks, className }: Props) {
  if (!chunks.length) return null;

  return (
    <ul
      className={cn("mt-3 flex flex-wrap gap-2", className)}
      aria-label="Retrieved sources"
    >
      {chunks.map((chunk) => {
        const href = chunk.href || "/#work";
        return (
          <li key={chunk.id}>
            <Link
              href={href}
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
