# /klp-doc-validate

Argument: optional `<component>` (kebab-case). Omit to sweep every component in `klp-components.json`.

## What to do

1. If an argument is present, run via Bash:
   ```
   node .claude/skills/klp-doc-rules-validator/scripts/validate-doc-rules.mjs <component> --fix
   ```
   Otherwise run:
   ```
   node .claude/skills/klp-doc-rules-validator/scripts/validate-doc-rules.mjs --all --fix
   ```

2. Parse the JSON emitted on stdout.

3. Print a compact summary to the user:
   - `✓ passed` — when `passed: true` and `autoFixed` is empty.
   - `✓ auto-fixed N issue(s)` — when `passed: true` and `autoFixed[]` is non-empty. List each entry's `hint`.
   - `✗ N remaining mismatch(es)` — when `passed: false`. List each entry's `rule`, `component`, `prop` (if present), `hint`.

4. Exit with the script's exit code.

5. If any mismatches remain, they are R5 (source prop missing `@propClass` JSDoc). Suggest the user add the tag in the named `<file>:<prop>` then re-run the command.

The skill `klp-doc-rules-validator` pre-approves the Bash invocation via its `allowed-tools` frontmatter; invoking through the skill avoids per-use permission prompts.
