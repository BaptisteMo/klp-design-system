---
title: Calendar Button
type: component
status: stable
category: inputs
captureBrand: klub
radixPrimitive: null
sources:
  - .klp/figma-refs/calendar-button/spec.json
  - src/components/calendar-button/CalendarButton.tsx
dependencies:
  components: []
  externals: ["class-variance-authority"]
  tokenGroups: ["colors", "radius", "spacing", "typography"]
  brands: ["klub"]
usedBy:
  - calendar
created: 2026-08-04
updated: 2026-08-04
---

# Calendar Button

Single day cell of a calendar grid (36×36), rendering a day number over a colored/bordered background that communicates the day's state (default, other-month, disable, today, selected).

<!-- KLP:INTENT:BEGIN -->

## When to use

One 36x36 day cell of a calendar grid, rendering the day number with a state of default, other-month, disable, today or selected.

**Don't use it for:** Never standalone and never as a general-purpose button — use button. Building a month grid by hand from these is wrong; use calendar.

## Don't confuse with

| Component | How to choose |
|---|---|
| `calendar` | calendar-button is one day cell; calendar is the panel that lays them out. |
| `button` | calendar-button only means a date; button is the general action control. |

<!-- KLP:INTENT:END -->

## Anatomy

```
button (root)
└── label (span) — Day number, centered, semibold, single line
```

> Note: the Figma component set includes a `Left Icon` and `Right Icon` INSTANCE slot (icon-holder pattern) as the first/last child of every one of the 5 state variants, but both are set to `visible:false` in all 5 states with no exception. They render nothing in any variant, so they are intentionally excluded from anatomy and from the emitted source markup (source: spec.json:anatomy[0].notes). If a future Figma revision makes them visible in some state, re-run the extractor to pick them up.

## Variants

| state | ✓ |
|---|---|
| default | ✓ |
| other-month | ✓ |
| disable | ✓ |
| today | ✓ |
| selected | ✓ |

> ❓ UNVERIFIED: reference screenshots could not be persisted to disk this session (expired Figma REST token — `figma_capture_screenshot` returned inline image data only, no filesystem write path available). Every variant's `screenshotNote` in `spec.json` flags this; re-run capture in a session with disk access to populate `.klp/figma-refs/calendar-button/<id>.png`.

> **Class B note:** the `state` column above documents visual appearances driven by
> the cva `state` axis (`default` / `other-month` / `disable` / `today` / `selected`).
> `state` is an exported prop (`CalendarButtonState`), but it is **computed** — there is
> no 1:1 author-facing enum on the four boolean/native inputs that actually drive it in
> normal usage (`disabled`, `selected`, `today`, `otherMonth`, in that priority order).
> Pass `state` directly only in the playground/demo; passing it in application code
> freezes the visual appearance and desyncs it from those four inputs.

## Props usage

Extends `React.ButtonHTMLAttributes<HTMLButtonElement>`.

| Prop | Type | Default | Class | Description |
|---|---|---|---|---|
| `day` | `number` | — | required | The day number rendered inside the cell. |
| `otherMonth` | `boolean` | `false` | optional | Marks this cell as belonging to the previous/next month (rendered in muted text). |
| `today` | `boolean` | `false` | optional | Marks this cell as today's date. Sets `aria-current="date"`. |
| `selected` | `boolean` | `false` | optional | Marks this cell as the currently selected date. Sets `aria-pressed="true"`. |
| `state` | `CalendarButtonState` | derived | **computed** | Explicit visual state override. When omitted the component derives state from the native `disabled` attribute (highest priority) and the `selected` / `today` / `otherMonth` props, in that order. |
| `className` | `string` | — | optional | Additional className applied to the root button. |

## Tokens

### `root` layer

| Property | Token | Resolved (klub) |
|---|---|---|
| fill (default, other-month) | `--klp-bg-default` | `var(--klp-color-light-100)` |
| fill (disable) | `--klp-bg-disable` | `var(--klp-color-gray-200)` |
| fill (today) | `--klp-bg-subtle` | `var(--klp-color-gray-100)` |
| fill (selected) | `--klp-bg-brand` | `var(--klp-color-emerald-500)` |
| stroke (default, other-month, disable, selected) | `--klp-border-invisible` | `var(--klp-color-light-0)` |
| stroke (today) | `--klp-border-default` | `var(--klp-color-gray-400)` |
| cornerRadius | `--klp-radius-l` | `var(--klp-radius-lg)` (8px) |
| paddingX | `--klp-size-s` | `var(--klp-spacing-3)` (12px) |
| paddingY | `--klp-size-2xs` | `var(--klp-spacing-1-5)` (6px) |
| itemSpacing | `--klp-size-2xs` | `var(--klp-spacing-1-5)` (6px) |
| borderWidth | literal | `literal: 1px` |
| width | literal | `literal: 36px` |
| height | literal | `literal: 36px` |

### `label` layer

| Property | Token | Resolved (klub) |
|---|---|---|
| color (default, today) | `--klp-fg-default` | `var(--klp-color-gray-800)` |
| color (other-month) | `--klp-fg-subtle` | `var(--klp-color-gray-600)` |
| color (disable) | `--klp-fg-disable` | `var(--klp-color-gray-600)` |
| color (selected) | `--klp-fg-on-emphasis` | `var(--klp-color-gray-100)` |
| fontSize | `--klp-font-size-text-medium` | `16px` |
| fontFamily | `--klp-font-family-label` | `'Test Calibre', system-ui, sans-serif` |
| fontWeight | `--klp-font-weight-label-bold` | `600` |
| lineHeight | literal | `literal: 24px` |
| letterSpacing | literal | `literal: 0%` |

## Examples

```tsx
import { CalendarButton } from './CalendarButton'

export function CalendarButtonExample() {
  return (
    <div className="flex gap-2">
      <CalendarButton day={1} />
      <CalendarButton day={30} otherMonth />
      <CalendarButton day={12} disabled />
      <CalendarButton day={4} today />
      <CalendarButton day={9} selected />
    </div>
  )
}
```

## Accessibility

- **Role**: `button` (native HTML)
- **Keyboard support**: `Enter`, `Space` (activation); `Arrow keys` when composed inside a full Calendar grid with roving tabindex — this component in isolation only needs to support Enter/Space activation.
- **ARIA notes**: `disable` state should render with the native `disabled` attribute (or `aria-disabled` + `tabIndex=-1` if composed as a non-native element) and must not be focusable/actionable. `selected` state sets `aria-pressed="true"` (or `aria-selected="true"` if the parent grid uses `role="grid"`/`"gridcell"`). `today` state sets `aria-current="date"`. When composed inside a full Calendar, the parent grid is responsible for roving-tabindex keyboard navigation.

## Dependencies

### klp components

*Leaf component — no klp dependencies.*

### External libraries

- [class-variance-authority](https://www.npmjs.com/package/class-variance-authority) — cva variant composition

### Token groups

- [Colors](../tokens/colors.md)
- [Radius](../tokens/radius.md)
- [Spacing](../tokens/spacing.md)
- [Typography](../tokens/typography.md)

## Used by

- [Calendar](./_index_calendar.md)

## Files

- Source: [`src/components/calendar-button/CalendarButton.tsx`](../../src/components/calendar-button/CalendarButton.tsx)
- Example: [`src/components/calendar-button/CalendarButton.example.tsx`](../../src/components/calendar-button/CalendarButton.example.tsx)
- Playground: [`playground/routes/calendar-button.tsx`](../../playground/routes/calendar-button.tsx)
- Registry: [`registry/calendar-button.json`](../../registry/calendar-button.json)
- Figma spec: [`.klp/figma-refs/calendar-button/spec.json`](../../.klp/figma-refs/calendar-button/spec.json)
- Reference screenshots: [`.klp/figma-refs/calendar-button/`](../../.klp/figma-refs/calendar-button/)

<!-- KLP:GAPS:BEGIN -->
## DS gaps

No gaps recorded.
<!-- KLP:GAPS:END -->

<!-- KLP:NOTES:BEGIN -->
## Notes

*Manual prose preserved across regenerations. Anything between the BEGIN/END markers is never overwritten by the documentalist.*
<!-- KLP:NOTES:END -->
