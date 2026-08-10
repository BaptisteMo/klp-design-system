---
title: Header Showup
type: component
status: stable
category: navigation
captureBrand: showup
radixPrimitive: null
sources:
  - .klp/figma-refs/header-showup/spec.json
  - src/components/header-showup/HeaderShowup.tsx
dependencies:
  components: [badges, button, nav-item]
  externals: [class-variance-authority, lucide-react]
  tokenGroups: [colors, radius, spacing, typography]
  brands: [showup]
usedBy: []
created: 2026-08-05
updated: 2026-08-06
---

# Header Showup

The ShowUp application's top navigation bar — a `<header>` wrapping a `<nav>`, with a logo zone, a primary nav-items zone, and a right-hand account/utility zone (source: spec.json:description).

<!-- KLP:INTENT:BEGIN -->

## When to use

The ShowUp product's global top navigation bar — wordmark, primary nav links as nav-item instances with a flush active underline, and a right zone of tools, language and avatar.

**Don't use it for:** Never under klub, atlas or wireframe — those get header-desktop or header-phone. Not a per-page header either; it is the application-level nav that persists across routes.

**Family — `headers`:** header-desktop and header-phone are generic and brand-agnostic. header-showup is the ShowUp top nav only — never used under another brand.

## Don't confuse with

| Component | How to choose |
|---|---|
| `header-desktop` | header-showup is ShowUp only; header-desktop is the brand-agnostic page header. |
| `header-phone` | header-showup is ShowUp only; header-phone is the brand-agnostic phone header. |

<!-- KLP:INTENT:END -->

## Anatomy

```
root (header > nav)                     — 80px tall, w-full, bg-klp-bg-brand-contrasted, justify-between
├── zone-logo (div)                     — flex-1, gap 8, paddingY 6
│   ├── logo-mark (span)                — SLOT: `logo` — consumer-provided wordmark, defaults to plain "SHOWUP" text
│   └── logo-badge (span)               — REUSED: badges (badgeType=info, size=small, badgeStyle=light) — SLOT: `badge`
├── zone-items (nav, aria-label="Main") — HUG width, bottom-aligned (items-end) so the active underline meets the header's own bottom edge
│   └── nav-item (button/a) × N         — REUSED: nav-item, one per `items[]` entry
└── zone-right (div)                    — flex-1, justify-end, gap 16
    ├── action-tools-button (button)    — REUSED: button (variant=tertiary, size=sm, rightIcon=chevron-down)
    ├── (actions slot)                  — SLOT: `actions` — extra content appended after the Tools button
    ├── language-selector (button)      — SLOT: `languageSelector` — consumer-provided, defaults to "NL" + chevron-down
    └── user-avatar (button)            — SLOT: `userSlot` — consumer-provided, defaults to a circular "C" initial
```

**Not rendered** (dead Figma layers, no markup emitted): `hidden-search-icon`, `hidden-secondary-button`, `hidden-notification-group`, `hidden-user-icon` — 4 invisible children of the Right zone in the master Nav component (a search icon, a second Button, a bell-with-dot group, a user icon). Recorded in `spec.json`'s anatomy for traceability only; the component deliberately emits no markup for them (source: spec.json anatomy `hidden-*` entries, `HeaderShowup.tsx` zone-right comment).

## Variants

The Figma master is a plain `COMPONENT`, not a `COMPONENT_SET` — **there is no variant axis** (source: spec.json `variantAxes: {}`, a single captured `variants[0]` with `id: "default"`). The header has one canonical appearance; the nav items it renders and their active/counter state come from the `items` prop, not from a variant matrix.

> ❓ UNVERIFIED: reference screenshot unavailable this session (expired Figma REST token — `screenshotNote` on the single captured variant). Re-run the capture step to populate `.klp/figma-refs/header-showup/default.png`.

## Props usage

Extends `React.HTMLAttributes<HTMLElement>`. All native `<header>` attributes are forwarded via `...props`; the component forwards its ref to the root `<header>`.

| Prop | Class | Type | Default | Description |
|---|---|---|---|---|
| `items` | **required** | `HeaderShowupNavItem[]` | — | Primary navigation entries rendered in the Items zone. |
| `onItemSelect` | optional | `(id: string) => void` | — | Called when a nav item is selected, receiving its id. |
| `logo` | optional | `React.ReactNode` | `"SHOWUP"` text wordmark | Brand wordmark slot. Defaults to a plain "SHOWUP" text wordmark (no vector art reproduced). |
| `badge` | optional | `React.ReactNode` | — | Info badge slot rendered beside the logo. Defaults to a Badge (Type=Info, Size=Small, Style=Light). |
| `languageSelector` | optional | `React.ReactNode` | — | Language selector slot. Defaults to a minimal "NL" trigger button. |
| `userSlot` | optional | `React.ReactNode` | — | User avatar slot. Defaults to a circular initial ("C"). |
| `actions` | optional | `React.ReactNode` | — | Extra content appended after the Tools button in the Right zone. |

### `HeaderShowupNavItem` shape (`items[]` entries)

| Field | Class | Type | Description |
|---|---|---|---|
| `id` | **required** | `string` | Stable identifier, also used as the React key. |
| `label` | **required** | `string` | Item label text. |
| `icon` | optional | `React.ReactNode` | Optional leading icon (lucide-react element). |
| `counter` | optional | `React.ReactNode` | Optional trailing counter badge content. |
| `active` | optional | `boolean` | Marks this item as the current page (renders the active underline). |
| `href` | optional | `string` | When provided, the item renders as an `<a href>` via `nav-item`'s `href` prop. |

## Examples

```tsx
import { Home, Search, Calendar, FileEdit, Activity } from 'lucide-react'
import { HeaderShowup } from './HeaderShowup'

export function HeaderShowupExample() {
  return (
    <HeaderShowup
      items={[
        { id: 'home', label: 'Home', icon: <Home aria-hidden="true" /> },
        { id: 'search', label: 'Search', icon: <Search aria-hidden="true" /> },
        { id: 'calendar', label: 'Calendar', icon: <Calendar aria-hidden="true" /> },
        {
          id: 'my-draft',
          label: 'My draft',
          icon: <FileEdit aria-hidden="true" />,
          counter: 3,
          active: true,
        },
        { id: 'mall-income', label: 'Mall income activity', icon: <Activity aria-hidden="true" /> },
      ]}
      onItemSelect={(id) => {
        // handle navigation, e.g. router.push(`/${id}`)
        void id
      }}
    />
  )
}
```

## Tokens

### `root` layer

| Property | Token | Resolved (showup) |
|---|---|---|
| fill | `--klp-bg-brand-contrasted` | `var(--klp-color-midnight-900)` = `#141B4D` |
| paddingX | — | literal: 40px |
| paddingY | — | literal: 0px |
| itemSpacing | — | literal: 24px |
| height | — | literal: 80px |
| width | — | `w-full` (the Figma 1440px sample is a canvas width, deliberately not implemented as a fixed box) |

### `zone-logo` layer

All properties on this layer are literal — no token bindings captured (source notes: 8px/6px literals match `--klp-size-xs`/`--klp-size-2xs` by value but are not Figma-bound).

| Property | Token | Resolved (showup) |
|---|---|---|
| paddingY | — | literal: 6px |
| itemSpacing | — | literal: 8px |

### `logo-mark` layer (slot default)

| Property | Token | Resolved (showup) |
|---|---|---|
| color | `--klp-fg-on-emphasis` | `var(--klp-color-gray-100)` = `#F7F9F8` |
| font-family | `--klp-font-family-title` | `'Arial', system-ui, sans-serif` |
| height | — | literal: 21px |

> No Figma token bindings were captured on the `logo-mark` instance itself (pure vector artwork) — the table above reflects the default slot rendering's own classes, not a Figma capture. See gap `logo-mark` below.

### `logo-badge` layer

Delegates to the reused [Badge](./_index_badges.md) component (`badgeType="info" size="small" badgeStyle="light"`) — bindings below are what the Figma spec captured on the instance frame.

| Property | Token | Resolved (showup) |
|---|---|---|
| fill | `--klp-bg-info` | `var(--klp-color-blue-100)` = `#EFF6FB` |
| stroke | `--klp-border-invisible` | `var(--klp-color-light-0)` = transparent |
| paddingX | `--klp-size-xs` | `var(--klp-spacing-2)` = 8px |
| paddingY | `--klp-size-2xs` | `var(--klp-spacing-1-5)` = 6px |
| itemSpacing | `--klp-size-2xs` | `var(--klp-spacing-1-5)` = 6px |
| cornerRadius | `--klp-radius-m` | `var(--klp-radius-base)` = 4px |
| label color | `--klp-fg-info-contrasted` | `var(--klp-color-blue-700)` = `#244784` |
| label fontFamily | `--klp-font-family-body` | `'Arial', system-ui, sans-serif` |
| label fontWeight | `--klp-font-weight-body` | `400` |
| icon color | `--klp-fg-info-contrasted` | `var(--klp-color-blue-700)` = `#244784` |

### `zone-items` layer

| Property | Token | Resolved (showup) |
|---|---|---|
| itemSpacing | — | literal: 20px (no exact `--klp-size-*` match confirmed bound in Figma) |

### `nav-item` layer

Delegates entirely to the reused [Nav Item](./_index_nav-item.md) component for its per-layer token bindings (icon, label, counter-badge, active-state underline). Not re-captured here.

### `zone-right` layer

| Property | Token | Resolved (showup) |
|---|---|---|
| itemSpacing | — | literal: 16px (matches `--klp-size-m` = 16px by value, not confirmed bound in Figma) |

### `action-tools-button` layer

Delegates to the reused [Button](./_index_button.md) component (`variant="tertiary" size="sm" rightIcon={<ChevronDown />}`) — bindings below are what the Figma spec captured on the instance frame.

| Property | Token | Resolved (showup) |
|---|---|---|
| fill | `--klp-bg-inset` | `var(--klp-color-night-blue-100)` = `#F3F4FB` |
| stroke | `--klp-border-invisible` | `var(--klp-color-light-0)` = transparent |
| cornerRadius | `--klp-radius-l` | `var(--klp-radius-lg)` = 8px |
| paddingX | `--klp-size-s` | `var(--klp-spacing-3)` = 12px |
| paddingY | `--klp-size-2xs` | `var(--klp-spacing-1-5)` = 6px |
| itemSpacing | `--klp-size-2xs` | `var(--klp-spacing-1-5)` = 6px |
| label color | `--klp-fg-on-emphasis` | `var(--klp-color-gray-100)` = `#F7F9F8` |
| label fontSize | `--klp-font-size-text-small` | `14px` |
| label fontWeight | `--klp-font-weight-label-bold` | `600` |
| label fontFamily | `--klp-font-family-label` | `'Arial', system-ui, sans-serif` |
| rightIcon color | `--klp-fg-on-emphasis` | `var(--klp-color-gray-100)` = `#F7F9F8` |
| rightIcon size | — | literal: 16px |

### `user-avatar` layer (slot default)

| Property | Token | Resolved (showup) |
|---|---|---|
| fill | `--klp-bg-secondary-brand` | `var(--klp-color-gold-500)` = `#BE9360` |
| stroke | `--klp-bg-secondary-brand` | `var(--klp-color-gold-500)` = `#BE9360` (fill re-used as a 1px matching stroke) |
| cornerRadius | — | `rounded-full` (Figma literal 80px, renders as a circle at 32×32) |
| width / height | — | literal: 32px / 32px |
| initials color | `--klp-bg-brand-contrasted` | `var(--klp-color-midnight-900)` = `#141B4D` |
| initials fontSize | — | literal: 24px |

> The Figma initials text color is a raw literal `#141B4D` (no bound variable) that matches the root's `bg/brand-contrasted` hue — mapped onto that alias rather than kept as a raw hex. Now an exact match (see Notes: token contradiction resolved 2026-08-05).

### `language-selector` layer (slot default)

| Property | Token | Resolved (showup) |
|---|---|---|
| stroke | `--klp-fg-on-emphasis` | `var(--klp-color-gray-100)` = `#F7F9F8` |
| cornerRadius | — | literal: 8px |
| label color | `--klp-fg-on-emphasis` | `var(--klp-color-gray-100)` = `#F7F9F8` |
| label fontSize | — | literal: 14px (not bound — unlike `action-tools-button`'s fully token-bound label) |
| label fontWeight | — | literal: 700 |
| trailingIcon color | `--klp-fg-on-emphasis` | `var(--klp-color-gray-100)` = `#F7F9F8` |
| trailingIcon size | — | literal: 16px |

> The flag icon (`Flag/Netherlands` in Figma) has no lucide-react equivalent and is not reproduced in the default slot rendering — pass a full `languageSelector` node to include one. See gap `language-selector` below.

## Accessibility

- **Role**: banner containing nav (source: spec.json a11y.role) — the component renders `<header><nav aria-label="Main">...</nav></header>`.
- **Keyboard support**: `Tab` moves focus between interactive children; `Enter` activates the focused nav item, button, or slot trigger.
- **ARIA notes**: each rendered `nav-item` sets `aria-current="page"` when `active` (see [Nav Item](./_index_nav-item.md) accessibility). The `user-avatar` and `language-selector` default slots render real `<button>` elements with accessible names (`aria-label="Account menu"` on the avatar) rather than decorative `<div>`s, even though the static Figma master renders them without interaction affordances (source: spec.json a11y.notes).

## Dependencies

### klp components

- [Badge](./_index_badges.md) — info badge next to the logo (`badgeType="info" size="small" badgeStyle="light"`).
- [Button](./_index_button.md) — the Tools button (`variant="tertiary" size="sm"`).
- [Nav Item](./_index_nav-item.md) — one instance per `items[]` entry.

### External libraries

- [class-variance-authority](https://www.npmjs.com/package/class-variance-authority) — cva composition for root/zone/slot classes
- [lucide-react](https://www.npmjs.com/package/lucide-react) — `ChevronDown` on the Tools button and the default language-selector slot

### Token groups

- [Colors](../tokens/colors.md)
- [Radius](../tokens/radius.md)
- [Spacing](../tokens/spacing.md)
- [Typography](../tokens/typography.md)

## Used by

*Not yet used by any other klp component.*

## Files

- Source: [`src/components/header-showup/HeaderShowup.tsx`](../../src/components/header-showup/HeaderShowup.tsx)
- Example: [`src/components/header-showup/HeaderShowup.example.tsx`](../../src/components/header-showup/HeaderShowup.example.tsx)
- Playground: [`playground/routes/header-showup.tsx`](../../playground/routes/header-showup.tsx)
- Registry: [`registry/header-showup.json`](../../registry/header-showup.json)
- Figma spec: [`.klp/figma-refs/header-showup/spec.json`](../../.klp/figma-refs/header-showup/spec.json)
- Reference screenshots: [`.klp/figma-refs/header-showup/`](../../.klp/figma-refs/header-showup/)

<!-- KLP:GAPS:BEGIN -->
## DS gaps

| Part | Kind | Reason | Action |
|---|---|---|---|
| logo-mark | new-primitive | No `brand-logo` component exists in `klp-components.json`. The SHOWUP wordmark is pure vector artwork, not tokenizable. | Exposed as a consumer-provided `logo` slot with a minimal default (plain "SHOWUP" text, no inline SVG). |
| user-avatar | new-primitive | No `avatar` component exists yet in `klp-components.json`. | Exposed as a consumer-provided `userSlot` slot with a minimal default (32px circle, bg/stroke `--klp-bg-secondary-brand`, initial "C"). |
| language-selector | new-primitive | No `language-selector` / Select component exists yet in `klp-components.json`. The flag icon is not a lucide-react icon. | Exposed as a consumer-provided `languageSelector` slot with a minimal default (plain button, "NL" label + ChevronDown trailing icon, no flag). |
<!-- KLP:GAPS:END -->

<!-- KLP:NOTES:BEGIN -->
## Notes

All three `new-primitive` gaps above are deliberate product decisions, not oversights: `logo`, `languageSelector`, and `userSlot` are permanent consumer-provided slots (brand wordmark, i18n control, account menu are product-specific — a design system shouldn't own them), each shipping a minimal, non-empty default so the header renders sensibly out of the box.

### Hidden Right-zone children

Four children of the Figma Right zone (`search` icon, a second `Button`, a `Group 1713` bell-with-dot, a `user` icon) are invisible in the master instance and intentionally emit no markup — see the Anatomy section. Pass the `actions` slot if a consumer needs to reintroduce equivalent functionality (e.g. a search trigger or notifications).

### Validator status

`node scripts/validate-tokens.mjs header-showup` passes with 0 mismatches.

### 2026-08-05 — root-fill contradiction resolved

The prior `⚠️ CONTRADICTION` on the `root` layer's fill (Figma capture `#141B4D` vs. resolved `--klp-bg-brand-contrasted` = `#202A64`) has been checked and resolved: a live comparison of all 124 alias × brand pairs between Figma and the repo found 122 exact matches; the two mismatches were stale entries in `.klp/tokens.json` dated 2026-04-16, now corrected and re-synced —
- `bg-brand-contrasted` / showup: `midnight-800` → `midnight-900`
- `bg-secondary-brand-contrasted` / atlas: `fuchsia-800` → `fuchsia-700`

`--klp-bg-brand-contrasted` now resolves to `#141B4D` under `showup`, an exact match to the Figma capture. Verified in the browser: the rendered header background is `#141B4D`. The root `fill` row and the `user-avatar` slot's `initials color` row above are updated accordingly.

`.klp/tokens.json` is now a **partially re-captured** file: the two corrected color entries above, plus the new `nav-item` `--klp-alpha-10` alias, are live-verified as of 2026-08-05; the rest of the file is still the 2026-04-16 capture. See `docs/tokens/_index_tokens.md` for the standing note on this drift.

### 2026-08-06 — `nav-item`'s `asChild` removed, `href` added (runtime crash fix)

[Nav Item](./_index_nav-item.md) previously exposed Radix `asChild` for rendering as an `<a href>`; that path crashed at runtime (`React.Children.only`, verified in a browser probe — see Nav Item's own Notes for the full account). `asChild` is now removed and replaced by a plain `href` prop. This component's `items[].href` field (see Props usage table above) forwards unchanged onto `nav-item`'s new `href` prop — no API change on `HeaderShowup` itself, only the description text was corrected (it previously said "via `nav-item`'s `asChild`/Slot pattern"). Verified in the browser: nav items with an `href` in the `items[]` array render as real `<a>` elements with icon, label, and counter intact; items without `href` still render as `<button>`. No dependency change — `header-showup` never imported `@radix-ui/react-slot` directly.
<!-- KLP:NOTES:END -->
