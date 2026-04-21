// scripts/build-agent-brief.ts
// Regenerates docs/agent-brief.md from klp-components.json + token CSS.
// Brand-agnostic v0: lists inventory, token aliases, composition rules.

import { readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'

const ROOT = process.cwd()

type ComponentEntry = {
  name: string
  displayName?: string
  description?: string
  category?: string
  variantCount?: number
  anatomy?: string[]
  status?: string
  exemptFromFigmaPipeline?: boolean
}

function loadComponents(): ComponentEntry[] {
  const raw = readFileSync(join(ROOT, 'klp-components.json'), 'utf8')
  const parsed = JSON.parse(raw)
  if (Array.isArray(parsed)) return parsed
  if (parsed.components && Array.isArray(parsed.components)) return parsed.components
  throw new Error('klp-components.json: unexpected schema (expected array or { components: [] })')
}

function extractAliases(): Record<string, string[]> {
  const text = readFileSync(join(ROOT, 'src/styles/tokens/aliases.css'), 'utf8')
  const root = text.match(/:root,?\s*\[data-brand="wireframe"\]\s*\{([\s\S]*?)\}/)?.[1] ?? ''
  const buckets: Record<string, Set<string>> = {
    bg: new Set(), fg: new Set(), border: new Set(),
    radius: new Set(), size: new Set(), font: new Set(),
  }
  for (const line of root.split('\n')) {
    const m = line.trim().match(/^--klp-(bg|fg|border|radius|size|font)-([a-z0-9-]+):/)
    if (!m) continue
    const [, group, rest] = m
    buckets[group].add(rest)
  }
  return Object.fromEntries(Object.entries(buckets).map(([k, v]) => [k, [...v].sort()]))
}

function groupByCategory(components: ComponentEntry[]): Record<string, ComponentEntry[]> {
  const out: Record<string, ComponentEntry[]> = {}
  for (const c of components) {
    const cat = c.category ?? 'uncategorized'
    if (!out[cat]) out[cat] = []
    out[cat].push(c)
  }
  for (const list of Object.values(out)) list.sort((a, b) => a.name.localeCompare(b.name))
  return out
}

function tailwindPrefix(group: string): string {
  return { bg: 'bg-klp-bg-', fg: 'text-klp-fg-', border: 'border-klp-border-', radius: 'rounded-klp-', size: 'gap-klp-size-', font: 'font-klp-' }[group] ?? `klp-${group}-`
}

function main() {
  const components = loadComponents().filter((c) => c.status !== 'deleted' && c.status !== 'removed')
  const byCat = groupByCategory(components)
  const aliases = extractAliases()

  const lines: string[] = []
  lines.push('---')
  lines.push('title: klp-ui — agent brief')
  lines.push('type: agent-context')
  lines.push(`generated-at: ${new Date().toISOString()}`)
  lines.push('schema-version: 0.1.0')
  lines.push('---')
  lines.push('')
  lines.push('# klp-ui agent brief')
  lines.push('')
  lines.push('Condensed reference for design agents. Read this first before any design task; drill into `docs/components/_index_<name>.md` for specifics.')
  lines.push('')
  lines.push(`## Inventory (${components.length} components)`)
  lines.push('')

  for (const cat of Object.keys(byCat).sort()) {
    lines.push(`### ${cat}`)
    for (const c of byCat[cat]) {
      const vc = c.variantCount ? ` (${c.variantCount} variants)` : ''
      const desc = c.description ? ` — ${c.description.split('\n')[0]}` : ''
      lines.push(`- **${c.name}**${vc}${desc}`)
    }
    lines.push('')
  }

  lines.push('## Token aliases (use these; never raw `--klp-color-*`)')
  lines.push('')
  for (const [group, names] of Object.entries(aliases)) {
    if (names.length === 0) continue
    const prefix = tailwindPrefix(group)
    const sample = names.slice(0, 8).map((n) => `\`${prefix}${n}\``).join(', ')
    const more = names.length > 8 ? `, … (${names.length - 8} more)` : ''
    lines.push(`- **${group}:** ${sample}${more}`)
  }
  lines.push('')

  lines.push('## Brand')
  lines.push('')
  lines.push('Brand is set in `src/App.tsx` via `<BrandProvider brand="…">`. For brand-specific guidance consult `docs/brands/<active-brand>.md`.')
  lines.push('')

  lines.push('## Composition rules (hard)')
  lines.push('')
  lines.push('- Always `cn()` — never string concat.')
  lines.push('- Import DS components via `@/components/ui/<name>` (exception: `@/components/brand-provider`).')
  lines.push('- No inline SVG — use `lucide-react`.')
  lines.push('- No hex colors, no `--klp-color-*` primitive refs.')
  lines.push('- Do not import `@radix-ui/*` directly in mockups — DS already wraps them.')
  lines.push('- Never hardcode a prop classified `computed` — read the component\'s Props usage table before calling it. `persistent` props may be passed when a user-owned state applies (current page, selected row).')
  lines.push('')

  lines.push('## DS gap log')
  lines.push('')
  lines.push('See `docs/ds-gaps.md` (initially empty in consumer; pipeline appends).')
  lines.push('')

  lines.push('## Computed & persistent props (appendix)')
  lines.push('')
  lines.push('Derived from every component\'s `Props` interface `@propClass` tags. Computed = do NOT pass. Persistent = pass when relevant.')
  lines.push('')
  lines.push('| Component | Prop | Class | Description |')
  lines.push('|---|---|---|---|')
  for (const c of components) {
    const props = ((c as unknown as Record<string, unknown>).props ?? {}) as Record<string, { class: string; type: string; default: string | null; description?: string }>
    for (const [name, meta] of Object.entries(props)) {
      if (meta.class === 'computed' || meta.class === 'persistent') {
        const desc = (meta.description ?? '').replace(/\|/g, '\\|').slice(0, 120)
        lines.push(`| \`${c.name}\` | \`${name}\` | **${meta.class}** | ${desc} |`)
      }
    }
  }
  lines.push('')

  writeFileSync(join(ROOT, 'docs/agent-brief.md'), lines.join('\n'))
  console.log(`Wrote docs/agent-brief.md — ${components.length} components, ${Object.values(aliases).flat().length} token aliases`)
}

main()
