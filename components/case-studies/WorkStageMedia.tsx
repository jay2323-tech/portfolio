"use client";

import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import type { CaseStudy } from "@/lib/case-studies/types";

type Props = {
  study: CaseStudy;
  className?: string;
  /** Absolute stacked layer for scrub crossfade */
  layer?: boolean;
};

/**
 * Right-pane media well for Featured Work stage.
 */
export function WorkStageMedia({ study, className, layer }: Props) {
  return (
    <Link
      href={`/work/${study.slug}`}
      data-cursor="view"
      aria-label={`Open case study: ${study.title}`}
      className={cn(
        "group relative block overflow-hidden rounded-[calc(var(--radius-hero)-8px)] bg-surface",
        layer && "absolute inset-0",
        className,
      )}
    >
      <Image
        src={study.coverImage}
        alt=""
        fill
        unoptimized={study.coverImage.endsWith(".svg")}
        sizes="(max-width: 768px) 100vw, 48vw"
        className="object-contain p-6 transition-transform duration-500 ease-out group-hover:scale-[1.03] md:p-8"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-3 rounded-[calc(var(--radius-hero)-12px)] border border-ink/8 md:inset-4"
      />
    </Link>
  );
}
