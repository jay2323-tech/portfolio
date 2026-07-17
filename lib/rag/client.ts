export type RetrievedMeta = {
  id: string;
  title: string;
  score: number;
  href?: string;
};

export type AskResult = {
  chunks: RetrievedMeta[];
  answer: string;
  rateLimited?: boolean;
  message?: string;
};

export type AskHandlers = {
  onMeta?: (chunks: RetrievedMeta[]) => void;
  onToken?: (text: string, full: string) => void;
  onDone?: (result: AskResult) => void;
  onError?: (message: string) => void;
  signal?: AbortSignal;
};

export async function askStream(
  query: string,
  context: "hero" | "widget",
  handlers: AskHandlers = {},
): Promise<AskResult> {
  const res = await fetch("/api/ask", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query, context }),
    signal: handlers.signal,
  });

  if (res.status === 429) {
    const data = (await res.json().catch(() => ({}))) as {
      message?: string;
    };
    const result: AskResult = {
      chunks: [],
      answer: "",
      rateLimited: true,
      message:
        data.message ??
        "You've hit the ask limit. Email hello@jayanthkrishna.dev to go deeper.",
    };
    handlers.onError?.(result.message!);
    return result;
  }

  if (!res.ok || !res.body) {
    const text = await res.text();
    throw new Error(text || `Ask failed (${res.status})`);
  }

  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";
  let eventName = "message";
  let chunks: RetrievedMeta[] = [];
  let answer = "";

  const handleData = (raw: string) => {
    if (!raw) return;
    try {
      const data = JSON.parse(raw) as Record<string, unknown>;
      if (eventName === "meta") {
        chunks = (data.retrievedChunks as RetrievedMeta[]) ?? [];
        handlers.onMeta?.(chunks);
      } else if (eventName === "token") {
        const t = String(data.text ?? "");
        answer += t;
        handlers.onToken?.(t, answer);
      } else if (eventName === "error") {
        handlers.onError?.(String(data.message ?? "error"));
      }
    } catch {
      // ignore partial JSON
    }
  };

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split("\n");
    buffer = lines.pop() ?? "";

    for (const line of lines) {
      if (line.startsWith("event:")) {
        eventName = line.slice(6).trim();
      } else if (line.startsWith("data:")) {
        handleData(line.slice(5).trim());
      } else if (line.trim() === "") {
        eventName = "message";
      }
    }
  }

  const result: AskResult = { chunks, answer };
  handlers.onDone?.(result);
  return result;
}

export const EXAMPLE_QUESTIONS = [
  "What's the architecture of CompanyBrain?",
  "Has anything he built shipped to real users?",
  "What is DesiFit and how does DPDP affect it?",
  "How does Jayanth work with freelance clients?",
] as const;
