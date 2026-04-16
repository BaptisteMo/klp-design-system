---
title: Badge
type: component
status: stable
category: data-display
captureBrand: wireframe
radixPrimitive: "@radix-ui/react-slot"
sources:
  - .klp/figma-refs/badges/spec.json
  - src/components/badges/Badges.tsx
dependencies:
  components: []
  externals: ["@radix-ui/react-slot", "class-variance-authority"]
  tokenGroups: ["colors", "spacing", "typography"]
  brands: ["wireframe"]
usedBy: []
created: 2026-04-16
updated: 2026-04-16
---

# Badge

Status indicator pill with optional leading/trailing icons. Supports 9 semantic types (Primary, Secondary, Tertiary, Success, Info, Warning, Danger, onEmphasis, Outlined), 3 sizes (Small, Medium, Large) and 2 styles (Bordered, Light). Outlined and onEmphasis only exist in Light style.

## Anatomy

```
badge (root)  (span)  — Container; flex row, h-auto, 4px corner radius; padding and gap vary by size
├── icon-left  (span) — Optional leading icon; aria-hidden="true"; hidden if no leftIcon prop
├── label      (span) — Text label; always rendered when children are present
└── icon-right (span) — Optional trailing icon; aria-hidden="true"; hidden if no rightIcon prop
```

(source: spec.json:anatomy)

## Variants

The variant matrix is 9 types × 3 sizes × 2 styles = 54 theoretical cells. **Bordered** style does not exist for `on-emphasis` and `outlined` types, yielding 48 documented variants.

### type × style (size = medium, representative)

| type | bordered | light |
|---|---|---|
| primary | [✓](.klp/figma-refs/badges/primary-md-bordered.png) | [✓](.klp/figma-refs/badges/primary-md-light.png) |
| secondary | [✓](.klp/figma-refs/badges/secondary-md-bordered.png) | [✓](.klp/figma-refs/badges/secondary-md-light.png) |
| tertiary | [✓](.klp/figma-refs/badges/tertiary-md-bordered.png) | [✓](.klp/figma-refs/badges/tertiary-md-light.png) |
| success | [✓](.klp/figma-refs/badges/success-md-bordered.png) | [✓](.klp/figma-refs/badges/success-md-light.png) |
| info | [✓](.klp/figma-refs/badges/info-md-bordered.png) | [✓](.klp/figma-refs/badges/info-md-light.png) |
| warning | [✓](.klp/figma-refs/badges/warning-md-bordered.png) | [✓](.klp/figma-refs/badges/warning-md-light.png) |
| danger | [✓](.klp/figma-refs/badges/danger-md-bordered.png) | [✓](.klp/figma-refs/badges/danger-md-light.png) |
| on-emphasis | — | [✓](.klp/figma-refs/badges/on-emphasis-md-light.png) |
| outlined | — | [✓](.klp/figma-refs/badges/outlined-md-light.png) |

### type × size (style = bordered, where applicable)

| type | small | medium | large |
|---|---|---|---|
| primary | [✓](.klp/figma-refs/badges/primary-sm-bordered.png) | [✓](.klp/figma-refs/badges/primary-md-bordered.png) | [✓](.klp/figma-refs/badges/primary-lg-bordered.png) |
| secondary | [✓](.klp/figma-refs/badges/secondary-sm-bordered.png) | [✓](.klp/figma-refs/badges/secondary-md-bordered.png) | [✓](.klp/figma-refs/badges/secondary-lg-bordered.png) |
| tertiary | [✓](.klp/figma-refs/badges/tertiary-sm-bordered.png) | [✓](.klp/figma-refs/badges/tertiary-md-bordered.png) | [✓](.klp/figma-refs/badges/tertiary-lg-bordered.png) |
| success | [✓](.klp/figma-refs/badges/success-sm-bordered.png) | [✓](.klp/figma-refs/badges/success-md-bordered.png) | [✓](.klp/figma-refs/badges/success-lg-bordered.png) |
| info | [✓](.klp/figma-refs/badges/info-sm-bordered.png) | [✓](.klp/figma-refs/badges/info-md-bordered.png) | [✓](.klp/figma-refs/badges/info-lg-bordered.png) |
| warning | [✓](.klp/figma-refs/badges/warning-sm-bordered.png) | [✓](.klp/figma-refs/badges/warning-md-bordered.png) | [✓](.klp/figma-refs/badges/warning-lg-bordered.png) |
| danger | [✓](.klp/figma-refs/badges/danger-sm-bordered.png) | [✓](.klp/figma-refs/badges/danger-md-bordered.png) | [✓](.klp/figma-refs/badges/danger-lg-bordered.png) |
| on-emphasis | [✓](.klp/figma-refs/badges/on-emphasis-sm-light.png) | [✓](.klp/figma-refs/badges/on-emphasis-md-light.png) | [✓](.klp/figma-refs/badges/on-emphasis-lg-light.png) |
| outlined | [✓](.klp/figma-refs/badges/outlined-sm-light.png) | [✓](.klp/figma-refs/badges/outlined-md-light.png) | [✓](.klp/figma-refs/badges/outlined-lg-light.png) |

(source: spec.json:variants — 48 entries)

## API

`BadgeProps` extends `React.HTMLAttributes<HTMLSpanElement>`. All native `<span>` attributes are forwarded via the spread `...props` pattern.

| Prop | Type | Default | Description |
|---|---|---|---|
| `badgeType` | `'primary' \| 'secondary' \| 'tertiary' \| 'success' \| 'info' \| 'warning' \| 'danger' \| 'on-emphasis' \| 'outlined'` | `'primary'` | Semantic type — controls background, border, and text color scheme. |
| `size` | `'small' \| 'medium' \| 'large'` | `'medium'` | Size variant — controls padding and gap. |
| `badgeStyle` | `'bordered' \| 'light'` | `'bordered'` | Style variant — `bordered` adds a colored stroke, `light` removes it (border becomes transparent). Note: `on-emphasis` and `outlined` types only support `light`. |
| `leftIcon` | `React.ReactNode` | — | Optional leading icon node. Rendered inside a `<span aria-hidden="true">` wrapper with icon color matching the type. |
| `rightIcon` | `React.ReactNode` | — | Optional trailing icon node. Rendered inside a `<span aria-hidden="true">` wrapper with icon color matching the type. |
| `asChild` | `boolean` | `false` | Render child element in place of the default `<span>` (Slot pattern via `@radix-ui/react-slot`). |
| `className` | `string` | — | Additional Tailwind classes merged via `cn()`. |

(source: src/components/badges/Badges.tsx:BadgeProps)

## Tokens

### `root` layer

The root CVA block combines `type × badgeStyle` into a single `typeStyle` compound key, plus an independent `size` key.

| Property | Token | Resolved (wireframe) |
|---|---|---|
| fill (primary-\*) | `--klp-bg-brand-low` | `var(--klp-color-gray-300)` |
| stroke (primary-bordered) | `--klp-border-brand-emphasis` | `var(--klp-color-gray-700)` |
| stroke (primary-light) | `--klp-border-invisible` | `var(--klp-color-light-0)` |
| fill (secondary-\*) | `--klp-bg-secondary-brand-low` | `var(--klp-color-gray-300)` |
| stroke (secondary-bordered) | `--klp-border-secondary-brand-emphasis` | `var(--klp-color-gray-700)` |
| stroke (secondary-light) | `--klp-border-invisible` | `var(--klp-color-light-0)` |
| fill (tertiary-\*) | `--klp-bg-inset` | `var(--klp-color-gray-200)` |
| stroke (tertiary-bordered) | `--klp-border-contrasted` | `var(--klp-color-gray-600)` |
| stroke (tertiary-light) | `--klp-border-invisible` | `var(--klp-color-light-0)` |
| fill (success-\*) | `--klp-bg-success` | `var(--klp-color-gray-300)` |
| stroke (success-bordered) | `--klp-border-success-emphasis` | `var(--klp-color-gray-500)` |
| fill (info-\*) | `--klp-bg-info` | `var(--klp-color-gray-300)` |
| stroke (info-bordered) | `--klp-border-info-emphasis` | `var(--klp-color-gray-500)` |
| fill (warning-\*) | `--klp-bg-warning` | `var(--klp-color-gray-300)` |
| stroke (warning-bordered) | `--klp-border-warning-emphasis` | `var(--klp-color-gray-500)` |
| fill (danger-\*) | `--klp-bg-danger` | `var(--klp-color-gray-300)` |
| stroke (danger-bordered) | `--klp-border-danger-emphasis` | `var(--klp-color-gray-500)` |
| fill (on-emphasis-light) | `--klp-bg-invisible` | `var(--klp-color-light-0)` |
| stroke (on-emphasis-light) | `--klp-border-invisible` | `var(--klp-color-light-0)` |
| fill (outlined-light) | `--klp-bg-invisible` | `var(--klp-color-light-0)` |
| stroke (outlined-light) | `--klp-border-brand` | `var(--klp-color-gray-500)` |
| paddingX (small) | `--klp-size-xs` | `8px` |
| paddingY (small) | `--klp-size-2xs` | `6px` |
| gap (small) | `--klp-size-2xs` | `6px` |
| paddingX (medium) | `--klp-size-m` | `16px` |
| paddingY (medium) | `--klp-size-xs` | `8px` |
| gap (medium) | `--klp-size-2xs` | `6px` |
| paddingX (large) | `--klp-size-l` | `24px` |
| paddingY (large) | `--klp-size-s` | `12px` |
| gap (large) | `--klp-size-xs` | `8px` |
| cornerRadius | literal: `4px` | — |

### `label` layer

Text color depends on `badgeType` only (identical across `bordered` and `light` style within each type). Font properties are constant across all variants.

| Property | Token | Resolved (wireframe) |
|---|---|---|
| color (primary) | `--klp-fg-brand-contrasted` | `var(--klp-color-gray-800)` |
| color (secondary) | `--klp-fg-secondary-brand-contrasted` | `var(--klp-color-gray-800)` |
| color (tertiary) | `--klp-fg-default` | `var(--klp-color-gray-800)` |
| color (success) | `--klp-fg-success` | `var(--klp-color-gray-600)` |
| color (info) | `--klp-fg-info-contrasted` | `var(--klp-color-gray-800)` |
| color (warning) | `--klp-fg-warning` | `var(--klp-color-gray-600)` |
| color (danger) | `--klp-fg-danger` | `var(--klp-color-gray-600)` |
| color (on-emphasis) | `--klp-fg-muted` | `var(--klp-color-gray-700)` |
| color (outlined) | `--klp-fg-brand` | `var(--klp-color-gray-600)` |
| font-family | `--klp-font-family-body` | `'Inter', 'Test Calibre', system-ui, sans-serif` |
| font-weight | `--klp-font-weight-body` | `400` |
| font-size | `--klp-font-size-text-small` | `14px` |

(source: spec.json:variants[0].layers.label, src/components/badges/Badges.tsx:labelVariants)

### `icon-left` and `icon-right` layers

Icon color mapping is identical to the label color mapping above (source: src/components/badges/Badges.tsx:iconVariants). Icon size is a literal `16px × 16px` in all variants (source: spec.json:variants[0].layers.icon-left.literals.size).

## Examples

```tsx
import { Badge } from './Badges'

const CheckIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M13.3 4.3L6 11.6L2.7 8.3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

export function BadgeExample() {
  return (
    <div className="flex flex-wrap gap-3">
      {/* Primary badge — bordered, medium (default) */}
      <Badge badgeType="primary" size="medium" badgeStyle="bordered" leftIcon={<CheckIcon />} rightIcon={<CheckIcon />}>
        Label
      </Badge>

      {/* Primary badge — light */}
      <Badge badgeType="primary" size="medium" badgeStyle="light" leftIcon={<CheckIcon />} rightIcon={<CheckIcon />}>
        Label
      </Badge>

      {/* Success badge */}
      <Badge badgeType="success" size="medium" badgeStyle="bordered" leftIcon={<CheckIcon />}>
        Label
      </Badge>

      {/* Danger badge */}
      <Badge badgeType="danger" size="small" badgeStyle="bordered">
        Label
      </Badge>

      {/* Warning badge */}
      <Badge badgeType="warning" size="large" badgeStyle="bordered" leftIcon={<CheckIcon />} rightIcon={<CheckIcon />}>
        Label
      </Badge>

      {/* On-emphasis badge */}
      <Badge badgeType="on-emphasis" size="medium" badgeStyle="light" leftIcon={<CheckIcon />} rightIcon={<CheckIcon />}>
        Label
      </Badge>

      {/* Outlined badge */}
      <Badge badgeType="outlined" size="medium" badgeStyle="light" leftIcon={<CheckIcon />} rightIcon={<CheckIcon />}>
        Label
      </Badge>
    </div>
  )
}
```

(source: src/components/badges/Badges.example.tsx)

## Accessibility

- **Role:** `none` — Badge is a presentational inline element.
- **ARIA notes:** Wrap in a `<span>` with `aria-label` when used standalone. Parent context provides semantic role. Icon slots are rendered with `aria-hidden="true"` to prevent screen readers from announcing icon markup. (source: spec.json:a11y)

> ❓ UNVERIFIED: no keyboard support section in the Figma spec — Badge is non-interactive so no keyboard binding is expected, but confirm this assumption under the `## Notes` block if the component is ever made interactive (e.g. dismissible).

## Dependencies

### klp components

*Leaf component — no klp dependencies.*

### External libraries

- [@radix-ui/react-slot](https://www.npmjs.com/package/@radix-ui/react-slot) — Slot primitive enabling the `asChild` render pattern.
- [class-variance-authority](https://www.npmjs.com/package/class-variance-authority) — CVA for the three variant blocks: `rootVariants`, `labelVariants`, `iconVariants`.

### Token groups

- [Colors](../tokens/colors.md) — `bg-*`, `fg-*`, `border-*` aliases consumed across all 9 type × 2 style combinations.
- [Spacing](../tokens/spacing.md) — `size-xs`, `size-2xs`, `size-m`, `size-s`, `size-l` for padding and gap per size axis.
- [Typography](../tokens/typography.md) — `font-family-body`, `font-weight-body`, `font-size-text-small` on the label layer.

### Brands

- [wireframe](../brands/wireframe.md) — reference screenshots captured under the wireframe brand (48 variants).

## Used by

*Not yet used by any other klp component.*

## Files

- Source: [`src/components/badges/Badges.tsx`](../../src/components/badges/Badges.tsx)
- Example: [`src/components/badges/Badges.example.tsx`](../../src/components/badges/Badges.example.tsx)
- Playground: [`playground/routes/badges.tsx`](../../playground/routes/badges.tsx)
- Registry: [`registry/badges.json`](../../registry/badges.json)
- Figma spec: [`.klp/figma-refs/badges/spec.json`](../../.klp/figma-refs/badges/spec.json)
- Reference screenshots: [`.klp/figma-refs/badges/`](../../.klp/figma-refs/badges/)

<!-- KLP:NOTES:BEGIN -->
## Notes

*Manual prose preserved across regenerations. Anything between the BEGIN/END markers is never overwritten by the documentalist.*
<!-- KLP:NOTES:END -->
