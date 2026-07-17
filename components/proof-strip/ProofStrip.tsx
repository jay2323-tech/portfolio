import Link from "next/link";

const claims = [
  {
    label: "Factory attendance",
    value: "Live in production",
    detail: "Daily punches, reports, and exception queues on a real factory floor.",
    href: "/work/factory-attendance",
  },
  {
    label: "CompanyBrain",
    value: "Graph RAG in build",
    detail: "Hybrid search + graph retrieval with SSE streaming and inspectable sources.",
    href: "/work/company-brain",
  },
  {
    label: "DesiFit",
    value: "DPDP-shaped product",
    detail: "Consent-first data design under India’s Digital Personal Data Protection Act.",
    href: "/work/desi-fit",
  },
  {
    label: "This site",
    value: "RAG over itself",
    detail: "Ask My Work will query a curated corpus of these case studies.",
    href: "/#ask",
  },
] as const;

export function ProofStrip() {
  return (
    <section
      id="proof"
      className="section-pad border-t border-white/[0.06] bg-ink-800 py-14 md:py-16"
      aria-labelledby="proof-heading"
    >
      <div className="mx-auto max-w-[var(--content-max)]">
        <h2 id="proof-heading" className="sr-only">
          Proof
        </h2>
        <ul className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
          {claims.map((claim) => (
            <li key={claim.label}>
              <Link
                href={claim.href}
                className="block transition-colors hover:text-accent-clay"
              >
                <p className="font-mono-data text-[10px] uppercase tracking-wider text-text-muted">
                  {claim.label}
                </p>
                <p className="font-mono-data mt-2 text-sm text-paper-50">
                  {claim.value}
                </p>
                <p className="mt-2 text-xs leading-relaxed text-text-muted">
                  {claim.detail}
                </p>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
