# Jayanth Portfolio

A personal portfolio built with Next.js, TypeScript, and React. It presents project case studies, implementation notes, and an interactive assistant that retrieves information from a local portfolio corpus.

## Features

- Project case-study pages authored in MDX.
- A retrieval-backed question interface with source references and streamed responses.
- Build-log content and a contact form.
- Motion and interface components using Framer Motion, GSAP, and Tailwind CSS.

## Run locally

```bash
git clone --branch First-Build https://github.com/jay2323-tech/portfolio.git
cd portfolio
npm ci
cp .env.example .env.local
npm run dev
```

Open http://localhost:2005. If the port is occupied, `npm run dev:alt` starts on port 2026. Use a Node.js version compatible with Next.js 15.

## Configuration

| Variable | Purpose |
| --- | --- |
| `OPENAI_API_KEY` | Optional model and embedding integration |
| `ANTHROPIC_API_KEY` | Optional answer generation |
| `RESEND_API_KEY` | Contact email delivery |
| `CONTACT_TO_EMAIL` | Destination for contact messages |
| `NEXT_PUBLIC_SITE_URL` | Public application origin |

See `.env.example` and `lib/rag/` for fallback behavior when model credentials are absent. Without email configuration, a successful local request should not be treated as proof of message delivery.

## Content and architecture

| Path | Purpose |
| --- | --- |
| `content/case-studies/` | MDX project narratives |
| `content/corpus/` | Retrieval corpus and generated embeddings |
| `content/build-log/` | Build-log entries |
| `app/api/ask/route.ts` | Question-answering endpoint |
| `app/api/contact/route.ts` | Contact endpoint |
| `lib/rag/` | Embedding, retrieval, prompting, and generation |
| `components/` | Page sections and interface components |

When updating the retrieval corpus, review `scripts/embed-corpus.ts` and regenerate embeddings with `npm run embed-corpus` using the intended provider configuration.

## Build and review

```bash
npm run build
npm start
```

Review desktop and mobile layouts, case-study links, keyboard navigation, and reduced-motion behavior. Ask the portfolio assistant a question with a known source and inspect its references. Test contact delivery separately with configured email credentials.

## Documentation and deployment

Start with the [documentation index](docs/README.md), [frontend map](docs/frontend/README.md), and [backend map](docs/backend/README.md). The [deployment checklist](docs/planning/deploy-checklist.md) describes the Vercel workflow.

Project descriptions and case studies should be kept in sync with their source repositories. This site is a portfolio demonstration; its existence does not establish production usage or benchmark results for the projects it describes.
