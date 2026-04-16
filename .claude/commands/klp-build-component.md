---
description: Build a klp component from a Figma node. Orchestrates figma-extractor → component-adapter → visual-verifier with up to 3 correction passes. Usage: /klp-build-component <figma-node-name-or-id>
argument-hint: <figma-node-name>
allowed-tools: Agent, Bash, Read, Write, Edit, Glob, Grep
---

# /klp-build-component

Argument: **$ARGUMENTS** — the Figma node name or ID for the component to build (e.g. `Button`, `AlertDialog`, `1234:5678`).

You are orchestrating the 3-agent workflow that produces a production klp component from a Figma node. Follow these steps exactly. Do not shortcut.

---

## Preflight

1. Verify the argument is present. If empty, ask the user which component (by Figma node name) and stop.
2. Normalize: derive a kebab-case component name from the argument. `Button` → `button`; `AlertDialog` → `alert-dialog`; if argument is a node ID (contains `:`), keep the ID for Figma but ask the user for a kebab-case name.
3. Verify prerequisites:
   - `git status --porcelain` — if dirty with unrelated changes, ask the user to stash/commit first.
   - `test -f src/styles/tokens.css` — if missing, abort ("bootstrap not done").

## Stage 1 — Extract

Dispatch the **figma-extractor** subagent via the Agent tool:

- `subagent_type: "figma-extractor"`
- `description`: "Extract <ComponentName> Figma spec"
- `prompt`: "Extract the Figma component '$ARGUMENTS'. Output its spec + variant screenshots under `.klp/figma-refs/<kebab-name>/`. Follow your system prompt exactly. Return the JSON report."

Parse the returned JSON. If `variantCount === 0` or `specPath` missing, abort with the extractor's error message.

If `tokenGapCount > 0`:
- Print the gaps to the user.
- Ask: "Token gaps detected. Run `pnpm run sync:tokens` before adapting? (y/n)" — if y, run it and re-dispatch the extractor to refresh the spec. If n, proceed with gaps noted (adapter will leave `// TODO: token gap` comments).

## Stage 2 — Adapt (with correction loop, max 3 passes)

Initialize `attempt = 1`, `verifyReportPath = null`.

While `attempt ≤ 3`:

1. Dispatch the **component-adapter** subagent:
   - `subagent_type: "component-adapter"`
   - `prompt`: "Write the klp component for `<kebab-name>`. Read the spec at `.klp/figma-refs/<kebab-name>/spec.json`. Follow your system prompt exactly. If a verify report is provided, patch only the failing variants.\n\nVerify report: `<verifyReportPath or 'none'>`\n\nReturn the JSON report."
   - Parse the returned JSON. If `typecheck !== "pass"`, abort (the adapter should have fixed this itself).

2. Dispatch the **visual-verifier** subagent:
   - `subagent_type: "visual-verifier"`
   - `prompt`: "Verify component `<kebab-name>`. Read the spec, render the playground route, diff screenshots against Figma references. Follow your system prompt exactly. Return the JSON report."
   - Parse the returned JSON.

3. If `passed === true`: break out of the loop (success path).

4. If `attempt === 3`: stop looping, report failure to the user with the final report path and ask whether to commit partial work or abort.

5. Otherwise: set `verifyReportPath = <path from verifier>`, increment `attempt`, and continue.

## Stage 3 — Document (non-blocking)

Only runs if Stage 2 ended with `passed: true`.

Dispatch the **documentalist** subagent:

- `subagent_type: "documentalist"`
- `description`: "Document <ComponentName>"
- `prompt`: "Generate the documentation for the klp component `<kebab-name>`. operation: DOCUMENT, component: <kebab-name>. Follow your system prompt exactly. Bootstrap `docs/` if missing. Run the reverse-index pass at the end. Return the JSON report."

Parse the returned JSON.

- On success: include the doc page path in the Stage 4 summary.
- On failure: **do not abort** — print a warning to the user with the documentalist's error message, then proceed to Stage 4. The component is built and verified; missing docs is a recoverable state (the user can run the documentalist manually with `dispatch documentalist DOCUMENT <name>`).

## Stage 4 — Finalize

On success:

1. Print a short summary:
   - Component name
   - Files created (from adapter's report)
   - Variants verified (from verifier's report)
   - Number of correction passes used
   - Doc page path (from documentalist's report) or "documentation skipped — see warning above"
2. Suggest a commit: `feat(<kebab-name>): add <PascalName> component`.
3. **Do not commit automatically.** Ask the user to review first; only commit if they explicitly say yes.

On failure after 3 passes (Stage 2):

1. Print the final verify report path.
2. List the remaining failing variants and the adapter's last-known suspected causes.
3. Ask: "Commit partial work, or abort and discard?" Do not commit without explicit confirmation.
4. Skip Stage 3 (documentalist) — only document components that pass verification.

## Do-nots

- Do not dispatch the adapter without a valid spec from the extractor.
- Do not dispatch the verifier without the adapter having run at least once.
- Do not dispatch the documentalist before the verifier reports `passed: true`.
- Do not skip the typecheck gate.
- Do not edit component source directly from this orchestrator — only via the component-adapter subagent.
- Do not commit without user confirmation.
- Do not let a documentalist failure block the commit gate — it is non-blocking.
