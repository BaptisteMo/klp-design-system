export function Index() {
  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold">Components</h1>
        <p className="mt-1 text-sm text-klp-fg-muted">
          Click a component below to see its playground.
        </p>
      </div>

      <nav className="flex flex-col gap-1">
        <a
          href="#/button"
          className="rounded-klp-m border border-klp-border-default bg-klp-bg-subtle px-4 py-2 text-sm text-klp-fg-default hover:bg-klp-bg-inset"
        >
          Button
        </a>
        <a
          href="#/checkbox"
          className="rounded-klp-m border border-klp-border-default bg-klp-bg-subtle px-4 py-2 text-sm text-klp-fg-default hover:bg-klp-bg-inset"
        >
          Checkbox
        </a>
        <a
          href="#/radio"
          className="rounded-klp-m border border-klp-border-default bg-klp-bg-subtle px-4 py-2 text-sm text-klp-fg-default hover:bg-klp-bg-inset"
        >
          Radio
        </a>
        <a
          href="#/switch"
          className="rounded-klp-m border border-klp-border-default bg-klp-bg-subtle px-4 py-2 text-sm text-klp-fg-default hover:bg-klp-bg-inset"
        >
          Switch
        </a>
        <a
          href="#/tooltip"
          className="rounded-klp-m border border-klp-border-default bg-klp-bg-subtle px-4 py-2 text-sm text-klp-fg-default hover:bg-klp-bg-inset"
        >
          Tooltip
        </a>
        <a
          href="#/badges"
          className="rounded-klp-m border border-klp-border-default bg-klp-bg-subtle px-4 py-2 text-sm text-klp-fg-default hover:bg-klp-bg-inset"
        >
          Badge
        </a>
        <a
          href="#/input"
          className="rounded-klp-m border border-klp-border-default bg-klp-bg-subtle px-4 py-2 text-sm text-klp-fg-default hover:bg-klp-bg-inset"
        >
          Input
        </a>
        <a
          href="#/list-content"
          className="rounded-klp-m border border-klp-border-default bg-klp-bg-subtle px-4 py-2 text-sm text-klp-fg-default hover:bg-klp-bg-inset"
        >
          List Content
        </a>
        <a
          href="#/table-row"
          className="rounded-klp-m border border-klp-border-default bg-klp-bg-subtle px-4 py-2 text-sm text-klp-fg-default hover:bg-klp-bg-inset"
        >
          Table Row
        </a>
        <a
          href="#/action-sheet-item"
          className="rounded-klp-m border border-klp-border-default bg-klp-bg-subtle px-4 py-2 text-sm text-klp-fg-default hover:bg-klp-bg-inset"
        >
          Action Sheet Item
        </a>
        <a
          href="#/floating-alert"
          className="rounded-klp-m border border-klp-border-default bg-klp-bg-subtle px-4 py-2 text-sm text-klp-fg-default hover:bg-klp-bg-inset"
        >
          Floating Alert
        </a>
        <a
          href="#/in-content-alert"
          className="rounded-klp-m border border-klp-border-default bg-klp-bg-subtle px-4 py-2 text-sm text-klp-fg-default hover:bg-klp-bg-inset"
        >
          InContent Alert
        </a>
        <a
          href="#/breadcrumbs"
          className="rounded-klp-m border border-klp-border-default bg-klp-bg-subtle px-4 py-2 text-sm text-klp-fg-default hover:bg-klp-bg-inset"
        >
          BreadCrumbs
        </a>
        <a
          href="#/tabulation-cells"
          className="rounded-klp-m border border-klp-border-default bg-klp-bg-subtle px-4 py-2 text-sm text-klp-fg-default hover:bg-klp-bg-inset"
        >
          Tabulation Cells
        </a>
        <a
          href="#/tabulations"
          className="rounded-klp-m border border-klp-border-default bg-klp-bg-subtle px-4 py-2 text-sm text-klp-fg-default hover:bg-klp-bg-inset"
        >
          Tabulations
        </a>
        <a
          href="#/text-area"
          className="rounded-klp-m border border-klp-border-default bg-klp-bg-subtle px-4 py-2 text-sm text-klp-fg-default hover:bg-klp-bg-inset"
        >
          Text Area
        </a>
      </nav>

      <section className="rounded-klp-m border border-klp-border-default bg-klp-bg-subtle p-4">
        <h2 className="text-sm font-semibold">Token smoke test (reflects current brand)</h2>

        <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3">
          <Swatch label="bg-brand"            className="bg-klp-bg-brand text-klp-fg-on-emphasis" />
          <Swatch label="bg-brand-low"        className="bg-klp-bg-brand-low text-klp-fg-default" />
          <Swatch label="bg-secondary-brand"  className="bg-klp-bg-secondary-brand text-klp-fg-on-emphasis" />
          <Swatch label="bg-success-emphasis" className="bg-klp-bg-success-emphasis text-klp-fg-on-emphasis" />
          <Swatch label="bg-danger-emphasis"  className="bg-klp-bg-danger-emphasis text-klp-fg-on-emphasis" />
          <Swatch label="bg-warning-contrasted" className="bg-klp-bg-warning-contrasted text-klp-fg-on-emphasis" />
          <Swatch label="bg-info-contrasted"  className="bg-klp-bg-info-contrasted text-klp-fg-on-emphasis" />
          <Swatch label="bg-subtle"           className="bg-klp-bg-subtle text-klp-fg-default border border-klp-border-default" />
          <Swatch label="bg-inset"            className="bg-klp-bg-inset text-klp-fg-default" />
        </div>

        <div className="mt-4 flex items-end gap-3">
          <span className="text-klp-heading-h1 font-klp-title" style={{ fontWeight: 'var(--font-weight-klp-title)' }}>H1</span>
          <span className="text-klp-heading-h2 font-klp-title" style={{ fontWeight: 'var(--font-weight-klp-title)' }}>H2</span>
          <span className="text-klp-heading-h3 font-klp-title" style={{ fontWeight: 'var(--font-weight-klp-title)' }}>H3</span>
          <span className="text-klp-heading-h4 font-klp-title" style={{ fontWeight: 'var(--font-weight-klp-title)' }}>H4</span>
          <span className="text-klp-text-large font-klp-body">Body L</span>
          <span className="text-klp-text-medium font-klp-body">Body M</span>
          <span className="text-klp-text-small font-klp-label">Label S</span>
        </div>
      </section>
    </div>
  )
}

function Swatch({ label, className }: { label: string; className: string }) {
  return (
    <div className={`flex h-14 items-center justify-center rounded-klp-m px-3 font-klp-mono text-xs ${className}`}>
      {label}
    </div>
  )
}
