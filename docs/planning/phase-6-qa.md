# Phase 6 — personal retrieval notebook

## Implementation (2 October 2026)

User changed the proposed fictional retrieval experiment to a real personal demo. The canonical public source is `public/documents/jayanth-knowledge.md`, displayed at `/about/source-notes`. Edit that document and redeploy to update both the readable page and retrieval. Do not put private facts or credentials in it.

Local feature-hashed text embeddings plus keyword ranking select up to four sections. `/api/ask` calls Groq server-side, validates JSON and source IDs, then returns the answer with citations. Source-ID validation does not establish factual entailment; visitors can inspect the complete cited passages. No model request is made for no-match questions. Provider failures are explicit errors, not fallback model replies.

Model: `GROQ_MODEL` or `openai/gpt-oss-20b`. Secret: server-only `GROQ_API_KEY`. User confirms the key is already in Vercel. No local key was found or copied. Ensure environment scope includes the target deployment and redeploy after environment changes.

Official references: [Groq models](https://console.groq.com/docs/models), [OpenAI-compatible API](https://console.groq.com/docs/openai).

## Verification

- `npm run build`: production compilation, type checking and content validation pass.
- `node --import tsx --test tests/*.test.ts`: content relationships, retrieval, unknown citations, missing citations, mocked Groq request contract/provider errors, split UTF-8 SSE, premature stream termination and API missing-key/unsupported branches.
- `npm run check:case-pages`: three case studies and 60 relationships/citation links pass.
- Production UI at localhost:2005: desktop 1440px notebook/homepage; mobile390px form/sticky/source note;320px no page overflow and usable Ask dialog. Browser reset clears question/results; Escape closes the modal and restores ASK focus.
- Mobile QA found missing whitespace around hidden line breaks in sticky/source note; fixed. Narrow modal eyebrow wrapping improved.
- Local missing-key response preserves retrieved passages and clearly shows unavailable generation. No successful real model request claimed.

## Remaining release checks

1. Sign into Vercel (dashboard redirects to login in agent browser), locate this branch's new deployment and confirm the key is scoped to that environment. Never reveal its value.
2. Ask identity, process and WorkBuddy questions. Confirm answer, cited IDs, source passages and model/timings. Ask an unsupported personal detail and an ambiguous project question; check honest limitations/clarification.
3. Check Stop → new question during a real delayed request. Component aborts upstream and guards callbacks using request generation plus abort signal.
4. Emulate reduced motion. New answer entrance is enabled only under `prefers-reduced-motion: no-preference`; no looping animation was added. Physical device checks remain Phase10.

Rate limiting is process-local (10 requests/hour/IP), not a durable global serverless quota. Public deployment should retain provider spending limits. Questions and public passages go to Groq; the UI discloses this. There is no conversational memory.
