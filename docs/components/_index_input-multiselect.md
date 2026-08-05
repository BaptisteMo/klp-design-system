---
title: Input Multiselect
type: component
status: stable
category: inputs
captureBrand: klub
radixPrimitive: "@radix-ui/react-popover"
sources:
  - .klp/figma-refs/input-multiselect/spec.json
  - src/components/input-multiselect/InputMultiselect.tsx
dependencies:
  components: ["action-sheet-menu", "badges", "input"]
  externals: ["@radix-ui/react-popover", "class-variance-authority", "lucide-react"]
  tokenGroups: ["colors", "spacing", "radius", "typography"]
  brands: ["klub"]
usedBy: []
created: 2026-08-04
updated: 2026-08-04
---

# Input Multiselect

A multi-select input: a labeled trigger box (composed from Input) that displays selected values as removable chips (Badges) and a chevron affordance, plus an attached open dropdown panel (ActionSheetMenu, checkbox type) listing selectable options grouped into sections.

## Anatomy

```
root (div)
├── trigger            (Input instance, size=small) — Label + info-icon + input-box + placeholder, reused wholesale
│   ├── trigger-label       (span)   — Label text above the input box
│   ├── trigger-info-icon   (span)   — Optional info icon next to the trigger label
│   ├── input-box           (div)    — Bordered, rounded box holding chips/placeholder + chevron; border follows nested Input's derived state
│   │   ├── chip             (Badge instance, tertiary/small/light) — One per selected value, repeated (0–N)
│   │   │   ├── chip-label       (span)   — Chip text label; not rendered in content=empty
│   │   │   └── chip-remove-icon (button) — X icon button to deselect that value; not rendered in content=empty
│   │   ├── placeholder      (span)   — Placeholder text shown in place of chips when content=empty
│   │   └── chevron-icon     (span)   — chevron-down when state=open, chevron-right when state=close
└── dropdown            (ActionSheetMenu instance, type=checkbox) — Options panel; visible only when state=open
```

> ❓ UNVERIFIED (source: spec.json anatomy.chevron-icon): the chevron literally flips direction (down when open, right when close) rather than rotating — confirmed intentional per the Figma layer names captured, but the spec itself flags this for a design review before treating it as final behavior.

## Variants

> Reference screenshots are unavailable for this extraction pass (source: spec.json `screenshotNote` on every variant — `FIGMA_ACCESS_TOKEN` expired; re-run capture once REST access is restored). Checkmarks below are confirmed from `spec.variants[]` without a linked image.

| content \ state | open | close |
|---|---|---|
| filled | ✓ | ✓ |
| empty | — | ✓ |
| full | ✓ | ✓ |

5 of 6 possible `content × state` combinations are captured (source: spec.json:variants). `empty-open` was not captured in this extraction pass.

> The **content** (filled / empty / full) and **state** (open / close) axes above are NOT author-facing props. `content` is derived from `value.length` (empty vs. has-selection) and `full` vs. `filled` is a display label only — the component branches purely on `hasSelection`. `state` mirrors the Radix `Popover` open/closed state. Both are Class B situations — spec-level variant axes without a corresponding prop on `InputMultiselectProps` (source: `InputMultiselect.tsx` derived-visuals block, same shape as Button's `state` axis).

## Props usage

Extends `Omit<React.InputHTMLAttributes<HTMLInputElement>, 'value' | 'defaultValue' | 'onChange' | 'size'>`.

| Prop | Type | Default | Class | Description |
|---|---|---|---|---|
| `label` | `string` | — | optional | Label text displayed above the trigger box |
| `showInfoIcon` | `boolean` | `true` | optional | Show the optional info icon next to the trigger label |
| `placeholder` | `string` | `"This is the placeholder or input content"` | optional | Placeholder text shown when no value is selected |
| `sections` | `InputMultiselectSection[]` | — | **required** | Grouped, selectable options rendered in the dropdown panel |
| `value` | `string[]` | — | optional | Controlled selected option ids |
| `defaultValue` | `string[]` | `[]` | optional | Default selected option ids (uncontrolled) |
| `onValueChange` | `(value: string[]) => void` | — | optional | Callback fired whenever the selection changes |
| `open` | `boolean` | — | optional | Controlled dropdown open state |
| `defaultOpen` | `boolean` | `false` | optional | Default dropdown open state (uncontrolled) |
| `onOpenChange` | `(open: boolean) => void` | — | optional | Callback fired when the dropdown open state changes |
| `maxVisibleChips` | `number` | `4` | optional | Maximum number of chips rendered before collapsing the rest into a "+N" overflow chip |
| `className` | `string` | — | optional | Additional className applied to the outer root wrapper |

## Tokens

Layers `chip-remove-icon` and `chevron-icon` bind no tokens — icon choice (`x` / `chevron-down` / `chevron-right`) and size (`16px`) are literals resolved in source, not `--klp-*` aliases. `placeholder` token bindings below are sourced from the `empty-close` variant (source: spec.json:variants[2].layers.placeholder) since `variants[0]` (`filled-open`) hides the placeholder (`content=filled`).

### `root` layer

| Property | Token | Resolved (klub) |
|---|---|---|
| fill | — | literal: transparent |
| itemSpacing | `--klp-size-xs` | `8px` |

### `trigger` layer

| Property | Token | Resolved (klub) |
|---|---|---|
| itemSpacing | `--klp-size-m` | `16px` |

### `trigger-label` layer

| Property | Token | Resolved (klub) |
|---|---|---|
| color | `--klp-fg-default` | `#1A211E` |
| fontSize | `--klp-font-size-text-medium` | `16px` |
| fontFamily | `--klp-font-family-label` | `'Test Calibre'` |
| fontWeight | `--klp-font-weight-label` | `400` |
| lineHeight | — | literal: `24px` |

### `trigger-info-icon` layer

| Property | Token | Resolved (klub) |
|---|---|---|
| paddingX | `--klp-size-4xs` | `2px` |
| paddingY | `--klp-size-4xs` | `2px` |

### `input-box` layer

| Property | Token | Resolved (klub) |
|---|---|---|
| fill | `--klp-bg-default` | `#FFFFFF` |
| stroke | `--klp-border-brand` | `#1EADA5` |
| cornerRadius | — | literal: `8px` |
| paddingX | `--klp-size-4xs` | `2px` |
| paddingY | `--klp-size-4xs` | `2px` |
| itemSpacing | `--klp-size-xs` | `8px` |

`stroke` above reflects the `filled-open` (focused) variant. The `empty-close` variant resolves `stroke` to `--klp-border-default` (`#D7DAD9`) instead — this is the nested `Input` instance's own `state` prop switching, not a separate token binding on `input-multiselect`.

### `chip` layer

| Property | Token | Resolved (klub) |
|---|---|---|
| fill | `--klp-bg-inset` | `#EEF1F0` |
| stroke | `--klp-border-invisible` | `transparent` |
| cornerRadius | `--klp-radius-m` | `4px` |
| paddingX | `--klp-size-xs` | `8px` |
| paddingY | `--klp-size-2xs` | `6px` |
| itemSpacing | `--klp-size-2xs` | `6px` |

### `chip-label` layer

| Property | Token | Resolved (klub) |
|---|---|---|
| color | `--klp-fg-default` | `#1A211E` |
| fontSize | `--klp-font-size-text-small` | `14px` |
| fontFamily | `--klp-font-family-body` | `'Test Calibre'` |
| fontWeight | `--klp-font-weight-body` | `400` |
| lineHeight | — | literal: `18px` |

### `placeholder` layer

| Property | Token | Resolved (klub) |
|---|---|---|
| color | `--klp-fg-subtle` | `#868E8B` |
| fontSize | `--klp-font-size-text-medium` | `16px` |
| fontFamily | `--klp-font-family-label` | `'Test Calibre'` |
| fontWeight | `--klp-font-weight-label` | `400` |

### `dropdown` layer

| Property | Token | Resolved (klub) |
|---|---|---|
| fill | `--klp-bg-default` | `#FFFFFF` |
| cornerRadius | `--klp-radius-l` | `8px` |
| paddingX | `--klp-size-xs` | `8px` |
| paddingY | `--klp-size-xs` | `8px` |
| itemSpacing | `--klp-size-xs` | `8px` |

## Examples

```tsx
import { useState } from 'react'
import { InputMultiselect } from '@/components/input-multiselect'

const SECTIONS = [
  {
    title: 'Titre de section',
    options: [
      { id: 'opt-1', label: 'Label' },
      { id: 'opt-2', label: 'Label' },
      { id: 'opt-3', label: 'Label' },
    ],
  },
  {
    title: 'Titre de section',
    options: [
      { id: 'opt-4', label: 'Label' },
      { id: 'opt-5', label: 'Label' },
    ],
  },
]

export function InputMultiselectExample() {
  const [value, setValue] = useState<string[]>(['opt-1', 'opt-2'])

  return (
    <InputMultiselect
      label="Label of the input"
      placeholder="This is the placeholder or input content"
      sections={SECTIONS}
      value={value}
      onValueChange={setValue}
    />
  )
}
```

## Accessibility

- **Role**: `combobox` (source: spec.json:a11y.role)
- **Keyboard support**: Enter/Space (open/close) · Arrow Down/Up (navigate options) · Escape (close) · Backspace (remove last chip when input empty)
- **ARIA notes**: `role="combobox"` and `aria-haspopup="listbox"` are set on the underlying `Input` trigger in source. Each remove button carries `aria-label="Remove {label}"`.

> ❓ UNVERIFIED (source: spec.json:a11y.notes): the spec's own capture note flags this as unconfirmed — "TODO: confirm accessible pattern with design/eng — likely a combobox with a listbox popup (`aria-expanded`, `aria-controls`, `aria-multiselectable`)". See also the `dropdown` gap below: the reused `ActionSheetMenu` renders `role="menu"`, not `role="listbox"`, so the combobox/listbox contract is currently incomplete.

## Dependencies

### klp components

- [Input](./_index_input.md) — trigger renders as `<Input size="small">` with label/info-icon/input-box/placeholder reused; selected-value chips are passed via `iconLeft`, chevron via `iconRight`.
- [Badge](./_index_badges.md) — each selected value renders as `<Badge badgeType="tertiary" size="small" badgeStyle="light">`; overflow beyond `maxVisibleChips` collapses into a "+N" badge.
- [ActionSheet Menu](./_index_action-sheet-menu.md) — dropdown panel renders as `<ActionSheetMenu type="checkbox">` inside a Radix `Popover.Content`.

### External libraries

- [@radix-ui/react-popover](https://www.npmjs.com/package/@radix-ui/react-popover) — open/close behavior, portal, positioning of the dropdown panel
- [class-variance-authority](https://www.npmjs.com/package/class-variance-authority) — cva composition for the root and chips-row layout wrappers
- [lucide-react](https://www.npmjs.com/package/lucide-react) — `ChevronDown`, `ChevronRight`, `X` icons

### Token groups

- [Colors](../tokens/colors.md)
- [Spacing](../tokens/spacing.md)
- [Radius](../tokens/radius.md)
- [Typography](../tokens/typography.md)

## Used by

*Not yet used by any other klp component.*

## Files

- Source: [`src/components/input-multiselect/InputMultiselect.tsx`](../../src/components/input-multiselect/InputMultiselect.tsx)
- Example: [`src/components/input-multiselect/InputMultiselect.example.tsx`](../../src/components/input-multiselect/InputMultiselect.example.tsx)
- Playground: [`playground/routes/input-multiselect.tsx`](../../playground/routes/input-multiselect.tsx)
- Registry: [`registry/input-multiselect.json`](../../registry/input-multiselect.json)
- Figma spec: [`.klp/figma-refs/input-multiselect/spec.json`](../../.klp/figma-refs/input-multiselect/spec.json)
- Reference screenshots: [`.klp/figma-refs/input-multiselect/`](../../.klp/figma-refs/input-multiselect/)

<!-- KLP:GAPS:BEGIN -->
## DS gaps

| Part | Kind | Reason | Action |
|---|---|---|---|
| `chip-remove-icon` | `partial-reuse` | Badge's `rightIcon` slot renders inside an aria-hidden wrapper (decorative-icon assumption), so it cannot host an accessible remove control. | Wrapped the whole Badge in a native `<button className="contents">` with `aria-label="Remove {label}"` to provide the actual remove affordance; Badge's `rightIcon` still renders the decorative X glyph. |
| `dropdown` | `partial-reuse` | `ActionSheetMenu` hardcodes `role="menu"` internally; a true combobox pattern expects listbox semantics. | Used `ActionSheetMenu` as-is (role mismatch not corrected — editing the shared DS component is out of scope for this adapter pass). |
<!-- KLP:GAPS:END -->

<!-- KLP:NOTES:BEGIN -->
## Notes

*Manual prose preserved across regenerations. Anything between the BEGIN/END markers is never overwritten by the documentalist.*
<!-- KLP:NOTES:END -->
