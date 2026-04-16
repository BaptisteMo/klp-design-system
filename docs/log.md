# Documentalist log

Append-only. Never delete entries.

## [2026-04-16] BOOTSTRAP | docs tree initialized
Created `docs/`, `docs/components/`, `docs/tokens/`, `docs/brands/` with skeletons. 4 brand pages seeded from `aliases.css` (wireframe, klub, atlas, showup). 4 token-group pages seeded from `theme.css` (colors, spacing, radius, typography).

## [2026-04-16] DOCUMENT | button — 20 variants, 4 dependencies (0 components, 4 token groups, 1 brand), 0 usedBy
Generated `docs/components/_index_button.md`. Updated `klp-components.json` to canonical schema (added `doc` field, set `captureBrand: atlas`, populated `dependencies` and `variantCount`). Reverse-index pass: 1 component scanned, no inbound edges (Button is a leaf).

## [2026-04-16] DOCUMENT | checkbox — 5 variants, 3 dependencies (0 components, 3 token groups, 1 brand), 0 usedBy
Generated `docs/components/_index_checkbox.md`. Updated `klp-components.json` canonical entry (corrected `captureBrand` from `wireframe` to `klub` per spec.json). Reverse-index pass: 2 components scanned, 0 component-to-component edges. Patched `tokens/colors.md`, `tokens/spacing.md`, `tokens/radius.md` Used-by sections to add Checkbox. Patched `brands/klub.md` Used-by section (first component validated under klub).
