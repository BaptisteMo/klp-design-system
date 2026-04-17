---
title: Table Row
type: component
status: stable
category: data-display
captureBrand: klub
radixPrimitive: null
sources:
  - .klp/figma-refs/table-row/spec.json
  - src/components/table-row/TableRow.tsx
dependencies:
  components: []
  externals: [class-variance-authority, lucide-react]
  tokenGroups: [colors, radius, spacing, typography]
  brands: [klub]
usedBy: []
created: 2026-04-17
updated: 2026-04-17
---

# Table Row

A data table row component supporting default, hover, floating-action, and empty states. Contains a checkbox cell, one or more text/badge cells, and an actions cell with icon buttons.

## Anatomy

```
table-row (tr)
├── cell-checkbox  (td)    — Leftmost cell; renders a checkbox slot. Hidden in the empty variant.
├── cell-left      (td)    — Frame containing badge cell and text cells. Hidden in the empty variant.
│   ├── cell-badge     (span) — Status badge: bg/info fill, bd/invisible stroke, fg/info icon. Hidden in empty.
│   └── cell-text      (td)  — Repeating text cell. Primary text is bold fg/default; secondary text is fg/muted.
├── cell-actions   (td)    — Rightmost cell with action icon buttons. bg/subtle fill when floating-action is ON; hidden when floating-action is OFF or empty.
│   └── action-button  (button) — Icon-only button: bg/invisible fill, bd/invisible stroke, Radius/L corner, fg/muted icon color.
├── empty-message      (td)  — Visible only in the empty variant. Token gap: Figma hardcodes black — adapter resolves to text-klp-fg-default.
└── empty-illustration (div) — Visible only in the empty variant. Undraw SVG asset; no token bindings.
```

(source: spec.json:anatomy)

## Variants

Two axes: **type** (primary) × **floating-action** (secondary). The `floating-action` axis is not applicable to the `default-hover` and `empty` types.

| type \ floating-action | none | on | off |
|---|---|---|---|
| `default` | [✓](.klp/figma-refs/table-row/default-none.png) | — | — |
| `default-hover` | [✓](.klp/figma-refs/table-row/default-hover-none.png) | — | — |
| `floating-action` | — | [✓](.klp/figma-refs/table-row/floating-action-on.png) | [✓](.klp/figma-refs/table-row/floating-action-off.png) |
| `empty` | — | — | [✓](.klp/figma-refs/table-row/empty-off.png) |

The component exposes a single flattened `variant` prop combining both axes (see API below). Valid values: `default`, `default-hover`, `floating-action-on`, `floating-action-off`, `empty`.

(source: spec.json:variantAxes, spec.json:variants)

## API

Extends `React.HTMLAttributes<HTMLTableRowElement>`. Native HTML attributes are forwarded to the underlying `<tr>` element and are not duplicated below.

| Prop | Type | Default | Description |
|---|---|---|---|
| `variant` | `TableRowVariant` | `"default"` | Controls row state. One of `default`, `default-hover`, `floating-action-on`, `floating-action-off`, `empty`. |
| `checkboxSlot` | `React.ReactNode` | — | Checkbox slot — pass a `<Checkbox />` element for the leftmost cell. |
| `primaryText` | `React.ReactNode` | `"Primary text"` | Bold primary text in the main text cell. |
| `secondaryText` | `React.ReactNode` | `"Secondary text"` | Muted secondary text below primary text in the main text cell. |
| `badgeLabel` | `React.ReactNode` | `"Badge"` | Text label rendered inside the cell-badge span. |
| `actions` | `React.ReactNode` | Default `MoreHorizontal` button | Action buttons slot — rendered inside cell-actions. Overrides the default icon button when provided. |
| `emptyMessage` | `React.ReactNode` | `"No data available"` | Content for the empty-state message cell. Visible only when `variant="empty"`. |
| `emptyIllustration` | `React.ReactNode` | — | Content for the empty-state illustration. Visible only when `variant="empty"`. |
| `colSpan` | `number` | `4` | Number of columns the empty state cells should span. |

(source: src/components/table-row/TableRow.tsx:TableRowProps)

## Tokens

### `root` layer

| Property | Token | Resolved (klub) |
|---|---|---|
| stroke / border-bottom | `--klp-border-default` | `var(--klp-color-gray-400)` |
| fill (default-hover, floating-action-on) | `--klp-bg-subtle` | `var(--klp-color-gray-100)` |
| height (non-empty) | `--klp-size-3xl` | `var(--klp-spacing-16)` → 64px |
| padding (empty variant) | `--klp-size-3xl` | `var(--klp-spacing-16)` → 64px |
| gap (empty variant) | `--klp-size-2xl` | `var(--klp-spacing-12)` → 48px |
| paddingTop / paddingBottom | literal `2px` | literal |

(source: spec.json:variants[0..4].layers.root)

### `cell-badge` layer

| Property | Token | Resolved (klub) |
|---|---|---|
| fill | `--klp-bg-info` | `var(--klp-color-blue-100)` |
| stroke | `--klp-border-invisible` | `var(--klp-color-light-0)` → transparent |
| icon color | `--klp-fg-info` | `var(--klp-color-blue-500)` |
| item spacing | `--klp-size-2xs` | `var(--klp-spacing-1-5)` → 6px |

(source: spec.json:variants[0].layers.cell-badge)

### `cell-text` layer

| Property | Token | Resolved (klub) |
|---|---|---|
| color (secondary text) | `--klp-fg-muted` | `var(--klp-color-gray-700)` |
| color (primary text) | `--klp-fg-default` | `var(--klp-color-gray-800)` |
| font-size | `--klp-font-size-text-medium` | 16px |
| font-family | `--klp-font-family-body` | Inter, Test Calibre, system-ui |
| font-weight (secondary) | `--klp-font-weight-body` | 400 |
| font-weight (primary) | `--klp-font-weight-body-bold` | 600 |

(source: spec.json:variants[0].layers.cell-text)

### `cell-actions` layer

| Property | Token | Resolved (klub) |
|---|---|---|
| fill (floating-action-on) | `--klp-bg-subtle` | `var(--klp-color-gray-100)` |
| padding (all sides) | `--klp-size-xs` | `var(--klp-spacing-2)` → 8px |
| item spacing | `--klp-size-xs` | `var(--klp-spacing-2)` → 8px |

(source: spec.json:variants[2].layers.cell-actions)

### `action-button` layer

| Property | Token | Resolved (klub) |
|---|---|---|
| fill | `--klp-bg-invisible` | `var(--klp-color-light-0)` → transparent |
| stroke | `--klp-border-invisible` | `var(--klp-color-light-0)` → transparent |
| corner radius | `--klp-radius-l` | `var(--klp-radius-lg)` → 12px |
| padding (all sides) | `--klp-size-xs` | `var(--klp-spacing-2)` → 8px |
| icon color | `--klp-fg-muted` | `var(--klp-color-gray-700)` |

(source: spec.json:variants[0].layers.action-button)

### `empty-message` layer

| Property | Token | Resolved (klub) |
|---|---|---|
| color | `--klp-fg-default` | `var(--klp-color-gray-800)` |

> ⚠️ TOKEN GAP: the Figma spec has a hardcoded black fill (no boundVariable) on the empty-message text. The adapter resolves this to `text-klp-fg-default` per `spec.json:tokenGaps[0]`. The gap should be fixed in Figma during the next design token pass.

(source: spec.json:tokenGaps[0], src/components/table-row/TableRow.tsx:emptyMessageVariants)

## Examples

```tsx
import { TableRow } from './TableRow'

export function TableRowExample() {
  return (
    <table className="w-full border-collapse">
      <tbody>
        {/* Default row */}
        <TableRow
          variant="default"
          badgeLabel="Pending"
          primaryText="John Doe"
          secondaryText="john@example.com"
        />

        {/* Hover state */}
        <TableRow
          variant="default-hover"
          badgeLabel="Active"
          primaryText="Jane Smith"
          secondaryText="jane@example.com"
        />

        {/* Floating action on */}
        <TableRow
          variant="floating-action-on"
          badgeLabel="Active"
          primaryText="Alex Johnson"
          secondaryText="alex@example.com"
        />

        {/* Empty state */}
        <TableRow
          variant="empty"
          emptyMessage="No records found."
          colSpan={4}
        />
      </tbody>
    </table>
  )
}
```

(source: src/components/table-row/TableRow.example.tsx)

## Accessibility

- **Role:** `row` — the `<tr>` element carries implicit ARIA role `row`. Should be wrapped in a `<tbody>` inside a `<table>`.
- **Keyboard support:** Tab, Enter, Space
- **ARIA notes:**
  - The checkbox cell renders a native checkbox slot — pass an accessible `<Checkbox />` with a label.
  - Action buttons should carry an `aria-label` (the default button uses `aria-label="More actions"`).
  - The empty-state message is wrapped in `role="status" aria-live="polite"` to announce the state to screen readers.

(source: spec.json:a11y)

## Dependencies

### klp components

*Leaf component — no klp dependencies.*

### External libraries

- [class-variance-authority](https://www.npmjs.com/package/class-variance-authority) — variant composition via `cva`.
- [lucide-react](https://www.npmjs.com/package/lucide-react) — `Hourglass` icon in cell-badge; `MoreHorizontal` icon in the default action button.

### Token groups

- [Colors](../tokens/colors.md) — `bg-subtle`, `bg-info`, `bg-invisible`, `fg-default`, `fg-muted`, `fg-info`, `border-default`, `border-invisible`.
- [Spacing](../tokens/spacing.md) — `size-3xl`, `size-2xl`, `size-xs`, `size-2xs`.
- [Radius](../tokens/radius.md) — `radius-l` on the action-button layer.
- [Typography](../tokens/typography.md) — `font-family-body`, `font-weight-body`, `font-weight-body-bold`, `font-size-text-medium`.

### Brands

- [klub](../brands/klub.md) — Figma reference screenshots captured under the klub brand.

## Used by

*Not yet used by any other klp component.*

## Files

- Source: [`src/components/table-row/TableRow.tsx`](../../src/components/table-row/TableRow.tsx)
- Example: [`src/components/table-row/TableRow.example.tsx`](../../src/components/table-row/TableRow.example.tsx)
- Playground: [`playground/routes/table-row.tsx`](../../playground/routes/table-row.tsx)
- Registry: [`registry/table-row.json`](../../registry/table-row.json)
- Figma spec: [`.klp/figma-refs/table-row/spec.json`](../../.klp/figma-refs/table-row/spec.json)
- Reference screenshots: [`.klp/figma-refs/table-row/`](../../.klp/figma-refs/table-row/)

<!-- KLP:NOTES:BEGIN -->
## Notes

*Manual prose preserved across regenerations. Anything between the BEGIN/END markers is never overwritten by the documentalist.*
<!-- KLP:NOTES:END -->
