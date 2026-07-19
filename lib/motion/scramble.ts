const GLYPHS =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#%&*+-/<>";

export type ScrambleOptions = {
  /** Final resolved string (spaces preserved). */
  text: string;
  /** Called every frame with the current display string. */
  onUpdate: (display: string) => void;
  /** ms between character settles (default 40). */
  charDuration?: number;
  /** Extra random swaps before settle (default 3). */
  cycles?: number;
  /** Called when fully resolved. */
  onComplete?: () => void;
  signal?: AbortSignal;
};

/**
 * Lightweight scramble-decode — no Club GreenSock plugin.
 * Characters cycle random glyphs L→R, then lock to final text.
 */
export function scrambleText({
  text,
  onUpdate,
  charDuration = 40,
  cycles = 3,
  onComplete,
  signal,
}: ScrambleOptions): () => void {
  const chars = text.split("");
  const resolved: string[] = chars.map((c) =>
    c === " " || c === "." ? c : "",
  );
  let raf = 0;
  let start = 0;
  let cancelled = false;

  const cancel = () => {
    cancelled = true;
    if (raf) cancelAnimationFrame(raf);
  };

  if (signal) {
    if (signal.aborted) {
      onUpdate(text);
      onComplete?.();
      return cancel;
    }
    signal.addEventListener("abort", cancel, { once: true });
  }

  const tick = (now: number) => {
    if (cancelled) return;
    if (!start) start = now;
    const elapsed = now - start;

    let done = true;
    const out = chars.map((final, i) => {
      if (final === " " || final === ".") return final;
      const lockAt = i * charDuration + cycles * charDuration;
      if (elapsed >= lockAt) {
        resolved[i] = final;
        return final;
      }
      done = false;
      if (resolved[i] === final) return final;
      return GLYPHS[(Math.random() * GLYPHS.length) | 0]!;
    });

    onUpdate(out.join(""));

    if (done) {
      onComplete?.();
      return;
    }
    raf = requestAnimationFrame(tick);
  };

  raf = requestAnimationFrame(tick);
  return cancel;
}

/** Approximate total scramble duration for sequencing. */
export function scrambleDuration(
  text: string,
  charDuration = 40,
  cycles = 3,
): number {
  const len = text.replace(/[ .]/g, "").length;
  if (len === 0) return 0;
  return (len - 1) * charDuration + cycles * charDuration + charDuration;
}
