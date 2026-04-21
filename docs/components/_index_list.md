---
title: List
type: component
status: stable
category: containers
captureBrand: klub
radixPrimitive: null
sources:
  - .klp/figma-refs/list/spec.json
  - src/components/list/List.tsx
dependencies:
  components: ["button", "list-content"]
  externals: ["class-variance-authority", "lucide-react"]
  tokenGroups: ["colors", "spacing", "typography"]
  brands: ["klub"]
usedBy: []
created: 2026-04-20
updated: 2026-04-21
---

# List

A data list container with a header row (title + optional action button or filter inputs) and a vertical stack of ListContent rows. Three layout styles: Default, Condensed, and With-inputs.

## Anatomy

```
div (root)
├── header (div)        — 40px height; space-between layout
│   ├── header-title (span)   — H2 typography
│   ├── header-button (Button) — Tertiary md + ArrowRight; hidden in with-inputs style
│   └── header-inputs (div)   — Slot for filter inputs; visible only in with-inputs style
└── items (div)         — Vertical stack of ListContent rows; gap-3xs
    └── ListContent[*]  — One row per item in the items[] prop
```

## Variants

| listStyle |
|---|
| default |
| condensed |
| with-inputs |

## Props usage

Extends `React.HTMLAttributes<HTMLDivElement>`.

| Prop | Class | Type | Default | Description |
|---|---|---|---|---|
| `items` | **required** | `ListItemConfig[]` | `[]` | Rows — each entry maps to a `<ListContent>` instance |
| `listStyle` | optional | `ListStyle` | `"default"` | Layout style variant |
| `listTitle` | optional | `React.ReactNode` | `"List title"` | Title text rendered in the header |
| `showButton` | optional | `boolean` | `true` | Whether to show the header action button (hidden in with-inputs) |
| `buttonLabel` | optional | `React.ReactNode` | `"See all"` | Label text for the header action button |
| `onButtonClick` | optional | `React.MouseEventHandler<HTMLButtonElement>` | — | Click handler for the header action button |
| `itemSize` | optional | `ListContentSize` | `"medium"` | Size passed down to each ListContent row |
| `headerInputs` | optional | `React.ReactNode` | — | Slot for filter inputs shown in the header when style="with-inputs" |

## Examples

```tsx
import { List } from '@/components/list'

export function ListExample() {
  return (
    <div className="flex flex-col gap-8 p-6 max-w-md">
      {/* Default style */}
      <List
        listStyle="default"
        listTitle="Recommended"
        buttonLabel="See all"
        itemSize="medium"
        items={[
          { key: 'item-1', label: 'First item', sublabel: 'Sublabel' },
          { key: 'item-2', label: 'Second item', sublabel: 'Sublabel' },
          { key: 'item-3', label: 'Third item', sublabel: 'Sublabel' },
        ]}
      />

      {/* Condensed style */}
      <List
        listStyle="condensed"
        listTitle="Recent"
        buttonLabel="See all"
        itemSize="small"
        items={[
          { key: 'item-1', label: 'First item', sublabel: 'Sublabel' },
          { key: 'item-2', label: 'Second item', sublabel: 'Sublabel' },
        ]}
      />
    </div>
  )
}
```

## Accessibility

- **Role**: `list` (native `role="list"` on root div)
- **Keyboard support**: ListContent rows are keyboard-focusable via their own pointer semantics. Tab to navigate.
- **ARIA notes**: Each ListContent renders with `role="listitem"`. The header button has no additional ARIA beyond its label text.

## Dependencies

### klp components

- [Button](./_index_button.md) — header-button renders as `<Button variant="tertiary" size="md">` with ArrowRight icon.
- [List Content](./_index_list-content.md) — each row in `items[]` renders as a `<ListContent>` instance.

### External libraries

- [class-variance-authority](https://www.npmjs.com/package/class-variance-authority) — cva variant composition
- [lucide-react](https://www.npmjs.com/package/lucide-react) — ArrowRight icon in header button

### Token groups

- [Colors](../tokens/colors.md)
- [Spacing](../tokens/spacing.md)
- [Typography](../tokens/typography.md)

### Brands

- [klub](../brands/klub.md)

## Used by

*Not yet used by any other klp component.*

## Files

- Source: [`src/components/list/List.tsx`](../../src/components/list/List.tsx)
- Example: [`src/components/list/List.example.tsx`](../../src/components/list/List.example.tsx)
- Playground: [`playground/routes/list.tsx`](../../playground/routes/list.tsx)
- Registry: [`registry/list.json`](../../registry/list.json)
- Figma spec: [`.klp/figma-refs/list/spec.json`](../../.klp/figma-refs/list/spec.json)
- Reference screenshots: [`.klp/figma-refs/list/`](../../.klp/figma-refs/list/)

<!-- KLP:GAPS:BEGIN -->
## DS gaps

| Part | Kind | Reason | Action |
|---|---|---|---|
| header-title | token-gap | color is literal `#2b2b2b` — no matching `--klp-fg-*` token covers this value | accepted-literal |
<!-- KLP:GAPS:END -->

<!-- KLP:NOTES:BEGIN -->
## Notes

*Manual prose preserved across regenerations. Anything between the BEGIN/END markers is never overwritten by the documentalist.*
<!-- KLP:NOTES:END -->
