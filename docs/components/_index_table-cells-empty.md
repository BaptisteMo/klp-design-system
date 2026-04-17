---
title: Table Cells / Empty
type: component
status: stable
category: table cells
captureBrand: wireframe
radixPrimitive: none
sources:
  - .klp/figma-refs/table-cells-empty/spec.json
  - src/components/table-cells-empty/TableCellsEmpty.tsx
dependencies:
  components: []
  externals: [class-variance-authority]
  tokenGroups: [colors, spacing]
  brands: [wireframe]
usedBy: []
created: 2026-04-17
updated: 2026-04-17
---

# Table Cells / Empty

An empty table cell — horizontal layout with no content children. Used as a placeholder or spacer cell in data tables. Comes in two row-height variants (height=1 single-line, height=2 double-line) and three width variants (48px fixed, switch-width, or default/fluid).

## Anatomy

```
root  (td)  — The entire cell is a single empty container. No child layers exist in any variant — this cell intentionally holds no content.
```

(source: spec.json:anatomy)

## Variants

**Primary axis: `height` × secondary axis: `width`**

| height \ width | `48` | `empty-switch` | `default` |
|---|---|---|---|
| `1` | [✓](../../.klp/figma-refs/table-cells-empty/height-1-width-48.png) | [✓](../../.klp/figma-refs/table-cells-empty/height-1-width-empty-switch.png) | — |
| `2` | — | — | [✓](../../.klp/figma-refs/table-cells-empty/height-2-width-default.png) |

3 variants total (source: spec.json:variants).

> ❓ UNVERIFIED: the `height=2` × `width=48` and `height=2` × `width=empty-switch` cells, and `height=1` × `width=default` cell are not represented in the Figma spec. The matrix is sparse. Adapter defaults cover missing axis combinations using cva default variants.

## API

Extends `React.TdHTMLAttributes<HTMLTableCellElement>` (omitting the conflicting native `height` and `width` attributes). All standard `<td>` attributes (e.g. `colSpan`, `rowSpan`, `headers`) pass through via spread.

| Prop | Type | Default | Description |
|---|---|---|---|
| `height` | `'1' \| '2'` | `'1'` | Row height tier: `'1'` = compact (36px min-h, 8px vertical padding), `'2'` = relaxed (36px min-h, 12px vertical padding). |
| `width` | `'48' \| 'empty-switch' \| 'default'` | `'default'` | Column width constraint: `'48'` = 48px min-width, `'empty-switch'` = 56px min-width, `'default'` = fluid. |
| `className` | `string` | — | Additional Tailwind utilities merged via `cn()`. |

(source: src/components/table-cells-empty/TableCellsEmpty.tsx:TableCellsEmptyProps)

## Tokens

### `root` layer

| Property | Token | Resolved (wireframe) |
|---|---|---|
| fill | `--klp-bg-default` | `var(--klp-color-light-100)` |
| itemSpacing | `--klp-size-xs` | `var(--klp-spacing-2)` = 8px |
| paddingLeft | `literal: 12px` | — (token gap; see § Gaps) |
| paddingRight | `literal: 12px` | — (token gap; see § Gaps) |
| paddingTop (height=1) | `literal: 8px` | — (token gap; matches `--klp-size-xs` value) |
| paddingBottom (height=1) | `literal: 8px` | — (token gap; matches `--klp-size-xs` value) |
| paddingTop (height=2) | `literal: 12px` | — (token gap; matches `--klp-size-s` value) |
| paddingBottom (height=2) | `literal: 12px` | — (token gap; matches `--klp-size-s` value) |
| minHeight | `literal: 36px` | — (token gap; no `--klp-size-*` alias for 36px) |
| minWidth (width=48) | `literal: 48px` | — |
| minWidth (width=empty-switch) | `literal: 56px` | — |

(source: spec.json:variants[*].layers.root)

## Gaps

<!-- KLP:GAPS:BEGIN -->
4 token gaps recorded from spec.json:tokenGaps. All gaps are `unbound-literal` kind on the `root` layer.

| # | Kind | Part | Property | Figma value | Expected alias | Current adapter output | Fix |
|---|---|---|---|---|---|---|---|
| 1 | `unbound-literal` | `root` | `minHeight` | 36px (VariableID:1628ef27…/1050:1644, external primitive) | none — no `--klp-size-*` alias exists for 36px | `min-h-[36px]` CSS literal | Add `--klp-size-row-sm` (36px) or `--klp-size-2xl` alias to `02 - Alias Spacing` layer and re-run `pnpm sync:tokens`. |
| 2 | `unbound-literal` | `root` | `paddingLeft` / `paddingRight` | 12px literal (unbound variable) | `--klp-size-s` (12px = Sizing/S) | `pl-[12px] pr-[12px]` CSS literals | Bind to `Sizing/S` variable in Figma; re-run pipeline to replace with `pl-klp-size-s pr-klp-size-s`. |
| 3 | `unbound-literal` | `root` | `paddingTop` / `paddingBottom` (height=1) | 8px literal (unbound variable) | `--klp-size-xs` (8px = Sizing/XS) | `pt-[8px] pb-[8px]` CSS literals | Bind to `Sizing/XS` variable in Figma; re-run pipeline to replace with `pt-klp-size-xs pb-klp-size-xs`. |
| 4 | `unbound-literal` | `root` | `paddingTop` / `paddingBottom` (height=2) | 12px literal (unbound variable) | `--klp-size-s` (12px = Sizing/S) | `pt-[12px] pb-[12px]` CSS literals | Bind to `Sizing/S` variable in Figma; re-run pipeline to replace with `pt-klp-size-s pb-klp-size-s`. |

> Gap 1 (minHeight=36px) is consistent with Table Cells / Text (minHeight=36px for height=1 variants, same VariableID). Gap 1 is a cross-component systemic gap — resolving it for one component resolves it for all table cells.
<!-- KLP:GAPS:END -->

## Examples

```tsx
import { TableCellsEmpty } from './TableCellsEmpty'

export function TableCellsEmptyExample() {
  return (
    <table>
      <tbody>
        <tr>
          {/* height=1, width=default — compact spacer cell */}
          <TableCellsEmpty height="1" width="default" />

          {/* height=1, width=48 — fixed 48px spacer */}
          <TableCellsEmpty height="1" width="48" />

          {/* height=1, width=empty-switch — switch column spacer */}
          <TableCellsEmpty height="1" width="empty-switch" />

          {/* height=2, width=default — relaxed spacer cell */}
          <TableCellsEmpty height="2" width="default" />
        </tr>
      </tbody>
    </table>
  )
}
```

(source: src/components/table-cells-empty/TableCellsEmpty.example.tsx)

## Accessibility

- **Role:** `cell` — renders as a native `<td>` element; receives the implicit ARIA role `cell` within a table context.
- **Keyboard support:** none — no interactive content; no keyboard interaction required for an empty cell.
- **ARIA notes:** No interactive children; no `aria-*` attributes required. The surrounding `<table>` / `<tr>` structure provides context.

(source: spec.json:a11y)

## Dependencies

### klp components

*Leaf component — no klp dependencies.*

### External libraries

- [class-variance-authority](https://www.npmjs.com/package/class-variance-authority) — variant composition via `cva`.

### Token groups

- [Colors](../tokens/colors.md) — `--klp-bg-default` on root fill.
- [Spacing](../tokens/spacing.md) — `--klp-size-xs` on root itemSpacing.

### Brands

- [wireframe](../brands/wireframe.md) — reference screenshots captured under the wireframe brand (3 variants).

## Used by

*Not yet used by any other klp component.*

## Files

- Source: [`src/components/table-cells-empty/TableCellsEmpty.tsx`](../../src/components/table-cells-empty/TableCellsEmpty.tsx)
- Example: [`src/components/table-cells-empty/TableCellsEmpty.example.tsx`](../../src/components/table-cells-empty/TableCellsEmpty.example.tsx)
- Playground: [`playground/routes/table-cells-empty.tsx`](../../playground/routes/table-cells-empty.tsx)
- Registry: [`registry/table-cells-empty.json`](../../registry/table-cells-empty.json)
- Figma spec: [`.klp/figma-refs/table-cells-empty/spec.json`](../../.klp/figma-refs/table-cells-empty/spec.json)
- Reference screenshots: [`.klp/figma-refs/table-cells-empty/`](../../.klp/figma-refs/table-cells-empty/)

<!-- KLP:NOTES:BEGIN -->
## Notes

*Manual prose preserved across regenerations. Anything between the BEGIN/END markers is never overwritten by the documentalist.*
<!-- KLP:NOTES:END -->
