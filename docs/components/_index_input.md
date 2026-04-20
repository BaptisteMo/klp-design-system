---
title: Input
type: component
status: stable
category: inputs
captureBrand: klub
radixPrimitive: "@radix-ui/react-slot"
sources:
  - .klp/figma-refs/input/spec.json
  - src/components/input/Input.tsx
dependencies:
  components: []
  externals: ["class-variance-authority", "lucide-react"]
  tokenGroups: ["colors", "spacing", "radius", "typography"]
  brands: ["klub"]
usedBy: [header-desktop]
created: 2026-04-16
updated: 2026-04-16
---

# Input

Text input field with label, optional icons (search/action), and helper text. Supports three sizes (large, medium, small) and six states (default, filled, focused, success, danger, disable).

## Anatomy

```
root            (div)  — Outer wrapper; flex-col with gap-klp-size-xs between head and input-box
├── head        (div)  — Row containing label text and optional info icon; gap-klp-size-xs; rendered only when label prop is provided
│   ├── label   (label) — Input label text; large uses font-size-text-large + label-bold weight; medium uses text-large + label weight; small uses text-medium + label weight
│   └── info-icon (span) — Optional info icon (lucide Info); color fg-brand; rendered only when showInfoIcon=true
├── input-box   (div)  — Visible input container with border + background; contains icon-left, native input, icon-right
│   ├── icon-left  (span) — Optional leading icon slot; color fg-subtle (non-disable) or fg-disable
│   ├── placeholder (input) — Native <input> element; text color varies by state; uses font-family-label + font-size-text-medium
│   └── icon-right (span) — Optional trailing icon/action slot; color fg-subtle (non-disable) or fg-disable
└── description (p)   — Optional helper text below input-box; rendered only when description prop is provided
```

## Variants

Rows = `size`, Columns = `state`. Each cell links to its Figma reference screenshot.

| size \ state | default | filled | focused | success | danger | disable |
|---|---|---|---|---|---|---|
| **large** | [✓](.klp/figma-refs/input/large-default.png) | [✓](.klp/figma-refs/input/large-filled.png) | [✓](.klp/figma-refs/input/large-focused.png) | [✓](.klp/figma-refs/input/large-success.png) | [✓](.klp/figma-refs/input/large-danger.png) | [✓](.klp/figma-refs/input/large-disable.png) |
| **medium** | [✓](.klp/figma-refs/input/medium-default.png) | [✓](.klp/figma-refs/input/medium-filled.png) | [✓](.klp/figma-refs/input/medium-focused.png) | [✓](.klp/figma-refs/input/medium-success.png) | [✓](.klp/figma-refs/input/medium-danger.png) | [✓](.klp/figma-refs/input/medium-disable.png) |
| **small** | [✓](.klp/figma-refs/input/small-default.png) | [✓](.klp/figma-refs/input/small-filled.png) | [✓](.klp/figma-refs/input/small-focused.png) | [✓](.klp/figma-refs/input/small-success.png) | [✓](.klp/figma-refs/input/small-danger.png) | [✓](.klp/figma-refs/input/small-disable.png) |

**Key visual differences across states** (source: spec.json:variants):
- `default` / `disable` → `border-klp-border-default`; `disable` also sets background to `bg-klp-bg-disable`
- `filled` / `focused` → `border-klp-border-brand`
- `success` → `border-klp-border-success-emphasis`
- `danger` → `border-klp-border-danger-emphasis`

## API

`InputProps` extends `Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'>` — all standard HTML input attributes are forwarded to the native `<input>` element (e.g. `value`, `onChange`, `placeholder`, `aria-*`). `size` is omitted from HTML attributes to avoid conflict with the visual size prop.

| Prop | Type | Default | Description |
|---|---|---|---|
| `label` | `string` | — | Label text displayed above the input box; omit to suppress the head layer entirely. |
| `description` | `string` | — | Helper / error message displayed below the input box; omit to suppress the description layer. |
| `showInfoIcon` | `boolean` | `false` | When true, renders a `lucide-react` `Info` icon (16 px, `fg-brand` color) beside the label. |
| `iconLeft` | `React.ReactNode` | — | Icon slot rendered on the left inside the input box; icon receives `currentColor` from `fg-subtle` / `fg-disable`. |
| `iconRight` | `React.ReactNode` | — | Icon slot rendered on the right inside the input box; same color rules as `iconLeft`. |
| `size` | `"large" \| "medium" \| "small"` | `"medium"` | Controls padding scale, label font size, and item spacing inside the input box. |
| `state` | `"default" \| "filled" \| "focused" \| "success" \| "danger" \| "disable"` | `"default"` | Explicit visual state override. When omitted, state is derived from `disabled` (→ `"disable"`) and `aria-invalid` (→ `"danger"`). |
| `className` | `string` | — | Additional Tailwind classes applied to the outer root `div`. |
| `inputBoxClassName` | `string` | — | Additional Tailwind classes applied to the input-box `div` wrapper. |
| `id` | `string` | auto | Native HTML `id` forwarded to `<input>` and bound to `<label htmlFor>`. Auto-generated from `label` when omitted. |
| `disabled` | `boolean` | — | Standard HTML attribute; maps to `state="disable"` when no explicit `state` is given. |
| `aria-invalid` | `boolean \| "true" \| "false"` | — | Standard ARIA attribute; maps to `state="danger"` when set to `true` / `"true"` and no explicit `state` is given. |

## Tokens

### `root` layer

| Property | Token | Resolved (klub) |
|---|---|---|
| item-spacing (gap) | `--klp-size-xs` | `var(--klp-spacing-2)` |

### `head` layer

| Property | Token | Resolved (klub) |
|---|---|---|
| item-spacing (gap) | `--klp-size-xs` | `var(--klp-spacing-2)` |

### `label` layer

| Property | Token | Resolved (klub) |
|---|---|---|
| color | `--klp-fg-default` | `var(--klp-color-gray-800)` |
| font-size (large) | `--klp-font-size-text-large` | `18px` |
| font-size (medium/small) | `--klp-font-size-text-medium` | `16px` |
| font-family | `--klp-font-family-label` | `'Inter', 'Test Calibre', system-ui, sans-serif` |
| font-weight (large) | `--klp-font-weight-label-bold` | `600` |
| font-weight (medium/small) | `--klp-font-weight-label` | `400` |

### `info-icon` layer

| Property | Token | Resolved (klub) |
|---|---|---|
| color | `--klp-fg-brand` | `var(--klp-color-emerald-500)` |
| size | literal: `16px` | — |

### `input-box` layer

| Property | Token | Resolved (klub) |
|---|---|---|
| fill (non-disable) | `--klp-bg-default` | `var(--klp-color-light-100)` |
| fill (disable) | `--klp-bg-disable` | `var(--klp-color-gray-200)` |
| stroke (default/disable) | `--klp-border-default` | `var(--klp-color-gray-400)` |
| stroke (filled/focused) | `--klp-border-brand` | `var(--klp-color-emerald-500)` |
| stroke (success) | `--klp-border-success-emphasis` | `var(--klp-color-green-500)` |
| stroke (danger) | `--klp-border-danger-emphasis` | `var(--klp-color-red-500)` |
| corner-radius | `--klp-radius-l` | `var(--klp-radius-lg)` |
| padding-x (large) | `--klp-size-m` | `var(--klp-spacing-4)` |
| padding-y (large) | `--klp-size-m` | `var(--klp-spacing-4)` |
| padding-x (medium) | `--klp-size-s` | `var(--klp-spacing-3)` |
| padding-y (medium) | `--klp-size-s` | `var(--klp-spacing-3)` |
| padding-x (small) | `--klp-size-xs` | `var(--klp-spacing-2)` |
| padding-y (small) | `--klp-size-xs` | `var(--klp-spacing-2)` |
| item-spacing (large) | `--klp-size-s` | `var(--klp-spacing-3)` |
| item-spacing (medium) | `--klp-size-s` | `var(--klp-spacing-3)` |
| item-spacing (small) | `--klp-size-xs` | `var(--klp-spacing-2)` |

### `icon-left` layer

| Property | Token | Resolved (klub) |
|---|---|---|
| color (non-disable) | `--klp-fg-subtle` | `var(--klp-color-gray-600)` |
| color (disable) | `--klp-fg-disable` | `var(--klp-color-gray-600)` |
| padding | literal: `2px` | — |

### `placeholder` layer (native `<input>`)

| Property | Token | Resolved (klub) |
|---|---|---|
| color (default/focused) | `--klp-fg-subtle` | `var(--klp-color-gray-600)` |
| color (filled/success/danger) | `--klp-fg-default` | `var(--klp-color-gray-800)` |
| color (disable) | `--klp-fg-disable` | `var(--klp-color-gray-600)` |
| font-size | `--klp-font-size-text-medium` | `16px` |
| font-family | `--klp-font-family-label` | `'Inter', 'Test Calibre', system-ui, sans-serif` |
| font-weight | `--klp-font-weight-label` | `400` |

### `icon-right` layer

| Property | Token | Resolved (klub) |
|---|---|---|
| color (non-disable) | `--klp-fg-subtle` | `var(--klp-color-gray-600)` |
| color (disable) | `--klp-fg-disable` | `var(--klp-color-gray-600)` |
| padding | literal: `2px` | — |

### `description` layer

| Property | Token | Resolved (klub) |
|---|---|---|
| color (default/filled/focused/success) | `--klp-fg-subtle` | `var(--klp-color-gray-600)` |
| color (danger) | `--klp-fg-danger` | `var(--klp-color-red-500)` |
| color (disable) | `--klp-fg-disable` | `var(--klp-color-gray-600)` |
| font-size | `--klp-font-size-text-medium` | `16px` |
| font-family | `--klp-font-family-label` | `'Inter', 'Test Calibre', system-ui, sans-serif` |

> Note: In all 18 Figma-captured variants, the description layer has `display: none` (BOOLEAN prop default false). The description color for the `danger` state (`--klp-fg-danger`) is applied in source code but not present in captured spec variants — it is an implementation-time extension consistent with the spec's design intent. (source: spec.json:variants, src/components/input/Input.tsx:descriptionVariants)

## Examples

```tsx
import { Input } from './Input'

const SearchIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="7" cy="7" r="5" stroke="currentColor" strokeWidth="1.5" />
    <path d="M11 11L14 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
)

const ChevronIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M4 6L8 10L12 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

export function InputExample() {
  return (
    <div className="flex flex-col gap-4 p-6">
      {/* Large / default */}
      <Input
        label="Label of the input"
        size="large"
        state="default"
        showInfoIcon
        iconLeft={<SearchIcon />}
        iconRight={<ChevronIcon />}
        placeholder="Placeholder"
      />

      {/* Medium / filled */}
      <Input
        label="Label of the input"
        size="medium"
        state="filled"
        showInfoIcon
        iconLeft={<SearchIcon />}
        iconRight={<ChevronIcon />}
        defaultValue="Filled value"
      />

      {/* Small / danger with description */}
      <Input
        label="Label of the input"
        size="small"
        state="danger"
        aria-invalid="true"
        showInfoIcon
        iconLeft={<SearchIcon />}
        iconRight={<ChevronIcon />}
        placeholder="Placeholder"
        description="This field is required."
      />

      {/* Disabled */}
      <Input
        label="Label of the input"
        size="medium"
        disabled
        iconLeft={<SearchIcon />}
        placeholder="Disabled"
      />
    </div>
  )
}
```

## Accessibility

- **Role**: `textbox` (native `<input type="text">`)
- **Keyboard support**: `Tab` (focus input), `Enter` (submit form if applicable), `Escape` (browser default)
- **ARIA notes**: Uses native `<input>` element. Label must be associated via `htmlFor`/`id` — the component auto-generates an `id` from the `label` prop when none is supplied. Disabled state sets the native `disabled` attribute (maps to `aria-disabled` semantics implicitly). Error/danger state should set `aria-invalid="true"` on the component; the state derivation logic automatically applies the `danger` visual state. Associate error message via `aria-describedby` pointing to the description element. (source: spec.json:a11y)

## Dependencies

### klp components

*Leaf component — no klp dependencies.*

### External libraries

- [class-variance-authority](https://www.npmjs.com/package/class-variance-authority) — variant class composition for all 9 CVA blocks.
- [lucide-react](https://www.npmjs.com/package/lucide-react) — `Info` icon rendered in the info-icon layer.

> Note: `@radix-ui/react-slot` is listed as `radixPrimitive` in the Figma spec but is not directly imported in the current source — `InputProps` extends `React.InputHTMLAttributes` directly via the native `<input>` element. (source: src/components/input/Input.tsx:imports)

### Token groups

- [Colors](../tokens/colors.md) — `bg-*`, `fg-*`, `border-*` tokens across all state variants.
- [Spacing](../tokens/spacing.md) — `size-xs`, `size-s`, `size-m` for gap and padding.
- [Radius](../tokens/radius.md) — `radius-l` on the input-box layer.
- [Typography](../tokens/typography.md) — `font-family-label`, `font-weight-label`, `font-weight-label-bold`, `font-size-text-large`, `font-size-text-medium` on label, placeholder, and description layers.

### Brands

- [klub](../brands/klub.md) — Figma reference screenshots captured under the klub brand.

## Used by

- [Header Desktop](./_index_header-desktop.md) — imports `Input` for the search field in the search-active variant (`size="small" state="default"`).

## Files

- Source: [`src/components/input/Input.tsx`](../../src/components/input/Input.tsx)
- Example: [`src/components/input/Input.example.tsx`](../../src/components/input/Input.example.tsx)
- Playground: [`playground/routes/input.tsx`](../../playground/routes/input.tsx)
- Registry: [`registry/input.json`](../../registry/input.json)
- Figma spec: [`.klp/figma-refs/input/spec.json`](../../.klp/figma-refs/input/spec.json)
- Reference screenshots: [`.klp/figma-refs/input/`](../../.klp/figma-refs/input/)

<!-- KLP:NOTES:BEGIN -->
## Notes

*Manual prose preserved across regenerations. Anything between the BEGIN/END markers is never overwritten by the documentalist.*
<!-- KLP:NOTES:END -->

<!-- KLP:GAPS:BEGIN -->
## Gaps

No gaps recorded.
<!-- KLP:GAPS:END -->
