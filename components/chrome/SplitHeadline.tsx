import Image from "next/image";

export function SplitHeadline() {
  return (
    <section
      className="section-gap border-t border-ink/6 color-block-sky"
      aria-labelledby="split-heading"
    >
      <div className="section-pad mx-auto max-w-[var(--content-max)]">
        <div className="grid items-center gap-10 md:grid-cols-2 md:gap-16">
          <div>
            <p className="section-eyebrow">From retrieval</p>
            <h2
              id="split-heading"
              className="font-display mt-3 text-[clamp(2.25rem,5vw,4rem)] leading-[1.05] tracking-tight text-ink"
            >
              to production
            </h2>
            <p className="mt-5 max-w-md text-muted">
              Embeddings and ranking are only half the job. The other half is
              shipping systems people can inspect, operate, and trust on a real
              floor — factory or enterprise.
            </p>
          </div>
          <div className="relative aspect-[4/3] overflow-hidden rounded-[var(--radius-hero)] bg-blush">
            <Image
              src="/images/editorial/blob-blush.svg"
              alt=""
              fill
              className="object-contain p-10 opacity-90"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
