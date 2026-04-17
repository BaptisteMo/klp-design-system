---
title: Table Cells / Checkbox
type: component
status: stable
category: table cells
captureBrand: klub
radixPrimitive: "@radix-ui/react-checkbox"
sources:
  - .klp/figma-refs/table-cells-checkbox/spec.json
  - src/components/table-cells-checkbox/TableCellsCheckbox.tsx
dependencies:
  components:
    - checkbox
  externals:
    - "@radix-ui/react-checkbox"
    - class-variance-authority
  tokenGroups:
    - colors
    - spacing
  brands:
    - klub
usedBy: []
created: 2026-04-17
updated: 2026-04-17
---

# Table Cells / Checkbox

A table cell wrapper that renders a single Checkbox instance. Two height variants (compact h=1 at 48px, default h=2 at 56px) and two width variants (fixed 48px, default fill). All cell variants expose the checkbox in State=Rest; state changes are delegated to the embedded Checkbox component.

## Anatomy

```
table-cells-checkbox
├── root        (td)   — Cell container with horizontal layout. fill=bg/default, itemSpacing=Sizing/XS. Padding is partially unbound (token gap, see Gaps section).
└── checkbox    (div)  — INSTANCE of klp Checkbox component (componentId: 35:1497). State prop forwarded from parent. fill/stroke/cornerRadius/padding owned by Checkbox component.
```

## Variants

Primary axis: **height** (row height tier). Secondary axis: **width** (column width constraint).

| height \ width | `48` (fixed 48px) | `default` (fluid) |
|---|---|---|
| `1` (compact, 48px) | [✓](.klp/figma-refs/table-cells-checkbox/height-1-width-48.png) | — |
| `2` (default, 56px) | — | [✓](.klp/figma-refs/table-cells-checkbox/height-2-width-default.png) |

> Note: `height-2-width-default-b` (figmaNodeId: 115189:58352) is a Figma duplicate of `height-2-width-default` — identical token bindings and layout. The adapter treats it as the same variant. (source: spec.json:variants[2].literals.note)

## API

`TableCellsCheckboxProps` extends `React.TdHTMLAttributes<HTMLTableCellElement>` (with `height` and `width` omitted from the HTML attribute set to avoid type conflict). All native `<td>` attributes except `height` and `width` pass through via `...props`.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `height` | `'1' \| '2'` | `'2'` | Row height tier: `'1'` = compact (48px cell, 8px vertical padding), `'2'` = default (56px cell, 12px vertical padding). |
| `width` | `'48' \| 'default'` | `'default'` | Column width constraint: `'48'` = 48px fixed, `'default'` = fluid (`w-full`). |
| `checked` | `CheckboxProps['checked']` | — | Controlled checked state of the embedded Checkbox. Pass `'indeterminate'` for mixed state. |
| `onCheckedChange` | `CheckboxProps['onCheckedChange']` | — | Callback fired when the checked state changes. |
| `checkboxDefaultChecked` | `CheckboxProps['defaultChecked']` | — | Default checked state (uncontrolled). Named `checkboxDefaultChecked` to avoid conflict with the HTML `<td>` `defaultChecked` attribute. |
| `disabled` | `CheckboxProps['disabled']` | — | Whether the embedded Checkbox is disabled. |
| `checkboxAriaLabel` | `string` | — | `aria-label` forwarded to the embedded Checkbox for accessibility. |

## Tokens

### `root` layer

| Property | Token | Resolved (klub) |
|---|---|---|
| fill | `--klp-bg-default` | `var(--klp-color-light-100)` |
| itemSpacing | `--klp-size-xs` | `var(--klp-spacing-2)` (8px) |
| paddingLeft | `literal: 12px` | — (token gap: unbound, expected `--klp-size-s`) |
| paddingRight | `literal: 12px` | — (token gap: unbound, expected `--klp-size-s`) |
| paddingTop (height=1) | `literal: 8px` | — (token gap: unbound, expected `--klp-size-xs`) |
| paddingBottom (height=1) | `literal: 8px` | — (token gap: unbound, expected `--klp-size-xs`) |
| paddingTop (height=2) | `literal: 12px` | — (token gap: unbound, expected `--klp-size-s`) |
| paddingBottom (height=2) | `literal: 12px` | — (token gap: unbound, expected `--klp-size-s`) |
| minHeight | `literal: 36px` | — (token gap: external cross-file Figma variable, no `--klp-size-*` alias for 36px) |

### `checkbox` layer

Token bindings for the embedded checkbox (fill, stroke, cornerRadius, padding) are fully delegated to the [Checkbox](./_index_checkbox.md) component. See that component's Tokens section for details. No additional wrapper classes are applied in this layer.

## Examples

```tsx
import { TableCellsCheckbox } from '@/components/table-cells-checkbox'

/**
 * Basic usage — uncontrolled checkbox inside a table row.
 * The checkbox is interactive by default (checkboxDefaultChecked).
 */
export function TableCellsCheckboxExample() {
  return (
    <table>
      <tbody>
        {/* Height=2 (default), fluid width — uncontrolled, starts checked */}
        <tr>
          <TableCellsCheckbox
            height="2"
            width="default"
            checkboxDefaultChecked
            checkboxAriaLabel="Select row"
          />
        </tr>
        {/* Height=1 (compact), fixed 48px width — uncontrolled, unchecked */}
        <tr>
          <TableCellsCheckbox
            height="1"
            width="48"
            checkboxAriaLabel="Select row"
          />
        </tr>
      </tbody>
    </table>
  )
}
```

## Accessibility

- **Role**: `cell` (rendered as `<td>`). The embedded `<Checkbox>` carries its own `role="checkbox"` and `aria-checked`.
- **Keyboard support**: `Space`, `Enter` — delegated to the embedded Checkbox primitive.
- **ARIA notes**: The parent table row should supply `aria-selected` or `data-state` context. No additional ARIA attributes are needed on the `<td>` cell itself. Use `checkboxAriaLabel` to label the embedded Checkbox for screen readers (e.g. "Select row"). (source: spec.json:a11y)

## Dependencies

### klp components
- [Checkbox](./_index_checkbox.md) — The cell embeds a live `<Checkbox>` instance. State is forwarded from the table row selection context via `checked` / `onCheckedChange` / `disabled`. The checkbox's own token bindings are owned by the Checkbox component. (source: src/components/table-cells-checkbox/TableCellsCheckbox.tsx:4)

### External libraries
- [@radix-ui/react-checkbox](https://www.npmjs.com/package/@radix-ui/react-checkbox) — Radix primitive providing the checkbox behavior and a11y (type forwarded via `CheckboxProps`). (source: spec.json:radixPrimitive)
- [class-variance-authority](https://www.npmjs.com/package/class-variance-authority) — `cva` used for the `rootVariants` block.

### Token groups
- [Colors](../tokens/colors.md) — `--klp-bg-default` on root fill.
- [Spacing](../tokens/spacing.md) — `--klp-size-xs` on root itemSpacing.

### Brands
- [klub](../brands/klub.md) — Figma reference screenshots captured under the klub brand.

## Used by

*Not yet used by any other klp component.*

## Files

- Source: [`src/components/table-cells-checkbox/TableCellsCheckbox.tsx`](../../src/components/table-cells-checkbox/TableCellsCheckbox.tsx)
- Example: [`src/components/table-cells-checkbox/TableCellsCheckbox.example.tsx`](../../src/components/table-cells-checkbox/TableCellsCheckbox.example.tsx)
- Playground: [`playground/routes/table-cells-checkbox.tsx`](../../playground/routes/table-cells-checkbox.tsx)
- Registry: [`registry/table-cells-checkbox.json`](../../registry/table-cells-checkbox.json)
- Figma spec: [`.klp/figma-refs/table-cells-checkbox/spec.json`](../../.klp/figma-refs/table-cells-checkbox/spec.json)
- Reference screenshots: [`.klp/figma-refs/table-cells-checkbox/`](../../.klp/figma-refs/table-cells-checkbox/)

<!-- KLP:GAPS:BEGIN -->
## Gaps

Token gaps recorded from `spec.json:tokenGaps` and source inspection. These are literals applied in the adapter because the corresponding Figma variables were unbound or cross-file at capture time.

| # | Kind | Part | Property | Figma literal | Expected token | Adapter class | Fix |
|---|------|------|----------|---------------|----------------|---------------|-----|
| 1 | `unbound-literal` | `root` | `paddingLeft` / `paddingRight` | `12px` | `--klp-size-s` | `pl-[12px] pr-[12px]` | Bind to `Sizing/S` variable in Figma, re-run pipeline. |
| 2 | `unbound-literal` | `root` | `paddingTop` / `paddingBottom` (height=1) | `8px` | `--klp-size-xs` | `pt-[8px] pb-[8px]` | Bind to `Sizing/XS` variable in Figma (height=1 variants), re-run pipeline. |
| 3 | `unbound-literal` | `root` | `paddingTop` / `paddingBottom` (height=2) | `12px` | `--klp-size-s` | `pt-[12px] pb-[12px]` | Bind to `Sizing/S` variable in Figma (height=2 variants), re-run pipeline. |
| 4 | `unbound-literal` | `root` | `minHeight` | `36px` | *(none — external cross-file variable `VariableID:1628ef2701274f14d27cbdbfc02f93663d1cc555/1050:1644`)* | `min-h-[36px]` | Add `--klp-size-row-sm` (36px) alias to alias spacing layer and re-run `pnpm sync:tokens`. Same gap seen in Table Cells / Empty and Table Cells / Text height=1. |
<!-- KLP:GAPS:END -->

<!-- KLP:NOTES:BEGIN -->
## Notes

*Manual prose preserved across regenerations. Anything between the BEGIN/END markers is never overwritten by the documentalist.*
<!-- KLP:NOTES:END -->
