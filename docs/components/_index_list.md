---
title: List
type: component
status: stable
category: lists
captureBrand: wireframe
radixPrimitive: null
sources:
  - .klp/figma-refs/list/spec.json
  - src/components/list/List.tsx
dependencies:
  components:
    - button
    - list-content
  externals:
    - class-variance-authority
    - lucide-react
  tokenGroups:
    - colors
    - spacing
    - radius
    - typography
  brands:
    - wireframe
usedBy: []
created: 2026-04-17
updated: 2026-04-17
---

# List

A vertical list container with header, optional action button, and repeated List_content rows. Supports Condensed (tight spacing), Default (medium spacing), and withInputs (with filter inputs in the header) layout styles.

## Anatomy

```
list
├── root           (div)     — Outer wrapper; vertical flex column, gap controlled by itemSpacing token
├── header         (div)     — Horizontal flex row with title + optional action button or input filters
│   ├── header-title  (span)    — List title text; H2 typography token. Color is a literal (#2b2b2b — see Gaps)
│   ├── header-button (button)  — Optional action button (Tertiary/Medium); hidden when style=with-inputs or showButton=false
│   └── header-inputs (div)     — with-inputs variant only: horizontal flex row of Input instances; hidden otherwise
└── items          (div)     — Vertical stack of List_content rows; gap = size-3xs
```

## Variants

Single variant axis: **style**.

| style | Reference screenshot |
|-------|----------------------|
| `condensed` | [condensed.png](../../.klp/figma-refs/list/condensed.png) |
| `default` | [default.png](../../.klp/figma-refs/list/default.png) |
| `with-inputs` | [with-inputs.png](../../.klp/figma-refs/list/with-inputs.png) |

## API

`ListProps` extends `React.HTMLAttributes<HTMLDivElement>`. All native `div` attributes are forwarded to the root element.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `listStyle` | `'condensed' \| 'default' \| 'with-inputs'` | `'default'` | Layout style variant — controls header-button visibility and header-inputs visibility. |
| `listTitle` | `React.ReactNode` | `'List title'` | Title text rendered in the header. |
| `showButton` | `boolean` | `true` | Whether to show the header action button. The button is additionally hidden when `listStyle='with-inputs'` via CSS. |
| `buttonLabel` | `React.ReactNode` | `'See all'` | Label text for the header action button. |
| `onButtonClick` | `React.MouseEventHandler<HTMLButtonElement>` | — | Click handler for the header action button. |
| `itemSize` | `ListContentSize` | `'medium'` | Size passed down to each `ListContent` row. Accepts `'small' \| 'medium' \| 'large'`. |
| `items` | `ListItemConfig[]` | `[]` | Row definitions. Each entry maps to a `<ListContent>` instance. |
| `headerInputs` | `React.ReactNode` | — | Slot for filter inputs shown in the header when `listStyle='with-inputs'`. Render `<Input>` instances here. |
| `className` | `string` | — | Additional Tailwind classes merged onto the root element via `cn()`. |

**`ListItemConfig`** — extends `Omit<ListContentProps, 'size'>`:

| Field | Type | Description |
|-------|------|-------------|
| `key` | `string` | Unique key for the row (required; used as React `key`). |
| `...ListContentProps` | — | All other `ListContentProps` except `size` (driven by `itemSize` at the List level). |

(source: `src/components/list/List.tsx` — `ListItemConfig`, `ListProps` interfaces)

## Tokens

### `root` layer

| Property | Token | Resolved (wireframe) |
|----------|-------|-----------------------|
| itemSpacing (gap) | `--klp-size-xs` | `var(--klp-spacing-2)` = 8px |

### `header-title` layer

| Property | Token | Resolved (wireframe) |
|----------|-------|-----------------------|
| color | `literal: #2b2b2b` | — (no `--klp-fg-*` alias; see Gaps) |
| fontSize | `--klp-font-size-heading-h2` | `24px` |
| fontFamily | `--klp-font-family-title` | `'Inter', 'Test Calibre', system-ui, sans-serif` |
| fontWeight | `--klp-font-weight-title` | `600` |
| lineHeight | `literal: 32px` | — |

### `header-button` layer

| Property | Token | Resolved (wireframe) |
|----------|-------|-----------------------|
| fill | `--klp-bg-inset` | `var(--klp-color-gray-200)` |
| stroke | `--klp-border-invisible` | `var(--klp-color-light-0)` (transparent) |
| cornerRadius | `--klp-radius-l` | `var(--klp-radius-lg)` = 8px |
| paddingX | `--klp-size-m` | `var(--klp-spacing-4)` = 16px |
| paddingY | `--klp-size-xs` | `var(--klp-spacing-2)` = 8px |
| itemSpacing (gap) | `--klp-size-2xs` | `var(--klp-spacing-1-5)` = 6px |
| color | `--klp-fg-default` | `var(--klp-color-gray-800)` |
| fontSize | `--klp-font-size-text-medium` | `16px` |
| fontFamily | `--klp-font-family-label` | `'Inter', 'Test Calibre', system-ui, sans-serif` |
| fontWeight | `--klp-font-weight-label-bold` | `600` |
| visibility (with-inputs) | `literal: hidden` | — |

### `header-inputs` layer

| Property | Token | Resolved (wireframe) |
|----------|-------|-----------------------|
| itemSpacing (gap, with-inputs only) | `--klp-size-m` | `var(--klp-spacing-4)` = 16px |
| display (condensed / default) | `literal: hidden` | — |

### `items` layer

| Property | Token | Resolved (wireframe) |
|----------|-------|-----------------------|
| itemSpacing (gap) | `--klp-size-3xs` | `var(--klp-spacing-1)` = 4px |

(source: spec.json:variants)

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

(source: `src/components/list/List.example.tsx`)

## Accessibility

- **Role**: `list` — applied on the root `<div>` via `role="list"`. Each `ListContent` row is expected to carry `role="listitem"` (see the `list-content` component docs).
- **Keyboard support**: Tab navigates to the header-button; Enter/Space activates it. Individual row interactions are delegated to `ListContent`.
- **ARIA notes**: Root carries `role="list"`. Action button in header is a native `<button>`. Input instances in the `with-inputs` header use `<input>` semantics from the Input component.

(source: spec.json:a11y)

## Gaps

<!-- KLP:GAPS:BEGIN -->
| Kind | Part | Property | Reason | Resolution |
|------|------|----------|--------|------------|
| `partial-reuse` | `header-title` | `color` | `header-title` color is a literal `#2b2b2b`; no `--klp-fg-*` alias in any brand variant maps to this value. The closest alias (`--klp-fg-default`) resolves to `--klp-color-gray-800` (wireframe) which is a different value. | Adapter uses `text-[#2b2b2b]` arbitrary-value Tailwind class. Track as tech-debt: request a `--klp-fg-heading` alias from the design token layer, or confirm `fg/default` should be used and update Figma to match. |
<!-- KLP:GAPS:END -->

## Dependencies

### klp components
- [Button](./_index_button.md) — imported from `@/components/button`; `header-button` renders as `<Button variant="tertiary" size="md">` (condensed and default styles only).
- [List Content](./_index_list-content.md) — imported from `@/components/list-content`; each row in the `items` section is a `<ListContent>` instance.

### External libraries
- [class-variance-authority](https://www.npmjs.com/package/class-variance-authority) — drives `rootVariants`, `headerVariants`, `headerTitleVariants`, `headerButtonVariants`, `headerInputsVariants`, `itemsVariants`.
- [lucide-react](https://www.npmjs.com/package/lucide-react) — `ArrowRight` icon in the header action button.

### Token groups
- [Colors](../tokens/colors.md) — `--klp-bg-inset`, `--klp-border-invisible`, `--klp-fg-default` on `header-button` layer.
- [Radius](../tokens/radius.md) — `--klp-radius-l` on `header-button` cornerRadius.
- [Spacing](../tokens/spacing.md) — `--klp-size-xs`, `--klp-size-s` (items gap via `--klp-size-3xs`), `--klp-size-m`, `--klp-size-2xs` across all layers.
- [Typography](../tokens/typography.md) — `--klp-font-size-heading-h2`, `--klp-font-family-title`, `--klp-font-weight-title` on `header-title`; `--klp-font-size-text-medium`, `--klp-font-family-label`, `--klp-font-weight-label-bold` on `header-button`.

### Brands
- [wireframe](../brands/wireframe.md) — reference screenshots and token resolution validated under the wireframe brand.

## Used by

*Not yet used by any other klp component.*

## Files

- Source: [`src/components/list/List.tsx`](../../src/components/list/List.tsx)
- Example: [`src/components/list/List.example.tsx`](../../src/components/list/List.example.tsx)
- Playground: [`playground/routes/list.tsx`](../../playground/routes/list.tsx)
- Registry: [`registry/list.json`](../../registry/list.json)
- Figma spec: [`.klp/figma-refs/list/spec.json`](../../.klp/figma-refs/list/spec.json)
- Reference screenshots: [`.klp/figma-refs/list/`](../../.klp/figma-refs/list/)

<!-- KLP:NOTES:BEGIN -->
## Notes

*Manual prose preserved across regenerations. Anything between the BEGIN/END markers is never overwritten by the documentalist.*
<!-- KLP:NOTES:END -->
