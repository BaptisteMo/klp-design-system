# HeaderDesktop composition API — Design Spec

## Context

`HeaderDesktop` is the klp desktop-app header: optional breadcrumbs row + title row with either action buttons (default feature) or a search input (search-active feature). The component currently hardcodes:
- **4 tertiary icon buttons** (Check / Search / PenLine / FolderPlus) with a single `onActionClick(action)` discriminated handler.
- **1 secondary "New" button** with a FolderPlus right-icon and a dedicated `onNewClick`.
- **Breadcrumbs always rendered**, defaulting to `[{label:'Home'}, {label:'Current page'}]` when no `breadcrumbSteps` is supplied.

After consumer-project usage, the hardcoded shape blocks real scenarios: different action counts, different variant mixes (e.g. breadcrumbs off + 1 secondary + 2 tertiary + 1 icon), different icons. This spec replaces the hardcoded actions block with a typed composition API while keeping the component opinionated enough to stay DS-consistent.

Scope: `HeaderDesktop` only. `HeaderPhone` is out of scope in this iteration — if the same pattern is useful there, a follow-up spec applies.

## Approach

Replace the 5 hardcoded buttons + `onActionClick` + `onNewClick` with a single `actions?: Action[]` prop, where `Action` is a subset of `ButtonProps`. Keep the existing `features: 'default' | 'search-active'` axis as the mode selector: `default` renders `actions`, `search-active` renders the search input. Collapse `breadcrumbSteps` into `breadcrumbs?: BreadCrumbStep[] | false`; omission = hidden.

No new cva variants. No new Radix primitive. No new token. Behavior is fully expressed through the typed props.

## Props API

```ts
import type { BreadCrumbStep } from '@/components/breadcrumbs'

export type Action = {
  variant?: 'primary' | 'secondary' | 'tertiary' | 'destructive' | 'validation'
  size?: 'sm' | 'md' | 'lg' | 'icon'
  /** Label (sm/md/lg) or icon node (size='icon'). */
  children: React.ReactNode
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
  onClick?: () => void
  /** Required when size='icon' (no visible label) — enforced by documentation, not types. */
  'aria-label'?: string
  key?: string
}

export interface HeaderDesktopProps {
  /** Page title. @propClass optional */
  title?: string

  /** Mode selector. 'default' renders actions; 'search-active' renders the search input. @propClass optional */
  features?: 'default' | 'search-active'

  /** Action buttons rendered left-to-right in the title row when features='default'. Ignored when features='search-active'. @propClass optional */
  actions?: Action[]

  /** Breadcrumbs. Omit or pass false to hide. @propClass optional */
  breadcrumbs?: BreadCrumbStep[] | false

  /** Placeholder for the search input. Only used when features='search-active'. @propClass optional */
  searchPlaceholder?: string

  /** Fired on every search input change. Only used when features='search-active'. @propClass optional */
  onSearchChange?: (value: string) => void

  /** Root className. @propClass optional */
  className?: string
}
```

### Defaults

- `title`: `'Page title'`
- `features`: `'default'`
- `actions`: `undefined` → empty action row
- `breadcrumbs`: `undefined` → breadcrumbs row not rendered
- `searchPlaceholder`: `'Search…'`

### Removed props (breaking change)

- `breadcrumbSteps` → fold into `breadcrumbs`.
- `onActionClick` → each `Action` now owns its `onClick`.
- `onNewClick` → pass a `LabelAction` in `actions` with `onClick`.

### Rendering rules

- `features='default'`: render `actions.map(a => <Button {...a} />)` left-aligned in the title-action row. Use `a.key ?? index` as the React key.
- `features='search-active'`: render the existing search input block; pass `searchPlaceholder` and `onSearchChange`. Actions are not rendered.
- `breadcrumbs === false` or `breadcrumbs == null`: breadcrumbs row is not rendered. Otherwise render `<BreadCrumbs steps={breadcrumbs} showDropdownAffordance />`.
- Button rendering: the existing `<Button variant=… size=… leftIcon=… rightIcon=… onClick=…>{children}</Button>` composition. No wrapper, no decoration.

### Usage examples

Default mode with mixed actions + breadcrumbs:

```tsx
<HeaderDesktop
  title="Turnover Collection"
  actions={[
    { variant: 'tertiary', size: 'icon', children: <Check/>, 'aria-label': 'Validate' },
    { variant: 'tertiary', size: 'icon', children: <Search/>, 'aria-label': 'Search' },
    { variant: 'secondary', size: 'md', children: 'New', rightIcon: <FilePlus/> },
  ]}
  breadcrumbs={[{ label: 'Home' }, { label: 'Turnover Collection' }]}
/>
```

Search mode:

```tsx
<HeaderDesktop
  features="search-active"
  title="Turnover Collection"
  searchPlaceholder="Input placeholder texte custom"
  breadcrumbs={[{ label: 'Home' }, { label: 'Turnover Collection' }]}
/>
```

Header with no breadcrumbs, no actions:

```tsx
<HeaderDesktop title="Dashboard" />
```

## Files modified

- `src/components/header-desktop/HeaderDesktop.tsx` — update the `HeaderDesktopProps` interface, remove hardcoded Button JSX, implement the `actions` map. Update JSDoc `@propClass` tags.
- `src/components/header-desktop/HeaderDesktop.example.tsx` — regenerate with the three representative examples above.
- `playground/routes/header-desktop.tsx` — render a matrix that exercises the new props (2-3 presets covering icon-only actions, mixed variants, no-breadcrumbs, search mode).
- `.klp/figma-refs/header-desktop/spec.json` — unchanged. The Figma variantAxes (`features: default|search-active`) still hold; actions/breadcrumbs customisation is a consumer-facing prop API choice, not a Figma variant.
- `docs/components/_index_header-desktop.md` — regenerated by the documentalist (picks up new Props usage table, no `**computed**` / `**persistent**` rows so no Do/Don't block).
- `klp-components.json` — props map rewritten by the documentalist.

## Accessibility

- When `size='icon'`, the action has no visible label. The documentation MUST instruct consumers to pass `aria-label`. Typescript does not enforce this (all props are optional to keep the type flat); the `## Props usage` Do/Don't block and the example file encode the convention.
- Button internal a11y (keyboard focus, disabled semantics) is inherited from `@/components/button` — no new behavior added here.

## Validation

- **Typecheck**: `pnpm exec tsc --noEmit` after the refactor. Expected: no errors. The existing call sites in `playground/routes/header-desktop.tsx` and `HeaderDesktop.example.tsx` will fail initially because of removed props — that is the expected breaking change; both files are rewritten as part of this spec.
- **Token validator**: `node scripts/validate-tokens.mjs header-desktop` — expected `passed: true`. No new tokens introduced.
- **Doc-rules validator**: `node .claude/skills/klp-doc-rules-validator/scripts/validate-doc-rules.mjs header-desktop --fix` — expected `passed: true`. No `computed`/`persistent` props, so no Do/Don't block. No cva `state` axis + no state prop, so no Class B blockquote.
- **Playground**: `pnpm dev` + open `http://localhost:5173/header-desktop`. Manually verify: (a) the 3 presets above render correctly, (b) icon-only buttons center the icon, (c) primary / secondary / tertiary buttons size as expected, (d) breadcrumbs row hidden when the prop is omitted.

## Migration

Internal call sites in this repo:
- `HeaderDesktop.example.tsx` — rewrite with the new API.
- `playground/routes/header-desktop.tsx` — rewrite to cover the matrix.

No consumer-facing migration script: downstream apps that adopted the component recently must rewrite their single call site by hand. Count is small (≤ 2 call sites known across the consumer project). The component's doc page (regenerated by the documentalist) carries the new API; `klp-ui update` ships the doc and source atomically.

## Non-goals

- No change to `HeaderPhone`. A follow-up spec can apply the same `actions` pattern there.
- No compound-component / slot pattern (`<HeaderDesktop.Action>`). Typed array stays the single source of truth for action configuration.
- No cap on `actions.length`. The doc notes "beyond 6 visible actions, consider a collapsed "More" menu" but does not enforce.
- No automatic `aria-label` inference from an icon's displayName — consumer owns accessibility strings.
- No change to `BreadCrumbs` API.
- No new token.
- No internationalisation hooks beyond what Button already provides.
