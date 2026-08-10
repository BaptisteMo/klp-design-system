---
title: Navbar Item
type: component
status: stable
category: navigation
captureBrand: atlas
radixPrimitive: null
sources:
  - .klp/figma-refs/navbar-item/spec.json
  - src/components/navbar-item/NavbarItem.tsx
dependencies:
  components: []
  externals: [class-variance-authority]
  tokenGroups: [colors, spacing, typography]
  brands: [atlas]
usedBy:
  - sidebar-atlas
created: 2026-08-06
updated: 2026-08-06
---

# Navbar Item

Atlas sidebar navigation item — a 70×52 vertical stack (icon over label) with three interaction states (source: spec.json:description).

<!-- KLP:INTENT:BEGIN -->

## When to use

A row of the Atlas rail — a 70x52 icon-over-label stack with default, hover and selected states, where selected is author-supplied and always beats hover.

**Don't use it for:** Never inside sidebar — that panel's rows are item-side-bar. Never standalone outside sidebar-atlas, and never in a horizontal header bar (that is nav-item).

**Family — `sidebars`:** sidebar is the generic full nav (desktop + phone). sidebar-atlas is the Atlas-only 70px icon rail. item-side-bar is a row inside sidebar; navbar-item is a row inside sidebar-atlas. The two row types are not interchangeable.

## Don't confuse with

| Component | How to choose |
|---|---|
| `item-side-bar` | navbar-item is a row of sidebar-atlas; item-side-bar is a row of sidebar. |
| `sidebar-atlas` | sidebar-atlas is the rail; navbar-item is one of its rows. |
| `sidebar` | sidebar never contains navbar-item. |

<!-- KLP:INTENT:END -->
## Anatomy

```
root (button, or `<a href>` when `href` is passed) — 70x52 vertical flex stack
├── icon  (span, aria-hidden) — 70x24 lucide-react icon slot, centered, 2px inset padding
└── label (span)               — 70x16, single line, centered
```

> ❓ `spec.json`'s anatomy note calls the root "asChild-friendly", a leftover from an earlier draft of this component. The shipped API does **not** use Radix `asChild`/Slot — see Props usage and the Notes section for why.

## Variants

Three `state` variants. **The three states differ ONLY in the root surface** — icon colour, label colour, type, and geometry are identical throughout every variant (source: `NavbarItem.tsx` — only `rootVariants` branches on `state`; `iconClasses`/`labelClasses` are flat constants).

| State | Root surface | Captured |
|---|---|---|
| `default` | nothing (no fill, no stroke) | ❓ UNVERIFIED (no screenshot — expired Figma REST token this session) |
| `hover` | white-10% background, `bg-klp-alpha-10` | ❓ UNVERIFIED (no screenshot) |
| `selected` | 3px right-edge border only, `border-r-[3px] border-klp-border-light` (`INSIDE`-aligned, source: spec.json `variants[2].layers.root.literals.strokeSide: "right-only"`) | ❓ UNVERIFIED (no screenshot) |

**Contrast with the ShowUp `nav-item`.** Unlike [Nav Item](./_index_nav-item.md) — whose Figma capture is entirely unbound literals reconciled onto klp aliases after the fact — `navbar-item` **is properly tokenized in Figma**: every styled property on every layer (root/icon/label) resolves to a named Figma variable with a matching `--klp-*` alias (source: spec.json:description — "this component is fully and correctly tokenized in Figma... No token gaps on the component's own layers"). The two components look like siblings (icon-over-label / icon-beside-label nav entries) but have very different provenance: one is a clean capture, the other a hand-reconciled one.

> The `state` column above documents visual appearances driven by CSS pseudo-classes
> (`:hover`) or an author-supplied boolean (`selected`). `state` is also exposed as a
> real prop (see Props usage below) — this is a Class B–ish situation: `state` is
> `computed` by default (derived from real `:hover`) but can be frozen for
> docs/playground use.

## Props usage

Extends `Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'children'>`. All native button attributes except `children` are forwarded via `...props`.

| Prop | Class | Type | Default | Description |
|---|---|---|---|---|
| `icon` | **required** | `React.ReactNode` | — | Icon slot — pass a lucide-react icon element. Colour flows through `currentColor` via the wrapping span's `text-klp-fg-on-emphasis`. |
| `children` | **required** | `React.ReactNode` | — | Item label text. |
| `href` | optional | `string` | — | When set, the item renders as an `<a href>` instead of a `<button>` — the common case for real navigation. |
| `selected` | optional | `boolean` | `false` | Marks this item as the current route. Author-supplied (only the parent rail knows the active route) and **always wins**, over both a forced `state` and a genuine pointer hover. Sets `aria-current="page"`. |
| `state` | **computed** | `NavbarItemState` (`'default' \| 'hover' \| 'selected'`) | `undefined` | Explicit visual state override. When omitted, the root derives its surface from a real CSS `:hover` and falls back to `default` otherwise. Pass this to force any of the three states statically — used by the playground variant grid and docs. |

### Do / Don't

✅ **Do** — let the component handle its own interactive state.

```tsx
<NavbarItem icon={<Search strokeWidth={1.5} />} href="/search">
  Search
</NavbarItem>
```

```tsx
{/* selected is author-supplied — pass a real semantic value tied to the current route */}
<NavbarItem icon={<Home strokeWidth={1.5} />} href="/dashboard" selected={activeId === 'dashboard'}>
  Dashboard
</NavbarItem>
```

```tsx
{/* omit `state` entirely — the white-10% surface comes from a genuine :hover */}
<NavbarItem icon={<Search strokeWidth={1.5} />}>Search</NavbarItem>
```

❌ **Don't**

```tsx
<NavbarItem icon={<Search strokeWidth={1.5} />} state="hover">
  Search
</NavbarItem>
{/* freezes the visual state and breaks interactive transitions — reserved for the
    playground variant grid and docs, not for real app usage */}
```

## Tokens

### `root` layer

| Property | Token | Resolved (atlas) |
|---|---|---|
| fill (`default`, `hover`) | `--klp-alpha-10` on `hover`, none on `default` | `hover`: `var(--klp-color-light-10)` = `#FFFFFF1A` |
| stroke (`selected`, right edge only, 3px, `INSIDE`) | `--klp-border-light` | `var(--klp-color-light-100)` = `#FFFFFF` |
| paddingTop / paddingBottom / itemSpacing | `--klp-size-4xs` | `var(--klp-spacing-0-5)` = `2px` |
| width / height | — | literal: `70px` / `52px` |
| cornerRadius | — | literal: `0px` |

> ❓ `spec.json` records the root's `paddingTop`/`paddingBottom`/`itemSpacing` token as `--klp-size-4xs` but with `figmaVar: null` (i.e. not actually variable-bound on the root layer, unlike the `icon` layer's identical token which IS bound) and a captured raw `value` of `4px` — one line item that reads inconsistently against the token's real resolved value (`2px`) under `atlas`. Treated here as the same `--klp-size-4xs` alias used elsewhere on this component; flagged for a human sanity-check against the live Figma file.

### `icon` layer

| Property | Token | Resolved (atlas) |
|---|---|---|
| color | `--klp-fg-on-emphasis` | `var(--klp-color-gray-100)` = `#F7F9F8` |
| padding (all sides) | `--klp-size-4xs` | `var(--klp-spacing-0-5)` = `2px` |
| width / height (box) | — | literal: `70px` / `24px` |
| icon box / glyph size | — | literal: `20px` box / `15px` glyph, `1.5px` stroke weight |

Identical across all three states (source: spec.json — `icon` layer bindings are byte-identical in `default`/`hover`/`selected`).

### `label` layer

| Property | Token | Resolved (atlas) |
|---|---|---|
| color | `--klp-fg-on-emphasis` | `var(--klp-color-gray-100)` = `#F7F9F8` |
| font-size | `--klp-font-size-text-smaller` | `11px` |
| font-weight | `--klp-font-weight-label` | `400` |
| font-family | `--klp-font-family-label` | `'Roboto', system-ui, sans-serif` |
| line-height | — | literal: `16px` |
| width / height | — | literal: `70px` / `16px` |

Identical across all three states (source: spec.json — `label` layer bindings are byte-identical in `default`/`hover`/`selected`).

## Examples

```tsx
import { Search } from 'lucide-react'
import { NavbarItem } from '@/components/navbar-item'

export function NavbarItemExample() {
  return (
    <nav className="flex flex-col gap-2 bg-klp-bg-navrail p-2">
      <NavbarItem icon={<Search strokeWidth={1.5} />} selected>
        Search
      </NavbarItem>
      <NavbarItem href="/search" icon={<Search strokeWidth={1.5} />}>
        Search
      </NavbarItem>
    </nav>
  )
}
```

## Accessibility

- **Role**: `link` (source: spec.json a11y.role). Pass `href` to render a real `<a>`; the default is a native `<button type="button">`.
- **Keyboard support**: `Enter`, `Space` activate the item.
- **ARIA notes**: recommend rendering as an `<a>` with `aria-current="page"` applied when `selected` is true, instead of relying on the visual right-edge stroke alone (source: spec.json a11y.notes — the component itself already does this: `selected` sets `aria-current="page"`). Hover must remain reachable via `:focus-visible` for keyboard users, not just `:hover` (source: spec.json a11y.notes).

## Dependencies

### klp components

*Leaf component — no klp dependencies.*

### External libraries

- [class-variance-authority](https://www.npmjs.com/package/class-variance-authority) — cva variant composition (root `state` axis)

### Token groups

- [Colors](../tokens/colors.md)
- [Spacing](../tokens/spacing.md)
- [Typography](../tokens/typography.md)

## Used by

- [Sidebar (Atlas)](./_index_sidebar-atlas.md) — one instance per `items[]` entry.

## Files

- Source: [`src/components/navbar-item/NavbarItem.tsx`](../../src/components/navbar-item/NavbarItem.tsx)
- Example: [`src/components/navbar-item/NavbarItem.example.tsx`](../../src/components/navbar-item/NavbarItem.example.tsx)
- Playground: [`playground/routes/navbar-item.tsx`](../../playground/routes/navbar-item.tsx)
- Registry: [`registry/navbar-item.json`](../../registry/navbar-item.json)
- Figma spec: [`.klp/figma-refs/navbar-item/spec.json`](../../.klp/figma-refs/navbar-item/spec.json)
- Reference screenshots: [`.klp/figma-refs/navbar-item/`](../../.klp/figma-refs/navbar-item/)

<!-- KLP:GAPS:BEGIN -->
## DS gaps

No gaps recorded.
<!-- KLP:GAPS:END -->

<!-- KLP:NOTES:BEGIN -->
## Notes

### 2026-08-06 — `asChild` removed, `href` added (runtime crash fix)

`navbar-item` previously exposed Radix `asChild` for rendering as an `<a href>`. That path crashed at runtime: verified in a browser probe, it threw `React.Children.only expected to receive a single React element child` and rendered a blank page. Two compounding reasons — `navbar-item` always renders two sibling children (`icon` span + `label` span) under the root, and Radix `Slot` requires exactly one child; more fundamentally, `Slot` clones the consumer's element and keeps *its* children, which would have silently discarded the component's own icon and label even if the sibling-count issue were fixed.

`asChild` is removed and replaced by a plain `href` prop: set it and the root renders as `<a href>`, keeping the internal icon/label structure intact; omit it and you get a `<button type="button">`. Verified in the browser: the href path now renders a real `<a>` with icon and label intact, and the non-href path still renders a button. `sidebar-atlas` forwards `items[].href` onto this prop.

The `@radix-ui/react-slot` dependency is no longer imported by this component; `dependencies.externals` in `klp-components.json` and `dependencies.npm` in `registry/navbar-item.json` no longer list it.
<!-- KLP:NOTES:END -->
