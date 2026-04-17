---
title: InContent Alert
type: component
status: stable
category: feedback
captureBrand: klub
radixPrimitive: null
sources:
  - .klp/figma-refs/in-content-alert/spec.json
  - src/components/in-content-alert/InContentAlert.tsx
dependencies:
  components: []
  externals: [class-variance-authority, lucide-react]
  tokenGroups: [colors, spacing, typography]
  brands: [klub]
usedBy: []
created: 2026-04-17
updated: 2026-04-17
---

# InContent Alert

Inline alert banner with a semantic content type (Info, Success, Danger, Warning) and three sizes. Displays a title with matching icon and an optional body text below.

## Anatomy

```
in-content-alert
├── root    (div)   — Vertical flex container; padding + background + corner radius vary by size
├── header  (div)   — Horizontal flex row containing icon and title; always present
├── icon    (span)  — Lucide icon, size 20px, colour matches title
├── title   (span)  — Bold label; colour driven by content type (fg/info|success|danger|warning)
└── body    (p)     — Body text below the header row; fg/default; optional
```

## Variants

Primary axis: `content`. Secondary axis: `size`.

| content \ size | lg | md | sm |
|---|---|---|---|
| info | [✓](../../.klp/figma-refs/in-content-alert/info-lg-default.png) | [✓](../../.klp/figma-refs/in-content-alert/info-md-default.png) | [✓](../../.klp/figma-refs/in-content-alert/info-sm-default.png) |
| success | [✓](../../.klp/figma-refs/in-content-alert/success-lg-default.png) | [✓](../../.klp/figma-refs/in-content-alert/success-md-default.png) | [✓](../../.klp/figma-refs/in-content-alert/success-sm-default.png) |
| danger | [✓](../../.klp/figma-refs/in-content-alert/danger-lg-default.png) | [✓](../../.klp/figma-refs/in-content-alert/danger-md-default.png) | [✓](../../.klp/figma-refs/in-content-alert/danger-sm-default.png) |
| warning | [✓](../../.klp/figma-refs/in-content-alert/warning-lg-default.png) | [✓](../../.klp/figma-refs/in-content-alert/warning-md-default.png) | [✓](../../.klp/figma-refs/in-content-alert/warning-sm-default.png) |

12 variants total (4 content types × 3 sizes). (source: spec.json:variants)

## API

`InContentAlertProps` extends `React.HTMLAttributes<HTMLDivElement>`. All standard `<div>` HTML attributes are forwarded to the root element.

| Prop | Type | Default | Description |
|---|---|---|---|
| `content` | `'info' \| 'success' \| 'danger' \| 'warning'` | `'info'` | Semantic content type — controls icon, background fill, and title/icon colour |
| `size` | `'lg' \| 'md' \| 'sm'` | `'md'` | Controls padding and corner radius of the root element |
| `title` | `string` | — | **Required.** Bold label text displayed in the header row |
| `body` | `React.ReactNode` | — | Optional body text rendered as `<p>` below the header; omitted when not provided |
| `className` | `string` | — | Additional Tailwind classes merged onto the root via `cn()` |

## Tokens

### `root` layer

| Property | Token | Resolved (klub) |
|---|---|---|
| fill (info) | `--klp-bg-info` | `var(--klp-color-blue-100)` |
| fill (success) | `--klp-bg-success` | `var(--klp-color-green-50)` |
| fill (danger) | `--klp-bg-danger` | `var(--klp-color-red-50)` |
| fill (warning) | `--klp-bg-warning` | `var(--klp-color-orange-50)` |
| paddingX / lg | `--klp-size-m` | `16px` |
| paddingY / lg | `--klp-size-m` | `16px` |
| paddingX / md | `--klp-size-s` | `12px` |
| paddingY / md | `--klp-size-s` | `12px` |
| paddingX / sm | `--klp-size-xs` | `8px` |
| paddingY / sm | `--klp-size-xs` | `8px` |
| itemSpacing | `--klp-size-xs` | `8px` |
| cornerRadius / lg | literal: `16px` | `16px` |
| cornerRadius / md | `--klp-size-s` | `12px` |
| cornerRadius / sm | `--klp-size-xs` | `8px` |

### `header` layer

| Property | Token | Resolved (klub) |
|---|---|---|
| itemSpacing | literal: `8px` | `8px` |

### `icon` layer

| Property | Token | Resolved (klub) |
|---|---|---|
| color (info) | `--klp-fg-info` | `var(--klp-color-blue-500)` |
| color (success) | `--klp-fg-success` | `var(--klp-color-green-500)` |
| color (danger) | `--klp-fg-danger` | `var(--klp-color-red-500)` |
| color (warning) | `--klp-fg-warning` | `var(--klp-color-orange-500)` |
| size | literal: `20px` | `20px` |

### `title` layer

| Property | Token | Resolved (klub) |
|---|---|---|
| color (info) | `--klp-fg-info` | `var(--klp-color-blue-500)` |
| color (success) | `--klp-fg-success` | `var(--klp-color-green-500)` |
| color (danger) | `--klp-fg-danger` | `var(--klp-color-red-500)` |
| color (warning) | `--klp-fg-warning` | `var(--klp-color-orange-500)` |
| fontSize | `--klp-font-size-text-medium` | `16px` |
| fontFamily | `--klp-font-family-label` | Inter, Test Calibre, system-ui |
| fontWeight | `--klp-font-weight-label-bold` | `600` |
| lineHeight | literal: `24px` | `24px` |

### `body` layer

| Property | Token | Resolved (klub) |
|---|---|---|
| color | `--klp-fg-default` | `var(--klp-color-gray-800)` |
| fontSize | `--klp-font-size-text-medium` | `16px` |
| fontFamily | `--klp-font-family-body` | Inter, Test Calibre, system-ui |
| fontWeight | `--klp-font-weight-body` | `400` |
| lineHeight | literal: `20px` | `20px` |

## Examples

```tsx
import { InContentAlert } from './InContentAlert'

export function InContentAlertExample() {
  return (
    <div className="flex flex-col gap-4 p-6">
      <InContentAlert
        content="info"
        size="lg"
        title="Your session will expire soon"
        body="Please save your work before the session ends in 5 minutes."
      />
      <InContentAlert
        content="success"
        size="md"
        title="Payment completed"
        body="Your transaction was processed successfully."
      />
      <InContentAlert
        content="danger"
        size="md"
        title="Action could not be completed"
        body="An error occurred. Please try again or contact support."
      />
      <InContentAlert
        content="warning"
        size="sm"
        title="Storage almost full"
      />
    </div>
  )
}
```

## Accessibility

- **Role**: `alert` — applied as `role="alert"` on the root `<div>` for live-region semantics.
- **Keyboard support**: none — the component has no interactive affordances in the base variant.
- **ARIA notes**: Use `role="alert"` for dynamic insertion (e.g., form validation feedback). For static, pre-rendered alerts, consider `role="note"` or an appropriate landmark to avoid unexpected announcements. (source: spec.json:a11y)

## Dependencies

### klp components

*Leaf component — no klp dependencies.*

### External libraries

- [class-variance-authority](https://www.npmjs.com/package/class-variance-authority) — CVA blocks for `rootVariants`, `headerVariants`, `iconVariants`, `titleVariants`, `bodyVariants`.
- [lucide-react](https://www.npmjs.com/package/lucide-react) — `Info`, `CheckCircle2`, `AlertCircle`, `HelpCircle` icons mapped per content type.

### Token groups

- [Colors](../tokens/colors.md) — `--klp-bg-{info,success,danger,warning}` (root fill) and `--klp-fg-{info,success,danger,warning,default}` (icon/title/body colour).
- [Spacing](../tokens/spacing.md) — `--klp-size-{xs,s,m}` for padding and gap across all size variants.
- [Typography](../tokens/typography.md) — `--klp-font-size-text-medium`, `--klp-font-family-{label,body}`, `--klp-font-weight-{label-bold,body}` on title and body layers.

### Brands

- [klub](../brands/klub.md) — Figma reference screenshots captured under the klub brand.

## Used by

*Not yet used by any other klp component.*

## Files

- Source: [`src/components/in-content-alert/InContentAlert.tsx`](../../src/components/in-content-alert/InContentAlert.tsx)
- Example: [`src/components/in-content-alert/InContentAlert.example.tsx`](../../src/components/in-content-alert/InContentAlert.example.tsx)
- Playground: [`playground/routes/in-content-alert.tsx`](../../playground/routes/in-content-alert.tsx)
- Registry: [`registry/in-content-alert.json`](../../registry/in-content-alert.json)
- Figma spec: [`.klp/figma-refs/in-content-alert/spec.json`](../../.klp/figma-refs/in-content-alert/spec.json)
- Reference screenshots: [`.klp/figma-refs/in-content-alert/`](../../.klp/figma-refs/in-content-alert/)

<!-- KLP:NOTES:BEGIN -->
## Notes

*Manual prose preserved across regenerations. Anything between the BEGIN/END markers is never overwritten by the documentalist.*
<!-- KLP:NOTES:END -->
