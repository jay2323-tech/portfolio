import { cn } from "@/lib/utils";

type Props = {
  text: string;
  className?: string;
  repeats?: number;
  tint?: "mint" | "blush" | "sky" | "none";
};

export function MarqueeText({
  text,
  className,
  repeats = 8,
  tint = "mint",
}: Props) {
  const tintClass =
    tint === "blush"
      ? "marquee-tint-blush"
      : tint === "sky"
        ? "marquee-tint-sky"
        : tint === "mint"
          ? "marquee-tint-mint"
          : "border-ink/5";

  const items = Array.from({ length: repeats }, (_, i) => (
    <span key={i} className="mx-4 inline-block whitespace-nowrap">
      {text}
    </span>
  ));

  return (
    <div
      className={cn(
        "group overflow-hidden border-y py-2",
        tintClass,
        className,
      )}
      aria-hidden
    >
      <div className="marquee-track flex w-max font-display text-sm tracking-tight text-ink/20 md:text-base">
        {items}
        {items}
      </div>
    </div>
  );
}
