---
title: InputFile
type: component
status: stable
category: inputs
captureBrand: klub
radixPrimitive: null
sources:
  - .klp/figma-refs/input-file/spec.json
  - src/components/input-file/InputFile.tsx
dependencies:
  components: ["button", "input"]
  externals: ["class-variance-authority", "lucide-react"]
  tokenGroups: ["colors", "spacing", "radius", "typography"]
  brands: ["klub"]
usedBy: []
created: 2026-08-07
updated: 2026-08-07
---

# InputFile

File upload field with two layouts: DropZone (dashed drag-and-drop panel with a decorative files illustration) and Simple (a labeled Input field with a plus icon + placeholder, helper text, and a 'Take picture' action button).

<!-- KLP:INTENT:BEGIN -->

## When to use

The control that selects files — the drop-zone layout for a dashed drag-and-drop panel, or the simple layout for a compact labelled field with a take-picture action.

**Don't use it for:** Not for showing files already chosen; render a file-dropped row per file beneath it. Do not wire a bare input to type=file — this component owns the drag-and-drop behaviour.

## Don't confuse with

| Component | How to choose |
|---|---|
| `file-dropped` | input-file selects the file; file-dropped displays one already selected. |
| `input` | input-file handles files and drag-and-drop; input handles typed text. |

<!-- KLP:INTENT:END -->

## Anatomy

```
root                (div, drop-zone: <label>)
├── dashed-border      (svg rect, drop-zone only)    — Not a Figma anatomy layer; draws the 16/16 dash pattern in place of CSS `border-style: dashed` (see Notes below)
├── illustration       (InputFileIllustration)     — Decorative, drop-zone only. Not a klp component — see Dependencies.
├── dropzone-label     (span)                       — 'Choose your files' text, drop-zone only
├── progress-indicator (div, opacity 0)              — Hidden artifact, never rendered visually (source: spec.json anatomy.progress-indicator)
├── file-input         (Input instance, simple only) — DS <Input size="small"> reused wholesale, label + description + leading Plus icon
└── action-button      (Button instance, simple only) — DS <Button variant="tertiary" size="sm"> reused wholesale, trailing Camera icon
```

The native `<input type="file">` element itself is not a separate anatomy layer in the Figma spec — it is visually hidden (`sr-only`) in both layouts and wired to the visible affordance (the `<label>` in drop-zone, the `onClick` handler on `Input` in simple) (source: `InputFile.tsx`).

The `dashed-border` node is a local `DropZoneDashedBorder` component: an absolutely-positioned `<svg>` with a single `<rect rx="7.5" strokeDasharray="16 16">`, inset 0.5px so the 1px `strokeWidth="1"` line sits fully inside the box (Figma `strokeAlign: INSIDE`). It is not itself a Figma anatomy layer — it is the rendering strategy for the `root` layer's stroke (source: `InputFile.tsx`; see `KLP:NOTES` below for the inline-`<svg>` sanction).

> ❓ UNVERIFIED (source: spec.json:variants[*].screenshotStatus = "FAILED"): reference screenshots for both variants failed to capture this session (expired Figma REST token). Checkmarks below are confirmed from `spec.variants[]` without a linked image.

## Variants

Single axis, `inputType`:

| inputType | Captured |
|---|---|
| `drop-zone` | ✓ (source: spec.json:variants[0], figmaNodeId `113649:1788`) |
| `simple` | ✓ (source: spec.json:variants[1], figmaNodeId `113649:1787`) |

The `progress-indicator` layer is present in the Figma component tree for `drop-zone` but is `opacity: 0` and explicitly flagged "do not implement visually" (source: spec.json:anatomy `progress-indicator`.notes) — it is not rendered by the shipped implementation and carries no props.

The `drop-zone` layout root now also carries `justify-center` (Figma `primaryAxisAlignItems: CENTER`), centering the illustration + label row horizontally within the panel (source: `InputFile.tsx` `rootVariants.drop-zone`). This is a layout utility, not a token-bound property, so it has no row in the Tokens table below.

## Props usage

> **Behavioral contract — `InputFile` is a trigger only. It never displays the selected filename.**
> On BOTH layouts (`drop-zone` and `simple`), and through BOTH input paths (the OS file picker and
> drag-and-drop), the field/label keeps its placeholder at all times. `InputFile` holds NO internal
> record of the selection — the `fileNames` state that used to inject a filename into the placeholder
> was removed; that behavior was wrong. Selection leaves exclusively through `onFilesSelected`; the
> **parent** owns the list and renders one [`FileDropped`](./_index_file-dropped.md) row per file,
> below the input. The native input's `value` is reset after each selection so picking the same file
> twice still fires `change`. `InputFile` is the **selection half** of a two-component pattern —
> [`FileDropped`](./_index_file-dropped.md) is the **display half**. In the Klépierre tools these two
> are never used apart: an `InputFile` with no `FileDropped` list gives the user no feedback that
> anything happened. See the canonical composed pattern in
> [`InputFile.example.tsx`](../../src/components/input-file/InputFile.example.tsx) (parent-owned
> `UploadedFile[]` state, a `formatSize` helper, add + remove wiring) and the live `CompositionDemo`
> for both layouts in [`playground/routes/input-file.tsx`](../../playground/routes/input-file.tsx).

Extends `Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size' | 'type' | 'onChange'>`.

| Prop | Type | Default | Class | Description |
|---|---|---|---|---|
| `layout` | `'drop-zone' \| 'simple'` | `'drop-zone'` | optional | Which visual layout to render: dashed drag-and-drop panel or a labeled Input row |
| `label` | `string` | `'Power of attorney'` | optional | Label rendered above the field in the `simple` layout (forwarded to the DS `Input`) |
| `description` | `string` | `'PDF, JPG, PNG (20mo max)'` | optional | Helper text rendered below the field in the `simple` layout (forwarded to the DS `Input`) |
| `placeholder` | `string` | `'Choose your files'` | optional | Placeholder text for the `simple` layout's Input field |
| `actionLabel` | `string` | `'Take picture'` | optional | Label for the 'Take picture' action button, only rendered in the `simple` layout |
| `accept` | `string` | — | optional | MIME types / extensions accepted by the underlying `<input type="file">` |
| `multiple` | `boolean` | — | optional | Allow selecting more than one file |
| `disabled` | `boolean` | — | optional | Disable both the field and drag-and-drop interaction |
| `onFilesSelected` | `(files: File[]) => void` | — | optional | Called with the array of selected files, from either the file picker or a drop event — the ONLY way selection leaves the component |
| `className` | `string` | — | optional | Additional className applied to the outer root wrapper |

No prop in this table carries `@propClass computed` or `@propClass persistent` (source: `InputFile.tsx` — every prop in the exported `InputFileProps` interface is tagged `@propClass optional`, none `required`, `computed`, or `persistent`; verified against the current source, no prop was added or removed). The internal `dragActive` state (drag-over visual feedback) is component-owned `useState` and is not exposed as a prop — it doesn't appear in the table above because it isn't part of the public API. The previous `fileNames` state has been removed entirely (see the behavioral contract above); there is no replacement prop and none should be added.

## Tokens

### `root` layer

| Property | Token | Resolved (klub) |
|---|---|---|
| fill (drop-zone) | `--klp-bg-brand-low` | `#F2FAF7` |
| stroke (drop-zone, rest) | `--klp-border-brand` | `#1EADA5` |
| stroke (drop-zone, dragActive) | `--klp-border-brand-emphasis` | `#0F6F7C` |
| cornerRadius | — | literal: `8px` (`rounded-klp-l` on the panel; the SVG dash rect uses `rx="7.5"` to match) |
| paddingX | — | literal: `16px` |
| paddingY | — | literal: `8px` |
| itemSpacing (drop-zone) | — | literal: `8px` (`gap-klp-size-xs`) |
| itemSpacing (simple) | — | literal: `24px` (`gap-klp-size-l`) |
| fill (simple) | — | literal: `transparent` |

> ⚠️ CONTRADICTION: `spec.json:variants[0].layers.root.literals.itemSpacing` still records `24px`, captured before the source was corrected against Figma `Frame 194` (itemSpacing 8px). The table above reflects the corrected, in-browser-verified `gap-klp-size-xs` (8px) now shipped in `InputFile.tsx`; the spec literal is stale and should be re-extracted on the next figma-extractor pass.

**Dashed outline is not a CSS border.** `border-style: dashed` cannot control dash length (the browser derives it from the border width), and Figma specifies an exact `dashPattern: [16, 16]` at `strokeWeight: 1` / `strokeAlign: INSIDE`. The drop-zone outline is drawn by `DropZoneDashedBorder` — an absolutely-positioned `<svg>` with one `<rect strokeDasharray="16 16">`, colored via the exported `dashedBorderVariants` cva (`stroke-klp-border-brand` at rest, `stroke-klp-border-brand-emphasis` while `dragActive`) so it still follows `[data-brand]` (source: `InputFile.tsx`). See `KLP:NOTES` for the sanctioned-inline-SVG record.

### `illustration` layer

| Property | Token | Resolved (klub) |
|---|---|---|
| accentFill (2 of 24 paths) | `--klp-bg-brand` | `#1EADA5` |
| remaining 22 paths | — | literal neutral grays/whites, deliberately not tokenized — see `KLP:NOTES` below |

### `dropzone-label` layer

| Property | Token | Resolved (klub) |
|---|---|---|
| color | `--klp-fg-muted` | `#5F6563` |
| fontSize | `--klp-font-size-text-large` | `18px` |
| fontFamily | `--klp-font-family-label` | `'Test Calibre'` |
| fontWeight | `--klp-font-weight-label` | `400` |
| lineHeight | — | literal: `28px` |

### `progress-indicator` layer

| Property | Token | Resolved (klub) |
|---|---|---|
| opacity | — | literal: `0` (hidden artifact, not rendered — source: spec.json) |

### `file-input` layer (simple only)

| Property | Token | Resolved (klub) |
|---|---|---|
| fill | `--klp-bg-default` | `#FFFFFF` |
| stroke | `--klp-border-default` | `#D7DAD9` |
| cornerRadius | `--klp-radius-l` | `8px` |

Full token map for the nested `Input` instance lives on [Input](./_index_input.md) — the table above reflects only the outermost box properties captured on this component's own spec.

### `action-button` layer (simple only)

| Property | Token | Resolved (klub) |
|---|---|---|
| fill | `--klp-bg-inset` | `#EEF1F0` |
| stroke | `--klp-border-invisible` | `transparent` |
| cornerRadius | `--klp-radius-l` | `8px` |

Full token map for the nested `Button` instance lives on [Button](./_index_button.md) — the table above reflects only the outermost box properties captured on this component's own spec.

## Examples

```tsx
import { InputFile } from '@/components/input-file'

function handleFiles(files: File[]) {
  // wire up to your upload logic
  void files
}

export function InputFileExample() {
  return (
    <div className="flex flex-col gap-6">
      {/* DropZone — dashed drag-and-drop panel */}
      <InputFile
        layout="drop-zone"
        multiple
        accept="application/pdf,image/*"
        onFilesSelected={(files) => handleFiles(files)}
      />

      {/* Simple — labeled Input row + camera action button */}
      <InputFile
        layout="simple"
        label="Power of attorney"
        description="PDF, JPG, PNG (20mo max)"
        accept="application/pdf,image/*"
        onFilesSelected={(files) => handleFiles(files)}
      />
    </div>
  )
}
```

## Accessibility

- **Role**: `group` (source: spec.json:a11y.role)
- **Keyboard support**: Tab · Enter · Space (source: spec.json:a11y.keyboardSupport)
- **ARIA notes**: Both variants drive a native `<input type="file">` that is visually hidden via `sr-only` (not `display: none`), keeping it in the tab order and operable with the native Enter/Space picker behavior (source: spec.json:a11y.notes; `InputFile.tsx`). The `drop-zone` layout wraps the field in a `<label htmlFor={inputId}>` so the whole panel (illustration + text) is a native click target — no manual click/keydown wiring needed — and carries `aria-disabled` when `disabled`. The `drop-zone` layout also supports native drag-and-drop (`dragenter`/`dragover`/`drop` handlers on the `<label>`). The `simple` layout's 'Take picture' action button opens a second hidden `<input type="file" capture="environment">` to invoke the device camera on mobile (source: spec.json:a11y.notes).

## Dependencies

### klp components

- [Input](./_index_input.md) — `file-input` layer renders as `<Input size="small" state={disabled ? 'disable' : 'default'}>` with the DS Plus icon, label, description, and placeholder reused wholesale; only rendered in the `simple` layout.
- [Button](./_index_button.md) — `action-button` layer renders as `<Button variant="tertiary" size="sm">` with a trailing Camera icon; only rendered in the `simple` layout.

### External libraries
- [class-variance-authority](https://www.npmjs.com/package/class-variance-authority) — `rootVariants` cva composing the `layout` × `dragActive` classes; `dashedBorderVariants` cva driving the drop-zone SVG stroke color by `dragActive`
- [lucide-react](https://www.npmjs.com/package/lucide-react) — `Plus` (simple layout leading icon), `Camera` (simple layout action-button trailing icon)

### Token groups
- [Colors](../tokens/colors.md)
- [Spacing](../tokens/spacing.md)
- [Radius](../tokens/radius.md)
- [Typography](../tokens/typography.md)

## Used by

*Not yet used by any other klp component.*

## Files

- Source: [`src/components/input-file/InputFile.tsx`](../../src/components/input-file/InputFile.tsx)
- Example: [`src/components/input-file/InputFile.example.tsx`](../../src/components/input-file/InputFile.example.tsx)
- Playground: [`playground/routes/input-file.tsx`](../../playground/routes/input-file.tsx)
- Registry: [`registry/input-file.json`](../../registry/input-file.json)
- Figma spec: [`.klp/figma-refs/input-file/spec.json`](../../.klp/figma-refs/input-file/spec.json)
- Reference screenshots: [`.klp/figma-refs/input-file/`](../../.klp/figma-refs/input-file/)

<!-- KLP:GAPS:BEGIN -->
## DS gaps

No gaps recorded.
<!-- KLP:GAPS:END -->

<!-- KLP:NOTES:BEGIN -->
## Notes

**Sanctioned inline SVG #2 — `DropZoneDashedBorder`.** The drop-zone panel's dashed outline is drawn by a local `DropZoneDashedBorder` component (an absolutely-positioned `<svg>` with one `<rect rx="7.5" strokeDasharray="16 16">`), not by `border-style: dashed`. CSS cannot express Figma's exact `dashPattern: [16, 16]` at `strokeWeight: 1` / `strokeAlign: INSIDE` — `border-style: dashed` derives dash length from the border width and offers no independent control. The rect is inset 0.5px so the 1px stroke sits fully inside the box, matching Figma's INSIDE alignment. Color is token-driven via the exported `dashedBorderVariants` cva (`stroke-klp-border-brand` / `stroke-klp-border-brand-emphasis` on drag), verified in-browser across all four brands. The source carries an `allow-inline-svg:` justification comment above the `<svg>`; `scripts/validate-tokens.mjs` reports it as an expected `allowed-inline-svg` warning, not a mismatch. This is the second sanctioned inline-`<svg>` in the DS after `InputFileIllustration` below — **do not "fix" it back to `border-dashed`**, that would silently drop the exact dash pattern and break parity with Figma.

**Decorative illustration color policy — intentional hex exception.** `InputFileIllustration.tsx` (sibling file, not a separate klp component — treated as an opaque decorative child, source: `.klp/figma-refs/input-file/spec.json` anatomy.illustration notes) is extracted from Figma node `113648:1343`. Of its 24 vector paths:
- 2 paths (the accent circle + accent square, nodes `113648:1357` and `113648:1367`) are bound to the Figma variable `bg/brand` and render with `fill-klp-bg-brand`, so they follow `[data-brand]` and shift color across emerald / gray / night-blue / midnight.
- The other 22 paths carry no Figma variable binding and are frozen as literal hex (`#F2F2F2`, `#E6E6E6`, `#CCCCCC`, `white`). This is a deliberate, user-approved exception to the DS "no hardcoded hex" rule: the DS has no brand-neutral decorative alias — a token like `bg-decorative-orange` resolves to actual orange on klub/atlas/showup, which would make the illustration's paper/card shading look wrong (visibly tinted) on every non-wireframe brand. Hardcoding keeps the illustration legible and brand-neutral everywhere.

This is currently the only place in the DS where raw hex is intentional. Do not flag it as token drift in a future LINT or SYNC pass — if the DS ever gains a brand-neutral decorative-gray alias family, revisit and migrate these 22 paths, but until then this exception stands as documented, both here and inline in `InputFileIllustration.tsx`'s own file-level JSDoc.

**Companion component: `file-dropped`.** [File Dropped](./_index_file-dropped.md) is the "already uploaded" display counterpart to this component: `InputFile` is the **selection half** (this component, a trigger only), `FileDropped` is the **display half** — the per-file row rendered once files have been selected, driving `default → uploading → done` via its own `state` prop. Captured from the same Figma file (klub node `113649:1789`, next to this component's `113649:1788`/`113649:1787`). Composition is consumer-owned — `InputFile.onFilesSelected` typically feeds a list that renders one `FileDropped` per file; neither component imports the other. See the behavioral contract at the top of `## Props usage` and the canonical composed pattern in `InputFile.example.tsx`.
<!-- KLP:NOTES:END -->
