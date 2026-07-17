/** 4×4 Bayer ordered-dither matrix (0–15) */
export const BAYER_4 = [
  [0, 8, 2, 10],
  [12, 4, 14, 6],
  [3, 11, 1, 9],
  [15, 7, 13, 5],
] as const;

function luminance(r: number, g: number, b: number) {
  return 0.299 * r + 0.587 * g + 0.114 * b;
}

/**
 * Apply 4×4 Bayer ordered dither to ImageData, one dot per source pixel.
 * Call this on a *downsampled* buffer, then scale the result back up with
 * imageSmoothingEnabled = false — that's what turns single dithered pixels
 * into visible halftone dots instead of a near-invisible speckle.
 * Writes dark ink dots on transparent (light-site friendly).
 */
export function ditherImageData(src: ImageData): ImageData {
  const { width, height, data } = src;
  const out = new ImageData(width, height);
  const od = out.data;

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const i = (y * width + x) * 4;
      const a = data[i + 3] / 255;
      if (a < 0.08) {
        od[i + 3] = 0;
        continue;
      }

      const L = luminance(data[i], data[i + 1], data[i + 2]);
      const threshold = ((BAYER_4[y % 4][x % 4] + 0.5) / 16) * 255;
      const on = L < threshold;

      if (on) {
        od[i] = 20;
        od[i + 1] = 20;
        od[i + 2] = 20;
        od[i + 3] = 235;
      } else {
        od[i + 3] = 0;
      }
    }
  }

  return out;
}

/** Draw a simple head/shoulders silhouette into a canvas (fallback). */
export function drawSilhouette(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
) {
  ctx.fillStyle = "#1a1a1a";
  ctx.fillRect(0, 0, w, h);

  const cx = w * 0.52;
  const headR = Math.min(w, h) * 0.18;
  const headY = h * 0.32;

  // Gradient body
  const g = ctx.createLinearGradient(0, headY, 0, h);
  g.addColorStop(0, "#3a3a3a");
  g.addColorStop(0.5, "#6a6a6a");
  g.addColorStop(1, "#c8c8c8");
  ctx.fillStyle = g;

  // Head
  ctx.beginPath();
  ctx.arc(cx, headY, headR, 0, Math.PI * 2);
  ctx.fill();

  // Shoulders / torso
  ctx.beginPath();
  ctx.moveTo(cx - headR * 1.8, headY + headR * 0.9);
  ctx.quadraticCurveTo(
    cx,
    headY + headR * 1.4,
    cx + headR * 1.8,
    headY + headR * 0.9,
  );
  ctx.lineTo(cx + w * 0.28, h);
  ctx.lineTo(cx - w * 0.28, h);
  ctx.closePath();
  ctx.fill();

  // Soft light on face
  const hg = ctx.createRadialGradient(
    cx - headR * 0.2,
    headY - headR * 0.2,
    0,
    cx,
    headY,
    headR,
  );
  hg.addColorStop(0, "rgba(180,180,180,0.55)");
  hg.addColorStop(1, "rgba(40,40,40,0)");
  ctx.fillStyle = hg;
  ctx.beginPath();
  ctx.arc(cx, headY, headR, 0, Math.PI * 2);
  ctx.fill();
}
