# Backend map

Server routes, RAG pipeline, and content embedding. No separate Node server — Next.js App Router API routes on Vercel.

## Paths

| Path | Role |
|---|---|
| `app/api/ask/route.ts` | RAG SSE endpoint |
| `app/api/contact/route.ts` | Contact form → Resend |
| `lib/rag/embed.ts` | Query / corpus embeddings |
| `lib/rag/retrieve.ts` | Hybrid lexical + dense retrieval |
| `lib/rag/prompt.ts` | System prompt |
| `lib/rag/generate.ts` | Answer generation / streaming |
| `lib/rag/rate-limit.ts` | Per-IP rate limit |
| `lib/email.ts` | Resend wrapper |
| `scripts/embed-corpus.ts` | Build-time corpus embeddings |
| `content/corpus/*` | Chunks + embeddings JSON |

## API contracts

### `POST /api/ask`

Body: `{ query: string }`

SSE events: `meta` (sources) → `token` (stream) → `done`

Rate limit: ~10 queries / IP / hour

### `POST /api/contact`

Body: `{ path: "hiring" | "project", name, email, message, ... }`

Requires `RESEND_API_KEY` and `CONTACT_TO_EMAIL`.

## Scripts

```bash
npm run embed-corpus   # after corpus or case-study content changes
```

## Env

See `.env.example` — `ANTHROPIC_API_KEY`, `OPENAI_API_KEY`, `RESEND_API_KEY`, `CONTACT_TO_EMAIL`.
