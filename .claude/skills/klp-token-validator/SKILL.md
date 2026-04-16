---
name: klp-token-validator
description: Validate that a klp component's source uses the correct semantic alias tokens for each (layer × state × property) bound in its spec.json. Invoked by /klp-build-component at Stage 3, or manually via `node scripts/validate-tokens.mjs <component>`.
---

# klp-token-validator

Runs after the component-adapter has written the source. Confirms that every Figma token binding in `spec.json` is reflected by a matching Tailwind alias utility in the component source. No Chromium, no pixel diff, no thresholds — deterministic string matching, ≤ 1 second.

## When to invoke

- **Pipeline (automatic)**: Stage 3 of `/klp-build-component`, after the adapter and before the documentalist.
- **Manual**: after hand-editing a component's cva classes, or after regenerating the spec, to confirm nothing drifted.
- **Audit**: on every component in `src/components/*` to surface token-binding rot.

## How to invoke

```bash
node scripts/validate-tokens.mjs <component-name>
```

- Input: the kebab-case component name (e.g. `checkbox`, `alert-dialog`).
- Reads: `.klp/figma-refs/<name>/spec.json` + `src/components/<name>/<PascalName>.tsx`.
- Writes: nothing.
- Stdout: a single JSON object (pretty-printed).
- Exit code: `0` on pass, `1` on fail, `2` on usage error.

## Output shape

```json
{
  "component": "checkbox",
  "radixPrimitive": "@radix-ui/react-checkbox",
  "passed": true | false,
  "mismatchCount": 0,
  "warningCount": 0,
  "mismatches": [
    {
      "variantId": "default-clicked",
      "layer": "indicator",
      "property": "color",
      "stateSelector": "data-[state=checked]:",
      "expectedUtility": "text-klp-fg-on-emphasis",
      "expectedToken": "--klp-fg-on-emphasis",
      "figmaVar": "fg/on-emphasis",
      "hint": "Checkbox.tsx → indicatorVariants cva block (...)"
    }
  ],
  "warnings": [
    { "type": "hex-literal", "match": "#FFFFFF", "line": 42 },
    { "type": "primitive-token", "match": "klp-color-emerald-500", "line": 61 },
    { "type": "missing-lucide-import", "icons": ["check", "minus"] },
    { "type": "unknown-state", "state": "foo", "primitive": "@radix-ui/react-checkbox", "variantId": "default-foo" },
    { "type": "unknown-property", "property": "letterSpacing", "variantId": "primary-md-rest", "layer": "label", "hint": "..." },
    { "type": "layer-no-cva", "layer": "icon-left", "variantId": "primary-md-rest", "hint": "..." }
  ]
}
```

## How to interpret

- `passed: true` → proceed to Stage 4 (documentalist). Warnings are informational only.
- `passed: false` → for each mismatch:
  1. Open the component source at the file named in `hint`.
  2. Locate the cva block named in `hint`.
  3. Add the missing `${stateSelector}${expectedUtility}` class (or the bare `expectedUtility` if the same token is applied across all states — V1-laxest accepts either form).
  4. Re-invoke the validator (max 1 retry automatically; subsequent retries need explicit user approval).

## V1-laxest semantics (important)

The validator checks that `expectedUtility` appears **somewhere** in the target layer's cva block, with **any** selector prefix or none. This means:

- ✅ `hover:bg-klp-bg-brand-low` satisfies the hover state's binding.
- ✅ `bg-klp-bg-brand-low` (bare) ALSO satisfies the hover state's binding (V1-laxest fallback).
- ❌ `bg-klp-bg-brand-contrasted` does NOT satisfy a binding expecting `bg-klp-bg-brand-low`.

The rationale: token-correctness is enforced; state-scoping is the designer's responsibility at the playground. A class applied once in base might correctly cover multiple states (e.g., padding constant across all states). This avoids false positives for that common pattern.

**Trade-off**: a class applied to the wrong state (e.g., a `hover:` class accidentally placed on a `rest` row) is NOT caught. The designer verifies this visually. If false positives start biting, escalate the validator to AST-aware positional checking in V2.

## Warning types and how to resolve

| Type | Meaning | Fix |
|---|---|---|
| `hex-literal` | A hex color literal (`#RRGGBB`) found in source. | Replace with a `klp-*` alias utility. |
| `primitive-token` | A raw primitive token (`klp-color-*`, `klp-spacing-*`) used. Components must only reference aliases. | Find the alias that resolves to this primitive in `aliases.css`, use the alias utility instead. |
| `missing-lucide-import` | Spec declares an icon but source has no `from 'lucide-react'` import. | `import { IconName } from 'lucide-react'`. |
| `unknown-state` | A state in `spec.variants[].axes.state` isn't in `STATE_MAP` for this Radix primitive. | Add the state → selector mapping in `scripts/validate-tokens.mjs` (1 line). |
| `unknown-property` | A layer property (e.g. `letterSpacing`) has no mapping in `PROPERTY_TO_PREFIX`. | Add the property → utility-prefix mapping in `scripts/validate-tokens.mjs`. |
| `layer-no-cva` | A spec layer has no corresponding cva block in source. Its classes can't be validated. | Typically OK — layers rendered inline (e.g., `icon-left` inside a `<span>`) don't need their own cva. Review that classes are correctly applied inline. |

## Known limitations (V1)

- **Multi-axis positional accuracy**: Button has `type × size × state` — the V1 validator searches for the expected utility anywhere in the layer's cva block, not specifically inside the right `intent.primary` or `size.md` sub-string. Acceptable trade-off; false positives are rare (would require the exact same token appearing in the wrong sub-variant).
- **Literal values**: spec bindings with `value.literal` (e.g., `height: "36px"`) and no token are skipped. Literal correctness is left to visual review.
- **State aliases**: if a spec uses a state name not in the primitive's `STATE_MAP`, it emits `unknown-state` warning and skips validation for that variant.

## When to add to `STATE_MAP` / `PROPERTY_TO_PREFIX`

If a new Radix primitive or a new layer property shows up in a spec, the validator will emit a warning (`unknown-state` or `unknown-property`). Add the mapping inline in `scripts/validate-tokens.mjs`. This is a 1-line cost and keeps the validator fast + explicit.
