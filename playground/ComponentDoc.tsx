import { useState, type ComponentPropsWithoutRef, type ReactNode } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

// Eagerly load every generated component doc as raw markdown.
// Keys look like: '../docs/components/_index_button.md'
const DOCS = import.meta.glob('../docs/components/_index_*.md', {
  query: '?raw',
  import: 'default',
  eager: true,
}) as Record<string, string>

// name (e.g. 'button') -> raw markdown, frontmatter stripped
const BY_NAME: Record<string, string> = {}
for (const [path, raw] of Object.entries(DOCS)) {
  const match = path.match(/_index_(.+)\.md$/)
  if (match) BY_NAME[match[1]] = stripFrontmatter(raw)
}

function stripFrontmatter(md: string): string {
  let out = md
  // Remove a leading YAML block delimited by --- ... ---
  if (out.startsWith('---')) {
    const end = out.indexOf('\n---', 3)
    if (end !== -1) out = out.slice(out.indexOf('\n', end + 1) + 1)
  }
  // Strip HTML comments (KLP:GAPS / KLP:NOTES pipeline markers) — they leak as text otherwise.
  out = out.replace(/<!--[\s\S]*?-->/g, '')
  return out.trimStart()
}

// Markdown element → klp-token-styled renderers (no typography plugin needed).
const components = {
  h1: (p: ComponentPropsWithoutRef<'h1'>) => (
    <h1 className="mt-0 mb-3 text-2xl font-klp-heading font-bold text-klp-fg-default" {...p} />
  ),
  h2: (p: ComponentPropsWithoutRef<'h2'>) => (
    <h2 className="mt-8 mb-3 border-b border-klp-border-default pb-1 text-lg font-klp-heading font-semibold text-klp-fg-default" {...p} />
  ),
  h3: (p: ComponentPropsWithoutRef<'h3'>) => (
    <h3 className="mt-6 mb-2 text-base font-klp-heading font-semibold text-klp-fg-default" {...p} />
  ),
  p: (p: ComponentPropsWithoutRef<'p'>) => (
    <p className="my-3 leading-relaxed text-klp-fg-muted" {...p} />
  ),
  ul: (p: ComponentPropsWithoutRef<'ul'>) => (
    <ul className="my-3 list-disc pl-6 text-klp-fg-muted marker:text-klp-fg-subtle" {...p} />
  ),
  ol: (p: ComponentPropsWithoutRef<'ol'>) => (
    <ol className="my-3 list-decimal pl-6 text-klp-fg-muted" {...p} />
  ),
  li: (p: ComponentPropsWithoutRef<'li'>) => <li className="my-1" {...p} />,
  a: (p: ComponentPropsWithoutRef<'a'>) => (
    <a className="text-klp-fg-brand underline underline-offset-2 hover:opacity-80" {...p} />
  ),
  strong: (p: ComponentPropsWithoutRef<'strong'>) => (
    <strong className="font-semibold text-klp-fg-default" {...p} />
  ),
  blockquote: (p: ComponentPropsWithoutRef<'blockquote'>) => (
    <blockquote className="my-4 border-l-2 border-klp-border-brand bg-klp-bg-subtle py-1 pl-4 text-klp-fg-muted italic" {...p} />
  ),
  hr: () => <hr className="my-6 border-klp-border-default" />,
  code: ({ className, children, ...rest }: ComponentPropsWithoutRef<'code'>) => {
    const isBlock = /language-/.test(className ?? '')
    if (isBlock) return <code className={className} {...rest}>{children}</code>
    return (
      <code className="rounded-klp-s bg-klp-bg-subtle px-1.5 py-0.5 font-klp-mono text-[0.85em] text-klp-fg-default" {...rest}>
        {children}
      </code>
    )
  },
  pre: (p: ComponentPropsWithoutRef<'pre'>) => (
    <pre className="my-4 overflow-x-auto rounded-klp-m border border-klp-border-default bg-klp-bg-subtle p-4 font-klp-mono text-xs leading-relaxed text-klp-fg-default" {...p} />
  ),
  table: (p: ComponentPropsWithoutRef<'table'>) => (
    <div className="my-4 overflow-x-auto rounded-klp-m border border-klp-border-default">
      <table className="w-full border-collapse text-sm" {...p} />
    </div>
  ),
  thead: (p: ComponentPropsWithoutRef<'thead'>) => (
    <thead className="bg-klp-bg-subtle" {...p} />
  ),
  th: (p: ComponentPropsWithoutRef<'th'>) => (
    <th className="border-b border-klp-border-default px-3 py-2 text-left font-semibold text-klp-fg-default" {...p} />
  ),
  td: (p: ComponentPropsWithoutRef<'td'>) => (
    <td className="border-b border-klp-border-default px-3 py-2 align-top text-klp-fg-muted" {...p} />
  ),
}

export function ComponentDoc({ name }: { name: string }): ReactNode {
  const [open, setOpen] = useState(true)
  const md = BY_NAME[name]
  if (!md) return null

  return (
    <section className="mt-12 border-t border-klp-border-default pt-6">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="mb-2 flex items-center gap-2 font-klp-mono text-xs uppercase tracking-wide text-klp-fg-muted hover:text-klp-fg-default"
        aria-expanded={open}
      >
        <span className="inline-block w-3">{open ? '▾' : '▸'}</span>
        Documentation
      </button>
      {open && (
        <div className="max-w-3xl rounded-klp-l border border-klp-border-default bg-klp-bg-default p-6">
          <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
            {md}
          </ReactMarkdown>
        </div>
      )}
    </section>
  )
}
