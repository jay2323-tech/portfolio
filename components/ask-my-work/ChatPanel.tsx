"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import {
  EXAMPLE_QUESTIONS,
  askStream,
  type RetrievedMeta,
} from "@/lib/rag/client";
import { SourceChips } from "./SourceChips";
import { StreamingText } from "./StreamingText";
import { useAsk } from "./AskContext";

const SESSION_SOFT_CAP = 5;

const STAGES = [
  { id: "embed", label: "embed" },
  { id: "hybrid", label: "hybrid search" },
  { id: "rerank", label: "rerank" },
  { id: "generate", label: "generate" },
] as const;

type StageId = (typeof STAGES)[number]["id"];

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

/**
 * Ask panel — SSE answer + retrieval stage chips driven by real stream events.
 */
export function ChatPanel({ onClose }: Props) {
  const { draft, setDraft } = useAsk();
  const [input, setInput] = useState(draft);
  const [messages, setMessages] = useState<Message[]>([]);
  const [busy, setBusy] = useState(false);
  const [sessionCount, setSessionCount] = useState(0);
  const [stageDone, setStageDone] = useState<Set<StageId>>(new Set());
  const [stageActive, setStageActive] = useState<StageId | null>(null);
  const [focused, setFocused] = useState(false);
  const [placeholder, setPlaceholder] = useState("Ask about the work…");
  const liveRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    if (draft) setInput(draft);
  }, [draft]);

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight });
  }, [messages, busy, stageActive]);

  useEffect(() => {
    return () => abortRef.current?.abort();
  }, []);

  const softCapped = sessionCount >= SESSION_SOFT_CAP;

  /* Idle typewriter through example questions */
  useEffect(() => {
    if (busy || focused || input || messages.length > 0) {
      setPlaceholder(
        softCapped
          ? "Session limit reached — email instead"
          : "Ask about the work…",
      );
      return;
    }

    let qi = 0;
    let ci = 0;
    let deleting = false;
    let timer = 0;

    const tick = () => {
      const full = EXAMPLE_QUESTIONS[qi % EXAMPLE_QUESTIONS.length]!;
      if (!deleting) {
        ci += 1;
        setPlaceholder(full.slice(0, ci));
        if (ci >= full.length) {
          deleting = true;
          timer = window.setTimeout(tick, 1400);
          return;
        }
        timer = window.setTimeout(tick, 28);
      } else {
        ci -= 1;
        setPlaceholder(full.slice(0, Math.max(0, ci)));
        if (ci <= 0) {
          deleting = false;
          qi += 1;
          timer = window.setTimeout(tick, 320);
          return;
        }
        timer = window.setTimeout(tick, 16);
      }
    };

    timer = window.setTimeout(tick, 600);
    return () => window.clearTimeout(timer);
  }, [busy, focused, input, messages.length, softCapped]);

  function lightStage(id: StageId) {
    setStageActive(id);
    setStageDone((prev) => {
      const next = new Set(prev);
      const idx = STAGES.findIndex((s) => s.id === id);
      for (let i = 0; i < idx; i++) next.add(STAGES[i]!.id);
      return next;
    });
  }

  function completeAllStages() {
    setStageDone(new Set(STAGES.map((s) => s.id)));
    setStageActive(null);
  }

  async function send(question: string) {
    const q = question.trim();
    if (!q || busy) return;

    if (softCapped) {
      setMessages((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          role: "assistant",
          text: "Want to go deeper? Email cvjayanth005@gmail.com — happy to talk about a role or a build.",
          rateLimited: true,
        },
      ]);
      return;
    }

    setBusy(true);
    setInput("");
    setDraft("");
    setStageDone(new Set());
    lightStage("embed");

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

    let sawToken = false;

    try {
      // Advance to hybrid once the request is in flight
      lightStage("hybrid");

      const result = await askStream(q, "widget", {
        signal: ac.signal,
        onMeta: (chunks) => {
          lightStage("rerank");
          setMessages((prev) =>
            prev.map((m) =>
              m.id === assistantId ? { ...m, chunks } : m,
            ),
          );
          // Retrieval done → generate next
          window.setTimeout(() => lightStage("generate"), 120);
        },
        onToken: (_t, full) => {
          if (!sawToken) {
            sawToken = true;
            lightStage("generate");
          }
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
      completeAllStages();
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
      setStageActive(null);
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

      {(busy || stageDone.size > 0) && (
        <div
          className="flex flex-wrap gap-1.5 border-b border-ink/8 bg-bg px-4 py-2.5"
          aria-label="Retrieval stages"
        >
          {STAGES.map((stage) => {
            const done = stageDone.has(stage.id);
            const active = stageActive === stage.id;
            return (
              <span
                key={stage.id}
                className={cn(
                  "rounded-full border px-2 py-0.5 font-mono-data text-[9px] uppercase tracking-[0.12em] transition-all duration-200",
                  done || active
                    ? "border-mint-deep/40 bg-mint/35 text-ink opacity-100"
                    : "border-ink/10 text-muted opacity-30",
                )}
              >
                {stage.label}
              </span>
            );
          })}
        </div>
      )}

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
              {m.role === "assistant" ? (
                m.text ? (
                  <StreamingText text={m.text} />
                ) : busy ? (
                  "…"
                ) : (
                  ""
                )
              ) : (
                m.text
              )}
              {m.rateLimited && (
                <a
                  href="mailto:cvjayanth005@gmail.com"
                  className="mt-2 block font-medium text-accent-clay underline-offset-2 hover:underline"
                >
                  cvjayanth005@gmail.com
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
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            placeholder={
              softCapped
                ? "Session limit reached — email instead"
                : placeholder
            }
            disabled={busy || softCapped}
            className="ask-input min-w-0 flex-1 rounded-[var(--radius-btn)] border border-ink/12 bg-bg px-3 py-2 text-sm text-ink placeholder:text-muted focus:outline-none disabled:opacity-60"
            maxLength={500}
          />
          <button
            type="submit"
            data-cursor="ask"
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
