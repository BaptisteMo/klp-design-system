# Agent intent layer — design

- **Date:** 2026-08-10
- **Status:** approved, pending implementation plan
- **Origin:** consumer-project brief on why design agents mis-pick klp components

## Problem

An agent consuming the DS learns component *names* (from `index.ts`) and component *props* (from `klp-inventory.json`). It never learns *intent*. Every description in `klp-components.json` and `docs/agent-brief.md` answers "what is this" and never "when do I reach for it", "when must I not", "what do I confuse it with".

Observed failure in the consumer project: a dense summary table was built with `data-table` on iteration 1, then hand-recoded from scratch on every later iteration, because nothing arbitrates between `table`, `data-table`, `list` and `list-content`.

Four ambiguity zones where an agent cannot choose without guessing:

1. `table` / `data-table` / `list` / `list-content` — four ways to render a collection.
2. `header-desktop` / `header-phone` / `header-showup` — brand-specific headers sit beside generic ones, unmarked.
3. `sidebar` / `sidebar-atlas` / `item-side-bar` / `navbar-item` — same problem, plus `item-side-bar` is not an item of `sidebar-atlas`.
4. `modal-variation` / `action-sheet-menu` / `tooltip` / `floating-alert` — four floating surfaces.

Three secondary gaps:

- **Naming mismatch.** Folder `badges` exports `Badge`; the Figma layer is `badges`. An agent searching by any one of the three may miss the other two. No `figmaName` or alias field exists in the catalog.
- **Thin consumer inventory.** `klp-inventory.json` carries `{status, category, deps}` only (`cli/inventory.mjs:16`). No exports, no prop types, no intent. Agents cannot type their data against the DS, and the consumer-side gate reports a false positive for missing types.
- **Unwritten token vocabulary.** The Figma bridge resolves `bg/subtle`, `fg/muted`, `Sizing/XS`; the DS exposes `--klp-bg-subtle` and the utility `bg-klp-bg-subtle`. The transform is mechanical but written nowhere, so agents cannot verify a token exists before using it.

## Non-goals

- Renaming `badges` → `badge`. Aliases solve the lookup problem without breaking existing consumer installs, lockfiles, or the manifest.
- Any new docs site, Storybook, or MDX. Markdown + JSON only, per project conventions.
- Backfilling intent for components added in the future by hand — the pipeline will require it (see R6).

## Architecture

One hand-authored source, one merge step, four generated surfaces.

```
.klp/intent.yaml            (human writes; only human-edited file)
        │
        ▼  documentalist DOCUMENT / SYNC
klp-components.json         (intent{}, figmaName, aliases[], family, exports[])
        │
        ├──▶ docs/components/_index_<name>.md      "When to use" + "Don't confuse with"
        ├──▶ docs/agent-brief.md                   per-component use/not-for + family guide
        └──▶ klp-inventory.json (v2, consumer)     exports, props+types, whenToUse, aliases

.klp/tokens.json ──▶ scripts/sync-tokens.ts ──▶ docs/tokens/vocabulary.md
```

### 1. `.klp/intent.yaml`

Sole human-authored artifact. Reviewed as prose in a PR. Never generated, never overwritten.

```yaml
schemaVersion: v1

families:
  collections:
    members: [table, data-table, list, list-content]
    rule: >
      Tabular data with sorting or pagination -> data-table. Table primitives only when
      data-table cannot express the layout. Non-tabular vertical rows -> list.
  headers: { members: [...], rule: ... }
  sidebars: { members: [...], rule: ... }
  floating-surfaces: { members: [...], rule: ... }

components:
  badges:
    figmaName: badges
    aliases: [badge, chip, pill, tag]
    family: status-indicator
    whenToUse: Short read-only status or qualifier attached to another element.
    whenNotToUse: >
      Never as a button or filter — no click affordance. A count inside a tab belongs to
      tabulation-cells.
    confusedWith:
      - component: tabulation-cells
        rule: Badge labels state; tabulation-cells is a selectable tab.
```

Field contract, per component key:

| Field | Required | Type | Meaning |
|---|---|---|---|
| `figmaName` | no | string | Figma layer / component-set name when it differs from the folder name. Defaults to the folder name. |
| `aliases` | no | string[] | Extra search terms: exported symbol, Figma name, common synonyms. |
| `family` | no | string | Key into `families`. Absent = component has no near-neighbours. |
| `whenToUse` | **yes** | string | One or two sentences. The need it answers. |
| `whenNotToUse` | **yes** | string | The boundary, naming the component to use instead. |
| `confusedWith` | no | `{component, rule}[]` | Pairwise arbitration. `component` must be a known component name. |

`families[].members` must all be known component names; every member must carry the matching `family`. Mismatch is a LINT error.

### 2. documentalist merge

`DOCUMENT` and `SYNC` gain a step: read `.klp/intent.yaml`, and for the component(s) in scope write into the catalog entry:

- `intent: { whenToUse, whenNotToUse, confusedWith[] }`
- `figmaName: string` (folder name when unspecified)
- `aliases: string[]` (always includes the folder name and the primary export)
- `family: string | null`
- `exports: string[]` — new field, extracted from `src/components/<name>/index.ts` (value exports and type exports, flagged)

`LINT` gains two checks: a component with no `intent` entry, and an intent key or `families[].members` entry matching no component. Both are warnings at first, promoted to errors once the initial fill lands.

`klp-components.json` stays documentalist-owned. Nothing else writes it.

### 3. Doc pages

Two generated sections per `docs/components/_index_<name>.md`, emitted **after the title, before `## Anatomy`**:

```markdown
## When to use

<whenToUse>

**Don't use it for:** <whenNotToUse>

## Don't confuse with

| Component | How to choose |
|---|---|
| `tabulation-cells` | Badge labels state; tabulation-cells is a selectable tab. |
```

`## Don't confuse with` is omitted when `confusedWith` is empty. Both sections live outside `KLP:NOTES`, so they regenerate; hand prose still goes between the NOTES markers.

New rule **R6** in the `klp-doc-rules-validator` skill: the page has a non-empty `## When to use` section, and its text matches the catalog `intent.whenToUse`. Report-only in the first release, like R5.

### 4. `agent-brief.md`

`scripts/build-agent-brief.ts` changes:

- Inventory line becomes: `**<name>** (N variants) — <description> **Use for** <whenToUse> **Not for** <whenNotToUse>`
- New section `## Choosing between similar components`, one subsection per family: the rule, then a member table of `component | use when`.
- Component lines gain `_also: <aliases>_` when aliases exist beyond the folder name.

### 5. Consumer inventory v2

`cli/inventory.mjs`: `SCHEMA` `v1` → `v2`. `createInventory` takes the enriched catalog and writes per component:

```json
{
  "status": "available",
  "category": "data-display",
  "deps": [],
  "aliases": ["badge", "chip", "pill", "tag"],
  "exports": ["Badge", "BadgeProps", "BadgeType"],
  "whenToUse": "Short read-only status or qualifier attached to another element.",
  "props": { "type": { "type": "BadgeType", "class": "optional" } },
  "doc": "docs/components/_index_badges.md"
}
```

`props` carries `{type, class}` only — no defaults, no descriptions; the doc page holds those. `whenNotToUse` and `confusedWith` are **not** mirrored: they live in the doc pages and the brief, which ship alongside.

`writeInventoryMd` renders the one-liner and aliases per row.

Migration: `klp-ui add` and `klp-ui update` read `schemaVersion`; a `v1` file is upgraded in place on the next command by re-deriving every field from the shipped catalog, preserving each component's `status`.

### 6. Token vocabulary

`scripts/sync-tokens.ts` emits `docs/tokens/vocabulary.md` from `.klp/tokens.json` + the generated alias layer:

| Figma variable | CSS variable | Tailwind utility |
|---|---|---|
| `bg/subtle` | `--klp-bg-subtle` | `bg-klp-bg-subtle` |
| `Sizing/XS` | `--klp-size-xs` | `gap-klp-size-xs`, `p-klp-size-xs` |

Grouped by alias family (bg, fg, border, radius, size, font). Only aliases — primitives stay internal. The page ships to consumers via the existing `docs` manifest group. `agent-brief.md` states the mechanical rule (lowercase, `/` → `-`, prefix `--klp-`) and links to the table for verification.

## Family rules (initial content)

| Family | Rule |
|---|---|
| collections | `data-table` is the default for any tabular data — sorting and pagination are built in. `table` exposes primitives, used only when `data-table` cannot express the layout. `list` renders vertical non-tabular rows. `list-content` is a row *inside* `list`, never standalone. |
| headers | `header-desktop` and `header-phone` are generic and brand-agnostic. `header-showup` is the ShowUp top nav only — never used under another brand. |
| sidebars | `sidebar` is the generic full nav (desktop + phone). `sidebar-atlas` is the Atlas-only 70px icon rail. `item-side-bar` is a row inside `sidebar`; `navbar-item` is a row inside `sidebar-atlas`. The two row types are not interchangeable. |
| floating-surfaces | `modal-variation` blocks on a decision. `action-sheet-menu` is a contextual action list anchored to a trigger. `tooltip` is a hover hint with zero actions. `floating-alert` is transient self-dismissing system feedback. |

## Initial fill

All 39 components get an intent entry in one pass, drafted from source + spec + existing doc, delivered as a single reviewable YAML diff. The four family rules above are authoritative; per-component entries must not contradict them.

## Verification

- `node scripts/validate-intent.mjs` (new) — YAML parses, required fields present, every `confusedWith.component` and `families[].members` entry resolves to a real component, every family member carries the matching `family`. Exit 1 on failure.
- documentalist `LINT` reports missing intent per component.
- `klp-doc-rules-validator` R6 reports doc pages missing `## When to use`.
- `pnpm run test:cli` asserts inventory `schemaVersion: v2`, the presence of `exports`/`props`/`whenToUse`/`aliases`, and that a `v1` fixture upgrades in place with `status` preserved.
- `pnpm run build:all` regenerates tokens, vocabulary, brief and manifest; `pnpm run validate:manifest` must pass with `docs/tokens/vocabulary.md` hashed in.

## Files touched

| File | Change |
|---|---|
| `.klp/intent.yaml` | new — hand-authored source |
| `scripts/validate-intent.mjs` | new — schema + referential integrity |
| `.claude/agents/documentalist.md` | merge step, `exports[]` extraction, two LINT checks |
| `scripts/build-agent-brief.ts` | use/not-for lines, family section, aliases |
| `.claude/skills/klp-doc-rules-validator/SKILL.md` | rule R6 |
| `scripts/sync-tokens.ts` | emit `docs/tokens/vocabulary.md` |
| `cli/inventory.mjs` | schema v2, enrichment, v1 upgrade, md rendering |
| `cli/klep-ds-init.mjs`, `cli/add.mjs` | pass the enriched catalog through |
| `scripts/build-manifest.ts` | add `docs/tokens/vocabulary.md` to the explicit `docs` group file list (`scripts/build-manifest.ts:112`) |
| `registry/manifest.json` | regenerated (adds `docs/tokens/vocabulary.md`) |
| `docs/components/_index_*.md` | regenerated with the two new sections |
| `klp-components.json` | regenerated with `intent`, `figmaName`, `aliases`, `family`, `exports` |
| `CLAUDE.md` | document `.klp/intent.yaml` as a required input for new components |
