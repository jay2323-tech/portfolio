# Phase 2 verification — 2026-09-23

Scope: content/CMS migration, route foundations, and required navigation repairs. This is not a fidelity sign-off for the selected homepage; that implementation starts in Phase 3.

## Checks

- `npm run test:content`: 4 passed. Covers migrated relationships and preserved anchors; hidden planned experiments/unknown slugs; rejected dangling references; CMS status cannot publish an unimplemented demo.
- `npx tsc --noEmit`: passed.
- `npm run build`: passed after final navigation change, including content validation, lint and type checks; 19 static pages generated. Three pre-existing `no-img-element` warnings remain in Sticker/HeroCollage.
- `npm run lint`: passed with those same warnings; Next 15 warns its lint subcommand is deprecated.
- `git diff --check`: passed.
- HTTP: 200 `/notes`, `/notes/2026-07-10-companybrain`, `/lab`, `/colophon`, `/work/company-brain`; 404 `/notes/not-a-note`, `/lab/retrieval-challenge`, `/lab/not-an-experiment`.

## Browser evidence

| Evidence | Size/state | Observation |
|---|---|---|
| [Notes desktop](notes-desktop.png) | 1440×1024 | Clear hierarchy and ruled links; document width equals viewport |
| [Notes mobile](notes-mobile.png) | 390×844 | Natural wraps, full-row links, readable summaries |
| [Notes narrow](notes-320.png) | 320×740 | No horizontal overflow; shared floating Ask can overlap scrolling content |
| [Note detail](note-mobile.png) | 390×844 | Original short note readable; related CompanyBrain link visible; no planned demo link; no overflow |
| [Lab empty state](lab-mobile.png) | 424×844 | Truthful no-demo state and working reading destinations |
| [Colophon](colophon-mobile.png) | 390×844 | Readable single-column body; no overflow |
| [Homepage section return](home-article-anchor.png) | 390×844 | Repaired cross-route hash alignment; section top measured 79.82px, below 64px header |

Notes row → detail and homepage article → note navigation were exercised. Mobile menu opens; Escape returns focus to its trigger. Unknown note and planned experiment visibly render 404. Captured browser error logs were empty before expected 404 visits. Build success is separate from these browser checks; screenshots were taken against the development server.

## Fix discovered during QA

Qualified header links alone reached the homepage but missed the requested section because animated work pinning changed the layout after the initial hash scroll. Added `AnchorNavigation` to align against the final section position on font readiness and ScrollTrigger refresh. It uses immediate movement and relinquishes alignment on user input. Switched header links to Next Link. Retested note → homepage writing: correct URL, closed menu, section below header.

## Limits and next verification

- No new entrance animation on editorial pages; all new content is server rendered. Actual reduced-motion emulation and whole-site motion audit remain required.
- The inherited floating Ask/HUD can overlap content at narrow sizes; address placement/minimization in Phase 3 shared-shell work. Content remains scrollable.
- This does not approve current homepage fidelity against option 3. The selected Field Notes hero, source art, X-ray and final shared header are not implemented yet.
- No live demos, external contact submissions, CMS writes through the UI, deployment, or physical-device tests were performed.
