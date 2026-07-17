# Phase-Wise Build Plan (for Cursor execution)

Reference docs for every phase: `prd.md`, `trd.md`, `design.md`, `spec-sheet.md`, `layout.md`, `architecture.md`. Cursor should read all six before starting Phase 0.

Target: working, deployable site. Timeline assumes focused solo execution; phases are ordered so you have a shippable (if incomplete) site after every phase — never a broken half-state.

---

## Phase 0 — Setup & Foundation
**Goal**: project scaffolding, design tokens wired, nothing broken.
- [ ] Init Next.js 14 App Router project, Tailwind 4, shadcn/ui
- [ ] Port/adapt `glass.css` from CompanyBrain into `/styles/glass.css`
- [ ] Create `/styles/tokens.css` from `design.md` §2-3 (colors, type scale)
- [ ] Set up `next/font` for display, body, and mono typefaces
- [ ] Build `Nav.tsx` (static first, scroll-aware behavior added in Phase 4)
- [ ] Set up folder structure exactly per `architecture.md` §2
- [ ] Deploy empty shell to Vercel — confirm pipeline works end to end
**Exit criteria**: blank styled page live on a Vercel URL, fonts/colors correct, nav renders.

---

## Phase 1 — Static Content Sections (no RAG yet)
**Goal**: every non-AI section built and content-complete, site is fully scrollable and readable.
- [ ] Hero section — static version first (headline, CTA, placeholder where retrieval demo will go)
- [ ] Case study MDX content written for 3 projects (CompanyBrain, Factory Attendance, one more) per `spec-sheet.md` §3 structure
- [ ] `CaseStudyCard.tsx` + `CaseStudyDetail.tsx` built and wired to MDX content
- [ ] `ProcessSteps.tsx` built per `spec-sheet.md` §6
- [ ] `BuildLogList.tsx` built, reading from `content/build-log/entries.json`
- [ ] `ProofStrip.tsx` built with real, verifiable claims only
- [ ] Footer
- [ ] Responsive pass against `layout.md` §3 breakpoints
**Exit criteria**: full site scrollable top to bottom on mobile and desktop, all real content in place, zero AI features yet, no dead placeholder text.

---

## Phase 2 — Architecture Diagram
**Goal**: interactive SVG diagram working for at least CompanyBrain's architecture.
- [ ] Build `ArchitectureDiagram.tsx` — custom SVG nodes/edges per `design.md` §7 and `spec-sheet.md` §4
- [ ] Hover states: highlight connected edges + tooltip card
- [ ] Click states: deep-link to relevant case study section
- [ ] Mobile fallback: simplified vertical tap-to-expand flow
**Exit criteria**: diagram usable via mouse and keyboard, mobile fallback confirmed on a real small screen.

---

## Phase 3 — RAG Corpus & `/api/ask`
**Goal**: the core differentiator, working end to end (backend first, UI later).
- [ ] Write `content/corpus/corpus.json` — chunk resume + all case study content + architecture descriptions per `trd.md` §3
- [ ] Write `scripts/embed-corpus.ts`, run it, produce `corpus-embeddings.json`
- [ ] Build `/lib/rag/retrieve.ts` (cosine similarity search)
- [ ] Build `/lib/rag/prompt.ts` (system prompt, scoped per `architecture.md` §6)
- [ ] Build `/api/ask/route.ts` — streamed response, returns retrieved chunk metadata alongside stream per `trd.md` §4
- [ ] Basic rate limiting per `architecture.md` §6
- [ ] Test with 10 known queries, confirm retrieval quality before touching UI
**Exit criteria**: `curl`/Postman test against `/api/ask` returns correct, well-sourced answers with visible chunk metadata.

---

## Phase 4 — Hero Retrieval Demo + Ask My Work Widget
**Goal**: wire the RAG backend into the two frontend surfaces defined in the PRD's core differentiator.
- [ ] `HeroRetrievalDemo.tsx` — animated pipeline trace (query → embed → retrieve → generate) per `spec-sheet.md` §1
- [ ] `prefers-reduced-motion` fallback for the demo (instant-state sequence)
- [ ] Mobile: tap-to-run version
- [ ] `AskWidget.tsx` + `ChatPanel.tsx` — persistent floating widget per `spec-sheet.md` §2
- [ ] Source chips under each answer, clickable, scroll-linking to case studies
- [ ] Graceful rate-limit fallback UI (friendly message + email fallback)
- [ ] Nav scroll-aware behavior (compress/fade) finalized here alongside widget's floating z-index per `layout.md` §4
**Exit criteria**: hero demo runs on load or tap, widget usable from anywhere on the site, both hitting real `/api/ask`, sources are clickable and accurate.

---

## Phase 5 — Contact Flow
**Goal**: dual-path contact working and delivering real emails.
- [ ] `ContactForm.tsx` — two entry cards ("Hiring for a role" / "Have a project") per `spec-sheet.md` §8
- [ ] Tailored fields per path (`trd.md` §4 contract)
- [ ] `/api/contact/route.ts` wired to Resend
- [ ] Inline validation, success/error states written in interface voice (not generic "Success!")
**Exit criteria**: submitting either form path delivers a real email to Jayanth's inbox, validation works, success state is clear.

---

## Phase 6 — Motion Pass & Polish
**Goal**: apply `design.md` §6 motion principles across the whole site, not just the hero.
- [ ] Scroll-triggered reveals on case studies, process steps, proof strip (staggered per `design.md`)
- [ ] Hover micro-interactions on cards/buttons
- [ ] Confirm `prefers-reduced-motion` disables all non-essential motion sitewide, not just hero
- [ ] Self-critique pass using `design.md` §9 checklist section by section
**Exit criteria**: motion feels orchestrated, not scattered; reduced-motion users get a fully usable, instant-state site.

---

## Phase 7 — Performance, Accessibility, QA
**Goal**: meet `trd.md` §5-6 requirements before calling it done.
- [ ] Lighthouse pass (mobile) — target ≥90 performance, fix render-blocking issues
- [ ] Full keyboard-navigation pass — every interactive element reachable, visible focus states
- [ ] Screen reader spot-check on Ask My Work widget (ARIA live regions for streamed responses)
- [ ] Color contrast audit (AA minimum)
- [ ] Cross-device check: real mobile device, tablet, desktop — not just devtools resize
- [ ] Final content proofread — no lorem ipsum, no placeholder metrics
**Exit criteria**: Lighthouse ≥90 mobile, keyboard/screen-reader usable, no placeholder content anywhere, site is genuinely shippable.

---

## Phase 8 — Launch
- [ ] Final Vercel production deploy
- [ ] Custom domain wired (if applicable)
- [ ] Smoke test the live production URL end to end (not just preview)
- [ ] Share/announce

---

### Notes for Cursor
- Do not skip Phase 1 to jump to the RAG widget — a fully readable static site is the fallback if time runs short, and it's also what makes Phase 3's corpus content correct (you're chunking real, final copy, not drafts).
- Each phase's exit criteria is a hard gate — don't start the next phase with a broken previous one.
- Reuse CompanyBrain's `glass.css` patterns wherever possible in Phase 0 rather than rebuilding from scratch — this is explicitly budgeted for in the 2-day timeline.
