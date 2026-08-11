---
title: Spacing tokens
type: token-group
group: spacing
updated: 2026-08-10
---

# Spacing tokens

`--klp-size-*` aliases. Identical across all 4 brands (no per-brand spacing override).

| Alias | Primitive | Resolved |
|---|---|---|
| `--klp-size-4xs` | `--klp-spacing-0-5` | 2px |
| `--klp-size-3xs` | `--klp-spacing-1` | 4px |
| `--klp-size-2xs` | `--klp-spacing-1-5` | 6px |
| `--klp-size-xs` | `--klp-spacing-2` | 8px |
| `--klp-size-s` | `--klp-spacing-3` | 12px |
| `--klp-size-m` | `--klp-spacing-4` | 16px |
| `--klp-size-l` | `--klp-spacing-6` | 24px |
| `--klp-size-xl` | `--klp-spacing-8` | 32px |
| `--klp-size-2xl` | `--klp-spacing-12` | 48px |
| `--klp-size-3xl` | `--klp-spacing-16` | 64px |

> ⚠️ Atlas overrides `--klp-default-text` to `--klp-spacing-4` (16px) instead of `--klp-spacing-3-5` (14px) used by other brands. This token is consumed implicitly via the default Tailwind text size — components don't reference it directly.

## Tailwind utilities

| Property | Utility | Example |
|---|---|---|
| Padding | `p-klp-size-*` `px-klp-size-*` `py-klp-size-*` | `px-klp-size-m` |
| Margin | `m-klp-size-*` `mx-klp-size-*` `my-klp-size-*` | `mt-klp-size-l` |
| Gap | `gap-klp-size-*` | `gap-klp-size-2xs` |
| Width | `w-klp-size-*` | `w-klp-size-xl` |
| Height | `h-klp-size-*` | `h-klp-size-m` |

## Used by

- [Button](../components/_index_button.md) — `px-klp-size-{s,m,l}`, `py-klp-size-{2xs,xs,s}`, `gap-klp-size-2xs`, `p-klp-size-xs` (icon size).
- [Checkbox](../components/_index_checkbox.md) — `p-klp-size-3xs` (4px padding on all sides of root).
- [Radio](../components/_index_radio.md) — `p-klp-size-3xs` (unchecked states), `p-klp-size-2xs` (checked state), `size-round` (full corner radius), `gap-klp-size-xs` (RadioGroup column gap).
- [Switch](../components/_index_switch.md) — `size-round` (9999px corner radius on root and thumb).
- [Tooltip](../components/_index_tooltip.md) — `p-klp-size-xs` (8px padding on root layer).
- [Badge](../components/_index_badges.md) — `px-klp-size-xs`, `py-klp-size-2xs`, `gap-klp-size-2xs` (small); `px-klp-size-m`, `py-klp-size-xs`, `gap-klp-size-2xs` (medium); `px-klp-size-l`, `py-klp-size-s`, `gap-klp-size-xs` (large).
- [Input](../components/_index_input.md) — `gap-klp-size-xs` (root and head gap); `px-klp-size-m py-klp-size-m gap-klp-size-s` (large input-box); `px-klp-size-s py-klp-size-s gap-klp-size-s` (medium input-box); `px-klp-size-xs py-klp-size-xs gap-klp-size-xs` (small input-box).
- [List Content](../components/_index_list-content.md) — `p-klp-size-xs` (small root and action-button padding); `pt-klp-size-s pb-klp-size-s pl-klp-size-xs pr-klp-size-xs` (medium root); `pt-klp-size-m pb-klp-size-m pl-klp-size-s pr-klp-size-s` (large root); `gap-klp-size-xs` / `gap-klp-size-s` / `gap-klp-size-m` (root itemSpacing per size).
- [ActionSheet Item](../components/_index_action-sheet-item.md) — `px-klp-size-m py-klp-size-m gap-klp-size-s` (lg root); `px-klp-size-s py-klp-size-s gap-klp-size-xs` (md root); `px-klp-size-xs py-klp-size-xs gap-klp-size-xs` (sm root).
- [Floating Alert](../components/_index_floating-alert.md) — `px-klp-size-xs py-klp-size-xs gap-klp-size-xs` (sm root); `px-klp-size-m py-klp-size-m gap-klp-size-s` (md root); `px-klp-size-l py-klp-size-l gap-klp-size-m` (lg root); `px-klp-size-xs py-klp-size-xs` (dismiss-button padding).
- [InContent Alert](../components/_index_in-content-alert.md) — `px-klp-size-m py-klp-size-m gap-klp-size-xs` (lg root); `px-klp-size-s py-klp-size-s gap-klp-size-xs` (md root); `px-klp-size-xs py-klp-size-xs gap-klp-size-xs` (sm root); `gap-[8px]` (header item spacing literal).
- [Tabulation Cells](../components/_index_tabulation-cells.md) — `px-klp-size-xs` and `py-klp-size-2xs` on badge padding; root padding and gap are CSS literals (12px, 6px, 8px) pending token assignment.
- [Tabulations](../components/_index_tabulations.md) — `size-xs` and `size-2xs` on cell-badge padding; root padding (2px), root gap (4px), cell-root padding (12px/6px), and cell-root gap (8px) are CSS literals pending token assignment (candidates: `--klp-size-4xs`, `--klp-size-3xs`, `--klp-size-s`, `--klp-size-2xs`, `--klp-size-xs`).
- [Text Area](../components/_index_text-area.md) — `gap-klp-size-m` (root gap, input inner gap), `gap-klp-size-xs` (head gap, toolbar gap, action-bar gap), `pt/pr/pb/pl-klp-size-m` (input padding).
- [Table (primitives)](../components/_index_table.md) — `pt-klp-size-s pb-klp-size-s pl-klp-size-s pr-klp-size-s` (head cell padding); `pt-klp-size-m pb-klp-size-m pl-klp-size-s pr-klp-size-s` (data cell padding); `pt-klp-size-s pb-klp-size-s` (caption padding).
- [Pagination](../components/_index_pagination.md) — `gap-klp-size-xs` (nav gap), `mr-klp-size-s` (label margin), `px-klp-size-xs` (dots padding).
- [Data Table](../components/_index_data-table.md) — `gap-klp-size-m` (container column gap), `py-klp-size-2xl` (empty-state cell padding).
- [Item Side Bar](../components/_index_item-side-bar.md) — `px-klp-size-xs py-klp-size-xs` (trigger padding); `p-klp-size-4xs` (decorative-icon padding); `p-klp-size-xs` (content panel padding); `gap-klp-size-xs` (trigger row gap).
- [Header Desktop](../components/_index_header-desktop.md) — `px-klp-size-s py-klp-size-xs` (tertiary button padding); `px-klp-size-m py-klp-size-xs gap-klp-size-2xs` (secondary button padding/gap); `px-klp-size-xs py-klp-size-xs gap-klp-size-m` (search-input padding/gap).
- [File Dropped](../components/_index_file-dropped.md) — `px-klp-size-m py-klp-size-m gap-klp-size-l` (root padding/gap); `p-klp-size-xs` (icon-highlight padding); root `cornerRadius`/paddingX/paddingY/itemSpacing and icon-highlight `cornerRadius`/padding/itemSpacing/40px width-height are literals snapped onto these aliases by exact value match (see gaps).
- [Header Phone](../components/_index_header-phone.md) — `p-klp-size-xs` (padding on menu-button, notification-btn, and search-button layers via `--klp-size-xs`).
- [SideBar](../components/_index_sidebar.md) — `p-klp-size-xs` (notification-button padding via `--klp-size-xs`).
- [Collapsible](../components/_index_collapsible.md) — `px-klp-size-m py-klp-size-m gap-klp-size-m` (close root padding/gap); `px-klp-size-m py-klp-size-m` (open header padding); `px-klp-size-m py-klp-size-l gap-klp-size-m` (open content padding/gap); `p-klp-size-xs` (toggle-button padding).
- [Modal Variation](../components/_index_modal-variation.md) — `--klp-size-m` (button paddingX), `--klp-size-xs` (button paddingY), `--klp-size-2xs` (button itemSpacing) across button-option, button-secondary, and button-primary layers.
- [Input Multiselect](../components/_index_input-multiselect.md) — `gap-klp-size-xs` (root, chips-row, input-box, dropdown gaps); `gap-klp-size-m` (trigger gap); `p-klp-size-4xs` (trigger-info-icon and input-box padding); `px-klp-size-xs py-klp-size-2xs` (chip padding); `px-klp-size-xs py-klp-size-xs` (dropdown padding).
- [Calendar Button](../components/_index_calendar-button.md) — `px-klp-size-s py-klp-size-2xs gap-klp-size-2xs` (root padding/gap) across all 5 state variants.
- [Calendar](../components/_index_calendar.md) — `px-klp-size-m py-klp-size-m` (root padding); `px-klp-size-xs py-klp-size-xs` (nav-button padding); `--klp-size-m` (footer-input itemSpacing).
- [Separator](../components/_index_separator.md) — `pt/pb-klp-size-{xs,m,l}` (horizontal margin padding); `pl/pr-klp-size-{xs,m,l}` (vertical margin padding); `margin=none` uses no token.
- [Nav Item](../components/_index_nav-item.md) — `gap-klp-size-3xs` (content itemSpacing); `paddingY 25px` literal captured but not applied — see the fixed-height implementation note in Notes.
- [Header Showup](../components/_index_header-showup.md) — `--klp-size-xs`/`--klp-size-2xs` (logo-badge padding/gap, via Badge); `--klp-size-s`/`--klp-size-2xs` (action-tools-button padding/gap, via Button); root paddingX (40px), root/zone-items/zone-right itemSpacing (24px/20px/16px) are literals pending token assignment.
- [Navbar Item](../components/_index_navbar-item.md) — `--klp-size-4xs` (root paddingY/itemSpacing, icon padding) across all three states.
- [Sidebar (Atlas)](../components/_index_sidebar-atlas.md) — root paddingY (24px) and itemSpacing (16px) are literals pending token assignment.
- [InputFile](../components/_index_input-file.md) — root paddingX/paddingY (16px/8px) are literals pending token assignment; root itemSpacing is 8px on drop-zone (`gap-klp-size-xs`, corrected from a stale 24px capture) and 24px on simple (`gap-klp-size-l`).
- [DataField](../components/_index_data-field.md) — `gap-klp-size-xs` (root label↔value gap).

<!-- KLP:NOTES:BEGIN -->
## Notes
<!-- KLP:NOTES:END -->
