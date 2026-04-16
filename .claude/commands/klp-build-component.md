---
description: Build a klp component from a Figma node. Orchestrates figma-extractor → component-adapter → token-validator → documentalist. Usage: /klp-build-component <figma-node-name-or-id>
argument-hint: <figma-node-name>
allowed-tools: Agent, Bash, Read, Write, Edit, Glob, Grep
---

# /klp-build-component

Argument: **$ARGUMENTS** — the Figma node name or ID for the component to build (e.g. `Button`, `AlertDialog`, `1234:5678`).

You are orchestrating the workflow that produces a production klp component from a Figma node: extract the Figma spec, write the React source, validate that the source's token bindings match the spec, then generate docs. Follow these steps exactly. Do not shortcut.

---

## Preflight

1. Verify the argument is present. If empty, ask the user which component (by Figma node name) and stop.
2. Normalize: derive a kebab-case component name from the argument. `Button` → `button`; `AlertDialog` → `alert-dialog`; if argument is a node ID (contains `:`), keep the ID for Figma but ask the user for a kebab-case name.
3. Verify prerequisites:
   - `git status --porcelain` — if dirty with unrelated changes, ask the user to stash/commit first.
   - `test -f src/styles/tokens.css` — if missing, abort ("bootstrap not done").
   - `test -f scripts/validate-tokens.mjs` — if missing, abort ("token validator not installed").

## Stage 1 — Extract

Dispatch the **figma-extractor** subagent via the Agent tool:

- `subagent_type: "figma-extractor"`
- `description`: "Extract <ComponentName> Figma spec"
- `prompt`: "Extract the Figma component '$ARGUMENTS'. Output its spec + variant screenshots under `.klp/figma-refs/<kebab-name>/`. Follow your system prompt exactly. Return the JSON report."

Parse the returned JSON. If `variantCount === 0` or `specPath` missing, abort with the extractor's error message.

If `tokenGapCount > 0`:
- Print the gaps to the user (they're informational — the adapter can still run).
- Ask: "Token gaps detected. Run `pnpm run sync:tokens` before adapting? (y/n)". If y, run it and re-dispatch the extractor. If n, continue — the validator will flag any concrete binding mismatches later.

## Stage 2 — Adapt

Dispatch the **component-adapter** subagent:

- `subagent_type: "component-adapter"`
- `description`: "Adapt <ComponentName>"
- `prompt`: "Write the klp component for `<kebab-name>`. Read the spec at `.klp/figma-refs/<kebab-name>/spec.json`. Follow your system prompt exactly. Return the JSON report."
- Parse the returned JSON. If `typecheck !== "pass"`, abort (the adapter is expected to fix typecheck errors itself).

## Stage 3 — Validate tokens

Invoke the `klp-token-validator` by running the script directly via Bash:

```
node scripts/validate-tokens.mjs <kebab-name>
```

Parse the stdout as JSON. Handle three cases:

1. **`passed === true`** → continue to Stage 4. Informational warnings (hex-literal, missing-lucide-import, primitive-token, unknown-state, unknown-property, layer-no-cva) are surfaced to the user but do not block.

2. **`passed === false` with `mismatchCount > 0`** → for each entry in `mismatches[]`:
   - Open the file named in `hint` (e.g. `Checkbox.tsx → indicatorVariants cva block`).
   - Locate the cva block.
   - Add the missing class: `${stateSelector}${expectedUtility}` (state-prefixed), OR the bare `expectedUtility` if the same token is applied across all states — V1-laxest accepts either form.
   - After patching all mismatches, re-run `node scripts/validate-tokens.mjs <kebab-name>` exactly **once**.

3. **Still failing after 1 retry** → do not retry further. Print the remaining mismatches to the user and ask: "Commit partial work, dig in, or abort?" Token-binding mismatches that survive the first patch usually indicate a parser edge case (multi-axis combinatorics, unusual cva shape) or a spec/anatomy mismatch — both need human judgment. Skip Stage 4.

## Stage 4 — Document (non-blocking)

Only runs if Stage 3 ended with `passed: true`.

Dispatch the **documentalist** subagent:

- `subagent_type: "documentalist"`
- `description`: "Document <ComponentName>"
- `prompt`: "Generate the documentation for the klp component `<kebab-name>`. operation: DOCUMENT, component: <kebab-name>. Follow your system prompt exactly. Bootstrap `docs/` if missing. Run the reverse-index pass at the end. Return the JSON report."

Parse the returned JSON.

- On success: include the doc page path in the Stage 5 summary.
- On failure: **do not abort** — print a warning with the documentalist's error message, proceed to Stage 5. Missing docs is recoverable (the user can dispatch the documentalist manually with `operation: DOCUMENT, component: <name>`).

## Stage 5 — Finalize

On success:

1. Print a short summary:
   - Component name
   - Files created (from adapter's report)
   - Validator: `passed` + any warnings
   - Doc page path (from documentalist's report) or "documentation skipped — see warning above"
2. Suggest a commit: `feat(<kebab-name>): add <PascalName> component`.
3. **Do not commit automatically.** Ask the user to review first; only commit if they explicitly say yes.

On failure at Stage 3 (after 1 retry):

1. Print the remaining mismatches.
2. Ask: "Commit partial work, dig in, or abort?" Do not commit without explicit confirmation.
3. Skip Stage 4 (documentalist) — only document components that pass validation.

## Do-nots

- Do not dispatch the adapter without a valid spec from the extractor.
- Do not run the validator without the adapter having run at least once.
- Do not dispatch the documentalist before the validator reports `passed: true`.
- Do not skip the typecheck gate (Stage 2).
- Do not edit component source directly outside of Stage 3's retry loop — structural changes go through the component-adapter subagent.
- Do not commit without user confirmation.
- Do not let a documentalist failure block the commit gate — it is non-blocking.
