# Architecture — Jayanth Portfolio Site

## 1. High-Level System
```
┌─────────────────────────────────────────────────────────┐
│                     Next.js App (Vercel)                  │
│                                                             │
│  Static/ISR pages          Dynamic API routes              │
│  ─────────────────         ────────────────────            │
│  / (home, all sections)    /api/ask   (RAG endpoint)        │
│  /work/[slug] (optional    /api/contact (form handler)      │
│   if case studies get                                        │
│   their own routes)                                          │
│                                                             │
│  Content source: local MDX/JSON (no external CMS in v1)    │
└─────────────────────────────────────────────────────────┘
            │                              │
            ▼                              ▼
   Static corpus embeddings         Resend (email delivery)
   (precomputed, JSON file,
   loaded by /api/ask)
            │
            ▼
   Anthropic/OpenAI API
   (query embedding + generation)
```

## 2. Folder Structure & FE/BE map

Docs live under `/docs` (see `docs/README.md`). Code stays at Next.js roots — do not nest `app/` under `frontend/`.

| Layer | Paths | Responsibility |
|---|---|---|
| **Frontend** | `app/page.tsx`, `app/work/*`, `app/layout.tsx`, `components/**`, `styles/**`, `public/**`, `lib/rag/client.ts`, `lib/case-studies/*`, `lib/utils.ts` | UI, motion, light theme, Ask/Hero surfaces |
| **Backend** | `app/api/**`, `lib/rag/*` (except `client.ts`), `lib/email.ts`, `scripts/embed-corpus.ts`, `content/corpus/*` | RAG, streaming, rate limits, contact email |
| **Shared** | `content/case-studies/*`, `content/build-log/*` | MDX + JSON content |

```
/app
  /page.tsx                 → home (merged section compose)
  /work/[slug]/page.tsx      → case study detail
  /api/ask/route.ts          → RAG endpoint
  /api/contact/route.ts      → contact form handler
/components
  /chrome/                   → ScrollHud, MarqueeText, LogoMarquee, SplitHeadline
  /hero/
  /ask-my-work/
  /case-studies/
  /lab/
  /about/
  /architecture-diagram/
  /build-log/
  /contact/
  /nav/
/content
  /case-studies/*.mdx
  /build-log/entries.json
  /corpus/corpus.json + corpus-embeddings.json
/scripts/embed-corpus.ts
/lib/rag/* + /lib/email.ts + /lib/case-studies/*
/styles/tokens.css + glass.css
/docs/planning|frontend|backend
```

Primary design: `docs/planning/design-merged.md`. Legacy dark tokens in `design.md` are superseded.

## 3. RAG Pipeline Detail (`/api/ask`)
1. Receive `{ query }` from client.
2. Embed `query` via API call (single embedding call, cheap/fast).
3. Load `corpus-embeddings.json` (small, in-memory, no DB round trip needed at this corpus size).
4. Compute cosine similarity, take top-k (k=3-4).
5. Construct prompt: system instructions (answer as/about Jayanth, cite sources) + retrieved chunks + user query.
6. Stream generation back to client via `ReadableStream` / Vercel AI SDK.
7. Return retrieved chunk metadata (id, title, score) alongside the stream so the frontend can render the "retrieval trace" (see spec-sheet.md §1-2).

This intentionally avoids Qdrant/a real vector DB — at a corpus of a few dozen chunks, brute-force cosine similarity in a serverless function is faster to build, free to run, and sufficient. Revisit only if the corpus grows into the thousands.

## 4. Content Update Flow
Adding a new case study or build-log entry:
1. Write MDX/JSON content.
2. Re-run `scripts/embed-corpus.ts` to regenerate `corpus-embeddings.json` (chunks the new content, calls embedding API, writes JSON).
3. Redeploy (Vercel auto-deploys on push).

No live database, no admin panel — deliberate simplicity for a 2-day build and a portfolio-scale content volume.

## 5. Deployment
- Vercel project connected to GitHub repo, auto-deploy on `main` push.
- Environment variables set in Vercel dashboard (see trd.md §7).
- Preview deployments for every PR/branch — useful given the phased plan below, each phase can be reviewed live before merging.

## 6. Security/Abuse Considerations for `/api/ask`
- Basic rate limiting (per-IP, e.g. via Vercel Edge Config or a simple in-memory token bucket) to prevent API cost abuse.
- Input length cap on queries.
- System prompt explicitly scopes the assistant to answering questions about Jayanth's work — refuses off-topic requests gracefully rather than becoming a general chatbot.
