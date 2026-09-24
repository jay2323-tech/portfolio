# Workbench visual specification — selected Field Notes direction

Date: 2026-09-23. This is an implementation specification grounded in the existing [Light Lab tokens](../../styles/tokens.css), [desktop baseline](baseline/2026-09-22/25-production-desktop-hero.png), [mobile baseline](baseline/2026-09-22/08-home-mobile-hero.png), and [content inventory](redesign-content-inventory.md). Jayanth selected displayed option 3, **Field Notes**, on 2026-09-23. The selected desktop image is `visual-targets/2026-09-23/03-field-notes.png`. Do not treat a concept image as evidence that a project feature exists.

## Visual thesis

The site should feel like a well-edited engineer’s desk: warm paper, assertive ink typography, clay accents, occasional mint and sky fields, candid photography, and a few tactile pieces of work. Each playful object should lead to a real project, explanation, or experiment. Keep the current editorial voice while increasing proof, clarity, and interactivity.

## Layout targets

| Surface | Desktop target, around 1440 px | Mobile target, around 390 px | Required state |
|---|---|---|---|
| Homepage hero | Full-width “SYSTEMS, WITH RECEIPTS.” headline; below it, a narrow portrait/intro column and a dominant CompanyBrain folio with one primary case-study CTA. Clay emphasizes “RECEIPTS.” | Headline → one-line introduction → CompanyBrain folio/CTA → portrait/about note → two ruled project rows. No overlap or rotation on reading surfaces; the case CTA appears within the first two viewport heights. | Before hydration, entrance complete, focus, reduced motion |
| Selected work | Three substantial project stories in normal reading order, with status, contribution, verified evidence, and one clear case link each. Avoid an excessively long pinned sequence. | Stacked project stories with generous tap targets. Project title and status must fit without clipping or marquee dependence. | Default, hover/focus, active, media missing |
| Break My Work | A compact challenge bench: one question, small fictional source set, Run/Reset, result explanation, and full Lab link. | A single-column interaction; source documents can expand below the result. | Ready, running, result, error, reset, reduced motion |
| How I build | Four concise steps backed by actual artifact snippets, not a wall of slogans. | Vertical numbered steps, each with one example. | Closed/open proof, keyboard focus |
| Notes | Three dated rows with topic and related work. | Single-line title where possible, short summary, distinct destination. | Default, focus, empty archive |
| About and Contact | Portrait/story and direct links are dominant; form supports the two visitor paths. | One column, visible labels and errors, footer after form. | Validation, sending, success/error, no JavaScript fallback for direct email |
| Case study | Clear intro, role/status, real media, problem/constraints, architecture, one tradeoff, debugging story, supported outcome, next destination. | Reading-first sequence; diagrams become labelled steps and can open an inspection sheet. | Deep link, missing media, open X-ray, reduced motion |
| Lab index/detail | Experiment cards state **live**, **simulation**, or **recorded** accurately. Detail page puts a real input and observable result before the technical explanation. | Controls and result stack vertically; no hover-only diagram. | Ready, running, result, error, reset |
| Notes index/detail | Search or simple filters, readable article width, related work link. | Full-width readable text, stable heading hierarchy and source links. | Empty/filter, long article, deep link |
| X-ray panel | A contextual right-side sheet tied to one visible component; evidence, concise stages, and close action. | Full-screen sheet with title, back/close, preserved reading position. | Open, keyboard trap, Escape, focus return, source navigation |

## Grid and spacing

- Keep the existing `--content-max: 1400px` ceiling, but constrain long reading text to approximately 60–65 characters per line. A 1440 px viewport should have at least 48–64 px of outer space; 390 px should have at least 20–24 px.
- Use an 8 px spacing rhythm. Typical content gaps: 8/16/24/32 px. Distinct section transitions: approximately 96–140 px desktop and 64–88 px mobile. These ranges refine current `--section-gap-*` values; measure the selected target before final token edits.
- Text and interactive elements must stay within the viewport width. Decorative marquees may crop inside their own `overflow: hidden` container; they must not increase `documentElement.scrollWidth`.
- Keep the main CTA at least 44 × 44 px on touch. Reserve clear space around the sticky header, Ask control, and any fixed UI.
- Use a single dominant alignment per section. Collage elements may break it locally, but must not push project text or controls out of their reading column.

## Type and color

- Use Satoshi for display and normal body if the current source remains dependable; JetBrains Mono for labels, captions, code, and tiny instrumentation. Inter can remain a fallback. Limit visible font roles to display/body and mono.
- Suggested type ranges: hero statement 96–136 px desktop and 44–64 px mobile; section titles 40–56 px desktop and 32–40 px mobile; body 16–18 px; metadata no smaller than 12 px when essential. Keep large titles within their column and test long names such as “Factory Attendance.”
- Use `--bg #fafaf8`, `--surface #fff`, `--ink #141414`, `--accent-clay #c77d3c`, and existing mint/sky/blush/butter as the initial palette. Use accent color for action and emphasis; use colored fields sparingly to separate a real experiment or image area.
- Do not encode status solely by tint. “In development,” “Production,” and “Simulation” need explicit text. Keep muted text legible on every tinted surface and during hover/focus dimming.

## Collage and component rules

- Hero density target: portrait, one project object, one handwritten/diagram annotation, and at most two small decorative stickers visible at once. More objects may appear lower in the page only when they help explain a project.
- Give every object a role: link, expandable inspection, or decoration. Decoration is `aria-hidden` and never sits above controls. Interactive objects have visible focus, a text alternative, and a tap behavior.
- Project stories use media with a caption and a truthful source/status label. If approved media is absent, use an authored diagram labelled “system illustration”; do not present abstract SVG covers as product screenshots.
- Prefer section borders and whitespace over nested cards. Cards are for discrete experiments or media that benefits from containment. Project narrative can be an editorial spread.
- Buttons use existing pill/rounded language. Define default, hover, focus, pressed, disabled, running, and error states. Focus rings remain visible on paper and tinted fields.
- Fixed Ask or HUD elements must never obscure active form fields, source chips, menu actions, or the first line of a deep-linked section. Close or minimize Ask when a source is opened.

## Motion contract

- Hero: one short entrance sequence, then stable reading state. Essential content begins visible in CSS before JavaScript. Aim for roughly 450–900 ms total on desktop and less on mobile.
- Interactions: movement should communicate cause and destination. Project hover may lift subtly; project-to-case transition may preserve spatial continuity, but navigation cannot wait for animation to finish to work.
- Avoid simultaneous ambient logo, title, cursor, sticker, and background motion. At most one low-contrast ambient accent runs in the current viewport, and it pauses offscreen.
- Scroll and anchor actions must end at a predictable target below the sticky header. Deep links work on first load and after in-app navigation. Use `scroll-margin-top` and test with Lenis enabled.
- With `prefers-reduced-motion: reduce`, skip scramble, parallax, pinning, drift, smooth scrolling, and large transitions. Show the final content state immediately, keep functional progress feedback, and retain focus/overlay behavior. Verify in a browser during Phase 10.
- Error and loading states use text and progress labels, not motion alone. No simulated demo may animate as though a network/model call occurred when none did.

## Content and evidence presentation

- In every case study, distinguish **problem**, **my contribution**, **design choice**, **what broke**, **result**, and **limitations**. If a result is unmeasured, say what changed operationally without inventing a number.
- Replace current technology values under a “Metrics” heading with “System facts” until verified outcome measures exist.
- Label project status and demo mode close to the relevant media/control. “Live retrieval” may describe the site’s actual retrieval request; the local extractive fallback must be described honestly.
- New note and Lab links appear in navigation only after their routes work. Keep compatibility for existing `#work`, `#articles`, `#lab`, `#about`, and `#contact` targets.

## Review gates for a selected visual direction

1. Compare the chosen desktop hero concept against a 1440 px build and its mobile translation at 390 px. Check the entire first viewport and the first scroll transition.
2. Repeat for project detail, Lab detail, Notes, and X-ray open state; use their target descriptions in the table above if no separate image target is selected.
3. Check widths at 320, 390, 768, and 1440 px; keyboard focus; menu/Ask/X-ray layering; reduced motion; and direct loading of source deep links.
4. Keep any unverified claim or missing media visibly qualified in the design until the content inventory changes to verified.

## Selected composition and implementation targets

**Approved direction: option 3 — Field Notes.** See [the selected image](visual-targets/2026-09-23/03-field-notes.png). The image is 1487 × 1058; use its proportions as the desktop target, then verify at 1440 × 1024. This selection supersedes the earlier name-dominant split-hero proposal.

### Homepage / desktop

- Slim header, approximately 64–72 px high. Identity at left; Work, Lab, Notes, About, Contact, Ask to the right. Only expose destinations when useful content exists.
- Headline spans the content area: “SYSTEMS,” above “WITH RECEIPTS.” The statement is dominant; Jayanth’s name remains visible in the identity/intro.
- One short subline: “Open a project. Inspect a decision. Try an experiment.” Until the challenge is implemented, do not turn the experiment invitation into a dead CTA.
- Below: roughly 25% personal column, 75% project column, 40–56 px gap. A modest candid print on the left; CompanyBrain’s sky folio on the right. Use the actual portrait, preserving its subject rather than synthesizing a new person.
- Folio hierarchy: number/name/status → short problem/contribution summary → clearly labelled system illustration → butter debugging note → “Open the case study” and “Inspect the decision.” Inspection falls back to the real case-study decisions anchor until X-ray exists.
- Tilt the outer paper at most 1–2 degrees; prevent transformed corners from creating page overflow. Avoid overlapping labels, controls, or text. A source diagram is an illustration, not a screenshot or verified architecture artifact.
- Continue with ruled Factory Attendance and DesiFit rows. No repeated oversized CompanyBrain block immediately after the folio.

### Homepage / mobile

- 390 px target, verify 320 and 768 px too. 24 px gutters (20 px at 320), header 64 px, 44 px touch targets.
- Headline in 3 readable lines around 44–56 px, followed by the positioning sentence and featured project. At 320 px, scale by available width rather than clipping “RECEIPTS.”
- CompanyBrain folio is flat and full width; diagram becomes an image with meaningful alt text plus a readable stages list. Debugging note follows the diagram in document flow. Buttons stack when needed.
- Portrait/about note follows the first project CTA. Ruled rows then lead to the rest of the homepage. Do not require sideways dragging to read anything.
- Essential content is visible in initial HTML; reduced motion shows the final state immediately.

### Secondary surfaces derived from the selected direction

These are written responsive targets, not separately generated or user-selected mockups.

| Surface | Desktop composition | Mobile composition | State contract |
|---|---|---|---|
| Project detail | Small return link; large title; ruled role/timeframe/status line; evidence spread followed by a 65ch narrative; related note/experiment links | Title wraps naturally; metadata stacks; media and prose remain in document flow | Preserve source anchors; absent media uses qualified authored explanation; absent outcome data never becomes a metric |
| Lab detail | Mode label and title, input/output bench on a sky field, explanation and limitations below | Input then Run/Reset then result; sources expand beneath | Planned items return 404; live/simulation/recorded labels explicit; ready/running/result/error/reset only after executable implementation |
| Notes index | Large editorial heading, short introduction, dated ruled rows with category/title/summary | Same sequence with 24px gutters; whole row is a focusable link | Published entries only; short notes remain short; empty state if none |
| Note detail | Return link, date/category, title, 65ch Markdown body, optional media, related reading | 40px heading and 17px body; no overlapping marginalia | Unknown/draft slug 404; safe Markdown without raw HTML; only public related destinations |
| X-ray open | Approximately 480px right sheet, dimmed context, title/close, source evidence and concise stages | Full-screen sheet with persistent title/close and scrollable body | Trap focus; Escape/close restores focus; source navigation closes overlay; reduced motion skips travel |
| Colophon | Same readable editorial shell, real stack and design decisions | One column, no nested cards | Direct links to existing notes and work; no invented implementation claims |

### Phase boundaries

Phase 2 implements content models and readable route foundations. Phase 3 implements the selected homepage/header/X-ray shell; Phases 4–8 complete work, case studies, runnable Lab, and richer Notes. Do not report the homepage as matching the selected image until Phase 3’s same-view screenshot comparison passes.

## Approved interaction update — 2026-09-24

The user approved replacing the static secondary project rows with a reversible scroll deck. On spacious desktop screens, the portrait stays steady while CompanyBrain rises away and Factory Attendance then DesiFit enter the same reading area. Each has its own case-study and decision actions. Chapter links bypass scrolling. Small screens and reduced motion use three ordinary sequential sheets. The last sheet releases into the rest of the homepage.
