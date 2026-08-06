---
title: Nav Item
type: component
status: stable
category: navigation
captureBrand: showup
radixPrimitive: null
sources:
  - .klp/figma-refs/nav-item/spec.json
  - src/components/nav-item/NavItem.tsx
dependencies:
  components: [badges]
  externals: ["class-variance-authority"]
  tokenGroups: ["colors", "spacing", "typography"]
  brands: ["showup"]
usedBy:
  - header-showup
created: 2026-08-05
updated: 2026-08-06
---

# Nav Item

ShowUp application header nav item — a single link/tab entry with an optional leading icon and trailing counter badge, distinguishing the current page with a bottom underline (source: spec.json:description).

## Anatomy

```
root (button, or `<a href>` when `href` is passed)  — 80px tall, centers content at the bottom
├── hover-overlay (span, aria-hidden) — DESIGN ADDITION, not in Figma spec — see note below
└── content (span)                    — 71px-tall row, holds icon + label + counter, carries the underline
    ├── icon         (span)           — Optional, hidden if no `icon` prop
    ├── label        (span)           — Nav item text, passed as `children`
    └── counter-badge (span)          — REUSED: badges (badgeType=primary, size=small, badgeStyle=light) — Optional, hidden if no `counter` prop
```

> **`hover-overlay` is not defined by the Figma component set.** The master `COMPONENT_SET` only declares `State: Default | Active` — no hover appearance exists in the design file. The overlay was added per a direct design instruction and is implemented purely in CSS (`group-hover:opacity-100`), not as a Figma-derived variant. See the Tokens section and Notes for the geometry and the new `--klp-alpha-10` token this required (source: `src/components/nav-item/NavItem.tsx` — `hoverOverlayClasses`, exported alongside `rootBaseClasses`, `contentVariants`, `labelClasses`, `iconClasses`).

> The `state` column below documents visual appearances driven by CSS pseudo-classes
> (`:hover`, `:focus`, `:disabled`) or the Radix `data-state` attribute. It is NOT a
> runtime prop — the component derives it automatically.

## Variants
Single variant axis: `state` (`default` | `active`), 2 variants (source: spec.json:variantAxes). Reference screenshots are unavailable this session (expired Figma REST token — `screenshotNote` on both captured variants); re-run the capture step to populate `.klp/figma-refs/nav-item/{default,active}.png`.

| State | Captured |
|---|---|
| `default` | ❓ UNVERIFIED (no screenshot) |
| `active` | ❓ UNVERIFIED (no screenshot) |

> **The only visual difference between `default` and `active` is a bottom-only 2px underline.** `content`'s `border-b-2` toggles between `border-transparent` (default) and `border-klp-border-light` (active). Text color, icon color, padding, gap, and every other property on `content`/`icon`/`label` are byte-identical between the two Figma variants (source: spec.json `variants[0].layers.content` vs `variants[1].layers.content` — both resolve `label`/`icon` color to the same `--klp-fg-on-emphasis` value, and every padding/spacing literal matches exactly). Do not assume `active` also carries a weight or background change — it doesn't.

### Hover (design addition, not a captured variant)

A third visual state — hover — was added after capture, by direct design instruction, and does **not** exist in the Figma component set (`variantAxes.state` only has `default`/`active`). It is implemented as a CSS-only overlay (`hover-overlay`, see Anatomy and Tokens above), not as a third Figma-driven variant, and is independent of the `active`/`default` axis — an item can be hovered in either state. Verified in the browser across all five nav items in `header-showup`: 64px tall, 8px inset top/bottom, `rgba(255,255,255,0.1)` fill, 8px radius, with the active underline still visible underneath the overlay.

## Props usage

Extends `Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'children'>`. All native button attributes except `children` are forwarded via `...props`.

| Prop | Class | Type | Default | Description |
|---|---|---|---|---|
| `children` | **required** | `React.ReactNode` | — | Nav item label text. |
| `href` | optional | `string` | — | When set, the item renders as an `<a href>` instead of a `<button>` — the common case for a navigation entry. |
| `active` | optional | `boolean` | `false` | Marks this item as the current page. Toggles the bottom underline and sets `aria-current="page"` for assistive tech (the underline alone is not conveyed to screen readers). |
| `icon` | optional | `React.ReactNode` | — | Optional leading icon (Figma boolean prop `Show Icon selector`). Pass a lucide-react icon element; omit to hide. |
| `counter` | optional | `React.ReactNode` | — | Optional trailing counter badge (Figma boolean prop `HasCounter`). Pass the counter content (e.g. a number); omit to hide. Rendered via the shared Badge component (Type=Primary, Size=Small, Style=Light). |

## Tokens

### `root` layer

| Property | Token | Resolved (showup) |
|---|---|---|
| height | — | literal: 80px |

### `content` layer

| Property | Token | Resolved (showup) |
|---|---|---|
| height | — | literal: 71px (see implementation note below) |
| gap | `--klp-size-3xs` | `var(--klp-spacing-1)` = 4px |
| border-bottom width | — | literal: 2px |
| border-bottom color (`default`) | — | literal: `transparent` (underline hidden) |
| border-bottom color (`active`) | `--klp-border-light` | `var(--klp-color-light-100)` = `#FFFFFF` |

> ❓ Not tokenized in Figma: `border-klp-border-light` is a deliberate reconciliation, not a Figma variable binding — the Figma layer carries a hardcoded `#FFFFFF` stroke with zero bound variables. Verified by exact hex match against showup's resolved `--klp-border-light` (see `label-typography` / `content-underline-color` gaps below).

### `icon` layer

| Property | Token | Resolved (showup) |
|---|---|---|
| color | `--klp-fg-on-emphasis` | `var(--klp-color-gray-100)` = `#F7F9F8` |
| size | — | literal: 14px |

### `label` layer

| Property | Token | Resolved (showup) |
|---|---|---|
| color | `--klp-fg-on-emphasis` | `var(--klp-color-gray-100)` = `#F7F9F8` |
| font-family | `--klp-font-family-label` | `'Arial', system-ui, sans-serif` |
| font-weight | `--klp-font-weight-label-bold` | `600` |
| font-size | `--klp-font-size-text-small` | `14px` |
| line-height | — | literal: 16px (`leading-[16px]`, not tokenized) |

> ❓ Not tokenized in Figma: the label's Arial/Bold/14 type is a hardcoded literal with zero bound variables — not a real Figma binding. The mapping onto `--klp-font-family-label` / `--klp-font-weight-label-bold` / `--klp-font-size-text-small` is a deliberate reconciliation, coincidentally an exact match under the `showup` brand (`--klp-font-family-label` also resolves to `'Arial'`; `--klp-font-size-text-small` also resolves to `14px`). Figma's "Bold" style maps onto the klp label-bold weight (`600`), which is not a byte-identical match to a canonical bold `700` — accepted as the closest klp token. See gap `label-typography`.

### `counter-badge` layer

Delegates entirely to the reused [Badge](./_index_badges.md) component (`badgeType="primary" size="small" badgeStyle="light"`) — see Badge's own [Tokens](./_index_badges.md) for its per-layer bindings. Not re-captured here.

### `hover-overlay` layer (design addition — not in Figma spec)

| Property | Token | Resolved (showup) |
|---|---|---|
| fill | `--klp-alpha-10` | `var(--klp-color-light-10)` = `#FFFFFF1A` (10% white) |
| radius | `--klp-radius-l` | `var(--klp-radius-lg)` = `8px` |
| inset (top/bottom) | — | literal: `8px` (64px tall inside the 80px root) |
| inset (left/right) | — | literal: `-8px` (extends 8px past the label each side; still clears the 20px `zone-items` gap between nav items) |
| opacity | — | `0 → 100` on `group-hover`, CSS transition |

> ❓ Not a Figma capture: this layer and its `--klp-alpha-10` token are a DS-side addition (source: `.klp/tokens.json` notes, dated 2026-08-05) made to satisfy a design instruction the master component set does not express. See gap `hover-overlay-token` below.

## Examples

```tsx
import { Home } from 'lucide-react'
import { NavItem } from '@/components/nav-item'

export function NavItemExample() {
  return (
    <nav className="flex gap-2 bg-klp-bg-brand px-4">
      <NavItem href="/" active icon={<Home />} counter={3}>
        Home
      </NavItem>
      <NavItem href="/offers">My offer</NavItem>
    </nav>
  )
}
```

## Accessibility

- **Role**: `link` (source: spec.json a11y.role). The default rendered element is a native `<button type="button">` — pass `href` to render an `<a href>` and get the actual `link` role the spec targets; this is the expected usage inside a header nav.
- **Keyboard support**: `Enter` activates the link/button; `Tab` focuses it.
- **ARIA notes**: `active` sets `aria-current="page"` in addition to the visual underline, since the underline alone is not conveyed to assistive tech (source: spec.json a11y.notes).

## Dependencies

### klp components

- [Badge](./_index_badges.md) — trailing counter badge (`badgeType="primary" size="small" badgeStyle="light"`), rendered when `counter` is passed.

### External libraries

- [class-variance-authority](https://www.npmjs.com/package/class-variance-authority) — cva variant composition (`content` state axis)

### Token groups

- [Colors](../tokens/colors.md)
- [Spacing](../tokens/spacing.md)
- [Typography](../tokens/typography.md)

## Used by

- [Header Showup](./_index_header-showup.md)

## Files

- Source: [`src/components/nav-item/NavItem.tsx`](../../src/components/nav-item/NavItem.tsx)
- Example: [`src/components/nav-item/NavItem.example.tsx`](../../src/components/nav-item/NavItem.example.tsx)
- Playground: [`playground/routes/nav-item.tsx`](../../playground/routes/nav-item.tsx)
- Registry: [`registry/nav-item.json`](../../registry/nav-item.json)
- Figma spec: [`.klp/figma-refs/nav-item/spec.json`](../../.klp/figma-refs/nav-item/spec.json)
- Reference screenshots: [`.klp/figma-refs/nav-item/`](../../.klp/figma-refs/nav-item/)

<!-- KLP:GAPS:BEGIN -->
## DS gaps

| Part | Kind | Reason | Action |
|---|---|---|---|
| label-typography | no-instance-no-match | Figma type is a hardcoded literal (Arial, Bold, 14px) with zero bound variables — not a real klp font binding. | `substituted-klp-label-font` — mapped onto `--klp-font-family-label` / `--klp-font-weight-label-bold` / `--klp-font-size-text-small`. Coincidentally an exact match under `showup` (family + size); weight is the closest klp bold token (600), not a byte match to Figma's "Bold" (commonly 700). |
| content-underline-color | token-gap | The active-state bottom border is a hardcoded literal `#FFFFFF`, no bound Figma variable. | `accepted-literal` — reconciled onto `--klp-border-light` by exact hex match (`--klp-color-light-100` = `#FFFFFF`). |
| content-padding-y | token-gap | Captured `paddingY: 25px` on `content` has no `--klp-size-*` alias matching exactly (nearest are `--klp-size-l`=24px / `--klp-size-xl`=32px). | `accepted-literal` — not applied as padding at all; see the fixed-height implementation note in Notes. |
| hover-overlay-token | token-gap | A hover state was requested that does not exist in the Figma component set (master only has `State: Default \| Active`); implementing it needed a 10%-white alpha token that had no alias — `aliases.css` only exposed `--klp-alpha-80`, though the `--klp-color-light-10` primitive already existed. | `added-alias` — `--klp-alpha-10 → --klp-color-light-10` added to `aliases.css` in all four `[data-brand]` blocks, DS-side, not a Figma capture. Design should add a matching `alpha/10` alias in the Figma file so the two stay in step; `.klp/tokens.json` carries a note recording this as a live 2026-08-05 addition against an otherwise 2026-04-16 capture. |
<!-- KLP:GAPS:END -->

<!-- KLP:NOTES:BEGIN -->
## Notes

### Implementation note — fixed height instead of captured padding

`content` renders `h-[71px]` (a Figma literal) instead of applying the captured `paddingY: 25px`. The 25/25 padding only holds for a bare 21px label line; with the counter `Badge` present the padded box grows past 80px inside the header's fixed 80px item, which pushes the underline out of the visible frame. A fixed 71px height reproduces Figma's own 71-in-80 geometry and keeps the rule flush on the bottom edge regardless of content (icon, counter, or neither). This was decided after a browser check, not derived from the spec — it is an implementation decision, not a design-system gap.

### Not tokenized in Figma

This component is not tokenized in the source Figma file: every color and the label typography are hardcoded literals with zero bound variables. The token mapping documented above (`--klp-fg-on-emphasis`, `--klp-border-light`, the label typography tokens) is a deliberate reconciliation, justified in every case by an exact value match against `aliases.css` — not a Figma binding. See `docs/gaps.md` for the 3 typed gaps this produced.

### Validator status

`node scripts/validate-tokens.mjs nav-item` passes with 0 mismatches. It emits 6 informational warnings: `unknown-state` (the root `button`/`a` primitive doesn't declare a `state` in its own right — `state` lives on `content`) and `layer-no-cva` (layers whose classes are static strings rather than a `cva` block: `icon`, `label`, and the root). Both warning families are expected for this component's shape and are not mismatches.

### 2026-08-05 — hover overlay added (post-capture, design instruction)

A hover appearance was added at the user's request; it is not part of the captured Figma spec (see the Hover note under Variants and the `hover-overlay-token` gap). Implementation: an absolutely-positioned `span` (`pointer-events-none`, `aria-hidden`), inset `8px` from the header's top/bottom edges (64px tall inside the 80px item) and `-8px` past the label on each side (still clears the 20px gap between items), `rounded-klp-l`, `bg-klp-alpha-10`, fading `opacity-0 → group-hover:opacity-100`. `rootBaseClasses` gained `group relative cursor-pointer`; `content` gained `relative` so it paints above the absolutely-positioned overlay preceding it in DOM order — a static sibling would otherwise sit underneath it. Required a new token, `--klp-alpha-10`, added to `aliases.css` (see gap table above) since Figma's alpha family only defined `alpha/80`.

### 2026-08-06 — `asChild` removed, `href` added (runtime crash fix)

`nav-item` previously exposed Radix `asChild` for rendering as an `<a href>`. That path crashed at runtime: verified in a browser probe, it threw `React.Children.only expected to receive a single React element child` and rendered a blank page. Two compounding reasons — `nav-item` renders several sibling children under the root (the `hover-overlay` span plus the `content` box), and Radix `Slot` requires exactly one child; more fundamentally, `Slot` clones the consumer's element and keeps *its* children, which would have silently discarded this component's own icon, label, and hover overlay even if the sibling-count issue were fixed.

`asChild` is removed and replaced by a plain `href` prop: set it and the root renders as `<a href>`, keeping all internal structure (hover overlay, icon, label, counter) intact; omit it and you get a `<button type="button">`. Verified in the browser: the href path now renders a real `<a>` with icon, label, and hover overlay intact, and the non-href path still renders a button. `header-showup` forwards `items[].href` onto this prop.

The `@radix-ui/react-slot` dependency is no longer imported by this component; `dependencies.externals` in `klp-components.json` and `dependencies.npm` in `registry/nav-item.json` no longer list it. `radixPrimitive` in the frontmatter above is now `null` (was `"@radix-ui/react-slot"`).
<!-- KLP:NOTES:END -->
