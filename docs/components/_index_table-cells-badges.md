---
title: Table Cells / Badges
type: component
status: stable
category: table cells
captureBrand: klub
radixPrimitive: null
sources:
  - .klp/figma-refs/table-cells-badges/spec.json
  - src/components/table-cells-badges/TableCellsBadges.tsx
dependencies:
  components: [badges]
  externals: [class-variance-authority, lucide-react]
  tokenGroups: [colors, spacing]
  brands: [klub]
usedBy: []
created: 2026-04-17
updated: 2026-04-17
---

# Table Cells / Badges

A table cell container that embeds a klp Badge (or Status-badge) instance. Two display types: 'badge' (text pill with branded border/fill) and 'status' (icon-only pill with semantic info styling). Two height modes (1 = single row / hug; 2 = double row / extra padding) and six width presets (100, 150-auto, 200, 300, 400, square).

## Anatomy

```
table-cells-badges
├── root            (td)    — Cell outer container. Padding and min-height differ between height=1 and height=2. Width is controlled by column layout, not inline style.
├── badge-instance  (span)  — INSTANCE of klp badges component. For type=badge: bg/brand-low fill + bd/brand-emphasis stroke + fg/brand-contrasted text. For type=status: bg/info fill + bd/invisible stroke + fg/info icon.
├── badge-label     (span)  — Text node inside the badge-instance. Visible in type=badge only.
└── badge-icon      (span)  — Icon selector node inside the badge-instance. Visible in type=status only. Icon: hourglass (lucide: 'hourglass').
```

## Variants

Three axes: `type` × `height` × `width`. Tables are split per `type` axis showing `height` rows and `width` columns.

### type = badge

| height \ width | 100 | 150-auto | 200 | 300 | 400 | square |
|---|---|---|---|---|---|---|
| 1 | [✓](../../.klp/figma-refs/table-cells-badges/height-1-width-100-badge.png) | [✓](../../.klp/figma-refs/table-cells-badges/height-1-width-150-badge.png) | [✓](../../.klp/figma-refs/table-cells-badges/height-1-width-200-badge.png) | [✓](../../.klp/figma-refs/table-cells-badges/height-1-width-300-badge.png) | [✓](../../.klp/figma-refs/table-cells-badges/height-1-width-400-badge.png) | — |
| 2 | [✓](../../.klp/figma-refs/table-cells-badges/height-2-width-100-badge.png) | [✓](../../.klp/figma-refs/table-cells-badges/height-2-width-150-badge.png) | [✓](../../.klp/figma-refs/table-cells-badges/height-2-width-200-badge.png) | [✓](../../.klp/figma-refs/table-cells-badges/height-2-width-300-badge.png) | [✓](../../.klp/figma-refs/table-cells-badges/height-2-width-400-badge.png) | — |

> No badge-type square variant exists in the Figma spec (source: spec.json:variants — no `type=badge, width=square` entry captured).

### type = status

| height \ width | 100 | 150-auto | 200 | 300 | 400 | square |
|---|---|---|---|---|---|---|
| 1 | [✓](../../.klp/figma-refs/table-cells-badges/height-1-width-100-status.png) | [✓](../../.klp/figma-refs/table-cells-badges/height-1-width-150-status.png) | [✓](../../.klp/figma-refs/table-cells-badges/height-1-width-200-status.png) | [✓](../../.klp/figma-refs/table-cells-badges/height-1-width-300-status.png) | [✓](../../.klp/figma-refs/table-cells-badges/height-1-width-400-status.png) | [✓](../../.klp/figma-refs/table-cells-badges/height-1-width-square-status.png) |
| 2 | [✓](../../.klp/figma-refs/table-cells-badges/height-2-width-100-status.png) | [✓](../../.klp/figma-refs/table-cells-badges/height-2-width-150-status.png) | [✓](../../.klp/figma-refs/table-cells-badges/height-2-width-200-status.png) | [✓](../../.klp/figma-refs/table-cells-badges/height-2-width-300-status.png) | [✓](../../.klp/figma-refs/table-cells-badges/height-2-width-400-status.png) | [✓](../../.klp/figma-refs/table-cells-badges/height-2-width-square-status.png) |

> Square width differs by height: height=1 → 48px, height=2 → 56px (source: spec.json:variants, src/components/table-cells-badges/TableCellsBadges.tsx:squareWidthClass).

## API

`TableCellsBadgesProps` extends `Omit<React.TdHTMLAttributes<HTMLTableCellElement>, 'width'>` and `VariantProps<typeof rootVariants>`. All native `<td>` attributes are forwarded except `width` (overridden by the `width` prop below).

| Prop | Type | Default | Description |
|---|---|---|---|
| `type` | `'badge' \| 'status'` | `'badge'` | Display type: `badge` renders a branded text pill; `status` renders an info icon-only pill. |
| `width` | `'100' \| '150-auto' \| '200' \| '300' \| '400' \| 'square'` | `'150-auto'` | Column width preset. `square` resolves to 48px (height=1) or 56px (height=2) at runtime. |
| `height` | `'1' \| '2'` | `'1'` | Row height tier — affects `square` width only (h1=48px, h2=56px); padding differs between badge/status types. |
| `label` | `string` | `'Label'` | Label text shown inside the badge (applies to `type=badge` only; ignored when `type=status`). |
| `className` | `string` | — | Additional CSS classes merged via `cn()`. |
| `ref` | `React.Ref<HTMLTableCellElement>` | — | Forwarded to the `<td>` element via `React.forwardRef`. |

(source: src/components/table-cells-badges/TableCellsBadges.tsx:TableCellsBadgesProps)

## Tokens

### `root` layer

All root padding values are literals in the spec (source: spec.json:_extractorNotes.rootPaddingBinding — Figma variable IDs present but names unresolved; values match `--klp-size-s` and `--klp-size-xs` respectively, recorded as literals to avoid incorrect token assertions).

| Property | Token | Resolved (klub) |
|---|---|---|
| paddingX | `literal: 8px` | — |
| paddingY (type=badge) | `literal: 12px` | — |
| paddingY (type=status) | `literal: 8px` | — |
| minHeight (type=badge) | `literal: 44px` | — |
| minHeight (type=status) | `literal: 36px` | — |
| width | controlled by `width` prop | — |

### `badge-instance` layer

Token bindings differ by `type` axis.

**type = badge:**

| Property | Token | Resolved (klub) |
|---|---|---|
| fill | `--klp-bg-brand-low` | `var(--klp-color-emerald-50)` |
| stroke | `--klp-border-brand-emphasis` | `var(--klp-color-emerald-700)` |
| paddingY | `--klp-size-2xs` | `6px` |
| paddingX | `--klp-size-xs` | `8px` |
| itemSpacing | `--klp-size-2xs` | `6px` |
| cornerRadius | `literal: 4px` | — |
| strokeWeight | `literal: 1px` | — |

**type = status:**

| Property | Token | Resolved (klub) |
|---|---|---|
| fill | `--klp-bg-info` | `var(--klp-color-blue-100)` |
| stroke | `--klp-border-invisible` | `var(--klp-color-light-0)` |
| itemSpacing | `--klp-size-2xs` | `6px` |
| cornerRadius | `literal: 4px` | — |
| strokeWeight | `literal: 1px` | — |

### `badge-label` layer

Visible in `type=badge` only (`display: none` in `type=status`).

| Property | Token | Resolved (klub) |
|---|---|---|
| color | `--klp-fg-brand-contrasted` | `var(--klp-color-emerald-700)` |
| fontSize | `--klp-font-size-text-small` | `14px` |
| fontFamily | `--klp-font-family-body` | `'Inter', 'Test Calibre', system-ui, sans-serif` |
| fontWeight | `--klp-font-weight-body` | `400` |
| lineHeight | `literal: 18px` | — |

### `badge-icon` layer

Visible in `type=status` only (`display: none` in `type=badge`). Icon: `Hourglass` (lucide-react).

| Property | Token | Resolved (klub) |
|---|---|---|
| color | `--klp-fg-info` | `var(--klp-color-blue-500)` |
| icon | `literal: hourglass` | — |
| size | `literal: 16px` | — |

## Examples

```tsx
import { TableCellsBadges } from '@/components/table-cells-badges'

export function TableCellsBadgesExample() {
  return (
    <table>
      <tbody>
        <tr>
          {/* type=badge: branded text pill */}
          <TableCellsBadges type="badge" width="200" height="1" label="In Progress" />
          {/* type=status: info icon-only pill */}
          <TableCellsBadges type="status" width="200" height="1" />
        </tr>
      </tbody>
    </table>
  )
}
```

## Accessibility

- **Role:** `cell` — rendered as a `<td>` inside a `<tr>`.
- **Keyboard support:** none — display-only cell with no interactive affordances.
- **ARIA notes:** The inner badge has `role=status` or `role=img` (for `type=status` with icon). The Hourglass icon is rendered with `aria-hidden="true"` (source: src/components/table-cells-badges/TableCellsBadges.tsx). No interactive affordances — display-only cell.

(source: spec.json:a11y)

## Dependencies

### klp components

- [Badge](./_index_badges.md) — each cell renders one `<Badge>` instance from `@/components/badges`. For `type=badge`: `badgeType="primary" badgeStyle="bordered" size="small"`. For `type=status`: `badgeType="info" badgeStyle="light" size="small" leftIcon=<Hourglass>`.

### External libraries

- [class-variance-authority](https://www.npmjs.com/package/class-variance-authority) — `cva` for `rootVariants` (type × width matrix).
- [lucide-react](https://www.npmjs.com/package/lucide-react) — `Hourglass` icon for `type=status` badge-icon layer.

### Token groups

- [Colors](../tokens/colors.md) — `bg-brand-low`, `border-brand-emphasis`, `fg-brand-contrasted` (badge type); `bg-info`, `border-invisible`, `fg-info` (status type).
- [Spacing](../tokens/spacing.md) — `size-2xs` (badge paddingY, itemSpacing), `size-xs` (badge paddingX).

### Brands

- [klub](../brands/klub.md) — Figma reference screenshots captured under the klub brand (captureBrand: klub).

## Used by

*Not yet used by any other klp component.*

## Files

- Source: [`src/components/table-cells-badges/TableCellsBadges.tsx`](../../src/components/table-cells-badges/TableCellsBadges.tsx)
- Example: [`src/components/table-cells-badges/TableCellsBadges.example.tsx`](../../src/components/table-cells-badges/TableCellsBadges.example.tsx)
- Playground: [`playground/routes/table-cells-badges.tsx`](../../playground/routes/table-cells-badges.tsx)
- Registry: [`registry/table-cells-badges.json`](../../registry/table-cells-badges.json)
- Figma spec: [`.klp/figma-refs/table-cells-badges/spec.json`](../../.klp/figma-refs/table-cells-badges/spec.json)
- Reference screenshots: [`.klp/figma-refs/table-cells-badges/`](../../.klp/figma-refs/table-cells-badges/)

<!-- KLP:GAPS:BEGIN -->
## Gaps

No gaps recorded.
<!-- KLP:GAPS:END -->

<!-- KLP:NOTES:BEGIN -->
## Notes

*Manual prose preserved across regenerations. Anything between the BEGIN/END markers is never overwritten by the documentalist.*
<!-- KLP:NOTES:END -->
