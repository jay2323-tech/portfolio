"use client";

/**
 * Animated film-grain / pixel noise overlay.
 * Does not affect layout — absolute, pointer-events none.
 */
export function HeroGrain() {
  return (
    <div className="hero-grain pointer-events-none absolute inset-0 z-[3]" aria-hidden>
      <div className="hero-grain__layer" />
    </div>
  );
}
