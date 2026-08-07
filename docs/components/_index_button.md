---
title: Button
type: component
status: stable
category: inputs
captureBrand: atlas
radixPrimitive: "@radix-ui/react-slot"
sources:
  - .klp/figma-refs/button/spec.json
  - src/components/button/Button.tsx
dependencies:
  components: []
  externals: ["@radix-ui/react-slot", "class-variance-authority", "lucide-react"]
  tokenGroups: ["colors", "spacing", "radius", "typography"]
  brands: ["atlas"]
usedBy:
  - calendar
  - collapsible
  - file-dropped
  - floating-alert
  - header-desktop
  - header-phone
  - header-showup
  - input-file
  - list
  - list-content
  - modal-variation
  - pagination
  - sidebar
  - text-area
created: 2026-04-16
updated: 2026-08-07
---

# Button

Interactive button component with 5 type variants (primary, secondary, tertiary, destructive, validation), 4 sizes (sm, md, lg, icon), and 4 interaction states (rest, hover, clicked, disable). Supports optional left/right icon slots.

## Anatomy

```
button (root)
├── icon-left  (span) — Optional, rendered before the label
├── label      (span) — Hidden when size=icon; content passed as children
└── icon-right (span) — Optional, rendered after the label
```

## Variants

| type \ size | sm | md | lg | icon |
|---|---|---|---|---|
| primary | ✓ | ✓ | ✓ | ✓ |
| secondary | ✓ | ✓ | ✓ | ✓ |
| tertiary | ✓ | ✓ | ✓ | ✓ |
| destructive | ✓ | ✓ | ✓ | ✓ |
| validation | ✓ | ✓ | ✓ | ✓ |

> Note: The `state` axis (rest/hover/clicked/disable) from the Figma spec is expressed entirely via CSS pseudo-classes (`:hover`, `:active`, `[disabled]`) and the native `disabled` attribute — no `state` prop exists on `ButtonProps`. This is correct by design: Class B situation — a cva state axis without a corresponding prop.

## Props usage

Extends `Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'type'>`. All native button attributes except `type` are forwarded via `...props`.

| Prop | Class | Type | Default | Description |
|---|---|---|---|---|
| `children` | **required** | `React.ReactNode` | — | Button label or content. |
| `variant` | optional | `'primary' \| 'secondary' \| 'tertiary' \| 'destructive' \| 'validation'` | `"primary"` | Visual style variant (maps to spec variantAxes.type) |
| `size` | optional | `'sm' \| 'md' \| 'lg' \| 'icon'` | `"md"` | Size axis |
| `htmlType` | optional | `'button' \| 'submit' \| 'reset'` | `"button"` | Native button type attribute |
| `asChild` | optional | `boolean` | `false` | Render child element in place of `<button>` (e.g. `<a>`) |
| `leftIcon` | optional | `React.ReactNode` | — | Optional icon rendered before the label |
| `rightIcon` | optional | `React.ReactNode` | — | Optional icon rendered after the label |

## Examples

```tsx
import { Button } from './Button'

function StarIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path
        d="M8 1l1.75 3.55 3.92.57-2.84 2.76.67 3.9L8 9.98l-3.5 1.84.67-3.9L2.33 5.12l3.92-.57L8 1z"
        stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
      />
    </svg>
  )
}

export function ButtonExample() {
  return (
    <div className="flex flex-wrap items-center gap-klp-size-s">
      <Button variant="primary" size="md" leftIcon={<StarIcon />}>Primary</Button>
      <Button variant="secondary" size="md">Secondary</Button>
      <Button variant="tertiary" size="md">Tertiary</Button>
      <Button variant="destructive" size="md">Destructive</Button>
      <Button variant="validation" size="md">Validation</Button>
      <Button variant="primary" size="icon" aria-label="Star"><StarIcon /></Button>
    </div>
  )
}
```

## Accessibility

- **Role**: `button` (native HTML)
- **Keyboard support**: `Enter` and `Space` activate; `Tab` focuses.
- **ARIA notes**: `aria-disabled` mirrors the `disabled` prop for screen reader parity. When `asChild` renders an `<a>`, the semantic role shifts to `link` — ensure `href` is present.

## Dependencies

### klp components

*Leaf component — no klp dependencies.*

### External libraries

- [@radix-ui/react-slot](https://www.npmjs.com/package/@radix-ui/react-slot) — Slot/asChild pattern
- [class-variance-authority](https://www.npmjs.com/package/class-variance-authority) — cva variant composition
- [lucide-react](https://www.npmjs.com/package/lucide-react) — icon library (used by consumer examples)

### Token groups

- [Colors](../tokens/colors.md)
- [Spacing](../tokens/spacing.md)
- [Radius](../tokens/radius.md)
- [Typography](../tokens/typography.md)

## Used by

- [Calendar](./_index_calendar.md)
- [Collapsible](./_index_collapsible.md)
- [File Dropped](./_index_file-dropped.md)
- [Floating Alert](./_index_floating-alert.md)
- [Header Desktop](./_index_header-desktop.md)
- [Header Phone](./_index_header-phone.md)
- [Header Showup](./_index_header-showup.md)
- [InputFile](./_index_input-file.md)
- [List](./_index_list.md)
- [List Content](./_index_list-content.md)
- [Modal Variation](./_index_modal-variation.md)
- [Pagination](./_index_pagination.md)
- [SideBar](./_index_sidebar.md)
- [Text Area](./_index_text-area.md)

## Files

- Source: [`src/components/button/Button.tsx`](../../src/components/button/Button.tsx)
- Example: [`src/components/button/Button.example.tsx`](../../src/components/button/Button.example.tsx)
- Playground: [`playground/routes/button.tsx`](../../playground/routes/button.tsx)
- Registry: [`registry/button.json`](../../registry/button.json)
- Figma spec: [`.klp/figma-refs/button/spec.json`](../../.klp/figma-refs/button/spec.json)
- Reference screenshots: [`.klp/figma-refs/button/`](../../.klp/figma-refs/button/)

<!-- KLP:GAPS:BEGIN -->
## DS gaps

No gaps recorded.
<!-- KLP:GAPS:END -->

<!-- KLP:NOTES:BEGIN -->

## When to use

- **Trigger an action:** submit a form, save changes, delete a record, confirm a dialog — anything that *does* something rather than navigates.
- **Signal the primary path:** give a view exactly one `primary` button so users know the main action at a glance.
- **Group related actions:** pair a `primary` with one or more `secondary`/`tertiary` buttons (e.g. **Save** + **Cancel**).
- **Navigate as a button:** set `asChild` and render an `<a>` when the action is a link but needs button styling.

Reach for a plain link instead when the action only navigates within body text — a button there over-weights the interaction. Use `checkbox`, `radio`, or `switch` for state toggles, not a button.

## States

The interaction states (rest, hover, clicked, disabled) are driven entirely by CSS pseudo-classes (`:hover`, `:active`) and the native `disabled` attribute — there is **no `state` prop**. You set the state by setting `disabled`; the rest is automatic.

- **Rest → hover → clicked:** each variant shifts background and/or border on `:hover` and `:active`. Nothing to wire.
- **Disabled:** pass the native `disabled`. The button drops to the disabled token set, loses pointer events, and leaves the tab order. It also sets `aria-disabled`.
- **No loading state.** The component has no `loading` prop. For async actions, disable the button while the request is in flight and surface progress elsewhere (spinner, toast). Don't fake a loading look by swapping the label alone.

## Best practices

- ✅ **Do** keep one `primary` per view — it names the main action and holds the hierarchy.
- ❌ **Don't** stack several `primary` buttons — the hierarchy collapses and nothing stands out. Demote the rest to `secondary`/`tertiary`.
- ✅ **Do** use `destructive` only for irreversible or hard-to-undo actions (delete, remove, revoke).
- ❌ **Don't** reach for `destructive` just to draw attention — its red reads as danger, not emphasis.
- ✅ **Do** pass `aria-label` on every `size="icon"` button — the visible glyph carries no accessible name (see Limitations).
- ✅ **Do** place `leftIcon` for actions the icon *leads* (＋ Add) and `rightIcon` for directional follow-through (Continue →).
- ❌ **Don't** wrap raw `<svg>` markup in the icon slots — pass a `lucide-react` icon, matching the rest of the DS.

## Content guidelines

- **Lead with a verb.** *Save changes*, *Create product*, *Delete variant* — not *OK* or *Submit form here*.
- **Sentence case.** *Add tags*, not *Add Tags* or *ADD TAGS*.
- **Keep it short.** One to three words. Drop articles (*a*, *the*) and trailing punctuation.
- **Match the label to the outcome.** The label should say what happens on click, so a user never has to guess.

## Limitations

- **Icon-only buttons have no accessible name.** When `size="icon"`, the children are rendered inside an `aria-hidden` span. A screen reader announces nothing unless you pass `aria-label` (or `aria-labelledby`). Always label icon-only buttons.
- **`asChild` + `disabled` is a trap.** With `asChild`, the component renders your child (e.g. `<a>`) via Slot and drops the native `type`. Anchors don't support `disabled` — the attribute is forwarded but the element stays focusable and clickable. For a disabled link, render a real `<button>` or remove `href` yourself.
- **`disabled` removes the button from the tab order.** Keyboard and screen-reader users can't focus it, so they get no explanation for why it's unavailable. If the disable is temporary (pending validation), add visible text saying why — or keep it enabled and validate on click.
- **No `type`/`tone` split.** Intent lives in the `variant` (`destructive` = danger, `validation` = success). There's no separate tone axis; you can't make a `secondary` button "critical" without switching to `destructive`.

<!-- KLP:NOTES:END -->
