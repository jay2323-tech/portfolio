"use client";

import { useEffect, useState } from "react";
import { useReducedMotion } from "framer-motion";

/**
 * Like useReducedMotion, but always `false` on the server and the first
 * client render so SSR HTML matches hydration. After mount it tracks the
 * real prefers-reduced-motion value.
 */
export function useSafeReducedMotion(): boolean {
  const reduce = useReducedMotion();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setReady(true);
  }, []);

  return ready ? Boolean(reduce) : false;
}
