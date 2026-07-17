"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import type { CaseStudy } from "@/lib/case-studies/types";

type Props = {
  study: CaseStudy;
  className?: string;
};

const DOMAIN: Record<string, string> = {
  "company-brain": "Graph RAG",
  "factory-attendance": "Computer Vision",
  "desi-fit": "Health · DPDP",
};

const YEAR: Record<string, string> = {
  "company-brain": "2025",
  "factory-attendance": "2024",
  "desi-fit": "2025",
};

/**
 * Juba work row: category·year | doubled title | 3 metrics | →
 * Sibling dim + mint tint handled by parent `.work-list:hover` CSS.
 */
export function CaseStudyCard({ study, className }: Props) {
  const domain = DOMAIN[study.slug] ?? "Product";
  const year = YEAR[study.slug] ?? "2025";

  return (
    <article
      id={study.slug}
      data-work-row
      className={cn(
        "work-row group relative border-t border-ink/10 transition-[background-color,opacity] duration-250 ease-out",
        className,
      )}
    >
      <Link
        href={`/work/${study.slug}`}
        className="section-pad mx-auto grid max-w-[var(--content-max)] gap-5 py-8 sm:gap-6 sm:py-10 md:grid-cols-[minmax(0,1fr)_auto] md:items-start md:gap-10 md:py-12"
      >
        <div className="min-w-0">
          <p className="font-mono-data text-[10px] uppercase tracking-[0.16em] text-muted">
            {domain}
            <span className="mx-2 text-ink/20">·</span>
            {year}
          </p>

          <h3 className="font-display mt-3 text-[clamp(1.65rem,7vw,3.25rem)] leading-[0.85] tracking-tight text-ink transition-transform duration-250 ease-out group-hover:scale-[1.02] origin-left">
            <span className="relative z-[1] block">{study.title}</span>
            <span
              className="pointer-events-none -mt-[0.42em] block select-none text-ink/[0.12]"
              aria-hidden
            >
              {study.title}
            </span>
          </h3>

          <p className="mt-4 max-w-xl text-sm leading-relaxed text-muted md:text-base">
            {study.problem}
          </p>

          <p className="mt-3 font-mono-data text-[10px] uppercase tracking-[0.14em] text-ok-signal">
            {study.statusLabel}
          </p>
        </div>

        <div className="flex shrink-0 items-start gap-6 md:gap-10">
          <dl className="grid grid-cols-3 gap-4 sm:gap-6 md:w-[14rem] md:grid-cols-1 md:gap-4 md:text-right">
            {study.metrics.slice(0, 3).map((metric) => (
              <div key={metric.label}>
                <dd
                  data-metric-value
                  className="font-mono-data text-lg tracking-tight text-ink md:text-xl"
                >
                  {metric.value}
                </dd>
                <dt className="mt-1 font-mono-data text-[9px] uppercase tracking-[0.16em] text-muted">
                  {metric.label}
                </dt>
              </div>
            ))}
          </dl>

          <span
            aria-hidden
            className="work-row-arrow mt-1 font-mono-data text-lg text-ink transition-transform duration-250 ease-out group-hover:translate-x-1"
          >
            →
          </span>
        </div>
      </Link>
    </article>
  );
}
