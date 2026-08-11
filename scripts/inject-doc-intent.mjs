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

// Finds the character offset of the first `## ` heading that is outside the
// leading `---` frontmatter block and outside any ``` / ~~~ fenced region.
// Returns -1 when no such heading exists.
function findHeadingInsertionIndex(markdown) {
  const lines = markdown.split('\n')
  let offset = 0
  let inFrontmatter = lines[0] === '---'
  let fence = null

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]

    if (i === 0 && inFrontmatter) {
      offset += line.length + 1
      continue
    }

    if (inFrontmatter) {
      if (line === '---' || line === '...') inFrontmatter = false
      offset += line.length + 1
      continue
    }

    const fenceMatch = line.match(/^(```|~~~)/)
    if (fenceMatch) {
      if (fence === fenceMatch[1]) fence = null
      else if (!fence) fence = fenceMatch[1]
      offset += line.length + 1
      continue
    }

    if (!fence && /^## /.test(line)) return offset

    offset += line.length + 1
  }

  return -1
}

export function injectBlock(markdown, block) {
  const trimmedBlock = block.replace(/\n$/, '')
  const start = markdown.indexOf(BEGIN)
  if (start !== -1) {
    const end = markdown.indexOf(END, start)
    if (end === -1) throw new Error('unterminated KLP:INTENT block (BEGIN with no END)')
    const before = markdown.slice(0, start)
    // Strip any existing blank-line padding after the old END so re-injection
    // never accumulates blank lines — always normalize to exactly one.
    const after = markdown.slice(end + END.length).replace(/^\n+/, '')
    return before + trimmedBlock + '\n\n' + after
  }

  // Insert before the first `## ` heading that is outside frontmatter and
  // outside any fenced code block; if there is none, append at the end.
  const idx = findHeadingInsertionIndex(markdown)
  if (idx === -1) return markdown.replace(/\n*$/, '\n\n') + trimmedBlock + '\n'
  return markdown.slice(0, idx) + trimmedBlock + '\n\n' + markdown.slice(idx)
}

function main() {
  const root = process.cwd()
  const catalog = JSON.parse(readFileSync(join(root, 'klp-components.json'), 'utf8'))
  let written = 0
  let missing = 0
  let failed = 0
  for (const entry of catalog.components) {
    const p = join(root, 'docs/components', `_index_${entry.name}.md`)
    if (!existsSync(p)) { console.warn(`  ⚠ no doc page for ${entry.name}`); missing++; continue }
    try {
      const src = readFileSync(p, 'utf8')
      const next = injectBlock(src, renderIntentBlock(entry, catalog.families))
      if (next !== src) { writeFileSync(p, next); written++ }
    } catch (err) {
      console.error(`  ✗ ${p}: ${err.message}`)
      failed++
    }
  }

  if (failed > 0) {
    console.error(`doc intent blocks — ${written} page(s) updated, ${missing} page(s) missing, ${failed} page(s) failed`)
    process.exit(1)
  }
  console.log(`doc intent blocks — ${written} page(s) updated, ${missing} page(s) missing`)
}

if (import.meta.url === `file://${process.argv[1]}`) main()
