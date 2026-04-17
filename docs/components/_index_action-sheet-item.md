---
title: ActionSheet Item
type: component
status: stable
category: overlays
captureBrand: wireframe
radixPrimitive: "@radix-ui/react-slot"
sources:
  - .klp/figma-refs/action-sheet-item/spec.json
  - src/components/action-sheet-item/ActionSheetItem.tsx
dependencies:
  components: []
  externals:
    - "@radix-ui/react-slot"
    - class-variance-authority
    - lucide-react
  tokenGroups:
    - colors
    - spacing
    - typography
  brands:
    - wireframe
usedBy: []
created: 2026-04-17
updated: 2026-04-17
---

# ActionSheet Item

A single row item for action sheets. Supports icon slots on both sides, an optional description label, and seven semantic states (Default, Hover, Active, Emphased, Disabled, Destructive, Creation) across three sizes.

## Anatomy

```
action-sheet-item
├── root        (button)  — Full-width horizontal layout; fill=FIXED, counter=HUG. Uses Slot when asChild.
├── icon-left   (span)    — Icon selector instance; 20×20px container wrapping a 16×16px lucide icon. Optional via firstIcon prop.
├── content     (span)    — Vertical flex column filling remaining width; contains label and optional description.
│   ├── label       (span)    — Primary action text. fontFamily=Family/Label, fontSize=Sizing/Text/Medium.
│   └── description (span)    — Optional sublabel. Rendered when description prop is provided.
└── icon-right  (span)    — Second action icon selector instance; 20×20px. Optional via secondAction prop.
```

## Variants

State × Size matrix. `✓` = documented in spec with reference screenshot; `—` = not documented.

| State \ Size | `lg` | `md` | `sm` |
|---|---|---|---|
| `default` | [✓](../../.klp/figma-refs/action-sheet-item/default-lg-default.png) | [✓](../../.klp/figma-refs/action-sheet-item/default-md-default.png) | [✓](../../.klp/figma-refs/action-sheet-item/default-sm-default.png) |
| `hover` | [✓](../../.klp/figma-refs/action-sheet-item/default-lg-hover.png) | [✓](../../.klp/figma-refs/action-sheet-item/default-md-hover.png) | [✓](../../.klp/figma-refs/action-sheet-item/default-sm-hover.png) |
| `active` | [✓](../../.klp/figma-refs/action-sheet-item/default-lg-active.png) | [✓](../../.klp/figma-refs/action-sheet-item/default-md-active.png) | [✓](../../.klp/figma-refs/action-sheet-item/default-sm-active.png) |
| `emphased` | [✓](../../.klp/figma-refs/action-sheet-item/emphased-lg-default.png) | [✓](../../.klp/figma-refs/action-sheet-item/emphased-md-default.png) | [✓](../../.klp/figma-refs/action-sheet-item/emphased-sm-default.png) |
| `disabled` | [✓](../../.klp/figma-refs/action-sheet-item/disabled-lg-default.png) | [✓](../../.klp/figma-refs/action-sheet-item/disabled-md-default.png) | [✓](../../.klp/figma-refs/action-sheet-item/disabled-sm-default.png) |
| `destructive` | [✓](../../.klp/figma-refs/action-sheet-item/destructive-lg-default.png) | [✓](../../.klp/figma-refs/action-sheet-item/destructive-md-default.png) | [✓](../../.klp/figma-refs/action-sheet-item/destructive-sm-default.png) |
| `creation` | [✓](../../.klp/figma-refs/action-sheet-item/creation-lg-default.png) | [✓](../../.klp/figma-refs/action-sheet-item/creation-md-default.png) | [✓](../../.klp/figma-refs/action-sheet-item/creation-sm-default.png) |

**Total: 21 documented variants** (source: spec.json:variants[])

## API

Extends `React.ButtonHTMLAttributes<HTMLButtonElement>`. Native HTML button attributes are forwarded to the underlying `<button>` element (or the child element when `asChild` is true). The `disabled` HTML attribute automatically resolves `state` to `"disabled"`.

| Prop | Type | Default | Description |
|---|---|---|---|
| `state` | `'default' \| 'hover' \| 'active' \| 'emphased' \| 'disabled' \| 'destructive' \| 'creation'` | `'default'` | Visual semantic state of the item. Setting `disabled={true}` overrides this to `'disabled'`. |
| `size` | `'lg' \| 'md' \| 'sm'` | `'lg'` | Controls padding, gap, height, and border-radius (source: spec.json:variantAxes.size). |
| `asChild` | `boolean` | `false` | Render child element in place of `<button>` via Radix Slot. |
| `firstIcon` | `React.ReactNode` | — | Left icon slot. Renders a 20×20px container wrapping the provided icon at 16×16px. Hidden when falsy. |
| `secondAction` | `React.ReactNode` | — | Right icon slot. Same sizing as `firstIcon`. Hidden when falsy. |
| `description` | `React.ReactNode` | — | Optional sublabel rendered below the primary label text in the content column. |
| `children` | `React.ReactNode` | — | Primary label text rendered in the `label` span. |
| `className` | `string` | — | Additional classes merged via `cn()` onto the root element. |

## Tokens

### `root` layer

| Property | Token | Resolved (wireframe) |
|---|---|---|
| fill — default | `--klp-bg-invisible` | `var(--klp-color-light-0)` |
| fill — hover | `--klp-bg-subtle` | `var(--klp-color-gray-100)` |
| fill — active | `--klp-bg-brand-low` | `var(--klp-color-gray-300)` |
| fill — emphased | `--klp-bg-inset` | `var(--klp-color-gray-200)` |
| fill — disabled | `--klp-bg-disable` | `var(--klp-color-gray-200)` |
| fill — destructive | `--klp-bg-danger` | `var(--klp-color-gray-300)` |
| fill — creation | `--klp-bg-success` | `var(--klp-color-gray-300)` |
| stroke — default/hover/disabled/destructive/creation | `--klp-border-invisible` | `var(--klp-color-light-0)` |
| stroke — active | `--klp-border-brand` | `var(--klp-color-gray-500)` |
| stroke — emphased | `literal: transparent` | — |
| paddingX — lg | `--klp-size-m` | `var(--klp-spacing-4)` → 16px |
| paddingY — lg | `--klp-size-m` | `var(--klp-spacing-4)` → 16px |
| gap — lg | `--klp-size-s` | `var(--klp-spacing-3)` → 12px |
| paddingX — md | `--klp-size-s` | `var(--klp-spacing-3)` → 12px |
| paddingY — md | `--klp-size-s` | `var(--klp-spacing-3)` → 12px |
| gap — md | `--klp-size-xs` | `var(--klp-spacing-2)` → 8px |
| paddingX — sm | `--klp-size-xs` | `var(--klp-spacing-2)` → 8px |
| paddingY — sm | `--klp-size-xs` | `var(--klp-spacing-2)` → 8px |
| gap — sm | `--klp-size-xs` | `var(--klp-spacing-2)` → 8px |
| height | `literal: 56px / 48px / 40px` | — |
| cornerRadius | `literal: 8px (lg/sm) / 4px (md)` | — |

> ❓ UNVERIFIED: cornerRadius is bound to cross-file Figma variable IDs (278:2851, 278:2849). No local alias name resolved. Values recorded as literals `8px` and `4px` (source: spec.json:_notes.cornerRadiusGap).

### `icon-left` and `icon-right` layers

| Property | Token | Resolved (wireframe) |
|---|---|---|
| color — default/hover/active/emphased | `--klp-fg-default` | `var(--klp-color-gray-800)` |
| color — disabled | `--klp-fg-disable` | `var(--klp-color-gray-500)` |
| color — destructive | `--klp-fg-danger-contrasted` | `var(--klp-color-gray-800)` |
| color — creation | `--klp-fg-success-contrasted` | `var(--klp-color-gray-800)` |
| icon size | `literal: 16px` | — |
| container size | `literal: 20px` | — |

### `label` layer

| Property | Token | Resolved (wireframe) |
|---|---|---|
| color — default/hover/active/emphased | `--klp-fg-default` | `var(--klp-color-gray-800)` |
| color — disabled | `--klp-fg-disable` | `var(--klp-color-gray-500)` |
| color — destructive | `--klp-fg-danger-contrasted` | `var(--klp-color-gray-800)` |
| color — creation | `--klp-fg-success-contrasted` | `var(--klp-color-gray-800)` |
| fontSize | `--klp-font-size-text-medium` | `16px` |
| fontFamily | `--klp-font-family-label` | `'Inter', 'Test Calibre', system-ui, sans-serif` |
| fontWeight | `--klp-font-weight-label` | `400` |
| lineHeight | `literal: 24px` | — |

## Examples

```tsx
import { Plus } from 'lucide-react'
import { ActionSheetItem } from './ActionSheetItem'

export function ActionSheetItemExample() {
  return (
    <div className="flex w-80 flex-col gap-2">
      <ActionSheetItem
        state="default"
        size="lg"
        firstIcon={<Plus strokeWidth={1.5} />}
        secondAction={<Plus strokeWidth={1.5} />}
      >
        Label action
      </ActionSheetItem>

      <ActionSheetItem
        state="destructive"
        size="lg"
        firstIcon={<Plus strokeWidth={1.5} />}
      >
        Delete item
      </ActionSheetItem>

      <ActionSheetItem
        state="creation"
        size="md"
        firstIcon={<Plus strokeWidth={1.5} />}
      >
        Create new
      </ActionSheetItem>

      <ActionSheetItem state="disabled" size="md" disabled>
        Unavailable action
      </ActionSheetItem>
    </div>
  )
}
```

## Accessibility

- **Role**: `button` (native `<button>` element, or delegated via `asChild`)
- **Keyboard support**: `Enter`, `Space`
- **ARIA notes**: `aria-disabled` is set to `true` when the resolved state is `disabled`. Destructive items should carry `aria-label` clarifying irreversibility. The `asChild` pattern delegates rendering to a child element via Radix Slot — consumer is responsible for ensuring the child has appropriate role and keyboard handling.

(source: spec.json:a11y)

## Dependencies

### klp components

*Leaf component — no klp dependencies.*

### External libraries

- [@radix-ui/react-slot](https://www.npmjs.com/package/@radix-ui/react-slot) — Radix Slot primitive enabling the `asChild` pattern (source: spec.json:radixPrimitive)
- [class-variance-authority](https://www.npmjs.com/package/class-variance-authority) — CVA for variant class composition
- [lucide-react](https://www.npmjs.com/package/lucide-react) — icon library used in examples and expected by icon slot props

### Token groups

- [Colors](../tokens/colors.md) — `bg-*`, `fg-*`, `border-*` aliases
- [Spacing](../tokens/spacing.md) — `size-*` scale for padding and gap
- [Typography](../tokens/typography.md) — `font-family-label`, `font-weight-label`, `font-size-text-medium`

### Brands

- [wireframe](../brands/wireframe.md) — component was captured and validated under the wireframe brand

## Used by

*Not yet used by any other klp component.*

## Files

- Source: [`src/components/action-sheet-item/ActionSheetItem.tsx`](../../src/components/action-sheet-item/ActionSheetItem.tsx)
- Example: [`src/components/action-sheet-item/ActionSheetItem.example.tsx`](../../src/components/action-sheet-item/ActionSheetItem.example.tsx)
- Playground: [`playground/routes/action-sheet-item.tsx`](../../playground/routes/action-sheet-item.tsx)
- Registry: [`registry/action-sheet-item.json`](../../registry/action-sheet-item.json)
- Figma spec: [`.klp/figma-refs/action-sheet-item/spec.json`](../../.klp/figma-refs/action-sheet-item/spec.json)
- Reference screenshots: [`.klp/figma-refs/action-sheet-item/`](../../.klp/figma-refs/action-sheet-item/)

<!-- KLP:NOTES:BEGIN -->
## Notes

*Manual prose preserved across regenerations. Anything between the BEGIN/END markers is never overwritten by the documentalist.*
<!-- KLP:NOTES:END -->

<!-- KLP:GAPS:BEGIN -->
## Gaps

No gaps recorded.
<!-- KLP:GAPS:END -->
