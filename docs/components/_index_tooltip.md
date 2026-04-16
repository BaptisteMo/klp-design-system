---
title: Tooltip
type: component
status: stable
category: overlay
captureBrand: klub
radixPrimitive: "@radix-ui/react-tooltip"
sources:
  - .klp/figma-refs/tooltip/spec.json
  - src/components/tooltip/Tooltip.tsx
dependencies:
  components: []
  externals: ["@radix-ui/react-tooltip", "class-variance-authority"]
  tokenGroups: ["colors", "spacing", "radius", "typography"]
  brands: ["klub"]
usedBy: []
created: 2026-04-16
updated: 2026-04-16
---

# Tooltip

Contextual tooltip bubble with a directional arrow. Variant axis controls arrow placement (BottomLeft, BottomRight, TopLeft, TopRight).

## Anatomy

```
tooltip
├── root   (div)  — Tooltip bubble container; receives the bg token and corner radius
├── label  (span) — Text content of the tooltip
└── arrow  (div)  — Directional caret; same fill token as root; positioned via CSS based on Arrow Orientation variant
```

## Variants

Single axis: **Arrow Orientation**. Each cell links to its reference screenshot.

| Arrow Orientation | Reference |
|---|---|
| `bottom-left` | [bottom-left.png](../../.klp/figma-refs/tooltip/bottom-left.png) |
| `bottom-right` | [bottom-right.png](../../.klp/figma-refs/tooltip/bottom-right.png) |
| `top-left` | [top-left.png](../../.klp/figma-refs/tooltip/top-left.png) |
| `top-right` | [top-right.png](../../.klp/figma-refs/tooltip/top-right.png) |

The `arrowOrientation` prop maps to a Radix `side` + `align` pair (source: `Tooltip.tsx:ORIENTATION_MAP`):

| arrowOrientation | Radix side | Radix align |
|---|---|---|
| `bottom-left` | `top` | `start` |
| `bottom-right` | `top` | `end` |
| `top-left` | `bottom` | `start` |
| `top-right` | `bottom` | `end` |

## API

### `TooltipContent`

Extends `React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Content>`, omitting `side` and `align` (those are derived from `arrowOrientation`).

| Prop | Type | Default | Description |
|---|---|---|---|
| `arrowOrientation` | `'bottom-left' \| 'bottom-right' \| 'top-left' \| 'top-right'` | `'bottom-left'` | Controls arrow placement and tooltip position relative to the trigger. |
| `className` | `string` | — | Additional CSS classes merged via `cn()`. |
| `children` | `React.ReactNode` | — | Tooltip bubble content (text or nodes). |

### `Tooltip` (convenience wrapper)

| Prop | Type | Default | Description |
|---|---|---|---|
| `content` | `React.ReactNode` | — | The tooltip bubble text. |
| `children` | `React.ReactNode` | — | The element that triggers the tooltip. |
| `arrowOrientation` | `'bottom-left' \| 'bottom-right' \| 'top-left' \| 'top-right'` | `'bottom-left'` | Controls arrow placement and tooltip position. |
| `open` | `boolean` | — | Controlled open state. |
| `defaultOpen` | `boolean` | — | Uncontrolled default open state. |
| `onOpenChange` | `(open: boolean) => void` | — | Callback when open state changes. |
| `delayDuration` | `number` | — | Override Radix default delay in ms before tooltip shows. |

### Re-exported primitives

The following Radix parts are re-exported for compound usage:

| Export | Radix primitive |
|---|---|
| `TooltipProvider` | `TooltipPrimitive.Provider` |
| `TooltipRoot` | `TooltipPrimitive.Root` |
| `TooltipTrigger` | `TooltipPrimitive.Trigger` |

## Tokens

### `root` layer

| Property | Token | Resolved (klub) |
|---|---|---|
| fill | `--klp-bg-brand-contrasted` | `var(--klp-color-emerald-700)` |
| cornerRadius | `--klp-radius-m` (token gap, accepted) | `var(--klp-radius-base)` |
| padding | `--klp-size-xs` (token gap, accepted) | `var(--klp-spacing-2)` |
| backdropFilter | literal: `blur(10px)` | — |

> The Figma spec binds `cornerRadius` and `padding` as hardcoded literals. The component source resolves these as `--klp-radius-m` and `--klp-size-xs` respectively (token gaps accepted — source: `spec.json:tokenGaps`).

### `label` layer

| Property | Token | Resolved (klub) |
|---|---|---|
| color | `--klp-fg-on-emphasis` (token gap, accepted) | `var(--klp-color-gray-100)` |
| fontSize | `--klp-font-size-text-medium` (token gap, accepted) | `16px` |
| fontFamily | `--klp-font-family-body` (via `font-klp-body`) | `'Inter', 'Test Calibre', system-ui, sans-serif` |
| fontWeight | `--klp-font-weight-body` (via `font-weight-klp-body`) | `400` |

> The Figma spec binds `color`, `fontSize`, `fontFamily`, and `fontWeight` as hardcoded literals. The component source maps these to semantic tokens (source: `spec.json:tokenGaps`).

### `arrow` layer

| Property | Token | Resolved (klub) |
|---|---|---|
| fill | `--klp-bg-brand-contrasted` | `var(--klp-color-emerald-700)` |
| width | literal: `22px` | — |
| height | literal: `11px` | — |

## Examples

```tsx
import { TooltipProvider, Tooltip } from './Tooltip'

export function TooltipExample() {
  return (
    <TooltipProvider>
      <Tooltip content="Tooltip label" arrowOrientation="bottom-left">
        <button type="button">Hover me</button>
      </Tooltip>
    </TooltipProvider>
  )
}
```

## Accessibility

- **Role**: `tooltip` — applied automatically by Radix to `TooltipPrimitive.Content`.
- **Keyboard support**: Radix Tooltip handles show/hide on focus and hover. No additional keyboard bindings required on the consumer side.
- **ARIA notes**: Always associate with a trigger via `TooltipTrigger`. Content receives `role=tooltip` automatically. (source: `spec.json:a11y`)

## Dependencies

### klp components

*Leaf component — no klp dependencies.*

### External libraries

- [@radix-ui/react-tooltip](https://www.npmjs.com/package/@radix-ui/react-tooltip) — Radix primitive providing accessible tooltip behavior, portal rendering, and `role=tooltip`.
- [class-variance-authority](https://www.npmjs.com/package/class-variance-authority) — Variant class composition for `rootVariants`, `labelVariants`, `arrowVariants`.

### Token groups

- [Colors](../tokens/colors.md) — `--klp-bg-brand-contrasted`, `--klp-fg-on-emphasis`
- [Spacing](../tokens/spacing.md) — `--klp-size-xs`
- [Radius](../tokens/radius.md) — `--klp-radius-m`
- [Typography](../tokens/typography.md) — `--klp-font-size-text-medium`, `--klp-font-family-body`, `--klp-font-weight-body`

### Brands

- [klub](../brands/klub.md) — reference screenshots captured under the klub brand

## Used by

*Not yet used by any other klp component.*

## Files

- Source: [`src/components/tooltip/Tooltip.tsx`](../../src/components/tooltip/Tooltip.tsx)
- Example: [`src/components/tooltip/Tooltip.example.tsx`](../../src/components/tooltip/Tooltip.example.tsx)
- Playground: [`playground/routes/tooltip.tsx`](../../playground/routes/tooltip.tsx)
- Registry: [`registry/tooltip.json`](../../registry/tooltip.json)
- Figma spec: [`.klp/figma-refs/tooltip/spec.json`](../../.klp/figma-refs/tooltip/spec.json)
- Reference screenshots: [`.klp/figma-refs/tooltip/`](../../.klp/figma-refs/tooltip/)

<!-- KLP:NOTES:BEGIN -->
## Notes

*Manual prose preserved across regenerations. Anything between the BEGIN/END markers is never overwritten by the documentalist.*
<!-- KLP:NOTES:END -->
