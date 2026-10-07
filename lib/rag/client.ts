import type { ProjectContext } from "./page-context";
export type RetrievedMeta = { id: string; title: string; score: number; href?: string; content?: string };
export type AskTrace = { retrievalMs: number; model: string; documentVersion: string };
export type AskResult = {
  chunks: RetrievedMeta[]; answer: string; sourceIds?: string[]; unsupported?: boolean;
  model?: string | null; generationMs?: number; rateLimited?: boolean; message?: string;
};
export type AskHandlers = {
  onMeta?: (chunks: RetrievedMeta[], trace: AskTrace) => void;
  onToken?: (text: string, full: string) => void;
  onDone?: (result: AskResult) => void;
  onError?: (message: string) => void;
  signal?: AbortSignal;
  pageContext?: ProjectContext;
};

export async function askStream(query: string, context: "hero" | "widget" | "lab", handlers: AskHandlers = {}): Promise<AskResult> {
  const res = await fetch("/api/ask", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ query, context, pageContext: handlers.pageContext }), signal: handlers.signal });
  if (!res.ok || !res.body) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.message || "The request could not be completed. Please try again.");
  }
  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";
  let chunks: RetrievedMeta[] = [];
  let answer = "";
  let completed: AskResult | undefined;
  function handle(frame: string) {
    const lines = frame.split("\n");
    const event = lines.find((line) => line.startsWith("event:"))?.slice(6).trim();
    const raw = lines.filter((line) => line.startsWith("data:")).map((line) => line.slice(5).trim()).join("\n");
    if (!raw) return;
    const data = JSON.parse(raw);
    if (event === "meta") {
      chunks = data.retrievedChunks ?? [];
      handlers.onMeta?.(chunks, data);
    } else if (event === "token") {
      answer += String(data.text ?? "");
      handlers.onToken?.(String(data.text ?? ""), answer);
    } else if (event === "error") {
      throw new Error(String(data.message || "The answer could not be completed."));
    } else if (event === "done") {
      completed = { chunks, answer, sourceIds: data.sourceIds ?? [], unsupported: Boolean(data.unsupported), model: data.model ?? null, generationMs: data.generationMs };
    }
  }
  try {
    while (true) {
      const { done, value } = await reader.read();
      buffer += done ? decoder.decode() : decoder.decode(value, { stream: true });
      buffer = buffer.replace(/\r\n/g, "\n");
      let boundary;
      while ((boundary = buffer.indexOf("\n\n")) !== -1) {
        handle(buffer.slice(0, boundary));
        buffer = buffer.slice(boundary + 2);
      }
      if (done) break;
    }
    if (buffer.trim()) handle(buffer);
    if (!completed) throw new Error("The connection ended before the answer finished. Please retry.");
    handlers.onDone?.(completed);
    return completed;
  } catch (error) {
    handlers.onError?.(error instanceof Error ? error.message : "The request failed.");
    throw error;
  } finally {
    await reader.cancel().catch(() => {});
    reader.releaseLock();
  }
}

export const EXAMPLE_QUESTIONS = [
  "Who is Jayanth and what does he build?",
  "How does Jayanth approach a new project?",
  "What broke while building CompanyBrain?",
  "How does WorkBuddy handle approval and verification?",
] as const;
