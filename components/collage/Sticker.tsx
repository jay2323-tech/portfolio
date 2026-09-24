import { cn } from "@/lib/utils";

/**
 * Sticker — decorative rotated cut-out accent, absolutely positioned within a
 * `position: relative` parent. Purely ornamental (aria-hidden). Rotation is
 * always caller-supplied and fixed, so SSR and client render identically.
 */
type StickerProps = {
  /** File under /images/collage/stickers, e.g. "sparkle-mint.svg". */
  src: string;
  /** px size (square-ish). */
  size?: number;
  /** Fixed rotation in degrees. */
  rotate?: number;
  /** Gentle idle float (gated by prefers-reduced-motion in CSS). */
  float?: boolean;
  /** Positioning — any subset; values are CSS lengths. */
  top?: string;
  left?: string;
  right?: string;
  bottom?: string;
  className?: string;
  style?: React.CSSProperties;
} & { [key: `data-${string}`]: string | boolean | undefined };

export function Sticker({
  src,
  size = 64,
  rotate = 0,
  float = false,
  top,
  left,
  right,
  bottom,
  className,
  style,
  ...rest
}: StickerProps) {
  const rot = `${rotate}deg`;
  return (
    <img
      src={`/images/collage/stickers/${src}`}
      alt=""
      aria-hidden="true"
      draggable={false}
      loading="lazy"
      width={size}
      height={size}
      className={cn("collage-sticker", float && "collage-sticker--float", className)}
      style={{
        width: size,
        height: size,
        top,
        left,
        right,
        bottom,
        // Float keyframe reads --sticker-rot; static uses transform directly.
        ...(float
          ? ({ ["--sticker-rot"]: rot } as React.CSSProperties)
          : { transform: `rotate(${rot})` }),
        ...style,
      }}
      {...rest}
    />
  );
}
