import { ListContent } from './ListContent'

export function ListContentExample() {
  return (
    <ul className="flex flex-col divide-y divide-klp-border-default rounded-klp-l border border-klp-border-default bg-klp-bg-default w-[364px]">
      <li>
        <ListContent size="medium" state="default" label="Label of the list" sublabel="Sublabel" />
      </li>
      <li>
        <ListContent size="medium" state="hover" label="Label of the list" sublabel="Sublabel" />
      </li>
      <li>
        <ListContent size="medium" state="active" label="Label of the list" sublabel="Sublabel" />
      </li>
    </ul>
  )
}
