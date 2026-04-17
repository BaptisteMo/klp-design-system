---
title: ActionSheet Menu
type: component
status: stable
category: lists
captureBrand: wireframe
radixPrimitive: "@radix-ui/react-popover"
sources:
  - .klp/figma-refs/action-sheet-menu/spec.json
  - src/components/action-sheet-menu/ActionSheetMenu.tsx
dependencies:
  components:
    - action-sheet-item
    - checkbox
  externals:
    - "@radix-ui/react-popover"
    - class-variance-authority
    - lucide-react
  tokenGroups:
    - colors
    - radius
    - spacing
    - typography
  brands:
    - wireframe
usedBy: []
created: 2026-04-17
updated: 2026-04-17
---

# ActionSheet Menu

A contextual menu panel composed of grouped ActionSheet_Item rows, optional section titles, and separator lines. Supports three layout types: Default (icon + label + secondary icon), Checkbox (checkbox row layout), and Flat (icon + label + secondary icon, no section headers).

## Anatomy

```
action-sheet-menu
├── root       (div)   — Menu container with padding and rounded corners. Clips children.
├── section    (div)   — Repeated group of title + items. Optional per variant.
│   ├── title      (span) — Section header text label ('Titre de section'). Hidden in Flat variant.
│   ├── item       (div)  — INSTANCE of ActionSheet_Item or Input Checkbox. Repeated n times per section.
│   └── separator  (hr)   — INSTANCE of Separator (inlined as <hr>). One between each section group.
```

## Variants

Single variant axis: **type**.

| type | Reference screenshot |
|------|----------------------|
| `default` | [default-default.png](../../.klp/figma-refs/action-sheet-menu/default-default.png) |
| `checkbox` | [checkbox-default.png](../../.klp/figma-refs/action-sheet-menu/checkbox-default.png) |
| `flat` | [flat-default.png](../../.klp/figma-refs/action-sheet-menu/flat-default.png) |

## API

`ActionSheetMenuProps` extends `React.HTMLAttributes<HTMLDivElement>` and `VariantProps<typeof rootVariants>`. Native HTML div attributes are forwarded to the root element.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `sections` | `ActionSheetMenuSection[]` | — | Array of section objects, each containing an optional `title` and an array of `items`. Required. |
| `type` | `'default' \| 'checkbox' \| 'flat'` | `'default'` | Layout type that controls item rendering, title visibility, and separator style. |
| `className` | `string` | — | Additional Tailwind classes merged onto the root element via `cn()`. |

**`ActionSheetMenuSection`** — shape of each section object:

| Field | Type | Description |
|-------|------|-------------|
| `title` | `string` (optional) | Section header text. Hidden in `flat` type. |
| `items` | `ActionSheetMenuItemDef[]` | Item rows for this section. |

**`ActionSheetMenuItemDef`** — shape of each item object:

| Field | Type | Description |
|-------|------|-------------|
| `id` | `string` | Unique key for the item. |
| `label` | `string` | Primary label text. |
| `description` | `string` (optional) | Optional description (action-sheet-item only). |
| `leftIcon` | `React.ReactNode` (optional) | Optional left icon (action-sheet-item only). |
| `rightIcon` | `React.ReactNode` (optional) | Optional right icon/action (action-sheet-item only). |
| `state` | `'default' \| 'hover' \| 'active' \| 'emphased' \| 'disabled' \| 'destructive' \| 'creation'` (optional) | Semantic state for action-sheet-item. Defaults to `'default'`. |
| `checked` | `boolean \| 'indeterminate'` (optional) | Checkbox checked state (checkbox type only). |
| `onSelect` | `() => void` (optional) | Click / change handler. |
| `onCheckedChange` | `(checked: boolean \| 'indeterminate') => void` (optional) | Checkbox change handler (checkbox type only). |

**Compound exports** — the component also exports Popover-wrapped convenience parts for use as a positioned menu:

| Export | Underlying Radix part |
|--------|-----------------------|
| `ActionSheetMenuRoot` | `Popover.Root` |
| `ActionSheetMenuTrigger` | `Popover.Trigger` |
| `ActionSheetMenuPortal` | `Popover.Portal` |
| `ActionSheetMenuAnchor` | `Popover.Anchor` |
| `ActionSheetMenuContent` | `Popover.Content` wrapping `ActionSheetMenu` |

## Tokens

### `root` layer

| Property | Token | Resolved (wireframe) |
|----------|-------|-----------------------|
| fill | `--klp-bg-default` | `var(--klp-color-light-100)` |
| paddingX | `--klp-size-xs` | `var(--klp-spacing-2)` = 8px |
| paddingY | `--klp-size-xs` | `var(--klp-spacing-2)` = 8px |
| cornerRadius | `--klp-radius-l` *(token gap — see Gaps below)* | `var(--klp-radius-lg)` = 8px |
| itemSpacing (checkbox only) | `--klp-size-xs` | `var(--klp-spacing-2)` = 8px |

### `title` layer

| Property | Token | Resolved (wireframe) |
|----------|-------|-----------------------|
| color | `--klp-fg-muted` | `var(--klp-color-gray-700)` = #4A4A4A |
| fontSize | `--klp-font-size-text-small` | `14px` |
| fontFamily | `--klp-font-family-label` | `'Inter', 'Test Calibre', system-ui, sans-serif` |
| fontWeight | `--klp-font-weight-label-bold` | `600` |
| display (flat) | `literal: none` | — |

### `item` layer — default / flat variants

| Property | Token | Resolved (wireframe) |
|----------|-------|-----------------------|
| fill | `--klp-bg-invisible` | `var(--klp-color-light-0)` = transparent |
| stroke | `--klp-border-invisible` | `var(--klp-color-light-0)` = transparent |
| cornerRadius | `--klp-radius-m` *(token gap — see Gaps below)* | `var(--klp-radius-base)` = 4px |
| paddingX | `--klp-size-m` | `var(--klp-spacing-4)` = 16px |
| paddingY | `--klp-size-m` | `var(--klp-spacing-4)` = 16px |
| itemSpacing | `--klp-size-s` | `var(--klp-spacing-3)` = 12px |

### `item` layer — checkbox variant

| Property | Token | Resolved (wireframe) |
|----------|-------|-----------------------|
| fill | `--klp-bg-default` | `var(--klp-color-light-100)` |
| stroke | `--klp-border-default` | `var(--klp-color-gray-300)` = #D7DAD9 |
| cornerRadius | `--klp-radius-m` | `var(--klp-radius-base)` = 4px |
| paddingX | `--klp-size-m` | `var(--klp-spacing-4)` = 16px |
| paddingY | `--klp-size-xs` | `var(--klp-spacing-2)` = 8px |
| itemSpacing | `--klp-size-m` | `var(--klp-spacing-4)` = 16px |

### `separator` layer — default / flat variants

| Property | Token | Resolved (wireframe) |
|----------|-------|-----------------------|
| paddingY (wrapper) | `--klp-size-m` | `var(--klp-spacing-4)` = 16px |
| stroke | `--klp-border-default` | `var(--klp-color-gray-300)` = #D7DAD9 |

### `separator` layer — checkbox variant

| Property | Token | Resolved (wireframe) |
|----------|-------|-----------------------|
| fill | `--klp-border-default` | `var(--klp-color-gray-300)` = #D7DAD9 |
| height | `literal: 1px` | — |

## Examples

### Default type

```tsx
// EXAMPLE: ActionSheetMenuDefaultExample
import { Settings, Share, Trash2, ChevronRight } from 'lucide-react'
import { ActionSheetMenu } from '@/components/action-sheet-menu'

export function ActionSheetMenuDefaultExample() {
  return (
    <ActionSheetMenu
      type="default"
      sections={[
        {
          title: 'Titre de section',
          items: [
            {
              id: 'settings',
              label: 'Paramètres',
              leftIcon: <Settings strokeWidth={1.5} />,
              rightIcon: <ChevronRight strokeWidth={1.5} />,
              onSelect: () => {},
            },
            {
              id: 'share',
              label: 'Partager',
              leftIcon: <Share strokeWidth={1.5} />,
              onSelect: () => {},
            },
            {
              id: 'delete',
              label: 'Supprimer',
              leftIcon: <Trash2 strokeWidth={1.5} />,
              state: 'destructive',
              onSelect: () => {},
            },
          ],
        },
      ]}
    />
  )
}
```

### Checkbox type

```tsx
// EXAMPLE: ActionSheetMenuCheckboxExample
import { ActionSheetMenu } from '@/components/action-sheet-menu'

export function ActionSheetMenuCheckboxExample() {
  return (
    <ActionSheetMenu
      type="checkbox"
      sections={[
        {
          title: 'Titre de section',
          items: [
            { id: 'opt-a', label: 'Option A', checked: true },
            { id: 'opt-b', label: 'Option B', checked: false },
            { id: 'opt-c', label: 'Option C', checked: 'indeterminate' },
          ],
        },
      ]}
    />
  )
}
```

### Flat type

```tsx
// EXAMPLE: ActionSheetMenuFlatExample
import { Settings, Share, ChevronRight } from 'lucide-react'
import { ActionSheetMenu } from '@/components/action-sheet-menu'

export function ActionSheetMenuFlatExample() {
  return (
    <ActionSheetMenu
      type="flat"
      sections={[
        {
          items: [
            {
              id: 'item-1',
              label: 'Label',
              leftIcon: <Settings strokeWidth={1.5} />,
              rightIcon: <ChevronRight strokeWidth={1.5} />,
            },
            {
              id: 'item-2',
              label: 'Label',
              leftIcon: <Share strokeWidth={1.5} />,
            },
          ],
        },
      ]}
    />
  )
}
```

### Popover-wrapped usage

```tsx
// EXAMPLE: ActionSheetMenuPopoverExample
import { Settings, Share, Trash2 } from 'lucide-react'
import {
  ActionSheetMenuRoot,
  ActionSheetMenuTrigger,
  ActionSheetMenuPortal,
  ActionSheetMenuContent,
} from '@/components/action-sheet-menu'

export function ActionSheetMenuPopoverExample() {
  return (
    <ActionSheetMenuRoot>
      <ActionSheetMenuTrigger asChild>
        <button type="button">Open menu</button>
      </ActionSheetMenuTrigger>
      <ActionSheetMenuPortal>
        <ActionSheetMenuContent
          type="default"
          align="end"
          sections={[
            {
              title: 'Actions',
              items: [
                { id: 'edit', label: 'Modifier', leftIcon: <Settings strokeWidth={1.5} /> },
                { id: 'share', label: 'Partager', leftIcon: <Share strokeWidth={1.5} /> },
                { id: 'delete', label: 'Supprimer', leftIcon: <Trash2 strokeWidth={1.5} />, state: 'destructive' },
              ],
            },
          ]}
        />
      </ActionSheetMenuPortal>
    </ActionSheetMenuRoot>
  )
}
```

## Accessibility

- **Role**: `menu` on the root container (`role="menu"` with `aria-label="Action sheet menu"`).
- **Keyboard support**: `ArrowUp`, `ArrowDown` (navigate items), `Enter` (activate item), `Escape` (close).
- **ARIA notes**: Each ActionSheet_Item should carry `role="menuitem"`. Checkbox variant items use `role="menuitemcheckbox"` with `aria-checked` set to `true`, `false`, or `"mixed"` for indeterminate. When wrapped with `ActionSheetMenuContent`, focus management and positioning are handled by `@radix-ui/react-popover`. (source: spec.json:a11y)

## Gaps

<!-- KLP:GAPS:BEGIN -->
| Kind | Part | Reason | Resolution |
|------|------|--------|------------|
| `unmatched-instance` | `separator` | No klp Separator component registered. Figma node 282:849 (`Separator` component set) has no corresponding klp entry in `klp-components.json`. | `inlined-local` — rendered as `<hr className="border-t border-klp-border-default">` (default/flat) or `<div className="h-[1px] bg-klp-border-default">` (checkbox). Track as tech-debt; promote to a standalone `separator` klp component when the Separator Figma spec is extracted. |

> ⚠️ Token gaps (corner radius): `VariableID:bb1cbde7be52ab74dc15eb38e8b18754de3fea73/152:102` (external published library, resolved 8px) and `VariableID:278:2851` (unnamed local, resolved 8px) have no matching `--klp-*` alias in `aliases.css`. Both are mapped to `--klp-radius-l` / `--klp-radius-m` respectively in the implementation as the closest semantic alias. (source: spec.json:tokenGaps)
<!-- KLP:GAPS:END -->

## Dependencies

### klp components
- [ActionSheet Item](./_index_action-sheet-item.md) — imported from `@/components/action-sheet-item`; used as item rows in `default` and `flat` type variants.
- [Checkbox](./_index_checkbox.md) — imported from `@/components/checkbox`; used as item rows in the `checkbox` type variant.

### External libraries
- [@radix-ui/react-popover](https://www.npmjs.com/package/@radix-ui/react-popover) — wraps `ActionSheetMenuContent` for positioning and a11y (source: spec.json:radixPrimitive).
- [class-variance-authority](https://www.npmjs.com/package/class-variance-authority) — drives `rootVariants`, `sectionVariants`, `titleVariants`, `separatorVariants`.
- [lucide-react](https://www.npmjs.com/package/lucide-react) — used in examples for `Settings`, `Share`, `Trash2`, `ChevronRight` icons.

### Token groups
- [Colors](../tokens/colors.md) — `--klp-bg-default`, `--klp-bg-invisible`, `--klp-fg-muted`, `--klp-border-default`, `--klp-border-invisible`.
- [Radius](../tokens/radius.md) — `--klp-radius-l` (root), `--klp-radius-m` (item).
- [Spacing](../tokens/spacing.md) — `--klp-size-xs`, `--klp-size-s`, `--klp-size-m`.
- [Typography](../tokens/typography.md) — `--klp-font-size-text-small`, `--klp-font-family-label`, `--klp-font-weight-label-bold`.

### Brands
- [wireframe](../brands/wireframe.md) — reference screenshots and token resolution validated under the wireframe brand.

## Used by

*Not yet used by any other klp component.*

## Files

- Source: [`src/components/action-sheet-menu/ActionSheetMenu.tsx`](../../src/components/action-sheet-menu/ActionSheetMenu.tsx)
- Example: [`src/components/action-sheet-menu/ActionSheetMenu.example.tsx`](../../src/components/action-sheet-menu/ActionSheetMenu.example.tsx)
- Playground: [`playground/routes/action-sheet-menu.tsx`](../../playground/routes/action-sheet-menu.tsx)
- Registry: [`registry/action-sheet-menu.json`](../../registry/action-sheet-menu.json)
- Figma spec: [`.klp/figma-refs/action-sheet-menu/spec.json`](../../.klp/figma-refs/action-sheet-menu/spec.json)
- Reference screenshots: [`.klp/figma-refs/action-sheet-menu/`](../../.klp/figma-refs/action-sheet-menu/)

<!-- KLP:NOTES:BEGIN -->
## Notes

*Manual prose preserved across regenerations. Anything between the BEGIN/END markers is never overwritten by the documentalist.*
<!-- KLP:NOTES:END -->
