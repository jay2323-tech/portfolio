/** Shared editorial ease — Juba-style decelerate */
export const editorialEase = [0.16, 1, 0.3, 1] as const;

export const editorialTransition = {
  duration: 0.75,
  ease: editorialEase,
} as const;
