"use client";

import { useEffect, useState, type ReactNode } from "react";
import { MotionConfig } from "framer-motion";

/**
 * Keep reducedMotion at "never" through SSR + first client paint so Framer
 * doesn't skip `initial` styles on prefers-reduced-motion devices (React #418).
 * After mount, honor the user's setting.
 */
export function SafeMotionConfig({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setReady(true);
  }, []);

  return (
    <MotionConfig reducedMotion={ready ? "user" : "never"}>
      {children}
    </MotionConfig>
  );
}
