import Link from "next/link";
import { ArchitectureDiagramCanvas } from "@/components/architecture-diagram/ArchitectureDiagram";
import type { CaseStudy } from "@/lib/case-studies/types";

type Props = {
  study: CaseStudy;
};

export function CaseStudyDetail({ study }: Props) {
  const showDiagram = study.slug === "company-brain";

  return (
    <article className="section-pad mx-auto max-w-[var(--content-max)] py-16 md:py-24">
      <p className="section-eyebrow mb-4">{study.eyebrow}</p>
      <h1 className="font-display max-w-3xl text-3xl leading-[1.1] tracking-tight text-ink md:text-text-2xl">
        {study.headline}
      </h1>

      <dl className="mt-10 grid grid-cols-2 gap-6 border-y border-ink/8 py-8 sm:grid-cols-3">
        {study.metrics.map((metric) => (
          <div key={metric.label}>
            <dt className="font-mono-data text-[10px] uppercase tracking-wider text-muted">
              {metric.label}
            </dt>
            <dd className="font-mono-data mt-1 text-lg text-ink md:text-xl">
              {metric.value}
            </dd>
          </div>
        ))}
      </dl>

      <section id={study.sectionIds.context} className="mt-14 scroll-mt-24">
        <h2 className="font-mono-data text-xs uppercase tracking-wider text-accent-clay">
          Context
        </h2>
        <p className="mt-3 max-w-2xl text-base text-ink/90">{study.who}</p>
        <ul className="mt-5 max-w-2xl space-y-2 text-sm text-muted">
          {study.constraints.map((item) => (
            <li key={item} className="flex gap-3">
              <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-muted" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </section>

      <section
        id={study.sectionIds.architecture}
        className="mt-14 scroll-mt-24 border-t border-ink/8 pt-14"
      >
        <h2 className="font-mono-data text-xs uppercase tracking-wider text-accent-clay">
          Architecture
        </h2>
        <p className="mt-3 max-w-2xl text-base text-ink/90">
          {study.architectureSummary}
        </p>
        {showDiagram && (
          <div className="mt-8">
            <ArchitectureDiagramCanvas />
          </div>
        )}
      </section>

      <section
        id={study.sectionIds.decisions}
        className="mt-14 scroll-mt-24 border-t border-ink/8 pt-14"
      >
        <h2 className="font-mono-data text-xs uppercase tracking-wider text-accent-clay">
          Decisions & tradeoffs
        </h2>
        <ul className="mt-6 space-y-8">
          {study.decisions.map((decision) => (
            <li key={decision.title} className="max-w-2xl">
              <h3 className="text-lg text-ink">{decision.title}</h3>
              <p className="mt-2 text-sm text-muted">{decision.body}</p>
            </li>
          ))}
        </ul>
      </section>

      <section
        id={study.sectionIds.whatBroke}
        className="mt-14 scroll-mt-24 border-t border-ink/8 pt-14"
      >
        <h2 className="font-mono-data text-xs uppercase tracking-wider text-accent-clay">
          What broke / what I&apos;d change
        </h2>
        <p className="mt-3 max-w-2xl text-base text-ink/90">{study.whatBroke}</p>
      </section>

      <section
        id={study.sectionIds.metrics}
        className="mt-14 scroll-mt-24 border-t border-ink/8 pt-14"
      >
        <h2 className="font-mono-data text-xs uppercase tracking-wider text-accent-clay">
          Metrics
        </h2>
        <dl className="mt-6 grid grid-cols-2 gap-6 sm:grid-cols-3">
          {study.metrics.map((metric) => (
            <div key={metric.label}>
              <dt className="font-mono-data text-[10px] uppercase tracking-wider text-muted">
                {metric.label}
              </dt>
              <dd className="font-mono-data mt-1 text-lg text-ink">
                {metric.value}
              </dd>
            </div>
          ))}
        </dl>
      </section>

      {study.links.length > 0 && (
        <div className="mt-14 flex flex-wrap gap-4 border-t border-ink/8 pt-10">
          {study.links.map((link) =>
            link.external ? (
              <a
                key={link.href}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-accent-clay hover:opacity-80"
              >
                {link.label} ↗
              </a>
            ) : (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm text-accent-clay hover:opacity-80"
              >
                {link.label}
              </Link>
            ),
          )}
          <Link href="/#work" className="text-sm text-muted hover:text-ink">
            ← All work
          </Link>
        </div>
      )}
    </article>
  );
}
