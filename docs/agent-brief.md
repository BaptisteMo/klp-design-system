---
title: klp-ui — agent brief
type: agent-context
generated-at: 2026-04-21T13:39:44.931Z
schema-version: 0.1.0
---

# klp-ui agent brief

Condensed reference for design agents. Read this first before any design task; drill into `docs/components/_index_<name>.md` for specifics.

## Inventory (26 components)

### containers
- **header-phone** (1 variants) — Mobile phone header bar with a top row (hamburger menu button, brand logo, notification button with dot indicator) and a second row (page title + search button), followed by a breadcrumb trail. Single variant — no variant axes.

### data-display
- **badges** (48 variants) — Status indicator pill with optional leading/trailing icons. Supports 9 semantic types (Primary, Secondary, Tertiary, Success, Info, Warning, Danger, onEmphasis, Outlined), 3 sizes (Small, Medium, Large) and 2 styles (Bordered, Light). Outlined and onEmphasis only exist in Light style.
- **data-table** (1 variants) — Generic data-driven table built on @tanstack/react-table. Accepts columns[] + data and renders sort + pagination + custom cells. Uses <Table> primitives internally.
- **table** (3 variants) — Compound HTML primitives (Table.Root/Header/Body/Row/Head/Cell/Caption) with klp styling. Low-level building blocks for custom tables.

### disclosure
- **collapsible** (2 variants) — Expandable disclosure panel with a header (icon + title + chevron toggle button) and a collapsible content area. Single variant axis: open/close state.

### feedback
- **floating-alert** (12 variants) — A floating alert banner with a state-colored icon highlight, body text, and a dismiss button. Four severity states (Danger, Warning, Information, Success) in three sizes (Small, Medium, Large).
- **in-content-alert** (12 variants) — Inline alert banner with a semantic content type (Info, Success, Danger, Warning) and three sizes. Displays a title with matching icon and an optional body text below.

### inputs
- **button** (20 variants) — Interactive button component with 5 type variants (primary, secondary, tertiary, destructive, validation), 4 sizes (sm, md, lg, icon), and 4 interaction states (rest, hover, clicked, disable). Supports optional left/right icon slots.
- **checkbox** (5 variants) — A toggle control that supports unchecked (Rest), hover, checked (Clicked), indeterminate (Mixed), and disabled states. Single variant axis: State.
- **input** (18 variants) — Text input field with label, optional icons (search/action), and helper text. Supports three sizes (large, medium, small) and six states (default, filled, focused, success, danger, disable).
- **radio** (4 variants) — Radio button control with four interaction states: rest (unchecked default), hover (unchecked hovered), clicked (checked/selected), and disable. No size axis — single size only.
- **switch** (2 variants) — Toggle switch with two states: on (checked) and off (unchecked). Uses animated thumb with icon indicator. Backed by Radix Switch primitive for full a11y and keyboard support.
- **text-area** (12 variants) — Multi-line text input with optional rich-text formatting toolbar. Two feature variants: Simple (plain textarea) and Rich text (with formatting toolbar and action bar). Supports Default, Focus, Filled, Danger, Success, and Disable states.

### list
- **list-content** (9 variants) — A list row with a decorative icon on the left, label + sublabel text block, and an optional tertiary icon-button action on the right. Three sizes (Small, Medium, Large) and three interaction states (Default, Hover, Active).

### lists
- **action-sheet-menu** (3 variants) — A contextual menu panel composed of grouped ActionSheet_Item rows, optional section titles, and separator lines. Supports three layout types: Default (icon + label + secondary icon), Checkbox (checkbox row layout), and Flat (icon + label + secondary icon, no section headers).
- **list** (3 variants) — A vertical list container with header, optional action button, and repeated List_content rows. Supports Condensed (tight spacing), Default (medium spacing), and withInputs (with filter inputs in the header) layout styles.

### navigation
- **breadcrumbs** (4 variants) — Horizontal breadcrumb trail showing navigation hierarchy. A single axis (Steps) controls how many ancestor steps are shown before the current (active) step. The first step always shows a home icon. Intermediate steps use fg/muted with a chevron-right separator. The last (current) step uses fg/default with a chevron-down dropdown affordance.
- **header-desktop** (2 variants) — Desktop page header with a title, breadcrumb trail, and contextual action row. Two feature variants: Default (icon-only tertiary action buttons + a primary secondary button) and Search active (title + a small search input replacing the action row).
- **item-side-bar** (6 variants) — A sidebar navigation item with an icon, label, and optional collapsible content panel. Two feature axes: Collapsible (shows chevron affordance and expands an ActionSheet content area) and Static (no chevron, no content panel). Three states: Rest, Hover, Active.
- **pagination** (1 variants) — Standalone page navigator with ellipsis algorithm. Reusable outside tables.
- **sidebar** (2 variants) — Vertical navigation sidebar with a branded header (logo + notification button), a location/context switcher, a scrollable menu of item-side-bar instances, and a user profile footer. Two device variants: Desktop (247px wide, 640px tall) and Phone (320px wide, 568px tall — wider with a close/dismiss button replacing the notification affordance).
- **tabulation-cells** (2 variants) — A single tab cell used within a tabulation bar. Renders a label and an optional badge count. State=Rest shows a neutral transparent background; State=Active shows the selected tab with brand-low fill, bold label, and brand-accented badge.
- **tabulations** (1 variants) — Horizontal tab bar container that wraps Tabulation_Cells instances separated by vertical line dividers. Scroll type=None (fixed layout). Delegates cell selection state (active/rest) to the tabulation-cells sub-component via a MutationObserver bridge. Backed by @radix-ui/react-tabs for full a11y keyboard navigation.

### overlay
- **tooltip** (4 variants) — Contextual tooltip bubble with a directional arrow. Variant axis controls arrow placement (bottom-left, bottom-right, top-left, top-right). Backed by @radix-ui/react-tooltip for a11y and keyboard support.

### overlays
- **action-sheet-item** (21 variants) — A single row item for action sheets. Supports icon slots on both sides, an optional description label, and seven semantic states (Default, Hover, Active, Emphased, Disabled, Destructive, Creation) across three sizes.

### utilities
- **brand-provider** (1 variants) — Applies a chosen brand to document.documentElement so CSS alias tokens switch. No visual layers.

## Token aliases (use these; never raw `--klp-color-*`)

- **bg:** `bg-klp-bg-brand`, `bg-klp-bg-brand-contrasted`, `bg-klp-bg-brand-low`, `bg-klp-bg-danger`, `bg-klp-bg-danger-contrasted`, `bg-klp-bg-danger-emphasis`, `bg-klp-bg-decorative-orange`, `bg-klp-bg-default`, … (14 more)
- **fg:** `text-klp-fg-brand`, `text-klp-fg-brand-contrasted`, `text-klp-fg-danger`, `text-klp-fg-danger-contrasted`, `text-klp-fg-default`, `text-klp-fg-disable`, `text-klp-fg-info`, `text-klp-fg-info-contrasted`, … (9 more)
- **border:** `border-klp-border-brand`, `border-klp-border-brand-contrasted`, `border-klp-border-brand-emphasis`, `border-klp-border-contrasted`, `border-klp-border-danger`, `border-klp-border-danger-contrasted`, `border-klp-border-danger-emphasis`, `border-klp-border-default`, … (15 more)
- **radius:** `rounded-klp-l`, `rounded-klp-m`, `rounded-klp-round`, `rounded-klp-xl`
- **size:** `gap-klp-size-2xl`, `gap-klp-size-2xs`, `gap-klp-size-3xl`, `gap-klp-size-3xs`, `gap-klp-size-4xs`, `gap-klp-size-l`, `gap-klp-size-m`, `gap-klp-size-s`, … (3 more)
- **font:** `font-klp-family-body`, `font-klp-family-label`, `font-klp-family-title`, `font-klp-size-heading-h1`, `font-klp-size-heading-h2`, `font-klp-size-heading-h3`, `font-klp-size-heading-h4`, `font-klp-size-text-large`, … (8 more)

## Brand

Brand is set in `src/App.tsx` via `<BrandProvider brand="…">`. For brand-specific guidance consult `docs/brands/<active-brand>.md`.

## Composition rules (hard)

- Always `cn()` — never string concat.
- Import DS components via `@/components/ui/<name>` (exception: `@/components/brand-provider`).
- No inline SVG — use `lucide-react`.
- No hex colors, no `--klp-color-*` primitive refs.
- Do not import `@radix-ui/*` directly in mockups — DS already wraps them.
- Never hardcode a prop classified `computed` — read the component's Props usage table before calling it. `persistent` props may be passed when a user-owned state applies (current page, selected row).

## DS gap log

See `docs/ds-gaps.md` (initially empty in consumer; pipeline appends).

## Computed & persistent props (appendix)

Derived from every component's `Props` interface `@propClass` tags. Computed = do NOT pass. Persistent = pass when relevant.

| Component | Prop | Class | Description |
|---|---|---|---|
| `action-sheet-item` | `state` | **persistent** |  |
| `input` | `state` | **computed** | Explicit visual state override. When omitted the component derives state from native HTML attributes (disabled, aria-inv |
| `item-side-bar` | `state` | **persistent** | Interaction state — drives trigger fill and icon-container border. Represents the currently-selected navigation item. |
| `list-content` | `state` | **persistent** | Interaction state — controls background fill and text/icon color. Represents the selected row in the list. |
| `text-area` | `state` | **computed** | Explicit visual state override. When omitted, state is derived from native attributes (disabled, aria-invalid) and from  |
