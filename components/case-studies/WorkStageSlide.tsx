"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import type { CaseStudy } from "@/lib/case-studies/types";

type Props = {
  study: CaseStudy;
  className?: string;
  /** When true, title is rendered by the shared stack — omit here */
  hideTitle?: boolean;
};

/**
 * Left column copy for a work stage slide (meta, optional title, blurb, metrics).
 */
export function WorkStageSlide({ study, className, hideTitle }: Props) {
  return (
    <div className={cn("flex h-full min-h-0 flex-col", className)}>
      <p
        data-work-meta
        className="font-mono-data text-[10px] uppercase tracking-[0.16em] text-muted"
      >
        {study.domain}
        <span className="mx-2 text-ink/20">·</span>
        {study.year}
      </p>

      {!hideTitle ? (
        <h3 className="font-display mt-3 text-[clamp(2rem,6vw,3.5rem)] leading-[0.88] tracking-tight text-mint-deep">
          {study.title}
        </h3>
      ) : null}

      <p
        data-work-problem
        className="mt-4 max-w-md text-sm leading-relaxed text-ink/80 md:text-base"
      >
        {study.problem}
      </p>

      <dl className="mt-auto grid grid-cols-3 gap-3 border-t border-ink/10 pt-5">
        {study.metrics.slice(0, 3).map((m) => (
          <div key={m.label}>
            <dd className="font-mono-data text-[15px] font-semibold tracking-tight text-ink md:text-[18px]">
              {m.value}
            </dd>
            <dt className="mt-1 font-mono-data text-[9px] uppercase tracking-[0.1em] text-muted md:text-[10px]">
              {m.label}
            </dt>
          </div>
        ))}
      </dl>

      <Link
        href={`/work/${study.slug}`}
        data-cursor="view"
        className="mt-5 inline-flex font-mono-data text-[10px] tracking-[0.14em] text-ink transition-colors hover:text-mint-deep"
      >
        OPEN CASE →
      </Link>
    </div>
  );
}
