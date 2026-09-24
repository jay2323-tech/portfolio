# Workbench redesign — content and evidence inventory

Date: 2026-09-23. Scope: Phase 1 source audit for the existing portfolio. “Present” means a file or statement exists in this repository; it does **not** independently verify a claim about a client, product, legal compliance, or measured impact. The source of truth for implementation order is [PLAN.md](../../PLAN.md).

## Status key

- **Present:** usable source exists in the repository. Check visual quality and publication rights before reuse.
- **Draft claim:** asserted in site copy; Jayanth must verify its accuracy and public wording.
- **Missing:** no suitable source found in this repository.
- **Proposed fixture:** can be made from fictional sample data, visibly labelled as a simulation.

## Identity, imagery, and links

| Required input / claim | Source now | Status | Owner / action | Planned destination |
|---|---|---|---|---|
| Current candid portrait | `public/portrait.jpg` (2268 × 4032), used by `content/site/settings.yaml` | Present; subject is at the far left, with large architectural background. Current oval crop leaves much of the person outside the frame. | Jayanth: supply a more centered portrait or approve a careful crop of this image. Codex: test desktop/mobile crops. | Hero, About, social preview if approved |
| Second portrait or cutout | None found | Missing | Jayanth: provide a front-facing or working-at-desk photo and publication approval. | Hero collage variant, About |
| Logo / monogram | `public/logo-jk.jpg`, `public/logo-jk.png`, favicon assets | Present | Codex: use the existing JK identity; check transparent treatment at different sizes. | Navigation, footer, favicon |
| Decorative collage objects | `public/images/collage/` paper cuts and sticker SVGs | Present; these are design assets, not proof of work | Codex: keep a restrained subset and confirm touch/keyboard alternatives. | Hero and transitions |
| Résumé PDF | No PDF found; `content/site/about.yaml` links to `mailto:cvjayanth005@gmail.com` | Missing | Jayanth: provide current PDF and approve public download. Codex: link only after file exists. | `/resume.pdf`, About, Contact, footer |
| Email address | `content/site/contact.yaml` | Present; public site currently displays it | Jayanth: confirm preferred public contact address. | Contact and footer |
| LinkedIn profile | `content/site/contact.yaml` points only to `https://linkedin.com` | Missing verified profile URL | Jayanth: provide exact public profile URL. | Contact and footer |
| GitHub profile / code repository | `content/site/contact.yaml` and `components/lab/LabSection.tsx` point to generic `https://github.com` | Missing verified URL and repository access decision | Jayanth: provide profile and identify public repos, if any. Codex: remove generic outbound destinations. | Contact, Lab, case studies, footer |
| Availability and location | `content/site/about.yaml`, `content/site/hero.yaml` | Draft claim | Jayanth: confirm current work availability, relocation language, and location display. | Hero, About, Contact |
| Education and timeline | `content/site/about.yaml` has B.Tech “In progress / recent” and `[—]`; experience year labels are broad | Draft claim with missing dates | Jayanth: provide accurate institution, dates, and preferred public detail. | About, résumé |
| “3 systems shipped / in build” | `content/site/hero.yaml` | Draft claim; combines two distinct statuses | Codex: replace with project-specific status language. Jayanth: verify each status. | Hero |

## Project evidence and permission

| Required input / claim | Source now | Status | Owner / action | Planned destination |
|---|---|---|---|---|
| CompanyBrain problem, architecture, decisions, citation mismatch | `content/case-studies/company-brain.yaml`; corpus chunks `cb-*`; build logs dated 2026-05-12 and 2026-07-10 | Present as authored narrative; real system evidence not attached | Jayanth: confirm role, current status, public architecture and debugging story. | Home work card, `/work/company-brain`, retrieval challenge, note |
| CompanyBrain product screenshot or walkthrough | `public/images/work/company-brain.svg` is an abstract cover graphic; no product screenshot or video found | Missing | Jayanth: provide redacted UI capture or approve a clearly labelled schematic. | Home work card, case hero, X-ray |
| CompanyBrain measurable outcome | Current `metrics` are hybrid+graph, SSE, Qdrant (stack labels) | Missing | Jayanth: provide a measured result with sample, time period, and method, or omit the outcome panel. | Case results |
| CompanyBrain architecture diagram | `components/architecture-diagram/` and architecture summary in case YAML | Present as site-authored diagram; verify against system | Jayanth: confirm topology and what can be public. Codex: retain valid deep-link IDs. | Case architecture, X-ray, Lab |
| Factory Attendance production claim and operations story | `content/case-studies/factory-attendance.yaml`; corpus `fa-*`; build log 2026-06-22 | Draft claim: current content says live in production and daily use | Jayanth: confirm deployment status, role, client anonymity, and publication scope. | Home work card and `/work/factory-attendance` |
| Factory screenshots, device/floor media, reporting UI | `public/images/work/factory-attendance.svg` is an abstract cover; no real product media found | Missing | Jayanth: provide anonymized captures with client permission; exclude worker faces/biometrics. | Case hero, process proof, simulator context |
| Factory measured outcome | Current `metrics` are face+device, daily punch, edge→cloud | Missing | Jayanth: provide verified before/after reporting time, latency, exception rate, or usage with context; otherwise use a qualitative outcome. | Case results |
| Factory shift/exception example | Case YAML `whatBroke`, `decisions`; build log about report edge cases | Present as narrative, not a shareable event trace | Jayanth: confirm example is real and publishable. Codex: create fictional event fixtures for play. | Case debugging section, shift simulator, note |
| DesiFit product and data-flow story | `content/case-studies/desi-fit.yaml`; corpus `df-*`; build log 2026-06-01 | Present as authored draft; compliance language requires careful review | Jayanth: confirm scope and wording. Codex: describe design decisions without claiming certified compliance. | Home work card and `/work/desi-fit` |
| DesiFit screenshots, data map, consent copy | `public/images/work/desi-fit.svg` is an abstract cover; no product capture or source data-flow diagram found | Missing | Jayanth: provide approved screens/diagram. Codex: use fictional sample data in demos. | Case hero, data journey, X-ray |
| DesiFit measured outcome | Current `metrics` are DPDP-ready, consent-first, product+policy | Missing; “DPDP-ready” may imply a compliance outcome | Jayanth: verify legal/product status; remove or qualify unsupported compliance and result claims. | Case results |
| DesiFit purpose/retention debugging example | Case YAML `whatBroke` and June build log say analytics scope was cut | Draft claim | Jayanth: confirm what changed and whether “half” is a defensible number. | Case debugging section, data journey, note |
| Public source-code links | No project-specific repo URLs found in case YAML | Missing | Jayanth: identify releasable repos or explicitly mark code private. | Case evidence and Lab |

## Notes and dates

Five dated `content/build-log/*.yaml` entries exist (2026-05-12 through 2026-07-16). They are short summaries, not full articles, and all current “READ” links loop to `#articles`. Jayanth should confirm the dates and claims before they become notes. Codex can expand only with verified artifacts and should preserve the original short text as provenance. Destinations: `/notes/[slug]`, related case sections, and “Currently building.” The latest existing entry is the 2026-07-16 portfolio rebuild; a new current update needs a real date and a true description of work done.

## Draft positioning and project summaries

These are proposed copy, grounded in repository text. They are **not** new factual proof.

| Surface | Draft copy | Evidence to attach before publication |
|---|---|---|
| Hero | **I build AI systems people can inspect and actually use.** Retrieval, computer vision, and full-stack product work—from the first constraint to the operational edge case. | Confirm project roles/status; keep a clear link to three case studies and one working experiment. |
| CompanyBrain | **Problem:** teams need answers grounded in scattered internal knowledge. **Contribution:** a product surface for hybrid/graph retrieval, streamed responses, and visible source provenance. **Evidence:** architecture diagram and the wrong-citation debugging story already documented in the case draft. | Confirm role/topology; add redacted UI, evaluation examples, and verified results if available. |
| Factory Attendance | **Problem:** manual attendance and shift exceptions make payroll reconciliation hard. **Contribution:** the repository describes capture, exception queues, and operator reports for a production floor. **Evidence:** the lighting/angle failure and shift-change report story. | Confirm production status and client permission; add anonymous workflow evidence and measured operations results if available. |
| DesiFit | **Problem:** a fitness product needs clear purposes and boundaries for personal data. **Contribution:** the repository describes consent at collection, less analytics collection, and a deletion path in the design. **Evidence:** a documented data-flow rethink and the tradeoff to collect less. | Confirm current implementation, approved screens/data map, and qualified legal wording; avoid “compliant” or “certified” without review. |

## Status audit and candidate debugging stories

| Project | Current site status | Evidence level | Publication gate | Debugging example to develop |
|---|---|---|---|---|
| CompanyBrain | In development | Case YAML + two build-log notes | Jayanth reconfirms status and public scope | Fluent answer citing the wrong chunk → surface chunk metadata and scoring |
| Factory Attendance | Live in production | Case YAML + one build-log note, no independent artifact | Jayanth confirms deployment, client permission, and safe anonymization | Entrance lighting/angle and shift-change exceptions → retry/supervisor path |
| DesiFit | In development | Case YAML + one build-log note | Jayanth reconfirms implementation stage and wording | Unneeded analytics events → purpose/retention mapping and reduced collection |

Do not convert stack names in the current `metrics` arrays into outcome metrics. The case page should call them “system facts” or replace them with measured outcomes supplied with context.

## Demo execution boundary

| Experience | Current implementation | Planned mode and label | Fixture / credential need | Failure behavior |
|---|---|---|---|---|
| Ask My Work | `/api/ask` retrieves from curated corpus and streams an answer. Without model credentials, `lib/rag/generate.ts` streams a local extractive answer. | **Live portfolio retrieval.** If no model key is configured, say “extractive answer from portfolio sources,” not “AI model response.” | Existing `content/corpus/` files; optional `ANTHROPIC_API_KEY` or `OPENAI_API_KEY` in deployment environment. Never commit values. | Show source links and a plain error/retry state; do not silently invent an answer. |
| CompanyBrain architecture | Existing interactive diagram on home/case page | **Interactive explainer** using site-authored architecture, pending owner verification. | Confirmed public topology and descriptions; no credential. | Fall back to readable list/text. |
| Break My Work retrieval challenge | Planned; no route or fixture exists | **Deterministic simulation first**, explicitly labelled. Upgrade to live retrieval only when a small public fixture corpus and actual execution are ready. | Fictional documents with expected relevance/citation results; optional model key only for a later live mode. | Stop and explain if a live mode fails; offer reset and transparent expected result. |
| Factory shift simulator | Planned; no implementation | **Simulation with synthetic events.** | Fictional normal, duplicate, ambiguous-match, and device-interruption fixtures; no biometric images or client records. | Explain exception state and allow reset. |
| DesiFit data journey | Planned; no implementation | **Simulation with fictional profile/activity/integration data.** | Sample permissions, purpose labels, retention/deletion behavior; no real health data. | Show exactly what changes and allow reset. |
| Recorded walkthroughs | None found | **Absent** until Jayanth supplies approved recordings. | Approved recording and captions/transcript. | Hide the recorded control. |
| Contact delivery | `/api/contact` uses Resend when configured; local code can log without `RESEND_API_KEY`. | **Live contact form** only when production delivery is configured and tested. | `RESEND_API_KEY`, `CONTACT_TO_EMAIL` in deployment environment; no values in docs. | Show clear send/error states and direct email fallback. |

## Inputs to request from Jayanth

1. A centered or working portrait, current résumé PDF, exact LinkedIn/GitHub URLs, and preferred public email/availability.
2. Approved screenshots or recordings for each project, plus permission to show architecture and client details. Anonymize Factory Attendance media.
3. For every outcome claim: metric, baseline/comparison, sample size or time window, measurement source, and permission to publish. If none exists, use an honest qualitative result.
4. Confirm CompanyBrain and DesiFit development status, Factory Attendance production status, and each project’s exact personal contribution.
5. Confirm whether any project code is public. Private code can be explained through redacted snippets or diagrams without a fake “View code” link.

Missing inputs block only their dependent presentation. Route scaffolding, simulations with labelled fixtures, navigation repair, and accessible layout work can continue independently.
