# Design System — Jayanth Portfolio Site

## 1. Design Thesis
This is not a generic "AI portfolio" (dark mode + neon gradient + floating particles). The visual language is **control-room / lab-notebook**: the aesthetic of the thing he actually builds — retrieval, embeddings, structured data, pipelines — rendered with restraint and precision, not sci-fi decoration.

Signature element: a subtle vector-field / node-graph texture that responds to cursor and scroll, used exactly once (in the hero, tied to the live retrieval demo) — not scattered across every section as ambient decoration.

## 2. Color Tokens
| Token | Hex | Use |
|---|---|---|
| `--ink-950` | `#0B1120` | Primary dark background |
| `--ink-800` | `#151E31` | Secondary surface / cards on dark |
| `--paper-50` | `#F5F3EE` | Light background / body copy sections |
| `--paper-100` | `#EDEAE2` | Light surface / cards on light |
| `--accent-clay` | `#C77D3C` | Single accent — CTAs, highlights, retrieval-trace lines. Used sparingly. |
| `--ok-signal` | `#5FA88F` | Success/metrics/"live" indicators (muted teal, not neon green) |
| `--text-muted` | `#8A93A6` | Captions, metadata, timestamps |

Rule: **one accent color only** (`--accent-clay`). No secondary gradient accents. Gradients, where used (hero glass cards, matching the CompanyBrain aesthetic he's already built), are ink-to-ink or paper-to-paper tonal shifts, not rainbow.

## 3. Typography
- **Display**: A confident grotesk or slab with character — e.g. `Fraunces` (variable, for headline warmth) or `General Sans` if a cleaner grotesk is preferred. Used at large sizes, tight tracking, restraint in count of weights (2 max).
- **Body**: `Inter` or `Geist` — neutral, highly legible, used at 16-18px base.
- **Mono/Data**: `JetBrains Mono` or `Geist Mono` — for metrics, timestamps, retrieval scores, code snippets, architecture labels. This is what signals "engineer" — data-looking things should look like data.

Type scale (rem, 1rem = 16px):
```
--text-xs: 0.75    (mono, captions)
--text-sm: 0.875
--text-base: 1
--text-lg: 1.25
--text-xl: 1.75
--text-2xl: 2.5
--text-3xl: 3.5    (hero headline)
```

## 4. Spacing & Grid
- 8px base unit, standard Tailwind scale.
- Max content width: 1200px, generous side padding (min 24px mobile, 64px+ desktop).
- Section vertical rhythm: 96-140px between major sections desktop, 64px mobile — this is a premium/editorial site, whitespace is a feature.

## 5. Glass / Surface Treatment (reused from CompanyBrain)
- Frosted glass cards: `backdrop-filter: blur(20px)`, subtle border (`1px solid rgba(255,255,255,0.08)` on dark, `rgba(0,0,0,0.06)` on light).
- Grain texture overlay: subtle noise SVG at low opacity (3-5%) over gradient hero areas only — not global, keeps it premium instead of gimmicky.
- Border radius: consistent `16px` for cards, `12px` for buttons/inputs, `24px` for hero containment — pick one scale and hold it everywhere.

## 6. Motion Principles
- One orchestrated moment per page load (hero sequence), not scattered effects everywhere.
- Scroll-triggered reveals: fade + 12px translate-Y, staggered by 60-80ms per element, never more.
- Hover micro-interactions on cards/buttons: scale 1.02 + shadow lift, 150-200ms ease-out.
- The retrieval-trace animation (query → embed → retrieve → generate) in the hero is the one "big" animation — everything else stays quiet by comparison.
- **Mandatory**: `prefers-reduced-motion: reduce` disables all non-essential motion — provide instant-state fallbacks, not just faster durations.

## 7. Iconography & Diagrams
- No stock icon packs used decoratively. Icons used functionally only (nav, form states).
- Architecture diagram uses custom SVG nodes/edges styled with the same ink/paper/clay palette — not a generic draw.io export look.

## 8. Structural Devices
- Numbering (01/02/03) used **only** where sequence is real: the Process section (an actual ordered workflow). Not used on case studies or skills, since those aren't sequences — avoid the templated-AI tell.
- Eyebrow labels (small mono-caps text above headings) used to add context ("CASE STUDY — 03 MONTHS IN PRODUCTION"), not decoration.

## 9. Self-Critique Checklist (apply before shipping any section)
- [ ] Would this section look identical if it were for a different person's portfolio? If yes, revise.
- [ ] Is every animation justified, or just "because Framer Motion is available"?
- [ ] Does data (metrics, timestamps) look like data (mono font, precise numbers), not marketing copy?
- [ ] Keyboard-only pass: can every interactive element be reached and used?


> **Superseded** by [`design-merged.md`](design-merged.md). Kept for historical reference.
