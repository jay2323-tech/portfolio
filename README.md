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

Collections: case studies, articles, RAG corpus. Singletons: hero, about, lab, contact, settings.

Changes write YAML under `content/` (git diffs). After editing **RAG corpus** chunks:

```bash
npm run embed-corpus
```

That syncs `content/corpus/corpus.json` and regenerates `corpus-embeddings.json` so Ask My Work stays current.

For production editing on Vercel, set `NEXT_PUBLIC_KEYSTATIC_GITHUB_REPO=owner/repo` (see `.env.example`).

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

Next.js 15 · Tailwind 4 · TypeScript · Framer Motion · GSAP · Keystatic · local/optional OpenAI+Anthropic RAG
