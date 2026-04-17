import { Tabulations, TabulationsContent } from '@/components/tabulations'

export function TabulationsExample() {
  return (
    <Tabulations
      defaultValue="home"
      tabs={[
        { value: 'home',     label: 'Home',     badge: 3 },
        { value: 'offers',   label: 'Offers',   badge: 12 },
        { value: 'account',  label: 'Account' },
      ]}
    >
      <TabulationsContent value="home">
        <p className="mt-4 text-klp-fg-default">Home content</p>
      </TabulationsContent>
      <TabulationsContent value="offers">
        <p className="mt-4 text-klp-fg-default">Offers content</p>
      </TabulationsContent>
      <TabulationsContent value="account">
        <p className="mt-4 text-klp-fg-default">Account content</p>
      </TabulationsContent>
    </Tabulations>
  )
}
