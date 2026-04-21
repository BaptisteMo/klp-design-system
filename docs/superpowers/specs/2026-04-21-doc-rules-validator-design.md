# klp-doc-rules-validator skill — Design Spec

## Context

The documentalist agent is the sole writer of `docs/components/_index_<name>.md`. The 2026-04-21 prop-usage-taxonomy SYNC showed that LLM-driven doc generation drifts: the agent correctly *detected* Class B components (cva state axis + no `state` prop) but skipped emitting the required blockquote above `## Variants` for 1/1 affected component (`tabulation-cells`). We patched it manually. The same class of drift is likely whenever the template grows (Props usage table, Class column, Do/Don't block). Re-reading the agent spec is not a fix — LLM compliance is probabilistic.

Precedent: `klp-token-validator` is a deterministic Node script invoked by the `/klp-build-component` orchestrator at Stage 3. It reads source + spec, emits JSON, retries once on mismatch. Same-shape skill works for doc rules — move the drift-prone checks out of the LLM and into a testable script.

Goal: a new skill `klp-doc-rules-validator` that mechanically enforces 5 structural rules on every component doc page, auto-fixes 4 of them, and surfaces the 5th (semantic) to the user. Invoked post-DOCUMENT, post-SYNC-per-component, and standalone via `/klp-doc-validate`.

## Architecture

Three artifacts, co-located per Anthropic skill convention (`${CLAUDE_SKILL_DIR}`):

- `.claude/skills/klp-doc-rules-validator/SKILL.md` — skill entrypoint (~80 lines). Frontmatter: `name`, `description` (front-loaded triggers), `allowed-tools: Bash(node ${CLAUDE_SKILL_DIR}/scripts/validate-doc-rules.mjs:*)`. Body documents invocation, JSON shape, rule IDs, how to interpret `mismatches[]` vs `autoFixed[]`.
- `.claude/skills/klp-doc-rules-validator/scripts/validate-doc-rules.mjs` — deterministic Node 22 script. Reads `src/components/<name>/<Pascal>.tsx` + `docs/components/_index_<name>.md`, checks 5 rules, optionally auto-fixes in place (`--fix`), emits JSON to stdout. Exit 0 pass, 1 mismatch, 2 usage. Resolves repo-root via `process.env.CLAUDE_PROJECT_DIR` or `process.cwd()` fallback.
- `.claude/commands/klp-doc-validate.md` — slash command `/klp-doc-validate [<name>]`. No arg → full DS sweep (walks every component in `klp-components.json`). With arg → single component. Prints a compact summary + non-zero exit code on any mismatch.

Documentalist is extended in `.claude/agents/documentalist.md`:

- DOCUMENT operation: insert new step 15a between current 15 (append to `docs/log.md`) and 16 (report JSON). Step 15a invokes `Bash: node .claude/skills/klp-doc-rules-validator/scripts/validate-doc-rules.mjs <name> --fix`, parses the returned JSON, merges `mismatches[]` and `autoFixed[]` into its own report.
- Extended SYNC: same invocation per component inside the existing loop, after regen + before log append.

## Rules (portée B)

| ID | Rule | Source of truth | Auto-fix |
|---|---|---|---|
| R1 | `## Props usage` section present in doc | doc file | Yes — insert empty section stub between `## Variants` and `## Tokens` |
| R2 | Every row in the Props usage table has a non-empty Class cell | doc file | Yes — fill missing cells with `optional` |
| R3 | `### Do / Don't` block emitted iff ≥1 prop in the table has Class `**computed**` or `**persistent**` | doc file | Yes — insert a stub block (headings + placeholder list) when missing; remove when extraneous |
| R4 | Blockquote "The `state` column below documents …" above `## Variants` iff source `cva()` declares a `state` axis AND source `Props` interface has no `state` prop | source + doc | Yes — insert the verbatim blockquote |
| R5 | Every prop in source's exported `*Props` interface has a `@propClass` JSDoc tag | source | No — semantic decision (report-only) |

R1-R4 are mechanical structural checks on the Markdown output. R5 reads the TS source (looks up the exported `interface <Name>Props`) and cross-checks every prop.

### Detection details

- **cva state axis**: regex match `variants:\s*\{[^}]*state\s*:\s*\{` in the component source. An empty `variants: {}` block does NOT count (Switch/Checkbox/Radio — state lives in CSS / Radix `data-*`).
- **`state` prop on Props interface**: parse the exported `interface <Name>Props`, match a `state` key at top-level (not nested, not in an extended type).
- **Class B trigger** (R4): cva state axis TRUE AND state prop FALSE.

## JSON output shape

```json
{
  "component": "tabulation-cells",
  "passed": true,
  "rulesChecked": 5,
  "autoFixed": [
    { "rule": "R4", "hint": "inserted Class B blockquote above ## Variants" }
  ],
  "mismatches": [
    { "rule": "R5", "prop": "foo", "hint": "source declares prop 'foo' without @propClass JSDoc tag" }
  ],
  "warnings": []
}
```

- `passed: true` iff `mismatches.length === 0` after auto-fix pass.
- `autoFixed[]` records what the script changed on disk in `--fix` mode. Empty when invoked read-only.
- `mismatches[]` records rule violations the script cannot safely auto-fix (R5 only in portée B).
- `warnings[]` reserved for non-blocking observations (e.g. prop ordering drift between source and doc — surfaces now, may become a rule later).

## CLI surface

From an agent / skill context: invoke via `${CLAUDE_SKILL_DIR}/scripts/validate-doc-rules.mjs`. From the terminal / CI: repo-root-relative path works too (same file).

```
node ${CLAUDE_SKILL_DIR}/scripts/validate-doc-rules.mjs <component>           # read-only, exit 1 on any mismatch
node ${CLAUDE_SKILL_DIR}/scripts/validate-doc-rules.mjs <component> --fix     # apply auto-fixes, exit 1 only if R5 mismatches remain
node ${CLAUDE_SKILL_DIR}/scripts/validate-doc-rules.mjs --all                 # read-only sweep, all components from klp-components.json
node ${CLAUDE_SKILL_DIR}/scripts/validate-doc-rules.mjs --all --fix           # sweep + auto-fix
```

`--fix` writes the doc file in place, preserving the `KLP:NOTES` block verbatim (same contract the documentalist respects). Auto-fix never touches source files — R5 is report-only.

## Exit codes

- 0 — passed (possibly after auto-fix)
- 1 — mismatches remain (R5 or any other non-fixable violation)
- 2 — usage error (missing arg, file not found, malformed source)

## Retry contract (documentalist)

Same as `klp-token-validator`: max 1 retry. Because the validator auto-fixes R1-R4 itself in one pass, a retry is meaningful only for R5 (which the user resolves by adding `@propClass` in source). Documentalist reports R5 mismatches with file path + prop name and lets the human decide.

## Skill frontmatter

```markdown
---
name: klp-doc-rules-validator
description: Validate structural rules on a klp component's generated doc page (Props usage table, Class column, Do/Don't block, Class B blockquote, @propClass coverage). Auto-fixes mechanical drift. Invoked by /klp-build-component Stage 4 post-documentalist, by documentalist SYNC per component, or manually via /klp-doc-validate.
allowed-tools: Bash(node ${CLAUDE_SKILL_DIR}/scripts/validate-doc-rules.mjs:*)
---
```

The description front-loads the five check names so the skill is retrievable by intent. `allowed-tools` pre-approves script invocation to avoid per-use prompts.

## Slash command

`.claude/commands/klp-doc-validate.md`:

```
# /klp-doc-validate

Argument: optional `<component>` (kebab-case). Omit to sweep all components.

Runs `node .claude/skills/klp-doc-rules-validator/scripts/validate-doc-rules.mjs <component-or--all> --fix` in the repo root. Parses JSON. Prints:
- One line per auto-fix applied.
- One line per mismatch remaining.
- Exit with script's exit code.
```

## Verification

1. Unit coverage: the script has a handful of fixture pairs in `.claude/skills/klp-doc-rules-validator/__fixtures__/` — a source.tsx + doc.md pair for each rule's failure mode + a passing baseline. Run via `node --test .claude/skills/klp-doc-rules-validator/scripts/validate-doc-rules.test.mjs`.
2. Regression: invoke `node .claude/skills/klp-doc-rules-validator/scripts/validate-doc-rules.mjs tabulation-cells`. Expect `passed: true` (the manual fix committed 2026-04-21 holds) with R4 in `autoFixed: []`.
3. Regression: invoke `--all` in read-only mode after a SYNC run. Expect no mismatches across the 25-component DS.
4. Integration: run documentalist DOCUMENT on a component where the doc is missing the Class B blockquote. Confirm the validator auto-fixed it and the final doc matches the template.
5. Integration: run `/klp-doc-validate` standalone. Confirm the slash command returns a per-component summary.
6. Failure mode: remove a `@propClass` tag from one prop in an existing component source. Run `--fix`. Confirm `passed: false`, `mismatches` contains a R5 entry naming the prop + file, and exit code is 1.

## Non-goals

- No refactor of the existing documentalist doc template. Rules 1-4 are derived from the current spec; the validator enforces what already exists.
- No replacement of LINT checks. LINT remains the broad doc-tree health check; this validator focuses specifically on per-page structural rules.
- No Figma-side enforcement. If a cva state axis is designed away upstream, the rules adapt on next SYNC.
- No pre-commit hook integration in v1.
- No auto-fix of R5 (adding `@propClass` to source). That is a human decision.
