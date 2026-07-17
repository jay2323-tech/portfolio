"use client";

const ORGS = [
  "CompanyBrain",
  "Factory Attendance",
  "DesiFit",
  "FastAPI",
  "Qdrant",
  "Next.js",
  "Anthropic",
  "OpenAI",
  "TypeScript",
  "Python",
  "Vercel",
  "PostgreSQL",
] as const;

/** Juba tools strip — grayscale → full on hover, seamless loop */
export function LogoMarquee() {
  const row = [...ORGS, ...ORGS];

  return (
    <section
      className="border-b border-ink/8 py-10 md:py-12"
      aria-labelledby="orgs-heading"
    >
      <div className="section-pad mx-auto max-w-[var(--content-max)]">
        <h2
          id="orgs-heading"
          className="font-mono-data text-[10px] uppercase tracking-[0.2em] text-muted"
        >
          SOME OF THE SYSTEMS & TOOLS I&apos;VE WORKED WITH
        </h2>
      </div>
      <div className="mt-6 overflow-hidden border-y border-ink/8 py-4" aria-hidden>
        <div className="marquee-track flex w-max gap-14 px-6 md:gap-16">
          {row.map((name, i) => (
            <span
              key={`${name}-${i}`}
              className="logo-marquee-item shrink-0 font-display text-xl tracking-tight text-ink md:text-2xl"
            >
              {name}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
