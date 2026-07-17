import type { RetrievedChunk } from "./types";
import { buildSystemPrompt, buildUserPrompt, extractiveAnswer } from "./prompt";

export type StreamHandlers = {
  onToken: (text: string) => void;
};

async function streamAnthropic(
  query: string,
  chunks: RetrievedChunk[],
  onToken: (text: string) => void,
): Promise<void> {
  const key = process.env.ANTHROPIC_API_KEY!;
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "x-api-key": key,
      "anthropic-version": "2023-06-01",
      "content-type": "application/json",
    },
    body: JSON.stringify({
      model: "claude-sonnet-4-20250514",
      max_tokens: 700,
      stream: true,
      system: buildSystemPrompt(),
      messages: [
        { role: "user", content: buildUserPrompt(query, chunks) },
      ],
    }),
  });

  if (!res.ok || !res.body) {
    throw new Error(`Anthropic error: ${res.status} ${await res.text()}`);
  }

  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split("\n");
    buffer = lines.pop() ?? "";

    for (const line of lines) {
      if (!line.startsWith("data: ")) continue;
      const payload = line.slice(6).trim();
      if (!payload || payload === "[DONE]") continue;
      try {
        const evt = JSON.parse(payload) as {
          type?: string;
          delta?: { type?: string; text?: string };
        };
        if (
          evt.type === "content_block_delta" &&
          evt.delta?.type === "text_delta" &&
          evt.delta.text
        ) {
          onToken(evt.delta.text);
        }
      } catch {
        // skip malformed SSE lines
      }
    }
  }
}

async function streamOpenAI(
  query: string,
  chunks: RetrievedChunk[],
  onToken: (text: string) => void,
): Promise<void> {
  const key = process.env.OPENAI_API_KEY!;
  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      stream: true,
      messages: [
        { role: "system", content: buildSystemPrompt() },
        { role: "user", content: buildUserPrompt(query, chunks) },
      ],
    }),
  });

  if (!res.ok || !res.body) {
    throw new Error(`OpenAI error: ${res.status} ${await res.text()}`);
  }

  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split("\n");
    buffer = lines.pop() ?? "";

    for (const line of lines) {
      if (!line.startsWith("data: ")) continue;
      const payload = line.slice(6).trim();
      if (!payload || payload === "[DONE]") continue;
      try {
        const evt = JSON.parse(payload) as {
          choices?: { delta?: { content?: string } }[];
        };
        const token = evt.choices?.[0]?.delta?.content;
        if (token) onToken(token);
      } catch {
        // skip
      }
    }
  }
}

export async function generateAnswerStream(
  query: string,
  chunks: RetrievedChunk[],
  onToken: (text: string) => void,
): Promise<"anthropic" | "openai" | "extractive"> {
  if (process.env.ANTHROPIC_API_KEY) {
    await streamAnthropic(query, chunks, onToken);
    return "anthropic";
  }
  if (process.env.OPENAI_API_KEY) {
    await streamOpenAI(query, chunks, onToken);
    return "openai";
  }

  const text = extractiveAnswer(query, chunks);
  // Simulate light streaming for UI parity
  const words = text.split(/(\s+)/);
  for (const w of words) {
    onToken(w);
  }
  return "extractive";
}
