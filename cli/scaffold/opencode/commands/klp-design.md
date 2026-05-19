---
description: Run the agentic design pipeline on a YAML request. Usage: /klp-design <id> [extras…]
agent: request-analyzer
---

# /klp-design

Argument: **$ARGUMENTS** — first token is the request id (kebab-case). Remaining tokens are ephemeral extras passed through to the pipeline.

You are orchestrating the 4-stage design pipeline. Follow these steps exactly; do not shortcut.

---

## Preflight

1. Parse `$ARGUMENTS`. Split on whitespace. First token = `id`. Rest = `extras` (join with single spaces).
2. If `id` is empty, ask the user which request and stop.
3. Verify `requests/pending/<id>.yaml` exists. If not:
   - If it exists in `to-be-review/` or later, refuse and suggest `/klp-design-reset <id>` to re-run.
   - Otherwise error: "no pending request matching id".
4. Verify `docs/agent-brief.md` exists (DS docs shipped). If not: abort with "run `klp-ui update`".
5. Verify `klp.lock.json` exists. If not: abort with "run `klp-ui init` or `klep-ds-init` first".

## Stage 1 — Analyze

You ARE the request-analyzer (this command is dispatched to you). Execute your own workflow:
- Read `requests/pending/<id>.yaml`. Extras: `<extras>`.
- Write the plan to `.klp/staging/<id>/plan.json`.
- Return a short JSON summary.

If `screenCount === 0` or `planPath` missing, abort.

Print a short summary to the user (screen count, DS components, ad-hoc count, gap count).

## Stage 2 — Build ad-hoc (conditional)

If `plan.ad_hoc` is non-empty across any screen, spawn the **ad-hoc-builder** subagent with:
- prompt: "Build ad-hoc components from `.klp/staging/<id>/plan.json`. Return JSON report."

If the report contains `skipped` entries, print them to the user; they may require attention.

## Stage 3 — Compose

Spawn the **mockup-composer** subagent with:
- prompt: "Compose mockups from `.klp/staging/<id>/plan.json`. Return JSON report."

If `missingDsComponents` is non-empty, HALT. Print the missing names and tell the user to run `klp-ui add <name>...` for each missing component, or to mark those needs as ad-hoc in the YAML.

## Stage 4 — Finalize

Spawn the **design-finalizer** subagent with:
- prompt: "Finalize request `<id>` using plan `.klp/staging/<id>/plan.json`. Extras: `<extras>`. Return JSON report."

## Summary

Print a final message:

```
✓ Mockups generated: <n> screens
  Request moved to: requests/to-be-review/<id>.yaml
  Open: http://localhost:5173/#/mockups/<id>/<first-screen>
  Next: /klp-design-review <id> after you've looked at them.
```
