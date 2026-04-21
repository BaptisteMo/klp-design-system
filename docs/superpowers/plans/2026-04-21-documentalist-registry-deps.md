# Documentalist — registry npm deps sync — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make the `documentalist` agent the single source of truth for each component's npm dependencies, and have it sync that list into `registry/<name>.json#dependencies.npm` so `scripts/build-manifest.ts` picks them up and `klp-ui init`/`update` auto-install them in consumer projects.

**Architecture:** Documentalist already scans imports in every component source and writes canonical externals to `klp-components.json[].dependencies.externals`. We extend operation DOCUMENT (and SYNC) with one extra step: compute the filtered npm-package list (drop baseline = react/react-dom/clsx/tailwind-merge) and write it to `registry/<name>.json#dependencies.npm`. We add a LINT check that flags drift. We run SYNC once to backfill all existing registries, then rebuild the manifest.

**Tech Stack:** Node 22, tsx, Markdown agent definitions (`.claude/agents/documentalist.md`), JSON registry files.

---

## Context

In the consumer project flow, `npx github:BaptisteMo/klp-design-system update` adds newly-published components to the downstream app. It reads `registry/manifest.json` to know which files to copy and which npm packages those files depend on. The manifest is built by `scripts/build-manifest.ts`, which walks `src/components/*` and pulls each component's `dependencies.npm` from `registry/<name>.json`.

Today only ~5/25 registry files list `class-variance-authority`, and none list `lucide-react` unless the component-adapter happened to inject them in the Stage 2 stub. Consequence: consumer projects end up with source files that `import { cva } from 'class-variance-authority'` but have no such package in `package.json` — TypeScript errors, build fails.

The documentalist agent already computes the authoritative list of externals (`klp-components.json[].dependencies.externals`) by scanning component source with a regex. It just doesn't write them back into `registry/<name>.json`. This plan makes it do that.

Related files:
- `.claude/agents/documentalist.md` — agent prompt to extend (operations DOCUMENT + SYNC + LINT).
- `scripts/build-manifest.ts:85-98` — reads `reg.dependencies.npm`, unchanged after this plan.
- `cli/init.mjs:20-39` — `BASELINE_DEPS` and `DEP_VERSIONS` tables; baseline is what we exclude from the registry's npm list.
- `cli/update.mjs:166-190` — deps reconcile block (already auto-installs missing deps — landed in `4f99caf`).

---

## File Structure

- **Modify** `.claude/agents/documentalist.md` — add npm-sync step to DOCUMENT, add mirror step to SYNC full recompute, add LINT rule #N, document the baseline-exclusion list.
- **Modify** 20+ files under `registry/*.json` — via SYNC one-shot; each gains/updates `dependencies.npm`.
- **Modify** `registry/manifest.json` — regenerated from updated registries.
- **No new source files.** Logic lives in the agent prompt; the agent already has Read/Edit/Write tools.

---

## Task 1: Extend documentalist DOCUMENT operation with npm-deps sync

**Files:**
- Modify: `.claude/agents/documentalist.md` — insert a step between current step 10 (import scan) and step 11 (update klp-components.json), plus a new subsection.

- [ ] **Step 1: Add step 10b to the DOCUMENT operation list**

After line 72 (`**Run the systematic import scan** ...`) add:

```markdown
10b. **Sync `registry/<component>.json#dependencies.npm`.** Filter the freshly scanned externals by the baseline-exclusion list below; write the result (sorted, deduped) to `registry/<component>.json` under `dependencies.npm`. If the file is missing, warn and skip — the adapter owns Stage-2 creation. If the file exists but has no `dependencies` key, create it. Preserve `dependencies.components` if already present (rewritten by Stage 2); if absent, leave as empty array.

**Baseline-exclusion list** (never written to `registry.dependencies.npm` because scaffold already installs them):
- `react`
- `react-dom`
- `clsx`
- `tailwind-merge`

Everything else scanned from `from '<pkg>'` imports (notably `@radix-ui/*`, `@tanstack/*`, `@fontsource/*`, `lucide-react`, `class-variance-authority`) is kept.
```

- [ ] **Step 2: Add a dedicated subsection explaining the sync**

Below the "Systematic `@/components/*` import scan" subsection (around line 93), append a new subsection:

```markdown
### Systematic external import scan → `registry/<name>.json` sync (DOCUMENT + SYNC)

After the `@/components/*` scan, run the same regex against `src/components/<name>/<Component>.tsx` (and `.example.tsx` if you want example-only deps — you don't, skip it) to collect `from ['"]([^'"@]+|@[^/'"]+/[^'"]+)['"]` matches that are **not** relative (`./`, `../`) and **not** `@/…`.

1. Deduplicate, sort.
2. Drop the baseline-exclusion list (`react`, `react-dom`, `clsx`, `tailwind-merge`).
3. Read `registry/<name>.json`. If it parses, set `reg.dependencies = reg.dependencies ?? {}`, set `reg.dependencies.npm = <filtered sorted list>`. Preserve `reg.dependencies.components` (written by the adapter).
4. Write back with 2-space indent and a trailing newline.

This field is what `scripts/build-manifest.ts` reads; without it, `klp-ui init`/`update` cannot install the component's runtime dependencies in the consumer project.
```

- [ ] **Step 3: Commit**

```bash
git add .claude/agents/documentalist.md
git commit -m "feat(documentalist): sync registry npm deps from import scan"
```

---

## Task 2: Extend documentalist SYNC (full recompute) to run the same step

**Files:**
- Modify: `.claude/agents/documentalist.md` — extend the "Extended SYNC (full recompute)" block.

- [ ] **Step 1: Update the SYNC step list**

Find the block starting at "On `operation: SYNC`, iterate over every component in `klp-components.json`:" (around line 103). Add a new numbered step between current step 2 and step 3:

```markdown
2b. Run the external import scan (see "Systematic external import scan → `registry/<name>.json` sync" subsection) and rewrite `registry/<name>.json#dependencies.npm` for every component.
```

- [ ] **Step 2: Commit**

```bash
git add .claude/agents/documentalist.md
git commit -m "feat(documentalist): full SYNC refreshes registry npm deps"
```

---

## Task 3: Add LINT rule for registry-vs-externals drift

**Files:**
- Modify: `.claude/agents/documentalist.md` — extend the LINT operation checks.

- [ ] **Step 1: Add LINT check**

After check #8 ("No circular component dependencies", around line 143), append:

```markdown
9. **Registry npm-deps consistency**: for every component, the set `registry/<name>.json#dependencies.npm` must equal the component's scanned externals minus the baseline-exclusion list (`react`, `react-dom`, `clsx`, `tailwind-merge`). Any divergence (missing or extra package) is a drift bug. Report but do not auto-fix under LINT — the user re-runs DOCUMENT (or full SYNC) to correct it.
```

- [ ] **Step 2: Commit**

```bash
git add .claude/agents/documentalist.md
git commit -m "feat(documentalist): LINT rule for registry/externals drift"
```

---

## Task 4: One-shot SYNC backfill of all existing registries

**Files:**
- Modify: 20+ `registry/<name>.json` files (all that currently miss `dependencies.npm`).
- Modify: `registry/manifest.json` (regenerated).

- [ ] **Step 1: Dispatch the documentalist in SYNC mode**

Via the Agent tool:

- `subagent_type: "documentalist"`
- `description`: "SYNC all registry npm deps"
- `prompt`: "operation: SYNC. Iterate every component in klp-components.json, re-run the external import scan for each, and rewrite registry/<name>.json#dependencies.npm per the new spec. Do NOT touch klp-components.json fields other than dependencies. Report the JSON summary with a list of registry files changed."

- [ ] **Step 2: Verify every registry now has dependencies.npm**

Run:

```bash
node -e "
const fs = require('fs'); const p = require('path');
const files = fs.readdirSync('registry').filter(f => f.endsWith('.json') && f !== 'manifest.json' && f !== 'index.json');
const missing = [];
for (const f of files) {
  const j = JSON.parse(fs.readFileSync(p.join('registry', f), 'utf8'));
  if (!Array.isArray(j.dependencies?.npm)) missing.push(f);
}
console.log(missing.length === 0 ? 'OK all registries have dependencies.npm' : 'MISSING: ' + missing.join(', '));
"
```

Expected: `OK all registries have dependencies.npm`.

- [ ] **Step 3: Sanity-check the collapsible entry**

Run:

```bash
node -e "console.log(JSON.stringify(JSON.parse(require('fs').readFileSync('registry/collapsible.json','utf8')).dependencies, null, 2))"
```

Expected output includes `@radix-ui/react-collapsible`, `class-variance-authority`, `lucide-react` in `dependencies.npm`, and `button` in `dependencies.components`.

- [ ] **Step 4: Rebuild and validate the manifest**

```bash
pnpm run build:manifest && pnpm run validate:manifest
```

Expected: both commands exit 0.

- [ ] **Step 5: Spot-check the manifest**

```bash
node -e "const m=JSON.parse(require('fs').readFileSync('registry/manifest.json','utf8')); console.log(JSON.stringify(m.groups.components.items.collapsible.deps, null, 2))"
```

Expected: `deps.npm` contains `@radix-ui/react-collapsible`, `class-variance-authority`, `lucide-react`.

- [ ] **Step 6: Run CLI smoke test**

```bash
pnpm run test:cli
```

Expected: `✓ all tests passed`.

- [ ] **Step 7: Commit**

```bash
git add registry/
git commit -m "chore(registry): backfill npm deps across all components"
```

---

## Task 5: Run LINT to confirm no drift remains

**Files:** none modified — health check only.

- [ ] **Step 1: Dispatch the documentalist in LINT mode**

Via the Agent tool:

- `subagent_type: "documentalist"`
- `description`: "LINT after registry backfill"
- `prompt`: "operation: LINT. Walk every check including the new check 9 (registry npm-deps consistency). Report the JSON summary."

- [ ] **Step 2: Verify the LINT report is clean**

The returned JSON should show `0` violations for check 9. If non-zero: the scan found a component whose registry npm list still disagrees with the import scan — inspect the offending component, re-run DOCUMENT on it, then re-run LINT.

- [ ] **Step 3: No commit needed if clean.** If LINT changed any file (it shouldn't under LINT), abort — LINT is read-only; the agent misbehaved.

---

## Task 6: End-to-end verification in a throwaway consumer project

**Files:** none modified in this repo.

- [ ] **Step 1: Scaffold a fresh consumer project**

```bash
cd /tmp && rm -rf klp-deps-test && mkdir klp-deps-test && cd klp-deps-test
npx github:BaptisteMo/klp-design-system init --project-name=klp-deps-test --brand=wireframe --pm=pnpm --no-git
```

Expected: init completes, `pnpm install` runs, `package.json#dependencies` contains `class-variance-authority`, `lucide-react`, `@radix-ui/react-collapsible`, etc.

- [ ] **Step 2: Confirm deps landed**

```bash
cd /tmp/klp-deps-test && node -e "const d=require('./package.json').dependencies; console.log(['class-variance-authority','lucide-react','@radix-ui/react-collapsible'].map(k => k + ': ' + (d[k]||'MISSING')).join('\n'))"
```

Expected: all three show a version (not `MISSING`).

- [ ] **Step 3: Confirm typecheck on a copied component**

```bash
cd /tmp/klp-deps-test && pnpm exec tsc --noEmit 2>&1 | head -5
```

Expected: no `Cannot find module 'class-variance-authority'` or similar errors.

- [ ] **Step 4: Clean up**

```bash
cd / && rm -rf /tmp/klp-deps-test
```

---

## Verification summary

1. Every `registry/*.json` has `dependencies.npm` populated (Task 4 Step 2).
2. `registry/manifest.json` rebuilds and validates (Task 4 Step 4).
3. CLI smoke test passes (Task 4 Step 6).
4. LINT check 9 reports no drift (Task 5 Step 2).
5. A freshly scaffolded consumer project has all per-component npm deps installed and typechecks cleanly (Task 6).

## Self-review notes

- Spec coverage: documentalist owns the canonical list (`klp-components.json[].externals`) → syncs it to `registry/<name>.json#dependencies.npm` → `build-manifest.ts` picks it up → `cli/init.mjs` + `cli/update.mjs` install it. Full chain covered.
- Baseline-exclusion list is intentionally narrow (4 packages). Anything brought in by scaffold/tailwind setup is handled by `scaffold` group, not `components`.
- No placeholder text. Every step has either exact code or an exact command with expected output.
- Type consistency: the registry shape used in all tasks matches what `build-manifest.ts:89-92` already consumes — `dependencies.npm: string[]` and `dependencies.components: string[]`.
