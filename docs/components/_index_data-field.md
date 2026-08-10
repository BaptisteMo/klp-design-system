---
title: DataField
type: component
status: stable
category: data-display
captureBrand: klub
radixPrimitive: none
sources:
  - src/components/data-field/DataField.tsx
  - registry/data-field.json
dependencies:
  components: []
  externals: ["class-variance-authority"]
  tokenGroups: ["colors", "spacing", "typography"]
  brands: ["klub"]
usedBy: []
created: 2026-08-10
updated: 2026-08-10
---

# DataField

Read-only display of a single labelled value: a muted label stacked above a `fg-default` value, 4px apart (source: `DataField.tsx`).

> ❓ UNVERIFIED: this component has no Figma spec — `.klp/figma-refs/data-field/spec.json` does not exist. `data-field` was not produced by the Figma extractor pipeline; everything on this page is derived from `src/components/data-field/DataField.tsx` and `registry/data-field.json` instead of a captured spec. `captureBrand` is read from `registry/data-field.json#meta.captureBrand` (also the playground's `CAPTURE_BRAND`), not from a `spec.json`.

DataField is the read-only counterpart to [Input](./_index_input.md). It is deliberately **not** a variant of Input: it is not a form control, so it has no border, no padding, no background, no focus ring, no validation states, and is not tab-reachable (source: `DataField.tsx`).

## Anatomy

```
data-field (root, div)
├── label (span, id={labelId})
└── value (span, aria-labelledby={labelId})
```

The label is associated to the value via `aria-labelledby` + `React.useId` (source: `DataField.tsx`). No reference PNGs exist for this component (no Figma capture).

## Variants

> The `emphasis` axis only swaps the value's font weight — never its size or color — so a `strong` field stays aligned with its neighbours in a stack (source: `DataField.tsx` — `valueVariants` cva comment).

| emphasis | variant |
|---|---|
| `default` | ✓ (source: `DataField.tsx:valueVariants`) |
| `strong` | ✓ (source: `DataField.tsx:valueVariants`) |

> ❓ UNVERIFIED: no reference screenshots exist for either variant (no Figma capture) — confirmed from `registry/data-field.json#meta.variantAxes` and the `valueVariants` cva block, not linked images.

## Props usage

Extends `React.ComponentPropsWithoutRef<'div'>` (omitting `children`).

| Prop | Type | Default | Class | Description |
|---|---|---|---|---|
| `label` | `React.ReactNode` | — | required | Field name, rendered muted above the value. |
| `value` | `React.ReactNode` | — | required | The read-only content. Strings keep their line breaks (`whitespace-pre-line`). |
| `emphasis` | `VariantProps<typeof valueVariants>['emphasis']` | `"default"` | optional | Weight of the value text. `strong` bolds it; size and color never change. |
| `emptyText` | `React.ReactNode` | `'—'` | optional | Rendered in place of `value` when it is empty (`undefined`, `null` or `''`). |

No `computed` or `persistent` props on this component — the Do / Don't block is omitted (nothing here is auto-derived from HTML attributes, and no prop carries cross-render semantic consumer state beyond the plain content it displays).

## Tokens

### `root` layer

| Property | Token | Resolved (captureBrand: klub) |
|---|---|---|
| gap | `--klp-size-xs` | `var(--klp-spacing-2)` → `8px` |

### `label` layer

| Property | Token | Resolved (captureBrand: klub) |
|---|---|---|
| font-family | `--klp-font-family-label` | `'Test Calibre', system-ui, sans-serif` |
| font-size | `--klp-font-size-text-small` | `14px` |
| color | `--klp-fg-muted` | `var(--klp-color-gray-700)` → `#5F6563` |

### `value` layer

| Property | Token | Resolved (captureBrand: klub) |
|---|---|---|
| font-family | `--klp-font-family-label` | `'Test Calibre', system-ui, sans-serif` |
| font-size | `--klp-font-size-text-medium` | `16px` |
| color | `--klp-fg-default` | `var(--klp-color-gray-800)` → `#1A211E` |
| font-weight (`emphasis="default"`) | `--klp-font-weight-label` | `400` |
| font-weight (`emphasis="strong"`) | `--klp-font-weight-label-bold` | `600` |
| white-space | literal | `literal: pre-line` (`whitespace-pre-line`, not a token) |
| word-break | literal | `literal: break-words` (not a token) |
| color (empty value) | `--klp-fg-subtle` | `var(--klp-color-gray-600)` → `#868E8B` (applied instead of `fg-default` when `value` is empty) |

## Examples

```tsx
import { DataField } from './DataField'

export function DataFieldExample() {
  return (
    <div className="flex w-[420px] flex-col gap-klp-size-m">
      <DataField
        label="Personalized message"
        value="Id ultricies a ullamcorper condimentum a id facilisi nec a suspendisse lobortis egestas sit vestibulum vestibulum adipiscing parturient dolor fringilla vestibulum a magna posuere volutpat."
      />
      <DataField label="Order reference" value="KLP-2026-00418" emphasis="strong" />
      <DataField label="Delivery note" value={null} />
    </div>
  )
}
```

## Accessibility

> ❓ UNVERIFIED: no `spec.json` exists for this component, so there is no captured a11y section to cite. The facts below are derived directly from `DataField.tsx` and have not been reviewed against a Figma a11y spec.

- **Role**: `generic` — plain `<div>` root, no ARIA role applied.
- **Keyboard support**: none. The component renders no interactive elements, sets no `tabIndex`, and is not a form control — it is never in the tab order.
- **ARIA notes**: the value `<span>` carries `aria-labelledby` pointing at the label `<span>`'s `id` (generated via `React.useId`), so assistive tech announces the label together with the value (source: `DataField.tsx`).

## Dependencies

### klp components

*Leaf component — no klp dependencies.*

### External libraries

- [class-variance-authority](https://www.npmjs.com/package/class-variance-authority) — `rootVariants` / `labelVariants` / `valueVariants` cva composition.

### Token groups

- [Colors](../tokens/colors.md)
- [Spacing](../tokens/spacing.md)
- [Typography](../tokens/typography.md)

## Used by

*Not yet used by any other klp component.*

## Files

- Source: [`src/components/data-field/DataField.tsx`](../../src/components/data-field/DataField.tsx)
- Example: [`src/components/data-field/DataField.example.tsx`](../../src/components/data-field/DataField.example.tsx)
- Playground: [`playground/routes/data-field.tsx`](../../playground/routes/data-field.tsx)
- Registry: [`registry/data-field.json`](../../registry/data-field.json)

> No Figma spec or reference screenshots exist for this component (`.klp/figma-refs/data-field/` was never created).

<!-- KLP:GAPS:BEGIN -->
## DS gaps

No gaps recorded.
<!-- KLP:GAPS:END -->

<!-- KLP:NOTES:BEGIN -->
## Notes

*Manual prose preserved across regenerations. Anything between the BEGIN/END markers is never overwritten by the documentalist.*
<!-- KLP:NOTES:END -->
