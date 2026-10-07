"use client";

import { usePathname } from "next/navigation";
import { AskWorkbench } from "./AskWorkbench";
import { useAsk } from "./AskContext";

export function ChatPanel({ onClose }: { onClose: () => void }) {
  const pathname = usePathname();
  const { draft } = useAsk();
  return <AskWorkbench key={pathname} variant="modal" initialQuestion={draft} onClose={onClose} />;
}
