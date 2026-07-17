# PRD — Jayanth Portfolio Site

## 1. Purpose
A premium, interactive portfolio site that proves — not claims — Jayanth's ability to build production-grade AI/RAG systems. It serves two audiences with one experience: recruiters at product companies (Microsoft, Amazon, Google, Adobe, Salesforce, Nvidia) evaluating him for AI Engineer internships, and freelance/business clients evaluating whether to hire him to build something real.

The site's core differentiator: it is itself partly powered by a live RAG pipeline over his own work. It doesn't describe his skillset — it demonstrates it in the first 10 seconds.

## 2. Target Users & Jobs-to-be-Done
| User | Job to be done | What convinces them |
|---|---|---|
| Recruiter / hiring manager | Decide in <60s whether to shortlist | Real deployed projects, metrics, clean case studies, no fluff |
| Technical interviewer / referrer | Verify depth beyond resume | Architecture diagrams, tradeoffs, build log, code quality signals |
| Freelance / business client | Decide if this person can be trusted with money and a deadline | Process clarity, live proof (factory system in production), fast honest contact path |

## 3. Goals
- Establish credibility that compensates for a below-average CGPA via demonstrable, deployed work.
- Convert visits into two outcomes: internship interview requests, freelance inquiries.
- Be memorable enough to be shared/referred without prompting ("you have to see this guy's site").

## 4. Non-Goals
- Not a blog/CMS platform (build log is lightweight, not a full blogging engine).
- Not trying to showcase every project — curation over completeness (3-5 deep case studies > 15 shallow ones).
- No account system / user login for visitors.

## 5. Core Features (MVP scope)
1. **Interactive Hero** — live micro RAG demo answering "what has he built" using retrieval over portfolio content.
2. **Ask My Work** — persistent RAG chatbot widget, queryable across the whole site, backed by his real project docs/resume.
3. **Case Studies** (CompanyBrain, Factory Attendance System, +1 more) — problem, constraints, architecture, tradeoffs, metrics.
4. **Interactive Architecture Diagram** — hoverable/clickable system diagram replacing a static skills list.
5. **Build Log** — dated, short-form log of current work (CompanyBrain redesign, etc.), manually updated or DB-backed.
6. **Process section** — how he works, for freelance trust.
7. **Proof strip** — live-deployed links, usage stats, GitHub activity.
8. **Dual-path contact** — "Hiring for a role" vs "Have a project," short tailored forms.

## 6. Success Metrics
- Time-on-site > 90s average (proxy for engagement beyond skim).
- Ask My Work widget interaction rate > 20% of sessions.
- Contact form completion rate.
- Qualitative: at least 3 unsolicited "this is impressive" reactions from recruiters/peers within first month.

## 7. Constraints
- Must be buildable/completable in a 2-day sprint via Cursor, reusing existing stack knowledge (Tailwind 4, shadcn, glass.css patterns from CompanyBrain).
- Must work with minimal/no backend cost — prefer serverless/edge functions for the RAG widget over a persistent server.
- Must be fast: Lighthouse performance >90 on mobile despite motion-heavy design.

## 8. Risks
- Over-scoping the RAG widget could eat the whole 2-day budget → mitigate by keeping it to a small curated corpus (resume + 3 case studies), not a general crawler.
- Motion-heavy design hurting performance/accessibility → enforce `prefers-reduced-motion` fallback from day one (see design.md).
- Case studies reading like marketing instead of engineering → enforce metrics + tradeoffs format (see spec-sheet.md).

## 9. Out of Scope for v1 (future phases)
- Multi-language support
- CMS-driven build log with admin panel
- A/B testing infrastructure
- Blog/long-form writing section
