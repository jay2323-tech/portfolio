"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { CaseStudy } from "@/lib/case-studies/types";

export type RecedePayload = {
  /** Stable id for the open overlay (e.g. work slug, "settings") */
  id: string;
  /** Featured-work preview payload */
  study?: CaseStudy;
};

type RecedeContextValue = {
  isReceded: boolean;
  payload: RecedePayload | null;
  open: (payload: RecedePayload) => void;
  close: () => void;
};

const RecedeContext = createContext<RecedeContextValue | null>(null);

/**
 * App-wide recede state. Any modal/panel that should push content “back”
 * calls `open()` / `close()`. ScaleBlurLayer reads `isReceded`.
 */
export function RecedeProvider({ children }: { children: ReactNode }) {
  const [payload, setPayload] = useState<RecedePayload | null>(null);

  const open = useCallback((next: RecedePayload) => {
    setPayload(next);
  }, []);

  const close = useCallback(() => {
    setPayload(null);
  }, []);

  const value = useMemo(
    () => ({
      isReceded: payload !== null,
      payload,
      open,
      close,
    }),
    [payload, open, close],
  );

  return (
    <RecedeContext.Provider value={value}>{children}</RecedeContext.Provider>
  );
}

export function useReceded() {
  const ctx = useContext(RecedeContext);
  if (!ctx) {
    throw new Error("useReceded must be used within RecedeProvider");
  }
  return ctx;
}
