---
title: List Content
type: component
status: stable
category: containers
captureBrand: klub
radixPrimitive: "@radix-ui/react-slot"
sources:
  - .klp/figma-refs/list-content/spec.json
  - src/components/list-content/ListContent.tsx
dependencies:
  components: ["button"]
  externals: ["@radix-ui/react-slot", "class-variance-authority", "lucide-react"]
  tokenGroups: ["colors", "spacing", "typography"]
  brands: ["klub"]
usedBy: ["list"]
created: 2026-04-20
updated: 2026-04-21
---

# List Content

A single list row with a decorative icon, label/sublabel stack, and an optional action button. Three sizes and three states (default, hover, active). The active state communicates the selected row.

## Anatomy

```
div (root)          — size + state variants; role=listitem
└── content-row (div)
    ├── left-part (div)
    │   ├── decorative-icon (span) — 20×20; color varies by state
    │   └── headline-stack (div)
    │       ├── label    (span)  — Primary text; color varies by state
    │       └── sublabel (span)  — Secondary text; always fg-muted
    └── action-button (Button/tertiary/icon) — MoreVertical icon; optional
```

## Variants

| size \ state | default | hover | active |
|---|---|---|---|
| small | ✓ | ✓ | ✓ |
| medium | ✓ | ✓ | ✓ |
| large | ✓ | ✓ | ✓ |

## Props usage

Extends `React.HTMLAttributes<HTMLDivElement>`.

| Prop | Class | Type | Default | Description |
|---|---|---|---|---|
| `state` | **persistent** | `ListContentState` | `"default"` | Interaction state — controls background fill and text/icon color. Represents the selected row in the list. |
| `size` | optional | `ListContentSize` | `"medium"` | Size variant — controls padding and sublabel font-size |
| `label` | optional | `React.ReactNode` | `"Label of the list"` | Primary label text |
| `sublabel` | optional | `React.ReactNode` | `"Sublabel"` | Secondary sublabel text |
| `showSublabel` | optional | `boolean` | `true` | Whether to show the sublabel |
| `showDecorativeIcon` | optional | `boolean` | `true` | Whether to show the left decorative icon |
| `decorativeIcon` | optional | `React.ReactNode` | — | Custom decorative icon — defaults to Plus from lucide-react |
| `showActionButton` | optional | `boolean` | `true` | Whether to show the right action button |
| `onActionClick` | optional | `React.MouseEventHandler<HTMLButtonElement>` | — | Callback for the action button click |
| `actionLabel` | optional | `string` | `"More options"` | aria-label for the action button |
| `asChild` | optional | `boolean` | `false` | Use Slot (asChild) pattern on the root |

### Do / Don't

**Do:** Set `state="active"` on the row that represents the currently selected item. The parent List or page context owns this value.

**Don't:** Derive `state` from local click events — the selection state is controlled by the parent (which item is the current selection in a list or navigation context).

**Do:** Pass `state="default"` for all unselected rows. CSS `:hover` adds the hover background automatically — no need to set `state="hover"` in interactive contexts.

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

- **Role**: `listitem` (set on root)
- **Keyboard support**: The action button is a standard focusable `<button>`.
- **ARIA notes**: Decorative icon is `aria-hidden`. Action button has `aria-label` via the `actionLabel` prop.

## Dependencies

### klp components

- [Button](./_index_button.md) — action-button renders as `<Button variant="tertiary" size="icon">` with MoreVertical icon.

### External libraries

- [@radix-ui/react-slot](https://www.npmjs.com/package/@radix-ui/react-slot) — asChild pattern on root
- [class-variance-authority](https://www.npmjs.com/package/class-variance-authority) — cva variant composition
- [lucide-react](https://www.npmjs.com/package/lucide-react) — Plus (default decorative icon), MoreVertical (action button)

### Token groups

- [Colors](../tokens/colors.md)
- [Spacing](../tokens/spacing.md)
- [Typography](../tokens/typography.md)

### Brands

- [klub](../brands/klub.md)

## Used by

- [List](./_index_list.md) — renders ListContent instances for each row in the `items[]` prop.

## Files

- Source: [`src/components/list-content/ListContent.tsx`](../../src/components/list-content/ListContent.tsx)
- Example: [`src/components/list-content/ListContent.example.tsx`](../../src/components/list-content/ListContent.example.tsx)
- Playground: [`playground/routes/list-content.tsx`](../../playground/routes/list-content.tsx)
- Registry: [`registry/list-content.json`](../../registry/list-content.json)
- Figma spec: [`.klp/figma-refs/list-content/spec.json`](../../.klp/figma-refs/list-content/spec.json)
- Reference screenshots: [`.klp/figma-refs/list-content/`](../../.klp/figma-refs/list-content/)

<!-- KLP:GAPS:BEGIN -->
## DS gaps

No gaps recorded.
<!-- KLP:GAPS:END -->

<!-- KLP:NOTES:BEGIN -->
## Notes

*Manual prose preserved across regenerations. Anything between the BEGIN/END markers is never overwritten by the documentalist.*
<!-- KLP:NOTES:END -->
