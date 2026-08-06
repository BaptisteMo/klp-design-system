---
title: Token system
type: token-overview
updated: 2026-08-05
---

# Token system

Three layers in `src/styles/tokens/`, each with a distinct role:

| Layer | File | Purpose | Consumed by |
|---|---|---|---|
| 1. Primitives | `primitives.css` | Raw palettes (`--klp-color-*`), spacing scale (`--klp-spacing-*`), radius scale (`--klp-radius-*`). One mode, no brand switching. | Aliases only — **never** by components. |
| 2. Aliases | `aliases.css` | Semantic tokens (`--klp-bg-*`, `--klp-fg-*`, `--klp-border-*`, `--klp-size-*`, `--klp-radius-*`, `--klp-font-*`) switched per `[data-brand]`. | Components, via Tailwind utilities. |
| 3. Theme | `theme.css` | Tailwind v4 `@theme inline` block exposing aliases as `klp-*` utility classes (`bg-klp-bg-brand`, `text-klp-fg-on-emphasis`, etc.). | Tailwind compiler — generates the actual utilities you use in `className`. |

## Source of truth

`.klp/tokens.json` is captured from Figma variables. The three CSS layers are regenerated from it by `pnpm run sync:tokens`. Edit `tokens.json` (or the Figma variables and re-capture), never the generated files.

## Token groups

| Group | Page | Common prefixes | Tailwind utility namespace |
|---|---|---|---|
| Colors | [colors.md](./colors.md) | `bg-*`, `fg-*`, `border-*` | `bg-klp-*`, `text-klp-*`, `border-klp-*` |
| Spacing | [spacing.md](./spacing.md) | `size-*` | `p-klp-size-*`, `m-klp-size-*`, `gap-klp-size-*`, `w-klp-size-*`, `h-klp-size-*` |
| Radius | [radius.md](./radius.md) | `radius-*` | `rounded-klp-*` |
| Typography | [typography.md](./typography.md) | `font-family-*`, `font-weight-*`, `font-size-*` | `font-klp-*`, `font-weight-klp-*`, `text-klp-text-*`, `text-klp-heading-*` |

## Brand switching

Set `document.documentElement.dataset.brand = '<brand>'` (or use the static attribute `<html data-brand="...">`). The 4 brands are documented at [`brands/_index_brands.md`](../brands/_index_brands.md).

<!-- KLP:NOTES:BEGIN -->
## Notes

### 2026-08-05 — `.klp/tokens.json` is a partial re-capture

`.klp/tokens.json` was fully captured on 2026-04-16 (`capturedAt`). On 2026-08-05 three entries were live-verified against Figma and corrected in place, then `pnpm run sync:tokens` was re-run:

- `bg-brand-contrasted` / showup: `midnight-800` → `midnight-900` (resolves the [Header Showup](../components/_index_header-showup.md) root-fill contradiction)
- `bg-secondary-brand-contrasted` / atlas: `fuchsia-800` → `fuchsia-700`
- `alpha-10` alias added in all four brands (`--klp-color-light-10`), a DS-side addition not present in the Figma alpha family — needed for [Nav Item](../components/_index_nav-item.md)'s hover overlay.

The remaining 121 alias × brand pairs in `tokens.json` are still the 2026-04-16 capture (spot-checked against live Figma at the same time and found to match). **This partial-freshness split is not tracked anywhere machine-readable** — `tokens.json` carries only a single `capturedAt` date at the top level plus a free-form `notes[]` array recording the two corrections and the addition. If more drift is found, prefer a full re-capture over further piecemeal edits, or extend `tokens.json` with a per-entry `verifiedAt` field so this stops being invisible.
<!-- KLP:NOTES:END -->
