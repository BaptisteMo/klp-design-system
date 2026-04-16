# Design: `/klp-build-batch` — industrial batch import from Figma

**Date:** 2026-04-16
**Status:** Approved by user, ready for implementation plan
**Author:** Claude + Baptiste (brainstorming session)

---

## Context

The klp design system has 4 components integrated (`button`, `checkbox`, `radio`, `switch`). The Figma file holds a backlog of ~15 base components ready to be brought in (Input, Select, Textarea, Slider, Dialog, Popover, Tooltip, DropdownMenu, Toast, Alert, Badge, Progress, ...). After this batch, the project will move up a level (page templates) and the cadence drops back to ad-hoc 1-component additions.

The current pipeline `/klp-build-component <name>` is solid but ships one component at a time. Pain points on a backlog of 15:
- **Context switching Figma ↔ Claude**: ~15 round-trips of "click component in Figma → run command → wait → click next".
- **Wall-clock**: ~6 min × 15 ≈ 90 min serial.

Stated user constraints:
- Wall-clock is not the priority — "1h c'est ok je laisse claude tourner sur le côté".
- **Must not degrade the existing `/klp-build-component` pipeline.** Zero modifications to existing agents or scripts.
- The user can keep working in Figma in parallel (with light caveats during Phase 1).
- Visual review and per-component validation are batched at the end, not interleaved.

---

## Goals

1. Eliminate Figma context switching — single "go" at the start, zero clicks during the batch.
2. Reduce user gates from ~30 (today: list + commit per component) to **3** (start / failure-pause / final commit).
3. Add zero risk to the existing per-component pipeline. **No modifications to figma-extractor, component-adapter, documentalist, or validate-tokens.mjs.**
4. Provide a clear summary at the end (success / warnings / failures) and a flexible commit choice (1 grouped or N separate).

## Non-goals (V1)

- **No parallelism inside Phase 3** (adapt/validate/document remain serial). Parallelism would require modifying the adapter (race conditions on `package.json`, `klp-components.json`, `playground/App.tsx`) and the documentalist (reverse-index pass). Those are V2 if needed.
- No Figma plugin changes.
- No CI integration.
- No visual regression — review remains a manual playground walkthrough.

---

## Pipeline overview

```
PHASE 0 — DISCOVERY  (~10s, new code)
  Scan Figma page "Components" → list candidates
  Filter against klp-components.json (skip already integrated)
  GATE: user confirms list

PHASE 1 — EXTRACT ALL SPECS  (serial, ~2 min × N)
  For each component: dispatch existing figma-extractor (no agent change)
  Output: .klp/figma-refs/<name>/spec.json + reference PNGs
  Aggregate: all radixPrimitives, all tokenGaps

PHASE 2 — PRE-INSTALL DEPS  (serial, ~15s)
  Single `pnpm add @radix-ui/react-X @radix-ui/react-Y ...`
  If tokenGaps detected: prompt user (sync:tokens / continue / abort)

PHASE 3 — BUILD EACH COMPONENT  (serial loop, ~3 min × N)
  for spec in extracted_specs:
    dispatch component-adapter (existing)
    run scripts/validate-tokens.mjs (existing)
    if mismatches: patch inline + retry once (existing logic)
    dispatch documentalist op=DOCUMENT (existing)
    record result in .klp/staging/batch-<ts>.json

PHASE 4 — REVIEW + COMMIT  (user-driven)
  Print summary (success / warnings / failures + playground URL)
  GATE: user reviews at playground
  GATE: choose commit format → 1 grouped or N separate or abort
  Apply commits
```

**User gates total: 3** (start, optional mid-batch on failures, end).

---

## Phase details

### Phase 0 — Discovery

**Inputs:**
- Optional CLI args: `--page=<name>` (default `Components`), `--names=A,B,C` (bypass scan), `--force` (re-build already-integrated components)

**MCP calls (Claude main, no subagent):**
1. `figma_get_status` — abort if plugin not paired
2. `figma_get_file_data` — find page node ID by name
3. `figma_get_component_for_development_deep(pageNodeId)` — fetch full tree
4. Walk tree: filter children by `type: "SECTION"`, then per section by `type: "COMPONENT_SET"`

**Output:** `[{ name, category, nodeId }, ...]`

**Filtering:**
- Read `klp-components.json` to get already-integrated names
- Default: skip already-integrated. With `--force`: include them too.
- Edge cases:
  - Page not found → list available pages, ask user
  - Components outside any Section → group under `category: "uncategorized"` with a warning
  - Unnamed sections (e.g. `Section 1`) → warn, skip the section unless user names it
  - Duplicate component names across sections → abort (kebab-case names must be unique)
  - Empty result (nothing new) → exit 0 with "rien à faire"

**Gate:** AskUserQuestion with the categorized list — confirm all / pick subset / abort.

### Phase 1 — Extract all specs

Serial loop dispatching the existing `figma-extractor` subagent. Each iteration:
- `Agent({ subagent_type: "figma-extractor", prompt: "Extract Figma component '<name>' (node <nodeId>). Output spec + refs to .klp/figma-refs/<kebab-name>/." })`
- Parse the returned JSON. On failure: log to `.klp/staging/batch-<ts>.json`, continue to next.
- Aggregate `tokenGaps` and `radixPrimitive` across all successful extractions.

**No modifications to the extractor agent.** It already accepts a single component argument and writes to the canonical location.

### Phase 2 — Pre-install dependencies

Once all specs are extracted, `klp-build-batch` collects every distinct `radixPrimitive` referenced and runs **one** `pnpm add ...`. This avoids the per-component `pnpm add` that the adapter would otherwise do (which would also work but is slower and noisier).

If aggregated `tokenGaps` is non-empty, prompt:
- (a) Pause, run `pnpm sync:tokens`, then resume — the validator will then succeed where it would have flagged missing aliases.
- (b) Continue — the validator will surface the gaps as mismatches per-component, you patch them at the end.
- (c) Abort.

### Phase 3 — Build each component

Serial loop. For each successfully-extracted spec:

1. **Adapt:** dispatch existing `component-adapter` subagent. If `typecheck != "pass"`, mark failed and continue (no retry — adapter's responsibility).
2. **Validate:** `Bash("node scripts/validate-tokens.mjs <name>")`. Parse JSON.
   - If `passed: true` → proceed.
   - Else → for each mismatch, locate the cva block in source, add the missing `${stateSelector}${expectedUtility}` class. Re-run validator once.
   - If still failing → mark failed, continue. Same logic as Stage 3 of `/klp-build-component`.
3. **Document:** dispatch existing `documentalist` with `operation: DOCUMENT, component: <name>`. Doc failures are non-blocking (log, continue).
4. **Record:** update `.klp/staging/batch-<ts>.json` with this component's result.

**Failure escalation:**
- 3 consecutive component failures → pause, ask user if global problem (e.g. dependency incompatibility) vs continue.
- Otherwise: silent skip + log, batch continues.

### Phase 4 — Review + commit

Print summary (success / warnings / failures with reasons), playground URL.

Gate: user reviews visually, then chooses commit format:
- **(a) 1 grouped commit:** `feat(components): add <PascalName1>, <PascalName2>, ... components` — body lists each + their warnings.
- **(b) N separate commits:** loop, one `feat(<name>): add <PascalName> component` per success.
- **(c) Abort:** leave files staged for manual handling.

---

## Files to create / modify

### NEW

**`.claude/commands/klp-build-batch.md`** (~150 lines)
The orchestrator. Structure parallel to `klp-build-component.md`. Sections: Preflight / Phase 0 / Phase 1 / ... / Phase 4 / Do-nots.

**`scripts/batch-state.mjs`** (~80 lines)
State persistence helper. Public API:
```
node scripts/batch-state.mjs init <component-list-comma-separated>
node scripts/batch-state.mjs update <name> <status> [error-json]
node scripts/batch-state.mjs report                  # prints final summary
```
Writes/reads `.klp/staging/batch-<latest>.json`. Latest is a symlink to the most recent `batch-<timestamp>.json`. Used so the orchestrator can survive a crash and resume / surface clean reports.

### MODIFIED

**`CLAUDE.md`** (+8 lines)
- Workflow section: mention `/klp-build-batch [--page=...] [--names=...] [--force]`
- Workflow section: document expected Figma structure (page "Components", named Sections per category)
- Useful paths: add the new command + script + staging dir

**`.gitignore`** (+1 line)
- `.klp/staging`

**`docs/overview.md`** (+20 lines)
- New subsection "Batch import from Figma" describing the workflow + gates. The documentalist regenerates this file on each run, so the addition MUST go between the `<!-- KLP:NOTES:BEGIN --> ... <!-- KLP:NOTES:END -->` markers (per CLAUDE.md "Don'ts" rule). If those markers don't exist in `overview.md` yet, add them as part of this change.

### NOT MODIFIED (the safety guarantee)

- `.claude/agents/figma-extractor.md`
- `.claude/agents/component-adapter.md`
- `.claude/agents/documentalist.md`
- `scripts/validate-tokens.mjs`
- `.claude/skills/klp-token-validator/SKILL.md`
- `.claude/commands/klp-build-component.md`

---

## Error handling policy

| Failure | Behavior |
|---|---|
| Figma plugin not paired (Phase 0) | Abort with clear pair-instruction message |
| Page "Components" not found | List available pages, ask user to confirm |
| Component extract fails (Phase 1) | Log + skip that component, batch continues |
| Token gaps aggregated > 0 | Prompt user (sync / continue / abort) |
| `pnpm add` fails (Phase 2) | Halt batch (systemic problem) |
| Adapter typecheck fail (Phase 3a) | Mark component failed, continue batch |
| Validator fails after 1 retry (Phase 3b) | Mark component failed, continue batch |
| Documentalist fail (Phase 3c) | Mark warning, batch continues (doc is non-blocking) |
| 3 consecutive failures | Pause, user decides continue / abort |
| Crash mid-batch | `.klp/staging/batch-<ts>.json` preserves state — manual `klp-build-batch --resume` (V2) or restart fresh |

---

## Verification

1. **Regression check:** `/klp-build-component Tooltip` (or any single existing-pipeline build) must work identically — adapter / validator / documentalist agents are untouched, so this should pass without intervention.
2. **Smoke test (small batch):** `/klp-build-batch --names=Input,Select` — verify both components emerge correctly with passing validators.
3. **Discovery test:** `/klp-build-batch` (no args) on a freshly restructured Figma file — verify page scan, section detection, list confirmation flow.
4. **Failure resilience:** intentionally break one spec (e.g. delete a layer in Figma between extract and adapt phases) — verify the batch logs the failure, continues, surfaces it cleanly at the end, and other components are unaffected.
5. **Full run:** the actual backlog of ~12-15 components, end-to-end. Measure wall-clock and number of user gates.

Acceptance criteria: 3 user gates, ≥80% of components succeed on first try, total wall-clock < 90 min for 15 components.

---

## Out of scope (V2 ideas, defer until V1 proves insufficient)

1. **Parallel Phase 3** — would require: an opt-in `batchMode` flag on `component-adapter` that writes to `.klp/staging/<name>/` instead of shared files; a Phase 4 merge step (apply staged playground/App.tsx + klp-components.json updates serially); a parallel documentalist with deferred reverse-index pass. Big surface for bugs, only worth it if Phase 3 wall-clock proves painful.
2. **Resume mid-batch** — `klp-build-batch --resume` would read the latest staging file and skip already-completed components. V2 if crashes happen.
3. **CI integration** — a non-interactive mode (no AskUserQuestion gates) that takes a YAML config and runs end-to-end. Useful if a designer wants to push to a "import these" file in the repo and have a job pick it up.
4. **Multi-brand batch** — currently each component captures one brand. A V2 could iterate brands per component and produce multiple reference sets.
5. **Visual diff inside batch** — opt-in browse-tool screenshot of each playground cell vs Figma reference, surfaced in the final summary as warnings (not blocking). Re-introduces some of the visual-verifier value without the false-positive cost.

---

## Critical files (paths)

- `/Users/morillonbaptiste/klp-design-system/.claude/commands/klp-build-batch.md` (CREATE)
- `/Users/morillonbaptiste/klp-design-system/scripts/batch-state.mjs` (CREATE)
- `/Users/morillonbaptiste/klp-design-system/CLAUDE.md` (MODIFY — workflow + paths sections)
- `/Users/morillonbaptiste/klp-design-system/.gitignore` (MODIFY — add `.klp/staging`)
- `/Users/morillonbaptiste/klp-design-system/docs/overview.md` (MODIFY — new subsection)

Existing klp-components.json, playground/App.tsx, playground/routes/_index.tsx, registry/, and per-component sources are written by the existing agents during Phase 3 — same paths and same conventions as today, no changes.
