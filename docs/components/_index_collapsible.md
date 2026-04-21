---
title: Collapsible
type: component
status: stable
category: disclosure
captureBrand: wireframe
radixPrimitive: "@radix-ui/react-collapsible"
sources:
  - .klp/figma-refs/collapsible/spec.json
  - src/components/collapsible/Collapsible.tsx
dependencies:
  components: [button]
  externals: ["@radix-ui/react-collapsible", "class-variance-authority", "lucide-react"]
  tokenGroups: [colors, radius, spacing, typography]
  brands: [wireframe]
usedBy: []
created: 2026-04-21
updated: 2026-04-21
---

# Collapsible

Expandable disclosure panel with a header (icon + title + chevron toggle button) and a collapsible content area. Single variant axis: open/close state.

## Anatomy

```
collapsible
├── root          (div)  — Outer card wrapper. cornerRadius differs per state: rounded-klp-l (close), rounded-klp-xl (open). Both bind fill/stroke to --klp-bg-default / --klp-border-default.
├── header        (div)  — Trigger row with icon, title, and toggle button. In open state: frosted-glass fill (bg-klp-bg-inset/70 + backdrop-blur-xl). In close state: the header IS the root — no separate header frame.
├── icon          (span) — Leading icon in the header. Defaults to ShoppingCart placeholder; consumer replaces via the `icon` prop. Lucide icon wrapper at 16px size, 20px wrapper.
├── title         (span) — Section title text. semibold (font-klp-label-bold), text-large (text-klp-text-large), color fg/default.
├── toggle-button (button) — DS Button (variant=tertiary, size=icon) wrapping a ChevronDown icon. Triggers open/close via Radix CollapsiblePrimitive.Trigger.
├── content       (div)  — Revealed content area. Hidden when state=close. px-klp-size-m py-klp-size-l gap-klp-size-m. cornerRadius 12px (literal, no klp alias — uses rounded-[12px]).
└── content-text  (p)    — Placeholder body text slot inside the content area. Consumer replaces with arbitrary children.
```

## Variants

Single variant axis: **state** (`close` | `open`).

| State | Reference screenshot |
|---|---|
| `close` | [close-default.png](../../.klp/figma-refs/collapsible/close-default.png) |
| `open` | [open-default.png](../../.klp/figma-refs/collapsible/open-default.png) |

Key visual differences between states (source: spec.json:variants):

| Layer | close | open |
|---|---|---|
| `root` cornerRadius | `rounded-klp-l` (8px literal) | `rounded-klp-xl` (16px literal) |
| `root` padding | `px-klp-size-m py-klp-size-m` | — (delegated to sub-layers) |
| `header` fill | — (root IS header) | `bg-klp-bg-inset/70 backdrop-blur-xl` |
| `content` | hidden | `px-klp-size-m py-klp-size-l gap-klp-size-m` |

## API

`CollapsibleProps` extends no HTML attributes directly. The root renders as a `CollapsiblePrimitive.Root` (`<div>`); native div attributes can be added via the `className` prop.

| Prop | Type | Default | Description |
|---|---|---|---|
| `open` | `boolean` | — | Controlled open state. If provided, the component is fully controlled. |
| `defaultOpen` | `boolean` | `false` | Uncontrolled initial open state. |
| `onOpenChange` | `(open: boolean) => void` | — | Callback fired when open state changes. |
| `icon` | `React.ReactNode` | `<ShoppingCart />` | Leading icon rendered in the header. Defaults to ShoppingCart as a placeholder; consumers should replace with a contextually appropriate lucide-react icon. |
| `title` | `string` | `'Section title'` | Section title rendered in the header. |
| `children` | `React.ReactNode` | — | Content rendered inside the collapsible area. If omitted, renders a placeholder `<p>` with default text. |
| `className` | `string` | — | Additional className applied to the root element. |

Re-exported Radix compound parts for advanced composition:

- `CollapsibleRoot` — `CollapsiblePrimitive.Root`
- `CollapsibleTrigger` — `CollapsiblePrimitive.Trigger`
- `CollapsibleContent` — `CollapsiblePrimitive.Content`

## Tokens

### `root` layer

| Property | Token | Resolved (wireframe) |
|---|---|---|
| fill | `--klp-bg-default` | `var(--klp-color-light-100)` |
| stroke | `--klp-border-default` | `var(--klp-color-gray-300)` |
| paddingX (close) | `--klp-size-m` | `var(--klp-spacing-4)` / 16px |
| paddingY (close) | `--klp-size-m` | `var(--klp-spacing-4)` / 16px |
| itemSpacing (close) | `--klp-size-m` | `var(--klp-spacing-4)` / 16px |
| cornerRadius (close) | literal: 8px | closest alias: `--klp-radius-l` |
| cornerRadius (open) | literal: 16px | closest alias: `--klp-radius-xl` |

### `header` layer (open state only)

| Property | Token | Resolved (wireframe) |
|---|---|---|
| fill | literal: `#EEF1F0` at 70% opacity | expected: `--klp-bg-inset` / `var(--klp-color-gray-200)` at 70% opacity — no Figma variable bound |
| backdrop-blur | literal: 20px | no alias — uses Tailwind `backdrop-blur-xl` |
| paddingX | `--klp-size-m` | `var(--klp-spacing-4)` / 16px |
| paddingY | `--klp-size-m` | `var(--klp-spacing-4)` / 16px |

> ❓ UNVERIFIED: header fill has no `boundVariable` in Figma (`open-default` variant). Adapter uses `bg-klp-bg-inset/70` — this resolves correctly on wireframe but should be verified on other brands once brand variants are captured.

### `icon` layer

| Property | Token | Resolved (wireframe) |
|---|---|---|
| color | `--klp-fg-default` | `var(--klp-color-gray-800)` |
| icon size | literal: 16px | no alias |
| wrapper size | literal: 20px | no alias |

### `title` layer

| Property | Token | Resolved (wireframe) |
|---|---|---|
| color | `--klp-fg-default` | `var(--klp-color-gray-800)` |
| font-size | `--klp-font-size-text-large` | 18px |
| font-family | `--klp-font-family-label` | Inter, Test Calibre, system-ui |
| font-weight | `--klp-font-weight-label-bold` | 600 |
| line-height | literal: 28px | no alias |

### `toggle-button` layer

Delegated to the DS **Button** component (`variant=tertiary, size=icon`). Token bindings from Button spec apply.

| Property | Token | Resolved (wireframe) |
|---|---|---|
| fill | `--klp-bg-invisible` | `var(--klp-color-light-0)` |
| stroke | `--klp-border-invisible` | `var(--klp-color-light-0)` |
| paddingAll | `--klp-size-xs` | `var(--klp-spacing-2)` / 8px |
| cornerRadius | `--klp-radius-l` | `var(--klp-radius-lg)` / 8px |
| chevron icon color | `--klp-fg-muted` | `var(--klp-color-gray-700)` |

### `content` layer (open state only)

| Property | Token | Resolved (wireframe) |
|---|---|---|
| paddingX | literal 16px → `--klp-size-m` | `var(--klp-spacing-4)` / 16px (unbound in Figma) |
| paddingY | literal 24px → `--klp-size-l` | `var(--klp-spacing-6)` / 24px (unbound in Figma) |
| gap | literal 16px → `--klp-size-m` | `var(--klp-spacing-4)` / 16px (unbound in Figma) |
| cornerRadius | literal: 12px | no alias — closest is `--klp-radius-xl` (16px); adapter uses `rounded-[12px]` |

### `content-text` layer (open state only)

| Property | Token | Resolved (wireframe) |
|---|---|---|
| font-size | `--klp-font-size-text-medium` | 16px |
| font-family | `--klp-font-family-label` | Inter, Test Calibre, system-ui |
| font-weight | `--klp-font-weight-label` | 400 |
| color | literal: `#000000` | expected: `--klp-fg-default` / `var(--klp-color-gray-800)` — no Figma variable bound |

## Examples

```tsx
import { ShoppingCart } from 'lucide-react'
import { Collapsible } from './Collapsible'

export function CollapsibleExample() {
  return (
    <div className="flex flex-col gap-4 p-6 max-w-md">
      {/* Closed (default) */}
      <Collapsible
        icon={<ShoppingCart strokeWidth={1.5} />}
        title="My section"
        defaultOpen={false}
      >
        <p>This is the hidden content revealed when expanded.</p>
      </Collapsible>

      {/* Open */}
      <Collapsible
        icon={<ShoppingCart strokeWidth={1.5} />}
        title="My section"
        defaultOpen={true}
      >
        <p>This is the hidden content revealed when expanded.</p>
      </Collapsible>
    </div>
  )
}
```

## Accessibility

- **Role:** `region` — the collapsible content area is a landmark region when labelled.
- **Keyboard support:** `Enter`, `Space` — activates the toggle-button trigger to expand or collapse.
- **ARIA notes:** Uses `@radix-ui/react-collapsible`. The trigger is a `<Collapsible.Trigger>` wrapping the DS Button (`asChild` pattern). `aria-expanded` is managed automatically by Radix. The toggle Button receives an explicit `aria-label` (`"Collapse section"` / `"Expand section"`) based on the current open state. (Source: spec.json:a11y)

## Dependencies

### klp components

- [Button](./_index_button.md) — `toggle-button` renders as `<Button variant="tertiary" size="icon">` wrapping a `ChevronDown` lucide icon. A rotation class (`rotate-180`) is appended via `className` to animate the chevron on open. (Source: src/components/collapsible/Collapsible.tsx:190-205)

### External libraries

- [@radix-ui/react-collapsible](https://www.npmjs.com/package/@radix-ui/react-collapsible) — Radix primitive providing `Root`, `Trigger`, and `Content` with `aria-expanded` management.
- [class-variance-authority](https://www.npmjs.com/package/class-variance-authority) — `cva` blocks for each anatomy layer (`rootVariants`, `headerVariants`, `iconVariants`, `titleVariants`, `contentVariants`, `contentTextVariants`).
- [lucide-react](https://www.npmjs.com/package/lucide-react) — `ChevronDown` (toggle chevron), `ShoppingCart` (default placeholder icon).

### Token groups

- [Colors](../tokens/colors.md) — `bg-default`, `bg-inset`, `bg-invisible`, `border-default`, `border-invisible`, `fg-default`, `fg-muted` tokens.
- [Radius](../tokens/radius.md) — `radius-l` (toggle-button cornerRadius), `radius-xl` (open root cornerRadius via literal `rounded-klp-xl`), `radius-l` (close root via literal `rounded-klp-l`).
- [Spacing](../tokens/spacing.md) — `size-m` (root padding/gap, header padding, content paddingX/gap), `size-l` (content paddingY), `size-xs` (toggle-button padding).
- [Typography](../tokens/typography.md) — `font-size-text-large` / `font-size-text-medium`, `font-family-label`, `font-weight-label-bold` / `font-weight-label`.

### Brands

- [wireframe](../brands/wireframe.md) — reference screenshots captured under the wireframe brand (2 variants: close-default, open-default).

## Used by

*Not yet used by any other klp component.*

## Files

- Source: [`src/components/collapsible/Collapsible.tsx`](../../src/components/collapsible/Collapsible.tsx)
- Example: [`src/components/collapsible/Collapsible.example.tsx`](../../src/components/collapsible/Collapsible.example.tsx)
- Playground: [`playground/routes/collapsible.tsx`](../../playground/routes/collapsible.tsx)
- Registry: [`registry/collapsible.json`](../../registry/collapsible.json)
- Figma spec: [`.klp/figma-refs/collapsible/spec.json`](../../.klp/figma-refs/collapsible/spec.json)
- Reference screenshots: [`.klp/figma-refs/collapsible/`](../../.klp/figma-refs/collapsible/)

<!-- KLP:GAPS:BEGIN -->
## DS gaps

| Part | Kind | Reason | Action |
|---|---|---|---|
| `toggle-button` | `partial-reuse` | Button is imported and used for the toggle. ChevronDown is passed as children (icon-only slot). A rotation class is appended via `className` to animate the chevron on open — this is a one-off visual tweak, not a rebuild. | `className-override` |

<!-- KLP:GAPS:END -->

<!-- KLP:NOTES:BEGIN -->
## Notes

*Manual prose preserved across regenerations. Anything between the BEGIN/END markers is never overwritten by the documentalist.*
<!-- KLP:NOTES:END -->
