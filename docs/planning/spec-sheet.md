# Spec Sheet — Component-Level Detail

## 1. Hero Section
**Purpose**: Prove capability in the first 10 seconds, not describe it.

Structure:
- Left/top: Headline (display font, 3-4 words max personality statement) + one-line positioning ("AI Engineer building production RAG systems") + primary CTA pair ("See the work" / "Ask me anything" — scrolls to widget)
- Right/below: Live mini-retrieval demo — a preset or freely-typed question, animated pipeline trace:
  1. Query appears
  2. "Embedding..." (mono label, small vector-dot animation)
  3. "Retrieving relevant chunks..." (2-3 chunk cards flash from case study corpus with similarity scores shown, mono font)
  4. Answer streams in
- Fallback for `prefers-reduced-motion`: steps appear instantly in sequence with a 400ms fade, no continuous animation.
- Mobile: stacks vertically, demo becomes tap-to-run rather than autoplay (save mobile bandwidth/battery).

States: idle (shows a rotating set of 3 example questions as placeholder) → running → answered → able to ask follow-up (converts into the persistent Ask My Work widget).

## 2. Ask My Work — Persistent Widget
- Docked bottom-right, collapsed to a small pill: "Ask about my work" with a subtle pulse (respecting reduced-motion).
- Expands to a chat panel (glass surface, matches design.md surface treatment).
- Every answer shows its retrieved sources as small clickable chips below the response (title + similarity score) — clicking scrolls to that case study section. This is critical: it makes the RAG mechanism visible and inspectable, which is the actual proof-of-skill moment.
- Empty state suggests 3-4 real questions ("What's the architecture of CompanyBrain?", "Has anything he built shipped to real users?").
- Rate-limit gracefully: after N messages in a session, show a friendly "want to go deeper? here's my email" fallback rather than erroring.

## 3. Case Study Card + Detail Page
**Card (list view)**:
- Title, one-line problem statement, status badge (mono: "LIVE IN PRODUCTION" / "IN DEVELOPMENT"), 2-3 key metrics inline (mono numerals + small labels).
- No generic tech-tag pill soup — if tech is shown, max 4 tags, styled as data not decoration.

**Detail page structure** (applies to CompanyBrain, Factory Attendance System, third project):
1. Eyebrow: "CASE STUDY" + status
2. Headline: the problem in plain language, not the product name
3. Context block: who it's for, constraints (timeline, solo-built, budget, compliance e.g. DPDP Act for DesiFit)
4. Architecture diagram (see §4) scoped to this project
5. Key decisions & tradeoffs — 2-3 real ones, written honestly ("chose X over Y because Z, cost was...")
6. What broke / what he'd do differently — this section is mandatory, it's the credibility signal recruiters actually trust
7. Metrics block (mono numerals): uptime, users, latency, whatever is real and specific — no vanity metrics
8. Links: live demo (if public), GitHub (if public)

## 4. Interactive Architecture Diagram
- SVG-based, custom nodes (not a generic flowchart library look).
- Default state: full system diagram (e.g., CompanyBrain: Org/Team/User → FastAPI → Hybrid Search + Graph RAG → Qdrant → LLM providers).
- Hover a node → highlights connected edges, shows a small tooltip card with 1-2 sentences on that component's role and why it was chosen.
- Click a node → deep-links to the relevant part of the case study.
- Mobile: falls back to a simplified vertical flow diagram with tap-to-expand nodes (full hover-graph is desktop-only complexity budget).

## 5. Build Log
- Reverse-chronological list, each entry: date (mono), 1-2 sentence update, optional tag (e.g. "CompanyBrain", "Freelance").
- Data source for v1: a local JSON/MDX file, manually updated — no CMS needed yet (per TRD).
- Design: quiet, text-forward, no cards — this section should read like a notebook, not a marketing feed.

## 6. Process Section
- The one place numbering (01/02/03/04) is justified — real sequence.
- Steps: Discovery call → Architecture proposal → Build (with visible checkpoints) → Handoff + support window.
- Each step: short label, one sentence, honest about what he needs from the client at that stage.

## 7. Proof Strip
- Horizontal band, 3-4 items: "Factory system live since [date], processing attendance for [N] employees", GitHub contribution graph embed, any other verifiable claim.
- Every claim must be independently verifiable (a link) or specific enough to sound real — no "loved by many clients" vagueness.

## 8. Contact Section
- Two large tappable cards: "Hiring for a role" / "Have a project" — selecting one reveals a tailored short form (see TRD §4 for fields).
- Form uses shadcn primitives, inline validation, clear success/error states written in the interface's voice ("Message sent — I'll reply within 48 hours" not "Submission successful").

## 9. Navigation
- Minimal sticky nav: logo/mark, Work, Process, Build Log, Contact, + persistent "Ask My Work" trigger always visible.
- Scroll-aware: compresses/fades on scroll down, reappears on scroll up.
