---
title: Modal Variation
type: component
status: stable
category: overlays
captureBrand: wireframe
radixPrimitive: "@radix-ui/react-dialog"
sources:
  - .klp/figma-refs/modal-variation/spec.json
  - src/components/modal-variation/ModalVariation.tsx
dependencies:
  components: [button]
  externals: ["@radix-ui/react-dialog", "class-variance-authority"]
  tokenGroups: [colors, radius, spacing, typography]
  brands: [wireframe]
usedBy: []
created: 2026-04-23
updated: 2026-04-23
---

# Modal Variation

Modal dialog component with two layout variants: 'Options actions' (left option + right secondary/primary CTA) and '2 Actions' (full-width secondary + primary CTA). Composed of a Header zone, a scrollable Content zone, and a footer Footer with frosted-glass backdrop blur. Button instances in the footer reuse the integrated Button DS component.

<!-- KLP:INTENT:BEGIN -->

## When to use

A blocking dialog that stops the flow until the user decides — header, content and a footer of DS Buttons, over a frosted backdrop. Pick options-actions for a left-hand secondary option beside the CTA pair, or 2-actions for a full-width cancel/confirm pair.

**Don't use it for:** Not for a list of contextual actions hung off a trigger — that is action-sheet-menu. Not for feedback the user need not acknowledge — that is floating-alert. Never to explain a control on hover — that is tooltip.

**Family — `floating-surfaces`:** modal-variation blocks on a decision. action-sheet-menu is a contextual action list anchored to a trigger. tooltip is a hover hint with zero actions. floating-alert is transient self-dismissing system feedback.

## Don't confuse with

| Component | How to choose |
|---|---|
| `action-sheet-menu` | modal-variation blocks on a decision; action-sheet-menu offers actions from a trigger. |
| `floating-alert` | modal-variation demands a choice; floating-alert self-dismisses. |
| `tooltip` | modal-variation carries actions; tooltip carries none. |

<!-- KLP:INTENT:END -->
## Anatomy

```
root            (div)    — Modal card container. Vertical stack layout with 24px gap. Rounded-2xl border, fill bg/default, border bd/default.
├── header      (div)    — Top zone with inset fill and 24px padding on all sides. Contains the title text.
│   └── title   (h2)    — Header title text. Font: Inter/Semibold/20px, color fg/heading (cross-file var 693:171).
├── content     (div)    — Body area with bg/default fill, 24px padding, optional decorative icon (hidden by default) and label text.
│   └── label   (p)     — Body copy text. Font: Inter/Regular/16px, color fg/default.
└── footer      (div)    — Horizontal bar with space-between layout, 16px side padding, 24px top/bottom padding. Semi-transparent white fill (70% opacity) with 20px background-blur effect. Top border uses cross-file var 734:5.
    ├── left-buttons    (div)    — Left slot for optional action buttons (visible in options-actions variant only). HUG sizing.
    │   └── button-option   (button) — Tertiary button in left-buttons slot (options-actions variant only). Reuses Button DS component.
    └── right-buttons   (div)    — Right slot for primary + secondary actions. FILL in 2-actions variant, HUG in options-actions variant.
        ├── button-secondary (button) — Tertiary/secondary-styled button in right-buttons slot. Reuses Button DS component.
        └── button-primary   (button) — Primary CTA button in right-buttons slot. Reuses Button DS component.
```

## Variants

| type | Documented |
|---|---|
| `options-actions` | [✓](../../.klp/figma-refs/modal-variation/options-actions-default.png) |
| `2-actions` | [✓](../../.klp/figma-refs/modal-variation/2-actions-default.png) |

## Props usage

Extends `VariantProps<typeof rootVariants>`.

| Prop | Type | Default | Class | Description |
|---|---|---|---|---|
| `type` | `ModalVariationType` | `"options-actions"` | optional | Layout variant: options-actions shows a left option button; 2-actions shows full-width secondary+primary. |
| `open` | `boolean` | — | optional | Controlled open state. |
| `defaultOpen` | `boolean` | — | optional | Initial open state (uncontrolled). |
| `onOpenChange` | `(open: boolean) => void` | — | optional | Callback when open state changes. |
| `title` | `React.ReactNode` | — | required | Dialog heading rendered in the header zone. |
| `children` | `React.ReactNode` | — | required | Body copy text rendered in the content zone. |
| `primaryActionLabel` | `string` | `"Confirm"` | optional | Label for the primary CTA button. |
| `onPrimaryAction` | `() => void` | — | optional | Callback for primary button click. |
| `secondaryActionLabel` | `string` | `"Cancel"` | optional | Label for the secondary (tertiary-styled) button. |
| `onSecondaryAction` | `() => void` | — | optional | Callback for secondary button click. |
| `optionActionLabel` | `string` | `"Option"` | optional | Label for the left option button (options-actions variant only). |
| `onOptionAction` | `() => void` | — | optional | Callback for option button click (options-actions variant only). |
| `className` | `string` | — | optional | Additional class names applied to the dialog content root. |

## Tokens

### `root` layer

| Property | Token | Resolved (wireframe) |
|---|---|---|
| fill | `--klp-bg-default` | `var(--klp-color-light-100)` |
| stroke | `--klp-border-default` | `var(--klp-color-gray-300)` |
| cornerRadius | literal: 16px | — |
| itemSpacing | literal: 24px | — |

### `header` layer

| Property | Token | Resolved (wireframe) |
|---|---|---|
| fill | `--klp-bg-inset` | `var(--klp-color-gray-200)` |
| paddingX | literal: 24px | — |
| paddingY | literal: 24px | — |
| itemSpacing | literal: 8px | — |

### `title` layer

| Property | Token | Resolved (wireframe) |
|---|---|---|
| color | `--klp-fg-default` | `var(--klp-color-gray-800)` |
| fontSize | literal: 20px | — |
| fontWeight | literal: 600 | — |
| lineHeight | literal: 28px | — |
| fontFamily | literal: Inter | — |

### `content` layer

| Property | Token | Resolved (wireframe) |
|---|---|---|
| fill | `--klp-bg-default` | `var(--klp-color-light-100)` |
| paddingX | literal: 24px | — |
| paddingY | literal: 24px | — |
| itemSpacing | literal: 24px | — |

### `label` layer

| Property | Token | Resolved (wireframe) |
|---|---|---|
| color | `--klp-fg-default` | `var(--klp-color-gray-800)` |
| fontSize | `--klp-font-size-text-medium` | `16px` |
| fontFamily | `--klp-font-family-label` | `'Test Calibre', system-ui, sans-serif` |
| fontWeight | `--klp-font-weight-label` | `400` |
| lineHeight | literal: 24px | — |

### `footer` layer

| Property | Token | Resolved (wireframe) |
|---|---|---|
| stroke (top border) | `--klp-bg-inset` | `var(--klp-color-gray-200)` |
| fill | literal: rgba(255,255,255,0.70) | — |
| backdropBlur | literal: 20px | — |
| paddingX | literal: 16px | — |
| paddingY | literal: 24px | — |

### `button-option` layer

| Property | Token | Resolved (wireframe) |
|---|---|---|
| fill | `--klp-bg-inset` | `var(--klp-color-gray-200)` |
| stroke | `--klp-border-invisible` | `var(--klp-color-light-0)` |
| paddingX | `--klp-size-m` | `var(--klp-spacing-4)` |
| paddingY | `--klp-size-xs` | `var(--klp-spacing-2)` |
| itemSpacing | `--klp-size-2xs` | `var(--klp-spacing-1-5)` |
| cornerRadius | `--klp-radius-l` | `var(--klp-radius-lg)` |

### `button-secondary` layer

| Property | Token | Resolved (wireframe) |
|---|---|---|
| fill | `--klp-bg-inset` | `var(--klp-color-gray-200)` |
| stroke | `--klp-border-invisible` | `var(--klp-color-light-0)` |
| paddingX | `--klp-size-m` | `var(--klp-spacing-4)` |
| paddingY | `--klp-size-xs` | `var(--klp-spacing-2)` |
| itemSpacing | `--klp-size-2xs` | `var(--klp-spacing-1-5)` |
| cornerRadius | `--klp-radius-l` | `var(--klp-radius-lg)` |

### `button-primary` layer

| Property | Token | Resolved (wireframe) |
|---|---|---|
| fill | `--klp-bg-brand` | `var(--klp-color-gray-500)` |
| stroke | `--klp-border-brand` | `var(--klp-color-gray-500)` |
| paddingX | `--klp-size-m` | `var(--klp-spacing-4)` |
| paddingY | `--klp-size-xs` | `var(--klp-spacing-2)` |
| itemSpacing | `--klp-size-2xs` | `var(--klp-spacing-1-5)` |
| cornerRadius | `--klp-radius-l` | `var(--klp-radius-lg)` |

## Examples

```tsx
import { ModalVariation, ModalVariationTrigger, ModalVariationRoot } from '@/components/modal-variation'
import { Button } from '@/components/button'

export function ModalVariationExample() {
  return (
    <div className="flex flex-col gap-8 p-6">
      {/* Options Actions variant — left option + right secondary/primary CTA */}
      <ModalVariationRoot>
        <ModalVariationTrigger asChild>
          <Button variant="secondary" size="md">Open Options Actions Modal</Button>
        </ModalVariationTrigger>
        <ModalVariation
          type="options-actions"
          title="Confirm your choice"
          optionActionLabel="More options"
          secondaryActionLabel="Cancel"
          primaryActionLabel="Confirm"
        >
          Are you sure you want to proceed with this action? This cannot be undone.
        </ModalVariation>
      </ModalVariationRoot>

      {/* 2-Actions variant — full-width secondary + primary CTA */}
      <ModalVariationRoot>
        <ModalVariationTrigger asChild>
          <Button variant="secondary" size="md">Open 2-Actions Modal</Button>
        </ModalVariationTrigger>
        <ModalVariation
          type="2-actions"
          title="Delete item"
          secondaryActionLabel="Cancel"
          primaryActionLabel="Delete"
        >
          This will permanently delete the item. Are you sure you want to continue?
        </ModalVariation>
      </ModalVariationRoot>
    </div>
  )
}
```

## Accessibility

- **Role**: `dialog`
- **Keyboard support**: `Tab`, `Shift+Tab`, `Escape`
- **ARIA notes**: Radix Dialog handles focus trap, aria-modal, aria-labelledby on the header title, and Escape to close. Button children receive native button semantics.

## Dependencies

### klp components

- [Button](./_index_button.md) — imported as `Button` from `@/components/button`; used for button-option (tertiary), button-secondary (tertiary), and button-primary (primary) in the footer.

### External libraries

- [@radix-ui/react-dialog](https://www.npmjs.com/package/@radix-ui/react-dialog) — Dialog primitive providing focus trap, portal, overlay, aria-modal, and Escape handling. (source: spec.json:radixPrimitive)
- [class-variance-authority](https://www.npmjs.com/package/class-variance-authority) — cva utility for variant class composition.

### Token groups

- [Colors](../tokens/colors.md) — `--klp-bg-default`, `--klp-bg-inset`, `--klp-fg-default`, `--klp-border-default`, `--klp-border-invisible`, `--klp-border-brand`, `--klp-bg-brand`
- [Spacing](../tokens/spacing.md) — `--klp-size-m`, `--klp-size-xs`, `--klp-size-2xs`
- [Radius](../tokens/radius.md) — `--klp-radius-l`
- [Typography](../tokens/typography.md) — `--klp-font-size-text-medium`, `--klp-font-family-label`, `--klp-font-weight-label`

## Used by

*Not yet used by any other klp component.*

## Files

- Source: [`src/components/modal-variation/ModalVariation.tsx`](../../src/components/modal-variation/ModalVariation.tsx)
- Example: [`src/components/modal-variation/ModalVariation.example.tsx`](../../src/components/modal-variation/ModalVariation.example.tsx)
- Playground: [`playground/routes/modal-variation.tsx`](../../playground/routes/modal-variation.tsx)
- Registry: [`registry/modal-variation.json`](../../registry/modal-variation.json)
- Figma spec: [`.klp/figma-refs/modal-variation/spec.json`](../../.klp/figma-refs/modal-variation/spec.json)
- Reference screenshots: [`.klp/figma-refs/modal-variation/`](../../.klp/figma-refs/modal-variation/)

<!-- KLP:GAPS:BEGIN -->
## DS gaps

| Part | Kind | Reason | Action |
|---|---|---|---|
| `footer` fill | `literal-gap` | No `--klp-*` alias exists for the semi-transparent frosted glass footer fill (`rgba(255,255,255,0.70)` + backdrop-blur 20px). | `accepted-literal` — uses `bg-white/70 backdrop-blur-xl` in Tailwind v4. Request a `--klp-bg-frosted` alias from the token layer. (source: spec.json:tokenGaps[4]) |
| `root` cornerRadius | `token-gap` | 16px cornerRadius on the modal card root has no variable bound in Figma. `--klp-radius-xl` = 16px matches but was not bound as a variable. | `accepted-literal` — uses `rounded-[16px]` in source. Should use `rounded-klp-xl`. (source: spec.json:tokenGaps[5]) |
<!-- KLP:GAPS:END -->

<!-- KLP:NOTES:BEGIN -->
## Notes

> ⚠️ Token smell: the `footer` layer's top border resolves to `--klp-bg-inset` — a `bg-*`-named token used as a border color. Verified faithful to the source: `.klp/figma-refs/modal-variation/spec.json` shows Figma binding `--klp-bg-inset` on that stroke via a cross-file `footer-border` variable, and `ModalVariation.tsx` reproduces it exactly. This is a design-side naming smell (a border stroke bound to a `bg-*` alias) worth raising with the design team, not a code bug — do not change the source to "fix" it unilaterally.
<!-- KLP:NOTES:END -->
