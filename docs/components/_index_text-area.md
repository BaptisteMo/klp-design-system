---
title: Text Area
type: component
status: stable
category: inputs
captureBrand: klub
radixPrimitive: null
sources:
  - .klp/figma-refs/text-area/spec.json
  - src/components/text-area/TextArea.tsx
dependencies:
  components: ["button"]
  externals: ["class-variance-authority", "lucide-react"]
  tokenGroups: ["colors", "spacing", "radius", "typography"]
  brands: ["klub"]
usedBy: []
created: 2026-04-17
updated: 2026-04-21
---

# Text Area

A multi-line text input with label, optional info icon, and two feature modes: simple (plain textarea) and rich-text (adds a formatting toolbar with tertiary icon buttons). Six visual states auto-derived from focus/value/disabled/aria-invalid signals.

<!-- KLP:INTENT:BEGIN -->

## When to use

Multi-line free text — comments, descriptions, notes. The rich-text feature adds a formatting toolbar and action bar; simple is a plain multi-line field.

**Don't use it for:** Not for a single-line value — that is input. Not for a value that is only read — that is data-field.

## Don't confuse with

| Component | How to choose |
|---|---|
| `input` | text-area is multi-line; input is one line. |
| `data-field` | text-area is editable; data-field is read-only. |

<!-- KLP:INTENT:END -->
## Anatomy

```
div (root)
├── head (div)          — Label row; hidden when showHeader=false
│   ├── label (label)   — Field label; linked to textarea via htmlFor
│   └── info-icon (span) — Info icon; shown when showInfoIcon=true
├── input (div)         — Styled container; border + bg vary by state
│   ├── toolbar (div)   — rich-text only; flex row of tertiary icon Buttons
│   └── textarea (textarea) — Native HTML textarea
```

## Variants

| feature \ state | default | focus | filled | danger | success | disable |
|---|---|---|---|---|---|---|
| simple | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| rich-text | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |

## Props usage

Extends `Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, 'children'>`.

| Prop | Class | Type | Default | Description |
|---|---|---|---|---|
| `state` | **computed** | `TextAreaState` | derived | Explicit visual state override. When omitted, state is derived from native attributes (`disabled` → "disable", `aria-invalid` → "danger") and from focus/value events (`hasValue` → "filled", `isFocused` → "focus"). |
| `feature` | optional | `'simple' \| 'rich-text'` | `"simple"` | Feature variant: plain textarea or rich-text with toolbar + action bar |
| `label` | optional | `string` | — | Field label |
| `showHeader` | optional | `boolean` | `true` | Show the header row (label + optional info icon). Matches Figma Show header prop. |
| `showInfoIcon` | optional | `boolean` | `true` | Show the info icon next to the label. Matches Figma Show info icon prop. |
| `placeholder` | optional | `string` | — | Placeholder text shown inside the input area |
| `id` | optional | `string` | `"textarea"` | Accessible id linking label to textarea |
| `toolbarActions` | optional | `ToolbarAction[]` | — | Rich-text toolbar actions (feature=rich-text only). Each action renders as a tertiary icon Button. |
| `className` | optional | `string` | — | Extra className forwarded to the root wrapper |
| `resize` | optional | `TextAreaResize` | `"none"` | Resize handle behavior on the textarea |

### Do / Don't

**Do:** Omit `state` in interactive contexts. The component auto-derives `filled`, `focused`, `disable`, and `danger` states from `value`, focus events, `disabled`, and `aria-invalid`.

**Don't:** Set `state` manually in interactive contexts — it overrides the derived state entirely, breaking the focus ring and filled color transitions.

**Do:** Use `state` in playground matrices and static design presentations where you want to lock a specific visual appearance.

## Examples

```tsx
import { Bold, Italic, Underline, Link as LinkIcon, List } from 'lucide-react'
import { TextArea, type ToolbarAction } from './TextArea'

const DEMO_TOOLBAR: ToolbarAction[] = [
  { label: 'Bold',      icon: <Bold strokeWidth={1.5} /> },
  { label: 'Italic',    icon: <Italic strokeWidth={1.5} /> },
  { label: 'Underline', icon: <Underline strokeWidth={1.5} /> },
  { label: 'Bulleted list', icon: <List strokeWidth={1.5} /> },
  { label: 'Link',      icon: <LinkIcon strokeWidth={1.5} /> },
]

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
        resize="none"
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
        resize="vertical"
        toolbarActions={DEMO_TOOLBAR}
      />
    </div>
  )
}
```

## Accessibility

- **Role**: native `<textarea>` semantics
- **Keyboard support**: Standard keyboard input; Tab to focus.
- **ARIA notes**: `htmlFor` auto-wires label to textarea via the `id` prop. Pass `aria-invalid` to trigger the danger state and communicate to screen readers. Toolbar buttons have `aria-label` and `title` from each `ToolbarAction.label`.

## Dependencies

### klp components

- [Button](./_index_button.md) — toolbar action buttons render as `<Button variant="tertiary" size="icon">` in rich-text mode.

### External libraries

- [class-variance-authority](https://www.npmjs.com/package/class-variance-authority) — cva variant composition
- [lucide-react](https://www.npmjs.com/package/lucide-react) — Info icon in the label row

### Token groups

- [Colors](../tokens/colors.md)
- [Spacing](../tokens/spacing.md)
- [Radius](../tokens/radius.md)
- [Typography](../tokens/typography.md)

## Used by

*Not yet used by any other klp component.*

## Files

- Source: [`src/components/text-area/TextArea.tsx`](../../src/components/text-area/TextArea.tsx)
- Example: [`src/components/text-area/TextArea.example.tsx`](../../src/components/text-area/TextArea.example.tsx)
- Playground: [`playground/routes/text-area.tsx`](../../playground/routes/text-area.tsx)
- Registry: [`registry/text-area.json`](../../registry/text-area.json)
- Figma spec: [`.klp/figma-refs/text-area/spec.json`](../../.klp/figma-refs/text-area/spec.json)
- Reference screenshots: [`.klp/figma-refs/text-area/`](../../.klp/figma-refs/text-area/)

<!-- KLP:GAPS:BEGIN -->
## DS gaps

No gaps recorded.
<!-- KLP:GAPS:END -->

<!-- KLP:NOTES:BEGIN -->
## Notes

*Manual prose preserved across regenerations. Anything between the BEGIN/END markers is never overwritten by the documentalist.*
<!-- KLP:NOTES:END -->
