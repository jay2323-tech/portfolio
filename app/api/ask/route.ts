import { retrieveKnowledge, KNOWLEDGE_VERSION } from "@/lib/rag/knowledge";
import { generateGroqAnswer, groqModel } from "@/lib/rag/groq";
import { getClientIp, takeRateLimitToken } from "@/lib/rag/rate-limit";

export const runtime = "nodejs";
export const maxDuration = 30;
export function GET() {
  return Response.json({ configured: Boolean(process.env.GROQ_API_KEY), model: groqModel(), documentVersion: KNOWLEDGE_VERSION }, { headers: { "Cache-Control": "no-store" } });
}

export async function POST(req: Request) {
  let query: string;
  try {
    const raw = await req.text();
    if (raw.length > 2048) return Response.json({ message: "Please keep your question under 500 characters." }, { status: 413 });
    const body = JSON.parse(raw);
    if (typeof body?.query !== "string") throw new Error();
    query = body.query.trim();
    if (!query || query.length > 500) throw new Error();
  } catch {
    return Response.json({ message: "Enter a question between 1 and 500 characters." }, { status: 400 });
  }
  const limit = takeRateLimitToken(getClientIp(req));
  if (!limit.ok) return Response.json({ message: "The question limit is reached. Please try later or email Jayanth." }, { status: 429, headers: { "Retry-After": "360" } });

  const started = performance.now();
  let chunks;
  try { chunks = retrieveKnowledge(query); }
  catch { return Response.json({ message: "The source notes could not be loaded. Please try again later." }, { status: 503 }); }
  const retrievalMs = Math.round(performance.now() - started);
  const upstream = new AbortController();
  const abort = () => upstream.abort();
  req.signal.addEventListener("abort", abort, { once: true });
  if (req.signal.aborted) abort();
  let cancelled = false;
  const stream = new ReadableStream({
    async start(controller) {
      const encoder = new TextEncoder();
      const push = (event: string, data: unknown) => {
        if (!cancelled) controller.enqueue(encoder.encode(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`));
      };
      const timer = setTimeout(abort, 22000);
      try {
        push("meta", { retrievedChunks: chunks, retrievalMs, model: groqModel(), documentVersion: KNOWLEDGE_VERSION });
        if (!chunks.length) {
          push("token", { text: "I couldn't find a relevant passage in Jayanth's public notes for that question. Try asking about his projects, skills, or how he works." });
          push("done", { sourceIds: [], unsupported: true, generationMs: 0, model: null });
        } else if (!process.env.GROQ_API_KEY) {
          push("error", { message: "The source notes are available, but live replies are not connected yet. You can inspect the retrieved passages below.", code: "not_configured" });
        } else {
          const generationStart = performance.now();
          const result = await generateGroqAnswer(query, chunks, upstream.signal);
          push("token", { text: result.answer });
          push("done", { ...result, generationMs: Math.round(performance.now() - generationStart), model: groqModel() });
        }
      } catch (error) {
        const code = upstream.signal.aborted ? "timeout" : error instanceof Error ? error.message : "provider_failed";
        const message = code === "timeout" ? "The answer took too long. Your notes are still here; please try again."
          : code === "provider_busy" ? "Groq is busy right now. Please try again shortly."
          : "The live answer could not be completed. Please retry; the source passages are still available.";
        push("error", { message });
      } finally {
        clearTimeout(timer);
        req.signal.removeEventListener("abort", abort);
        if (!cancelled) controller.close();
      }
    },
    cancel() { cancelled = true; upstream.abort(); },
  });
  return new Response(stream, { headers: { "Content-Type": "text/event-stream; charset=utf-8", "Cache-Control": "no-store, no-transform", "X-RateLimit-Remaining": String(limit.remaining) } });
}
