import { DataField } from './DataField'

export function DataFieldExample() {
  return (
    <div className="flex w-[420px] flex-col gap-klp-size-m">
      <DataField
        label="Personalized message"
        value="Id ultricies a ullamcorper condimentum a id facilisi nec a suspendisse lobortis egestas sit vestibulum vestibulum adipiscing parturient dolor fringilla vestibulum a magna posuere volutpat."
      />
      <DataField label="Order reference" value="KLP-2026-00418" emphasis="strong" />
      <DataField label="Delivery note" value={null} />
    </div>
  )
}
