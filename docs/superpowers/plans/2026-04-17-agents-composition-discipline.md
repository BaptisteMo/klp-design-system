# Composition Discipline for klp Agents — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make the klp pipeline systematically detect, reuse, and report-on composition across agents so future composite components are built by combining existing DS primitives (Button, Badges, Input, …) instead of reinventing them.

**Architecture:** Evolve three existing agent prompts (figma-extractor, component-adapter, documentalist) and extend the existing validator script. No new subagent. The extractor flags Figma INSTANCE nodes against `klp-components.json`; the adapter enforces a Do/Don't rulebook and reports gaps; `validate-tokens.mjs` gains two new check families (reuse + icons) on top of the existing tokens check; the documentalist scans `@/components/*` imports to keep the dependency graph in sync and persists gap reports per-component + aggregated in `docs/gaps.md`.

**Tech Stack:** Markdown (agent prompts, CLAUDE.md, docs), Node.js (validate-tokens.mjs), existing `/klp-build-component` + `/klp-build-batch` slash commands (unchanged). Spec file: `docs/superpowers/specs/2026-04-17-agents-composition-discipline-design.md`.

---

## File Structure

**Modified (no new files):**

| Path | Responsibility |
|---|---|
| `scripts/validate-tokens.mjs` | Token check (existing) + reuse check + icons check. Output restructured as `checks.*`. Flat `mismatches[]` + `warnings[]` kept for BC. |
| `.claude/agents/figma-extractor.md` | Add bootstrap read of `klp-components.json`, INSTANCE detection per anatomy part, `composition` field emission. |
| `.claude/agents/component-adapter.md` | Add "Composition discipline" rulebook (Do/Don't + closed-set gap vocabulary). Enrich output JSON with `reuses[]` + `gaps[]`. |
| `.claude/agents/documentalist.md` | Systematic `@/components/*` import scan on DOCUMENT + SYNC. Write `KLP:GAPS` block per component. Maintain `docs/gaps.md`. |
| `.claude/skills/klp-token-validator/SKILL.md` | Document the new `checks` output shape and the new check families. |
| `CLAUDE.md` | Add composition discipline to workflow + useful paths for `docs/gaps.md`. |
| `docs/overview.md` | New "Composition workflow" subsection inside `KLP:NOTES` markers. |
| `package.json` | Add `validate:tokens:all` script for migration + ongoing batch checks. |

**Written by agents at runtime (no manual creation):**

- `docs/gaps.md` — full regeneration by documentalist at every DOCUMENT/SYNC.
- `docs/components/_index_<name>.md` — extended with `KLP:GAPS:BEGIN/END` block.
- `klp-components.json` entries — `dependencies.components[]` + `usedBy[]` updated via documentalist scan.
- `.klp/figma-refs/<name>/spec.json` — new `composition` field + per-anatomy `klpComponent*` fields when extractor runs on new components.

---

## Ordering rationale

1. **Validator first** (Tasks 1–3): smallest surface, testable in isolation via script invocation, backward-compat shield (v1 specs skip the new checks, so nothing breaks on existing components).
2. **Agent prompts next** (Tasks 4–7): once validator is ready to consume new spec fields, evolve extractor then adapter then documentalist.
3. **Skill + docs updates** (Tasks 8–10): reflect the new behaviors in the user-facing documentation.
4. **Migration** (Tasks 11–12): one-shot documentalist SYNC + batch validator run on the existing 17 components to backfill the graph.
5. **End-to-end verification** (Task 13): build one synthetic composite and walk through the whole v2 pipeline.

---

## Task 1: Restructure validator output into `checks.*` (backward-compatible)

**Why:** Open the door for two new check families while keeping existing integrations working. Before this restructure, the script emits `{ mismatches, warnings }` flat. After, it emits `{ checks: { tokens, reuse, icons }, mismatches, warnings }` where flat fields are the union of all three. Existing callers (Stage 3 of `/klp-build-component`, `/klp-build-batch`) keep reading flat fields.

**Files:**
- Modify: `scripts/validate-tokens.mjs`

- [ ] **Step 1: Read current output shape from the script tail**

Run: `node scripts/validate-tokens.mjs switch | head -20`
Expected: sees fields `component`, `radixPrimitive`, `passed`, `mismatchCount`, `warningCount`, `mismatches`, `warnings`.

- [ ] **Step 2: Refactor `validate(componentName)` to compute checks per family**

Replace the final `return` at the bottom of the `validate` function with the structure below. Keep every existing check untouched — only wrap them and add empty stubs for the two new families. Find the function at `scripts/validate-tokens.mjs` (around line 206, search `function validate(componentName)`).

```js
function validate(componentName) {
  // ... existing prelude: load spec, source, cvaBlocks, stateMap (unchanged) ...

  const tokenMismatches = []
  const tokenWarnings = []
  // existing hex-literal / primitive-token / missing-lucide-import / inline-svg scans
  // → push into tokenWarnings (rename local `warnings` to `tokenWarnings`)
  // existing per-variant validation → push mismatches into `tokenMismatches`
  // NOTE: move the existing inline-svg block OUT of tokenWarnings; see Task 3.

  // NEW: reuse check (empty in this task, filled in Task 2)
  const reuseMismatches = []
  const reuseWarnings = []

  // NEW: icons check (empty in this task, filled in Task 3)
  const iconsMismatches = []
  const iconsWarnings = []

  const checks = {
    tokens: {
      passed: tokenMismatches.length === 0,
      mismatchCount: tokenMismatches.length,
      warningCount: tokenWarnings.length,
      mismatches: tokenMismatches,
      warnings: tokenWarnings,
    },
    reuse: {
      passed: reuseMismatches.length === 0,
      mismatchCount: reuseMismatches.length,
      warningCount: reuseWarnings.length,
      mismatches: reuseMismatches,
      warnings: reuseWarnings,
    },
    icons: {
      passed: iconsMismatches.length === 0,
      mismatchCount: iconsMismatches.length,
      warningCount: iconsWarnings.length,
      mismatches: iconsMismatches,
      warnings: iconsWarnings,
    },
  }

  const mismatches = [...tokenMismatches, ...reuseMismatches, ...iconsMismatches]
  const warnings = [...tokenWarnings, ...reuseWarnings, ...iconsWarnings]

  return {
    component: componentName,
    radixPrimitive: spec.radixPrimitive,
    passed: mismatches.length === 0,
    mismatchCount: mismatches.length,
    warningCount: warnings.length,
    checks,
    mismatches, // BC flat list
    warnings,   // BC flat list
  }
}
```

Before returning, rename every occurrence of the local `mismatches` and `warnings` arrays inside `validate()` to `tokenMismatches` / `tokenWarnings`. The top-level `mismatches` / `warnings` constants above are the unions.

- [ ] **Step 3: Verify on a known component that the output still lists mismatches/warnings at the top level**

Run: `node scripts/validate-tokens.mjs switch 2>&1 | python3 -c 'import sys,json; d=json.loads(sys.stdin.read()); print("passed", d["passed"]); print("keys", list(d.keys())); print("checks", list(d["checks"].keys())); print("flat m", len(d["mismatches"]), "flat w", len(d["warningCount"] if False else d["warnings"]))'`
Expected: `passed True`, `keys` contains `checks` and `mismatches`/`warnings`, `checks` has `['tokens', 'reuse', 'icons']`, the flat `mismatches` count matches `checks.tokens.mismatchCount` (since reuse/icons are empty).

- [ ] **Step 4: Verify on a component with known warnings (button)**

Run: `node scripts/validate-tokens.mjs button 2>&1 | python3 -c 'import sys,json; d=json.loads(sys.stdin.read()); print(d["passed"], d["warningCount"], d["checks"]["tokens"]["warningCount"])'`
Expected: `True <N> <N>` where the two N values are equal (all current warnings live under `checks.tokens`).

- [ ] **Step 5: Commit**

```bash
git add scripts/validate-tokens.mjs
git commit -m "refactor(validator): restructure output into checks.{tokens,reuse,icons} (empty stubs for new families)"
```

---

## Task 2: Implement the `reuse` check

**Why:** Enforce that when the spec declares `klpComponent: "X"` on an anatomy part, the source imports and uses `X` from `@/components/X`. Reverse rule: any source import from `@/components/*` not declared in the spec becomes a warning (probably intentional, surfaced for review).

**Files:**
- Modify: `scripts/validate-tokens.mjs`

- [ ] **Step 1: Add helper to parse `@/components/<name>` imports from source**

Near the top of `scripts/validate-tokens.mjs` (with the other helpers, after `tokenizeClasses`):

```js
// Find all DS-component imports in a source file. Returns a map
// { '<kebab-name>': { pascalNames: Set<string>, line: number } }.
function extractDsImports(source) {
  const out = new Map()
  const importRe = /import\s+(?:\*\s+as\s+\w+|\{([^}]+)\}|(\w+))\s+from\s+['"]@\/components\/([\w-]+)['"]/g
  for (const m of source.matchAll(importRe)) {
    const namedClause = m[1]
    const defaultClause = m[2]
    const pkg = m[3]
    const line = source.slice(0, m.index).split('\n').length
    const pascalNames = new Set()
    if (namedClause) {
      for (const n of namedClause.split(',')) {
        const trimmed = n.replace(/\s+as\s+\w+/, '').trim()
        if (trimmed) pascalNames.add(trimmed)
      }
    }
    if (defaultClause) pascalNames.add(defaultClause)
    const existing = out.get(pkg)
    if (existing) {
      for (const n of pascalNames) existing.pascalNames.add(n)
    } else {
      out.set(pkg, { pascalNames, line })
    }
  }
  return out
}
```

- [ ] **Step 2: Add helper to check whether a source uses a JSX element**

Right after `extractDsImports`:

```js
// Returns true if the source contains any JSX opening tag or namespace
// access matching the given pascal name (e.g. `<Button`, `<Button\n`,
// `<Button.Foo`, `Button.Foo`).
function usesPascalName(source, pascal) {
  const re = new RegExp(`(?:<${pascal}[\\s/>]|\\b${pascal}\\.)`)
  return re.test(source)
}
```

- [ ] **Step 3: Add helper to load the klp-components.json integrated set**

Right after `usesPascalName`:

```js
function loadKlpComponentsSet(repoRoot) {
  const p = path.join(repoRoot, 'klp-components.json')
  if (!fs.existsSync(p)) return new Set()
  try {
    const data = JSON.parse(fs.readFileSync(p, 'utf-8'))
    return new Set((data.components ?? []).map((c) => c.name))
  } catch {
    return new Set()
  }
}
```

- [ ] **Step 4: Implement the reuse check in `validate()`**

Inside the `validate()` function, after the tokens checks run and before the return, populate `reuseMismatches` / `reuseWarnings`:

```js
// --- reuse check -------------------------------------------------------
const integratedSet = loadKlpComponentsSet(repoRoot)
const dsImports = extractDsImports(source)
const instances = spec.composition?.instances ?? []

// Forward rule: each declared klpComponent must be imported + used.
for (const inst of instances) {
  const klp = inst.klpComponent
  if (!klp) continue // candidate-only entries are handled as adapter gaps
  const importEntry = dsImports.get(klp)
  if (!importEntry) {
    reuseMismatches.push({
      kind: 'missing-import',
      part: inst.part,
      klpComponent: klp,
      hint: `Spec declares klpComponent="${klp}" on part "${inst.part}" but source does not import from '@/components/${klp}'.`,
    })
    continue
  }
  const pascal = kebabToPascal(klp)
  if (!usesPascalName(source, pascal)) {
    reuseMismatches.push({
      kind: 'imported-not-used',
      part: inst.part,
      klpComponent: klp,
      hint: `Source imports '@/components/${klp}' but does not render <${pascal}>.`,
    })
  }
}

// Reverse rule: each DS import should correspond to a declared reuse.
const declaredReuses = new Set((spec.composition?.reuses ?? []))
for (const [pkg] of dsImports) {
  if (!integratedSet.has(pkg)) {
    reuseWarnings.push({
      kind: 'import-unknown-component',
      component: pkg,
      hint: `Source imports '@/components/${pkg}' but this component is not registered in klp-components.json.`,
    })
    continue
  }
  if (!declaredReuses.has(pkg)) {
    reuseWarnings.push({
      kind: 'undeclared-reuse',
      component: pkg,
      hint: `Source imports '@/components/${pkg}' but spec.composition.reuses does not list it. Verify this is intentional or add it to the spec.`,
    })
  }
}
```

Note: when `spec.composition` is absent (v1 specs), `instances` is `[]` and `declaredReuses` is `new Set()`. The forward loop is a no-op. The reverse loop produces only the `undeclared-reuse` warning for any DS import present — acceptable because v1 components predate the discipline; warnings do not fail the run.

- [ ] **Step 5: Verify on an existing v1-spec component (backward compat)**

Run: `node scripts/validate-tokens.mjs list-content 2>&1 | python3 -c 'import sys,json; d=json.loads(sys.stdin.read()); r=d["checks"]["reuse"]; print("pass", r["passed"], "m", r["mismatchCount"], "w", r["warningCount"]); print([x["kind"] for x in r["warnings"]])'`
Expected: `pass True m 0 w 1`, warning kinds include `['undeclared-reuse']` (because `list-content` imports Button but spec v1 has no `composition` field).

- [ ] **Step 6: Verify that top-level `passed` remains True despite the reuse warning**

Run: `node scripts/validate-tokens.mjs list-content 2>&1 | python3 -c 'import sys,json; d=json.loads(sys.stdin.read()); print(d["passed"], d["mismatchCount"])'`
Expected: `True 0`.

- [ ] **Step 7: Commit**

```bash
git add scripts/validate-tokens.mjs
git commit -m "feat(validator): add reuse check — forward import discipline + reverse undeclared-reuse warning"
```

---

## Task 3: Implement the `icons` check (upgrade inline-svg to mismatch with escape hatch)

**Why:** Today inline-SVG only raises a warning. The spec upgrades it to a mismatch unless a preceding comment opts out via `{/* allow-inline-svg: <reason> */}`.

**Files:**
- Modify: `scripts/validate-tokens.mjs`

- [ ] **Step 1: Remove the current inline-SVG warning push and rewrite as a dedicated check**

Find the block in `validate()` that matches `<svg\b` and currently pushes a `warnings.push({ type: 'inline-svg', ... })`. Delete that block.

Add, in its place, an icons-check block that populates `iconsMismatches` / `iconsWarnings`:

```js
// --- icons check -------------------------------------------------------
// Flag every <svg or <path JSX opening tag. Exception: the line
// immediately preceding contains `allow-inline-svg:<reason>`.
const sourceLines = source.split('\n')
const svgRe = /<(svg|path)\b/
for (let i = 0; i < sourceLines.length; i++) {
  const line = sourceLines[i]
  if (!svgRe.test(line)) continue
  const prev = i > 0 ? sourceLines[i - 1] : ''
  const allowed = /allow-inline-svg\s*:/.test(prev)
  const snippet = line.trim().slice(0, 120)
  if (allowed) {
    iconsWarnings.push({
      kind: 'allowed-inline-svg',
      line: i + 1,
      snippet,
      hint: 'Inline SVG explicitly allowed via preceding comment. Keep the justification up to date.',
    })
  } else {
    iconsMismatches.push({
      kind: 'inline-svg',
      line: i + 1,
      snippet,
      hint: 'Replace with a lucide-react import, or add `{/* allow-inline-svg: <reason> */}` on the previous line if truly needed.',
    })
  }
}
```

- [ ] **Step 2: Verify on an existing component that has no inline SVG (button)**

Run: `node scripts/validate-tokens.mjs button 2>&1 | python3 -c 'import sys,json; d=json.loads(sys.stdin.read()); i=d["checks"]["icons"]; print(i["passed"], i["mismatchCount"], i["warningCount"])'`
Expected: `True 0 0`.

- [ ] **Step 3: Verify on every current component that the icons check passes (should be the case: lucide-react is already enforced)**

Run:
```bash
for c in $(node -e 'const d=require("./klp-components.json");console.log(d.components.map(c=>c.name).join("\n"))'); do
  echo -n "$c: "
  node scripts/validate-tokens.mjs "$c" 2>&1 | python3 -c 'import sys,json; d=json.loads(sys.stdin.read()); i=d["checks"]["icons"]; print("icons", i["passed"], "m", i["mismatchCount"])'
done
```
Expected: every component shows `icons True m 0`. If any shows `m >= 1`, inspect the file and either switch to lucide or add the escape-hatch comment — that fix is part of this task.

- [ ] **Step 4: Smoke-test the escape hatch**

Write a temporary test fixture:
```bash
mkdir -p /tmp/klp-icons-smoke && cat > /tmp/klp-icons-smoke/Widget.tsx <<'EOF'
export function Widget() {
  return (
    <div>
      {/* allow-inline-svg: brand mark, never swapped out */}
      <svg viewBox="0 0 10 10"><path d="M0 0h10v10H0z"/></svg>
    </div>
  )
}
EOF
```

Then add a one-shot check directly in the REPL (do NOT commit this):
```bash
node -e '
import("./scripts/validate-tokens.mjs").then(m => { /* module is side-effect-only today */ })
' 2>&1 || true
```
(Skip this step if the module is not importable — the real verification runs in Task 13 on a real component.)

- [ ] **Step 5: Clean up smoke fixture**

```bash
rm -rf /tmp/klp-icons-smoke
```

- [ ] **Step 6: Commit**

```bash
git add scripts/validate-tokens.mjs
git commit -m "feat(validator): icons check — promote inline-svg warning to mismatch with allow-inline-svg escape hatch"
```

---

## Task 4: Update `klp-token-validator` SKILL.md

**Why:** The skill file is the user-facing reference for what the validator does. It must describe the new `checks` object and the two new check families.

**Files:**
- Modify: `.claude/skills/klp-token-validator/SKILL.md`

- [ ] **Step 1: Read the current SKILL.md to understand its structure**

Run: `cat .claude/skills/klp-token-validator/SKILL.md`
Note the existing sections.

- [ ] **Step 2: Replace the "Output" / "Return shape" section**

Find the section that documents the JSON output (usually titled "Output" or "Return shape"). Replace it with:

```markdown
## Output

The script prints a single JSON object to stdout and exits 0 on pass, 1 on fail.

### Shape

```json
{
  "component": "<name>",
  "radixPrimitive": "<pkg-or-null>",
  "passed": true,
  "mismatchCount": 0,
  "warningCount": 0,
  "checks": {
    "tokens": { "passed": true, "mismatchCount": 0, "warningCount": 0, "mismatches": [], "warnings": [] },
    "reuse":  { "passed": true, "mismatchCount": 0, "warningCount": 0, "mismatches": [], "warnings": [] },
    "icons":  { "passed": true, "mismatchCount": 0, "warningCount": 0, "mismatches": [], "warnings": [] }
  },
  "mismatches": [],
  "warnings": []
}
```

Top-level `mismatches` / `warnings` are flat unions of the three check families, kept for backward compatibility. Top-level `passed` is `true` iff all three `checks.*.passed` are `true`.

### Check families

- **`tokens`** — existing V1-laxest check. Every (layer × state × property) bound in the spec must map to the correct `--klp-*` alias utility in the component's cva blocks.
- **`reuse`** — for each `anatomy[i].klpComponent: "<name>"` in the spec, the component source must import from `@/components/<name>` and render `<PascalName>`. Reverse rule: any DS import that the spec didn't declare surfaces as an `undeclared-reuse` warning.
- **`icons`** — every `<svg` or `<path` JSX tag is a mismatch unless the previous line contains `{/* allow-inline-svg: <reason> */}`.
```

- [ ] **Step 3: Commit**

```bash
git add .claude/skills/klp-token-validator/SKILL.md
git commit -m "docs(skill): klp-token-validator output + 3 check families"
```

---

## Task 5: Evolve `figma-extractor` agent — INSTANCE detection + `composition` field

**Why:** The extractor must surface which anatomy parts are Figma INSTANCE nodes of known DS components, so the adapter can honor them.

**Files:**
- Modify: `.claude/agents/figma-extractor.md`

- [ ] **Step 1: Re-read the current prompt**

Run: `cat .claude/agents/figma-extractor.md`
Locate the section that describes the output schema (usually near the end, under a heading like "Output" or "spec.json shape").

- [ ] **Step 2: Add a "Bootstrap" instruction near the top of the capture flow**

Find the existing ordered-list of capture steps. Insert a new step at the top:

```markdown
0. **Bootstrap.** Read `klp-components.json` at the repo root once. Extract `integratedSet = new Set(components.map(c => c.name))`. You will cross-reference every Figma `INSTANCE` against this set.
```

- [ ] **Step 3: Add per-anatomy-part INSTANCE detection rules**

Find the section that describes how you walk the variant tree and populate `anatomy[]`. Append the following rules:

```markdown
### Composition detection (per anatomy part)

For each anatomy part, look at the Figma node that backs it.

1. If the node `type === "INSTANCE"`, resolve `mainComponent.name` via `figma_get_component_for_development_deep`. Strip the variant suffix to keep only the component-set name. Kebab-case it: this is the `candidate` name.
2. If `integratedSet.has(candidate)`:
   - Set `anatomy[i].klpComponent = candidate`.
   - Infer `klpComponentProps` from the Figma variant string when obvious (e.g. `Button/Tertiary/Icon` → `{ variant: "tertiary", size: "icon" }`). Omit when not obvious.
   - Set `anatomy[i].figmaInstance = { name: "<full-figma-name>", key: "<figma-key>" }`.
3. If the `candidate` is not in `integratedSet`:
   - Set `anatomy[i].klpComponentCandidate = candidate`.
   - Set `anatomy[i].figmaInstance = { name: "<full>", key: "<key>" }`.
4. If the node is not an INSTANCE, add no composition fields (inline-drawn layer).

If `mainComponent` cannot be resolved (cross-file library, detached instance), record `klpComponentCandidate: null` and `figmaInstance: { name: "<raw>", key: null }`.
```

- [ ] **Step 4: Add the top-level `composition` field to the output schema**

Find the output schema section. Add under `anatomy[]`:

```markdown
### `composition` — top-level summary of reuse signals

```json
"composition": {
  "reuses": ["button", "badges"],
  "candidates": ["date-picker"],
  "instances": [
    { "part": "action-button", "klpComponent": "button",            "figmaInstance": { "name": "Button/Tertiary/Icon", "key": "..." } },
    { "part": "calendar",      "klpComponentCandidate": "date-picker", "figmaInstance": { "name": "DatePicker/Default", "key": "..." } }
  ]
}
```

- `reuses` — deduplicated kebab names of `anatomy[].klpComponent` values.
- `candidates` — deduplicated kebab names of `anatomy[].klpComponentCandidate` values.
- `instances` — one entry per anatomy part that is backed by a Figma INSTANCE (either matched or candidate).

If no INSTANCE is found in the whole component, emit `composition: { reuses: [], candidates: [], instances: [] }`.
```

- [ ] **Step 5: Update the final self-check section of the extractor prompt**

Find the "Before returning" / final self-check bullets. Add:

```markdown
- `composition` is present in spec.json.
- Every `anatomy[i].klpComponent` value is in `integratedSet`; otherwise it must be a `klpComponentCandidate`.
- `composition.reuses` matches the set of all `klpComponent` values in `anatomy[]`.
- `composition.candidates` matches the set of all `klpComponentCandidate` values.
```

- [ ] **Step 6: Commit**

```bash
git add .claude/agents/figma-extractor.md
git commit -m "feat(extractor): INSTANCE detection + composition field in spec.json v2"
```

---

## Task 6: Evolve `component-adapter` agent — composition discipline + gaps[]

**Why:** The adapter must reflexively import flagged components, report partial reuses and new creations as typed gaps.

**Files:**
- Modify: `.claude/agents/component-adapter.md`

- [ ] **Step 1: Add a "Composition discipline" section near the top of the prompt (before the generation steps)**

Insert the following section at a logical place (right after the agent description, before "Your responsibilities"):

```markdown
## Composition discipline (MANDATORY)

Before writing any code, read two sources:

1. `spec.json` — consult `spec.composition` and per-`anatomy[]` fields `klpComponent`, `klpComponentCandidate`, `klpComponentProps`, `figmaInstance` **first**.
2. `klp-components.json` — for each component referenced in `spec.composition.reuses`, load its `source` path, `anatomy`, `variantAxes`, and `externals` so you know the exact import path and prop surface.

### DO

- When `anatomy[i].klpComponent` is set, **import the component** from `@/components/<name>` and render it in the JSX. Map `klpComponentProps` onto the component's props when present.
- Before inlining any layer that looks like a Button, Badge, Input, Switch, Checkbox, Radio, Tooltip, or similar, scan `klp-components.json` for a name/displayName match.
- For every recognized DS component (Button, Badge, Input, Switch, Checkbox, Radio, Tooltip, List, Breadcrumbs, …), **always** compose via the DS import — never re-create the styling inline.
- When a DS component needs a one-off visual tweak, use its `className` prop or exposed subparts, **not** a rewrite of its cva.

### DON'T

- Do NOT create a local cva (`actionButtonVariants`, `dismissButtonVariants`, `badgeVariants`, …) that duplicates an existing DS component's cva.
- Do NOT reinvent tokens (covered by the validator; reminded here).
- Do NOT import a DS component and override its critical visual tokens via `className`. If it doesn't match, it's a **gap** — report it.

### Reporting gaps

Every deviation from the Do/Don't must appear in the adapter's return JSON under `gaps[]`. A gap describes a part that was NOT covered by a clean DS import. Use exactly one of the closed-set `kind` values:

| `kind` | When to use |
|---|---|
| `unmatched-instance` | The extractor flagged `klpComponentCandidate` (Figma INSTANCE, but the target component is missing from `klp-components.json`). You inlined a local implementation. |
| `partial-reuse` | A DS component was imported, but its props do not cover 100% of the need and you added `className` overrides or extra siblings. |
| `no-instance-no-match` | Figma doesn't have an INSTANCE, but the visual strongly resembles an existing DS component. You chose to inline for safety. |
| `new-primitive` | Nothing equivalent exists. You created an isolated primitive — candidate for future extraction. |

Every gap entry MUST include: `part`, `kind`, `reason`, `action`, and (when applicable) `figmaInstance`.
```

- [ ] **Step 2: Update the "Return value" / output schema section**

Find the existing section describing what the adapter returns (usually titled "Return" or "Output" near the end). Add the two new fields:

```markdown
### Return shape (v2)

```json
{
  "component": "<kebab-name>",
  "captureBrand": "<brand>",
  "filesCreated": ["..."],
  "filesModified": ["..."],
  "typecheck": "pass" | "fail",
  "reuses": ["button", "badges"],
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
      "reason": "Input lacks a trailing clear-icon slot.",
      "action": "className-override"
    }
  ]
}
```

- `reuses` — deduplicated kebab names of DS components actually imported in the generated source.
- `gaps` — every deviation from the composition discipline, with a typed `kind`.

When there is nothing to report, emit `reuses: []` and `gaps: []` (always present, never omitted).
```

- [ ] **Step 3: Update the backward-compatibility note**

Append a short note to the prompt:

```markdown
### Backward compatibility with v1 specs

If `spec.composition` is absent (v1 spec captured before this discipline existed), run in best-effort mode: no mandatory imports, no forced gap reporting. Still emit `reuses: []` and `gaps: []` in the return JSON. This keeps the pipeline green for migration.
```

- [ ] **Step 4: Commit**

```bash
git add .claude/agents/component-adapter.md
git commit -m "feat(adapter): composition discipline rulebook + reuses/gaps in return JSON"
```

---

## Task 7: Evolve `documentalist` agent — import scan + gap persistence + docs/gaps.md

**Why:** The documentalist must scan source imports to keep `dependencies.components[]` and `usedBy[]` in sync, persist the adapter's `gaps[]` in a scoped markdown block, and aggregate all gaps in `docs/gaps.md`.

**Files:**
- Modify: `.claude/agents/documentalist.md`

- [ ] **Step 1: Add the "Systematic import scan" step to the DOCUMENT operation**

Find the section that describes the DOCUMENT operation flow. Near the start, insert:

```markdown
### Systematic `@/components/*` import scan (DOCUMENT + SYNC)

Before writing the canonical `klp-components.json` entry and the doc page:

1. Read `src/components/<name>/<Component>.tsx` (and `.example.tsx` if present).
2. Regex-match every `from ['"]@/components/([\w-]+)['"]` occurrence to collect a set of imported DS components.
3. For each imported name, verify it exists in `klp-components.json` (otherwise warn: broken/unknown import — record it and continue).
4. Write `dependencies.components: [...]` in the canonical entry for the current component. Sort alphabetically for stable diffs.
5. **Reverse-index pass:** for every component in `dependencies.components`, ensure its `usedBy[]` contains the current component. The pass is idempotent — recompute from scratch each run.

This scan is authoritative. Even if the adapter's `reuses[]` omits a composition edge, the documentalist catches it from the source code.
```

- [ ] **Step 2: Extend the SYNC operation**

Find the SYNC-operation section. Append:

```markdown
### Extended SYNC (full recompute)

On `operation: SYNC`, iterate over every component in `klp-components.json`:

1. Re-run the systematic import scan on each component's source.
2. Rebuild `dependencies.components[]` from scratch for every entry.
3. Reset every `usedBy[]` to `[]`, then re-populate from the freshly computed forward edges.
4. Regenerate each `docs/components/_index_<name>.md` body (preserving only the `KLP:NOTES` and `KLP:GAPS` blocks).
5. Regenerate `docs/gaps.md` (full rewrite — see below).

SYNC is the one-shot migration for components that were manually refactored before this discipline existed.
```

- [ ] **Step 3: Add the `KLP:GAPS` block persistence rule**

Add a subsection inside the DOCUMENT-operation flow (right after the doc-page body generation):

```markdown
### KLP:GAPS block

The adapter's return JSON includes `gaps[]` for the component. Persist it in `docs/components/_index_<name>.md` between markers, always present (even when empty, for diff stability):

```markdown
<!-- KLP:GAPS:BEGIN -->
## DS gaps

<!-- when gaps[] is non-empty: -->
| Part | Kind | Reason | Action |
|---|---|---|---|
| <part> | <kind> | <reason> | <action> |
...

<!-- when gaps[] is empty: -->
No gaps recorded.
<!-- KLP:GAPS:END -->
```

Insert this block near the end of the doc page, right before the `KLP:NOTES` block. If the page already exists, replace everything between the `KLP:GAPS:BEGIN/END` markers — preserve the rest, especially the `KLP:NOTES` block.
```

- [ ] **Step 4: Add the `docs/gaps.md` aggregation rule**

Add a new top-level subsection to the agent prompt:

```markdown
## Aggregated gap report: `docs/gaps.md`

On every DOCUMENT or SYNC run, regenerate `docs/gaps.md` from scratch — no manual blocks to preserve, pure snapshot.

Structure:

```markdown
# DS gaps — YYYY-MM-DD snapshot

## <component-name-1>
- **<part>** (<kind>) → <one-line summary>
...

## <component-name-2>
...
```

- Components are listed alphabetically.
- Omit components whose current `gaps[]` is empty (keeps the file signal-dense).
- If no component has gaps, emit a single-line body: `No gaps across the design system at this time.`

Source the per-component data by re-reading the `KLP:GAPS` block of each `docs/components/_index_<name>.md`, so the aggregation reflects the ground truth written earlier in the same run.
```

- [ ] **Step 5: Update the "What you may write" permission list**

Find the bullet list of paths the documentalist may write. Add:

```markdown
- `docs/gaps.md` (full regeneration at every DOCUMENT/SYNC)
```

- [ ] **Step 6: Commit**

```bash
git add .claude/agents/documentalist.md
git commit -m "feat(documentalist): systematic import scan + KLP:GAPS block + docs/gaps.md aggregation"
```

---

## Task 8: Update CLAUDE.md — composition discipline + new paths

**Files:**
- Modify: `CLAUDE.md`

- [ ] **Step 1: Add a "Composition discipline" subsection under "Component rules"**

Find the `## Component rules` section. Append:

```markdown
### Composition discipline (new components)

When a new component reuses existing DS primitives (Button, Badges, Input, …), the pipeline enforces reuse automatically:

- **figma-extractor** flags every Figma INSTANCE whose mainComponent matches an entry in `klp-components.json` → sets `anatomy[].klpComponent` and `spec.composition.reuses[]`.
- **component-adapter** must import and render these flagged components; any deviation is reported as a typed `gap` (`unmatched-instance`, `partial-reuse`, `no-instance-no-match`, `new-primitive`).
- **validate-tokens.mjs** cross-checks that the source imports and uses every flagged component (`reuse` check family) and that no inline `<svg>` markup is introduced (`icons` check family).
- **documentalist** scans `@/components/*` imports in source to keep `dependencies.components[]` and reverse `usedBy[]` edges current. Gaps are persisted per-component in `docs/components/_index_<name>.md` under `KLP:GAPS:BEGIN/END` markers and aggregated in `docs/gaps.md`.

For specs captured before this discipline (v1 specs without the `composition` field), the agents fall back to best-effort mode — no regression.
```

- [ ] **Step 2: Add entries to "Useful paths"**

Find the `## Useful paths` section. Append:

```markdown
- Aggregated DS gaps: `docs/gaps.md` (regenerated at every documentalist pass)
- Per-component gap block: inside `docs/components/_index_<name>.md` between `<!-- KLP:GAPS:BEGIN --> ... <!-- KLP:GAPS:END -->` (do not edit by hand)
```

- [ ] **Step 3: Add entries to "Don'ts"**

Find the `## Don'ts` section. Append:

```markdown
- Don't write a local cva that duplicates an existing DS component — import it from `@/components/<name>` instead.
- Don't edit the `KLP:GAPS` block by hand — it's regenerated by the documentalist from the adapter's `gaps[]`.
- Don't edit `docs/gaps.md` by hand — it's a pure snapshot, rewritten at every documentalist pass.
```

- [ ] **Step 4: Commit**

```bash
git add CLAUDE.md
git commit -m "docs(claude.md): composition discipline + gap-report paths + new don'ts"
```

---

## Task 9: Update `docs/overview.md` — "Composition workflow" subsection

**Files:**
- Modify: `docs/overview.md`

- [ ] **Step 1: Locate the KLP:NOTES block in overview.md**

Run: `grep -n 'KLP:NOTES' docs/overview.md`
Expected: two line numbers (BEGIN and END markers). If the markers don't exist, add them at the bottom of the file before continuing.

- [ ] **Step 2: Add a "Composition workflow" subsection inside the notes block**

Between `<!-- KLP:NOTES:BEGIN -->` and `<!-- KLP:NOTES:END -->`, append:

```markdown
## Composition workflow (since 2026-04-17)

Composite components (those that reuse existing primitives) go through the same `/klp-build-component` pipeline with three reinforcements:

1. **figma-extractor** detects Figma INSTANCE nodes referencing integrated components and flags them in `spec.json` (`anatomy[].klpComponent`, top-level `composition`).
2. **component-adapter** imports flagged components instead of reimplementing them. Any gap (unmatched instance, partial reuse, new primitive) is typed and returned as `gaps[]`.
3. **validate-tokens.mjs** runs three check families: `tokens` (existing), `reuse` (imports honor spec), and `icons` (no inline SVG without an `allow-inline-svg` escape hatch).
4. **documentalist** scans imports from source to keep the dependency graph in sync, writes a per-component `KLP:GAPS` block, and regenerates `docs/gaps.md`.

To review the current DS gap backlog: open `docs/gaps.md`.
```

- [ ] **Step 3: Commit**

```bash
git add docs/overview.md
git commit -m "docs(overview): composition workflow subsection"
```

---

## Task 10: Add `pnpm validate:tokens:all` script

**Why:** Running the validator across all components is needed for migration and for ongoing sanity checks. A single script avoids manual loops.

**Files:**
- Modify: `package.json`

- [ ] **Step 1: Read current `scripts` block in package.json**

Run: `python3 -c 'import json; print("\n".join(f"{k}: {v}" for k,v in json.load(open("package.json"))["scripts"].items()))'`
Note the existing keys.

- [ ] **Step 2: Add the `validate:tokens:all` script**

Edit `package.json`, find the `"validate:tokens"` entry. Right after it, add:

```json
"validate:tokens:all": "node -e 'const d=require(\"./klp-components.json\");for(const c of d.components){require(\"child_process\").spawnSync(\"node\",[\"scripts/validate-tokens.mjs\",c.name],{stdio:\"inherit\"})}'",
```

(Escape the double quotes according to your local JSON style. If your package.json uses a different convention, adapt. If this one-liner is too long, factor it into a dedicated helper file — but keep the `pnpm` entry working.)

- [ ] **Step 3: Verify the script runs**

Run: `pnpm validate:tokens:all 2>&1 | tail -30`
Expected: one JSON output per component in `klp-components.json`. All current components should have top-level `"passed": true`.

- [ ] **Step 4: Commit**

```bash
git add package.json
git commit -m "feat(scripts): add pnpm validate:tokens:all for cross-component compliance checks"
```

---

## Task 11: Migration — dispatch `documentalist` SYNC to backfill the dependency graph

**Why:** Existing components (list-content, floating-alert, tabulation-cells, text-area, …) have stale `dependencies.components` / `usedBy` edges because manual refactors landed after the documentalist last ran. One SYNC pass brings them in sync with the source.

- [ ] **Step 1: Capture the pre-migration state of klp-components.json**

Run: `cp klp-components.json /tmp/klp-components.pre-migration.json`
(This snapshot is only for the diff at Step 4 — do not commit it.)

- [ ] **Step 2: Dispatch the documentalist with `operation: SYNC`**

Invoke the documentalist agent (via Task tool in Claude Code or equivalent). Prompt:

> Perform `operation: SYNC`. Iterate over every component in `klp-components.json`. For each: scan imports `@/components/*` in its source, recompute `dependencies.components[]`, reset and re-populate `usedBy[]` across the graph, regenerate `docs/components/_index_<name>.md` (preserving `KLP:NOTES` + `KLP:GAPS` blocks), and regenerate `docs/gaps.md` from scratch.

Wait for the return JSON. Expected: status ok, N components processed, X forward edges detected (non-zero — list-content→button, floating-alert→button, tabulation-cells→badges, text-area→button, tabulations→tabulation-cells, …).

- [ ] **Step 3: Verify expected edges landed**

Run:
```bash
python3 -c '
import json
d=json.load(open("klp-components.json"))
for c in d["components"]:
    deps = c.get("dependencies",{}).get("components",[])
    uby  = c.get("usedBy",[])
    if deps or uby:
        print(c["name"], "->", deps, "| used by:", uby)
'
```
Expected at minimum:
- `list-content -> ["button"]`
- `floating-alert -> ["button"]`
- `tabulation-cells -> ["badges"]`
- `tabulations -> ["tabulation-cells"]`
- `text-area -> ["button"]`
- `button | used by: ["floating-alert","list-content","text-area"]` (order may vary)
- `badges | used by: ["tabulation-cells"]`
- `tabulation-cells | used by: ["tabulations"]`

- [ ] **Step 4: Verify docs/gaps.md was generated**

Run: `cat docs/gaps.md`
Expected: a file exists with either per-component gap sections (likely empty for this migration since v1 specs had no composition data) or the single-line "No gaps across the design system at this time." Confirm presence of the "DS gaps" heading.

- [ ] **Step 5: Verify each docs/components/_index_<name>.md has a KLP:GAPS block**

Run: `grep -L 'KLP:GAPS:BEGIN' docs/components/_index_*.md`
Expected: empty output (every component page has the block).

- [ ] **Step 6: Cleanup snapshot**

Run: `rm /tmp/klp-components.pre-migration.json`

- [ ] **Step 7: Commit**

```bash
git add klp-components.json docs/
git commit -m "chore(migration): SYNC — backfill dependencies.components + usedBy + KLP:GAPS blocks"
```

---

## Task 12: Migration — run `pnpm validate:tokens:all` and triage results

**Why:** After the SYNC migration, the validator's new `reuse` + `icons` checks run on every existing component. Expected: `tokens` still passes everywhere; `reuse` may emit `undeclared-reuse` warnings (because v1 specs lack the `composition` field but the source now imports DS components); `icons` should pass everywhere (no inline SVG).

- [ ] **Step 1: Run validate:tokens:all and capture output**

Run: `pnpm validate:tokens:all 2>&1 > /tmp/klp-validation-migration.log`
(The log is temporary.)

- [ ] **Step 2: Verify every component has `passed: true` at the top level**

Run:
```bash
python3 -c '
import json,sys,re
text=open("/tmp/klp-validation-migration.log").read()
# each JSON object starts with `{` at column 0 until the matching `}`
import re
objs=re.findall(r"\{[\s\S]+?\n\}\n", text)
fail=[]
for o in objs:
    try:
        d=json.loads(o)
        if not d.get("passed", True):
            fail.append((d["component"], d["mismatchCount"]))
    except Exception:
        pass
if fail:
    print("FAIL:", fail); sys.exit(1)
print("all passed at top level")
'
```
Expected: `all passed at top level`.

If any component fails at the top level, triage:
- `tokens` mismatch → inspect and patch the component source (same process as day-to-day builds).
- `icons` mismatch → replace inline `<svg>` with a lucide-react import, or add `{/* allow-inline-svg: <reason> */}` if justified. Commit the fix separately and re-run.
- `reuse` mismatch (`missing-import` / `imported-not-used`) → should not occur for v1 specs (they have no `spec.composition`). If it occurs, the SYNC pass was incomplete — investigate.

- [ ] **Step 3: Surface `undeclared-reuse` warnings to the user for informational review**

Run:
```bash
python3 -c '
import json,re
text=open("/tmp/klp-validation-migration.log").read()
objs=re.findall(r"\{[\s\S]+?\n\}\n", text)
for o in objs:
    try:
        d=json.loads(o)
    except Exception:
        continue
    ws = d.get("checks",{}).get("reuse",{}).get("warnings",[])
    if ws:
        print(f"{d[\"component\"]}:")
        for w in ws:
            print(f"  - {w[\"kind\"]}: {w.get(\"component\", w.get(\"hint\",\"\"))}")
'
```
Expected output: a list of components with `undeclared-reuse` warnings. This is the pre-existing debt: the source uses `Button` / `Badge` / etc. but the v1 spec never recorded this. The warnings are informational — no fix needed in V1.

- [ ] **Step 4: Cleanup log**

Run: `rm /tmp/klp-validation-migration.log`

- [ ] **Step 5: No commit needed unless you fixed something**

If Steps 1–4 surfaced real mismatches that you fixed, commit each fix with a dedicated message (`fix(<component>): <what>`). Otherwise, the migration is complete without additional commits.

---

## Task 13: End-to-end verification — build a synthetic composite component

**Why:** Validate the v2 pipeline end-to-end on a real composite. Pick a small composite (e.g. a "field-row" that wraps `Input` + `Button` horizontally) that exercises: extractor detects two INSTANCE nodes, adapter imports both, validator passes on all three check families, documentalist writes the correct edges + empty gaps block.

**Prerequisite:** The Figma file must contain a component named `FieldRow` (or equivalent composite) with INSTANCE children pointing to the published `Input` and `Button`. If no such component exists in the Figma file, create a minimal one (label + Input + Button horizontally) and publish it before running this task. Coordinate with the user.

- [ ] **Step 1: Confirm a candidate composite exists in Figma**

Ask the user (via the console or a pairing session): "Can you point me to a composite component in Figma whose anatomy includes at least one INSTANCE of an integrated DS component (Button, Input, Badge, …)? Ideally a small one — think field-row, search-bar, or a single tabulation header." Save the node id for the run.

- [ ] **Step 2: Run the full pipeline**

Dispatch `/klp-build-component <composite-name>` (or invoke the sub-pipeline manually: figma-extractor → component-adapter → validate-tokens → documentalist).

- [ ] **Step 3: Verify extractor output**

Run: `python3 -c 'import json; d=json.load(open(".klp/figma-refs/<composite>/spec.json")); print(d.get("composition"))'`
Expected: `composition` is present, `reuses` is non-empty, `instances` has at least one entry with a matched `klpComponent`.

- [ ] **Step 4: Verify adapter output (from Stage 2 console log)**

Confirm the adapter's return JSON contains:
- `reuses: ["<component-1>", "<component-2>"]`
- `gaps: []` (or only `partial-reuse` entries if you had to override a className).

Also confirm the generated source at `src/components/<composite>/<Composite>.tsx`:
```bash
grep -n 'from ..\?/components/' src/components/<composite>/<Composite>.tsx
```
Expected: one import line per declared reuse.

- [ ] **Step 5: Verify validator passes all three check families**

Run:
```bash
node scripts/validate-tokens.mjs <composite> 2>&1 | python3 -c '
import sys,json
d=json.loads(sys.stdin.read())
for k,v in d["checks"].items():
    print(f"{k}: passed={v[\"passed\"]} m={v[\"mismatchCount\"]} w={v[\"warningCount\"]}")
print(f"TOP: passed={d[\"passed\"]} m={d[\"mismatchCount\"]}")
'
```
Expected: `tokens`, `reuse`, `icons` all `passed=True`, top-level `passed=True`. If `reuse` has a `missing-import` or `imported-not-used` mismatch, the adapter did not honor the spec — fix the source (or the adapter prompt) and re-run.

- [ ] **Step 6: Verify documentalist output**

Run:
```bash
python3 -c '
import json
d=json.load(open("klp-components.json"))
e=next(c for c in d["components"] if c["name"]=="<composite>")
print("deps:", e.get("dependencies",{}).get("components",[]))
print("usedBy:", e.get("usedBy",[]))
'
```
Expected: `deps` lists every reused component; `usedBy` is `[]` (this is a leaf-level composite, no one depends on it yet).

Also verify the reverse edges landed on the reused components:
```bash
python3 -c '
import json
d=json.load(open("klp-components.json"))
for n in ["<reused-1>", "<reused-2>"]:
    e=next(c for c in d["components"] if c["name"]==n)
    print(n, "used by:", e.get("usedBy",[]))
'
```
Expected: each reused component's `usedBy` now contains `<composite>`.

- [ ] **Step 7: Verify the KLP:GAPS block and docs/gaps.md**

Run: `grep -A 6 'KLP:GAPS:BEGIN' docs/components/_index_<composite>.md`
Expected: the block is present; body says `No gaps recorded.` (assuming `gaps: []`).

Run: `grep -n '<composite>' docs/gaps.md`
Expected: either no match (component has no gaps, so it's omitted from the aggregation) or a section with the specific gap lines if the adapter emitted any.

- [ ] **Step 8: Commit the synthetic composite**

```bash
git add src/components/<composite>/ playground/routes/<composite>.tsx registry/<composite>.json docs/components/_index_<composite>.md klp-components.json .klp/figma-refs/<composite>/ playground/App.tsx playground/routes/_index.tsx docs/gaps.md docs/index.md docs/log.md
git commit -m "test(composite): add <composite> via v2 pipeline — verifies extractor+adapter+validator+documentalist end-to-end"
```

If the synthetic composite is purely for verification and you don't want it in the tree, revert with `git reset --hard HEAD~1` (only if the commit was local and nothing else depends on it). Otherwise, keep the commit — it serves as a regression anchor.

---

## Self-review

**Spec coverage:** each spec section has at least one task.
- Stage 1 (extractor) → Task 5.
- Stage 2 (adapter) → Task 6.
- Stage 3 (validator) → Tasks 1, 2, 3.
- Stage 4 (documentalist) → Task 7.
- Migration → Tasks 11, 12.
- User-facing UX (CLAUDE.md, docs/overview.md, SKILL.md) → Tasks 4, 8, 9, 10.
- End-to-end verification → Task 13.

**Placeholder scan:** no `TBD` / `TODO` / `fill in` remaining. Every code step carries the exact code.

**Type consistency:** gap vocabulary (`unmatched-instance`, `partial-reuse`, `no-instance-no-match`, `new-primitive`) used identically across spec, adapter rulebook (Task 6), validator (Tasks 2/3 only cite `missing-import`, `imported-not-used`, `undeclared-reuse`, `inline-svg`, `allowed-inline-svg` which are validator-level kinds — distinct family, no collision), and documentalist (Task 7) which just forwards. `composition.reuses[]`, `composition.candidates[]`, `composition.instances[]` all consistent between extractor output (Task 5), validator input (Task 2), and agent contracts.

**Commit cadence:** 12 planned commits across 13 tasks. Task 12 may commit zero, one, or more depending on pre-existing debt findings. Task 13 commits the synthetic composite (or gets reverted if purely a smoke test).
