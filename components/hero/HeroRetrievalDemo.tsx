"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import {
  EXAMPLE_QUESTIONS,
  askStream,
  type RetrievedMeta,
} from "@/lib/rag/client";
import { SourceChips } from "@/components/ask-my-work/SourceChips";
import { useAsk } from "@/components/ask-my-work/AskContext";

type Stage = "idle" | "query" | "embed" | "retrieve" | "generate" | "done";

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const onChange = () => setReduced(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);
  return reduced;
}

function useIsMobile() {
  const [mobile, setMobile] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 639px)");
    setMobile(mq.matches);
    const onChange = () => setMobile(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);
  return mobile;
}

export function HeroRetrievalDemo() {
  const { openAsk } = useAsk();
  const reduced = usePrefersReducedMotion();
  const mobile = useIsMobile();
  const [stage, setStage] = useState<Stage>("idle");
  const [exampleIdx, setExampleIdx] = useState(0);
  const [activeQuery, setActiveQuery] = useState<string>(EXAMPLE_QUESTIONS[0]);
  const [chunks, setChunks] = useState<RetrievedMeta[]>([]);
  const [answer, setAnswer] = useState("");
  const [error, setError] = useState<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);
  const ranRef = useRef(false);

  const delay = useCallback(
    (ms: number) =>
      new Promise<void>((resolve) => {
        setTimeout(resolve, reduced ? Math.min(ms, 400) : ms);
      }),
    [reduced],
  );

  const run = useCallback(
    async (question: string) => {
      abortRef.current?.abort();
      const ac = new AbortController();
      abortRef.current = ac;

      setError(null);
      setChunks([]);
      setAnswer("");
      setActiveQuery(question);
      setStage("query");
      await delay(reduced ? 400 : 500);
      if (ac.signal.aborted) return;

      setStage("embed");
      await delay(reduced ? 400 : 700);
      if (ac.signal.aborted) return;

      setStage("retrieve");

      try {
        await askStream(question, "hero", {
          signal: ac.signal,
          onMeta: (meta) => {
            setChunks(meta);
            setStage("generate");
          },
          onToken: (_t, full) => {
            setAnswer(full);
            setStage("generate");
          },
        }).then((result) => {
          if (result.rateLimited) {
            setError(result.message ?? "Rate limited");
            setStage("done");
            return;
          }
          setAnswer(result.answer);
          setChunks(result.chunks);
          setStage("done");
        });
      } catch (err) {
        if ((err as Error).name === "AbortError") return;
        setError("Could not reach /api/ask. Is the server running?");
        setStage("done");
      }
    },
    [delay, reduced],
  );

  useEffect(() => {
    if (stage !== "idle") return;
    const id = window.setInterval(() => {
      setExampleIdx((i) => (i + 1) % EXAMPLE_QUESTIONS.length);
    }, reduced ? 4000 : 3200);
    return () => window.clearInterval(id);
  }, [stage, reduced]);

  useEffect(() => {
    if (stage === "idle") {
      setActiveQuery(EXAMPLE_QUESTIONS[exampleIdx]);
    }
  }, [exampleIdx, stage]);

  useEffect(() => {
    if (mobile || ranRef.current) return;
    ranRef.current = true;
    const t = window.setTimeout(() => {
      void run(EXAMPLE_QUESTIONS[0]);
    }, reduced ? 400 : 900);
    return () => window.clearTimeout(t);
  }, [mobile, reduced, run]);

  useEffect(() => () => abortRef.current?.abort(), []);

  const running = stage !== "idle" && stage !== "done";

  return (
    <div className="paper-card w-full max-w-md shrink-0 border-mint-deep/30 p-5 md:w-[min(100%,24rem)] md:p-6">
      <div className="flex items-center justify-between gap-2">
        <p className="font-mono-data text-xs uppercase tracking-wider text-muted">
          Live retrieval
        </p>
        <span
          className={cn(
            "font-mono-data text-[10px]",
            running ? "text-accent-clay" : "text-ok-signal",
          )}
        >
          {stage === "idle" && "idle"}
          {stage === "query" && "query"}
          {stage === "embed" && "embedding…"}
          {stage === "retrieve" && "retrieving…"}
          {stage === "generate" && "generating…"}
          {stage === "done" && "done"}
        </span>
      </div>

      <p className="mt-4 font-mono-data text-xs leading-relaxed text-ink/85">
        “{activeQuery}”
      </p>

      <ol className="mt-4 space-y-2 font-mono-data text-[11px]">
        {(
          [
            ["query", "Query"],
            ["embed", "Embed"],
            ["retrieve", "Retrieve"],
            ["generate", "Generate"],
          ] as const
        ).map(([key, label]) => {
          const order = ["query", "embed", "retrieve", "generate", "done"];
          const activeIdx = order.indexOf(stage);
          const stepIdx = order.indexOf(key);
          const lit = activeIdx >= stepIdx && stage !== "idle";
          return (
            <li
              key={key}
              className={cn(
                "flex items-center gap-2 transition-opacity duration-300",
                lit ? "text-ink" : "text-muted/50",
              )}
            >
              <span
                className={cn(
                  "h-1.5 w-1.5 rounded-full",
                  lit ? "bg-accent-clay" : "bg-ink/15",
                  stage === key && !reduced && "animate-pulse",
                )}
              />
              {label}
              {stage === "embed" && key === "embed" && !reduced && (
                <span className="text-muted">···</span>
              )}
            </li>
          );
        })}
      </ol>

      {chunks.length > 0 && (
        <div className="mt-4">
          <p className="font-mono-data text-[10px] uppercase tracking-wider text-muted">
            Chunks
          </p>
          <SourceChips chunks={chunks.slice(0, 3)} />
        </div>
      )}

      {(answer || error) && (
        <div
          className={cn(
            "mt-4 max-h-36 overflow-y-auto text-sm leading-relaxed text-ink/80",
            reduced ? "opacity-100" : "animate-[fadeIn_400ms_ease-out]",
          )}
          aria-live="polite"
        >
          {error ?? answer}
        </div>
      )}

      <div className="mt-5 flex flex-wrap gap-2">
        {mobile && stage === "idle" && (
          <button
            type="button"
            className="btn-pill btn-pill-primary motion-press text-xs"
            onClick={() => void run(EXAMPLE_QUESTIONS[exampleIdx])}
          >
            Tap to run
          </button>
        )}
        {stage === "done" && (
          <>
            <button
              type="button"
              className="btn-pill btn-pill-outline motion-press text-xs"
              onClick={() =>
                void run(
                  EXAMPLE_QUESTIONS[(exampleIdx + 1) % EXAMPLE_QUESTIONS.length],
                )
              }
            >
              Run another
            </button>
            <button
              type="button"
              className="motion-press rounded-[var(--radius-btn)] border border-accent-clay/40 px-3 py-2 text-xs text-accent-clay"
              onClick={() => openAsk("")}
            >
              Continue in Ask →
            </button>
          </>
        )}
      </div>
    </div>
  );
}
