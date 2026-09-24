import { cn } from "@/lib/utils";

/**
 * PaperCard — tinted surface with a deterministic scrapbook tilt, built on the
 * site's existing card shadow language. Optional hover-straighten. Tilt is set
 * via the --card-tilt custom prop (see globals.css .paper-card), always a fixed
 * value so SSR/client match.
 */
type Tilt = "sm" | "md" | "lg" | number;
type Tint = "mint" | "sky" | "blush" | "butter";

const TILT_TOKEN: Record<"sm" | "md" | "lg", string> = {
  sm: "var(--tilt-sm)",
  md: "var(--tilt-md)",
  lg: "var(--tilt-lg)",
};

function tiltValue(tilt?: Tilt): string {
  if (tilt == null) return "0deg";
  if (typeof tilt === "number") return `${tilt}deg`;
  return TILT_TOKEN[tilt];
}

type PaperCardProps = {
  children: React.ReactNode;
  tilt?: Tilt;
  tint?: Tint;
  /** Straighten + lift on hover. */
  hover?: boolean;
  className?: string;
  style?: React.CSSProperties;
};

export function PaperCard({
  children,
  tilt,
  tint,
  hover = false,
  className,
  style,
}: PaperCardProps) {
  return (
    <div
      data-tint={tint}
      className={cn("paper-card", hover && "paper-card--hover", className)}
      style={
        { ["--card-tilt"]: tiltValue(tilt), ...style } as React.CSSProperties
      }
    >
      {children}
    </div>
  );
}
