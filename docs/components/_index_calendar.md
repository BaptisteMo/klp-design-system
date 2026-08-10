---
title: Calendar
type: component
status: stable
category: inputs
captureBrand: klub
radixPrimitive: null
sources:
  - .klp/figma-refs/calendar/spec.json
  - src/components/calendar/Calendar.tsx
dependencies:
  components: [button, calendar-button, input, separator]
  externals: [class-variance-authority, lucide-react]
  tokenGroups: [colors, radius, spacing, typography]
  brands: [klub]
usedBy: []
created: 2026-08-04
updated: 2026-08-04
---

# Calendar

A date-picker panel with a month header (prev/next year and month navigation), a Monday-first 7-column day grid, a horizontal separator, and a footer hour-selection field (source: spec.json:description).

The panel supports two usages as a first-class part of its contract: **standalone**, rendered inline as a normal block, and **as an input's dropdown**, passed to `Popover.Content asChild` so the panel itself becomes the positioned element (source: Calendar.tsx:139-143, 274-282). This works because the root `<div>` forwards its ref and spreads unremapped props (`{...props}`) after a `role="application"` default that a host — e.g. Radix `Popover.Content`, which injects `role="dialog"` — can override. The DS has no dedicated `date-picker` component yet; the Popover composition shown below is assembled by the consumer, and the Figma file only defines the panel.

<!-- KLP:INTENT:BEGIN -->

## When to use

The date-picking panel — month and year navigation over a Monday-first day grid, with an hour field in the footer. Use it when the user picks a date or a date and time.

**Don't use it for:** Not as an events or schedule display; it is a picker, not an agenda. Do not build the grid from calendar-button yourself — calendar already composes them. For a free-text date use input.

## Don't confuse with

| Component | How to choose |
|---|---|
| `calendar-button` | calendar is the whole panel; calendar-button is one day cell inside it. |
| `input` | calendar picks a date from a grid; input takes typed text. |

<!-- KLP:INTENT:END -->
## Anatomy

```
root (div)
├── header (div)                  — Month navigation row, 4 icon buttons + centered month label
│   ├── prev-year-button (button)  — REUSED: button (variant=tertiary, size=icon) — jumps to previous year
│   ├── prev-month-button (button) — REUSED: button (variant=tertiary, size=icon) — jumps to previous month
│   ├── month-label (span)         — Centered "Month YYYY" text, fills remaining row width
│   ├── next-month-button (button) — REUSED: button (variant=tertiary, size=icon) — jumps to next month
│   └── next-year-button (button)  — REUSED: button (variant=tertiary, size=icon) — jumps to next year
├── day-grid (div, role="grid")   — Vertical container wrapping the weekday header row and week rows
│   ├── weekday-header (div, role="row")
│   │   └── weekday-label (span, role="columnheader") — one of Mo/Tu/We/Th/Fr/Sa/Su, ×7
│   └── week-row (div, role="row") — one per displayed week, ×5 or ×6 depending on the month
│       └── day-cell (button)      — REUSED: calendar-button — one per day, ×7 per row
├── separator (div)                — REUSED: separator (direction=horizontal, margin=none) — Rendered only when showTimePicker=true
└── footer (div)                  — Rendered only when showTimePicker=true
    ├── footer-label (span)        — "Select an hour" text
    └── footer-input (input)       — REUSED: input (size=small) — hour entry field with trailing clock icon
```

## Variants

The Figma master is a plain `COMPONENT`, not a `COMPONENT_SET` — there is **no variant axis** (source: spec.json `variantAxes: {}`, a single captured `variants[0]` with `id: "default"`). The component has one canonical appearance; all runtime differences (selected day, disabled dates, displayed month, week-row count) come from props and data, not from a variant matrix.

> ❓ UNVERIFIED: reference screenshots could not be persisted to disk this session (expired Figma REST token). `spec.json:variants[0].screenshotNote` records that the in-session capture succeeded but the file write to `.klp/figma-refs/calendar/default.png` did not complete. Re-run `figma_capture_screenshot` on node `111590:16200` to populate the reference set.

The rendered grid always has 7 columns but its row count is computed dynamically from the displayed month (5 or 6 week rows) — the Figma capture happens to show a 5-row month, so a 6-row month has no reference screenshot yet.

## Props usage

Extends `Omit<React.HTMLAttributes<HTMLDivElement>, 'defaultValue'>` (`defaultValue` is redeclared below as a `Date`). The root `<div>` spreads `{...props}` after setting a default `role="application"`, so a host component can override `role` (and inject `style`, `data-state`, `id`, keyboard handlers, etc.) — this is what makes the panel usable as a Radix `Popover.Content asChild` child (see the "As an input dropdown" example below).

| Prop | Type | Default | Class | Description |
|---|---|---|---|---|
| `value` | `Date` | — | optional | Controlled selected date. |
| `defaultValue` | `Date` | — | optional | Default selected date (uncontrolled). |
| `onValueChange` | `(date: Date) => void` | — | optional | Callback fired when the selected date changes. |
| `month` | `Date` | — | optional | Controlled displayed month (any Date within the month works). |
| `defaultMonth` | `Date` | — | optional | Default displayed month (uncontrolled). |
| `onMonthChange` | `(date: Date) => void` | — | optional | Callback fired when the displayed month changes (via header nav). |
| `isDateDisabled` | `(date: Date) => boolean` | — | optional | Predicate marking individual dates as disabled/non-selectable. |
| `today` | `Date` | `new Date()` | optional | Reference "today" date, used to highlight the current day. |
| `locale` | `string` | `"en-US"` | optional | Locale used to format the month label and weekday abbreviations. |
| `showTimePicker` | `boolean` | `true` | optional | Shows the footer "Select an hour" row with a time Input, matching the Figma capture. |
| `hourValue` | `string` | — | optional | Controlled hour field value (footer time Input). |
| `defaultHourValue` | `string` | — | optional | Default hour field value (uncontrolled). |
| `onHourValueChange` | `(value: string) => void` | — | optional | Callback fired when the hour field value changes. |
| `className` | `string` | — | optional | Additional className applied to the root panel. |

Every prop carries `@propClass optional` in source — no `required`, `computed`, or `persistent` props, so no Do/Don't block is emitted here.

Three independent controlled/uncontrolled pairs coexist on this component and can be mixed freely:

- **Selection**: `value` / `defaultValue` / `onValueChange`.
- **Displayed month**: `month` / `defaultMonth` / `onMonthChange` — the header nav buttons always call `onMonthChange`; when uncontrolled, the component also updates its own internal month state.
- **Hour field**: `hourValue` / `defaultHourValue` / `onHourValueChange`, wired straight into the reused `Input`.

## Tokens

### `root` layer

| Property | Token | Resolved (klub) |
|---|---|---|
| fill | `--klp-bg-default` | `var(--klp-color-light-100)` |
| cornerRadius | `--klp-radius-l` | `var(--klp-radius-lg)` (8px) |
| paddingX | `--klp-size-m` | `var(--klp-spacing-4)` (16px) |
| paddingY | `--klp-size-m` | `var(--klp-spacing-4)` (16px) |
| itemSpacing | literal | `literal: 16px` |
| width | literal | `literal: 360px` |
| boxShadow | literal | `literal: 0 7px 22px rgba(0,0,0,0.25), 0 0 1.5px rgba(0,0,0,0.30), 0 0 1px rgba(0,0,0,0.40)` |

> The Figma capture is the source of truth for the `width` row above (360px), but the source deliberately implements it as a fluid contract rather than a frozen literal: `rootVariants` sets a plain `w-[360px]` (overridable via `cn`/tailwind-merge) plus a `min-w-[320px]` floor. Contract: **360px standalone default** (matches Figma) → **tracks the host's width when `className` overrides it** (e.g. `w-[var(--radix-popover-trigger-width)]` in the input-dropdown usage) → **never below 320px**, the geometric minimum for 7×36px day cells plus horizontal padding (source: Calendar.tsx:20-29).

### `header` layer

All properties on this layer are literal — no token bindings captured.

| Property | Token | Resolved (klub) |
|---|---|---|
| paddingX | literal | `literal: 8px` |
| paddingY | literal | `literal: 8px` |
| itemSpacing | literal | `literal: 8px` |
| height | literal | `literal: 52px` |

### `prev-year-button` / `prev-month-button` / `next-month-button` / `next-year-button` layers

All four header nav buttons share the same token bindings (only the `icon` literal differs — `chevrons-left`, `chevron-left`, `chevron-right`, `chevrons-right` respectively). They are fully owned by the reused `button` component (`variant="tertiary" size="icon"`); the bindings below are what the Figma spec captured on the instance frame.

| Property | Token | Resolved (klub) |
|---|---|---|
| fill | `--klp-bg-invisible` | `var(--klp-color-light-0)` |
| stroke | `--klp-border-invisible` | `var(--klp-color-light-0)` |
| cornerRadius | `--klp-radius-l` | `var(--klp-radius-lg)` (8px) |
| paddingX | `--klp-size-xs` | `var(--klp-spacing-2)` (8px) |
| paddingY | `--klp-size-xs` | `var(--klp-spacing-2)` (8px) |
| icon | literal | `literal: chevrons-left / chevron-left / chevron-right / chevrons-right` |
| iconSize | literal | `literal: 20px` |

### `month-label` layer

| Property | Token | Resolved (klub) |
|---|---|---|
| color | `--klp-fg-muted` | `var(--klp-color-gray-700)` |
| fontSize | `--klp-font-size-text-medium` | `16px` |
| fontFamily | `--klp-font-family-label` | `'Test Calibre', system-ui, sans-serif` |
| fontWeight | `--klp-font-weight-label-bold` | `600` |
| lineHeight | literal | `literal: 24px` |
| textAlign | literal | `literal: center` |

### `day-grid` layer

All properties on this layer are literal — no token bindings captured.

| Property | Token | Resolved (klub) |
|---|---|---|
| itemSpacing | literal | `literal: 8px` |
| width | literal | `literal: 328px` |

> `width` is captured as a fixed 328px in Figma, but the source implements it as `w-full` — the grid always fills the panel's inner width (root width minus horizontal padding), so it inherits the same 360px-default / tracks-host / 320px-floor contract as the `root` layer above, rather than a frozen 328px.

### `weekday-header` layer

All properties on this layer are literal — no token bindings captured.

| Property | Token | Resolved (klub) |
|---|---|---|
| itemSpacing | literal | `literal: 13px` |
| justify | literal | `literal: space-between` |
| height | literal | `literal: 24px` |

> `itemSpacing` is captured as a fixed 13px in Figma, but the source drops the fixed gap and relies on `justify-between` alone: at the 360px default that reproduces Figma's 13px exactly (328px inner width − 7×36px cells = 76px ÷ 6 gaps), and it compresses gracefully as the panel narrows toward the 320px floor instead of overflowing (a fixed 13px gap would overflow at 320px: 252px of cells + 78px of gaps = 330px in only 288px of available space).

### `weekday-label` layer

| Property | Token | Resolved (klub) |
|---|---|---|
| color | `--klp-fg-muted` | `var(--klp-color-gray-700)` |
| fontSize | `--klp-font-size-text-small` | `14px` |
| fontFamily | `--klp-font-family-body` | `'Test Calibre', system-ui, sans-serif` |
| fontWeight | `--klp-font-weight-body` | `400` |
| lineHeight | literal | `literal: 18px` |
| width | literal | `literal: 36px` |
| height | literal | `literal: 24px` |
| textAlign | literal | `literal: center` |

### `week-row` layer

All properties on this layer are literal — no token bindings captured.

| Property | Token | Resolved (klub) |
|---|---|---|
| itemSpacing | literal | `literal: 13px` |
| justify | literal | `literal: space-between` |
| height | literal | `literal: 36px` |

> Same fluid-gap contract as `weekday-header` above: no fixed `gap-[13px]` in source, `justify-between` reproduces Figma's 13px at the 360px default and compresses instead of overflowing as the panel narrows to its 320px floor.

### `day-cell` layer

All properties are literal on the spec's captured instance frame — the full token set for each state (default / other-month / today / selected / disable) is owned by [Calendar Button](./_index_calendar-button.md).

| Property | Token | Resolved (klub) |
|---|---|---|
| width | literal | `literal: 36px` |
| height | literal | `literal: 36px` |

### `separator` layer

Fully owned by the reused [Separator](./_index_separator.md) component (`direction="horizontal" margin="none"`); the bindings below are what the Figma spec captured on the instance frame.

| Property | Token | Resolved (klub) |
|---|---|---|
| stroke | `--klp-border-default` | `var(--klp-color-gray-400)` |
| height | literal | `literal: 1px` |
| direction | literal | `literal: horizontal` |
| margin | literal | `literal: no-space` |

### `footer` layer

All properties on this layer are literal — no token bindings captured.

| Property | Token | Resolved (klub) |
|---|---|---|
| itemSpacing | literal | `literal: 19px` |
| height | literal | `literal: 40px` |

### `footer-label` layer

| Property | Token | Resolved (klub) |
|---|---|---|
| color | `--klp-fg-default` | `var(--klp-color-gray-800)` |
| fontSize | `--klp-font-size-text-medium` | `16px` |
| fontFamily | `--klp-font-family-label` | `'Test Calibre', system-ui, sans-serif` |
| fontWeight | `--klp-font-weight-label-bold` | `600` |
| lineHeight | literal | `literal: 24px` |

### `footer-input` layer

Fully owned by the reused `input` component (`size="small"`); the spec only captured the item spacing between the label and the field.

| Property | Token | Resolved (klub) |
|---|---|---|
| itemSpacing | `--klp-size-m` | `var(--klp-spacing-4)` (16px) |
| actionButton | literal | `literal: true` |
| infoIcon | literal | `literal: true` |
| placeholderText | literal | `literal: "00:00"` |
| actionIcon | literal | `literal: clock` |
| width | literal | `literal: 216px` |

## Examples

### Standalone

Rendered inline as a normal block (source: `Calendar.example.tsx`).

```tsx
import { useState } from 'react'
import { Calendar } from '@/components/calendar'

export function CalendarExample() {
  const [date, setDate] = useState<Date | undefined>(undefined)

  return (
    <Calendar
      value={date}
      onValueChange={setDate}
      isDateDisabled={(d) => d.getDay() === 0}
    />
  )
}
```

### As an input's dropdown

The panel is passed to Radix `Popover.Content` via `asChild`, with an `Input` as `Popover.Trigger`. This works precisely because `Calendar` forwards its ref to the root `<div>` and spreads unknown props — Radix clones the panel and injects positioning `style`, `data-state`, `id`, `role="dialog"`, and keyboard handlers directly onto it. The `className="w-[var(--radix-popover-trigger-width)]"` override is what makes the panel track the field it drops out of — `rootVariants`' plain `w-` utility yields to it via `cn`/tailwind-merge, while the component's own `min-w-[320px]` floor still wins on narrow fields. Verified in the browser at two field widths: a 480px field, where the panel follows to 480px, and a 240px field, where the panel floors at its 320px minimum instead of shrinking further (source: `playground/routes/calendar.tsx` — `DatePickerDemo`, parameterized by `width`).

> ❓ There is no dedicated `date-picker` klp component yet — this composition is currently assembled by the consumer. The Figma file contains only the standalone panel.

```tsx
import { useState } from 'react'
import * as Popover from '@radix-ui/react-popover'
import { CalendarDays } from 'lucide-react'
import { Calendar } from '@/components/calendar'
import { Input } from '@/components/input'

function DatePickerDemo({ width = 480 }: { width?: number }) {
  const [open, setOpen] = useState(false)
  const [date, setDate] = useState<Date | undefined>(undefined)

  return (
    <div style={{ width }}>
      <Popover.Root open={open} onOpenChange={setOpen}>
        <Popover.Anchor asChild>
          <div>
            <Popover.Trigger asChild>
              <Input
                label="Date of the event"
                size="small"
                type="text"
                readOnly
                value={date ? date.toLocaleDateString('en-GB') : ''}
                placeholder="Pick a date"
                iconRight={<CalendarDays aria-hidden="true" strokeWidth={1.5} className="h-4 w-4" />}
              />
            </Popover.Trigger>
          </div>
        </Popover.Anchor>

        <Popover.Portal>
          <Popover.Content sideOffset={4} align="start" className="z-50 outline-none" asChild>
            <Calendar
              // Track the trigger's width; the component's own min-w-[320px]
              // still wins on narrower fields.
              className="w-[var(--radix-popover-trigger-width)]"
              showTimePicker={false}
              value={date}
              onValueChange={(d) => {
                setDate(d)
                setOpen(false)
              }}
            />
          </Popover.Content>
        </Popover.Portal>
      </Popover.Root>
    </div>
  )
}

// Usage: <DatePickerDemo width={480} /> and <DatePickerDemo width={240} />
// — both verified in the browser (panel tracks 480px; panel floors at 320px).
```

## Accessibility

From `spec.json:a11y`:

- **Role**: `application` on the root panel. The internal day grid additionally sets `role="grid"` with `role="row"` on each week row and `role="columnheader"` on each weekday label (source: Calendar.tsx:297-330 — not captured in the Figma spec's `a11y.role`, observed in source).
- **Keyboard support**: The spec lists `ArrowLeft`, `ArrowRight`, `ArrowUp`, `ArrowDown`, `Enter`, `Space`, `PageUp`, `PageDown` as target support (source: spec.json a11y.keyboardSupport). Only `Enter`/`Space` activation is actually implemented, inherited for free from the native `<button>` semantics of the reused `Button` and `CalendarButton` components. Arrow-key and Page-key navigation across the grid is **not implemented**.
- **ARIA notes**: header nav buttons carry explicit `aria-label` ("Previous year", "Previous month", "Next month", "Next year"); every day cell carries a full-date `aria-label` via `Intl.DateTimeFormat`. `today`/`selected` semantics are delegated to `CalendarButton` (`aria-current="date"`, `aria-pressed`). The month label doubles as the grid's `aria-label`.

> ⚠️ LIMITATION: the day grid uses `role="grid"` but relies on native tab-order focus rather than a roving-tabindex implementation — every day cell is independently tabbable, and there is no arrow-key cell-to-cell movement. This falls short of the full WAI-ARIA grid keyboard pattern. Treat the Arrow/PageUp/PageDown entries in the Figma spec as a target, not a current guarantee, until roving tabindex is implemented (candidate: build on a headless date library per `spec.json:a11y.notes`).

## Dependencies

### klp components

- [Button](./_index_button.md) — the 4 header nav affordances, `variant="tertiary" size="icon"`.
- [Calendar Button](./_index_calendar-button.md) — every day-grid cell; day state (default/other-month/today/selected/disable) is fully owned by that component.
- [Input](./_index_input.md) — the footer hour field, `size="small"`.
- [Separator](./_index_separator.md) — the footer rule, `direction="horizontal" margin="none"`.

### External libraries

- [class-variance-authority](https://www.npmjs.com/package/class-variance-authority) — cva variant composition for the panel's structural layers.
- [lucide-react](https://www.npmjs.com/package/lucide-react) — header nav icons (`ChevronsLeft`, `ChevronLeft`, `ChevronRight`, `ChevronsRight`) and the footer clock icon.

### Token groups

- [Colors](../tokens/colors.md)
- [Radius](../tokens/radius.md)
- [Spacing](../tokens/spacing.md)
- [Typography](../tokens/typography.md)

## Used by

*Not yet used by any other klp component.*

## Files

- Source: [`src/components/calendar/Calendar.tsx`](../../src/components/calendar/Calendar.tsx)
- Example: [`src/components/calendar/Calendar.example.tsx`](../../src/components/calendar/Calendar.example.tsx)
- Playground: [`playground/routes/calendar.tsx`](../../playground/routes/calendar.tsx)
- Registry: [`registry/calendar.json`](../../registry/calendar.json)
- Figma spec: [`.klp/figma-refs/calendar/spec.json`](../../.klp/figma-refs/calendar/spec.json)
- Reference screenshots: [`.klp/figma-refs/calendar/`](../../.klp/figma-refs/calendar/) *(empty this session — see Variants note above)*

<!-- KLP:GAPS:BEGIN -->
## DS gaps

No gaps recorded.
<!-- KLP:GAPS:END -->

<!-- KLP:NOTES:BEGIN -->
## Notes

*Manual prose preserved across regenerations. Anything between the BEGIN/END markers is never overwritten by the documentalist.*
<!-- KLP:NOTES:END -->
