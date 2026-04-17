---
title: Table Cells / Text
type: component
status: stable
category: table cells
captureBrand: wireframe
radixPrimitive: null
sources:
  - .klp/figma-refs/table-cells-text/spec.json
  - src/components/table-cells-text/TableCellsText.tsx
dependencies:
  components: [badges, button, checkbox]
  externals: [class-variance-authority]
  tokenGroups: [colors, spacing, typography]
  brands: [wireframe]
usedBy: []
created: 2026-04-17
updated: 2026-04-17
---

# Table Cells / Text

A table cell displaying primary text with an optional subtitle. Supports two row height tiers (compact 36px / relaxed 44px) and five fixed column widths (100-400px). Optional slots: checkbox, avatar, icon-button, badge.

## Anatomy

```
td (root)  — Horizontal flex container; clips overflow; min-height driven by height variant
└── div (content)  — Inner flex row; fills root width; holds checkbox/avatar/button + text-container + badges
    ├── Checkbox (checkbox)  — Optional; rendered only when checkbox=true
    ├── span (avatar)  — Optional; rendered only when avatar=true and avatarNode is provided
    ├── div (text-container)  — Vertical flex column; fills content width; holds label + optional subtitle
    │   ├── span (label)  — Primary text; truncates (ENDING) when height=1, wraps when height=2
    │   └── span (subtitle)  — Optional secondary line; hidden by default; visible when showSubtitle=true
    ├── Button (icon-button)  — Optional; rendered only when iconButton=true; variant=tertiary size=icon
    └── Badge (badges)  — Optional; rendered only when badge=true
```

## Variants

Two variant axes: **height** (row tier) and **width** (column width). `justify` has only one value (`start`) and is not a meaningful axis.

### height × width matrix

| height \ width | 100 | 150 | 200 | 300 | 400 |
|---|---|---|---|---|---|
| **1** (compact 36px) | [✓](../../.klp/figma-refs/table-cells-text/height-1-w100-start.png) | [✓](../../.klp/figma-refs/table-cells-text/height-1-w150-start.png) | [✓](../../.klp/figma-refs/table-cells-text/height-1-w200-start.png) | [✓](../../.klp/figma-refs/table-cells-text/height-1-w300-start.png) | [✓](../../.klp/figma-refs/table-cells-text/height-1-w400-start.png) |
| **2** (relaxed 44px) | [✓](../../.klp/figma-refs/table-cells-text/height-2-w100-start.png) | [✓](../../.klp/figma-refs/table-cells-text/height-2-w150-start.png) | [✓](../../.klp/figma-refs/table-cells-text/height-2-w200-start.png) | [✓](../../.klp/figma-refs/table-cells-text/height-2-w300-start.png) | [✓](../../.klp/figma-refs/table-cells-text/height-2-w400-start.png) |

## API

Extends `React.TdHTMLAttributes<HTMLTableCellElement>` (omitting native `height` and `width` to avoid conflicts with the variant props). All native `<td>` attributes are forwarded via rest props.

| Prop | Type | Default | Description |
|---|---|---|---|
| `height` | `'1' \| '2'` | `'1'` | Row height tier: `'1'` = compact (36px), `'2'` = relaxed (44px) |
| `width` | `'100' \| '150' \| '200' \| '300' \| '400'` | `'200'` | Column width in pixels |
| `text` | `string` | `'24/04/2023'` | Primary cell text |
| `showSubtitle` | `boolean` | `false` | Show subtitle line below label |
| `subtitleText` | `string` | `'Subtitle'` | Subtitle text content |
| `checkbox` | `boolean` | `false` | Show checkbox slot (optional composition) |
| `checkboxChecked` | `boolean \| 'indeterminate'` | — | Checkbox checked state — used when `checkbox=true` |
| `onCheckboxChange` | `(checked: boolean \| 'indeterminate') => void` | — | Called when the checkbox value changes |
| `avatar` | `boolean` | `false` | Show avatar slot placeholder (optional composition) |
| `avatarNode` | `React.ReactNode` | — | Custom avatar node rendered in the avatar slot |
| `iconButton` | `boolean` | `false` | Show icon-button slot using Button icon variant |
| `iconButtonIcon` | `React.ReactNode` | — | Icon to render inside the icon-button slot |
| `onIconButtonClick` | `() => void` | — | Called when the icon button is clicked |
| `badge` | `boolean` | `false` | Show badge slot (optional composition) |
| `badgeLabel` | `string` | `'Badge'` | Badge label text |

## Tokens

### `root` layer

| Property | Token | Resolved (wireframe) |
|---|---|---|
| paddingTop | `--klp-size-xs` | `var(--klp-spacing-2)` = 8px (height=1) |
| paddingBottom | `--klp-size-xs` | `var(--klp-spacing-2)` = 8px (height=1) |
| paddingTop | `--klp-size-s` | `var(--klp-spacing-3)` = 12px (height=2) |
| paddingBottom | `--klp-size-s` | `var(--klp-spacing-3)` = 12px (height=2) |
| itemSpacing | `--klp-size-s` | `var(--klp-spacing-3)` = 12px (height=2 only) |
| paddingLeft | literal: 8px | `8px` — unbound in Figma; value matches `--klp-size-xs` (see Gaps) |
| paddingRight | literal: 8px | `8px` — unbound in Figma; value matches `--klp-size-xs` (see Gaps) |
| minHeight | literal: 36px | `36px` — no `--klp-size-*` alias (see Gaps) |
| minHeight | literal: 44px | `44px` — no `--klp-size-*` alias (see Gaps) |
| overflow | literal: hidden | `hidden` |

### `text-container` layer

| Property | Token | Resolved (wireframe) |
|---|---|---|
| itemSpacing | `--klp-size-3xs` | `var(--klp-spacing-1)` = 4px |

### `label` layer

| Property | Token | Resolved (wireframe) |
|---|---|---|
| color | `--klp-fg-default` | `var(--klp-color-gray-800)` |
| fontSize | `--klp-font-size-text-medium` | `16px` |
| fontFamily | `--klp-font-family-body` | `'Inter', 'Test Calibre', system-ui, sans-serif` |
| fontWeight | `--klp-font-weight-body` | `400` |
| lineHeight | literal: 20px | `20px` |
| textTruncation | literal: ENDING | truncate when height=1 |
| textAutoResize | literal: TRUNCATE / HEIGHT | TRUNCATE (height=1); HEIGHT (height=2) |

### `subtitle` layer

| Property | Token | Resolved (wireframe) |
|---|---|---|
| color | `--klp-fg-default` | `var(--klp-color-gray-800)` |
| fontSize | `--klp-font-size-text-medium` | `16px` |
| visible | literal: false (default) | hidden until `showSubtitle=true` |

## Examples

```tsx
import { TableCellsText } from './TableCellsText'

export function TableCellsTextExample() {
  return (
    <table className="border-collapse">
      <tbody>
        {/* Compact height, 200px width, label only */}
        <tr>
          <TableCellsText
            height="1"
            width="200"
            text="24/04/2023"
          />
        </tr>
        {/* Relaxed height, 300px width, with subtitle */}
        <tr>
          <TableCellsText
            height="2"
            width="300"
            text="24/04/2023"
            showSubtitle
            subtitleText="Additional info"
          />
        </tr>
        {/* Compact height with checkbox slot */}
        <tr>
          <TableCellsText
            height="1"
            width="200"
            text="24/04/2023"
            checkbox
            checkboxChecked={false}
          />
        </tr>
        {/* Compact height with badge slot */}
        <tr>
          <TableCellsText
            height="1"
            width="300"
            text="24/04/2023"
            badge
            badgeLabel="Active"
          />
        </tr>
      </tbody>
    </table>
  )
}
```

## Accessibility

- **Role**: `cell` — intended as a `<td>` element inside a `<table>` row.
- **Keyboard support**: Checkbox slot delegates to `@radix-ui/react-checkbox` (Space to toggle). Icon-button slot delegates to the Button component.
- **ARIA notes**: Text truncates at height=1; wraps at height=2. Subtitle is conditionally rendered (not hidden via CSS — fully unmounted when `showSubtitle=false`). Checkbox receives `aria-label="Select row"` by default.

## Dependencies

### klp components
- [Badge](./_index_badges.md) — rendered in the `badges` slot when `badge=true` (`badgeType="tertiary" size="small"`).
- [Button](./_index_button.md) — rendered in the `icon-button` slot when `iconButton=true` (`variant="tertiary" size="icon"`).
- [Checkbox](./_index_checkbox.md) — rendered in the `checkbox` slot when `checkbox=true`.

### External libraries
- [class-variance-authority](https://www.npmjs.com/package/class-variance-authority) — variant class composition for root, content, text-container, label, and subtitle layers.

### Token groups
- [Colors](../tokens/colors.md) — `--klp-fg-default` on label and subtitle layers.
- [Spacing](../tokens/spacing.md) — `--klp-size-xs`, `--klp-size-s`, `--klp-size-3xs` on root padding, itemSpacing, and text-container gap.
- [Typography](../tokens/typography.md) — `--klp-font-size-text-medium`, `--klp-font-family-body`, `--klp-font-weight-body` on label and subtitle layers.

### Brands
- [wireframe](../brands/wireframe.md) — reference screenshots captured under the wireframe brand (10 variants).

## Used by

*Not yet used by any other klp component.*

## Files

- Source: [`src/components/table-cells-text/TableCellsText.tsx`](../../src/components/table-cells-text/TableCellsText.tsx)
- Example: [`src/components/table-cells-text/TableCellsText.example.tsx`](../../src/components/table-cells-text/TableCellsText.example.tsx)
- Playground: [`playground/routes/table-cells-text.tsx`](../../playground/routes/table-cells-text.tsx)
- Registry: [`registry/table-cells-text.json`](../../registry/table-cells-text.json)
- Figma spec: [`.klp/figma-refs/table-cells-text/spec.json`](../../.klp/figma-refs/table-cells-text/spec.json)
- Reference screenshots: [`.klp/figma-refs/table-cells-text/`](../../.klp/figma-refs/table-cells-text/)

<!-- KLP:NOTES:BEGIN -->
## Notes

*Manual prose preserved across regenerations. Anything between the BEGIN/END markers is never overwritten by the documentalist.*
<!-- KLP:NOTES:END -->

<!-- KLP:GAPS:BEGIN -->
## Gaps

Literal values in the adapter that could not be bound to a `--klp-*` token at generation time. Sourced from `spec.json:tokenGaps`.

| Gap # | Figma variable | Expected klp token | Resolved value | Seen on | Notes |
|---|---|---|---|---|---|
| 1 | `VariableID:44254ea5bdcf2155e180be9f7f5798c986ae6ae2/1050:1645` | — | `44px` | `height-2-*/root/minHeight` | `minHeight` for height=2 variants. Bound to an external primitive spacing variable (raw 44px). No matching `--klp-size-*` alias exists. Adapter uses `min-h-[44px]`. |
| 2 | `VariableID:1628ef2701274f14d27cbdbfc02f93663d1cc555/1050:1644` | — | `36px` | `height-1-*/root/minHeight` | `minHeight` for height=1 variants. Bound to an external primitive spacing variable (raw 36px). No matching `--klp-size-*` alias exists. Adapter uses `min-h-[36px]`. |
| 3 | `paddingLeft / paddingRight (root)` | `--klp-size-xs` | `8px` | `all-variants/root/paddingLeft+Right` | `paddingLeft` and `paddingRight` are not bound to any Figma variable (literal 8px). The value matches `Sizing/XS=8px`, so `--klp-size-xs` should be used. Fix in Figma: bind these properties to the `Sizing/XS` variable. Adapter uses `pl-[8px] pr-[8px]` as a workaround. |
<!-- KLP:GAPS:END -->
