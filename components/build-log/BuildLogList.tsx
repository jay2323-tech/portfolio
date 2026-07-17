import Image from "next/image";
import entries from "@/content/build-log/entries.json";
import { SectionIndex } from "@/components/chrome/SectionIndex";
import { MarqueeText } from "@/components/chrome/MarqueeText";
import { cn } from "@/lib/utils";

type Entry = {
  date: string;
  tag?: string;
  body: string;
};

const BLOCKS = [
  {
    bg: "color-block-blush",
    blob: "/images/editorial/blob-blush.svg",
  },
  {
    bg: "color-block-sky",
    blob: "/images/editorial/blob-sky.svg",
  },
  {
    bg: "color-block-butter",
    blob: "/images/editorial/blob-butter.svg",
  },
] as const;

function formatIndex(i: number) {
  return String(i + 1).padStart(3, "0");
}

function formatDate(iso: string) {
  const d = new Date(`${iso}T12:00:00`);
  return d.toLocaleDateString("en-US", {
    month: "2-digit",
    year: "numeric",
  });
}

export function BuildLogList() {
  const items = (entries as Entry[])
    .slice()
    .sort((a, b) => (a.date < b.date ? 1 : -1))
    .slice(0, 3);

  return (
    <section
      id="build-log"
      className="scroll-mt-20 section-gap border-t border-ink/6"
      aria-labelledby="build-log-heading"
    >
      <div className="section-pad mx-auto max-w-[var(--content-max)]">
        <SectionIndex index="03" meta="NOTEBOOK" />
        <h2 id="build-log-heading" className="section-title mt-3">
          Build log
        </h2>
        <p className="mt-3 max-w-xl text-muted">
          Short updates — what shipped, what broke, what&apos;s next.
        </p>
      </div>

      <MarqueeText text="BUILDLOG" className="mt-10" />

      <ul className="section-pad mx-auto mt-10 grid max-w-[var(--content-max)] gap-6 md:grid-cols-3">
        {items.map((entry, i) => {
          const style = BLOCKS[i % BLOCKS.length];
          return (
            <li
              key={`${entry.date}-${entry.tag ?? "log"}`}
              className={cn(
                "relative overflow-hidden rounded-[var(--radius-card)] p-6",
                style.bg,
              )}
            >
              <Image
                src={style.blob}
                alt=""
                width={200}
                height={120}
                className="pointer-events-none absolute -right-4 -top-2 h-28 w-auto opacity-70"
              />
              <p className="relative font-mono-data text-[10px] uppercase tracking-wider text-ink/55">
                {formatIndex(i)} · {formatDate(entry.date)}
              </p>
              {entry.tag && (
                <p className="relative mt-3 font-mono-data text-[10px] uppercase tracking-wider text-accent-clay">
                  {entry.tag}
                </p>
              )}
              <p className="relative mt-3 text-sm leading-relaxed text-ink">
                {entry.body}
              </p>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
