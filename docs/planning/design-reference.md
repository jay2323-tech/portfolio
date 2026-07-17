# Design — Editorial reference layout × Light Lab palette

Colors: keep current light tokens (`design-merged.md`). Structure/components: match the reference layout exactly.

## Section map

| Reference | Ours | Component |
|---|---|---|
| Top bar + MENU + GET IN TOUCH | Nav | `components/nav/Nav.tsx` |
| SCRL / CRSR HUD | Dual HUD | `components/chrome/ScrollHud.tsx` |
| Intro (name stack + meta) | Hero | `components/hero/Hero.tsx` |
| Companies marquee | Tools / orgs | `components/chrome/LogoMarquee.tsx` |
| 01 FEATURED WORK | Case studies | `components/case-studies/*` |
| 02 RECENT ARTICLES | Build log as articles | `components/articles/ArticlesSection.tsx` |
| 03 EXPERIMENT LAB | Lab + Ask + open experiments | `components/lab/LabSection.tsx` |
| 04 ABOUT ME | About full | `components/about/AboutSection.tsx` |
| 05 LET'S TALK | Contact | `components/contact/*` |
| Footer | Footer | `components/Footer.tsx` |

## UI patterns to replicate

1. **Numbered section headers** — `01` + looping marquee title (`FEATUREDWORK`)
2. **Meta rows** — mono uppercase tracking (`10+ YEARS…`, `BASED IN…`)
3. **Project cards** — domain · year · title · blurb · 3 big metrics
4. **Article rows** — `001` · date · PART · read time · title · READ →
5. **Lab cards** — index · tech tags · title · blurb · GITHUB →
6. **About blocks** — experience list, study, foundations 01–04, competencies, toolkit grid
7. **Contact** — EMAIL / LINKEDIN / GITHUB rows + NAME/EMAIL/MESSAGE form
8. **HUD** — `SCRL 0.00` + `CRSR 0.00` (light muted mono)

## Keep (do not remove)

- Ask My Work widget (Nav ASK) + Lab retrieval story
- `HeroRetrievalDemo.tsx` kept for Lab / future embed (not in hero first viewport)
- `/api/ask`, `/api/contact`
- Case study MDX routes `/work/[slug]`

## Drop / demote

- Studio Modular soft color-block cards as primary pattern
- SplitHeadline "retrieval → production" band (optional later)
- Soft paper-card-only look where the reference uses denser list/metric layouts
- Side RAG panel in hero (removed — pure editorial type composition)

## Hero component inventory (exact reference intro)

| Piece | File |
|---|---|
| Role / domain marquees | `components/hero/HeroRoleMarquee.tsx` |
| Giant name + ghost | `components/hero/HeroName.tsx` |
| Meta rows | `components/hero/HeroMeta.tsx` |
| Scroll cue | `components/hero/HeroScrollCue.tsx` |
| Compose | `components/hero/Hero.tsx` |
| HUD SCRL/CRSR/INTRO | `components/chrome/ScrollHud.tsx` |
| Tools strip after fold | `components/chrome/LogoMarquee.tsx` |
