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
usedBy:
  - tabulation-cells
created: 2026-04-16
updated: 2026-04-21
---

# Badge

Status indicator pill with optional leading/trailing icons. Supports 9 semantic types (Primary, Secondary, Tertiary, Success, Info, Warning, Danger, onEmphasis, Outlined), 3 sizes (Small, Medium, Large) and 2 styles (Bordered, Light). Outlined and onEmphasis only exist in Light style.

## Anatomy

```
span (root)
├── icon-left  (span) — Optional leading icon, 16×16px
├── label      (span) — Badge text content
└── icon-right (span) — Optional trailing icon, 16×16px
```

## Variants

| type \ style | bordered | light |
|---|---|---|
| primary | ✓ | ✓ |
| secondary | ✓ | ✓ |
| tertiary | ✓ | ✓ |
| success | ✓ | ✓ |
| info | ✓ | ✓ |
| warning | ✓ | ✓ |
| danger | ✓ | ✓ |
| on-emphasis | — | ✓ |
| outlined | — | ✓ |

Size axis: `small` / `medium` / `large` — controls padding and gap.

## Props usage

Extends `React.HTMLAttributes<HTMLSpanElement>`.

| Prop | Class | Type | Default | Description |
|---|---|---|---|---|
| `children` | **required** | `React.ReactNode` | — | Required badge content (text, number, etc.). |
| `badgeType` | optional | `BadgeType` | `"primary"` | Semantic type (color scheme) |
| `size` | optional | `BadgeSize` | `"medium"` | Size variant — controls padding and gap |
| `badgeStyle` | optional | `BadgeStyle` | `"bordered"` | Style variant — bordered adds a colored stroke, light removes it |
| `leftIcon` | optional | `React.ReactNode` | — | Optional leading icon |
| `rightIcon` | optional | `React.ReactNode` | — | Optional trailing icon |
| `asChild` | optional | `boolean` | `false` | Render as child element (Slot pattern) |

## Examples

```tsx
import { Badge } from './Badges'
import { Check } from 'lucide-react'

export function BadgeExample() {
  return (
    <div className="flex flex-wrap gap-3">
      <Badge badgeType="primary" size="medium" badgeStyle="bordered" leftIcon={<Check />} rightIcon={<Check />}>
        Label
      </Badge>
      <Badge badgeType="primary" size="medium" badgeStyle="light" leftIcon={<Check />} rightIcon={<Check />}>
        Label
      </Badge>
      <Badge badgeType="success" size="medium" badgeStyle="bordered" leftIcon={<Check />}>
        Label
      </Badge>
      <Badge badgeType="danger" size="small" badgeStyle="bordered">
        Label
      </Badge>
      <Badge badgeType="warning" size="large" badgeStyle="bordered" leftIcon={<Check />} rightIcon={<Check />}>
        Label
      </Badge>
    </div>
  )
}
```

## Accessibility

> ❓ UNVERIFIED: no a11y section in the Figma spec — review and add notes manually under ## Notes.

## Dependencies

### klp components

*Leaf component — no klp dependencies.*

### External libraries

- [@radix-ui/react-slot](https://www.npmjs.com/package/@radix-ui/react-slot) — asChild pattern
- [class-variance-authority](https://www.npmjs.com/package/class-variance-authority) — cva variant composition

### Token groups

- [Colors](../tokens/colors.md)
- [Spacing](../tokens/spacing.md)
- [Typography](../tokens/typography.md)

### Brands

- [wireframe](../brands/wireframe.md)

## Used by

- [Tabulation Cells](./_index_tabulation-cells.md)

## Files

- Source: [`src/components/badges/Badges.tsx`](../../src/components/badges/Badges.tsx)
- Example: [`src/components/badges/Badges.example.tsx`](../../src/components/badges/Badges.example.tsx)
- Playground: [`playground/routes/badges.tsx`](../../playground/routes/badges.tsx)
- Registry: [`registry/badges.json`](../../registry/badges.json)
- Figma spec: [`.klp/figma-refs/badges/spec.json`](../../.klp/figma-refs/badges/spec.json)
- Reference screenshots: [`.klp/figma-refs/badges/`](../../.klp/figma-refs/badges/)

<!-- KLP:GAPS:BEGIN -->
## DS gaps

No gaps recorded.
<!-- KLP:GAPS:END -->

<!-- KLP:NOTES:BEGIN -->
## Notes

*Manual prose preserved across regenerations. Anything between the BEGIN/END markers is never overwritten by the documentalist.*
<!-- KLP:NOTES:END -->
