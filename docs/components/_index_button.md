---
title: Button
type: component
status: stable
category: inputs
captureBrand: atlas
radixPrimitive: "@radix-ui/react-slot"
sources:
  - .klp/figma-refs/button/spec.json
  - src/components/button/Button.tsx
dependencies:
  components: []
  externals:
    - "@radix-ui/react-slot"
    - "class-variance-authority"
    - "lucide-react"
  tokenGroups:
    - colors
    - spacing
    - radius
    - typography
  brands:
    - atlas
usedBy: [floating-alert, list, list-content, pagination, text-area]
created: 2026-04-16
updated: 2026-04-17
---

# Button

Interactive button component with 5 type variants, 4 sizes, and 4 interaction states. Supports optional left/right icon slots. Built on Radix `Slot` (via `asChild`) so the consumer can swap the underlying element (e.g. `<a>` for link-buttons) without losing the styling.

## Anatomy

```
button
├── icon-left  (span)  — Optional, hidden if no leftIcon prop
├── label      (span)  — Hidden when size=icon
└── icon-right (span)  — Optional, hidden if no rightIcon prop
```

Each layer is styled by its own `cva` block in [`Button.tsx`](../../src/components/button/Button.tsx) (`rootVariants`, `labelVariants`, `iconVariants`). This isolation prevents text-color tokens from accidentally landing on the root element and prevents `tailwind-merge` from collapsing distinct utility classes.

## Variants

20 variants total (5 types × 4 sizes × 4 states, with selective coverage). Each cell links to the Figma reference screenshot in `.klp/figma-refs/button/`.

### `primary`

| | rest | hover | clicked | disable |
|---|---|---|---|---|
| **sm** | [✓](../../.klp/figma-refs/button/primary-sm-rest.png) | — | — | — |
| **md** | [✓](../../.klp/figma-refs/button/primary-md-rest.png) | [✓](../../.klp/figma-refs/button/primary-md-hover.png) | [✓](../../.klp/figma-refs/button/primary-md-clicked.png) | [✓](../../.klp/figma-refs/button/primary-md-disable.png) |
| **lg** | [✓](../../.klp/figma-refs/button/primary-lg-rest.png) | — | — | — |

### `secondary`

| | rest | hover | clicked | disable |
|---|---|---|---|---|
| **sm** | [✓](../../.klp/figma-refs/button/secondary-sm-rest.png) | — | — | — |
| **md** | [✓](../../.klp/figma-refs/button/secondary-md-rest.png) | — | — | — |
| **lg** | [✓](../../.klp/figma-refs/button/secondary-lg-rest.png) | — | — | — |

### `tertiary`

| | rest | hover | clicked | disable |
|---|---|---|---|---|
| **sm** | [✓](../../.klp/figma-refs/button/tertiary-sm-rest.png) | — | — | — |
| **md** | [✓](../../.klp/figma-refs/button/tertiary-md-rest.png) | — | — | — |
| **lg** | [✓](../../.klp/figma-refs/button/tertiary-lg-rest.png) | — | — | — |

### `destructive`

| | rest | hover | clicked | disable |
|---|---|---|---|---|
| **md** | [✓](../../.klp/figma-refs/button/destructive-md-rest.png) | [✓](../../.klp/figma-refs/button/destructive-md-hover.png) | [✓](../../.klp/figma-refs/button/destructive-md-clicked.png) | — |

### `validation`

| | rest | hover | clicked | disable |
|---|---|---|---|---|
| **md** | [✓](../../.klp/figma-refs/button/validation-md-rest.png) | — | — | — |

### `icon` (icon-only, square)

| type | rest | hover | clicked | disable |
|---|---|---|---|---|
| **primary** | [✓](../../.klp/figma-refs/button/icon-primary-rest.png) | — | — | — |
| **secondary** | [✓](../../.klp/figma-refs/button/icon-secondary-rest.png) | — | — | — |
| **tertiary** | [✓](../../.klp/figma-refs/button/icon-tertiary-rest.png) | — | — | — |
| **destructive** | [✓](../../.klp/figma-refs/button/icon-destructive-rest.png) | — | — | — |

> Only `primary` and `destructive` document the full `(rest × hover × clicked × disable)` matrix; other types document `rest` only at the moment. To add coverage, capture the missing variants in Figma and re-run `/klp-build-component Button`.

## API

`ButtonProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'type'>` — all native `<button>` attributes are accepted (with `type` renamed to `htmlType` to avoid colliding with the variant prop).

| Prop | Type | Default | Description |
|---|---|---|---|
| `variant` | `'primary' \| 'secondary' \| 'tertiary' \| 'destructive' \| 'validation'` | `'primary'` | Visual style variant. |
| `size` | `'sm' \| 'md' \| 'lg' \| 'icon'` | `'md'` | Size axis. `icon` renders a square (36×36) and hides the label. |
| `htmlType` | `'button' \| 'submit' \| 'reset'` | `'button'` | Native button type attribute. Renamed from `type` to free that name for the variant axis. |
| `asChild` | `boolean` | `false` | If true, renders the child element via Radix `Slot` instead of `<button>`. Useful for link-buttons (`<Button asChild><a href="..."/></Button>`). |
| `leftIcon` | `React.ReactNode` | — | Icon rendered before the label, in its own `<span aria-hidden="true">`. |
| `rightIcon` | `React.ReactNode` | — | Icon rendered after the label, in its own `<span aria-hidden="true">`. |
| `disabled` | `boolean` | `false` | Native disabled. Component also sets `aria-disabled` to keep the element focusable for screen readers. |
| `children` | `React.ReactNode` | — | The label. Hidden in `size="icon"` mode. |

## Tokens

Per-anatomy-layer bindings as captured in `spec.json`. Resolved values are shown for `captureBrand: atlas` (the brand the references were captured in). All tokens map to `klp-*` Tailwind utilities — see [`tokens/colors.md`](../tokens/colors.md), [`tokens/spacing.md`](../tokens/spacing.md), [`tokens/radius.md`](../tokens/radius.md), [`tokens/typography.md`](../tokens/typography.md).

### `root` layer

| Property | Token | Resolved (atlas) | Utility |
|---|---|---|---|
| background | `--klp-bg-brand` | `night-blue-700` | `bg-klp-bg-brand` |
| borderColor | `--klp-border-brand` | `night-blue-700` | `border-klp-border-brand` |
| borderRadius | `--klp-radius-l` | 12px | `rounded-klp-l` |
| paddingX | `--klp-size-{s,m,l}` per size | 12 / 16 / 24 px | `px-klp-size-{s,m,l}` |
| paddingY | `--klp-size-{2xs,xs,s}` per size | 6 / 8 / 12 px | `py-klp-size-{2xs,xs,s}` |
| gap | `--klp-size-2xs` | 6px | `gap-klp-size-2xs` |
| height | literal | 36 / 40 / 52 px per size | `h-[36px]` / `h-[40px]` / `h-[52px]` |

State changes per variant override `background` and/or `borderColor`. For example, `destructive` hover keeps the BG and switches to `border-2 border-klp-border-danger-contrasted`.

### `label` layer

| Property | Token | Resolved (atlas) | Utility |
|---|---|---|---|
| color | `--klp-fg-on-emphasis` (primary, destructive, validation) / `--klp-fg-brand` (secondary) / `--klp-fg-default` (tertiary) | `gray-100` / `night-blue-700` / `gray-800` | `text-klp-fg-*` |
| fontFamily | `--klp-font-family-label` | `Inter, Roboto, system-ui` | `font-klp-label` |
| fontSize | `--klp-font-size-text-medium` (sm/md/icon) / `--klp-font-size-text-large` (lg) | 14px / 16px (atlas dense scale) | `text-klp-text-medium` / `text-klp-text-large` |
| fontWeight | `--klp-font-weight-label-bold` (700 in atlas) | 700 | `font-bold` (workaround — see typography token doc) |
| lineHeight | literal | 16 / 24 / 28 px per size | inherited via `leading-none` on label |

### `icon-left` and `icon-right` layers

| Property | Token | Resolved (atlas) | Utility |
|---|---|---|---|
| color | (same as label color, per variant) | (same) | `text-klp-fg-*` (via `iconVariants`) |
| size | literal | 14 / 16 / 20 px per size | `[&>svg]:h-[14px] [&>svg]:w-[14px]` etc. |

Lucide icons consume `currentColor` for stroke, so wrapping them in a span with `text-klp-fg-*` propagates the color via inheritance.

## Examples


For a Lucide-based example (matching the playground):

```tsx
import { Check } from 'lucide-react'
import { Button } from '@/components/button'

<Button variant="primary" size="md" leftIcon={<Check />} rightIcon={<Check />}>Label</Button>
<Button variant="destructive" size="md" leftIcon={<Check />}>Delete</Button>
<Button variant="primary" size="icon" aria-label="Confirm"><Check /></Button>
```

## Accessibility

- **Role:** `button` (native semantics).
- **Keyboard support:** `Enter`, `Space`.
- **Disabled state:** uses `aria-disabled` rather than `disabled` so the element remains focusable for screen readers (announced as "disabled" without being skipped in tab order).
- **Icon-only buttons** (size=`icon`): consumer must pass `aria-label="..."`. The icon spans carry `aria-hidden="true"` to avoid duplicate announcements.
- **`asChild` mode:** when delegating to a child element (e.g. `<a>`), semantics follow the child. Make sure the child element is appropriate for the action (link vs button).

## Dependencies

### klp components

*Leaf component — no klp dependencies.*

### External libraries

- [@radix-ui/react-slot](https://www.npmjs.com/package/@radix-ui/react-slot) — `Slot` enables the `asChild` polymorphism.
- [class-variance-authority](https://www.npmjs.com/package/class-variance-authority) — `cva` declares per-layer variants.
- [lucide-react](https://www.npmjs.com/package/lucide-react) — icon library used in examples and playground.

### Token groups

- [colors](../tokens/colors.md) — `bg-*`, `fg-*`, `border-*`.
- [spacing](../tokens/spacing.md) — `size-*` (padding, gap, height).
- [radius](../tokens/radius.md) — `radius-l`.
- [typography](../tokens/typography.md) — `font-family-label`, `font-size-text-*`, `font-weight-label-bold`.

### Brands

- [atlas](../brands/atlas.md) — references captured in this brand.

## Used by

- [Floating Alert](./_index_floating-alert.md) — imports `Button` for the dismiss button slot.
- [List](./_index_list.md) — imports `Button` for the `header-button` slot (`variant="tertiary" size="md"`).
- [List Content](./_index_list-content.md) — imports `Button` for the right-side action button slot.
- [Pagination](./_index_pagination.md) — imports `Button` for the prev, next, and per-page-number interactive controls (`variant="tertiary" size="icon"`).
- [Text Area](./_index_text-area.md) — imports `Button` for the action bar confirm/cancel slots.

## Files

- Source: [`src/components/button/Button.tsx`](../../src/components/button/Button.tsx)
- Example: [`src/components/button/Button.example.tsx`](../../src/components/button/Button.example.tsx)
- Barrel: [`src/components/button/index.ts`](../../src/components/button/index.ts)
- Playground route: [`playground/routes/button.tsx`](../../playground/routes/button.tsx)
- Registry entry: [`registry/button.json`](../../registry/button.json)
- Figma spec: [`.klp/figma-refs/button/spec.json`](../../.klp/figma-refs/button/spec.json)
- Reference screenshots: [`.klp/figma-refs/button/`](../../.klp/figma-refs/button/)
- Verify config: [`.klp/figma-refs/button/verify.json`](../../.klp/figma-refs/button/verify.json) — per-variant tolerance overrides

<!-- KLP:NOTES:BEGIN -->
## Notes

*Manual prose preserved across regenerations. Anything between the BEGIN/END markers is never overwritten by the documentalist.*
<!-- KLP:NOTES:END -->

<!-- KLP:GAPS:BEGIN -->
## Gaps

No gaps recorded.
<!-- KLP:GAPS:END -->
