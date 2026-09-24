import { cn } from "@/lib/utils";

/**
 * TornEdge — full-bleed ripped-paper divider that overlaps a section boundary.
 *
 * Place inside a `position: relative` section. `side="top"` sits above the
 * section (jagged edge biting up into the previous section); `side="bottom"`
 * sits below it. `fill` should match the section's own background so the
 * torn gaps reveal the adjacent section's colour.
 */
const VARIANTS = [
  // 0
  "M0 48 L0 20 L40 9 L92 24 L150 7 L210 25 L272 11 L338 26 L404 8 L470 23 L540 6 L610 25 L676 12 L742 23 L806 8 L872 25 L940 10 L1008 26 L1074 9 L1136 23 L1200 13 L1200 48 Z",
  // 1
  "M0 48 L0 14 L54 28 L110 10 L168 27 L232 9 L296 24 L360 12 L426 27 L492 8 L560 22 L628 10 L694 26 L760 13 L828 24 L894 9 L962 25 L1030 11 L1096 27 L1156 12 L1200 22 L1200 48 Z",
  // 2
  "M0 48 L0 24 L46 10 L104 26 L162 8 L222 22 L286 12 L352 27 L418 9 L484 25 L552 11 L620 24 L688 7 L756 26 L822 13 L890 23 L958 9 L1026 27 L1092 10 L1150 24 L1200 11 L1200 48 Z",
  // 3
  "M0 48 L0 18 L58 7 L118 25 L178 11 L240 27 L304 8 L368 23 L434 12 L500 26 L568 9 L636 24 L702 13 L770 27 L836 10 L904 22 L972 12 L1040 26 L1104 8 L1160 23 L1200 14 L1200 48 Z",
] as const;

type TornEdgeProps = {
  side?: "top" | "bottom";
  /** 1–4 — pick different rips so repeated edges don't visibly tile. */
  variant?: 1 | 2 | 3 | 4;
  /** CSS colour matching the section's own background. */
  fill?: string;
  /** Band height in px. */
  height?: number;
  className?: string;
};

export function TornEdge({
  side = "top",
  variant = 1,
  fill = "var(--bg)",
  height = 44,
  className,
}: TornEdgeProps) {
  const d = VARIANTS[(variant - 1) % VARIANTS.length];
  return (
    <div
      aria-hidden="true"
      className={cn(
        "torn-edge z-[2]",
        side === "top"
          ? "top-0 -translate-y-[calc(100%-1px)]"
          : "bottom-0 translate-y-[calc(100%-1px)]",
        className,
      )}
      style={{ height }}
    >
      <svg
        viewBox="0 0 1200 48"
        preserveAspectRatio="none"
        style={{ transform: side === "bottom" ? "scaleY(-1)" : undefined }}
      >
        <path d={d} fill={fill} />
      </svg>
    </div>
  );
}
