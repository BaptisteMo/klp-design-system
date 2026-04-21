---
title: "Table (primitives)"
type: component
status: stable
category: data-display
captureBrand: klub
radixPrimitive: null
sources:
  - .klp/figma-refs/table/spec.json
  - src/components/table/Table.tsx
dependencies:
  components: []
  externals: ["class-variance-authority"]
  tokenGroups: ["colors", "spacing", "typography"]
  brands: ["klub"]
usedBy: ["data-table"]
created: 2026-04-17
updated: 2026-04-21
---

# Table (primitives)

Low-level HTML table primitives styled with klp tokens. Compound component — use as `Table.Root`, `Table.Header`, `Table.Body`, `Table.Footer`, `Table.Row`, `Table.Head`, `Table.Cell`, `Table.Caption`. Used internally by the DataTable component.

## Anatomy

```
Table.Root    (<table>)   — full width, collapsed borders
├── Table.Caption (<caption>) — optional accessible caption
├── Table.Header  (<thead>)
│   └── Table.Row (<tr>)
│       └── Table.Head[*] (<th>) — muted bold label
└── Table.Body    (<tbody>)
    └── Table.Row[*] (<tr>) — bottom border; hover bg; variant: default|selected|muted
        └── Table.Cell[*] (<td>) — body typography
```

## Variants

Row variant controls background fill:

| variant |
|---|
| default (hover activates bg-subtle) |
| selected (bg-secondary-brand-low) |
| muted (bg-subtle, locked) |

## Props usage

### Table.Row

| Prop | Class | Type | Default | Description |
|---|---|---|---|---|
| `variant` | optional | `'default' \| 'selected' \| 'muted'` | `"default"` | Row visual state — controls background fill |

All other sub-components (`Table.Root`, `Table.Header`, `Table.Body`, `Table.Footer`, `Table.Head`, `Table.Cell`, `Table.Caption`) extend their native HTML element's attributes; only `className` is relevant.

## Examples

```tsx
import { Table } from './Table'

export function TableExample() {
  return (
    <Table.Root>
      <Table.Caption>A simple static table.</Table.Caption>
      <Table.Header>
        <Table.Row>
          <Table.Head>Name</Table.Head>
          <Table.Head>Email</Table.Head>
          <Table.Head>Role</Table.Head>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        <Table.Row>
          <Table.Cell>John Doe</Table.Cell>
          <Table.Cell>john@example.com</Table.Cell>
          <Table.Cell>Admin</Table.Cell>
        </Table.Row>
        <Table.Row>
          <Table.Cell>Jane Smith</Table.Cell>
          <Table.Cell>jane@example.com</Table.Cell>
          <Table.Cell>Editor</Table.Cell>
        </Table.Row>
      </Table.Body>
    </Table.Root>
  )
}
```

## Accessibility

- **Role**: native `<table>` semantics
- **Keyboard support**: No interactive elements at the primitive level. Add interactive patterns (sort buttons, row selection) at the DataTable level.
- **ARIA notes**: Use `Table.Caption` for an accessible table description. Column header `<th>` elements carry implicit `scope="col"`.

## Dependencies

### klp components

*Leaf component — no klp dependencies.*

### External libraries

- [class-variance-authority](https://www.npmjs.com/package/class-variance-authority) — cva variant composition

### Token groups

- [Colors](../tokens/colors.md)
- [Spacing](../tokens/spacing.md)
- [Typography](../tokens/typography.md)

### Brands

- [klub](../brands/klub.md)

## Used by

- [Data Table](./_index_data-table.md) — DataTable renders rows using Table.Root/Header/Body/Row/Head/Cell primitives.

## Files

- Source: [`src/components/table/Table.tsx`](../../src/components/table/Table.tsx)
- Example: [`src/components/table/Table.example.tsx`](../../src/components/table/Table.example.tsx)
- Playground: [`playground/routes/table.tsx`](../../playground/routes/table.tsx)
- Registry: [`registry/table.json`](../../registry/table.json)
- Figma spec: [`.klp/figma-refs/table/spec.json`](../../.klp/figma-refs/table/spec.json)
- Reference screenshots: [`.klp/figma-refs/table/`](../../.klp/figma-refs/table/)

<!-- KLP:GAPS:BEGIN -->
## DS gaps

No gaps recorded.
<!-- KLP:GAPS:END -->

<!-- KLP:NOTES:BEGIN -->
## Notes

*Manual prose preserved across regenerations. Anything between the BEGIN/END markers is never overwritten by the documentalist.*
<!-- KLP:NOTES:END -->
