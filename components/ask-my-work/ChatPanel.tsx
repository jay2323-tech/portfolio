"use client";

import { AskWorkbench } from "./AskWorkbench";
import { useAsk } from "./AskContext";

export function ChatPanel({ onClose }: { onClose: () => void }) {
  const { draft } = useAsk();
  return <AskWorkbench variant="modal" initialQuestion={draft} onClose={onClose} />;
}
