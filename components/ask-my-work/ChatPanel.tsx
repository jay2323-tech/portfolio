"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import {
  EXAMPLE_QUESTIONS,
  askStream,
  type RetrievedMeta,
} from "@/lib/rag/client";
import { SourceChips } from "./SourceChips";
import { useAsk } from "./AskContext";

const SESSION_SOFT_CAP = 5;

type Message = {
  id: string;
  role: "user" | "assistant";
  text: string;
  chunks?: RetrievedMeta[];
  rateLimited?: boolean;
};

type Props = {
  onClose: () => void;
};

export function ChatPanel({ onClose }: Props) {
  const { draft, setDraft } = useAsk();
  const [input, setInput] = useState(draft);
  const [messages, setMessages] = useState<Message[]>([]);
  const [busy, setBusy] = useState(false);
  const [sessionCount, setSessionCount] = useState(0);
  const liveRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    if (draft) setInput(draft);
  }, [draft]);

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight });
  }, [messages, busy]);

  useEffect(() => {
    return () => abortRef.current?.abort();
  }, []);

  const softCapped = sessionCount >= SESSION_SOFT_CAP;

  async function send(question: string) {
    const q = question.trim();
    if (!q || busy) return;

    if (softCapped) {
      setMessages((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          role: "assistant",
          text: "Want to go deeper? Email hello@jayanthkrishna.dev — happy to talk about a role or a build.",
          rateLimited: true,
        },
      ]);
      return;
    }

    setBusy(true);
    setInput("");
    setDraft("");
    const userMsg: Message = {
      id: crypto.randomUUID(),
      role: "user",
      text: q,
    };
    const assistantId = crypto.randomUUID();
    setMessages((prev) => [
      ...prev,
      userMsg,
      { id: assistantId, role: "assistant", text: "", chunks: [] },
    ]);

    abortRef.current?.abort();
    const ac = new AbortController();
    abortRef.current = ac;

    try {
      const result = await askStream(q, "widget", {
        signal: ac.signal,
        onMeta: (chunks) => {
          setMessages((prev) =>
            prev.map((m) =>
              m.id === assistantId ? { ...m, chunks } : m,
            ),
          );
        },
        onToken: (_t, full) => {
          setMessages((prev) =>
            prev.map((m) =>
              m.id === assistantId ? { ...m, text: full } : m,
            ),
          );
        },
      });

      if (result.rateLimited) {
        setMessages((prev) =>
          prev.map((m) =>
            m.id === assistantId
              ? {
                  ...m,
                  text: result.message ?? m.text,
                  rateLimited: true,
                  chunks: [],
                }
              : m,
          ),
        );
      } else {
        setSessionCount((c) => c + 1);
      }
    } catch (err) {
      if ((err as Error).name === "AbortError") return;
      setMessages((prev) =>
        prev.map((m) =>
          m.id === assistantId
            ? {
                ...m,
                text: "Something went wrong reaching the retrieval API. Try again in a moment.",
              }
            : m,
        ),
      );
    } finally {
      setBusy(false);
    }
  }

  return (
    <div
      id="ask"
      className={cn(
        "paper-card flex h-[min(70dvh,560px)] w-full flex-col overflow-hidden md:h-[520px] md:w-[380px]",
        "border-accent-clay/25 text-ink shadow-2xl",
      )}
      role="dialog"
      aria-label="Ask My Work"
    >
      <header className="flex items-center justify-between border-b border-ink/8 bg-surface px-4 py-3">
        <div>
          <p className="font-mono-data text-[10px] uppercase tracking-wider text-accent-clay">
            Ask My Work
          </p>
          <p className="text-sm text-ink">RAG over the portfolio corpus</p>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="font-mono-data rounded-[var(--radius-btn)] border border-ink/12 px-2 py-1 text-xs text-muted hover:text-ink"
          aria-label="Close ask panel"
        >
          Esc
        </button>
      </header>

      <div
        ref={listRef}
        className="flex-1 space-y-4 overflow-y-auto bg-bg px-4 py-4"
      >
        {messages.length === 0 && (
          <div>
            <p className="text-sm text-muted">Try a real question:</p>
            <ul className="mt-3 space-y-2">
              {EXAMPLE_QUESTIONS.map((q) => (
                <li key={q}>
                  <button
                    type="button"
                    className="w-full rounded-[var(--radius-btn)] border border-ink/10 bg-surface px-3 py-2 text-left text-xs text-ink transition-colors hover:border-accent-clay/50 hover:text-accent-clay"
                    onClick={() => send(q)}
                  >
                    {q}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}

        {messages.map((m) => (
          <div
            key={m.id}
            className={cn(
              "max-w-[95%]",
              m.role === "user" ? "ml-auto" : "mr-auto",
            )}
          >
            <div
              className={cn(
                "rounded-[var(--radius-card)] px-3 py-2 text-sm leading-relaxed",
                m.role === "user"
                  ? "bg-accent-clay text-white"
                  : "border border-ink/8 bg-surface text-ink",
              )}
            >
              {m.text || (busy ? "…" : "")}
              {m.rateLimited && (
                <a
                  href="mailto:hello@jayanthkrishna.dev"
                  className="mt-2 block font-medium text-accent-clay underline-offset-2 hover:underline"
                >
                  hello@jayanthkrishna.dev
                </a>
              )}
            </div>
            {m.role === "assistant" && m.chunks && (
              <SourceChips chunks={m.chunks} />
            )}
          </div>
        ))}

        <div
          ref={liveRef}
          className="sr-only"
          aria-live="polite"
          aria-atomic="false"
        >
          {messages.filter((m) => m.role === "assistant").at(-1)?.text}
        </div>
      </div>

      <form
        className="border-t border-ink/8 bg-surface p-3"
        onSubmit={(e) => {
          e.preventDefault();
          void send(input);
        }}
      >
        <div className="flex gap-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={
              softCapped
                ? "Session limit reached — email instead"
                : "Ask about the work…"
            }
            disabled={busy || softCapped}
            className="min-w-0 flex-1 rounded-[var(--radius-btn)] border border-ink/12 bg-bg px-3 py-2 text-sm text-ink placeholder:text-muted focus:border-accent-clay/50 focus:outline-none"
            maxLength={500}
          />
          <button
            type="submit"
            disabled={busy || softCapped || !input.trim()}
            className="btn-pill btn-pill-primary motion-press disabled:opacity-40"
          >
            Ask
          </button>
        </div>
        <p className="font-mono-data mt-2 text-[10px] text-muted">
          {sessionCount}/{SESSION_SOFT_CAP} this session
        </p>
      </form>
    </div>
  );
}
