"use client";

import { useEffect, useRef } from "react";
import { ChatPanel } from "./ChatPanel";
import { useAsk } from "./AskContext";

export function AskWidget() {
  const { open, closeAsk } = useAsk();
  const dialog = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    if (!open) { dialog.current?.close(); return; }
    const trigger = document.activeElement as HTMLElement | null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    dialog.current?.showModal();
    return () => {
      document.body.style.overflow = previousOverflow;
      trigger?.focus({ preventScroll: true });
    };
  }, [open]);
  return <dialog ref={dialog} data-lenis-prevent aria-label="Ask My Work" onClose={closeAsk} className="ask-modal">
    {open && <ChatPanel onClose={closeAsk} />}
  </dialog>;
}
