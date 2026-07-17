# Deploy checklist (M-9)

## Local smoke (done)

- [x] Home `GET /` → 200, light Lab Editorial sections present
- [x] `POST /api/ask` → SSE meta + tokens
- [x] `POST /api/contact` → `{ ok: true }` (logs when Resend unset)
- [x] `GET /work/company-brain` → 200
- [x] TypeScript `tsc --noEmit` clean

## Vercel

```bash
npx vercel          # link project
npx vercel --prod   # production
```

Set in Vercel dashboard:

- `ANTHROPIC_API_KEY` (optional)
- `OPENAI_API_KEY` (optional)
- `RESEND_API_KEY`
- `CONTACT_TO_EMAIL`
- `NEXT_PUBLIC_SITE_URL`

## A11y quick pass

- Keyboard: Tab through nav → Ask CTA → case cards → Ask panel Esc
- Color blocks: blush/sky/butter with ink text (contrast OK on paper)
- `prefers-reduced-motion`: marquees and Reveal disable

## Assets

Replace placeholders in `public/images/editorial/` and `public/images/work/` with final photos when ready.
