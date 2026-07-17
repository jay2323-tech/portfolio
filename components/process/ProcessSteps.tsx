const steps = [
  {
    n: "01",
    label: "Discovery",
    body: "A short call to map the problem, constraints, and what “done” means. I need honest access to the current system, decision-maker, and any compliance limits up front.",
  },
  {
    n: "02",
    label: "Proposal",
    body: "A concrete architecture and timeline — not a slide deck of buzzwords. You get tradeoffs in writing before any build clock starts.",
  },
  {
    n: "03",
    label: "Build",
    body: "Visible checkpoints: working increments you can click, not a big reveal. Feedback windows are scheduled so scope does not silently expand.",
  },
  {
    n: "04",
    label: "Handoff",
    body: "Docs, runbooks, and a support window after launch. If it only works while I’m watching the logs, it isn’t handed off.",
  },
] as const;

export function ProcessSteps() {
  return (
    <section
      id="process"
      className="section-pad scroll-mt-20 border-t border-white/[0.06] bg-paper-50 py-[var(--section-gap-mobile)] text-ink-950 md:py-[var(--section-gap-desktop)]"
      data-glass="paper"
      aria-labelledby="process-heading"
    >
      <div className="mx-auto max-w-[var(--content-max)]">
        <p className="font-mono-data text-xs uppercase tracking-[0.14em] text-ink-800/55">
          Freelance
        </p>
        <h2
          id="process-heading"
          className="font-display mt-3 text-2xl tracking-tight text-ink-950 md:text-text-xl"
        >
          How this works
        </h2>
        <p className="mt-3 max-w-xl text-ink-800/75">
          A real sequence — what I need from you at each stage.
        </p>

        <ol className="mt-12 grid gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
          {steps.map((step) => (
            <li key={step.n}>
              <p className="font-mono-data text-xs text-accent-clay">{step.n}</p>
              <h3 className="mt-2 text-lg font-medium tracking-tight text-ink-950">
                {step.label}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-ink-800/75">
                {step.body}
              </p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
