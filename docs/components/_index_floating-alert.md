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
  components: ["button"]
  externals: ["class-variance-authority", "lucide-react"]
  tokenGroups: ["colors", "radius", "spacing", "typography"]
  brands: ["wireframe"]
usedBy: []
created: 2026-04-17
updated: 2026-04-21
---

# Floating Alert

A floating alert banner with a state-colored icon highlight, body text, and a dismiss button. Four severity states (Danger, Warning, Information, Success) in three sizes (Small, Medium, Large).

## Anatomy

```
div (root)
├── icon-highlight (span) — Colored rounded square
│   └── icon       (span) — Severity icon, 20×20px
├── content  (span)       — Primary message text
└── dismiss-button (Button/tertiary/icon) — X icon; only when onDismiss is provided
```

## Variants

| state \ size | sm | md | lg |
|---|---|---|---|
| danger | ✓ | ✓ | ✓ |
| warning | ✓ | ✓ | ✓ |
| information | ✓ | ✓ | ✓ |
| success | ✓ | ✓ | ✓ |

## Props usage

Extends `React.HTMLAttributes<HTMLDivElement>`.

| Prop | Class | Type | Default | Description |
|---|---|---|---|---|
| `children` | **required** | `React.ReactNode` | — | Alert title / content — the primary message. |
| `state` | optional | `'danger' \| 'warning' \| 'information' \| 'success'` | `"information"` | Severity state |
| `size` | optional | `'sm' \| 'md' \| 'lg'` | `"md"` | Size variant |
| `onDismiss` | optional | `() => void` | — | When provided, renders a dismiss button |

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

- **Role**: `alert` (live region — screen readers announce on mount)
- **Keyboard support**: Dismiss button is a standard `<button>` — `Enter`/`Space` dismisses.
- **ARIA notes**: `aria-label="Dismiss"` on the dismiss button.

## Dependencies

### klp components

- [Button](./_index_button.md) — dismiss-button renders as `<Button variant="tertiary" size="icon">`.

### External libraries

- [class-variance-authority](https://www.npmjs.com/package/class-variance-authority) — cva variant composition
- [lucide-react](https://www.npmjs.com/package/lucide-react) — AlertTriangle, Check, Info, X severity icons

### Token groups

- [Colors](../tokens/colors.md)
- [Radius](../tokens/radius.md)
- [Spacing](../tokens/spacing.md)
- [Typography](../tokens/typography.md)

### Brands

- [wireframe](../brands/wireframe.md)

## Used by

*Not yet used by any other klp component.*

## Files

- Source: [`src/components/floating-alert/FloatingAlert.tsx`](../../src/components/floating-alert/FloatingAlert.tsx)
- Example: [`src/components/floating-alert/FloatingAlert.example.tsx`](../../src/components/floating-alert/FloatingAlert.example.tsx)
- Playground: [`playground/routes/floating-alert.tsx`](../../playground/routes/floating-alert.tsx)
- Registry: [`registry/floating-alert.json`](../../registry/floating-alert.json)
- Figma spec: [`.klp/figma-refs/floating-alert/spec.json`](../../.klp/figma-refs/floating-alert/spec.json)
- Reference screenshots: [`.klp/figma-refs/floating-alert/`](../../.klp/figma-refs/floating-alert/)

<!-- KLP:GAPS:BEGIN -->
## DS gaps

No gaps recorded.
<!-- KLP:GAPS:END -->

<!-- KLP:NOTES:BEGIN -->
## Notes

*Manual prose preserved across regenerations. Anything between the BEGIN/END markers is never overwritten by the documentalist.*
<!-- KLP:NOTES:END -->
