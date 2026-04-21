---
name: klp-doc-rules-validator
description: Validate structural rules on a klp component's generated doc page (Props usage table, Class column, Do/Don't block, Class B blockquote, @propClass coverage). Auto-fixes mechanical drift (R1-R4) in place; R5 is report-only. Triggers when /klp-build-component runs Stage 4b, when documentalist runs DOCUMENT or SYNC, or when the user runs /klp-doc-validate.
allowed-tools: Bash(node ${CLAUDE_SKILL_DIR}/scripts/validate-doc-rules.mjs:*)
---

# klp-doc-rules-validator

Deterministic validator + auto-fixer for per-component doc pages. Runs in under a second, no Chromium, no thresholds. Enforces five rules.

## Invocation

```bash
node ${CLAUDE_SKILL_DIR}/scripts/validate-doc-rules.mjs <component>            # read-only
node ${CLAUDE_SKILL_DIR}/scripts/validate-doc-rules.mjs <component> --fix      # auto-fix R1-R4 in place
node ${CLAUDE_SKILL_DIR}/scripts/validate-doc-rules.mjs --all                  # sweep every component in klp-components.json
node ${CLAUDE_SKILL_DIR}/scripts/validate-doc-rules.mjs --all --fix            # sweep + auto-fix
```

Paths resolve relative to the repo root via `process.env.CLAUDE_PROJECT_DIR` (fallback: `process.cwd()`).

## Output shape

Single JSON object on stdout:

```json
{
  "component": "<kebab-name-or---all>",
  "passed": true,
  "rulesChecked": 5,
  "autoFixed": [{ "rule": "R4", "component": "<name>", "hint": "inserted Class B blockquote" }],
  "mismatches": [{ "rule": "R5", "component": "<name>", "prop": "<name>", "hint": "missing @propClass" }],
  "warnings": []
}
```

`passed: true` iff `mismatches.length === 0` after the auto-fix pass. In sweep mode the object aggregates — `passed` is AND-reduced across every component, `autoFixed` and `mismatches` are flat unions.

## Exit codes

- `0` — passed (possibly after auto-fix)
- `1` — mismatches remain
- `2` — usage error (missing arg, file not found, malformed source)

## Rules

| ID | Rule | Auto-fix |
|---|---|---|
| R1 | `## Props usage` section present in `docs/components/_index_<name>.md`. | Yes — insert empty stub between `## Variants` and `## Tokens`. |
| R2 | Every row in the Props usage table has a non-empty Class cell (one of `required`, `optional`, `**computed**`, `**persistent**`). | Yes — fill missing with `optional`. |
| R3 | `### Do / Don't` block emitted iff at least one prop has Class `**computed**` or `**persistent**`. | Yes — add stub when missing, remove when extraneous. |
| R4 | Blockquote (verbatim text) above `## Variants` iff source `cva()` declares a `state` axis AND source `Props` interface has no `state` prop at top level. | Yes — insert the blockquote. |
| R5 | Every prop in the source's exported `interface <Name>Props` has a `@propClass` JSDoc tag. | No — report-only (semantic decision). |

## Retry contract

Documentalist invokes with `--fix`, parses the JSON, and reports `mismatches[]` (R5 entries) up to the user. Max 1 automated retry after the user fixes R5 at the source.
