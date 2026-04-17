---
title: Floating Alert
type: component
status: stable
category: feedback
captureBrand: wireframe
radixPrimitive: null
sources:
  - .klp/figma-refs/floating-alert/spec.json
  - src/components/floating-alert/FloatingAlert.tsx
dependencies:
  components: []
  externals: [class-variance-authority, lucide-react]
  tokenGroups: [colors, radius, spacing, typography]
  brands: [wireframe]
usedBy: []
created: 2026-04-17
updated: 2026-04-17
---

# Floating Alert

A floating alert banner with a state-colored icon highlight, body text, and a dismiss button. Four severity states (Danger, Warning, Information, Success) in three sizes (Small, Medium, Large).

## Anatomy

```
floating-alert
├── icon-highlight  (div)     — Rounded badge containing the state icon; fill changes per State variant
│   └── icon        (span)    — Lucide icon inside icon-highlight; stroke color changes per State variant
├── content         (span)    — Body text label; text color and font size are token-bound
└── dismiss-button  (button)  — Ghost close button; icon-only; always transparent background; rendered only when onDismiss is provided
    └── dismiss-icon (span)   — X icon inside dismiss button; stroke color is fg/muted
```

## Variants

State (rows) × Size (columns). Each cell links to its reference screenshot in `.klp/figma-refs/floating-alert/`.

| State \ Size | sm | md | lg |
|---|---|---|---|
| danger | [✓](.../../.klp/figma-refs/floating-alert/danger-sm.png) | [✓](../../.klp/figma-refs/floating-alert/danger-md.png) | [✓](../../.klp/figma-refs/floating-alert/danger-lg.png) |
| warning | [✓](../../.klp/figma-refs/floating-alert/warning-sm.png) | [✓](../../.klp/figma-refs/floating-alert/warning-md.png) | [✓](../../.klp/figma-refs/floating-alert/warning-lg.png) |
| information | [✓](../../.klp/figma-refs/floating-alert/information-sm.png) | [✓](../../.klp/figma-refs/floating-alert/information-md.png) | [✓](../../.klp/figma-refs/floating-alert/information-lg.png) |
| success | [✓](../../.klp/figma-refs/floating-alert/success-sm.png) | [✓](../../.klp/figma-refs/floating-alert/success-md.png) | [✓](../../.klp/figma-refs/floating-alert/success-lg.png) |

12 variants total (source: spec.json:variants).

## API

Extends `React.HTMLAttributes<HTMLDivElement>`. All native `div` attributes are forwarded through `...props` to the root element.

| Prop | Type | Default | Description |
|---|---|---|---|
| `state` | `'danger' \| 'warning' \| 'information' \| 'success'` | `'information'` | Severity level. Controls icon, icon-highlight fill, and root border color. |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Dimensions. Controls root padding, gap, and content font size. |
| `onDismiss` | `() => void` | `undefined` | If provided, renders the dismiss button and calls this handler on click. If absent, the dismiss button is not rendered. |
| `children` | `React.ReactNode` | — | Body text or rich content placed in the content span. |
| `className` | `string` | — | Additional Tailwind classes merged onto the root div via `cn()`. |

## Tokens

### `root` layer

| Property | Token | Resolved (wireframe) |
|---|---|---|
| fill | `--klp-bg-default` | `var(--klp-color-light-100)` |
| stroke (danger) | `--klp-border-danger-emphasis` | `var(--klp-color-gray-500)` |
| stroke (warning) | `--klp-border-warning-emphasis` | `var(--klp-color-gray-500)` |
| stroke (information) | `--klp-border-info-emphasis` | `var(--klp-color-gray-500)` |
| stroke (success) | `--klp-border-success` | `var(--klp-color-gray-300)` |
| cornerRadius | literal: `8px` | — |
| paddingX (sm) | `--klp-size-xs` | `var(--klp-spacing-2)` = 8px |
| paddingY (sm) | `--klp-size-xs` | `var(--klp-spacing-2)` = 8px |
| itemSpacing (sm) | `--klp-size-xs` | `var(--klp-spacing-2)` = 8px |
| paddingX (md) | `--klp-size-m` | `var(--klp-spacing-4)` = 16px |
| paddingY (md) | `--klp-size-m` | `var(--klp-spacing-4)` = 16px |
| itemSpacing (md) | `--klp-size-s` | `var(--klp-spacing-3)` = 12px |
| paddingX (lg) | `--klp-size-l` | `var(--klp-spacing-6)` = 24px |
| paddingY (lg) | `--klp-size-l` | `var(--klp-spacing-6)` = 24px |
| itemSpacing (lg) | `--klp-size-m` | `var(--klp-spacing-4)` = 16px |
| shadow | literal: `0 10px 15px -3px rgba(0,0,0,0.10)` | — |

> ⚠️ CONTRADICTION: `cornerRadius` bound to `VariableID:293:2173/2174/2175` (unresolved collection 293, raw value 8px) for all 12 variants. Adapter uses literal `rounded-[8px]`. Closest known alias is `--klp-radius-m` (8px). This is tracked as a tokenGap in spec.json:tokenGaps (source: spec.json:tokenGaps[0-2]).

### `icon-highlight` layer

| Property | Token | Resolved (wireframe) |
|---|---|---|
| fill (danger) | `--klp-bg-danger` | `var(--klp-color-gray-300)` |
| fill (warning) | `--klp-bg-warning` | `var(--klp-color-gray-300)` |
| fill (information) | `--klp-bg-info` | `var(--klp-color-gray-300)` |
| fill (success) | `--klp-bg-success` | `var(--klp-color-gray-300)` |
| size | literal: `36px × 36px` | — |
| cornerRadius | literal: `4px` | — |
| padding | literal: `8px` | — |

### `icon` layer

| Property | Token | Resolved (wireframe) |
|---|---|---|
| color (danger) | `--klp-fg-danger` | `var(--klp-color-gray-600)` |
| color (warning) | `--klp-fg-warning` | `var(--klp-color-gray-600)` |
| color (information) | `--klp-fg-info` | `var(--klp-color-gray-600)` |
| color (success) | `--klp-fg-success-contrasted` | `var(--klp-color-gray-800)` |
| size | literal: `20px` | — |

### `content` layer

| Property | Token | Resolved (wireframe) |
|---|---|---|
| color | `--klp-fg-default` | `var(--klp-color-gray-800)` |
| fontSize (sm) | `--klp-font-size-text-medium` | 16px |
| fontSize (md/lg) | `--klp-font-size-text-large` | 18px |
| fontFamily | `--klp-font-family-body` | `'Inter', 'Test Calibre', system-ui, sans-serif` |
| fontWeight | `--klp-font-weight-body` | 400 |

### `dismiss-button` layer

| Property | Token | Resolved (wireframe) |
|---|---|---|
| fill | `--klp-bg-invisible` | `var(--klp-color-light-0)` |
| stroke | `--klp-border-invisible` | `var(--klp-color-light-0)` |
| cornerRadius | `--klp-radius-l` | `var(--klp-radius-lg)` = 12px |
| paddingX | `--klp-size-xs` | `var(--klp-spacing-2)` = 8px |
| paddingY | `--klp-size-xs` | `var(--klp-spacing-2)` = 8px |

### `dismiss-icon` layer

| Property | Token | Resolved (wireframe) |
|---|---|---|
| color | `--klp-fg-muted` | `var(--klp-color-gray-700)` |
| size | literal: `20px` | — |

## Examples

```tsx
import { FloatingAlert } from './FloatingAlert'

export function FloatingAlertExample() {
  return (
    <div className="flex flex-col gap-4 max-w-lg">
      <FloatingAlert state="danger" size="md" onDismiss={() => console.log('dismissed')}>
        Something went wrong. Please try again.
      </FloatingAlert>

      <FloatingAlert state="warning" size="md" onDismiss={() => console.log('dismissed')}>
        Your session is about to expire.
      </FloatingAlert>

      <FloatingAlert state="information" size="md" onDismiss={() => console.log('dismissed')}>
        A new version is available.
      </FloatingAlert>

      <FloatingAlert state="success" size="md" onDismiss={() => console.log('dismissed')}>
        Changes saved successfully.
      </FloatingAlert>
    </div>
  )
}
```

## Accessibility

- **Role**: `alert` — applied directly on the root `div` as `role="alert"` for live-region announcement. Screen readers announce the content automatically when the component mounts. (source: spec.json:a11y.role)
- **Keyboard support**: `Tab` (focus dismiss button), `Enter` / `Space` (activate dismiss button). (source: spec.json:a11y.keyboardSupport)
- **ARIA notes**: Dismiss button is a native `<button>` with `aria-label="Dismiss"`. State icons use `aria-hidden="true"`. (source: spec.json:a11y.notes)

## Dependencies

### klp components

*Leaf component — no klp dependencies.*

### External libraries

- [class-variance-authority](https://www.npmjs.com/package/class-variance-authority) — variant composition via `cva`.
- [lucide-react](https://www.npmjs.com/package/lucide-react) — `AlertTriangle`, `Check`, `Info`, `X` icons for state and dismiss.

### Token groups

- [Colors](../tokens/colors.md) — `bg-default`, `bg-danger/warning/info/success`, `fg-default`, `fg-muted`, `fg-danger/warning/info/success-contrasted`, `border-danger/warning/info-emphasis`, `border-success`, `border-invisible`, `bg-invisible`.
- [Radius](../tokens/radius.md) — `--klp-radius-l` on dismiss-button cornerRadius.
- [Spacing](../tokens/spacing.md) — `--klp-size-xs/s/m/l` for root padding/gap and dismiss-button padding.
- [Typography](../tokens/typography.md) — `--klp-font-family-body`, `--klp-font-weight-body`, `--klp-font-size-text-medium`, `--klp-font-size-text-large` on content layer.

### Brands

- [wireframe](../brands/wireframe.md) — reference screenshots captured under the wireframe brand (12 variants).

## Used by

*Not yet used by any other klp component.*

## Files

- Source: [`src/components/floating-alert/FloatingAlert.tsx`](../../src/components/floating-alert/FloatingAlert.tsx)
- Example: [`src/components/floating-alert/FloatingAlert.example.tsx`](../../src/components/floating-alert/FloatingAlert.example.tsx)
- Playground: [`playground/routes/floating-alert.tsx`](../../playground/routes/floating-alert.tsx)
- Registry: [`registry/floating-alert.json`](../../registry/floating-alert.json)
- Figma spec: [`.klp/figma-refs/floating-alert/spec.json`](../../.klp/figma-refs/floating-alert/spec.json)
- Reference screenshots: [`.klp/figma-refs/floating-alert/`](../../.klp/figma-refs/floating-alert/)

<!-- KLP:NOTES:BEGIN -->
## Notes

*Manual prose preserved across regenerations. Anything between the BEGIN/END markers is never overwritten by the documentalist.*
<!-- KLP:NOTES:END -->
