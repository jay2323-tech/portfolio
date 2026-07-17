import { retrieve } from "@/lib/rag/retrieve";
import { generateAnswerStream } from "@/lib/rag/generate";
import {
  getClientIp,
  takeRateLimitToken,
} from "@/lib/rag/rate-limit";

export const runtime = "nodejs";

const MAX_QUERY_LEN = 500;

type AskBody = {
  query?: string;
  context?: "hero" | "widget";
};

function sse(event: string, data: unknown): string {
  return `event: ${event}\ndata: ${JSON.stringify(data)}\n\n`;
}

export async function POST(req: Request) {
  let body: AskBody;
  try {
    body = (await req.json()) as AskBody;
  } catch {
    return Response.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const query = (body.query ?? "").trim();
  if (!query) {
    return Response.json({ error: "query is required" }, { status: 400 });
  }
  if (query.length > MAX_QUERY_LEN) {
    return Response.json(
      { error: `query must be ≤ ${MAX_QUERY_LEN} characters` },
      { status: 400 },
    );
  }

  const ip = getClientIp(req);
  const limit = takeRateLimitToken(ip);
  if (!limit.ok) {
    return Response.json(
      {
        error: "rate_limited",
        message:
          "You've hit the ask limit for this hour. Email hello@jayanthkrishna.dev if you want to go deeper.",
      },
      { status: 429 },
    );
  }

  let chunks;
  try {
    chunks = await retrieve(query, 4);
  } catch (err) {
    console.error(err);
    return Response.json(
      { error: "retrieval_failed", message: String(err) },
      { status: 500 },
    );
  }

  const meta = chunks.map(({ id, title, score, href }) => ({
    id,
    title,
    score,
    href,
  }));

  const stream = new ReadableStream({
    async start(controller) {
      const encoder = new TextEncoder();
      const push = (event: string, data: unknown) => {
        controller.enqueue(encoder.encode(sse(event, data)));
      };

      try {
        push("meta", {
          retrievedChunks: meta,
          context: body.context ?? "widget",
          remaining: limit.remaining,
        });

        await generateAnswerStream(query, chunks, (token) => {
          push("token", { text: token });
        });

        push("done", { ok: true });
      } catch (err) {
        console.error(err);
        push("error", { message: "generation_failed" });
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream; charset=utf-8",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
      "X-RateLimit-Remaining": String(limit.remaining),
    },
  });
}
