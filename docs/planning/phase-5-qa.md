# Phase 5 verification — 27 September 2026

## Delivered

All three project pages use the Field Notes design: role/timeframe/status, short summary, an authored exhibit, constraints, expandable system stages, tradeoffs, failure note, evidence/limits and related destinations. Desktop contents stay below the header; mobile contents wrap into ordinary links.

The former duplicate system-fact blocks are removed. All tags remain available in technical details. Existing source IDs are unchanged.

## Content and provenance

- CompanyBrain and Factory Attendance explanations derive from their existing case-study content. Exhibit passages and attendance events are explicitly labelled authored/synthetic examples.
- WorkBuddy architecture and status documentation were read from the owner-supplied project on 27 September. The status document is dated 26 September and reports 554 core tests, 136 desktop tests, 7 GUI skips and three model-free fixture outcomes. These are attributed, dated reports, not tests executed by the portfolio task.
- WorkBuddy's integrated verification gate, concurrency and freshness limitations remain visible. No private runtime data or employee records were read or displayed.
- Public screenshots and recordings are still missing. Placeholder SVG covers are deliberately not rendered as evidence.
- The public catalog gates all related experiment links. They will appear only when implemented and published.

## Checks

| Check | Result |
|---|---|
| Optimized production build | Passed; 19 static pages generated |
| Content tests | 4 passed |
| Rendered case-study checker | 3 pages; 59 project, note and source links passed |
| Source compatibility | All 15 existing case-study section IDs present; no duplicate IDs |
| Desktop, 1280×720 | CompanyBrain introduction/citation exhibit and Factory Attendance exception exhibit inspected |
| Phone, 390×844 | WorkBuddy introduction and receipt inspected; no overflow |
| Narrow phone, 320×740 | CompanyBrain and Factory Attendance title wrapping checked; Factory architecture expanded with no overflow |
| Disclosure interaction | Factory explanation opened by pointer, closed with Enter; WorkBuddy approval explanation and Factory recognition stage opened |
| Deep-link alignment | CompanyBrain walkthrough landed approximately 100px below viewport top |
| Production entrance | WorkBuddy title and introduction settled fully visible |
| Console | No captured browser errors in inspected routes |
| Whitespace | Passed |

Browser screenshots were inspected inline during the session. The production preview ran on port 2006, separately from the development server on 2005.

Three existing image lint warnings in Sticker/HeroCollage remain unchanged.

## Motion and accessibility scope

New disclosure controls use native details/summary and remain functional without application JavaScript. Content is server rendered and visible by default. Page entrance animation is scoped to a no-preference media query with teardown; scroll reveals use the shared preference-aware cleanup. Hover movement is disabled for reduced motion.

Reduced motion was reviewed in source; OS preference emulation, assistive-technology testing and physical-device testing remain Phase 10. This report does not claim those were performed.

## Repeat after future changes

1. Run `npm run build`.
2. Run `npm run test:content`.
3. Run `npm run check:case-pages` against the newly generated pages.
4. Inspect each changed exhibit and its source anchor at desktop and phone widths.

Next: Phase 6 isolated fixture corpus and evidence cases. Actual product media remains a tracked P5.2 content follow-up.
