---
title: Card
type: component
status: stable
category: containers
captureBrand: klub
radixPrimitive: "@radix-ui/react-slot"
sources:
  - .klp/figma-refs/cards/spec.json
  - src/components/cards/Cards.tsx
dependencies:
  components: []
  externals: ["@radix-ui/react-slot", "class-variance-authority"]
  tokenGroups: ["colors"]
  brands: ["klub"]
usedBy: []
created: 2026-08-10
updated: 2026-08-10
---

# Card

Very basic card container with a rounded, bordered surface. Only variation is padding size (8px or 16px). Serves as the base primitive for all card-style elements; consumers pass arbitrary children (source: spec.json:description).

<!-- KLP:INTENT:BEGIN -->

## When to use

A rounded bordered surface that groups arbitrary children into one visual block, with 8px or 16px padding. The base primitive for every card-style element.

**Don't use it for:** Not as a floating overlay — modal-variation and action-sheet-menu bring their own surface. Not merely to add spacing between elements; it draws a border and a background.

## Don't confuse with

| Component | How to choose |
|---|---|
| `modal-variation` | cards sits in the page flow; modal-variation floats over it and blocks. |
| `collapsible` | cards is always fully visible; collapsible hides its content behind a toggle. |

<!-- KLP:INTENT:END -->
## Anatomy

```
div (root)
```

The Figma "ContentExemple"/"Content" children are illustrative demo content used to show usage, not part of the reusable card anatomy — the real component exposes a generic children slot (source: spec.json:anatomy[0].notes).

## Variants

| paddingSize | variant |
|---|---|
| 8px | ✓ |
| 16px | ✓ |

> ❓ UNVERIFIED (source: `.klp/figma-refs/cards/padding-8.png.FAILED`, `padding-16.png.FAILED`): reference screenshots for both padding-size variants failed to capture this session (expired Figma REST token). Both variants are confirmed from `spec.variants[]` layer data, not a linked image.

## Props usage

Extends `React.HTMLAttributes<HTMLDivElement>`.

| Prop | Type | Default | Class | Description |
|---|---|---|---|---|
| `children` | `React.ReactNode` | — | required | Generic content rendered inside the card surface. |
| `paddingSize` | `VariantProps<typeof rootVariants>['paddingSize']` | `"16px"` | optional | Padding density axis (maps to spec variantAxes.paddingSize). |
| `asChild` | `boolean` | `false` | optional | Render child element in place of the native `<div>` (e.g. an `<article>` or `<a>`). |

## Tokens

### `root` layer

| Property | Token | Resolved (captureBrand) |
|---|---|---|
| fill | `--klp-bg-default` | `var(--klp-color-light-100)` → `#FFFFFF` |
| stroke | `--klp-border-default` | `var(--klp-color-gray-400)` → `#D7DAD9` |
| cornerRadius | literal | `literal: 16px` |
| paddingX | literal | `literal: 8px / 16px` (paddingSize axis) |
| paddingY | literal | `literal: 8px / 16px` (paddingSize axis) |
| itemSpacing | literal | `literal: 8px` |
| strokeWeight | literal | `literal: 1px` |

## Examples

```tsx
import { Card } from './Cards'

export function CardExample() {
  return (
    <div className="flex flex-wrap items-start gap-klp-size-m">
      <Card paddingSize="8px">
        <p className="text-klp-text-small text-klp-fg-default">Compact card content</p>
      </Card>
      <Card paddingSize="16px">
        <p className="text-klp-text-medium text-klp-fg-default">Regular card content</p>
      </Card>
    </div>
  )
}
```

## Accessibility

- **Role**: `generic`
- **Keyboard support**: none
- **ARIA notes**: Purely presentational container. No interactive semantics — consumer content inside determines role/keyboard behavior (source: spec.json:a11y).

## Dependencies

### klp components

*Leaf component — no klp dependencies.*

### External libraries

- [@radix-ui/react-slot](https://www.npmjs.com/package/@radix-ui/react-slot) — asChild pattern
- [class-variance-authority](https://www.npmjs.com/package/class-variance-authority) — cva variant composition

### Token groups

- [Colors](../tokens/colors.md)

## Used by

*Not yet used by any other klp component.*

## Files

- Source: [`src/components/cards/Cards.tsx`](../../src/components/cards/Cards.tsx)
- Example: [`src/components/cards/Cards.example.tsx`](../../src/components/cards/Cards.example.tsx)
- Playground: [`playground/routes/cards.tsx`](../../playground/routes/cards.tsx)
- Registry: [`registry/cards.json`](../../registry/cards.json)
- Figma spec: [`.klp/figma-refs/cards/spec.json`](../../.klp/figma-refs/cards/spec.json)
- Reference screenshots: [`.klp/figma-refs/cards/`](../../.klp/figma-refs/cards/)

<!-- KLP:GAPS:BEGIN -->
## DS gaps

No gaps recorded.
<!-- KLP:GAPS:END -->

<!-- KLP:NOTES:BEGIN -->
## Notes

*Manual prose preserved across regenerations. Anything between the BEGIN/END markers is never overwritten by the documentalist.*
<!-- KLP:NOTES:END -->
