---
description: Industrial batch import of N components from a Figma "Components" page. Discovers, extracts, builds, validates, documents each one in series. 3 user gates total. Usage: /klp-build-batch [--page=Components] [--names=A,B,C] [--force]
argument-hint: [--page=Components] [--names=A,B,C] [--force]
allowed-tools: Agent, Bash, Read, Write, Edit, Glob, Grep, mcp__figma-console__figma_get_status, mcp__figma-console__figma_get_file_data, mcp__figma-console__figma_get_component_for_development_deep, mcp__figma-console__figma_search_components
---

# /klp-build-batch

Argument: **$ARGUMENTS** — optional flags `--page=<name>`, `--names=A,B,C`, `--force`. Defaults: `--page=Components`, no name filter, skip already-integrated.

You are orchestrating a batch import of multiple Figma components through the existing per-component pipeline (extract → adapt → validate → document). Use the existing subagents and scripts WITHOUT modifying them. Persist progress via `scripts/batch-state.mjs`.

---

## Preflight

1. Parse `$ARGUMENTS` into: `page` (default `Components`), `names` (comma-separated list, optional), `force` (boolean).
2. Verify prerequisites:
   - `git status --porcelain` — if dirty with unrelated changes, ask the user to stash/commit first.
   - `test -f src/styles/tokens.css` — if missing, abort ("bootstrap not done").
   - `test -f scripts/validate-tokens.mjs` — if missing, abort ("token validator not installed").
   - `test -f scripts/batch-state.mjs` — if missing, abort ("batch helper not installed").
3. `mcp__figma-console__figma_get_status` — if the plugin is not paired, abort with a message telling the user to open Figma and pair the plugin.

## Phase 0 — Discovery

1. If `names` was provided via `--names`, skip Figma scanning. Build the candidate list as `{ name: <kebab>, category: 'unspecified', nodeId: null }[]`. The extractor will resolve node IDs from names in Phase 1. Jump to step 4.
2. Otherwise, `mcp__figma-console__figma_get_file_data` — find the page node whose `name` matches `page` (case-insensitive). If not found, list available page names and ask the user to confirm a name.
3. `mcp__figma-console__figma_get_component_for_development_deep(pageNodeId)` — fetch the page tree. Walk it:
   - Identify children of type `SECTION` — each becomes a `category` (kebab-cased section name).
   - Identify children of each section of type `COMPONENT_SET` — each becomes a candidate.
   - Components OUTSIDE any section: warn and group under `category: "uncategorized"`.
   - Sections with default names like `Section 1` (no meaningful name): warn, skip them unless `--force` is set.
4. Read `klp-components.json` at repo root. Build the set of already-integrated names.
5. Filter the candidate list:
   - If `--force`: keep all.
   - Otherwise: drop candidates whose name is in the already-integrated set.
6. Detect and abort on duplicate kebab-case names across categories (must be unique).
7. If the filtered list is empty, print "Nothing new to build" and exit 0.
8. **Gate user (AskUserQuestion)** — present the filtered list grouped by category, ask:
   - (a) Build all → proceed with full list (recommended)
   - (b) Pick subset → multi-select among the candidates
   - (c) Abort

## Phase 1 — Extract all specs

1. Initialize batch state: `node scripts/batch-state.mjs init <comma-separated-names>`.
2. Initialize aggregators in your working memory:
   - `extractedSpecs = []` — list of successfully extracted spec metadata
   - `radixPrimitives = new Set()` — collected from each spec
   - `tokenGaps = []` — flat list of gap objects, each with `{ component, gap }`
3. For each candidate component (serial loop):
   1. Dispatch the **figma-extractor** subagent:
      - `subagent_type: "figma-extractor"`
      - `description`: "Extract <Name> for batch"
      - `prompt`: `"Extract the Figma component '<name>'. Output its spec + variant screenshots under .klp/figma-refs/<kebab-name>/. Follow your system prompt exactly. Return the JSON report."`
   2. Parse the returned JSON:
      - On success (`variantCount > 0` and `specPath` present):
        - Read `<specPath>` to get the spec object
        - Add `spec.radixPrimitive` to `radixPrimitives` if non-null
        - For each entry in `spec.tokenGaps`, push `{ component: name, gap }` to `tokenGaps`
        - Push `{ name, specPath }` to `extractedSpecs`
        - `node scripts/batch-state.mjs update <name> extracted`
      - On failure: log the error, `node scripts/batch-state.mjs update <name> failed '{"stage":"extract","message":"<error>"}'`, continue to next.
4. After the loop, print: "Phase 1 complete: <success count> extracted, <fail count> failed". If success count is 0, abort the batch.

## Phase 2 — Pre-install deps

1. If `tokenGaps` is non-empty, surface them to the user:
   - Print the unique list of gaps (deduplicated by Figma var name) and which components they affect.
   - **Gate user (AskUserQuestion)**:
     - (a) Pause — run `pnpm sync:tokens`, then resume the batch (you will re-run Phase 1 for affected components after sync, OR proceed if user confirms gaps don't matter)
     - (b) Continue — the validator will surface concrete mismatches per-component, you patch them at Phase 3
     - (c) Abort
2. If `radixPrimitives` is non-empty:
   - Build the install list: `[...radixPrimitives].sort()`
   - Read `package.json` and filter out primitives already present in `dependencies`.
   - If any remain, run `pnpm add <space-separated-list>` once.
   - If `pnpm add` fails, abort the batch (systemic problem).

## Phase 3 — Build each component (serial loop)

For each entry in `extractedSpecs`:

1. **Adapt:**
   - Dispatch the **component-adapter** subagent:
     - `subagent_type: "component-adapter"`
     - `description`: "Adapt <Name>"
     - `prompt`: `"Write the klp component for '<name>'. Read the spec at .klp/figma-refs/<name>/spec.json. Follow your system prompt exactly. Return the JSON report."`
   - Parse JSON. If `typecheck !== "pass"`, mark failed with stage `adapt` and continue.
   - Else: `node scripts/batch-state.mjs update <name> adapted`.

2. **Validate:**
   - Run `node scripts/validate-tokens.mjs <name>` and parse stdout.
   - If `passed === true`: `node scripts/batch-state.mjs update <name> validated`. Proceed.
   - Else (mismatches present): for each mismatch in `mismatches[]`, locate the cva block named in `hint` and add the missing `${stateSelector}${expectedUtility}` class (or the bare `expectedUtility` if appropriate per V1-laxest). Re-run `node scripts/validate-tokens.mjs <name>` exactly once.
   - If still failing: mark failed with stage `validate` and the mismatch list as the error. Skip to next component (do NOT dispatch documentalist).

3. **Document:**
   - Dispatch the **documentalist** subagent:
     - `subagent_type: "documentalist"`
     - `description`: "Document <Name>"
     - `prompt`: `"Generate the documentation for the klp component '<name>'. operation: DOCUMENT, component: <name>. Follow your system prompt exactly. Run the reverse-index pass at the end. Return the JSON report."`
   - Parse JSON. Documentalist failures are NON-blocking — log warning but mark the component as `documented`.
   - `node scripts/batch-state.mjs update <name> documented`.

4. **Failure escalation:**
   - Track consecutive failures. After 3 in a row, **gate user (AskUserQuestion)**:
     - (a) Continue — likely an isolated streak
     - (b) Pause — likely a systemic issue, dump the last 3 failures' details and let the user decide
     - (c) Abort batch

## Phase 4 — Review + commit

1. Run `node scripts/batch-state.mjs report` and print the output to the user.
2. Print the playground URL: `http://localhost:5173/` (or whatever port `vite` is using — check via `lsof -iTCP -sTCP:LISTEN -P -n | grep node` if needed).
3. **Gate user (AskUserQuestion)**:
   - (a) 1 grouped commit — recommended for a coherent batch
   - (b) N separate commits — one per successful component
   - (c) Pause — leave files staged for manual handling
4. Apply the chosen commit format:
   - For (a): `git add` all changed paths, then commit with message `feat(components): add <PascalName1>, <PascalName2>, ... components`. Body: list each component with any warnings.
   - For (b): for each successful component, `git add` only that component's files (use the adapter's filesCreated + filesModified report) and commit `feat(<name>): add <PascalName> component`.
5. Print git log oneline of the new commits.

## Do-nots

- Do not modify `figma-extractor.md`, `component-adapter.md`, `documentalist.md`, `validate-tokens.mjs`, or `klp-build-component.md`. The batch must work entirely on top of them.
- Do not dispatch the agents in parallel. Serial only (V2 may add parallelism behind a flag).
- Do not commit without user confirmation at Phase 4 step 3.
- Do not skip the typecheck gate (it lives inside the adapter; if it fails, the component is marked failed).
- Do not let documentalist failure halt the batch — it is non-blocking.
- Do not silently re-build already-integrated components — require `--force` for that.
