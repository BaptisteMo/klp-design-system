---
title: Separator
type: component
status: stable
category: utilities
captureBrand: klub
radixPrimitive: "@radix-ui/react-separator"
sources:
  - .klp/figma-refs/separator/spec.json
  - src/components/separator/Separator.tsx
dependencies:
  components: []
  externals: ["@radix-ui/react-separator", "class-variance-authority"]
  tokenGroups: ["colors", "spacing"]
  brands: ["klub"]
usedBy:
  - action-sheet-menu
  - calendar
  - tabulations
created: 2026-08-04
updated: 2026-08-04
---

# Separator

A 1px rule used to visually divide content, with a margin axis controlling the space reserved around the line and a direction axis controlling its orientation (source: spec.json:description).

<!-- KLP:INTENT:BEGIN -->

## When to use

A 1px rule that visually splits neighbouring content, horizontal or vertical, with a margin axis reserving the surrounding space.

**Don't use it for:** Not to create spacing — use the gap and padding utilities. Not to outline a region; a bordered surface is cards.

## Don't confuse with

| Component | How to choose |
|---|---|
| `cards` | separator draws one line between siblings; cards wraps content in a bordered surface. |

<!-- KLP:INTENT:END -->

## Anatomy

```
root (div)   — Padding-only wrapper, transparent. Reserves the margin space
│              around the line via layout padding: paddingTop/paddingBottom
│              for direction=horizontal, paddingLeft/paddingRight for
│              direction=vertical. margin=none has zero padding.
└── line (div) — The visible rule. Drawn as a border (border-t / border-l),
                 never a fill — the Figma node is a stroke-only RECTANGLE
                 with no fills entry. Fills its container's cross axis
                 (w-full for horizontal, h-full for vertical).
```

> ❓ UNVERIFIED: reference screenshots could not be persisted to disk this session (expired Figma REST token). `spec.json:variants[*].screenshotNote` records the capture output was not writable. Re-run `figma_capture_screenshot` on the 8 node IDs listed in `spec.json` to populate the reference set.

## Variants

8 variants over `margin` (none / small / medium / large) × `direction` (horizontal / vertical). No reference screenshots this session — see the callout above.

| margin | horizontal | vertical |
|---|---|---|
| none | — | — |
| small | — | — |
| medium | — | — |
| large | — | — |

Verified in the browser (not from Figma reference PNGs) at all 8 combinations: wrapper size on the margin axis measures 1px (none), 17px (small), 33px (medium), 49px (large) — the 1px line plus double the padding token, exactly matching the Figma variant sizes. The line resolves to `#D7DAD9` under klub (`--klp-border-default` → `--klp-color-gray-400`).

## Props usage

Extends `React.ComponentPropsWithoutRef<typeof SeparatorPrimitive.Root>` (minus `orientation`, redeclared below as `direction`).

| Prop | Type | Default | Class | Description |
|---|---|---|---|---|
| `direction` | `'horizontal' \| 'vertical'` | `"horizontal"` | optional | Direction axis: maps to Radix's `orientation` prop. |
| `margin` | `'none' \| 'small' \| 'medium' \| 'large'` | `"none"` | optional | Space reserved around the line (maps to spec variantAxes.margin). |
| `decorative` | `boolean` | `true` | optional | Whether the separator is purely visual (`role="none"`) vs semantic (`role="separator"`). |

Every prop carries `@propClass optional` in source — no `required`, `computed`, or `persistent` props, so no Do/Don't block is emitted here.

`decorative` defaults to `true`, which is why the rendered role is `none` rather than `separator` out of the box (source: Separator.tsx — Radix `SeparatorPrimitive.Root` sets `role="none"` when `decorative` is true). Pass `decorative={false}` when the divider carries real semantic meaning for assistive tech (e.g. separating distinct sections of a `menu`, not just a cosmetic rule).

## Tokens

### `root` layer

Padding-only wrapper — no fill or stroke of its own (transparent). The margin axis maps to padding on the block axis (horizontal direction) or inline axis (vertical direction); `none` has zero padding with no token bound.

| Property | Token | Resolved (klub) |
|---|---|---|
| paddingTop / paddingBottom (horizontal, margin=small) | `--klp-size-xs` | `var(--klp-spacing-2)` (8px) |
| paddingTop / paddingBottom (horizontal, margin=medium) | `--klp-size-m` | `var(--klp-spacing-4)` (16px) |
| paddingTop / paddingBottom (horizontal, margin=large) | `--klp-size-l` | `var(--klp-spacing-6)` (24px) |
| paddingLeft / paddingRight (vertical, margin=small) | `--klp-size-xs` | `var(--klp-spacing-2)` (8px) |
| paddingLeft / paddingRight (vertical, margin=medium) | `--klp-size-m` | `var(--klp-spacing-4)` (16px) |
| paddingLeft / paddingRight (vertical, margin=large) | `--klp-size-l` | `var(--klp-spacing-6)` (24px) |
| fill | literal | `literal: transparent` |
| padding (margin=none) | literal | `literal: 0px` |

### `line` layer

The actual visible rule, drawn as a stroke (`border-*`), never a fill (source: spec.json:anatomy[1].notes — Figma's `Rectangle 1` node has a bound `strokes` entry and no `fills` entry).

| Property | Token | Resolved (klub) |
|---|---|---|
| stroke (horizontal → `border-t`) | `--klp-border-default` | `var(--klp-color-gray-400)` (`#D7DAD9`) |
| stroke (vertical → `border-l`) | `--klp-border-default` | `var(--klp-color-gray-400)` (`#D7DAD9`) |
| strokeWeight | literal | `literal: 1px` |
| length (horizontal: width, vertical: height) | literal | `literal: fills container (w-full / h-full)` |

> The Figma capture shows a 234px sample length on the `line` layer, but that is only the canvas sample, not a real constraint (source: spec.json `literals.width`/`literals.height` notes on every variant). The implementation deliberately fills its container instead of hardcoding 234px.

## Examples

```tsx
import { Separator } from './Separator'

export function SeparatorExample() {
  return (
    <div className="flex w-[240px] flex-col">
      <span>Section A</span>
      <Separator direction="horizontal" margin="medium" />
      <span>Section B</span>
    </div>
  )
}
```

## Accessibility

From `spec.json:a11y`:

- **Role**: `separator` when `decorative={false}`; `none` when `decorative={true}` (default) — Radix's `react-separator` sets `role="none"` for purely decorative dividers so assistive tech does not announce a semantic boundary that carries no meaning (source: spec.json a11y.notes).
- **Keyboard support**: none — a separator is not an interactive element (source: spec.json a11y.keyboardSupport, empty array).
- **ARIA notes**: when non-decorative, set `aria-orientation` matching the `direction` axis (`"horizontal"` | `"vertical"`); Radix's `SeparatorPrimitive.Root` derives this automatically from the `orientation` prop, which `direction` maps onto.

## Dependencies

### klp components

*Leaf component — no klp dependencies.*

### External libraries

- [@radix-ui/react-separator](https://www.npmjs.com/package/@radix-ui/react-separator) — behavior + role/aria-orientation derivation (`orientation`, `decorative`).
- [class-variance-authority](https://www.npmjs.com/package/class-variance-authority) — `rootVariants` (margin/direction padding) and `lineVariants` (direction border) cva blocks.

### Token groups

- [Colors](../tokens/colors.md) — `--klp-border-default` on the `line` layer.
- [Spacing](../tokens/spacing.md) — `--klp-size-{xs,m,l}` on the `root` layer's margin padding.

## Used by

- [ActionSheet Menu](./_index_action-sheet-menu.md) — between-section rule; `default`/`flat` use `margin="medium"`, `checkbox` uses `margin="none"`.
- [Calendar](./_index_calendar.md) — the footer rule, `direction="horizontal" margin="none"`.
- [Tabulations](./_index_tabulations.md) — vertical divider between tabs, `direction="vertical" margin="none"`.

## Files

- Source: [`src/components/separator/Separator.tsx`](../../src/components/separator/Separator.tsx)
- Example: [`src/components/separator/Separator.example.tsx`](../../src/components/separator/Separator.example.tsx)
- Playground: [`playground/routes/separator.tsx`](../../playground/routes/separator.tsx)
- Registry: [`registry/separator.json`](../../registry/separator.json)
- Figma spec: [`.klp/figma-refs/separator/spec.json`](../../.klp/figma-refs/separator/spec.json)
- Reference screenshots: [`.klp/figma-refs/separator/`](../../.klp/figma-refs/separator/) *(empty this session — see Variants note above)*

<!-- KLP:GAPS:BEGIN -->
## DS gaps

No gaps recorded.
<!-- KLP:GAPS:END -->

<!-- KLP:NOTES:BEGIN -->
## Notes

*Manual prose preserved across regenerations. Anything between the BEGIN/END markers is never overwritten by the documentalist.*
<!-- KLP:NOTES:END -->
