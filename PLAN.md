# Jayanth’s Workbench — Portfolio Redesign Plan

Last updated: 2026-09-23

Status: REDESIGN PLANNED; implementation of the full redesign has not started.

This is the source of truth for the next portfolio redesign. It records the direction discussed with Jayanth, the complete page/section scope, implementation order, and what a future session must do next. A concept or proposed feature in this document is not evidence that it already exists.

## 1. Start here after returning

1. Read **Current checkpoint**, **Decisions**, and the first incomplete phase below.
2. Inspect `git status --short` and relevant diffs. Existing uncommitted edits include the collage hero and preview repair; preserve them.
3. Read any applicable `AGENTS.md` instructions present at the time of resuming.
4. Check the actual source and running site before assuming an old checkbox or screenshot still describes them.
5. Run the preview with `npm run dev` at `http://localhost:2005`. Use `npm run dev:alt` at port 2026 only if necessary.
6. Complete one coherent phase or task, verify it, then update its checkboxes and the checkpoint below.
7. Before ending a session, record changed files, verification evidence, remaining problems, and an exact next action. Do not leave the next session with only “continue polishing.”

### Current checkpoint

| Item | Current state |
|---|---|
| Product direction | Jayanth’s Workbench: Light Lab collage + optional X-ray inspection + playable engineering challenges. |
| Scope authorization | User authorized phased implementation and selected displayed option 3 (Field Notes). Continue one coherent phase per session. |
| Current public pages | Homepage, three `/work/[slug]` case studies, `/notes` and five note pages, `/lab` empty state, `/colophon`. Planned experiment details return 404. |
| Current homepage order | Field Notes hero with three-project scroll deck → tools marquee → articles → lab → about → contact → footer. |
| Prior completed work | Responsive collage hero/navigation fixes; menu Escape/focus handling; reduced-motion CSS changes; preview build-folder isolation. |
| Preview incident | Running a production build overwrote development manifests and left the hero hidden. Development now uses `.next-dev`; production uses `.next`. The collage has visible default CSS so it remains readable if JS fails. |
| Previously checked | Desktop/mobile hero visuals; TypeScript; production build before the subsequent preview repair. After the preview repair, TypeScript and whitespace checks passed and the hero rendered in Browser without captured console errors. These are historical checks, not proof of future changes. |
| Verification still needed | Phase 0 baseline is complete in `docs/planning/redesign-baseline.md`. Fix and verify the recorded defects during implementation; actual reduced-motion emulation and physical-device checks remain Phase 10 tasks. |
| New redesign phases completed | Phases 0–3 implemented: Field Notes hero, reversible project deck, shared navigation, and real decision inspectors are now present. Physical-device and emulated reduced-motion QA remain Phase 10. |
| Next task | Phase 4: assemble remaining homepage sections. Start P4.1 by comparing current lower sections against this plan. Keep the approved Field Notes deck; do not reintroduce the removed duplicate pinned case-study section. |
| Known content gaps | See `docs/planning/redesign-content-inventory.md`: centered portrait, project media and outcome evidence, verified statuses/claims, actual résumé PDF and social URLs, and approved demo fixtures. |

### Session handoff template

Update the checkpoint and append one entry to **Session log** after each working session:

```text
Date:
Phase / task IDs:
Completed:
Files changed:
Verification commands and results:
Visual evidence paths and viewport/state:
Open issues / missing inputs:
Next exact action:
Preview URL and whether it is still running:
```

## 2. Decisions to preserve

- **Identity:** an AI engineer’s interactive workbench. Visitors open work, try a behavior, inspect it, and understand the decisions behind it.
- **Visual direction:** preserve Light Lab’s warm paper, strong black typography, clay/mint accents, candid photography, and restrained collage details.
- **Main visitor goals:** establish credibility quickly, explore engineering depth, and contact Jayanth.
- **Two layers:** normal Explore content plus optional X-ray panels attached to real inspectable components. X-ray is not a decorative global wireframe filter.
- **Signature experience:** one excellent “Break My Work” retrieval challenge before expanding to additional experiments.
- **Current projects:** CompanyBrain and Factory Attendance retain their URLs. WorkBuddy replaces DesiFit at `/work/workbuddy` per owner request on 2026-09-24.
- **About and Contact stay on the homepage.** Do not add separate pages containing the same material by default.
- **Work stays accessible on the homepage.** A separate work index is unnecessary for the current three projects.
- **Optional play:** dragging, inspection, and Easter eggs never become prerequisites for reading or navigation.
- **Mobile is designed explicitly:** stacked compositions, tap controls, and full-screen inspection sheets. No hover-only actions.
- **Motion explains actions:** limit simultaneous ambient movement; support reduced motion and readable defaults before hydration.
- **Evidence is honest:** distinguish shipped, in development, live demo, recorded walkthrough, and simulation. No invented metrics, fake live activity, or unsupported compliance claims.
- **Trace views show observable stages, evidence, timings, and concise explanations.** Do not fabricate or expose private model chain-of-thought.
- **Do not re-scaffold this existing Next.js project.** Extend its content system and reusable components.

### Documentation precedence

For this redesign, use this plan for scope/order and `styles/tokens.css` plus the current implementation for the visual starting point. Existing backend documentation remains useful where accurate.

`docs/planning/phase-plan.md` is the original historical plan; do not restart its setup phases or downgrade the current Next.js version. Older dark-theme/layout docs do not override this direction. `design-reference.md` describes the previous editorial layout, not the final workbench composition.

## 3. Final website map

| Route / surface | Status | Required purpose |
|---|---|---|
| `/` | Redesign existing | Introduction, work, featured challenge, process, notes, about, contact. |
| `/work/company-brain` | Redesign existing | RAG product case study with evidence and an explorable request path. |
| `/work/factory-attendance` | Redesign existing | Production operations story with a synthetic shift/exception demonstration. |
| `/work/workbuddy` | Implemented content | Local engineering companion: memory, approval, isolated worktrees and execution receipts. |
| `/lab` | New | Index of working experiments with truthful execution/status labels. |
| `/lab/retrieval-challenge` | New | Flagship challenge, sources, reset, and explanation. |
| `/lab/shift-simulator` | New | Synthetic attendance events and exception handling. |
| `/lab/approval-receipt` | Planned | Fictional proposal/approval/receipt walkthrough; no real code execution. |
| `/notes` | New | Searchable or simply filterable engineering notes/build updates. |
| `/notes/[slug]` | New | Real readable note pages, linked to related work. |
| `/colophon` | New | How the portfolio is designed and built; accessible from footer/utilities. |
| `/resume.pdf` | New asset if absent | Actual current résumé; do not substitute a mailto link. |
| 404 / loading / error states | Expand | Recovery paths and readable, stable presentation. |
| `/keystatic` | Extend existing private editor | Author the new evidence, demo metadata, notes, and related links. |
| `/api/ask`, `/api/contact` | Preserve/extend | Support the assistant and reliable contact submission. |
| Ask My Work | Enhance shared overlay | Contextual questions with accurate source deep-links. |
| X-ray | New contextual overlay | Inspect the current supported component without losing reading position. |

### Homepage section order and deliverables

1. **Hero/workbench:** strong portrait, large name, concrete positioning statement, project object, architecture note, “Explore my work” and “Try to break something.”
2. **Currently building:** dated note integrated into the hero, linking to a real update.
3. **Selected work:** three substantial presentations with real imagery, contribution, status, and supported evidence; all projects reachable without a long pinned sequence.
4. **Break My Work:** compact version of the flagship retrieval challenge, linked to its full Lab page.
5. **How I build:** problem → thin slice → edge cases → ship/observe, each backed by an actual artifact. Place “Tools behind the work” here or beside selected work.
6. **Notes from the bench:** three real notes with distinct destinations; longer archive at `/notes`.
7. **About:** short personal story, candid image, location/availability, concrete milestones, résumé.
8. **Contact:** hiring/project/hello paths, direct email, verified links, reliable form states.
9. **Footer:** navigation, résumé, colophon, optional small Easter egg.

Keep existing homepage anchors such as `#work`, `#about`, and `#contact`. Preserve compatibility for `#articles` and `#lab` when rearranging sections; ensure old links still land somewhere meaningful.

### Visitor flows

- Recruiter: homepage → selected work → project short version → résumé/about → contact.
- Engineer: challenge → Lab detail → X-ray → case study → related note.
- Client: relevant project → constraints/results → contact with an optional preselected project context.
- Curious visitor: workbench object → experiment → debugging story → notes.
- Returning visitor: currently-building note → latest update → related work.

Every deep page includes a relevant next destination and an obvious route back. Cross-page navigation must use valid paths, not homepage-only fragments on the current case-study route.

## 4. Existing implementation map

| Area | Starting files |
|---|---|
| Homepage composition | `app/(site)/page.tsx` |
| Shared shell | `app/(site)/layout.tsx`, `components/nav/Nav.tsx`, `components/Footer.tsx` |
| Hero/collage | `components/hero/HeroCollage.tsx`, `components/collage/`, `public/images/collage/` |
| Design tokens/styles | `styles/tokens.css`, `styles/glass.css`, `app/globals.css` |
| Project content/model | `content/case-studies/*.yaml`, `lib/case-studies/types.ts`, `lib/case-studies/index.ts` |
| Project presentation | `components/case-studies/`, `app/(site)/work/[slug]/page.tsx` |
| Architecture | `components/architecture-diagram/` |
| Site content/reader | `content/site/*.yaml`, `lib/content/site.ts`, `lib/content/reader.ts` |
| Existing notes | `content/build-log/*.yaml`, `components/articles/ArticlesSection.tsx` |
| CMS | `keystatic.config.ts`, `app/keystatic/` |
| Assistant/RAG | `components/ask-my-work/`, `app/api/ask/route.ts`, `lib/rag/`, `content/corpus/` |
| Contact | `components/contact/`, `app/api/contact/route.ts`, `lib/email.ts` |
| Motion | `components/motion/`, `components/providers/`, `lib/motion/`, `lib/gsap/` |
| Runtime/build | `package.json`, `next.config.ts`, `tsconfig.json`, `.gitignore` |

Names for new component files below are suggested organization. Adjust them to fit the repository, then record the actual paths in the handoff.

## 5. Phase tracker

| Phase | Deliverable | Dependency | Status |
|---|---|---|---|
| 0 | Reliable baseline and inventory | None | Complete; report and desktop/mobile evidence captured |
| 1 | Evidence, assets, and visual specification | 0 | In progress; inventory/spec drafted, three homepage concepts ready for selection |
| 2 | Content model and route foundations | 1 | Not started |
| 3 | Shared shell, workbench hero, X-ray shell | 2 | Not started |
| 4 | Homepage sections | 3 | Not started |
| 5 | All three case studies | 4 | Not started |
| 6 | Flagship retrieval experiment | 5 | Not started |
| 7 | Remaining Lab experiments | 6 | Not started |
| 8 | Notes, contextual assistant, colophon | 7 | Not started |
| 9 | Contact completion and supporting states | 8 | Not started |
| 10 | Full verification and release readiness | 9 | Not started |
| 11 | Requested deployment and live verification | 10 + deployment request | Not started |

Each phase must leave existing routes usable. Do not expose a clickable destination until its page exists. A phase is complete only when its exit criteria have evidence.

## Phase 0 — Establish the actual starting point

**Goal:** know what exists, what is broken, and what must survive the redesign.

- [x] P0.1 Inspect working-tree diffs and record the existing hero/nav/config modifications. Do not reset them.
- [x] P0.2 Run the homepage and all three case-study routes. Captured desktop/mobile homepage sections and CompanyBrain from beginning to end in section screenshots; opened Factory Attendance and DesiFit on mobile.
- [x] P0.3 Check menu, anchors, Ask overlay, source links, and contact validation without sending an external message. Results and the inconclusive invalid-email check are in the baseline.
- [x] P0.4 Verify `.next-dev` is ignored and is used only for development; `.next` remains the production output. Production start and all public routes rendered while development remained available.
- [x] P0.5 Record broken links, placeholder destinations, console errors, clipping, motion issues, and missing evidence in `docs/planning/redesign-baseline.md`.
- [x] P0.6 Confirm a usable lint command. `npm run lint` passed with three image warnings on Next 15.5, though `next lint` is deprecated; migration is logged in the baseline.
- [x] P0.7 Record current typecheck/build results. Both passed on 2026-09-22; results and warnings are in the baseline.

**Exit:** a dated baseline report and screenshots exist; the running preview is reliable; known defects are listed with reproduction steps.

## Phase 1 — Prepare evidence and the visual target

**Goal:** settle assets, copy, and layouts before detailed component implementation.

- [x] P1.1 Create `docs/planning/redesign-content-inventory.md` listing each required asset/claim, its source, status, owner, and destination.
- [x] P1.2 Inventory portrait options, real project screenshots/recordings, architecture artifacts, résumé, actual social URLs, and genuine milestones. Absent inputs are recorded in the inventory.
- [x] P1.3 Draft the hero positioning and each project's problem/contribution/evidence summary. Technology labels remain system facts, not outcome metrics.
- [x] P1.4 Audit current project-status labels: CompanyBrain and DesiFit in development, Factory Attendance in production. Owner reconfirmation before publication is tracked in the inventory.
- [x] P1.5 Choose real debugging examples from existing content: CompanyBrain citation mismatch, attendance capture/shift exceptions, DesiFit data-purpose/retention redesign.
- [x] P1.6 Create/select visual targets for desktop/mobile homepage, project detail, Lab detail, Notes, and X-ray open state. Use the Product Design workflow when visual exploration is needed; keep the agreed Workbench direction.
  - Three independent homepage concepts are saved in `docs/planning/visual-targets/2026-09-23/README.md`, with displayed-order mapping and final prompts. Option 3 (Field Notes) is selected; mobile and secondary-surface written targets are recorded in the design spec. No separate mobile mockup was generated.
- [x] P1.7 Specify spacing, typography, collage density, card states, motion, and mobile alternatives in `docs/planning/workbench-design-spec.md`. Refine exact composition after P1.6 selection.
- [x] P1.8 Decide which demo behavior is live, recorded, or simulated. Required fixtures and credential names are listed in the inventory without secret values.

**Exit:** visual targets and copy are recorded; asset gaps are actionable; each planned demo has a realistic implementation boundary. Missing assets may block their dependent task while unrelated work continues.

## Phase 2 — Extend content and route foundations

**Goal:** create one maintainable source for projects, notes, experiments, and their relationships.

- [x] P2.1 Extend project types/CMS fields for role, timeframe, short summary, evidence, demo reference, result context, limitations, and related note/experiment slugs.
- [x] P2.2 Preserve existing project slugs and source-link section IDs. If an ID must change, provide a compatibility target and update corpus links.
- [x] P2.3 Extend the existing article/build-log collection to support readable note pages, categories, dates, related work, and media. Avoid duplicating the same note in two collections.
- [x] P2.4 Add experiment metadata: slug, title, description, status, execution mode, sample inputs, related project, and explanation. Keep executable behavior in code.
- [x] P2.5 Extend Keystatic and readers together. Migrate existing YAML safely with defaults for new optional fields.
- [x] P2.6 Implement route/data foundations for `/lab`, `/lab/[slug]`, `/notes`, `/notes/[slug]`, and `/colophon`; unknown slugs return 404.
- [x] P2.7 Keep unfinished routes out of visible navigation. Validate all referenced slugs before publishing cards.

**Exit:** existing content still loads, CMS can edit new metadata, route lookup works, and no published item points at a nonexistent page.

## Phase 3 — Shared shell and workbench hero

**Goal:** establish the site's visual and interaction language once.

- [x] P3.1 Implement the selected tokens/type/spacing refinements using the existing Light Lab foundation.
- [x] P3.2 Build navigation with Work, Lab, Notes, About, Contact, and Ask My Work. Until new pages are complete, route Lab/Notes to meaningful homepage sections.
- [x] P3.3 Preserve menu Escape, focus containment, focus return, scroll restoration, desktop-breakpoint closing, and generous touch targets.
- [x] P3.4 Build the hero composition: portrait, name, position statement, project preview, architecture note, two main CTAs, dated currently-building link.
- [x] P3.5 Add limited object interaction only where it helps. Provide ordinary click/tap controls and a stable mobile arrangement.
- [x] P3.6 Add a reusable X-ray shell, suggested location `components/inspect/`: desktop side panel, mobile sheet, title, close action, focus management, and scroll-position preservation.
- [x] P3.7 Add a reusable inspector content model for architecture explanations, real code excerpts, and request traces. Only expose X-ray triggers with useful content.
- [x] P3.8 Simplify the persistent HUD/cursor/ambient effects so they do not compete with content or intercept controls.
- [x] P3.9 Ensure hero content is visible without JavaScript and with reduced motion; animation must never be responsible for making essential content permanently available.

**Exit:** hero/nav and one real X-ray example match the chosen visual target on mobile/desktop; keyboard dismissal works; no overlay covers essential controls.

## Phase 4 — Assemble every homepage section

**Goal:** complete the homepage's readable story before expanding the demos.

- [ ] P4.1 Update `app/(site)/page.tsx` to the section order in this plan.
- [ ] P4.2 Redesign selected work with genuine imagery, role/status/evidence, and distinct links to each case study. All three projects must be accessible without scroll trapping.
- [ ] P4.3 Implement the Break My Work section layout and explanation. Activate its playable controls when Phase 6 delivers the working experiment; no fake Run button.
- [ ] P4.4 Adapt `components/process/ProcessSteps.tsx` where useful. Attach a real artifact to each process step.
- [ ] P4.5 Replace the disconnected tools marquee with tools linked to the projects/decisions that use them.
- [ ] P4.6 Replace article rows with three clear note previews. Connect them to actual note destinations when Phase 8 completes them; preserve useful inline content meanwhile.
- [ ] P4.7 Simplify About: story, candid photo, a few milestones, current availability, and résumé destination once the actual PDF is available.
- [ ] P4.8 Restyle Contact and Footer consistently while preserving functional existing form behavior.
- [ ] P4.9 Keep historical anchors meaningful and ensure sticky navigation does not cover anchor headings.

**Exit:** the full homepage is coherent and responsive, no section is an empty placeholder, every exposed link works, and outstanding feature activation is recorded.

## Phase 5 — Rebuild all project case studies

**Goal:** give each project depth, evidence, and a recognizable interactive centerpiece.

- [ ] P5.1 Refactor the shared case-study template into: introduction → short version → product walkthrough → constraints → architecture → decisions → what broke → results/limits → related work.
- [ ] P5.2 Add clear role/timeframe/status, real media, descriptive captions, and a short contents navigation on long pages.
- [ ] P5.3 Replace the duplicated “metrics” blocks with one evidence section. Put stack labels in technical details; describe the source/context of numerical claims.
- [ ] P5.4 CompanyBrain: connect UI, API, retrieval, vector store, and response streaming in an inspectable architecture. Prepare source-backed examples and the citation-mismatch debugging exhibit.
- [ ] P5.5 Factory Attendance: show the capture/event/report/exception workflow using staged or synthetic data; explain retry and operator resolution behavior.
- [ ] P5.6 WorkBuddy: expand project memory, plan review and approval-bound execution evidence. Distinguish implemented behavior from verification and reliability work.
- [ ] P5.7 Reuse the Lab experiment components as they become available; before that, use an honest recorded/static walkthrough rather than pretending a demo works.
- [ ] P5.8 Add next-project, related-note, related-experiment, and contact paths. Ensure “Back to work” is always present even when project links are empty.
- [ ] P5.9 Validate all existing RAG source deep-links after changing section layouts.

**Exit:** all three case studies tell complete, distinct stories with evidence and correct source links. Demo connections awaiting Phases 6–7 are explicitly tracked.

## Phase 6 — Build the flagship retrieval challenge

**Goal:** deliver one impressive experiment end to end and integrate it into the homepage and CompanyBrain page.

- [ ] P6.1 Create an isolated, small public fixture corpus; avoid mixing experimental documents into the real portfolio corpus accidentally.
- [ ] P6.2 Provide prepared cases for a supported question, ambiguous question, absent evidence, and conflicting evidence.
- [ ] P6.3 Build the UI with input, examples, Run, cancel where applicable, reset, response, source passages, and explanation.
- [ ] P6.4 Choose the implementation from the Phase 1 boundary: actual retrieval/model execution where available or a clearly labelled deterministic simulation. Never silently replace a failed live request with a fake live answer.
- [ ] P6.5 Make unavailable evidence explicit. Highlight supporting passages accurately; do not invent confidence percentages or latency figures.
- [ ] P6.6 Add X-ray trace of observable request/retrieval/response stages and source metadata. Measure actual timings if displayed.
- [ ] P6.7 Handle empty input, rapid repeated runs, cancellation/reset, missing configuration, rate limits, and backend failure. Late responses must not overwrite a newer run.
- [ ] P6.8 Add focused behavioral tests for evidence mapping, unsupported questions, and reset/stale-response handling.
- [ ] P6.9 Complete `/lab/retrieval-challenge`; embed a compact version on the homepage and connect it to CompanyBrain.

**Exit:** a visitor can run all prepared cases, inspect the evidence, understand the execution mode, reset, and reach the related case study. The homepage's signature challenge is now fully functional.

## Phase 7 — Complete the Lab and remaining experiments

**Goal:** extend the same interaction quality to two additional engineering examples.

- [ ] P7.1 Complete `/lab` with featured challenge, experiment cards, execution/status labels, and meaningful links. Activate the global Lab route.
- [ ] P7.2 Build `/lab/shift-simulator` with synthetic normal events, duplicates, ambiguous matches, and device interruption. Define expected outcomes for each fixture first.
- [ ] P7.3 Show event history, exception queue, operator resolution, and resulting report; support reset and replay.
- [ ] P7.4 Build `/lab/approval-receipt` with fictional proposals, approval choices, applied/refused outcomes and a separate verification result. Do not execute real code.
- [ ] P7.5 Make deletion an explicit simulation on local sample data, show affected components, and support reset. Do not request visitors' real health or biometric data.
- [ ] P7.6 Use the common Brief → Controls → Output → Explanation → Related project layout across experiments.
- [ ] P7.7 Connect both experiments to their case studies and add focused tests for event/permission transitions and reset behavior.

**Exit:** all three experiments have repeatable sample behavior, keyboard/touch controls, honest labels, and related-project links. No “coming soon” card pretends to be playable.

## Phase 8 — Notes, contextual Ask, and the portfolio's own story

**Goal:** connect play, reading, and engineering evidence.

- [ ] P8.1 Complete `/notes` with the existing build-log content, clear categories, dates, and an honest featured note. Short updates remain short.
- [ ] P8.2 Complete `/notes/[slug]` with readable typography, relevant media/code, accurate reading estimates if used, and related project/experiment links.
- [ ] P8.3 Update homepage previews and activate the Notes navigation route. Remove links that point back to the same section without opening content.
- [ ] P8.4 Add the current page/project context and relevant suggested questions to Ask My Work. Extend its API contract only as needed and validate context on the server.
- [ ] P8.5 Keep source-backed answers, clear unsupported-answer behavior, interruption/retry handling, and links to exact evidence. Context should improve retrieval without excluding relevant cross-project evidence unnecessarily.
- [ ] P8.6 Update corpus entries/URLs for published content. Run the existing corpus/embedding workflow when its inputs change and verify it succeeds with the available configuration.
- [ ] P8.7 Build `/colophon`: design choices, component/content architecture, retrieval flow, accessibility/motion decisions, and selected implementation details.
- [ ] P8.8 Add a real X-ray example for the portfolio itself. Publish performance measurements only with their device/test conditions.

**Exit:** notes have real destinations, Ask supports page context with accurate citations, and the colophon explains the actual implementation.

## Phase 9 — Complete contact, résumé, and supporting states

**Goal:** make the portfolio useful at the point a visitor wants to act.

- [ ] P9.1 Add the actual current résumé PDF and verify its download; use confirmed social/profile URLs and direct email.
- [ ] P9.2 Complete Hiring / Project / Say hello form paths. Extend the backend schema consistently if adding a new intent.
- [ ] P9.3 Validate required fields and preserve inputs on failure. Prevent accidental duplicate submission and display confirmation only after success.
- [ ] P9.4 Test submission behavior with mocks or a safe test adapter. A real outbound test message requires explicit user authorization; record delivery as unverified until that test is authorized and succeeds.
- [ ] P9.5 Add custom 404 and appropriate loading/error boundaries with routes back to useful content.
- [ ] P9.6 Complete utility-menu controls, motion preference behavior, footer links, and optional Easter egg. The Easter egg must not hide essential content or navigation.
- [ ] P9.7 Verify CMS editing for all newly introduced published content fields.

**Exit:** a visitor can find a real résumé/contact destination, every form state is truthful, and failures have useful recovery paths. Missing delivery credentials or résumé assets are recorded rather than concealed.

## Phase 10 — Verify the whole experience

**Goal:** prove the final site works beyond one attractive screenshot.

- [ ] P10.1 Review every public route at representative mobile (375/390), tablet (768), desktop (1440) widths and a short viewport. Include one actual touch-device check when available; distinguish emulation from real-device testing.
- [ ] P10.2 Capture settled screenshots and compare them against the selected targets. Check portrait crops, typography, collage layers, CTA visibility, menus, panels, and fixed controls.
- [ ] P10.3 Test normal motion and actual `prefers-reduced-motion`, including initial load and preference changes. If the available browser cannot emulate it, record that limitation and complete this gate using a supported browser/device before release.
- [ ] P10.4 Test first load, reload, slow/missing JS, back/forward navigation, and direct deep-links. Essential content must not remain at opacity zero.
- [ ] P10.5 Test keyboard focus, focus return, sheet/dialog behavior, screen-reader naming, contrast, and touch target size. Verify inspection and dragging have ordinary controls.
- [ ] P10.6 Run complete recruiter/engineer/client journeys, checking related links and contact access from every deep page.
- [ ] P10.7 Run `npx tsc --noEmit`, the working lint command established in Phase 0, relevant behavioral tests, `npm run build`, and `git diff --check`.
- [ ] P10.8 Smoke-test the production build as well as development. Keep `.next-dev`/`.next` isolation intact and use distinct ports if both servers run.
- [ ] P10.9 Measure performance on a recorded mobile profile. Aim for a repeatable Lighthouse performance score of at least 90 where practical, low layout shift, and prompt interaction; document actual results and remaining causes instead of claiming a score from appearance.
- [ ] P10.10 Optimize real bottlenecks: image delivery, lazy loading of experiments, excessive JS, duplicated animation loops, and unnecessary GPU effects.
- [ ] P10.11 Produce `docs/planning/redesign-qa.md` containing route/viewport/state coverage, screenshots, checks, known limitations, and release blockers.

**Exit:** no critical navigation, visibility, data-state, or responsive defects remain; required checks pass; evidence and limitations are recorded. A visual screenshot alone does not close an interaction or accessibility check.

## Phase 11 — Release when requested

**Goal:** publish the verified redesign without confusing local completion with live deployment.

- [ ] P11.1 Confirm the user's requested hosting target and deployment scope. This planning request alone does not request publication.
- [ ] P11.2 Verify runtime environment variables, permitted origins, contact delivery configuration, rate limits, metadata, social previews, and indexing behavior.
- [ ] P11.3 Deploy to the selected target using the verified build.
- [ ] P11.4 Open the deployed URL and smoke-test home, all route families, source links, résumé, demos, and form validation. Only send real messages when explicitly authorized.
- [ ] P11.5 Record deployed URL/version/date, verification evidence, and the rollback procedure supported by the hosting setup.
- [ ] P11.6 Mark the redesign complete only after the requested release scope is actually verified. Do not automatically post announcements or send messages to others.

**Exit:** the requested deployment is accessible and checked; the handoff clearly states what is live and any remaining limitations.

## 6. Definition of done for every task

- The stated behavior exists and uses real content or clearly labelled fixtures.
- Loading, empty, error, and reset/dismiss states are handled where relevant.
- The change works on mobile and with a keyboard; reduced motion remains usable.
- Existing source links, routes, and content remain compatible or have deliberate migrations.
- Appropriate checks are recorded; do not add tests that merely restate trivial styling.
- New decisions, missing inputs, and next steps are written into this plan.
- No feature is marked complete because its shell or visual mock exists.

## 7. Evidence and missing-input register

Start with these entries in the Phase 1 inventory, then replace “unverified” with actual findings:

| Input | Status at plan creation | Dependent work |
|---|---|---|
| Better portrait / usable cutout source | Unverified; current photo places the subject at the edge | Final hero/About imagery |
| Real project screenshots or recordings | Unverified; current cover assets are SVGs | Selected work and case studies |
| Verified project outcomes and measurement context | Not yet supplied in the reviewed content | Results/evidence sections |
| Current résumé PDF | Unverified; current About link uses email | Résumé download |
| Actual LinkedIn/GitHub destinations | Need verification; rendered site has generic platform URLs | Contact/Footer |
| Credentials/configuration for live demos and email | Do not assume availability | Live retrieval and actual contact delivery |
| Expanded note content | Existing short build-log entries available | Notes; only expand with truthful material |
| Real production/client media approval | Unverified | Public case-study imagery |

Missing an input should block only the dependent task. Continue useful independent work and clearly label temporary development fixtures. Do not publish invented evidence to fill a gap.

## 8. Commands and operational notes

```bash
# Development preview
npm run dev

# Alternate preview port, only when needed
npm run dev:alt

# TypeScript
npx tsc --noEmit

# Production build; may fetch Google Fonts
npm run build

# Run the built production site on a separate port for verification
npx next start -p 2006

# Whitespace / patch validation
git diff --check

# Update retrieval artifacts when corpus inputs change
npm run embed-corpus
```

The normal `npm run start` script uses port 2005; the direct command above uses port 2006 so production verification can coexist with development. Do not kill an unrelated process to acquire a port. Use the lint command confirmed in Phase 0 instead of assuming the current `next lint` script is valid.

Never remove build-folder isolation to solve a temporary preview problem. Check the server logs and actual browser after changing build configuration; HTML returning 200 does not prove client code hydrated successfully.

## 9. Session log

### 2026-09-22 — Plan created

- Created this plan from the final Workbench redesign brief and the inspected repository.
- Recorded existing hero/navigation and preview-repair work without marking redesign phases complete.
- Identified original phase plan as historical and linked this plan from documentation entry points.
- Next: Phase 0 baseline report/screenshots, followed by the Phase 1 content/evidence inventory.
- This session changes documentation only; no additional redesign implementation or deployment is claimed.

### 2026-09-22–23 — Phase 0 desktop baseline, partial

- Captured seven 1440 × 900 desktop screenshots covering the homepage sections and Ask overlay in `docs/planning/baseline/2026-09-22/`.
- Wrote `docs/planning/redesign-baseline.md` with the screenshot index, reproducible findings, interaction observations, build results, and the remaining checks.
- Inspected and preserved the existing uncommitted hero, navigation, token, and preview-isolation work. No implementation changes were made in this session.
- Verification: `npx tsc --noEmit`, `npm run lint`, and `npm run build` passed on 2026-09-22. Lint/build report three collage `<img>` warnings. `.next-dev` and `.next` are separately configured and ignored; the production server previously reached ready state on port 2006.
- The preview is not running at handoff. A 2026-09-23 restart failed with `listen EPERM` in the sandbox; the outside-sandbox approval request was interrupted.
- Open issues: 47 px desktop horizontal overflow, clipped CompanyBrain heading, duplicate `top` ID, placeholder article/social/résumé destinations, low-contrast Lab hover state, and incomplete Ask focus/source testing. See the baseline report for details.
- Next exact action: restart the preview with authorized port binding; capture the 390 × 844 homepage sections and one complete case study, visit all three work routes, complete interaction/console checks, and verify production in a browser before checking off the rest of Phase 0.

### 2026-09-23 — Phase 0 completed

- Restarted the development preview on port 2005 and production server on port 2006 with approved port binding.
- Captured 390 × 844 homepage hero/work/notes/lab/about/contact, mobile menu and Ask states, mobile hero screenshots of all three case studies, a CompanyBrain section sequence at 1440 × 900, and a production hero. Evidence is indexed in `docs/planning/redesign-baseline.md`.
- Verified mobile menu focus and Escape; `/#work` landing; Ask answer and source deep-link; empty contact validation without sending a message; all public production routes; no captured browser console errors.
- Added high-priority findings: case-study header links use page-relative fragments with no matching targets, and Ask source navigation leaves the overlay covering the destination. Desktop overflow and placeholder destinations remain documented.
- Updated Phase 0 checkboxes and report. No redesign implementation or external form submission was performed in this phase.
- Remaining limits: invalid-email typing could not be validated in the browser automation; full-page screenshot capture produced artifacts, so the case is represented by sequential viewport screenshots. Reduced-motion emulation remains for Phase 10.
- Next exact action: start Phase 1 P1.1 by creating `docs/planning/redesign-content-inventory.md`, then inventory verified media, outcomes, résumé, and social destinations.
- Preview URLs at handoff: `http://localhost:2005` (development) and `http://localhost:2006` (production); both were running when checked.

### 2026-09-23 — Phase 1 evidence and design specification, partial

- Created `docs/planning/redesign-content-inventory.md` with source/status/owner/destination for identity, imagery, links, all three projects, notes, measurable claims, and demo inputs. Drafted hero and project summaries grounded in current YAML.
- Audited current status labels and selected three repository-backed debugging stories. Recorded which experiences are live, deterministic simulations, or absent recordings, including fixture and credential-name needs without values.
- Created `docs/planning/workbench-design-spec.md` with desktop/mobile surface targets, spacing, type, collage density, component states, and motion/reduced-motion rules. It is a draft until a visual direction is selected.
- Product Design context preflight found no saved context. Current screenshots and Light Lab tokens were inspected directly. Mobbin search returned a paid-plan requirement; the user was asked whether to continue visual exploration from local screenshots or wait for access.
- Verification: source paths and asset dimensions checked; no app code was changed in this phase. Run `git diff --check` before final handoff.
- Open inputs: verified project outcomes/status and publication rights, approved screenshots, centered portrait, résumé PDF, and exact social URLs. These block only dependent presentation work.
- Next exact action: complete P1.6 with visual targets once the Mobbin access choice is resolved, record the selected direction and measurements in the spec, then enter Phase 2 content-model work.

### 2026-09-23 — Phase 1 visual concepts generated

- User explicitly authorized continuing without Mobbin. Used the existing Light Lab screenshot, portrait, design spec, and content inventory as references.
- Generated exactly three independent homepage concept images using the built-in Image Gen tool. Displayed order: 1 = Paper Workbench, 2 = Open Bench, 3 = Field Notes. Saved PNGs and full prompts in `docs/planning/visual-targets/2026-09-23/`.
- Reviewed the images and documented copied/unverified status text and simulation wording that must be corrected before implementation. No concept has been selected or implemented.
- Next exact action: resolve the user's choice against the displayed-order mapping, then finish mobile and secondary-surface visual targets before closing P1.6. Continue into Phase 2 only after Phase 1's exit criteria are met.
- Verification: checked documentation whitespace and local concept-file links; app code was unchanged in this step.


### 2026-09-23 — Field Notes selected; Phase 2 complete

- User chose displayed option 3, **Field Notes**. Recorded its exact asset, project-first desktop composition, mobile sequence, and secondary-surface state targets. Phase 1 closed; asset/claim gaps remain tracked.
- Extended project metadata and Keystatic schema; retained all three project slugs and five source-anchor conventions. Migrated five existing notes with explicit publication states, summaries, and related projects.
- Added three **planned simulations**, typed readers, public-link filtering, and build-time relationship validation. CMS status alone cannot publish an experiment without a registered implementation.
- Added `/notes`, five note details, `/lab`, gated `/lab/[slug]`, and `/colophon`. Homepage article rows now open their real notes. Existing nav destinations stay section-based until Phase 3.
- Fixed inner-page header URLs and cross-page anchor alignment after GSAP pins/fonts settle. Browser check: `/#articles` target at 79.82px below viewport top, menu closed. Alignment stops when the visitor interacts.
- Files: `keystatic.config.ts`, `lib/content/*`, `lib/case-studies/*`, `content/{case-studies,build-log,experiments}`, new route directories, `components/editorial/*`, navigation/anchor component, `scripts/validate-content.ts`, `tests/content.test.ts`, package scripts, and planning docs.
- Verification: four content tests passed; `npx tsc --noEmit` passed; final production build passed (19 generated pages); lint passed with the same three pre-existing image warnings; whitespace check passed. HTTP confirmed 200 for public routes and 404 for unknown notes and planned/unknown experiments.
- Browser QA: Notes at 1440×1024, 390×844 and 320×740; note detail at 390×844; Colophon at 390×844; Lab empty state at 424×844; missing note/planned experiment visibly 404. No captured runtime errors. Screenshots and scope limitations: `docs/planning/phase-2-qa/README.md`.
- Remaining: selected homepage and X-ray UI are Phase 3, runnable experiments Phase 6. Shared floating Ask/HUD overlap at narrow widths and full reduced-motion verification remain tracked; new editorial content has no entrance animation. Owner confirmation/media gaps remain unchanged.
- Next exact action: implement selected Field Notes hero (statement, personal column, CompanyBrain folio and case/decision actions), then header and X-ray shell per Phase 3. Use the existing portrait and label architecture art honestly. Do not regenerate concepts or ask for the chosen direction again.
- Preview: development server remains at `http://localhost:2005`; new visible route is `/notes`. Nothing deployed.

### 2026-09-24 — Field Notes hero and reversible project deck

- Implemented Phase 3 shared shell, portrait/folio composition, real decision inspector, simplified Ask dialog, and navigation.
- User approved sequential scroll sheets: CompanyBrain → Factory Attendance → DesiFit. Desktop portrait stays in place; chapter links jump to settled cards; reverse scroll restores previous projects.
- Mobile, reduced-motion preference, and small-height layouts use normal document flow. Cards are server rendered; no-JS and reduced-motion handling were reviewed in code, not browser-emulated.
- Fixed stage sizing after font/layout changes with ResizeObserver; compact laptop styling keeps actions visible. Removed duplicate old featured-work section.
- QA screenshots/comparison: `docs/planning/phase-3-qa/`; report: `design-qa.md`. Desktop 1487×1058, laptop 1280×720, mobile 390×844 checked; earlier phase checks include 320px and tablet.
- Inspector model currently contains authored explanations and source links; live traces and code evidence should be added only when genuine artifacts exist.
- Next: Phase 4 remaining homepage story, starting section order and evidence-oriented tools/notes/process. Preserve this hero.

### 2026-09-24 — WorkBuddy replaces DesiFit

- Source: owner-supplied `/Users/jayanthkrishna/workbuddy/` README, architecture and current status; no private runtime data or secrets read/copied.
- Replaced DesiFit across hero, case study, About, notes, planned experiment and retrieval corpus. New case route `/work/workbuddy`; old DesiFit route removed. Historical QA records remain historical.
- WorkBuddy is a local prototype, not production. Source-reported test counts are dated and explicitly not rerun for the portfolio. No repository URL invented.
- Rebuilt local embeddings; four content tests and production build passed. Existing three image lint warnings remain unrelated. Desktop deck and mobile case-study checked in browser.
- Next remains Phase 4 homepage sections, with WorkBuddy as the third project.
