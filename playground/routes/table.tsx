import { Table } from '@/components/table'

export function TableRoute() {
  return (
    <div className="flex flex-col gap-6 p-6">
      <h1 className="text-xl font-semibold">Table — primitives</h1>
      <p className="text-klp-text-small text-klp-fg-muted max-w-2xl">
        Thin HTML wrappers with klp styling. Use these directly when you need maximum control.
        For a schema-driven experience, see <code>/data-table</code>.
      </p>
      <Table.Root>
        <Table.Caption>Example static table.</Table.Caption>
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
          <Table.Row variant="selected">
            <Table.Cell>Alex Johnson</Table.Cell>
            <Table.Cell>alex@example.com</Table.Cell>
            <Table.Cell>Viewer</Table.Cell>
          </Table.Row>
        </Table.Body>
      </Table.Root>
    </div>
  )
}
