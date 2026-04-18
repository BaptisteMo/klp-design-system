---
title: "Table (primitives)"
type: component
status: stable
category: data-display
captureBrand: wireframe
radixPrimitive: null
sources:
  - src/components/table/Table.tsx
dependencies:
  components: []
  externals: [class-variance-authority]
  tokenGroups: [colors, spacing, typography]
  brands: [wireframe]
usedBy: [data-table]
created: 2026-04-17
updated: 2026-04-17
---

# Table (primitives)

Compound HTML primitives (Table.Root/Header/Body/Row/Head/Cell/Caption) with klp styling. Low-level building blocks for custom tables.

> No Figma spec — this component was introduced as part of the table refactor and has no spec.json. Documentation is derived from source only.

## Anatomy

```
Table.Root     (<table>)    — Full-width, collapsed borders. Container for all sub-components.
├── Table.Caption  (<caption>) — Optional accessible caption; subtle muted text.
├── Table.Header   (<thead>)   — Wraps header rows.
│   └── Table.Row  (<tr>)      — variant: default | selected | muted
│       └── Table.Head (<th>)  — Bold muted label; left-aligned; padded.
├── Table.Body     (<tbody>)   — Wraps data rows.
│   └── Table.Row  (<tr>)      — variant: default | selected | muted
│       └── Table.Cell (<td>)  — Body typography; left-aligned; padded.
└── Table.Footer   (<tfoot>)   — Optional footer section.
```

## Variants

The only variant axis on the Row sub-component is `variant`:

| variant | Description |
|---|---|
| `default` | Idle state; hover activates `bg-klp-bg-subtle` via CSS hover. |
| `selected` | Locked `bg-klp-bg-secondary-brand-low` (row selection preview). |
| `muted` | Locked `bg-klp-bg-subtle` (e.g. empty-state row). |

All other sub-components (Root, Header, Body, Footer, Head, Cell, Caption) have no variant axis — they expose only a `className` override.

## API

### `Table.Root`

Extends `React.TableHTMLAttributes<HTMLTableElement>`. All native `<table>` attributes forwarded.

| Prop | Type | Default | Description |
|---|---|---|---|
| `className` | `string` | — | Additional Tailwind classes merged via `cn()`. |

### `Table.Row`

Extends `React.HTMLAttributes<HTMLTableRowElement>`.

| Prop | Type | Default | Description |
|---|---|---|---|
| `variant` | `'default' \| 'selected' \| 'muted'` | `'default'` | Visual row state. |
| `className` | `string` | — | Additional classes merged via `cn()`. |

### `Table.Head`

Extends `React.ThHTMLAttributes<HTMLTableCellElement>`. All `<th>` attributes forwarded.

### `Table.Cell`

Extends `React.TdHTMLAttributes<HTMLTableCellElement>`. All `<td>` attributes forwarded.

### `Table.Header` / `Table.Body` / `Table.Footer` / `Table.Caption`

Each extends the matching HTML section element's attributes. No additional props.

(source: src/components/table/Table.tsx)

## Tokens

### `row` layer

| Property | Token | Resolved (wireframe) |
|---|---|---|
| border-bottom | `--klp-border-default` | `var(--klp-color-gray-300)` |
| hover background (default) | `--klp-bg-subtle` | `var(--klp-color-gray-100)` |
| background (selected) | `--klp-bg-secondary-brand-low` | `var(--klp-color-gray-300)` |
| background (muted) | `--klp-bg-subtle` | `var(--klp-color-gray-100)` |

### `head` layer

| Property | Token | Resolved (wireframe) |
|---|---|---|
| color | `--klp-fg-muted` | `var(--klp-color-gray-700)` |
| padding-top/bottom | `--klp-size-s` | `12px` |
| padding-left/right | `--klp-size-s` | `12px` |
| font-family | `--klp-font-family-label` | `Inter, Test Calibre, system-ui` |
| font-weight | `--klp-font-weight-label-bold` | `600` |
| font-size | `--klp-text-medium` | `16px` |

### `cell` layer

| Property | Token | Resolved (wireframe) |
|---|---|---|
| color | `--klp-fg-default` | `var(--klp-color-gray-800)` |
| padding-top/bottom | `--klp-size-m` | `16px` |
| padding-left/right | `--klp-size-s` | `12px` |
| font-family | `--klp-font-family-body` | `Inter, Test Calibre, system-ui` |
| font-size | `--klp-text-medium` | `16px` |

### `caption` layer

| Property | Token | Resolved (wireframe) |
|---|---|---|
| color | `--klp-fg-muted` | `var(--klp-color-gray-700)` |
| font-size | `--klp-text-small` | `14px` |
| padding-top/bottom | `--klp-size-s` | `12px` |

(source: src/components/table/Table.tsx:rowVariants, headVariants, cellVariants, captionVariants)

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

(source: src/components/table/Table.example.tsx)

## Accessibility

- **Role:** Semantic HTML table elements — `<table>`, `<thead>`, `<tbody>`, `<tfoot>`, `<tr>`, `<th>`, `<td>`, `<caption>`. No ARIA overrides needed for basic use.
- **ARIA notes:** Use `<Table.Caption>` to provide an accessible name for the table when the surrounding context is insufficient. For sortable columns, add `aria-sort` on `<Table.Head>` (see DataTable for a reference implementation).

> ❓ UNVERIFIED: no a11y section in the Figma spec — review and add notes manually under ## Notes.

## Dependencies

### klp components

*Leaf component — no klp dependencies.*

### External libraries

- [class-variance-authority](https://www.npmjs.com/package/class-variance-authority) — CVA for row, head, cell, and caption variant blocks.

### Token groups

- [Colors](../tokens/colors.md) — `bg-*`, `fg-*`, `border-*` aliases on row, head, and cell layers.
- [Spacing](../tokens/spacing.md) — `size-s`, `size-m` for padding on head and cell layers.
- [Typography](../tokens/typography.md) — `font-family-label`, `font-weight-label-bold`, `font-family-body` on head and cell layers.

### Brands

- [wireframe](../brands/wireframe.md) — default brand; no Figma spec captured yet.

## Used by

- [Data Table](./_index_data-table.md) — uses `Table.Root`, `Table.Header`, `Table.Body`, `Table.Row`, `Table.Head`, `Table.Cell`, `Table.Caption` as internal layout primitives.

## Files

- Source: [`src/components/table/Table.tsx`](../../src/components/table/Table.tsx)
- Example: [`src/components/table/Table.example.tsx`](../../src/components/table/Table.example.tsx)
- Playground: [`playground/routes/table.tsx`](../../playground/routes/table.tsx)
- Registry: [`registry/table.json`](../../registry/table.json)

<!-- KLP:NOTES:BEGIN -->
## Notes

*Manual prose preserved across regenerations. Anything between the BEGIN/END markers is never overwritten by the documentalist.*
<!-- KLP:NOTES:END -->

<!-- KLP:GAPS:BEGIN -->
## Gaps

No gaps recorded.
<!-- KLP:GAPS:END -->
