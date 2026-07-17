"use client";

import { useEffect } from "react";
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
      {open ? (
        <div className="pointer-events-auto w-full max-w-md md:w-auto">
          <div className="fixed inset-x-0 bottom-0 top-12 z-[var(--z-ask-panel)] bg-ink/40 p-3 backdrop-blur-sm md:hidden">
            <ChatPanel onClose={closeAsk} />
          </div>
          <div className="hidden md:block">
            <ChatPanel onClose={closeAsk} />
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => openAsk()}
          className={cn(
            "pointer-events-auto motion-press z-[var(--z-ask-pill)]",
            "btn-pill btn-pill-primary shadow-lg ask-pill-pulse",
          )}
          aria-haspopup="dialog"
          aria-expanded={false}
        >
          Ask about my work
        </button>
      )}
    </div>
  );
}
