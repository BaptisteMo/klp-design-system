---
title: File Dropped
type: component
status: stable
category: inputs
captureBrand: klub
radixPrimitive: null
sources:
  - .klp/figma-refs/file-dropped/spec.json
  - src/components/file-dropped/FileDropped.tsx
dependencies:
  components: [button]
  externals: [class-variance-authority, lucide-react]
  tokenGroups: [colors, spacing, radius, typography]
  brands: [klub]
usedBy: []
created: 2026-08-07
updated: 2026-08-07
---

# File Dropped

Row displaying a single already-selected/uploaded file (filename + size) with download and delete actions (source: spec.json:description).

<!-- KLP:INTENT:BEGIN -->

## When to use

The row representing one file that has already been chosen or uploaded — filename, size, and download plus delete actions, with a default, uploading or done state.

**Don't use it for:** Not the control that picks the file — that is input-file. Do not use it as a generic list row; a non-file row is list-content.

## Don't confuse with

| Component | How to choose |
|---|---|
| `input-file` | input-file selects the file; file-dropped shows one already selected. |
| `list-content` | file-dropped is file-specific with download and delete; list-content is the generic row. |

<!-- KLP:INTENT:END -->

## Anatomy

```
root                (div, role="group")   — 8px radius, 16px padding, 8px gap between icon-highlight/meta/buttons, items-start (source: FileDropped.tsx `rootVariants` — mirrors Figma's `Frame 194`: HORIZONTAL, itemSpacing 8, counterAxisAlignItems MIN)
├── icon-highlight     (div)                — 40x40 rounded square housing the single active state icon
│   └── icon             (svg, lucide-react)  — file-text / loader-circle / check, driven by `state`
├── meta               (span)               — vertical stack of filename + filesize, flex-1 (source: FileDropped.tsx `metaVariants` — mirrors Figma's `Frame 193`: VERTICAL, itemSpacing 8, primaryAxis CENTER, counterAxis MIN, layoutGrow 1)
│   ├── filename          (span)               — filename text
│   └── filesize          (span)               — pre-formatted size text
├── download-button    (Button)             — DS `<Button variant="tertiary" size="icon">`, hidden while `state="uploading"`
└── delete-button       (Button)             — DS `<Button variant="tertiary" size="icon">`, always visible (cancels an in-flight upload too)
```

> ⚠️ CONTRADICTION corrected in this pass (source: FileDropped.tsx `rootVariants`/`metaVariants` comments vs `.klp/figma-refs/file-dropped/spec.json:variants[*].layers.root.literals`): the spec.json literal snapshot still records the root's `itemSpacing` as `24px` and does not model a `meta` layer at all. Re-inspection of the live Figma frames (`Frame 194` root, `itemSpacing: 8`, `counterAxisAlignItems: MIN`; `Frame 193` meta wrapper, `itemSpacing: 8`, `primaryAxisAlignItems: CENTER`, `counterAxisAlignItems: MIN`, `layoutGrow: 1`) showed the original capture was wrong on two points: (1) the root gap is 8px, not 24px, and (2) filename/filesize are children of a vertical `meta` frame, not direct siblings of the root laid out horizontally. The source now matches the corrected Figma reading; `spec.json` was not re-extracted in this pass and should be refreshed by a future `figma-extractor` run to remove this drift at the source-of-truth level.

**Layout mechanism.** `meta`'s `flex-1` absorbs all horizontal slack in the row — that is what pins `download-button` and `delete-button` to the right edge regardless of filename length (source: FileDropped.tsx `metaVariants` comment). `root`'s `items-start` (previously `items-center`) aligns the two action buttons with the filename's baseline rather than the vertical center of the row.

> ❓ UNVERIFIED (source: spec.json:variants[*].screenshotStatus = "FAILED"): reference screenshots for all three states failed to capture this session (expired Figma REST token). The state → icon mapping below is confirmed from `spec.variants[]` layer data, not a linked image.

**Plain Figma COMPONENT, no variant axis — the `state` axis below is synthesized, not captured.** Figma modeled this node as a single `COMPONENT` (not a `COMPONENT_SET`): the designer stacked three mutually-exclusive state icons — `lucide/loader-circle`, `24/check`, `24/file_filled` — inside one clipped, bottom-aligned `icon-highlight` auto-layout frame to document all three states in one static node (source: spec.json:description, spec.json:anatomy `icon-highlight`.notes). Only the last child (`24/file_filled`) rendered inside the visible clip bounds in the static capture; isolated exports of the other two came back blank, independently confirming `file_filled` is the resting/default state. The extractor infers `variantAxes.state: [default, uploading, done]` from that stack and `component-adapter` renders exactly one lucide icon per state via a `state` prop — it does **not** reproduce the icon stack.

> ❓ **SYNC note.** Because `state` has no corresponding Figma variant axis (no `COMPONENT_SET`, no variant properties), a future `SYNC` or `klp-token-validator` pass has nothing to reconcile it against. The validator emits three `unknown-state` warnings (`default` / `uploading` / `done`, one per synthesized icon) — this is expected and benign; it is not evidence of drift and should not be "fixed" by removing the axis or chasing a matching Figma variant that doesn't exist.

## Variants

| state | Captured |
|---|---|
| `default` | ✓ (source: spec.json:variants[0], figmaNodeId `113648:1333` — "24/file_filled" resting icon) |
| `uploading` | ✓ (source: spec.json:variants[1], figmaNodeId `113648:1330` — "lucide/loader-circle", spins via `animate-spin`; no explicit Figma motion spec, animation choice made by the adapter) |
| `done` | ✓ (source: spec.json:variants[2], figmaNodeId `113648:1332` — "24/check") |

## Props usage

> **Behavioral contract — `FileDropped` is the display half of a two-component pattern.**
> [`InputFile`](./_index_input-file.md) is the **selection half**: it is a trigger only and NEVER
> displays the selected filename — on both its layouts (`drop-zone` and `simple`) and through both
> input paths (OS file picker and drag-and-drop), its field/label keeps its placeholder at all times.
> `FileDropped` is where the selection actually surfaces: the parent listens to
> `InputFile.onFilesSelected`, owns the resulting file list, and renders one `FileDropped` row per
> file below the input. In the Klépierre tools the two are never used apart — an `InputFile` with no
> `FileDropped` list gives the user no feedback that anything happened. See the canonical composed
> pattern in [`InputFile.example.tsx`](../../src/components/input-file/InputFile.example.tsx) (parent-owned
> `UploadedFile[]` state, a `formatSize` helper, add + remove wiring) and the live `CompositionDemo`
> for both layouts in [`playground/routes/input-file.tsx`](../../playground/routes/input-file.tsx).

Extends `Omit<React.HTMLAttributes<HTMLDivElement>, 'onClick'>`.

| Prop | Type | Default | Class | Description |
|---|---|---|---|---|
| `name` | `string` | — | required | Filename displayed in the row (e.g. "contract_ready_signed.pdf") |
| `size` | `string` | — | required | Pre-formatted file size string (e.g. "442kb") |
| `state` | `'default' \| 'uploading' \| 'done'` | `'default'` | **persistent** | Which of the three mutually-exclusive state icons to render — synthesized from Figma's stacked-icon frame (file-text / loader-circle / check) |
| `progress` | `number` | — | optional | Upload progress percentage (0-100). Only meaningful while `state="uploading"`; surfaced as `aria-valuenow` for assistive tech — no visual progress bar exists in the Figma spec for this component (see [InputFile](./_index_input-file.md)'s `progress-indicator` layer for that pattern, itself hidden/unrendered) |
| `onDownload` | `() => void` | — | optional | Called when the download action is activated. The download button is hidden while `state="uploading"` (nothing to download yet); the delete button stays available so an in-flight upload can be cancelled |
| `onDelete` | `() => void` | — | optional | Called when the delete action is activated |
| `className` | `string` | — | optional | Additional className applied to the outer root wrapper |

Verified against the current source: no prop was added or removed since the last regeneration.

## Tokens

### `root` layer

| Property | Token | Resolved (klub) |
|---|---|---|
| stroke | `--klp-border-brand` | `#1EADA5` |
| cornerRadius | — | literal: `8px` |
| paddingX | — | literal: `16px` |
| paddingY | — | literal: `16px` |
| itemSpacing | — | literal: `8px` (corrected from the `24px` recorded in spec.json — see ⚠️ CONTRADICTION note above; source: FileDropped.tsx `rootVariants`) |
| alignItems | — | literal: `items-start` (corrected from `items-center`; source: FileDropped.tsx `rootVariants`) |

### `icon-highlight` layer

| Property | Token | Resolved (klub) |
|---|---|---|
| fill | `--klp-bg-brand-low` | `#F2FAF7` |
| cornerRadius | — | literal: `8px` |
| padding | — | literal: `8px` |
| itemSpacing | — | literal: `8px` |
| width | — | literal: `40px` |
| height | — | literal: `40px` |

### `icon` layer

| Property | Token | Resolved (klub) |
|---|---|---|
| color | `--klp-bg-brand` | `#1EADA5` |
| size | — | literal: `18px` |
| icon (default) | — | literal: `file-text` |
| icon (uploading) | — | literal: `loader-circle` (spins via `animate-spin`, no Figma motion spec) |
| icon (done) | — | literal: `check` |

### `meta` layer

New anatomy layer in this pass — wraps `filename`/`filesize` in a vertical stack (source: FileDropped.tsx `metaVariants`). Not modeled in `spec.json` (see ⚠️ CONTRADICTION note above); the layout properties below are read directly from source, not the spec's literal snapshot.

| Property | Token | Resolved (klub) |
|---|---|---|
| itemSpacing | — | literal: `8px` |
| layoutGrow | — | literal: `flex-1` (absorbs horizontal slack — see "Layout mechanism" note above) |
| alignItems | — | literal: `items-start` |
| justifyContent | — | literal: `justify-center` (primaryAxisAlignItems CENTER) |

### `filename` layer

| Property | Token | Resolved (klub) |
|---|---|---|
| color | `--klp-fg-default` | `#1A211E` |
| fontFamily | — | literal: `Inter (unbound)` |
| fontSize | — | literal: `16px` |
| fontWeight | — | literal: `400` |
| lineHeight | — | literal: `20px` |

### `filesize` layer

| Property | Token | Resolved (klub) |
|---|---|---|
| color | `--klp-fg-muted` | `#5F6563` |
| fontFamily | — | literal: `Inter (unbound)` |
| fontSize | — | literal: `16px` |
| fontWeight | — | literal: `400` |
| lineHeight | — | literal: `100%` |

`filesize` is the same 16px size as `filename` (`text-klp-text-medium` on both) — the only visual difference is color (`fg-default` vs `fg-muted`). The `shrink-0` utility previously applied to `filesizeVariants` was removed in this pass: it was meaningless once `filename`/`filesize` moved into the vertical `meta` column (source: FileDropped.tsx `filesizeVariants` comment). Do not reintroduce a smaller font size for `filesize` — it deviates from the Figma capture.

### `download-button` layer

| Property | Token | Resolved (klub) |
|---|---|---|
| iconColor | `--klp-fg-muted` | `#5F6563` |
| icon | — | literal: `download` |
| size | — | literal: `36px` |

Full token map for the nested `Button` instance lives on [Button](./_index_button.md) — the table above reflects only the icon-color override captured on this component's own spec.

### `delete-button` layer

| Property | Token | Resolved (klub) |
|---|---|---|
| iconColor | `--klp-border-danger-emphasis` | `#CF222E` |
| icon | — | literal: `trash-2` |
| size | — | literal: `36px` |

Full token map for the nested `Button` instance lives on [Button](./_index_button.md) — the table above reflects only the icon-color override captured on this component's own spec. The trash icon is recolored to danger red inside an otherwise-`tertiary` button (source: spec.json:anatomy `delete-button`.notes).

## Examples

```tsx
import { FileDropped } from '@/components/file-dropped'

export function FileDroppedExample() {
  return (
    <div className="flex flex-col gap-3">
      <FileDropped
        name="contract_ready_signed.pdf"
        size="442kb"
        state="default"
        onDownload={() => console.info('download')}
        onDelete={() => console.info('delete')}
      />
      <FileDropped
        name="contract_ready_signed.pdf"
        size="442kb"
        state="uploading"
        progress={42}
        onDelete={() => console.info('cancel upload')}
      />
      <FileDropped
        name="contract_ready_signed.pdf"
        size="442kb"
        state="done"
        onDownload={() => console.info('download')}
        onDelete={() => console.info('delete')}
      />
    </div>
  )
}
```

## Accessibility

- **Role**: `group` (source: spec.json:a11y.role)
- **Keyboard support**: Tab to download button · Enter/Space to trigger download · Tab to delete button · Enter/Space to trigger delete (source: spec.json:a11y.keyboardSupport)
- **ARIA notes**: The root is a labelled group (`aria-label` set to the filename) so screen readers announce the file being described before the two action buttons. Download/delete buttons carry discernible accessible names (`Download <filename>` / `Delete <filename>`) since they are icon-only Buttons (source: spec.json:a11y.notes; `FileDropped.tsx`). While `state="uploading"`, the root also exposes `aria-valuenow`/`aria-valuemin`/`aria-valuemax` from `progress` (source: `FileDropped.tsx`).

## Dependencies

### klp components
- [Button](./_index_button.md) — `download-button` and `delete-button` layers both render as `<Button variant="tertiary" size="icon">`, reused wholesale (source: spec.json:composition.reuses, `FileDropped.tsx`).

### External libraries
- [class-variance-authority](https://www.npmjs.com/package/class-variance-authority) — `iconVariants` cva branching the `state` axis (default/uploading/done)
- [lucide-react](https://www.npmjs.com/package/lucide-react) — `FileText`, `Loader2`, `Check` (state icons), `Download`, `Trash2` (action-button icons)

### Token groups
- [Colors](../tokens/colors.md)
- [Spacing](../tokens/spacing.md)
- [Radius](../tokens/radius.md)
- [Typography](../tokens/typography.md)

## Used by

*Not yet used by any other klp component.*

## Files

- Source: [`src/components/file-dropped/FileDropped.tsx`](../../src/components/file-dropped/FileDropped.tsx)
- Example: [`src/components/file-dropped/FileDropped.example.tsx`](../../src/components/file-dropped/FileDropped.example.tsx)
- Playground: [`playground/routes/file-dropped.tsx`](../../playground/routes/file-dropped.tsx)
- Registry: [`registry/file-dropped.json`](../../registry/file-dropped.json)
- Figma spec: [`.klp/figma-refs/file-dropped/spec.json`](../../.klp/figma-refs/file-dropped/spec.json)
- Reference screenshots: [`.klp/figma-refs/file-dropped/`](../../.klp/figma-refs/file-dropped/)

<!-- KLP:GAPS:BEGIN -->
## DS gaps

| Part | Kind | Reason | Action |
|---|---|---|---|
| root | token-gap | `cornerRadius` (8px), `paddingX`/`paddingY` (16px), and `itemSpacing` (8px, corrected from an earlier 24px misreading — see ⚠️ CONTRADICTION note) on the root row are literal, unbound Figma values — no Figma variable backs them. | `accepted-literal` — snapped 1:1 onto existing `--klp-radius-l` / `--klp-size-m` / `--klp-size-xs` aliases by exact value match (`rounded-klp-l px-klp-size-m py-klp-size-m gap-klp-size-xs`). |
| meta | structural | New anatomy layer introduced in this pass; not present in `spec.json`'s captured anatomy or layers. Wraps `filename`+`filesize` in a vertical stack per Figma `Frame 193` (VERTICAL, itemSpacing 8, layoutGrow 1). | `accepted-literal` — `itemSpacing` (8px) snapped onto `--klp-size-xs`; `layoutGrow` has no token equivalent, stays `flex-1`. `spec.json` should be re-extracted to catch up. |
| icon-highlight | token-gap | `cornerRadius` (8px), `padding` (8px), and `itemSpacing` (8px) on the 40×40 icon-highlight square are literal, unbound Figma values. | `accepted-literal` — snapped onto `--klp-radius-l` / `--klp-size-xs` aliases by exact value match. The 40px width/height itself has no matching `--klp-size-*` alias (scale jumps s=12/m=16/l=24/xl=32/2xl=48) and stays an arbitrary literal (`h-[40px] w-[40px]`). |
| filename | literal-gap | `fontFamily`/`fontSize`/`fontWeight`/`lineHeight` (Inter, 16px/400/20px) are literal, not bound to the Family/Label or Sizing/Text/* variables used elsewhere in the file — deviates from the `dropzone-label` convention on the sibling `input-file`. | `accepted-literal` — snapped onto the nearest body-text alias (`font-klp-body font-klp-body text-klp-text-medium`, 16px exact match to `--klp-font-size-text-medium`). Flagged for designer review; not a token gap on the resolved value itself. |
| filesize | literal-gap | Same literal-font caveat as `filename` (Inter, 16px/400, lineHeight 100%). | `accepted-literal` — snapped onto the same body-text alias as `filename`. |

Cross-reference: [InputFile](./_index_input-file.md) is the display counterpart's upload-trigger sibling — it captured cleanly with zero gaps of its own on the same Figma file, so these five are specific to how `file-dropped`'s literal box-model, font properties, and now-corrected `meta` layer were authored, not a systemic file-wide issue.
<!-- KLP:GAPS:END -->

<!-- KLP:NOTES:BEGIN -->
## Notes

**Companion component: `input-file`.** `file-dropped` is the "already uploaded" **display half** counterpart to [InputFile](./_index_input-file.md)'s **selection half**: `InputFile` is the trigger (drag-and-drop panel or labeled field that opens the native file picker) and NEVER displays the selected filename, while `FileDropped` is the row rendered per-file once one or more files have been selected/uploaded, driving the caller through the `default → uploading → done` lifecycle via the `state` prop. They are captured from the same Figma file (`input-file` at klub node `113649:1788`/`113649:1787`, `file-dropped` at klub node `113649:1789`) and are typically composed together by the consumer: `InputFile.onFilesSelected` feeds a list that renders one `FileDropped` per file. Neither component renders the other internally — the composition lives in consumer code, not in the DS. See the behavioral contract at the top of `## Props usage` and the canonical composed pattern in `InputFile.example.tsx`.
<!-- KLP:NOTES:END -->
