# Design: Composition discipline for klp agents

**Date:** 2026-04-17
**Status:** Approved by user, ready for implementation plan
**Author:** Claude + Baptiste (brainstorming session)

---

## Context

The klp design system has ~17 base components integrated via two batch runs and several polish iterations. Now the project enters a new phase: **composite components** that reuse existing primitives (e.g. `search-bar` composes `Input` + `Button`, `dashboard-header` composes `Button` + `Badges` + `BreadCrumbs`, etc.).

The current agent pipeline was designed for leaf components. The reuse mechanic is barely enforced:
- The `figma-extractor` doesn't surface Figma `INSTANCE` nodes — it flattens everything as inline anatomy.
- The `component-adapter` has no formal "look at what already exists before inventing" reflex. It consults `klp-components.json` only to write its own stub entry.
- The `documentalist` does a reverse-index pass, but in practice several manual refactors (`list-content` → `Button`, `floating-alert` → `Button`, `tabulation-cells` → `Badge`, `text-area` toolbar → `Button`) were never caught by the pass — `dependencies.components[]` and `usedBy[]` edges are stale for those components.
- The token validator (`scripts/validate-tokens.mjs`) checks token usage but nothing about composition (import discipline, inline SVG, cross-check with spec).

Result: as composite components come in, the pipeline will silently reinvent primitives, produce dozens of near-duplicate cva blocks, and the dependency graph will diverge from reality.

## Goals

1. **Reuse by default.** When a Figma layer is an instance of a known klp component, the generated source MUST import it, not reinvent it.
2. **Authoritative reuse signal.** The extractor emits a structured signal (`klpComponent`, `klpComponentCandidate`, `figmaInstance`) so decisions are traceable.
3. **Gaps visible.** When the adapter has to create something new — because nothing matches, or because the match is partial — it MUST declare this as a `gap` with a typed reason. Gaps are persisted in docs for review.
4. **Static verification.** A compliance script cross-checks that the source code honors the spec's reuse contract (imports match, no inline SVG, tokens clean).
5. **Zero regression on existing components.** Spec v1 files remain valid (adapter runs in best-effort mode). A single documentalist SYNC pass retro-fits the dependency graph.

## Non-goals (V1)

- No auto-fix for reuse/icons mismatches (adapter's responsibility to patch).
- No LLM-driven "this looks like a Button, maybe you should use Button" heuristics when Figma has no INSTANCE node. The authoritative signal stays tied to Figma's `INSTANCE` type.
- No new subagent. All evolution happens inside existing agents (extractor, adapter, documentalist) and the existing validator script. Pipeline timing stays within current budget.
- No changes to the batch command `/klp-build-batch` beyond consuming the new output fields (aggregated gap summary).

---

## Pipeline overview (v2)

```
Stage 1 — figma-extractor  (evolved)
  Output: spec.json v2 with `composition` + `klpComponent` fields on anatomy parts

Stage 2 — component-adapter  (evolved, new rulebook)
  Output: source + stub klp-components.json + JSON report with reuses[] + gaps[]

Stage 3 — validate-tokens.mjs  (extended to compliance checker)
  Checks: tokens (existing) + reuse + icons
  Exit 0 if all pass, else 1 with structured mismatches

Stage 4 — documentalist  (evolved)
  Scans @/components/* imports in source, recomputes dependencies + usedBy
  Writes KLP:GAPS block in _index_<name>.md + aggregates docs/gaps.md
```

User gates are unchanged (`/klp-build-component` remains "run and review", `/klp-build-batch` still has its 3 gates).

---

## Stage 1 — figma-extractor

### Input

- Component name / node id (unchanged).

### New behavior

1. **Bootstrap read.** At the start of the run, load `klp-components.json` once → extract the set of integrated kebab-case names (e.g. `{ button, badges, input, switch, ... }`).
2. **Instance detection.** During the tree traversal, for each anatomy part, check if the corresponding Figma node is of `type: "INSTANCE"`. If yes, resolve `mainComponent.name` via `figma_get_component_for_development_deep` (already used by the extractor today).
3. **Matching.** Kebab-case the Figma mainComponent name, strip any variant suffix (e.g. `Button/Tertiary/Icon` → `button`). Check against the integrated set.
4. **Annotation.** Three cases per anatomy part:

| Figma shape | Fields added to `anatomy[i]` |
|---|---|
| `INSTANCE`, name matches integrated set | `klpComponent: "<name>"`, `klpComponentProps?: { variant, size, ... }` (inferred from Figma variant string), `figmaInstance: { name, key }` |
| `INSTANCE`, name does NOT match | `klpComponentCandidate: "<kebab-name>"`, `figmaInstance: { name, key }` |
| Not an `INSTANCE` (inline-drawn layer) | No new fields |

5. **Top-level summary.** Emit `spec.composition`:

```json
"composition": {
  "reuses": ["button", "badges"],
  "candidates": ["date-picker"],
  "instances": [
    { "part": "action-button", "klpComponent": "button", "figmaInstance": { "name": "Button/Tertiary/Icon", "key": "..." } },
    { "part": "calendar",      "klpComponentCandidate": "date-picker", "figmaInstance": { "name": "DatePicker/Default", "key": "..." } }
  ]
}
```

### Non-blocking

The extractor remains purely informative. If instance resolution fails (cross-file library, detached instance), it records `klpComponentCandidate: null, figmaInstance: { name: "<raw>" }` and moves on.

### Files touched

- `.claude/agents/figma-extractor.md` — add new capture logic + output shape.

---

## Stage 2 — component-adapter

### Input (enriched)

- `spec.json` (v2) — consults `spec.composition` + per-part `klpComponent*` fields first.
- `klp-components.json` — full read: for each referenced klp component, loads its `source`, `anatomy`, `variantAxes`, `externals` to know the import path and prop surface.

### New rulebook (appended to system prompt)

A dedicated "Composition discipline" section with strict Do's / Don'ts.

**DO:**
- If `anatomy[i].klpComponent` is set → **import** the component from `@/components/<name>` and map `klpComponentProps` to its props.
- Before inlining a new visual layer, grep `klp-components.json` for name/displayName matches.
- For `Button` / `Badge` / `Input` / `Switch` / `Checkbox` / `Radio` / `Tooltip` / list/breadcrumb/etc., always use the DS import — never reimplement inline.

**DON'T:**
- Recreate a cva that duplicates an existing component (e.g. a local `actionButtonVariants` when `Button` covers the case).
- Reinvent tokens (covered by token validator, reminded here).
- Import a DS component and then override critical visual tokens via `className` — if the component doesn't match, this is a gap to report, not a hack.

### Enriched output

Adapter's JSON return gains two new fields:

```json
{
  "component": "search-bar",
  "filesCreated": [...],
  "filesModified": [...],
  "typecheck": "pass",
  "reuses": ["input", "button"],
  "gaps": [
    {
      "part": "voice-record-button",
      "kind": "unmatched-instance",
      "figmaInstance": "VoiceRecord/Idle",
      "reason": "No component named 'voice-record' in klp-components.json.",
      "action": "inlined-local-cva"
    },
    {
      "part": "search-input",
      "kind": "partial-reuse",
      "reason": "Spec wants trailing clear button, Input supports only leading icon.",
      "action": "className-override"
    }
  ]
}
```

### Gap vocabulary (closed set)

| kind | Meaning |
|---|---|
| `unmatched-instance` | Extractor flagged a `klpComponentCandidate` not in the index — missing primitive in the DS. |
| `partial-reuse` | DS component imported but its props don't cover 100% of the need; adapter added overrides. |
| `no-instance-no-match` | Figma has no INSTANCE but the visual resembles a known component; adapter chose to inline for safety. |
| `new-primitive` | Nothing equivalent exists; adapter created an isolated primitive — candidate for future extraction. |

### Files touched

- `.claude/agents/component-adapter.md` — add "Composition discipline" section + new output fields.

---

## Stage 3 — compliance validator (`scripts/validate-tokens.mjs`, extended)

### Scope change

Name kept for pipeline compatibility (`CLAUDE.md`, `klp-token-validator` skill, Stage 3 of `/klp-build-component` all reference this path). Internal scope broadens to 3 check families.

### Output shape

```json
{
  "component": "search-bar",
  "radixPrimitive": "...",
  "passed": false,
  "mismatchCount": 2,
  "warningCount": 5,
  "checks": {
    "tokens": { "passed": true,  "mismatchCount": 0, "warningCount": 3, "mismatches": [], "warnings": [...] },
    "reuse":  { "passed": false, "mismatchCount": 1, "warningCount": 1, "mismatches": [...], "warnings": [...] },
    "icons":  { "passed": false, "mismatchCount": 1, "warningCount": 1, "mismatches": [...], "warnings": [...] }
  }
}
```

Top-level `mismatchCount` / `warningCount` aggregate the three families. Backward compatibility: existing callers reading `mismatches[]` / `warnings[]` at top-level continue to work — those fields remain, flattened from `checks.*`.

### Check 1 — `tokens` (existing, unchanged)

V1-laxest match on each (layer × state × property) vs the expected `--klp-*` alias utility.

### Check 2 — `reuse` (new, covers rulebook items 2 + 6)

**Inputs:** `spec.composition.instances[]` + source file.

**Forward rule:** For each part with `klpComponent: "X"`, the source must contain:
- An import matching `from '@/components/<X>'`
- A JSX usage matching `<X[ />]` or `X\.<member>`.

Missing → `mismatch { kind: 'missing-import' | 'imported-not-used', part, klpComponent, hint }`.

**Reverse rule:** For each `import { X } from '@/components/<Y>'` detected in source, verify that `spec.composition.reuses[]` contains `Y` OR the adapter declared `gaps[].kind === 'partial-reuse'` with matching part.

Neither → `warning { kind: 'undeclared-reuse', component: Y }` (probably intentional but surfaced for review).

### Check 3 — `icons` (new)

Grep source for `<svg\b` or `<path\b` in JSX.

Match → `mismatch { kind: 'inline-svg', line, snippet }`.

Exception: allow if preceded by a line containing `{/* allow-inline-svg: <reason> */}` — explicit escape hatch for exotic cases (branding, one-off illustration). The exception downgrades the mismatch to a warning (`kind: 'allowed-inline-svg'`).

### Performance + constraints

- `< 1s` end-to-end.
- No Chromium, no LLM, no visual regression.
- Exit 0 on `passed: true`, exit 1 otherwise.

### Patch policy on mismatches

- `tokens` mismatches: Stage 3 of the pipeline patches in place + retries once (existing behavior).
- `reuse` mismatches: surfaced to the adapter for a corrective pass (1 retry). Adapter must rewrite imports / JSX. If still failing after retry, surface to user.
- `icons` mismatches: same as `reuse` — adapter must replace with `lucide-react` + retry. If user explicitly wants an inline SVG, they add the `allow-inline-svg` comment.

### Files touched

- `scripts/validate-tokens.mjs` — add the two new check families, restructure output shape.
- `.claude/skills/klp-token-validator/SKILL.md` — update the SKILL invocation doc to describe the new `checks` object.

---

## Stage 4 — documentalist

### New reflex: systematic import scan

On every `operation: DOCUMENT` or `SYNC`:

1. Read `src/components/<name>/<Component>.tsx` (+ `.example.tsx` if present).
2. Match all occurrences of `from '@/components/(\w[\w-]*)'` → set of DS imports.
3. Cross-check with `klp-components.json` (each import must map to a registered component).
4. Write `dependencies.components: [...]` in the canonical entry for the current component.
5. **Reverse-index pass:** for each component cited in `dependencies.components`, ensure its `usedBy[]` contains the current component. Pass is idempotent — can be recomputed from scratch.

This scan is **independent** from the adapter's `reuses[]` self-report: even if the adapter forgets to declare a reuse, the documentalist catches it statically from the code. Source of truth = the code itself.

### Gap persistence

The adapter's `gaps[]` (from Stage 2) is passed to the documentalist (Stage 4).

1. **Per-component block** in `docs/components/_index_<name>.md`, between scoped markers:

```markdown
<!-- KLP:GAPS:BEGIN -->
## DS gaps

| Part | Kind | Reason | Action |
|---|---|---|---|
| voice-record-button | unmatched-instance | No component named 'voice-record' in klp-components.json. | inlined-local-cva |
| search-input | partial-reuse | Input doesn't support trailing icon slot. | className-override |
<!-- KLP:GAPS:END -->
```

If `gaps[]` is empty, the block contains `No gaps recorded.` as a single line (explicit, not omitted — keeps diffs clean across runs).

2. **Aggregated file** `docs/gaps.md` at the root of `docs/`. One section per component with gaps. Regenerated from scratch on each SYNC / DOCUMENT — no manual blocks to preserve, pure snapshot.

```markdown
# DS gaps — 2026-04-17 snapshot

## search-bar
- **voice-record-button** (unmatched-instance) → missing `voice-record` component
- **search-input** (partial-reuse) → Input lacks trailing icon slot

## some-other-component
- ...
```

This file becomes the canonical backlog of missing DS primitives, kept current mechanically at every build.

### Extended SYNC operation

The existing `operation: SYNC` is extended to iterate over all components and recompute `dependencies.components[]` + `usedBy[]` from source. Used for the one-shot migration of existing components (see Migration section).

### Files touched

- `.claude/agents/documentalist.md` — add the import scan step, extend SYNC, add gap writing logic, maintain `docs/gaps.md`.

---

## Migration of existing components

Several components have been manually refactored to reuse DS primitives (`list-content` → `Button`, `floating-alert` → `Button`, `tabulation-cells` → `Badge`, `text-area` toolbar → `Button`), but `klp-components.json` and docs don't reflect this.

### Strategy: single documentalist SYNC pass after implementation lands

1. Dispatch `documentalist` with `operation: SYNC`. The agent:
   - Iterates over every component in `klp-components.json`.
   - For each: scans imports `@/components/*` in source → recomputes `dependencies.components[]`.
   - Full reverse-index pass → rewrites every `usedBy[]` from scratch.
   - Rewrites docs `_index_<name>.md` (preserving only `KLP:NOTES` and `KLP:GAPS` blocks).
   - `KLP:GAPS` blocks are empty for existing components — no retrospective spec enrichment, so no historical gaps to persist. Future builds produce gaps naturally.

2. Run `pnpm validate:tokens <every-component>` (a new `pnpm validate:tokens:all` alias is optional) so `reuse` + `icons` checks surface any pre-existing non-compliance (e.g. a local cva that should have been an import, a forgotten inline SVG). Output listed to the user — no auto-patch.

3. Existing specs in `.klp/figma-refs/<name>/spec.json` remain v1 (no `composition` field). **No re-extraction.** The adapter stays backward-compatible: if `spec.composition` is absent, it falls back to best-effort mode (today's behavior). Only newly built components get spec v2.

### Cost

- 1 documentalist SYNC (~5 min for the ~17 current components).
- One validator run per component (~1 s each).
- **Total < 10 min.** Zero regression risk on source files (SYNC does not touch `src/`).

---

## User-facing UX

### End of a successful `/klp-build-component <name>`

```
✅ search-bar built successfully
   - 12 variants, 5 layers
   - reuses: button, badges, input
   - validator: passed (tokens + reuse + icons)

⚠ Gaps reported — review docs/gaps.md
   - voice-record-button (unmatched-instance)
   - search-input trailing clear (partial-reuse)

Playground: http://localhost:5173/search-bar
```

The `⚠ Gaps reported` section appears **only if** the adapter emitted ≥1 gap. Otherwise the success message is clean.

### End of a `/klp-build-batch` run

Existing final summary gains a `Gaps summary` block:

```
Gaps summary (4 components, 7 gaps total):
  search-bar        → 2 gaps (voice-record-button, search-input)
  dashboard-header  → 3 gaps (...)
  ...
See docs/gaps.md for details.
```

### Failure modes (escalation policy)

| Stage | Situation | Behavior |
|---|---|---|
| 1 | INSTANCE found but `mainComponent` not resolvable (cross-file, detached instance) | Warning in spec, `klpComponentCandidate: null`, `figmaInstance.name: "<raw>"`. Adapter treats as standard layer. |
| 2 | Adapter fails to import a flagged `klpComponent` (import fail / typecheck fail) | Mark component failed, same as today — no auto-retry. |
| 3 | `reuse` mismatch (spec says "import Button" but source doesn't) | Surfaced to adapter for a corrective pass (1 retry). If still failing, user. |
| 3 | `icons` mismatch (inline SVG detected) | Same — adapter must replace with `lucide-react` + retry. |
| 4 | Documentalist detects an edge but the target component is missing from `klp-components.json` (broken import) | Warning, skip the edge, continue. Flag logged in `docs/gaps.md`. |

---

## Files to create / modify

### NEW

None. No new files, no new subagents.

### MODIFIED

| File | Nature of change |
|---|---|
| `.claude/agents/figma-extractor.md` | Add `klp-components.json` bootstrap read + INSTANCE detection + `composition` field emission |
| `.claude/agents/component-adapter.md` | Add "Composition discipline" rulebook + gap reporting shape in return JSON |
| `.claude/agents/documentalist.md` | Add import scan step, extend SYNC, add gap block writing, maintain `docs/gaps.md` |
| `scripts/validate-tokens.mjs` | Add `reuse` + `icons` check families, new output `checks` object, preserve flat `mismatches[]` for BC |
| `.claude/skills/klp-token-validator/SKILL.md` | Document the new check structure |
| `CLAUDE.md` | Update "Workflow" + "Don'ts" sections to mention the composition discipline + gap reports |
| `docs/overview.md` | Add a subsection describing the composition workflow (between `KLP:NOTES` markers) |

### NOT MODIFIED (safety guarantee)

- `.claude/commands/klp-build-component.md` (stage flow unchanged)
- `.claude/commands/klp-build-batch.md` (consumes new output fields but structure identical)
- Existing v1 specs under `.klp/figma-refs/*/spec.json` (no re-extraction)
- Component sources (only migrated via documentalist SYNC, not edited)

---

## Verification

1. **Regression check.** Run `/klp-build-component <existing-leaf>` (e.g. re-extract `switch` with `--force`). Should produce a v2 spec, adapter runs in best-effort (no klpComponent flags → no behavior change), validator passes.

2. **New composite test.** Build a synthetic composite component (e.g. a small `field-row` that wraps `Input` + `Button`). Verify:
   - Extractor emits `composition.reuses: ["input", "button"]`.
   - Adapter imports both, no local cva duplicating their styling.
   - Validator `reuse` check passes.
   - Doc page shows `Dependencies: input, button` and empty gaps block.
   - `klp-components.json`: `input.usedBy` and `button.usedBy` both include `field-row`.

3. **Gap detection test.** Build a component that has a Figma INSTANCE referencing a name NOT in the index (e.g. `DatePicker/Default`). Verify:
   - Extractor emits `composition.candidates: ["date-picker"]`.
   - Adapter emits `gaps[].kind === 'unmatched-instance'`.
   - Doc `KLP:GAPS` block lists the gap.
   - `docs/gaps.md` aggregates it.

4. **Migration pass.** Dispatch `documentalist` with `operation: SYNC`. Verify:
   - `list-content` now has `dependencies.components: ["button"]` + `button.usedBy` includes `list-content`.
   - `floating-alert` → `button` edge created.
   - `tabulation-cells` → `badges` edge created.
   - `text-area` → `button` edge created.
   - `docs/gaps.md` generated (empty sections for pre-existing components).

5. **Backward compat.** Run the validator on every existing component (`pnpm validate:tokens:all`). All should `passed: true` (modulo any pre-existing non-compliance surfaced by `reuse` or `icons` checks — these go to the user as a migration backlog, not a regression).

### Acceptance criteria

- All 5 verification steps pass.
- Pipeline timing unchanged (< 6 min per leaf component, within current budget).
- `docs/gaps.md` is generated and non-empty only if there are real gaps.
- No new subagent added; evolution stays inside the existing three agent prompts + the validator script.

---

## Out of scope (V2 ideas, defer)

1. **LLM-driven visual matching.** If Figma has no INSTANCE but the layer visually looks like a Button, the adapter currently can't reuse it. A V2 could use an LLM step to propose "this layer looks like Button, wanna import it?" with user confirmation. Risky — false positives inlined silently today is still better than mass auto-imports.

2. **Prop inference from Figma variant names.** The extractor extracts `klpComponentProps` heuristically (e.g. `Button/Tertiary/Icon` → `{ variant: 'tertiary', size: 'icon' }`). A V2 could use the Figma component set's official prop definitions for 100% accuracy — requires resolving Figma component sets across files, non-trivial.

3. **Auto-create candidate components.** When `unmatched-instance` gaps accumulate for the same candidate name across several builds (e.g. 3 components all flag `date-picker`), a V2 could bootstrap a skeleton component entry to accelerate the next extraction.

4. **Gaps triage UI.** A CLI command `pnpm gaps:review` that opens `docs/gaps.md` grouped by kind (`unmatched-instance` first = highest-signal missing primitives) with a "mark resolved" action that removes entries from a specific component's block.

5. **CI integration.** Run the compliance validator in CI for every PR. Fail if new `mismatch` entries appear. Warnings are allowed but counted.

---

## Critical files (paths)

- `/Users/morillonbaptiste/klp-design-system/.claude/agents/figma-extractor.md` (MODIFY)
- `/Users/morillonbaptiste/klp-design-system/.claude/agents/component-adapter.md` (MODIFY)
- `/Users/morillonbaptiste/klp-design-system/.claude/agents/documentalist.md` (MODIFY)
- `/Users/morillonbaptiste/klp-design-system/scripts/validate-tokens.mjs` (MODIFY)
- `/Users/morillonbaptiste/klp-design-system/.claude/skills/klp-token-validator/SKILL.md` (MODIFY)
- `/Users/morillonbaptiste/klp-design-system/CLAUDE.md` (MODIFY)
- `/Users/morillonbaptiste/klp-design-system/docs/overview.md` (MODIFY)

`klp-components.json`, `docs/components/_index_<name>.md`, and `docs/gaps.md` are written by the documentalist during migration and subsequent builds — same paths and conventions as today.
