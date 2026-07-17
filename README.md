# Jayanth Portfolio

Premium portfolio site proving production RAG skill — live retrieval over Jayanth's own work.

**Visual direction:** Light Lab Editorial (Studio Modular warmth + editorial reference structure).

## Dev

```bash
npm install
npm run dev
```

Open [http://localhost:2005](http://localhost:2005). Fallback: `npm run dev:alt` → 2026.

```bash
npm run embed-corpus   # after corpus / case study content changes
```

## Docs

All specs live under [`docs/`](docs/README.md):

- Planning: [`docs/planning/`](docs/planning/) — start with [`design-merged.md`](docs/planning/design-merged.md) and [`layout-merged.md`](docs/planning/layout-merged.md)
- Frontend map: [`docs/frontend/README.md`](docs/frontend/README.md)
- Backend map: [`docs/backend/README.md`](docs/backend/README.md)
- Deploy: [`docs/planning/deploy-checklist.md`](docs/planning/deploy-checklist.md)

## Deploy

```bash
npx vercel --prod
```

Set env vars from `.env.example` in the Vercel dashboard.

## Stack

Next.js 15 · Tailwind 4 · TypeScript · Framer Motion · local/optional OpenAI+Anthropic RAG
