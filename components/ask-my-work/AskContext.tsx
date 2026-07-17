"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

type AskContextValue = {
  open: boolean;
  draft: string;
  openAsk: (draft?: string) => void;
  closeAsk: () => void;
  setDraft: (draft: string) => void;
};

const AskContext = createContext<AskContextValue | null>(null);

export function AskProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState("");

  const openAsk = useCallback((nextDraft?: string) => {
    if (typeof nextDraft === "string") setDraft(nextDraft);
    setOpen(true);
  }, []);

  const closeAsk = useCallback(() => setOpen(false), []);

  const value = useMemo(
    () => ({ open, draft, openAsk, closeAsk, setDraft }),
    [open, draft, openAsk, closeAsk],
  );

  return <AskContext.Provider value={value}>{children}</AskContext.Provider>;
}

export function useAsk() {
  const ctx = useContext(AskContext);
  if (!ctx) throw new Error("useAsk must be used within AskProvider");
  return ctx;
}
