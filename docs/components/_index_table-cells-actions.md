---
title: Table Cells / Actions
type: component
status: stable
category: table cells
captureBrand: wireframe
radixPrimitive: null
sources:
  - .klp/figma-refs/table-cells-actions/spec.json
  - src/components/table-cells-actions/TableCellsActions.tsx
dependencies:
  components: [button]
  externals: [class-variance-authority, lucide-react]
  tokenGroups: [colors, radius, spacing, typography]
  brands: [wireframe]
usedBy: []
created: 2026-04-17
updated: 2026-04-17
---

# Table Cells / Actions

A table cell that renders 1–4 action buttons inline. Icon-only buttons use bg/invisible; the last/primary action button uses bg/inset with a label and optional chevron icon.

## Anatomy

```
table-cells-actions
├── root           (div)            — Horizontal flex container. Padding and gap bound to Sizing tokens. Width varies per height/actions combination. role="group".
├── button-1       (INSTANCE:Button) — First icon-only action button. bg/invisible fill. Always visible when actions >= 1.
├── button-2       (INSTANCE:Button) — Second icon-only action button. bg/invisible fill. Visible when actions >= 3.
├── button-3       (INSTANCE:Button) — Third icon-only action button. bg/invisible fill. Visible when actions >= 4.
└── button-primary (INSTANCE:Button) — Primary labelled action button. bg/inset fill, label text + right icon. Visible when actions >= 2.
```

## Variants

Two axes: `height` × `actions`. One table showing all combinations.

| height \ actions | 1 | 2 | 3 | 4 |
|---|---|---|---|---|
| 1 | [✓](../../.klp/figma-refs/table-cells-actions/height-1-actions-1.png) | [✓](../../.klp/figma-refs/table-cells-actions/height-1-actions-2.png) | [✓](../../.klp/figma-refs/table-cells-actions/height-1-actions-3.png) | [✓](../../.klp/figma-refs/table-cells-actions/height-1-actions-4.png) |
| 2 | [✓](../../.klp/figma-refs/table-cells-actions/height-2-actions-1.png) | [✓](../../.klp/figma-refs/table-cells-actions/height-2-actions-2.png) | [✓](../../.klp/figma-refs/table-cells-actions/height-2-actions-3.png) | [✓](../../.klp/figma-refs/table-cells-actions/height-2-actions-4.png) |

**height=1:** compact row — `px-klp-size-xs py-klp-size-xs gap-klp-size-xs`, `min-h-[52px]` literal.  
**height=2:** relaxed row — `px-klp-size-s py-klp-size-s gap-klp-size-s`, `min-h-[60px]` literal.  
**actions=1:** button-1 only (icon-only, bg/invisible). No button-primary.  
**actions=2:** button-1 + button-primary (labelled, bg/inset).  
**actions=3:** button-1 + button-2 + button-primary.  
**actions=4:** button-1 + button-2 + button-3 + button-primary. (source: spec.json:variants)

## API

`TableCellsActionsProps` extends `React.HTMLAttributes<HTMLDivElement>` and `VariantProps<typeof rootVariants>`. All native `div` attributes are forwarded via `...props`.

| Prop | Type | Default | Description |
|---|---|---|---|
| `height` | `'1' \| '2'` | `'2'` | Row height tier. `'2'` = relaxed (min-h 60px); `'1'` = compact (min-h 52px). |
| `actions` | `1 \| 2 \| 3 \| 4` | `4` | Number of action buttons to render. Controls visibility of button-2, button-3, and button-primary. |
| `button1Icon` | `React.ReactNode` | `<Check />` | Icon for button-1 (icon-only, bg-invisible). |
| `button1Label` | `string` | `'Action 1'` | `aria-label` for button-1. Required for a11y. |
| `onButton1Click` | `React.MouseEventHandler<HTMLButtonElement>` | — | Click handler for button-1. |
| `button2Icon` | `React.ReactNode` | `<Check />` | Icon for button-2 (icon-only, bg-invisible). |
| `button2Label` | `string` | `'Action 2'` | `aria-label` for button-2. Required for a11y. |
| `onButton2Click` | `React.MouseEventHandler<HTMLButtonElement>` | — | Click handler for button-2. |
| `button3Icon` | `React.ReactNode` | `<Check />` | Icon for button-3 (icon-only, bg-invisible). |
| `button3Label` | `string` | `'Action 3'` | `aria-label` for button-3. Required for a11y. |
| `onButton3Click` | `React.MouseEventHandler<HTMLButtonElement>` | — | Click handler for button-3. |
| `primaryLabel` | `string` | `'Action'` | Label text for the primary button. |
| `primaryRightIcon` | `React.ReactNode` | `<Check />` | Right icon for the primary button. |
| `onPrimaryClick` | `React.MouseEventHandler<HTMLButtonElement>` | — | Click handler for the primary button. |

## Tokens

Tokens are resolved for the `wireframe` (captureBrand) brand block in `aliases.css`.

### `root` layer

| Property | Token | Resolved (wireframe) |
|---|---|---|
| fill | `literal: transparent` | `transparent` |
| paddingX (height=2) | `--klp-size-s` | `var(--klp-spacing-3)` |
| paddingY (height=2) | `--klp-size-s` | `var(--klp-spacing-3)` |
| itemSpacing (height=2) | `--klp-size-s` | `var(--klp-spacing-3)` |
| paddingX (height=1) | `--klp-size-xs` | `var(--klp-spacing-2)` |
| paddingY (height=1) | `--klp-size-xs` | `var(--klp-spacing-2)` |
| itemSpacing (height=1) | `--klp-size-xs` | `var(--klp-spacing-2)` |
| minHeight (height=2) | `literal: 60px` | `60px` *(gap — see `## Gaps`)* |
| minHeight (height=1) | `literal: 52px` | `52px` *(gap — see `## Gaps`)* |

### `button-1`, `button-2`, `button-3` layers (icon-only)

| Property | Token | Resolved (wireframe) |
|---|---|---|
| fill | `--klp-bg-invisible` | `var(--klp-color-light-0)` |
| stroke | `--klp-border-invisible` | `var(--klp-color-light-0)` |
| cornerRadius | `--klp-radius-l` | `var(--klp-radius-lg)` |
| paddingX | `--klp-size-xs` | `var(--klp-spacing-2)` |
| paddingY | `--klp-size-xs` | `var(--klp-spacing-2)` |

### `button-primary` layer (labelled)

| Property | Token | Resolved (wireframe) |
|---|---|---|
| fill | `--klp-bg-inset` | `var(--klp-color-gray-200)` |
| stroke | `--klp-border-invisible` | `var(--klp-color-light-0)` |
| cornerRadius | `--klp-radius-l` | `var(--klp-radius-lg)` |
| paddingX | `--klp-size-s` | `var(--klp-spacing-3)` |
| paddingY | `--klp-size-2xs` | `var(--klp-spacing-1-5)` |
| itemSpacing | `--klp-size-2xs` | `var(--klp-spacing-1-5)` |
| label.color | `--klp-fg-default` | `var(--klp-color-gray-800)` |
| label.fontSize | `--klp-font-size-text-medium` | `16px` |
| label.fontFamily | `--klp-font-family-label` | `'Inter', 'Test Calibre', system-ui, sans-serif` |
| label.fontWeight | `--klp-font-weight-label-bold` | `600` |

## Examples

```tsx
import { Check } from 'lucide-react'
import { TableCellsActions } from './TableCellsActions'

export function TableCellsActionsExample() {
  return (
    <div className="flex flex-col gap-4">
      {/* Height 2 — 4 actions */}
      <TableCellsActions
        height="2"
        actions={4}
        button1Icon={<Check />}
        button1Label="Confirm"
        button2Icon={<Check />}
        button2Label="Approve"
        button3Icon={<Check />}
        button3Label="Verify"
        primaryLabel="Action"
        primaryRightIcon={<Check />}
      />

      {/* Height 1 — 2 actions */}
      <TableCellsActions
        height="1"
        actions={2}
        button1Icon={<Check />}
        button1Label="Confirm"
        primaryLabel="Action"
        primaryRightIcon={<Check />}
      />

      {/* Height 1 — 1 action (icon-only) */}
      <TableCellsActions
        height="1"
        actions={1}
        button1Icon={<Check />}
        button1Label="Confirm"
      />
    </div>
  )
}
```

## Accessibility

- **Role**: `group` — the `div` root carries `role="group"` (source: spec.json:a11y).
- **Keyboard support**: `Tab`, `Enter`, `Space` — standard button keyboard interaction via the composed `Button` primitive.
- **ARIA notes**: Each action button slot requires an explicit `aria-label` describing its action (e.g. `"Confirm"`, `"Delete"`). Icon-only buttons (button-1 to button-3) have no visible label — `aria-label` is the only accessible name. The `primaryLabel` prop serves as the visible label text for button-primary; no separate `aria-label` is required unless the visible label is ambiguous.

## Dependencies

### klp components
- [Button](./_index_button.md) — All four button slots (`button-1`, `button-2`, `button-3`, `button-primary`) are rendered as `<Button>` instances. Icon-only slots use `variant="tertiary" size="icon"` (activates bg-invisible). Primary slot uses `variant="tertiary" size="md"` with `rightIcon` prop (activates bg-inset fill).

### External libraries
- [class-variance-authority](https://www.npmjs.com/package/class-variance-authority) — `cva` used for `rootVariants` (height axis).
- [lucide-react](https://www.npmjs.com/package/lucide-react) — `<Check>` used as default icon for all four button slots.

### Token groups
- [Colors](../tokens/colors.md) — `--klp-bg-invisible`, `--klp-bg-inset`, `--klp-border-invisible`, `--klp-fg-default`.
- [Radius](../tokens/radius.md) — `--klp-radius-l` on button layers.
- [Spacing](../tokens/spacing.md) — `--klp-size-s`, `--klp-size-xs`, `--klp-size-2xs` for padding and gap.
- [Typography](../tokens/typography.md) — `--klp-font-size-text-medium`, `--klp-font-family-label`, `--klp-font-weight-label-bold` on `button-primary` label.

### Brands
- [wireframe](../brands/wireframe.md) — captureBrand; all reference screenshots captured under wireframe.

## Used by

*Not yet used by any other klp component.*

## Files

- Source: [`src/components/table-cells-actions/TableCellsActions.tsx`](../../src/components/table-cells-actions/TableCellsActions.tsx)
- Example: [`src/components/table-cells-actions/TableCellsActions.example.tsx`](../../src/components/table-cells-actions/TableCellsActions.example.tsx)
- Playground: [`playground/routes/table-cells-actions.tsx`](../../playground/routes/table-cells-actions.tsx)
- Registry: [`registry/table-cells-actions.json`](../../registry/table-cells-actions.json)
- Figma spec: [`.klp/figma-refs/table-cells-actions/spec.json`](../../.klp/figma-refs/table-cells-actions/spec.json)
- Reference screenshots: [`.klp/figma-refs/table-cells-actions/`](../../.klp/figma-refs/table-cells-actions/)

<!-- KLP:NOTES:BEGIN -->
## Notes

*Manual prose preserved across regenerations. Anything between the BEGIN/END markers is never overwritten by the documentalist.*
<!-- KLP:NOTES:END -->

<!-- KLP:GAPS:BEGIN -->
## Gaps

Literal values in the adapter that could not be bound to a `--klp-*` token at generation time. Sourced from `spec.json:tokenGaps`.

| Gap # | Figma variable | Expected klp token | Resolved value | Seen on | Notes |
|---|---|---|---|---|---|
| 1 | `VariableID:44254ea5bdcf2155e180be9f7f5798c986ae6ae2/1050:1645` | — | `60px` (height=2) / `52px` (height=1) | `all-variants/root/minHeight` | Cross-file Figma variable (external library) — name could not be resolved by the plugin. Controls the minimum row height. Adapter uses `min-h-[60px]` for height=2 and `min-h-[52px]` for height=1 as literals. Request `--klp-size-row-relaxed` (60px) and `--klp-size-row-compact` (52px) aliases, or share the external library variable with the local token file and re-run `pnpm sync:tokens`. |
<!-- KLP:GAPS:END -->
