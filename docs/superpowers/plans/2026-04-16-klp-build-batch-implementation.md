# `/klp-build-batch` Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a `/klp-build-batch` slash command that ingests N Figma components serially through the existing per-component pipeline, with 3 user gates total instead of ~30.

**Architecture:** Pure orchestration layer on top of the existing `figma-extractor` / `component-adapter` / `documentalist` subagents and `scripts/validate-tokens.mjs`. Zero modifications to those existing pieces. The new slash command (markdown) drives Claude main through 5 phases: discovery, extract, pre-install deps, build loop (adapt → validate → document), review + commit. A small `scripts/batch-state.mjs` helper persists progress under `.klp/staging/`.

**Tech Stack:** Node.js (ES modules), Bash, Markdown for the slash command, Figma Console MCP for discovery.

**Spec:** `docs/superpowers/specs/2026-04-16-klp-batch-build-design.md`

---

## Task 1: Foundation — staging dir + gitignore

**Files:**
- Modify: `.gitignore` (add 1 line)
- Create: `.klp/staging/.gitkeep` (so git tracks the empty dir if needed — actually no, gitignored dirs don't need .gitkeep; skip)

- [ ] **Step 1: Add staging dir to .gitignore**

Read current `.gitignore`, then append `.klp/staging` under the existing `# Agent-local artefacts` block.

Run:

```bash
cat /Users/morillonbaptiste/klp-design-system/.gitignore
```

Expected output (current):

```
node_modules
dist
.DS_Store
*.log
.vite
coverage

# Agent-local artefacts
.klp/token-gaps.md
docs/.lint-report.md
```

Edit `.gitignore` to add `.klp/staging` at the top of the agent-local artefacts block:

```
node_modules
dist
.DS_Store
*.log
.vite
coverage

# Agent-local artefacts
.klp/staging
.klp/token-gaps.md
docs/.lint-report.md
```

- [ ] **Step 2: Create the staging directory (so subsequent commands don't error on mkdir race)**

Run:

```bash
mkdir -p /Users/morillonbaptiste/klp-design-system/.klp/staging
```

Expected: silent success.

- [ ] **Step 3: Verify gitignore works**

Run:

```bash
cd /Users/morillonbaptiste/klp-design-system && touch .klp/staging/test-gitignore && git status --short && rm .klp/staging/test-gitignore
```

Expected output: only the modified `.gitignore` should appear (`M .gitignore`). The `test-gitignore` file MUST NOT appear in the status.

- [ ] **Step 4: Commit**

```bash
cd /Users/morillonbaptiste/klp-design-system
git add .gitignore
git commit -m "chore(gitignore): add .klp/staging for batch build state"
```

---

## Task 2: `scripts/batch-state.mjs` helper

**Files:**
- Create: `/Users/morillonbaptiste/klp-design-system/scripts/batch-state.mjs`

This script persists the per-component status of an in-progress batch under `.klp/staging/batch-<timestamp>.json`, with `latest.json` tracking the most recent batch. Three subcommands:

- `init <comma-separated-names>` — start a fresh batch state
- `update <name> <status> [error-json]` — update one component's status
- `report` — print final formatted summary

`status` values: `pending | extracted | adapted | validated | documented | failed | skipped`

- [ ] **Step 1: Create the script file with the full implementation**

Create `/Users/morillonbaptiste/klp-design-system/scripts/batch-state.mjs` with this exact content:

```js
#!/usr/bin/env node
// klp batch-state — persist per-component status for /klp-build-batch.
// Usage:
//   node scripts/batch-state.mjs init <name1,name2,...>
//   node scripts/batch-state.mjs update <name> <status> [errorJSON]
//   node scripts/batch-state.mjs report
//   node scripts/batch-state.mjs path     # prints path to latest batch file

import fs from 'node:fs'
import path from 'node:path'

const VALID_STATUSES = new Set([
  'pending', 'extracted', 'adapted', 'validated', 'documented', 'failed', 'skipped',
])

const repoRoot = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..')
const stagingDir = path.join(repoRoot, '.klp', 'staging')
const latestPath = path.join(stagingDir, 'latest.json')

function ensureStagingDir() {
  if (!fs.existsSync(stagingDir)) {
    fs.mkdirSync(stagingDir, { recursive: true })
  }
}

function loadLatest() {
  if (!fs.existsSync(latestPath)) return null
  return JSON.parse(fs.readFileSync(latestPath, 'utf-8'))
}

function saveLatest(state) {
  fs.writeFileSync(latestPath, JSON.stringify(state, null, 2) + '\n')
  // also write the timestamped snapshot for diff/history
  const snapshotPath = path.join(stagingDir, `batch-${state.startedAt}.json`)
  fs.writeFileSync(snapshotPath, JSON.stringify(state, null, 2) + '\n')
}

function cmdInit(rawNames) {
  ensureStagingDir()
  if (!rawNames) {
    console.error('Usage: batch-state.mjs init <name1,name2,...>')
    process.exit(2)
  }
  const names = rawNames.split(',').map((n) => n.trim()).filter(Boolean)
  if (names.length === 0) {
    console.error('No component names provided')
    process.exit(2)
  }
  const startedAt = new Date().toISOString().replace(/[:.]/g, '-')
  const state = {
    startedAt,
    components: Object.fromEntries(
      names.map((name) => [name, { status: 'pending', warnings: [], error: null }])
    ),
  }
  saveLatest(state)
  console.log(JSON.stringify({ ok: true, startedAt, count: names.length }, null, 2))
}

function cmdUpdate(name, status, errorJson) {
  if (!name || !status) {
    console.error('Usage: batch-state.mjs update <name> <status> [errorJSON]')
    process.exit(2)
  }
  if (!VALID_STATUSES.has(status)) {
    console.error(`Invalid status "${status}". Valid: ${[...VALID_STATUSES].join(', ')}`)
    process.exit(2)
  }
  const state = loadLatest()
  if (!state) {
    console.error('No batch in progress. Run `init` first.')
    process.exit(2)
  }
  if (!state.components[name]) {
    console.error(`Component "${name}" not in current batch`)
    process.exit(2)
  }
  state.components[name].status = status
  if (errorJson) {
    try {
      state.components[name].error = JSON.parse(errorJson)
    } catch {
      state.components[name].error = { raw: errorJson }
    }
  }
  saveLatest(state)
  console.log(JSON.stringify({ ok: true, name, status }))
}

function cmdReport() {
  const state = loadLatest()
  if (!state) {
    console.error('No batch in progress.')
    process.exit(2)
  }
  const buckets = { documented: [], failed: [], skipped: [], inProgress: [] }
  for (const [name, c] of Object.entries(state.components)) {
    if (c.status === 'documented') buckets.documented.push({ name, warnings: c.warnings })
    else if (c.status === 'failed') buckets.failed.push({ name, error: c.error })
    else if (c.status === 'skipped') buckets.skipped.push({ name })
    else buckets.inProgress.push({ name, status: c.status })
  }
  const lines = []
  lines.push(`Batch started at ${state.startedAt}`)
  lines.push('')
  lines.push(`✅ SUCCESS (${buckets.documented.length})`)
  for (const c of buckets.documented) {
    lines.push(`  • ${c.name}` + (c.warnings.length ? `  (${c.warnings.length} warnings)` : ''))
  }
  if (buckets.failed.length > 0) {
    lines.push('')
    lines.push(`❌ FAILED (${buckets.failed.length})`)
    for (const c of buckets.failed) {
      lines.push(`  • ${c.name}: ${c.error?.message ?? c.error?.stage ?? 'unknown error'}`)
    }
  }
  if (buckets.skipped.length > 0) {
    lines.push('')
    lines.push(`⊘ SKIPPED (${buckets.skipped.length})`)
    for (const c of buckets.skipped) lines.push(`  • ${c.name}`)
  }
  if (buckets.inProgress.length > 0) {
    lines.push('')
    lines.push(`⏳ INCOMPLETE (${buckets.inProgress.length})  — batch may have crashed mid-run`)
    for (const c of buckets.inProgress) lines.push(`  • ${c.name} (last status: ${c.status})`)
  }
  lines.push('')
  console.log(lines.join('\n'))
}

function cmdPath() {
  if (!fs.existsSync(latestPath)) {
    console.error('No batch in progress.')
    process.exit(2)
  }
  console.log(latestPath)
}

const [, , subcmd, ...args] = process.argv
switch (subcmd) {
  case 'init':   cmdInit(args[0]); break
  case 'update': cmdUpdate(args[0], args[1], args[2]); break
  case 'report': cmdReport(); break
  case 'path':   cmdPath(); break
  default:
    console.error('Usage: batch-state.mjs <init|update|report|path> [args...]')
    process.exit(2)
}
```

- [ ] **Step 2: Verify init works**

Run:

```bash
cd /Users/morillonbaptiste/klp-design-system
node scripts/batch-state.mjs init Alpha,Beta,Gamma
```

Expected stdout:

```json
{
  "ok": true,
  "startedAt": "<some ISO timestamp>",
  "count": 3
}
```

And `.klp/staging/latest.json` exists with 3 components in `pending` status:

```bash
cat .klp/staging/latest.json
```

Expected: JSON object with `components: { Alpha: { status: "pending", ... }, Beta: ..., Gamma: ... }`.

- [ ] **Step 3: Verify update works**

Run:

```bash
cd /Users/morillonbaptiste/klp-design-system
node scripts/batch-state.mjs update Alpha documented
node scripts/batch-state.mjs update Beta failed '{"stage":"validate","message":"3 mismatches persist"}'
node scripts/batch-state.mjs update Gamma skipped
```

Expected: each prints `{"ok":true,"name":"...","status":"..."}`.

Verify state:

```bash
cat .klp/staging/latest.json
```

Expected: Alpha status=`documented`, Beta status=`failed` with structured error, Gamma status=`skipped`.

- [ ] **Step 4: Verify report works**

Run:

```bash
cd /Users/morillonbaptiste/klp-design-system
node scripts/batch-state.mjs report
```

Expected stdout (formatted, with appropriate counts):

```
Batch started at <timestamp>

✅ SUCCESS (1)
  • Alpha

❌ FAILED (1)
  • Beta: 3 mismatches persist

⊘ SKIPPED (1)
  • Gamma
```

- [ ] **Step 5: Verify error cases**

Run:

```bash
cd /Users/morillonbaptiste/klp-design-system
node scripts/batch-state.mjs update Unknown documented 2>&1; echo "exit=$?"
```

Expected: `Component "Unknown" not in current batch` then `exit=2`.

```bash
node scripts/batch-state.mjs update Alpha invalidstatus 2>&1; echo "exit=$?"
```

Expected: `Invalid status "invalidstatus". Valid: pending, extracted, ...` then `exit=2`.

- [ ] **Step 6: Clean up test state**

Run:

```bash
cd /Users/morillonbaptiste/klp-design-system
rm -rf .klp/staging/*
```

Expected: silent.

- [ ] **Step 7: Commit**

```bash
cd /Users/morillonbaptiste/klp-design-system
git add scripts/batch-state.mjs
git commit -m "feat(scripts): add batch-state.mjs for /klp-build-batch progress tracking"
```

---

## Task 3: `.claude/commands/klp-build-batch.md` slash command

**Files:**
- Create: `/Users/morillonbaptiste/klp-design-system/.claude/commands/klp-build-batch.md`

This is the orchestrator. It is a markdown file Claude Code reads and executes step by step. Mirrors the structure of `klp-build-component.md` but for batch operation.

- [ ] **Step 1: Create the slash command file with the full content**

Create `/Users/morillonbaptiste/klp-design-system/.claude/commands/klp-build-batch.md` with this exact content:

````markdown
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
````

- [ ] **Step 2: Verify the file is well-formed**

Run:

```bash
cd /Users/morillonbaptiste/klp-design-system
wc -l .claude/commands/klp-build-batch.md
head -10 .claude/commands/klp-build-batch.md
```

Expected: ~150-200 lines. Frontmatter (between `---` lines) at the top with `description`, `argument-hint`, `allowed-tools` keys.

- [ ] **Step 3: Verify the slash command appears in the skills list**

Run:

```bash
ls -la /Users/morillonbaptiste/klp-design-system/.claude/commands/
```

Expected: both `klp-build-component.md` (existing) and `klp-build-batch.md` (new) present.

- [ ] **Step 4: Commit**

```bash
cd /Users/morillonbaptiste/klp-design-system
git add .claude/commands/klp-build-batch.md
git commit -m "feat(commands): add /klp-build-batch slash command"
```

---

## Task 4: Update CLAUDE.md

**Files:**
- Modify: `/Users/morillonbaptiste/klp-design-system/CLAUDE.md` (add ~8 lines in 2 places)

- [ ] **Step 1: Read the current CLAUDE.md to know exact insertion points**

Run:

```bash
grep -n "Workflow\|Useful paths\|verify-reports" /Users/morillonbaptiste/klp-design-system/CLAUDE.md
```

Expected: line numbers for the `## Workflow` heading and the `## Useful paths` heading.

- [ ] **Step 2: Add batch workflow to the Workflow section**

In `CLAUDE.md`, locate the bullet that starts with `- Bootstrap a new component: \`/klp-build-component\`` (under `## Workflow`). Immediately after that bullet's closing colon-list, add this new bullet:

```markdown
- Batch import N components from Figma: `/klp-build-batch [--page=Components] [--names=A,B,C] [--force]` — discovers candidates on the named Figma page, then runs extract → adapt → validate → document SERIALLY for each. 3 user gates total (start / mid-batch failures / final commit). Use this when integrating 3+ components at once.
- Expected Figma structure for batch: a single page named `Components` containing `Section`s named per category (e.g. `Inputs`, `Overlays`, `Feedback`). Each section contains `COMPONENT_SET` nodes. Section names map to spec `category`; component-set names map to component `name` (kebab-cased).
```

- [ ] **Step 3: Add new file paths to the Useful paths section**

Locate `## Useful paths`. After the line `- Slash command: \`.claude/commands/klp-build-component.md\``, add these two lines:

```markdown
- Batch slash command: `.claude/commands/klp-build-batch.md`
- Batch state helper: `scripts/batch-state.mjs` (writes to `.klp/staging/`, gitignored)
```

- [ ] **Step 4: Verify the edits**

Run:

```bash
grep -A1 "klp-build-batch" /Users/morillonbaptiste/klp-design-system/CLAUDE.md
```

Expected: at least 2 hits — one in the Workflow bullet, one in the Useful paths.

- [ ] **Step 5: Commit**

```bash
cd /Users/morillonbaptiste/klp-design-system
git add CLAUDE.md
git commit -m "docs(claude.md): document /klp-build-batch workflow + paths"
```

---

## Task 5: Update `docs/overview.md`

**Files:**
- Modify: `/Users/morillonbaptiste/klp-design-system/docs/overview.md`

The documentalist regenerates `docs/overview.md`. To preserve our addition across regenerations, place it between `<!-- KLP:NOTES:BEGIN --> ... <!-- KLP:NOTES:END -->` markers (per the CLAUDE.md "Don'ts" rule).

- [ ] **Step 1: Check if markers already exist**

Run:

```bash
grep -n "KLP:NOTES" /Users/morillonbaptiste/klp-design-system/docs/overview.md
```

Two cases:

- **Case A: markers exist** — note the line numbers, content goes between them.
- **Case B: markers do NOT exist** — add them at the very end of the file (just before any final newline).

- [ ] **Step 2: Add the batch workflow section**

If Case A: locate `<!-- KLP:NOTES:END -->`. Insert the following content immediately BEFORE that marker:

```markdown

## Batch import from Figma

When you have 3+ components to integrate at once (e.g. a sprint to bring in a backlog of base components), use `/klp-build-batch` instead of running `/klp-build-component` repeatedly. The batch flow:

1. **Discovery** — scans the Figma page named `Components` and lists every `COMPONENT_SET` inside named `Section`s. Compares against `klp-components.json` and proposes only the new ones (use `--force` to include already-integrated).
2. **Extract all specs** — runs the existing `figma-extractor` agent serially for each candidate.
3. **Pre-install deps** — collects every Radix primitive needed and runs a single `pnpm add`.
4. **Build loop** — for each spec, adapt → validate → document via the existing agents/scripts. No agent modifications.
5. **Review + commit** — single visual review at the playground, then choose 1 grouped commit or N separate commits.

User gates: 3 total (start, optional mid-batch on failures, end commit).

**Required Figma structure:** one page named `Components` (case-insensitive); inside it, `Section`s named by category (`Inputs`, `Overlays`, etc.); inside each section, `COMPONENT_SET` nodes named in kebab-case for the component (`button`, `alert-dialog`).

Use the unitary `/klp-build-component <name>` for ad-hoc single-component additions outside a backlog session.

```

If Case B: add this BEFORE adding the section above:

```markdown

<!-- KLP:NOTES:BEGIN -->
<!-- KLP:NOTES:END -->
```

Then re-do Step 2 with the markers in place.

- [ ] **Step 3: Verify the section is present and bracketed by markers**

Run:

```bash
sed -n '/KLP:NOTES:BEGIN/,/KLP:NOTES:END/p' /Users/morillonbaptiste/klp-design-system/docs/overview.md | head -20
```

Expected: shows the markers + the new "Batch import from Figma" section between them.

- [ ] **Step 4: Commit**

```bash
cd /Users/morillonbaptiste/klp-design-system
git add docs/overview.md
git commit -m "docs(overview): document the /klp-build-batch workflow"
```

---

## Task 6: Smoke test on a small batch

**Files:** none

Run a real end-to-end test with a tiny batch to verify the new command works without breaking anything. This task is USER-DRIVEN — you (the engineer) confirm Figma is set up, then trigger the command and observe.

- [ ] **Step 1: Confirm Figma is paired and has at least 2 component candidates not yet integrated**

Pre-conditions:
- Figma desktop app is open with the relevant file
- Figma Console plugin is paired to Claude Code
- The Figma file has a page (any name — defaults to `Components`) with at least 2 `COMPONENT_SET` nodes that don't appear in `klp-components.json` yet

If all pre-conditions are met, proceed. Otherwise, set them up first.

- [ ] **Step 2: Run the batch command with explicit names**

Run (in Claude Code chat):

```
/klp-build-batch --names=Tooltip,Badge
```

Substitute `Tooltip,Badge` with two real component names that exist in your Figma file but NOT in `klp-components.json`.

Observe:
- No Figma scan happens (because `--names` was provided)
- Phase 1 extracts both specs serially
- Phase 2 pre-installs deps (probably 1-2 new Radix primitives)
- Phase 3 loops through both, dispatching adapter → validator → documentalist
- Phase 4 produces a summary, asks how to commit

- [ ] **Step 3: Verify the unitary pipeline still works (regression check)**

After the batch finishes, run a SINGLE-component build to confirm the existing pipeline is intact:

```
/klp-build-component <some-other-figma-component>
```

Expected: identical behavior to before this batch feature was added. Same 4 stages, same output format, same prompts.

- [ ] **Step 4: If everything works, no further action needed**

The implementation is complete. The full backlog can now be ingested via `/klp-build-batch` (no `--names`, defaulting to scanning the `Components` page).

If any step failed, debug per the failure mode and reopen the relevant task.

---

## Self-review notes (post-write)

**Spec coverage check:**
- ✅ Phase 0 discovery → Task 3 step 1 (slash command file)
- ✅ Phase 1 extract → Task 3 step 1
- ✅ Phase 2 pre-install → Task 3 step 1
- ✅ Phase 3 build loop → Task 3 step 1
- ✅ Phase 4 review + commit → Task 3 step 1
- ✅ batch-state helper → Task 2
- ✅ gitignore → Task 1
- ✅ CLAUDE.md updates → Task 4
- ✅ docs/overview.md updates → Task 5
- ✅ Verification (smoke test + regression) → Task 6

**Type/name consistency check:**
- `batch-state.mjs` uses statuses `pending | extracted | adapted | validated | documented | failed | skipped`. The slash command (Task 3) calls `update <name> extracted`, `update <name> adapted`, `update <name> validated`, `update <name> documented`, `update <name> failed`. All match.
- The slash command's argument flags (`--page`, `--names`, `--force`) match the spec's Phase 0 description. Naming consistent.

**Placeholder scan:** no TBD/TODO/"implement later". Every code block contains complete content.
