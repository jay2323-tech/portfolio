# TRD — Jayanth Portfolio Site

## 1. Stack
- **Framework**: Next.js 14+ (App Router)
- **Styling**: Tailwind CSS 4, custom `glass.css` (reused/adapted from CompanyBrain), shadcn/ui for form primitives
- **Animation**: Framer Motion (motion/react)
- **RAG widget backend**: Next.js API route / Vercel Edge Function → Anthropic API (or OpenAI, whichever he has credits for) + a lightweight vector store
- **Vector store (small corpus)**: no Qdrant needed at this scale — use a simple in-memory / JSON-embedded vector index (e.g., precomputed embeddings stored in a JSON file, cosine similarity in the edge function) to avoid infra cost and complexity
- **Deployment**: Vercel
- **Analytics**: Vercel Analytics or Plausible (privacy-friendly, lightweight)
- **Forms**: Resend or Formspree for contact form email delivery (no custom backend needed)

## 2. Architecture Overview
Static-first Next.js site with two dynamic surfaces:
1. `/api/ask` — RAG endpoint for the hero demo + Ask My Work widget
2. `/api/contact` — form submission handler

Everything else (case studies, architecture diagram, build log) is statically rendered from local content (MDX or JSON) — no CMS needed for v1, keeps 2-day timeline realistic.

```
Visitor → Next.js (static pages, ISR where useful)
                │
                ├── Hero / Ask-My-Work widget → /api/ask
                │        └── embed query → cosine similarity vs precomputed
                │            corpus embeddings → top-k chunks → LLM call
                │            with retrieved context → streamed response
                │
                └── Contact form → /api/contact → Resend → Jayanth's inbox
```

## 3. Data Model — RAG Corpus
Corpus = curated markdown/JSON chunks, NOT a live crawl. Source content:
- Resume bullet points (chunked by role/project)
- Case study content (chunked by section: problem, architecture, metrics, tradeoffs)
- Skills/architecture diagram descriptions

```ts
type CorpusChunk = {
  id: string;
  source: "resume" | "case-study" | "architecture" | "build-log";
  title: string;
  content: string;
  embedding: number[]; // precomputed at build time, not runtime
};
```

Embeddings generated **once at build time** via a script (`scripts/embed-corpus.ts`), stored as static JSON, loaded into the edge function at request time. This avoids per-request embedding cost for the corpus (only the user's query gets embedded live).

## 4. API Contracts

### `POST /api/ask`
```ts
// Request
{ query: string, context?: "hero" | "widget" }

// Response (streamed)
{
  retrievedChunks: { id: string; title: string; score: number }[],
  answer: string // streamed tokens
}
```
Must show retrieval step visibly on frontend (this is a feature, not just plumbing — see design.md "signature element").

### `POST /api/contact`
```ts
{
  type: "hiring" | "project",
  name: string,
  email: string,
  message: string,
  // hiring-specific
  company?: string, role?: string,
  // project-specific
  budget?: string, timeline?: string
}
```

## 5. Performance Requirements
- Lighthouse mobile performance ≥ 90 despite motion — enforce via:
  - `next/font` for all fonts, no runtime font loading
  - Framer Motion animations on `transform`/`opacity` only, GPU-accelerated
  - Lazy-load the architecture diagram and Ask-My-Work widget (not in critical render path)
  - Images via `next/image`, AVIF/WebP
- RAG response first-token latency target < 1.5s (streaming, not blocking)
- `prefers-reduced-motion` fully respected — provide static fallbacks for every scroll/hover animation

## 6. Accessibility Requirements
- Full keyboard navigation, visible focus states (non-negotiable per design.md)
- Color contrast AA minimum on all text
- Chat widget usable via keyboard + screen reader (proper ARIA roles for live regions on streamed responses)

## 7. Environment/Config
```
ANTHROPIC_API_KEY / OPENAI_API_KEY   # for /api/ask
RESEND_API_KEY                        # for /api/contact
NEXT_PUBLIC_SITE_URL
```

## 8. Testing Scope (lightweight, 2-day budget)
- Manual QA checklist per phase (in phase-plan.md) rather than full automated test suite
- Smoke test `/api/ask` with 5-10 known queries before launch to confirm retrieval quality
