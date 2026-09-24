# Redesign baseline — 2026-09-22–23

This is the Phase 0 record for the current Light Lab portfolio. It describes the existing site, not the proposed Workbench redesign. Desktop screenshots were captured at 1440 × 900 and mobile screenshots at 390 × 844 on 2026-09-22–23. The development preview and the production build were both opened in a browser on 2026-09-23.

## Scope and evidence

| Surface | Evidence | State |
|---|---|---|
| Homepage hero | [Desktop screenshot](baseline/2026-09-22/01-home-desktop-hero.png) | Captured |
| Selected work | [Desktop screenshot](baseline/2026-09-22/02-home-desktop-work.png) | Captured |
| Notes/articles | [Desktop screenshot](baseline/2026-09-22/03-home-desktop-notes.png) | Captured |
| Lab | [Desktop screenshot](baseline/2026-09-22/04-home-desktop-lab.png) | Captured |
| About | [Desktop screenshot](baseline/2026-09-22/05-home-desktop-about.png) | Captured |
| Contact | [Desktop screenshot](baseline/2026-09-22/06-home-desktop-contact.png) | Captured |
| Ask My Work | [Desktop open state](baseline/2026-09-22/07-desktop-ask-open.png), [mobile open state](baseline/2026-09-22/15-mobile-ask-open.png) | Answered a suggested question; followed a source |
| Mobile homepage | [Hero](baseline/2026-09-22/08-home-mobile-hero.png), [work](baseline/2026-09-22/09-home-mobile-work.png), [notes](baseline/2026-09-22/10-home-mobile-notes.png), [lab](baseline/2026-09-22/11-home-mobile-lab.png), [about](baseline/2026-09-22/12-home-mobile-about.png), [contact](baseline/2026-09-22/13-home-mobile-contact.png) | Captured after entrance motion settled |
| Mobile menu | [Open state](baseline/2026-09-22/14-mobile-menu-open.png) | Open, Escape, focus return, Work anchor checked |
| CompanyBrain case | [Mobile hero](baseline/2026-09-22/17-case-company-mobile-hero.png), [source landing](baseline/2026-09-22/16-case-company-mobile-architecture.png), [desktop hero](baseline/2026-09-22/20-case-company-desktop-hero.png), [architecture](baseline/2026-09-22/22-case-company-desktop-architecture.png), [decisions](baseline/2026-09-22/23-case-company-desktop-decisions.png), [ending](baseline/2026-09-22/24-case-company-desktop-metrics.png) | Complete section sequence captured |
| Other case studies | [Factory Attendance mobile](baseline/2026-09-22/19-case-factory-attendance-mobile-hero.png), [DesiFit mobile](baseline/2026-09-22/19-case-desi-fit-mobile-hero.png) | Both routes opened and headings checked |
| Production homepage | [Desktop hero](baseline/2026-09-22/25-production-desktop-hero.png) | Rendered after entrance motion settled |

The page order is hero → tools marquee → selected work → articles → lab → about → contact → footer. The existing public project slugs are `/work/company-brain`, `/work/factory-attendance`, and `/work/desi-fit`.

## Findings to carry into the redesign

| Priority | Finding and evidence | Reproduction / next check |
|---|---|---|
| High | The desktop homepage overflows horizontally by 47 px: `document.documentElement.scrollWidth` was 1487 at a 1440 px viewport. The first work title also clips at the right edge of its column. | Open `/` at 1440 × 900, inspect page width and the CompanyBrain card. Check all widths again on mobile. |
| High | Article `READ` links return to `#articles` instead of opening distinct notes. This is also explicit in `components/articles/ArticlesSection.tsx`. | Activate any article row and check the destination. Phase 8 must create real note destinations. |
| High | Contact social links target generic `https://linkedin.com` and `https://github.com`, while the displayed paths use ellipses. The About résumé link is a `mailto:` address. | Inspect `content/site/contact.yaml` and `content/site/about.yaml`; obtain verified URLs and a current PDF in Phase 1. |
| High | Shared desktop navigation uses page-relative fragments on case-study routes. Work resolves to `/work/company-brain#work`, but that page has no `#work` target. The same pattern affects Lab, About, Blog, and Contact. | From any case study, activate a header link; use homepage-qualified destinations such as `/#work`. |
| Medium | The document and hero both use `id="top"`, creating duplicate IDs and ambiguous anchor behavior. | Query `[id="top"]` on `/`; give the hero one unique target. |
| Medium | Opening Ask on mobile left focus on the header ASK button rather than moving it into the dialog. A source chip navigated to the correct case-study anchor, but the persistent Ask panel still covered the destination until closed. | Open Ask by keyboard, inspect `document.activeElement`; follow a source and ensure its destination is visible. |
| Medium | Nonfocused Lab items fade to very low contrast when another item is active. | Hover/focus each Lab row and read the siblings; compare keyboard and touch states. |
| Medium | The About section starts low within a long viewport, after an oversized decorative marquee, so the personal story takes extra scrolling to reach. | Navigate to `#about` at desktop and mobile sizes and check first visible content. |
| Medium | The case-study section labeled “Metrics” currently repeats technology labels such as hybrid+graph, SSE, and Qdrant. These describe the stack, not measured outcomes. | Rename the section or supply verified outcome measures in Phase 1/5. |
| Low | The current project covers are abstract SVG graphics. A stronger case-study presentation needs verified product media and outcome evidence. | Inventory real screenshots, recordings, architecture artifacts, and approved claims in Phase 1. |
| Low | The collage uses regular `<img>` elements in three locations and produces three Next image lint warnings. | Review image behavior/priority when the hero is revised; optimize without changing the editorial composition by accident. |

The collage hero already establishes the intended warm paper, bold type, candid portrait, and small playful objects. Preserve that Light Lab direction while addressing legibility, responsive composition, and evidence quality.

## Interaction checks

| Flow | Observed result | Remaining work |
|---|---|---|
| Homepage anchors | The mobile menu Work link landed at `/#work` with the section about 80 px below the header after smooth scrolling settled. | Fix case-page header destinations and include all anchors in the later navigation pass. |
| Mobile menu | Opened as a dialog with focus on CLOSE; Escape closed it and restored focus to the MENU button. | Recheck after the shared navigation redesign. |
| Ask overlay | Header ASK opened a mobile panel with four suggested questions. The CompanyBrain architecture question returned an answer and four source chips. | Move focus into the dialog; close it when navigating via a source or make the destination visible. Loading/error states remain future implementation checks. |
| Source links | The CompanyBrain architecture chip reached `/work/company-brain#company-brain-architecture`; its target settled about 80 px below the header. | Preserve deep-link accuracy when redesigning case studies. |
| Contact validation | Empty SEND did not submit; native required-field validation focused the name field. Switching HIRING to PROJECT changed the helper copy and company label. | The browser automation could not retain typed text in the email control, so invalid-email behavior is inconclusive. Recheck manually or with a separate test harness. Do not send a real external message without authorization. |

No external contact message was sent. Reduced-motion behavior was not emulated in a browser during this pass; it remains a specific Phase 10 verification item.

## Build and preview baseline

- `npx tsc --noEmit`: passed on 2026-09-22.
- `npm run lint`: passed on 2026-09-22 with three `@next/next/no-img-element` warnings. The installed Next 15.5 command is usable, although `next lint` reports deprecation; migrate it when touching tooling for the redesign.
- `npm run build`: passed on 2026-09-22. It generated the homepage and three work routes with the same image warnings.
- Production server: `npx next start -p 2006` reached ready state on 2026-09-23. The homepage and all three work routes rendered in the browser; no captured console errors were reported. The development tab on port 2005 remained usable at the same time.
- Development build isolation: `next.config.ts` selects `.next-dev` only for `PHASE_DEVELOPMENT_SERVER` and `.next` otherwise. `git check-ignore .next-dev/cache .next/cache` confirms both directories are ignored; `.next/BUILD_ID` exists.
- On 2026-09-23, `npm run dev` needed approved port binding outside the sandbox after an `EPERM` failure. It then started successfully. The preview was running at `http://localhost:2005` at the end of this audit.

## Existing uncommitted work to preserve

The working tree already contains the responsive collage hero, navigation changes, Light Lab tokens/styles, and preview build-folder isolation. Its relevant paths are `app/(site)/page.tsx`, `app/globals.css`, `components/chrome/StatusBar.tsx`, `components/nav/Nav.tsx`, `components/collage/`, `components/hero/HeroCollage.tsx`, `public/images/collage/`, `styles/tokens.css`, `.gitignore`, `next.config.ts`, and `tsconfig.json`. `PLAN.md` and documentation links are also uncommitted. Do not reset this work to start Phase 1.

## Screenshot and motion limitations

Full-page browser screenshots of the CompanyBrain case repeated content and added blank space during capture; they are not used as layout evidence. The section screenshots above cover its beginning through end. Some initial viewport captures caught entrance text in a mid-animation state, so the indexed images were recaptured after the motion settled. Actual `prefers-reduced-motion` emulation and physical-device checks are still Phase 10 tasks. The development and production browser consoles reported no errors in the checked routes.

## Exact next actions

1. Begin Phase 1 with `docs/planning/redesign-content-inventory.md`: list actual portrait, product images, architecture artifacts, résumé, social URLs, and measurable claims, with source and status.
2. Obtain or confirm missing inputs before writing outcome copy or exposing new links. Keep known placeholder destinations out of the final redesign.
3. Carry the navigation, Ask focus/source overlay, desktop overflow, and mislabeled metrics findings into their implementation phases. Verify fixes at desktop/mobile sizes and with reduced motion.
