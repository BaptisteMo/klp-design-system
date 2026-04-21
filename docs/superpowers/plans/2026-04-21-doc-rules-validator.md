# klp-doc-rules-validator Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship a deterministic Node script + thin Claude Code skill that validates five structural rules on every component doc page (Props usage table, Class column, Do/Don't block, Class B blockquote, `@propClass` coverage), auto-fixes rules 1–4 in place, and surfaces rule 5 to the user.

**Architecture:** Skill lives at `.claude/skills/klp-doc-rules-validator/` with the script at `scripts/validate-doc-rules.mjs`, referenced via `${CLAUDE_SKILL_DIR}`. A slash command `/klp-doc-validate` wraps it. The documentalist agent invokes the script via Bash at the end of DOCUMENT and inside SYNC; R5 failures are reported up to the user, R1-R4 self-heal.

**Tech Stack:** Node 22 (node:test, node:fs/promises), Markdown, JSDoc convention, Anthropic Claude Code skills.

---

## File structure

- **Create** `.claude/skills/klp-doc-rules-validator/SKILL.md` — skill entrypoint.
- **Create** `.claude/skills/klp-doc-rules-validator/scripts/validate-doc-rules.mjs` — deterministic validator.
- **Create** `.claude/skills/klp-doc-rules-validator/scripts/validate-doc-rules.test.mjs` — node:test suite.
- **Create** `.claude/skills/klp-doc-rules-validator/__fixtures__/` — source + doc fixture pairs (one per rule failure mode + baseline).
- **Create** `.claude/commands/klp-doc-validate.md` — slash command.
- **Modify** `.claude/agents/documentalist.md` — insert DOCUMENT step 15a + SYNC step 4b.

No `package.json` changes — node:test is built-in.

---

## Task 1: Scaffold SKILL.md

- [ ] **Step 1: Create directories**

```
mkdir -p .claude/skills/klp-doc-rules-validator/scripts .claude/skills/klp-doc-rules-validator/__fixtures__
```

- [ ] **Step 2: Write SKILL.md**

Content (write verbatim):

- Frontmatter with `name: klp-doc-rules-validator`, `description:` front-loading the 5 check names + triggers (/klp-build-component Stage 4b, documentalist DOCUMENT/SYNC, /klp-doc-validate), `allowed-tools: Bash(node ${CLAUDE_SKILL_DIR}/scripts/validate-doc-rules.mjs:*)`.
- Body with sections: Invocation (4 CLI forms), Output shape (JSON sample), Exit codes (0/1/2), Rules table (R1-R5 with auto-fix column), Retry contract.

- [ ] **Step 3: Commit** — `feat(skill): klp-doc-rules-validator skill scaffolding`

---

## Task 2: Fixture — passing baseline

Create `.claude/skills/klp-doc-rules-validator/__fixtures__/pass-baseline/`:
- `Component.tsx` — minimal export: `cva('base', { variants: {}, defaultVariants: {} })` + `interface ComponentProps { label?: string (JSDoc @propClass optional), children: React.ReactNode (JSDoc @propClass required) }`.
- `doc.md` — frontmatter, Anatomy, Variants (`*No variant axes.*`), Props usage table with label=optional + children=required, Tokens. NO Do/Don't block (no computed/persistent row).

Commit — `test(doc-rules): passing baseline fixture`.

---

## Task 3: Fixture — R1 missing Props usage

Create `__fixtures__/r1-missing-props-usage/` with same source as baseline and a doc.md that omits the `## Props usage` section entirely.

Commit — `test(doc-rules): R1 missing Props usage fixture`.

---

## Task 4: Fixture — R2 empty Class cell

Create `__fixtures__/r2-empty-class-cell/` with same source as baseline and a doc.md where the `label` row's Class column is empty (`| `label` |  | `string` | — |`).

Commit — `test(doc-rules): R2 empty Class cell fixture`.

---

## Task 5: Fixture — R3 computed prop without Do/Don't

Create `__fixtures__/r3-missing-dodont/`:
- Source: `interface ComponentProps { state?: 'default' | 'danger' (JSDoc @propClass computed, @derivedFrom disabled, aria-invalid), label?: string }`.
- Doc: Props usage table with `state` row marked `**computed**`, no `### Do / Don't` block.

Commit — `test(doc-rules): R3 missing Do/Don't block fixture`.

---

## Task 6: Fixture — R4 missing Class B blockquote

Create `__fixtures__/r4-missing-classb/`:
- Source: `cva('base', { variants: { state: { rest, active } }, defaultVariants: { state: 'rest' } })` + `interface ComponentProps { label?: string }` (no state prop).
- Doc: `## Variants` with table but NO blockquote above it.

Commit — `test(doc-rules): R4 missing Class B blockquote fixture`.

---

## Task 7: Fixture — R5 missing @propClass

Create `__fixtures__/r5-missing-propclass/`:
- Source: `interface ComponentProps { label?: string (JSDoc @propClass optional), foo?: string (NO jsdoc) }`.
- Doc: structurally valid Props usage table.

Commit — `test(doc-rules): R5 missing @propClass fixture`.

---

## Task 8: Script — parsing primitives

Create `validate-doc-rules.mjs` with exported helpers:
- `pascalName(kebab)` — kebab → Pascal.
- `parsePropsInterface(source)` — match `export interface <Name>Props ... { ... }` via regex; split body by top-level semicolons (track brace depth); for each statement extract trailing property decl + leading JSDoc block; parse `@propClass <class>` + `@derivedFrom <list>`; return `{ propsInterface, props: [{ name, type, hasPropClass, propClass, derivedFrom, description }] }`.
- `hasCvaStateAxis(source)` — regex scan `variants: { ... }` blocks; true iff one contains `state: { <non-empty body> }`.
- `extractTable(doc, heading)` — find `## <heading>` section, locate first `|` line, parse headers + rows.
- Placeholder CLI that prints `{passed:true, rulesChecked:0}` to stdout.
- Repo root: `process.env.CLAUDE_PROJECT_DIR ?? process.cwd()`.

Create test file `validate-doc-rules.test.mjs` with 5 tests via `node:test`:
1. `pascalName` converts `item-side-bar` → `ItemSideBar`.
2. `parsePropsInterface` extracts 2 props from baseline fixture.
3. `parsePropsInterface` flags `foo` as `hasPropClass: false` in r5 fixture.
4. `hasCvaStateAxis` returns true on r4 fixture, false on baseline.
5. `extractTable` parses Props usage table from baseline with headers + rows.

Run `node --test .claude/skills/klp-doc-rules-validator/scripts/validate-doc-rules.test.mjs`. Expected: 5 pass.

Commit — `feat(doc-rules): parsers for Props interface, cva state axis, markdown tables`.

---

## Task 9: R1 + R2 — check + auto-fix

Add to test file:
- R1 detects missing Props usage (r1 fixture) — expect passed=false.
- R1 passes on baseline.
- R2 detects empty Class cell (r2 fixture) — expect passed=false, emptyRows has one entry for `label`.
- R1 auto-fix inserts `## Props usage` stub.
- R2 auto-fix fills empty Class cell with `optional`.

Run — confirm 5 new tests fail.

Implement in `validate-doc-rules.mjs`:
- `checkR1(doc)` → `{rule:'R1', passed, fixable:true}`; passed if `/^## Props usage\s*$/m` matches.
- `checkR2(doc)` → find Class column index in Props usage table, list rows with empty cell, `passed = emptyRows.length === 0`.
- `applyAutoFixes(doc, violations)` iterates violations:
  - R1: insert `PROPS_USAGE_STUB` constant (heading + empty table skeleton) before `## Tokens`, falling back to end-of-file.
  - R2: regex-replace `| \`<prop>\` | <empty> |` → `| \`<prop>\` | optional |`.

Run tests — expect 10 pass total.

Commit — `feat(doc-rules): R1 + R2 checks and auto-fix`.

---

## Task 10: R3 — Do/Don't presence

Add tests:
- R3 detects missing block (r3 fixture) — passed=false, action='insert'.
- R3 passes on baseline (no computed/persistent).
- R3 auto-fix inserts `### Do / Don't` block.

Implement:
- `checkR3(doc)` — extract Props usage table; `needsBlock = any row cell matches **computed** or **persistent**`; `hasBlock = /^### Do \/ Don't/m`; return action `insert`|`remove`|`null`.
- Extend `applyAutoFixes` with R3 branches: insert `DODONT_STUB` constant after Props usage table (before next `## ` heading); remove existing block with regex.

Run tests — expect 13 pass.

Commit — `feat(doc-rules): R3 Do/Don't block presence check and auto-fix`.

---

## Task 11: R4 — Class B blockquote

Add tests:
- R4 flags missing blockquote (r4 fixture) — passed=false, action='insert'.
- R4 passes on baseline.
- R4 auto-fix inserts blockquote above `## Variants`; confirm position.

Implement:
- `checkR4(source, doc)` — `needsBlock = hasCvaStateAxis(source) AND !stateProp`; `hasBlock = /^> The `state` column below/m`; return action.
- Extend `applyAutoFixes` with R4 branches: replace `## Variants` heading with `CLASS_B_BLOCKQUOTE + ## Variants`; remove via regex.

Run tests — expect 16 pass.

Commit — `feat(doc-rules): R4 Class B blockquote check and auto-fix`.

---

## Task 12: R5 — @propClass coverage (report-only)

Add tests:
- R5 flags `foo` prop as missing (r5 fixture).
- R5 passes on baseline.

Implement:
- `checkR5(source)` — parse Props, list props with `!hasPropClass`, `fixable: false`.

Run tests — expect 18 pass.

Commit — `feat(doc-rules): R5 @propClass coverage check (report-only)`.

---

## Task 13: Wire CLI + JSON output

Replace placeholder `main()` in `validate-doc-rules.mjs` with full CLI:

- `runOne(component, {fix})` — resolve source + doc paths; read both; run all 5 checks; if `fix=true` and any R1-R4 violation, call `applyAutoFixes` + `writeFile(docPath, ...)` (preserving `KLP:NOTES` block verbatim); re-run structural checks post-fix; build final `{component, passed, rulesChecked:5, autoFixed[], mismatches[], warnings:[]}`.
- `runAll({fix})` — read `klp-components.json`, iterate names, call `runOne`, AND-reduce `passed`, flat-union `autoFixed`/`mismatches`/`warnings`.
- `main()` — parse `process.argv`; if `--all` present, call `runAll`; else call `runOne(positional)`; emit JSON.stringify + 2-space indent to stdout; `process.exit(passed ? 0 : 1)`; catch errors, stderr, exit 2.

Dry-runs:
- `node .claude/skills/klp-doc-rules-validator/scripts/validate-doc-rules.mjs input` → `passed:true`, exit 0.
- `node .claude/skills/klp-doc-rules-validator/scripts/validate-doc-rules.mjs tabulation-cells` → `passed:true`.
- `node --test` full suite still 18/18.

Commit — `feat(doc-rules): wire CLI, runOne + runAll + JSON emission`.

---

## Task 14: /klp-doc-validate slash command

Create `.claude/commands/klp-doc-validate.md`:
- Argument: optional `<component>`.
- Body: invoke `node .claude/skills/klp-doc-rules-validator/scripts/validate-doc-rules.mjs <arg|--all> --fix`, parse JSON, print compact summary (`✓ passed` / `✓ auto-fixed N` / `✗ N mismatches`), exit with script's code.

Commit — `feat(cmd): /klp-doc-validate slash command`.

---

## Task 15: Documentalist integration

Modify `.claude/agents/documentalist.md`:

- DOCUMENT operation: insert step 15a before step 16, describing invocation of `node .claude/skills/klp-doc-rules-validator/scripts/validate-doc-rules.mjs <component> --fix`, parse JSON, merge `autoFixed` + `mismatches` into returned report under `docRulesValidator` key; surface R5 mismatches in `warnings[]` as `{type:'doc-rules-mismatch', rule, prop, hint}`; do NOT fail DOCUMENT.

- Extended SYNC (full recompute): insert step 4b (between current 4 and 5) calling `--all --fix` once at end of regen loop; merge aggregated results into SYNC report.

Commit — `feat(documentalist): invoke klp-doc-rules-validator post-DOCUMENT and in SYNC`.

---

## Task 16: Regression sweep + E2E

No file changes. Verification:

- `node .claude/skills/klp-doc-rules-validator/scripts/validate-doc-rules.mjs --all` read-only across 25 components — expect `passed:true` (or small set of R5 mismatches if a prop was missed in earlier taxonomy rollout).
- Break/fix cycle on tabulation-cells: strip blockquote, run without `--fix` → exit 1 + R4 in mismatches; run with `--fix` → exit 0 + R4 in autoFixed; confirm blockquote restored; `git checkout --` to discard.
- Manual: run `/klp-doc-validate input` + `/klp-doc-validate` in a fresh session; verify summaries match Task 14 format.

No commit — verification only.

---

## Self-review

- **Spec coverage:** architecture (Task 1 + 13), R1–R5 (Tasks 9–12), CLI surface (Task 13), exit codes (Task 13), retry contract (Task 15 via warnings), frontmatter (Task 1), slash command (Task 14), verification (Tasks 8–12 unit, Task 16 E2E), fixtures (Tasks 2–7).
- **Placeholder scan:** every Task specifies exact file paths, commands, function names, rule IDs. No TBD.
- **Type consistency:** `checkR1..R5`, `applyAutoFixes`, `parsePropsInterface`, `hasCvaStateAxis`, `extractTable`, `pascalName`, `runOne`, `runAll` named identically throughout. JSON keys (`component`, `passed`, `rulesChecked`, `autoFixed`, `mismatches`, `warnings`, `rule`, `hint`, `prop`) stable across script, skill doc, slash command, agent integration.
