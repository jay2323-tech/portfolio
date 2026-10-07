# Jayanth Portfolio

Premium portfolio site proving production RAG skill — live retrieval over Jayanth's own work.

**Visual direction:** Light Lab Editorial (Studio Modular warmth + editorial reference structure).

## Dev

```bash
npm install
npm run dev
```

Open [http://localhost:2005](http://localhost:2005). Fallback: `npm run dev:alt` → 2026.

### CMS (Keystatic)

Edit content in the browser:

```bash
npm run dev
# → http://localhost:2005/keystatic
```

Collections include case studies, articles and experiment metadata. Changes write repository content under `content/`.

### Ask source and page context

The active Ask endpoint retrieves from `public/documents/jayanth-knowledge.md`. Edit this document, update `KNOWLEDGE_VERSION` in `lib/rag/knowledge.ts`, and redeploy. The source is displayed at `/about/source-notes`. Local feature-hashed embeddings are computed directly; the legacy `embed-corpus` script and CMS corpus collection do not update the active Ask source.

`lib/rag/page-context.ts` maps supported project, note and experiment routes to an allowlisted project ID. New related note routes should be added there. The server validates IDs, resolves implicit project references, and preserves explicit cross-project questions. It never treats page text as evidence.

Generation uses server-only `GROQ_API_KEY` and optional `GROQ_MODEL`. The key must never have a `NEXT_PUBLIC_` prefix. Local preview needs its own `.env.local` configuration; a Vercel key does not automatically exist locally.

Checks: `node --import tsx --test tests/*.test.ts`, `npm run build`, and `npm run check:case-pages`.

For production editing on Vercel, set `NEXT_PUBLIC_KEYSTATIC_GITHUB_REPO=owner/repo` (see `.env.example`).

## Docs

**Current redesign plan:** [`PLAN.md`](PLAN.md) — Jayanth’s Workbench, phase-by-phase tasks, completion gates, and the checkpoint for resuming work.

All specs live under [`docs/`](docs/README.md):

- Planning: start with [`PLAN.md`](PLAN.md); [`docs/planning/`](docs/planning/) contains supporting and historical specifications.
- Frontend map: [`docs/frontend/README.md`](docs/frontend/README.md)
- Backend map: [`docs/backend/README.md`](docs/backend/README.md)
- Deploy: [`docs/planning/deploy-checklist.md`](docs/planning/deploy-checklist.md)

## Deploy

```bash
npx vercel --prod
```

Set env vars from `.env.example` in the Vercel dashboard.

## Stack

Next.js 15 · Tailwind 4 · TypeScript · Framer Motion · GSAP · Keystatic · local retrieval + Groq generation
