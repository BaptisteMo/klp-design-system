---
title: Text Area
type: component
status: stable
category: inputs
captureBrand: wireframe
radixPrimitive: "@radix-ui/react-slot"
sources:
  - .klp/figma-refs/text-area/spec.json
  - src/components/text-area/TextArea.tsx
dependencies:
  components: []
  externals: ["class-variance-authority", "lucide-react"]
  tokenGroups: ["colors", "spacing", "typography"]
  brands: ["wireframe"]
usedBy: []
created: 2026-04-17
updated: 2026-04-17
---

# Text Area

Multi-line text input with optional rich-text formatting toolbar. Two feature variants: Simple (plain textarea) and Rich text (with formatting toolbar and action bar). Supports Default, Focus, Filled, Danger, Success, and Disable states.

## Anatomy

```
text-area
├── root         (div)    — Vertical flex wrapper; gap driven by --klp-size-m (all states)
│   ├── head     (div)    — Header row: label + optional info icon; gap --klp-size-xs; hidden when showHeader=false
│   │   ├── label     (label)  — Field label text; associated to textarea via htmlFor/id
│   │   └── info-icon (span)  — Info icon (lucide Info); hidden when showInfoIcon=false
│   └── input    (div)    — Main textarea container; fill, stroke and shadow change per state
│       ├── toolbar      (div)   — Rich text formatting row; only rendered for feature=rich-text
│       ├── placeholder  (span)  — The native <textarea> element; color varies per state
│       └── action-bar   (div)   — Bottom confirm/cancel action row; only rendered for feature=rich-text
```

## Variants

Primary axis: **feature**. Secondary axis: **state**.

| state \ feature | simple | rich-text |
|---|---|---|
| default | [✓](.klp/figma-refs/text-area/simple-default.png) | [✓](.klp/figma-refs/text-area/rich-text-default.png) |
| focus | [✓](.klp/figma-refs/text-area/simple-focus.png) | [✓](.klp/figma-refs/text-area/rich-text-focus.png) |
| filled | [✓](.klp/figma-refs/text-area/simple-filled.png) | [✓](.klp/figma-refs/text-area/rich-text-filled.png) |
| danger | [✓](.klp/figma-refs/text-area/simple-danger.png) | [✓](.klp/figma-refs/text-area/rich-text-danger.png) |
| success | [✓](.klp/figma-refs/text-area/simple-success.png) | [✓](.klp/figma-refs/text-area/rich-text-success.png) |
| disable | [✓](.klp/figma-refs/text-area/simple-disable.png) | [✓](.klp/figma-refs/text-area/rich-text-disable.png) |

12 total variant reference screenshots (source: `.klp/figma-refs/text-area/`).

## API

`TextAreaProps` extends `Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, 'children'>`. All native `<textarea>` attributes (e.g. `rows`, `name`, `onChange`, `onFocus`, `maxLength`) are forwarded to the underlying `<textarea>` element. `children` is omitted — use the `toolbar` and `actionBar` slots instead.

| Prop | Type | Default | Description |
|---|---|---|---|
| `feature` | `'simple' \| 'rich-text'` | `'simple'` | Feature variant: plain textarea or rich-text with toolbar + action bar |
| `state` | `'default' \| 'focus' \| 'filled' \| 'danger' \| 'success' \| 'disable'` | `'default'` | Visual state — maps to Figma variant axis |
| `label` | `string` | — | Field label text rendered in the head row |
| `showHeader` | `boolean` | `true` | Show the header row (label + optional info icon). Matches Figma "Show header" prop |
| `showInfoIcon` | `boolean` | `true` | Show the info icon next to the label. Matches Figma "Show info icon" prop |
| `placeholder` | `string` | — | Placeholder text shown inside the textarea |
| `id` | `string` | `'textarea'` | Accessible id linking label → textarea via `htmlFor` |
| `toolbar` | `React.ReactNode` | — | Slot for the toolbar content (feature=rich-text only) |
| `actionBar` | `React.ReactNode` | — | Slot for the action bar content (feature=rich-text only) |
| `className` | `string` | — | Extra className forwarded to the root wrapper div |
| `disabled` | `boolean` | — | Native disabled; overrides `state` to `'disable'` when true |

## Tokens

### `root` layer

| Property | Token | Resolved (wireframe) |
|---|---|---|
| gap | `--klp-size-m` | `var(--klp-spacing-4)` |

### `head` layer

| Property | Token | Resolved (wireframe) |
|---|---|---|
| gap | `--klp-size-xs` | `var(--klp-spacing-2)` |

### `label` layer

| Property | Token | Resolved (wireframe) |
|---|---|---|
| color (all states) | `--klp-fg-default` | `var(--klp-color-gray-800)` |
| font-size | `--klp-font-size-text-medium` | `16px` |
| font-family | `--klp-font-family-label` | `'Inter', 'Test Calibre', system-ui, sans-serif` |
| font-weight | `--klp-font-weight-label` | (from aliases.css) |
| line-height | literal: `24px` | — |

### `info-icon` layer

| Property | Token | Resolved (wireframe) |
|---|---|---|
| color (all states) | `--klp-fg-muted` | `var(--klp-color-gray-700)` |
| size | literal: `20px` | — |

> ❓ UNVERIFIED: `20px` icon sizing is hardcoded (no `--klp-*` alias for 20px icon size exists — see `spec.json:tokenGaps[1]`). Should adopt `--klp-size-icon-md` once available.

### `input` layer

State-variable tokens (source: `spec.json:variants[*].layers.input`):

| State | fill token | stroke token | Resolved fill (wireframe) | Resolved stroke (wireframe) |
|---|---|---|---|---|
| default | `--klp-bg-default` | `--klp-border-default` | `var(--klp-color-light-100)` | `var(--klp-color-gray-300)` |
| focus | `--klp-bg-default` | `--klp-border-brand` | `var(--klp-color-light-100)` | `var(--klp-color-gray-500)` |
| filled | `--klp-bg-default` | `--klp-border-brand` | `var(--klp-color-light-100)` | `var(--klp-color-gray-500)` |
| danger | `--klp-bg-default` | `--klp-border-danger-emphasis` | `var(--klp-color-light-100)` | `var(--klp-color-gray-500)` |
| success | `--klp-bg-default` | `--klp-border-success-emphasis` | `var(--klp-color-light-100)` | `var(--klp-color-gray-500)` |
| disable | `--klp-bg-inset` | `--klp-border-default` | `var(--klp-color-gray-200)` | `var(--klp-color-gray-300)` |

Common tokens (all states):

| Property | Token | Resolved (wireframe) |
|---|---|---|
| padding (top/right/bottom/left) | `--klp-size-m` | `var(--klp-spacing-4)` |
| gap (toolbar ↔ textarea ↔ action-bar) | `--klp-size-m` | `var(--klp-spacing-4)` |
| corner-radius | literal: `8px` | — |

> ❓ UNVERIFIED: `cornerRadius=8px` is hardcoded in the Figma spec (not bound to a variable). Should use `--klp-radius-l` (see `spec.json:tokenGaps[0]`).

### `toolbar` layer

| Property | Token | Resolved (wireframe) |
|---|---|---|
| gap | `--klp-size-xs` | `var(--klp-spacing-2)` |
| display | `hidden` for feature=simple | — |

### `placeholder` layer (the `<textarea>` element)

State-variable color tokens:

| State | color token | Resolved (wireframe) |
|---|---|---|
| default | `--klp-fg-subtle` | `var(--klp-color-gray-600)` |
| focus | `--klp-fg-default` | `var(--klp-color-gray-800)` |
| filled | `--klp-fg-default` | `var(--klp-color-gray-800)` |
| danger | `--klp-fg-danger-contrasted` | `var(--klp-color-gray-800)` |
| success | `--klp-fg-default` | `var(--klp-color-gray-800)` |
| disable | `--klp-fg-muted` | `var(--klp-color-gray-700)` |

Common typography tokens (all states):

| Property | Token | Resolved (wireframe) |
|---|---|---|
| font-size | `--klp-font-size-text-medium` | `16px` |
| font-family | `--klp-font-family-label` | `'Inter', 'Test Calibre', system-ui, sans-serif` |
| font-weight | `--klp-font-weight-label` | (from aliases.css) |
| line-height | literal: `24px` | — |

### `action-bar` layer

| Property | Token | Resolved (wireframe) |
|---|---|---|
| gap | `--klp-size-xs` | `var(--klp-spacing-2)` |
| display | `hidden` for feature=simple | — |

## Examples

```tsx
import { TextArea } from './TextArea'

export function TextAreaExample() {
  return (
    <div className="flex flex-col gap-6 p-6 max-w-md">
      {/* Simple — default state */}
      <TextArea
        feature="simple"
        state="default"
        label="Label"
        showHeader
        showInfoIcon
        placeholder="Placeholder text"
        id="example-simple"
        rows={4}
      />

      {/* Simple — danger state */}
      <TextArea
        feature="simple"
        state="danger"
        label="Label"
        showHeader
        showInfoIcon
        placeholder="Error text"
        id="example-danger"
        rows={4}
      />

      {/* Rich text — default state */}
      <TextArea
        feature="rich-text"
        state="default"
        label="Label"
        showHeader
        showInfoIcon
        placeholder="Start typing…"
        id="example-rich-text"
        rows={4}
        toolbar={<span className="text-klp-text-small text-klp-fg-muted">B I U</span>}
        actionBar={<span className="text-klp-text-small text-klp-fg-muted">Cancel · Confirm</span>}
      />
    </div>
  )
}
```

## Accessibility

- **Role**: `group` (source: `spec.json:a11y.role`)
- **Keyboard support**: `Tab`, `Shift+Tab` (source: `spec.json:a11y.keyboardSupport`)
- **ARIA notes**: The inner `<textarea>` uses native semantics. The `label` element is associated via `htmlFor`/`id`. The info-icon `<span>` carries `aria-label="More information"` and `<Info aria-hidden="true">`. The `disabled` prop sets the `disabled` attribute on the native `<textarea>`. Rich text toolbar buttons each need `aria-label` provided by the consuming code.

## Dependencies

### klp components

*Leaf component — no klp dependencies.*

### External libraries

- [@radix-ui/react-slot](https://www.npmjs.com/package/@radix-ui/react-slot) — declared as radixPrimitive in spec (source: `spec.json:radixPrimitive`)
- [class-variance-authority](https://www.npmjs.com/package/class-variance-authority) — variant class generation
- [lucide-react](https://www.npmjs.com/package/lucide-react) — `Info` icon for the info-icon slot

### Token groups

- [Colors](../tokens/colors.md) — `--klp-bg-*`, `--klp-fg-*`, `--klp-border-*` tokens consumed across all layers
- [Spacing](../tokens/spacing.md) — `--klp-size-m`, `--klp-size-xs` for gaps and padding
- [Typography](../tokens/typography.md) — `--klp-font-size-text-medium`, `--klp-font-family-label`, `--klp-font-weight-label`

### Brands

- [wireframe](../brands/wireframe.md) — capture brand for all reference screenshots

## Used by

*Not yet used by any other klp component.*

## Files

- Source: [`src/components/text-area/TextArea.tsx`](../../src/components/text-area/TextArea.tsx)
- Example: [`src/components/text-area/TextArea.example.tsx`](../../src/components/text-area/TextArea.example.tsx)
- Playground: [`playground/routes/text-area.tsx`](../../playground/routes/text-area.tsx)
- Registry: [`registry/text-area.json`](../../registry/text-area.json)
- Figma spec: [`.klp/figma-refs/text-area/spec.json`](../../.klp/figma-refs/text-area/spec.json)
- Reference screenshots: [`.klp/figma-refs/text-area/`](../../.klp/figma-refs/text-area/)

<!-- KLP:NOTES:BEGIN -->
## Notes

*Manual prose preserved across regenerations. Anything between the BEGIN/END markers is never overwritten by the documentalist.*
<!-- KLP:NOTES:END -->
