# SideBar — opinionated menu tree

**Date:** 2026-04-22
**Status:** Design approved, pending implementation plan
**Component:** `sidebar`

## Context

The current `SideBar` exposes a generic `menuItems: SideBarMenuItem[]` prop so consumers can inject any navigation tree. In practice the target application has a fixed information architecture and every consumer would pass the same tree. We move the tree inside the component and drop the prop. If the tree evolves, the edit happens in the DS, not per-page.

## Decisions

1. **Tree lives in the DS.** Hardcoded as a typed `as const` in `src/components/sidebar/menu.ts`. No runtime override.
2. **API is breaking.** `menuItems` is removed. No deprecation shim — component currently has no external consumers beyond the example and playground.
3. **Active state is controlled by two keys.** `activeKey` (top-level) + `activeChildKey` (sub-row). The component derives the visual state of every row from these two props.
4. **Router-agnostic.** Single `onNavigate(key, parentKey?)` callback on leaf clicks. Consumer wires to whichever router.
5. **Sub-rows use `ActionSheetItem`.** Matches the existing Figma spec (`composition.reuses` already includes `action-sheet-item` via `item-side-bar`). Sub-rows have no icons.
6. **Parent expansion is independent.** Clicking a collapsible parent toggles its panel and does *not* fire `onNavigate`. Multiple parents may be open simultaneously.

## Menu tree

Eleven top-level rows, four collapsible. Icon names are lucide-react identifiers.

| Key | Label | Icon | Children |
|---|---|---|---|
| `admin` | Admin | `ShieldAlert` | tools, feature-configuration, application-configuration, mall-store-configuration, accounts-management |
| `annual-turnover-declaration` | Annual Turnover declaration | `CalendarDays` | — |
| `my-shopping-center` | My Shopping center | `Store` | newsfeed, deal, events |
| `my-documents` | My documents | `FolderOpen` | — |
| `turnover-declaration` | Turnover declaration | `ChartLine` | — |
| `my-contacts` | My contacts | `ContactRound` | — |
| `access-request` | Access request | `DoorOpen` | — |
| `gestion-des-applications` | Gestion des applications | `Settings` | user-management, shopping-center-management |
| `tenant-coordination` | Tenant coordination | `Handshake` | handover, opening, hand-back |
| `customer-excellence` | Customer excellence | `Sparkles` | daily-customer-tour, customer-visit, ace, opening-track |
| `ressources` | Ressources | `FileQuestionMark` | — |

Sub-item keys are kebab-cased labels. Labels are kept verbatim (including mixed FR/EN).

## Props

```ts
interface SideBarProps extends React.HTMLAttributes<HTMLElement> {
  /** @propClass optional */ device?: 'desktop' | 'phone'
  /** @propClass optional */ logo?: React.ReactNode
  /** @propClass optional */ contextLabel?: string
  /** @propClass optional */ avatar?: React.ReactNode | string
  /** @propClass optional */ userName?: string
  /** @propClass persistent */ activeKey?: string
  /** @propClass persistent */ activeChildKey?: string
  /** @propClass optional */ onNavigate?: (key: string, parentKey?: string) => void
  /** @propClass optional */ onNotificationClick?: React.MouseEventHandler<HTMLButtonElement>
  /** @propClass optional */ onContextSwitcherClick?: React.MouseEventHandler<HTMLDivElement>
}
```

`menuItems` is removed. `SideBarMenuItem` type is removed from the public surface and replaced by internal `SidebarTopItem` / `SidebarChildItem` types in `menu.ts`.

## Rendering rules

- Top row **with children** → `ItemSideBar feature="collapsible"`. `state="active"` iff `activeKey === key`. `defaultOpen` = `activeKey === key`. Click on the trigger toggles the panel, does not fire `onNavigate`.
- Top row **without children** → `ItemSideBar feature="static"`. `state="active"` iff `activeKey === key`. Click fires `onNavigate(key)`.
- Sub-row → `ActionSheetItem`. `state="active"` iff `activeKey === parent.key && activeChildKey === child.key`, else `state="default"`. Click fires `onNavigate(child.key, parent.key)`.

### Edge cases

- `activeKey` not matching any row → no highlight, no auto-expansion. Silent.
- `activeChildKey` without matching `activeKey` → ignored. Child highlight requires parent match.
- Parents expanded by the user stay independent — no accordion behavior.
- `onNavigate` omitted → leaf clicks are silent no-ops; parents still expand.
- Phone device reuses the exact same tree; notification dot remains hidden per the existing rule.

## Files

**Modified**
- `src/components/sidebar/SideBar.tsx` — drop `menuItems`, add the three new props, render tree internally.
- `src/components/sidebar/index.ts` — re-export `SIDEBAR_MENU` and the new types.
- `src/components/sidebar/SideBar.example.tsx` — showcase `activeKey` + `activeChildKey`.
- `playground/routes/sidebar.tsx` — matrix covering default / active leaf / active child / phone.

**New**
- `src/components/sidebar/menu.ts` — typed `SIDEBAR_MENU` const, icon imports, `SidebarTopItem` + `SidebarChildItem` types.

**Untouched**
- `.klp/figma-refs/sidebar/spec.json` — anatomy unchanged; validator still passes.
- `klp-components.json` — regenerated by `documentalist`, dependency edges unchanged.

## Validation

- `node scripts/validate-tokens.mjs sidebar` → expect pass (no token changes).
- Playground manual matrix — 4 routes listed above.
- `documentalist` regenerates `docs/components/_index_sidebar.md` — props table shrinks, dependency graph untouched.

## Non-goals

- No accordion / single-open behavior.
- No routing abstraction (`href`, `Link` wrapper) — consumer owns it.
- No icon on sub-rows — tree does not specify any.
- No i18n layer — labels are literal strings in the tree. Future work if needed.
