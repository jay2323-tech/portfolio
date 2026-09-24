# Field Notes implementation QA — 2026-09-24

## Scope and source

Selected reference: `docs/planning/visual-targets/2026-09-23/03-field-notes.png`. Implemented in the existing Next.js homepage, preserving paper, sky-blue folio, clay accent, oversized statement, portrait, and annotated architecture. User subsequently approved the three-project scroll deck.

## Visual comparison

Inspected source/build side by side in `docs/planning/phase-3-qa/reference-comparison.png`. Main hierarchy, palette, two-column composition, project actions and illustrated retrieval path match the selected direction. Intentional changes: authored project summary, chapter navigation replacing two rows, three full project sheets, and an actual portrait crop. Minor aesthetic differences: serif italic annotations, less paper texture, no tape accent. These do not block the approved interaction.

## Verified

- Desktop 1487×1058: forward/reverse transitions and chapter jumps; distinct Factory/Desi content and actions.
- Laptop 1280×720: settled DesiFit card and both actions fit above chapter controls.
- Mobile 390×844: enhancement removed, all three sheets exposed, zero horizontal overflow; Factory content readable. Earlier shell QA also covered 320px and tablet.
- Stage resizing fixed clipping after layout/font changes.
- Native inspectors: desktop/mobile, Escape and focus return checked during shell QA. Ask is a single dialog.
- No captured browser errors in final desktop check.
- Reduced-motion and no-JS behavior reviewed in code: default visible server-rendered cards, animation only with no-preference and sufficient space. Actual OS preference emulation and physical-device checks remain Phase 10.

## Evidence

Latest captures: `deck-desktop-home.png`, `deck-factory.png`, `deck-desifit.png`, `deck-laptop.png`, `deck-mobile.png`, and `reference-comparison.png` in `docs/planning/phase-3-qa/`. Older files document shell QA and intermediate iterations.

## Remaining scope

Phase 4 lower homepage sections; deeper evidence/case studies and runnable experiments in later phases. Existing missing social URLs/resume/outcome evidence remain content inventory items. No fabricated live traces or performance outcomes added.
