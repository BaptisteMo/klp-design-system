---
title: Sidebar (Atlas)
type: component
status: stable
category: navigation
captureBrand: atlas
radixPrimitive: null
sources:
  - .klp/figma-refs/sidebar-atlas/spec.json
  - src/components/sidebar-atlas/SidebarAtlas.tsx
dependencies:
  components: [navbar-item]
  externals: [class-variance-authority]
  tokenGroups: [colors, spacing]
  brands: [atlas]
usedBy: []
created: 2026-08-06
updated: 2026-08-06
---

# Sidebar (Atlas)

Atlas brand vertical nav rail ("NavBar" in Figma) — a 70px-wide, full-height stack of a logo slot followed by primary navigation entries (source: spec.json:description).

<!-- KLP:INTENT:BEGIN -->

## When to use

The Atlas brand's 70px-wide, full-height icon rail — a logo slot over a list of navbar-item entries driven by an items prop with real hrefs and a selected route.

**Don't use it for:** Never under klub, showup or wireframe — those get sidebar. Not when entries need labels, context switching or a user footer; that is sidebar.

**Family — `sidebars`:** sidebar is the generic full nav (desktop + phone). sidebar-atlas is the Atlas-only 70px icon rail. item-side-bar is a row inside sidebar; navbar-item is a row inside sidebar-atlas. The two row types are not interchangeable.

## Don't confuse with

| Component | How to choose |
|---|---|
| `sidebar` | sidebar-atlas is the Atlas-only 70px icon rail; sidebar is the generic labelled nav. |
| `navbar-item` | sidebar-atlas is the rail; navbar-item is one of its rows. |
| `item-side-bar` | sidebar-atlas never contains item-side-bar — its rows are navbar-item. |

<!-- KLP:INTENT:END -->
## Anatomy

```
root (nav, aria-label="Primary")  — 70px wide, full-height (h-full), bg-klp-bg-navrail, py-[24px], gap-[16px]
├── logo (span, aria-hidden)      — SLOT: `logo` — consumer-provided, defaults to a minimal placeholder mark
└── navbar-item (button/a) × N    — REUSED: navbar-item, one per `items[]` entry
```

**Fixed geometry** (source: spec.json anatomy `root` notes): 70px wide, vertical flex, `paddingTop`/`paddingBottom` 24px, `itemSpacing` 16px between every child — logo-to-first-item and item-to-item alike. There is no wrapper frame around the nav items — logo and every `navbar-item` instance are direct children of root, in document order. The Figma capture's 800px height is a canvas sample only; the component fills its container's height (`h-full`), not a fixed 800px.

## Variants

The Figma master is a plain `COMPONENT`, not a `COMPONENT_SET` — **there is no variant axis** (source: spec.json `variantAxes: {}`, a single captured `variants[0]` with `id: "default"`). Figma models interaction states one level down, inside each [Navbar Item](./_index_navbar-item.md) instance, not on the rail itself.

> ❓ UNVERIFIED: reference screenshot unavailable this session (expired Figma REST token — `screenshotNote` on the single captured variant). Re-run the capture step to populate `.klp/figma-refs/sidebar-atlas/default.png`.

## Props usage

Extends `React.HTMLAttributes<HTMLElement>`. All native `<nav>` attributes are forwarded via `...props`; the component forwards its ref to the root `<nav>`.

| Prop | Class | Type | Default | Description |
|---|---|---|---|---|
| `items` | **required** | `SidebarAtlasItem[]` | — | Primary navigation entries rendered as `navbar-item` instances. |
| `onItemSelect` | optional | `(id: string) => void` | — | Called when a nav item is selected, receiving its id. |
| `logo` | optional | `React.ReactNode` | placeholder mark (`"A"`) | Brand logo slot. Defaults to a minimal placeholder mark (no vector art reproduced — the Atlas logo is a Figma IMAGE fill, not a component). |

### `SidebarAtlasItem` shape (`items[]` entries)

| Field | Class | Type | Description |
|---|---|---|---|
| `id` | **required** | `string` | Stable identifier, also used as the React key. |
| `label` | **required** | `string` | Item label text. |
| `icon` | **required** | `React.ReactNode` | Icon slot — pass a lucide-react icon element. |
| `selected` | optional | `boolean` | Marks this item as the current route. Renders `navbar-item`'s right-edge border and sets `aria-current="page"`. Wins over hover and over an explicit `state` override. |
| `href` | optional | `string` | When provided, the item renders as an `<a href>` via `navbar-item`'s `href` prop. |
| `state` | optional | `NavbarItemState` | Explicit visual state override forwarded to `navbar-item` — force `default \| hover \| selected` on a specific item (used by the playground to show all three states at once without a pointer). |

## Examples

```tsx
import { useState } from 'react'
import { Search, MapPin, Home } from 'lucide-react'
import { SidebarAtlas } from '@/components/sidebar-atlas'

export function SidebarAtlasExample() {
  const [activeId, setActiveId] = useState('dashboard')

  return (
    <div className="h-[600px]">
      <SidebarAtlas
        items={[
          { id: 'search', label: 'Search', icon: <Search strokeWidth={1.5} />, selected: activeId === 'search' },
          { id: 'map', label: 'Map', icon: <MapPin strokeWidth={1.5} />, selected: activeId === 'map' },
          { id: 'dashboard', label: 'Dashboard', icon: <Home strokeWidth={1.5} />, selected: activeId === 'dashboard' },
        ]}
        onItemSelect={setActiveId}
      />
    </div>
  )
}
```

The ten real Figma-captured entries (source: spec.json anatomy `nav-item-*` parts, all `state: "default"` in the capture): Search, Map, Dashboard, Todo, Benchmark, Matching, Operations, Contracts, Reporting, Admin.

> The third entry's Figma instance layer is named **"Home"**, but its rendered `TEXT` child copy reads **"Dashboard"** (source: spec.json anatomy `nav-item-home` notes: "the instance layer is named 'Home' but its TEXT child's actual copy reads 'Dashboard' — the adapter should use the rendered label text ('Dashboard'), not the layer name, as the prop value"). The rendered label is used, not the layer name — `SidebarAtlasItem.label` for this entry is `"Dashboard"`.

## Accessibility

- **Role**: `navigation` (source: spec.json a11y.role). Root renders `<nav aria-label="Primary">`.
- **Keyboard support**: `Tab`, `Enter`, `Space` (source: spec.json a11y.keyboardSupport) — inherited from each `navbar-item` instance.
- **ARIA notes**: this is a primary navigation landmark. Each item should carry `aria-current="page"` when it represents the active route (handled automatically via `navbar-item`'s `selected` prop). Hover/selected visuals are owned entirely by `navbar-item`'s own state machine and must remain reachable via `:focus-visible` for keyboard users, not just `:hover` (source: spec.json a11y.notes). The logo slot at top should be either decorative (`aria-hidden`, if a home link exists elsewhere) or itself a link to the app root with descriptive alt text — the consumer decides based on how routing is wired.

## Dependencies

### klp components

- [Navbar Item](./_index_navbar-item.md) — one instance per `items[]` entry.

### External libraries

- [class-variance-authority](https://www.npmjs.com/package/class-variance-authority) — cva composition for root/logo classes

### Token groups

- [Colors](../tokens/colors.md)
- [Spacing](../tokens/spacing.md)

## Used by

*Not yet used by any other klp component.*

## Files

- Source: [`src/components/sidebar-atlas/SidebarAtlas.tsx`](../../src/components/sidebar-atlas/SidebarAtlas.tsx)
- Example: [`src/components/sidebar-atlas/SidebarAtlas.example.tsx`](../../src/components/sidebar-atlas/SidebarAtlas.example.tsx)
- Playground: [`playground/routes/sidebar-atlas.tsx`](../../playground/routes/sidebar-atlas.tsx)
- Registry: [`registry/sidebar-atlas.json`](../../registry/sidebar-atlas.json)
- Figma spec: [`.klp/figma-refs/sidebar-atlas/spec.json`](../../.klp/figma-refs/sidebar-atlas/spec.json)
- Reference screenshots: [`.klp/figma-refs/sidebar-atlas/`](../../.klp/figma-refs/sidebar-atlas/)

<!-- KLP:GAPS:BEGIN -->
## DS gaps

| Part | Kind | Reason | Action |
|---|---|---|---|
| logo | new-primitive | The Atlas logo layer is a Figma `IMAGE` fill (wordmark artwork), not a component and not bindable to any token. No klp equivalent exists. | Exposed as a consumer-provided `logo` slot with a minimal default (placeholder mark, no inline SVG, no hardcoded asset import). |
| root | no-instance-no-match / token-gap | Root fill `#22222D` is bound to no Figma variable anywhere in the file — searched exhaustively across every collection. | `used-approximate-alias` — a DS-side alias `--klp-bg-navrail` was created, pointing at the nearest existing primitive `storm-900` (`#191D2C`, RGB distance 10, imperceptible). This is a genuine gap: Figma should introduce a real token for the nav-rail surface so the alias can point at an authoritative source instead of an approximation. |
<!-- KLP:GAPS:END -->

<!-- KLP:NOTES:BEGIN -->
## Notes

### `radixPrimitive` decision

`spec.json` records `radixPrimitive: "@radix-ui/react-navigation-menu"` as a TODO best-guess ("confirm during adaptation whether a bare `<nav>` is preferable to importing `@radix-ui/react-navigation-menu`"). The shipped implementation uses a bare `<nav>` — this is a static content-navigation landmark, not a Radix-primitive-driven interactive widget, so pulling in `@radix-ui/react-navigation-menu` was judged unnecessary weight. `radixPrimitive` in the frontmatter above reflects the actual source, not the spec's guess.

### `navbar-item`'s `href`/`asChild` history

`items[].href` forwards straight onto `navbar-item`'s `href` prop, which itself replaced a Radix `asChild` path that crashed at runtime (see [Navbar Item](./_index_navbar-item.md) Notes for the browser-verified `React.Children.only` failure and the fix). No `@radix-ui/react-slot` dependency flows through this component or its reused child.
<!-- KLP:NOTES:END -->
