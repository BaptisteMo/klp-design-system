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
  externals: ["class-variance-authority", "lucide-react"]
  tokenGroups: ["colors", "spacing", "typography"]
  brands: ["klub"]
usedBy: []
created: 2026-04-17
updated: 2026-04-21
---

# InContent Alert

Inline alert banner with a semantic content type (Info, Success, Danger, Warning) and three sizes. Displays a title with matching icon and an optional body text below.

## Anatomy

```
div (root)
├── header (div)
│   ├── icon  (span) — Severity icon, 20×20px
│   └── title (span) — Alert title text
└── body (p) — Optional body text; only rendered when body prop is provided
```

## Variants

| content \ size | lg | md | sm |
|---|---|---|---|
| info | ✓ | ✓ | ✓ |
| success | ✓ | ✓ | ✓ |
| danger | ✓ | ✓ | ✓ |
| warning | ✓ | ✓ | ✓ |

## Props usage

Extends `React.HTMLAttributes<HTMLDivElement>`.

| Prop | Class | Type | Default | Description |
|---|---|---|---|---|
| `title` | **required** | `string` | — | Alert title text |
| `content` | optional | `'info' \| 'success' \| 'danger' \| 'warning'` | `"info"` | Semantic content type (controls color and icon) |
| `size` | optional | `'lg' \| 'md' \| 'sm'` | `"md"` | Size variant |
| `body` | optional | `React.ReactNode` | — | Optional body text below the title |

## Examples

```tsx
import { InContentAlert } from './InContentAlert'

export function InContentAlertExample() {
  return (
    <div className="flex flex-col gap-4 p-6">
      <InContentAlert content="info" size="lg" title="Your session will expire soon" body="Please save your work before the session ends in 5 minutes." />
      <InContentAlert content="success" size="md" title="Payment completed" body="Your transaction was processed successfully." />
      <InContentAlert content="danger" size="md" title="Action could not be completed" body="An error occurred. Please try again or contact support." />
      <InContentAlert content="warning" size="sm" title="Storage almost full" />
    </div>
  )
}
```

## Accessibility

- **Role**: `alert` (live region — screen readers announce on mount)
- **Keyboard support**: No interactive elements.
- **ARIA notes**: Icon is `aria-hidden`. Content type is communicated via the title text and visual color.

## Dependencies

### klp components

*Leaf component — no klp dependencies.*

### External libraries

- [class-variance-authority](https://www.npmjs.com/package/class-variance-authority) — cva variant composition
- [lucide-react](https://www.npmjs.com/package/lucide-react) — AlertCircle, CheckCircle2, HelpCircle, Info icons

### Token groups

- [Colors](../tokens/colors.md)
- [Spacing](../tokens/spacing.md)
- [Typography](../tokens/typography.md)

### Brands

- [klub](../brands/klub.md)

## Used by

*Not yet used by any other klp component.*

## Files

- Source: [`src/components/in-content-alert/InContentAlert.tsx`](../../src/components/in-content-alert/InContentAlert.tsx)
- Example: [`src/components/in-content-alert/InContentAlert.example.tsx`](../../src/components/in-content-alert/InContentAlert.example.tsx)
- Playground: [`playground/routes/in-content-alert.tsx`](../../playground/routes/in-content-alert.tsx)
- Registry: [`registry/in-content-alert.json`](../../registry/in-content-alert.json)
- Figma spec: [`.klp/figma-refs/in-content-alert/spec.json`](../../.klp/figma-refs/in-content-alert/spec.json)
- Reference screenshots: [`.klp/figma-refs/in-content-alert/`](../../.klp/figma-refs/in-content-alert/)

<!-- KLP:GAPS:BEGIN -->
## DS gaps

No gaps recorded.
<!-- KLP:GAPS:END -->

<!-- KLP:NOTES:BEGIN -->
## Notes

*Manual prose preserved across regenerations. Anything between the BEGIN/END markers is never overwritten by the documentalist.*
<!-- KLP:NOTES:END -->
