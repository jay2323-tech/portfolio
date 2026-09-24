# Content authoring and publication — Phase 2

## Sources

- Projects: `content/case-studies/*.yaml`, edited by Keystatic’s caseStudies collection. Existing slugs and `*-context`, `*-architecture`, `*-decisions`, `*-what-broke`, `*-metrics` source IDs are stable.
- Notes: the existing `content/build-log/*.yaml` and articles collection. Do not create a duplicate notes collection. Body supports Markdown without raw HTML.
- Experiments: `content/experiments/*.yaml`. Store descriptions, sample inputs, mode and limitations here. Executable components live in code.

New optional project fields normalize to empty strings/arrays, summary falls back to problem, timeframe to year. Existing project status and narrative are preserved. Migrated roles summarize existing constraints, not new claims; owner/evidence confirmation remains in the content inventory.

## Publishing

1. Edit via `/keystatic` or YAML. New notes default to `publication: draft`; existing five entries are explicitly published.
2. New experiments default to `status: planned`, `executionMode: simulation`. Planned detail routes return 404.
3. Implement and verify the experiment UI in `/lab/[slug]` before adding its slug to `implementedExperimentSlugs` in `lib/content/experiments.ts`. Only then set its CMS status to `ready`. Setting status alone fails validation and cannot expose a dead demo.
4. Use exact slugs in related fields. References to draft/planned records are allowed internally, but `relatedLinks()` filters them out of public links.
5. Run `npm run test:content`, `npm run check:content`, and `npm run build`. The production build runs the content validator first; unknown related slugs fail the build.

## Safe rollout

The navigation continues to point to existing homepage sections while Phase 3 is pending. Existing homepage article rows now link to their actual note pages. `/lab` has an honest empty state; no planned cards or Run buttons are shown. `/colophon` is available directly; add its footer link during the shared-shell work.

Real screenshots, outcome measurements, résumé and social destinations remain inventory gaps. Do not convert schematic covers or technology labels into outcome evidence.
