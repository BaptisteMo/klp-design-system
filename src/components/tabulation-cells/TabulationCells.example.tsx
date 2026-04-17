import {
  TabulationCell,
  TabulationCellsRoot,
  TabulationCellsList,
  TabulationCellsContent,
} from './TabulationCells'

export function TabulationCellsExample() {
  return (
    <TabulationCellsRoot defaultValue="tab1">
      <TabulationCellsList className="flex gap-1 rounded-klp-m bg-klp-bg-subtle p-1">
        <TabulationCell value="tab1" badge={3}>
          Label
        </TabulationCell>
        <TabulationCell value="tab2" badge={12}>
          Label
        </TabulationCell>
        <TabulationCell value="tab3">
          Label
        </TabulationCell>
      </TabulationCellsList>
      <TabulationCellsContent value="tab1">
        <p className="text-klp-fg-default text-klp-text-medium mt-4">Content for tab 1</p>
      </TabulationCellsContent>
      <TabulationCellsContent value="tab2">
        <p className="text-klp-fg-default text-klp-text-medium mt-4">Content for tab 2</p>
      </TabulationCellsContent>
      <TabulationCellsContent value="tab3">
        <p className="text-klp-fg-default text-klp-text-medium mt-4">Content for tab 3</p>
      </TabulationCellsContent>
    </TabulationCellsRoot>
  )
}
