---
title: List Content
type: component
status: stable
category: list
captureBrand: wireframe
radixPrimitive: "@radix-ui/react-slot"
sources:
  - .klp/figma-refs/list-content/spec.json
  - src/components/list-content/ListContent.tsx
dependencies:
  components: []
  externals: ["@radix-ui/react-slot", "class-variance-authority", "lucide-react"]
  tokenGroups: ["colors", "spacing", "radius", "typography"]
  brands: ["wireframe"]
usedBy: []
created: 2026-04-17
updated: 2026-04-17
---

# List Content

A list row with a decorative icon on the left, label + sublabel text block, and an optional tertiary icon-button action on the right. Three sizes (Small, Medium, Large) and three interaction states (Default, Hover, Active).

## Anatomy

```
list-content
├── root            (div)     — Vertical layout container. Padding and item-spacing vary by size. Fill changes on hover/active states.
└── content         (div)     — Horizontal row: left-part + action-button. Always fills root width.
    ├── left-part   (div)     — Horizontal: decorative-icon + headline-subcontent. Fills content width.
    │   ├── decorative-icon (span)   — Icon wrapper. Fixed 20×20. Icon slot defaults to Plus, swappable via prop. Uses fg/default stroke.
    │   ├── label           (span)   — Primary text. fg/default color. Font: Family/Label, Weight/Label, Text/Medium size. Changes to fg/secondary-brand-contrasted on active.
    │   └── sublabel        (span)   — Secondary text. fg/muted color. Font: Family/Label, Weight/Label. Text/Small size (Small, Medium) or Text/Medium size (Large). Toggleable via prop.
    └── action-button (button) — Tertiary icon-only button (36×36). bg/invisible fill + bd/invisible border. Shows more-vertical icon. Toggleable via prop.
```

## Variants

Size × State matrix. All 9 combinations are documented with reference screenshots in `.klp/figma-refs/list-content/`.

| size \ state | default | hover | active |
|---|---|---|---|
| small | [✓](../../.klp/figma-refs/list-content/small-default.png) | [✓](../../.klp/figma-refs/list-content/small-hover.png) | [✓](../../.klp/figma-refs/list-content/small-active.png) |
| medium | [✓](../../.klp/figma-refs/list-content/medium-default.png) | [✓](../../.klp/figma-refs/list-content/medium-hover.png) | [✓](../../.klp/figma-refs/list-content/medium-active.png) |
| large | [✓](../../.klp/figma-refs/list-content/large-default.png) | [✓](../../.klp/figma-refs/list-content/large-hover.png) | [✓](../../.klp/figma-refs/list-content/large-active.png) |

## API

Extends `React.HTMLAttributes<HTMLDivElement>`. All native `div` attributes are forwarded to the root element.

| Prop | Type | Default | Description |
|---|---|---|---|
| `size` | `'small' \| 'medium' \| 'large'` | `'medium'` | Size variant — controls padding and sublabel font-size. |
| `state` | `'default' \| 'hover' \| 'active'` | `'default'` | Interaction state — controls background fill and text/icon color. |
| `label` | `React.ReactNode` | `'Label of the list'` | Primary label text. |
| `sublabel` | `React.ReactNode` | `'Sublabel'` | Secondary sublabel text. |
| `showSublabel` | `boolean` | `true` | Whether to show the sublabel. |
| `showDecorativeIcon` | `boolean` | `true` | Whether to show the left decorative icon. |
| `decorativeIcon` | `React.ReactNode` | `<Plus />` | Custom decorative icon — defaults to Plus from lucide-react. |
| `showActionButton` | `boolean` | `true` | Whether to show the right action button. |
| `onActionClick` | `React.MouseEventHandler<HTMLButtonElement>` | — | Callback for the action button click. |
| `actionLabel` | `string` | `'More options'` | `aria-label` for the action button. |
| `asChild` | `boolean` | `false` | Render child element in place of the root `<div>` using Radix Slot. |

## Tokens

### `root` layer

| Property | Token | Resolved (wireframe) |
|---|---|---|
| fill (hover state) | `--klp-bg-subtle` | `var(--klp-color-gray-100)` |
| fill (active state) | `--klp-bg-secondary-brand-low` | `var(--klp-color-gray-300)` |
| paddingTop / paddingBottom (small) | `--klp-size-xs` | `8px` |
| paddingLeft / paddingRight (small) | `--klp-size-xs` | `8px` |
| paddingTop / paddingBottom (medium) | `--klp-size-s` | `12px` |
| paddingLeft / paddingRight (medium) | `--klp-size-xs` | `8px` |
| paddingTop / paddingBottom (large) | `--klp-size-m` | `16px` |
| paddingLeft / paddingRight (large) | `--klp-size-s` | `12px` |
| itemSpacing (small) | `--klp-size-xs` | `8px` |
| itemSpacing (medium) | `--klp-size-s` | `12px` |
| itemSpacing (large) | `--klp-size-m` | `16px` |
| cornerRadius | `--klp-size-xs` | `8px` (= `--klp-radius-l` → `--klp-spacing-2`) |

### `decorative-icon` layer

| Property | Token | Resolved (wireframe) |
|---|---|---|
| color (default / hover) | `--klp-fg-default` | `var(--klp-color-gray-800)` |
| color (active) | `--klp-fg-secondary-brand-contrasted` | `var(--klp-color-gray-800)` |
| size | literal: `20px` | — |

### `label` layer

| Property | Token | Resolved (wireframe) |
|---|---|---|
| color (default / hover) | `--klp-fg-default` | `var(--klp-color-gray-800)` |
| color (active) | `--klp-fg-secondary-brand-contrasted` | `var(--klp-color-gray-800)` |
| fontSize | `--klp-font-size-text-medium` | `16px` |
| fontFamily | `--klp-font-family-label` | `Inter, Test Calibre, system-ui` |
| fontWeight | `--klp-font-weight-label` | `400` |
| lineHeight | literal: `24px` | — |

### `sublabel` layer

| Property | Token | Resolved (wireframe) |
|---|---|---|
| color | `--klp-fg-muted` | `var(--klp-color-gray-700)` |
| fontSize (small, medium) | `--klp-font-size-text-small` | `14px` |
| fontSize (large) | `--klp-font-size-text-medium` | `16px` |
| fontFamily | `--klp-font-family-label` | `Inter, Test Calibre, system-ui` |
| fontWeight | `--klp-font-weight-label` | `400` |
| lineHeight (small, medium) | literal: `20px` | — |
| lineHeight (large) | literal: `24px` | — |

### `action-button` layer

| Property | Token | Resolved (wireframe) |
|---|---|---|
| fill | `--klp-bg-invisible` | `var(--klp-color-light-0)` |
| stroke | `--klp-border-invisible` | `var(--klp-color-light-0)` |
| cornerRadius | `--klp-radius-l` | `12px` |
| padding | `--klp-size-xs` | `8px` |
| size | literal: `36px` | — |

## Examples

```tsx
import { ListContent } from './ListContent'

export function ListContentExample() {
  return (
    <ul className="flex flex-col divide-y divide-klp-border-default rounded-klp-l border border-klp-border-default bg-klp-bg-default w-[364px]">
      <li>
        <ListContent size="medium" state="default" label="Label of the list" sublabel="Sublabel" />
      </li>
      <li>
        <ListContent size="medium" state="hover" label="Label of the list" sublabel="Sublabel" />
      </li>
      <li>
        <ListContent size="medium" state="active" label="Label of the list" sublabel="Sublabel" />
      </li>
    </ul>
  )
}
```

## Accessibility

- **Role**: `listitem` — applied on the root element via `role="listitem"`.
- **Keyboard support**: Tab, Enter, Space — Tab reaches the action-button; Enter/Space activates it.
- **ARIA notes**: Root carries `role="listitem"`. The action-button is a native `<button>` with an explicit `aria-label` (defaults to `"More options"`). The decorative icon wrapper is `aria-hidden="true"`. The `MoreVertical` icon inside the action-button is also `aria-hidden="true"`.

(source: spec.json `a11y`)

## Dependencies

### klp components

*Leaf component — no klp dependencies.*

### External libraries

- [@radix-ui/react-slot](https://www.npmjs.com/package/@radix-ui/react-slot) — `Slot` used for the `asChild` pattern on the root element.
- [class-variance-authority](https://www.npmjs.com/package/class-variance-authority) — `cva` blocks for `rootVariants`, `decorativeIconVariants`, `labelVariants`, `sublabelVariants`, `actionButtonVariants`.
- [lucide-react](https://www.npmjs.com/package/lucide-react) — `Plus` (default decorative icon) and `MoreVertical` (action button icon).

### Token groups

- [Colors](../tokens/colors.md) — `bg-subtle`, `bg-secondary-brand-low`, `bg-invisible`, `fg-default`, `fg-muted`, `fg-secondary-brand-contrasted`, `border-invisible` aliases.
- [Spacing](../tokens/spacing.md) — `size-xs`, `size-s`, `size-m` for padding and gap across all three size variants.
- [Radius](../tokens/radius.md) — `rounded-klp-l` on root and `rounded-klp-l` on action-button.
- [Typography](../tokens/typography.md) — `font-klp-label`, `text-klp-text-medium`, `text-klp-text-small` across label and sublabel layers.

### Brands

- [wireframe](../brands/wireframe.md) — all 9 reference screenshots captured under the wireframe brand.

## Used by

*Not yet used by any other klp component.*

## Files

- Source: [`src/components/list-content/ListContent.tsx`](../../src/components/list-content/ListContent.tsx)
- Example: [`src/components/list-content/ListContent.example.tsx`](../../src/components/list-content/ListContent.example.tsx)
- Playground: [`playground/routes/list-content.tsx`](../../playground/routes/list-content.tsx)
- Registry: [`registry/list-content.json`](../../registry/list-content.json)
- Figma spec: [`.klp/figma-refs/list-content/spec.json`](../../.klp/figma-refs/list-content/spec.json)
- Reference screenshots: [`.klp/figma-refs/list-content/`](../../.klp/figma-refs/list-content/)

<!-- KLP:NOTES:BEGIN -->
## Notes

*Manual prose preserved across regenerations. Anything between the BEGIN/END markers is never overwritten by the documentalist.*
<!-- KLP:NOTES:END -->
