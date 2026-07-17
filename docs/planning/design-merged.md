# Design System — Light Lab Editorial (primary)

Merges Studio Modular warmth with editorial reference structure. Supersedes `design.md` (dark theme).

## Thesis

Bright workshop: paper-white canvas, big type, soft color blocks, subtle HUD chrome. RAG demo stays the differentiator.

## Color tokens

| Token | Hex | Use |
|---|---|---|
| `--bg` | `#FAFAF8` | Page background |
| `--surface` | `#FFFFFF` | Cards |
| `--ink` | `#141414` | Headlines, body |
| `--muted` | `#6B7280` | Captions, HUD |
| `--mint` | `#C3FFFC` | Playful wash |
| `--mint-deep` | `#5ECFC9` | Links, hover |
| `--clay` / `--accent-clay` | `#C77D3C` | Primary CTA |
| `--ok-signal` | `#5FA88F` | Live / success |
| `--blush` | `#F4E4E0` | Build-log card |
| `--sky` | `#E3EDF5` | Build-log / Lab tint |
| `--butter` | `#FFF4D6` | Highlight card |

Rule: 80% neutral paper, 15% soft tints, 5% mint/clay punch.

Legacy aliases kept for compatibility: `--ink-950`, `--paper-50`, `--text-muted`, etc. map into the light system.

## Typography

- Display: Fraunces — hero `clamp(3rem, 8vw, 6rem)`, section H2 `clamp(2rem, 4vw, 3.5rem)`
- Body: Geist — 18px base, line-height 1.65
- Mono: Geist Mono — metrics, section indices, HUD, RAG labels

## Surfaces

- Paper cards: white, soft shadow, 1px ink/6% border
- Color blocks: blush / sky / butter backgrounds for insights
- Minimal glass: light frosted panels for Ask widget only

## Motion

- Section scroll reveals (Framer Motion)
- Marquee headers (pause on hover)
- Scroll HUD: `SCRL 0.00`
- All gated by `prefers-reduced-motion`

## Radii & spacing

- Buttons: 999px (pill) or 12px
- Cards: 16px
- Content max: 1400px
- Section gap: 120–160px desktop, 80px mobile
