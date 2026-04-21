---
title: Tooltip
type: component
status: stable
category: feedback
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
created: 2026-04-17
updated: 2026-04-21
---

# Tooltip

A floating tooltip bubble built on Radix Tooltip. Four arrow orientations control the placement (bottom-left, bottom-right, top-left, top-right). The `Tooltip` convenience wrapper accepts a `content` prop and wraps the compound Root + Trigger + Content. Individual parts (`TooltipProvider`, `TooltipRoot`, `TooltipTrigger`, `TooltipContent`) are exported for advanced usage.

## Anatomy

```
TooltipProvider            — app-level wrapping (delayDuration, skipDelayDuration)
└── TooltipRoot            — controls open state
    ├── TooltipTrigger     — element that activates the tooltip on hover/focus
    └── TooltipContent (portal)  — the styled bubble
        ├── label (span)   — tooltip text; fg-on-emphasis
        └── Arrow          — Radix SVG arrow; fill=bg-brand-contrasted
```

## Variants

| arrowOrientation |
|---|
| bottom-left (tooltip above trigger, arrow on bottom-left) |
| bottom-right |
| top-left (tooltip below trigger, arrow on top-left) |
| top-right |

## Props usage

### Tooltip (convenience wrapper)

| Prop | Class | Type | Default | Description |
|---|---|---|---|---|
| `content` | **required** | `React.ReactNode` | — | The tooltip bubble text |
| `children` | optional | `React.ReactNode` | — | The element that triggers the tooltip |
| `arrowOrientation` | optional | `ArrowOrientation` | `"bottom-left"` | Controls arrow placement and tooltip position |
| `open` | optional | `boolean` | — | Controlled open state |
| `defaultOpen` | optional | `boolean` | — | Uncontrolled default open state |
| `onOpenChange` | optional | `(open: boolean) => void` | — | Callback when open state changes |
| `delayDuration` | optional | `number` | — | Override delay in ms |

### TooltipContent

Extends `Omit<React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Content>, 'side' | 'align'>`.

| Prop | Class | Type | Default | Description |
|---|---|---|---|---|
| `arrowOrientation` | optional | `ArrowOrientation` | `"bottom-left"` | Controls arrow placement and tooltip position relative to the trigger |

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

- **Role**: `tooltip` (Radix sets `role="tooltip"` on the content element)
- **Keyboard support**: Tooltip shows on focus as well as hover. `Escape` closes.
- **ARIA notes**: Radix wires `aria-describedby` from trigger to tooltip content automatically.

## Dependencies

### klp components

*Leaf component — no klp dependencies.*

### External libraries

- [@radix-ui/react-tooltip](https://www.npmjs.com/package/@radix-ui/react-tooltip) — Tooltip.Provider, Root, Trigger, Content, Arrow
- [class-variance-authority](https://www.npmjs.com/package/class-variance-authority) — cva variant composition

### Token groups

- [Colors](../tokens/colors.md)
- [Spacing](../tokens/spacing.md)
- [Radius](../tokens/radius.md)
- [Typography](../tokens/typography.md)

### Brands

- [klub](../brands/klub.md)

## Used by

*Not yet used by any other klp component.*

## Files

- Source: [`src/components/tooltip/Tooltip.tsx`](../../src/components/tooltip/Tooltip.tsx)
- Example: [`src/components/tooltip/Tooltip.example.tsx`](../../src/components/tooltip/Tooltip.example.tsx)
- Playground: [`playground/routes/tooltip.tsx`](../../playground/routes/tooltip.tsx)
- Registry: [`registry/tooltip.json`](../../registry/tooltip.json)
- Figma spec: [`.klp/figma-refs/tooltip/spec.json`](../../.klp/figma-refs/tooltip/spec.json)
- Reference screenshots: [`.klp/figma-refs/tooltip/`](../../.klp/figma-refs/tooltip/)

<!-- KLP:GAPS:BEGIN -->
## DS gaps

No gaps recorded.
<!-- KLP:GAPS:END -->

<!-- KLP:NOTES:BEGIN -->
## Notes

*Manual prose preserved across regenerations. Anything between the BEGIN/END markers is never overwritten by the documentalist.*
<!-- KLP:NOTES:END -->
