# Layout — Wireframes & Responsive Rules

## 1. Page Structure (single-page scroll, anchor-linked nav)
```
[Nav — sticky, scroll-aware]
[Hero — live retrieval demo]
[Case Studies — 3 deep entries]
[Architecture Diagram — interactive]
[Process]
[Build Log]
[Proof Strip]
[Contact]
[Footer]
[Ask My Work — persistent floating widget, all sections]
```

## 2. Desktop Wireframes (ASCII, ~1440px canvas)

### Hero
```
┌────────────────────────────────────────────────────────┐
│ [logo]      Work  Process  Log  Contact     [Ask ●]     │
├────────────────────────────────────────────────────────┤
│                                                          │
│   AI Engineer building         ┌──────────────────┐     │
│   production RAG systems.      │ "what's he built?"│     │
│                                 │  ⚬ embedding...   │     │
│   [See the work] [Ask me →]    │  ⚬ retrieving...  │     │
│                                 │  → streamed answer│     │
│                                 └──────────────────┘     │
│                                                          │
└────────────────────────────────────────────────────────┘
```

### Case Study (detail)
```
┌────────────────────────────────────────────────────────┐
│ CASE STUDY · LIVE IN PRODUCTION                         │
│ Attendance, automated. Facial recognition at factory    │
│ scale.                                                   │
│                                                          │
│ Context      │ Architecture diagram (interactive SVG)   │
│ - who        │                                           │
│ - constraints│                                           │
│                                                          │
│ Decisions & tradeoffs (2-3, written honestly)            │
│                                                          │
│ What broke / what I'd change                             │
│                                                          │
│ [uptime: 99.x%] [employees: N] [latency: Xms]            │
└────────────────────────────────────────────────────────┘
```

### Architecture Diagram Section
```
┌────────────────────────────────────────────────────────┐
│  System Architecture                                     │
│                                                            │
│   [Org/Team/User] → [FastAPI] → [Hybrid Search+Graph]     │
│                                        │                   │
│                                   [Qdrant]  [LLM providers]│
│                                                            │
│  hover a node → tooltip + connected edges highlight        │
└────────────────────────────────────────────────────────┘
```

### Process
```
┌────────────────────────────────────────────────────────┐
│  How this works                                          │
│  01 Discovery   02 Proposal   03 Build   04 Handoff      │
│  (each: label + one sentence, horizontal on desktop)      │
└────────────────────────────────────────────────────────┘
```

### Contact
```
┌────────────────────────────────────────────────────────┐
│   ┌───────────────────┐   ┌───────────────────┐          │
│   │ Hiring for a role  │   │  Have a project    │          │
│   └───────────────────┘   └───────────────────┘          │
│              (selecting reveals tailored form)             │
└────────────────────────────────────────────────────────┘
```

## 3. Responsive Rules
| Breakpoint | Behavior |
|---|---|
| `< 640px` (mobile) | Single column everywhere. Hero demo becomes tap-to-run. Architecture diagram simplifies to vertical tap-to-expand flow. Ask My Work widget becomes full-screen sheet on open, not floating panel. Process steps stack vertically, numbering remains. |
| `640-1024px` (tablet) | Two-column where natural (case study context/diagram), nav stays sticky, widget stays floating but smaller. |
| `> 1024px` (desktop) | Full layouts as wireframed above. Max content width 1200px, centered. |

## 4. Z-index / Layering Rules
```
0   — page content
10  — sticky nav
20  — hover tooltips (architecture diagram)
30  — Ask My Work collapsed pill
40  — Ask My Work expanded panel / mobile sheet
50  — any modal/overlay (contact form success state, if modal)
```

## 5. Section Vertical Rhythm
- Desktop: 120px between major sections (per design.md).
- Mobile: 64px between major sections.
- Hero gets extra breathing room: 160px bottom padding desktop before Case Studies begins, so the retrieval demo doesn't feel crowded.


> **Superseded** by [`layout-merged.md`](layout-merged.md). Kept for historical reference.
