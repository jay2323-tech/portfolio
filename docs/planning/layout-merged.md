# Layout — Merged Light Lab Editorial (primary)

Supersedes `layout.md`.

## Page structure

```
[Nav — sticky light, numbered links, Ask CTA]
[ScrollHud — bottom-left SCRL %]
[Hero — split name + RAG demo]
[LogoMarquee — tools / stack]
[01 Featured Work — media + metrics grid]
[SplitHeadline — From retrieval → to production]
[02 Lab — Ask promo + architecture + corpus stats]
[03 Build Log — color-block insight cards]
[04 About — photo, bio, timeline, foundations]
[05 Contact — warm CTA + dual-path form]
[Footer]
[Ask My Work — floating pill / panel]
```

## Section IDs (nav anchors)

| Index | ID | Label |
|---|---|---|
| 01 | `#work` | Work |
| 02 | `#lab` | Lab |
| 03 | `#build-log` | Log |
| 04 | `#about` | About |
| 05 | `#contact` | Contact |

## Responsive

| Breakpoint | Behavior |
|---|---|
| `< 640px` | Single column; hero demo tap-to-run; full-screen mobile menu; Ask as sheet |
| `640–1024px` | Two-column where natural |
| `> 1024px` | Full layouts; content max 1400px |

## Z-index

```
0   — page content
10  — sticky nav
20  — tooltips
25  — scroll HUD
30  — Ask collapsed pill
40  — Ask panel / mobile sheet
50  — modal / full-screen menu
```
