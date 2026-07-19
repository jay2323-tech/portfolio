"use client";

import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";

type Props = {
  text: string;
};

/**
 * Splits an incrementally-growing SSE string into chunks, each rendered in
 * its own span that fades in once on mount and is never touched again —
 * so new tokens materialize instead of popping in wholesale, without
 * re-animating (or flashing) text that already settled.
 *
 * Uses React's "adjust state during render" pattern (comparing against a
 * previous-text state var) rather than mutating a ref during render, which
 * would silently break under Strict Mode's double-invoke.
 */
export function StreamingText({ text }: Props) {
  const [prevText, setPrevText] = useState("");
  const [chunks, setChunks] = useState<string[]>([]);
  const reduce = useReducedMotion();

  if (text !== prevText) {
    const grew = text.startsWith(prevText);
    setChunks(grew ? [...chunks, text.slice(prevText.length)] : [text]);
    setPrevText(text);
  }

  if (reduce) return <>{text}</>;

  return (
    <>
      {chunks.map((chunk, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.25 }}
        >
          {chunk}
        </motion.span>
      ))}
    </>
  );
}
