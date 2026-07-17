# Frontend map

UI, motion, and light theme. Does not own RAG retrieval logic.

## Paths

| Path | Role |
|---|---|
| `app/page.tsx`, `app/work/[slug]/page.tsx`, `app/layout.tsx` | Pages + shell |
| `components/**` | Section and chrome UI |
| `styles/tokens.css`, `styles/glass.css` | Design tokens + light surfaces |
| `lib/rag/client.ts` | SSE client for `/api/ask` |
| `lib/case-studies/*` | MDX readers (RSC) |
| `lib/utils.ts` | `cn()` helpers |
| `public/images/**` | Editorial + work covers |

## Components (merged layout)

```
components/
├── chrome/          # ScrollHud, MarqueeText, SectionIndex, LogoMarquee, SplitHeadline
├── hero/            # Hero, HeroRetrievalDemo
├── case-studies/    # Featured Work grid + detail
├── lab/             # LabSection
├── about/           # AboutSection
├── build-log/       # Insight color cards
├── contact/         # ContactSection, ContactForm
├── ask-my-work/     # AskWidget, ChatPanel, AskContext
├── architecture-diagram/
├── nav/
└── Footer.tsx
```

## Design source of truth

See [../planning/design-merged.md](../planning/design-merged.md) and [../planning/layout-merged.md](../planning/layout-merged.md).

## Motion rules

- One orchestrated moment: hero retrieval demo
- Scroll reveals: fade + 12px translate-Y, stagger 60–80ms
- Marquees pause on hover
- `prefers-reduced-motion: reduce` disables non-essential motion
