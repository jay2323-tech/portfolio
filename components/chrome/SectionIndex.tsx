import { cn } from "@/lib/utils";

type Props = {
  index: string;
  meta?: string;
  className?: string;
};

export function SectionIndex({ index, meta, className }: Props) {
  return (
    <p
      className={cn(
        "section-eyebrow flex flex-wrap items-center gap-2",
        className,
      )}
    >
      <span>{index}</span>
      {meta ? (
        <>
          <span className="text-ink/20" aria-hidden>
            /
          </span>
          <span>{meta}</span>
        </>
      ) : null}
    </p>
  );
}
