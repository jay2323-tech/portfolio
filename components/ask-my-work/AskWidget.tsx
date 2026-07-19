"use client";

import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { ChatPanel } from "./ChatPanel";
import { useAsk } from "./AskContext";

export function AskWidget() {
  const { open, openAsk, closeAsk } = useAsk();

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape" && open) closeAsk();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, closeAsk]);

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-8 z-[var(--z-ask-panel)] flex justify-end p-3 sm:p-4 md:bottom-8 md:p-6">
      <AnimatePresence mode="wait" initial={false}>
        {open ? (
          <motion.div
            key="panel"
            initial={{ opacity: 0, scale: 0.92, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 10 }}
            transition={{ type: "spring", stiffness: 380, damping: 30 }}
            className="pointer-events-auto w-full max-w-md md:w-auto"
          >
            <div className="fixed inset-x-0 bottom-0 top-12 z-[var(--z-ask-panel)] bg-ink/40 p-3 backdrop-blur-sm md:hidden">
              <ChatPanel onClose={closeAsk} />
            </div>
            <div className="hidden md:block">
              <ChatPanel onClose={closeAsk} />
            </div>
          </motion.div>
        ) : (
          <motion.button
            key="pill"
            type="button"
            data-cursor="ask"
            onClick={() => openAsk()}
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.85 }}
            transition={{ type: "spring", stiffness: 400, damping: 26 }}
            className={cn(
              "pointer-events-auto motion-press z-[var(--z-ask-pill)]",
              "btn-pill btn-pill-primary shadow-lg ask-pill-pulse",
            )}
            aria-haspopup="dialog"
            aria-expanded={false}
          >
            Ask about my work
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}
