#!/usr/bin/env node
// scripts/inject-doc-intent.mjs
// Writes the marker-delimited intent block into every docs/components/_index_<name>.md.
// Idempotent: re-running replaces the block in place and touches nothing else.

import { readFileSync, writeFileSync, existsSync } from 'node:fs'
import { join } from 'node:path'

const BEGIN = '<!-- KLP:INTENT:BEGIN -->'
const END = '<!-- KLP:INTENT:END -->'

function oneLine(s) {
  return String(s).replace(/\s*\n\s*/g, ' ').trim()
}

export function renderIntentBlock(entry, families) {
  const lines = [BEGIN, '']
  if (!entry.intent) {
    lines.push('## When to use', '', '_No intent authored yet — add an entry to `.klp/intent.yaml`._', '', END, '')
    return lines.join('\n')
  }

  lines.push('## When to use', '', oneLine(entry.intent.whenToUse), '')
  lines.push(`**Don't use it for:** ${oneLine(entry.intent.whenNotToUse)}`, '')

  const fam = entry.family ? families?.[entry.family] : null
  if (fam) {
    lines.push(`**Family — \`${entry.family}\`:** ${oneLine(fam.rule)}`, '')
  }

  if (entry.intent.confusedWith.length) {
    lines.push("## Don't confuse with", '')
    lines.push('| Component | How to choose |', '|---|---|')
    for (const c of entry.intent.confusedWith) {
      lines.push(`| \`${c.component}\` | ${oneLine(c.rule).replace(/\|/g, '\\|')} |`)
    }
    lines.push('')
  }

  lines.push(END, '')
  return lines.join('\n')
}

export function injectBlock(markdown, block) {
  const start = markdown.indexOf(BEGIN)
  if (start !== -1) {
    const end = markdown.indexOf(END, start)
    if (end === -1) throw new Error('unterminated KLP:INTENT block')
    const before = markdown.slice(0, start)
    const after = markdown.slice(end + END.length).replace(/^\n/, '')
    return before + block.replace(/\n$/, '') + '\n' + after
  }

  // Insert before the first `## ` heading; if there is none, append.
  const m = markdown.match(/^## /m)
  if (!m) return markdown.replace(/\n*$/, '\n\n') + block
  const idx = markdown.indexOf(m[0], m.index)
  return markdown.slice(0, idx) + block + markdown.slice(idx)
}

function main() {
  const root = process.cwd()
  const catalog = JSON.parse(readFileSync(join(root, 'klp-components.json'), 'utf8'))
  let written = 0
  let missing = 0
  for (const entry of catalog.components) {
    const p = join(root, 'docs/components', `_index_${entry.name}.md`)
    if (!existsSync(p)) { console.warn(`  ⚠ no doc page for ${entry.name}`); missing++; continue }
    const src = readFileSync(p, 'utf8')
    const next = injectBlock(src, renderIntentBlock(entry, catalog.families))
    if (next !== src) { writeFileSync(p, next); written++ }
  }
  console.log(`doc intent blocks — ${written} page(s) updated, ${missing} page(s) missing`)
}

if (import.meta.url === `file://${process.argv[1]}`) main()
