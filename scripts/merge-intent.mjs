#!/usr/bin/env node
// scripts/merge-intent.mjs
// Merges .klp/intent.yaml + index.ts exports into klp-components.json.
// Sole writer of the intent/aliases/exports fields. Run via `pnpm run sync:intent`.

import { readFileSync, writeFileSync, existsSync } from 'node:fs'
import { join } from 'node:path'
import { loadIntent, componentNames, validateIntent } from './validate-intent.mjs'

export function parseExports(source) {
  const exports = []
  const typeExports = []
  const re = /export\s+(type\s+)?\{([^}]*)\}/g
  let m
  while ((m = re.exec(source))) {
    const isType = Boolean(m[1])
    for (const raw of m[2].split(',')) {
      const part = raw.trim()
      if (!part) continue
      const name = part.split(/\s+as\s+/).pop().trim()
      if (!name) continue
      const bucket = isType || /^type\s/.test(part) ? typeExports : exports
      bucket.push(name.replace(/^type\s+/, ''))
    }
  }
  return { exports, typeExports }
}

export function mergeEntry(entry, intentForName, exportsForName) {
  const name = entry.name
  const i = intentForName
  const aliases = [
    name,
    ...(exportsForName.exports.slice(0, 1)),
    ...(i?.figmaName ? [i.figmaName] : []),
    ...(i?.aliases ?? []),
  ]
    .map((a) => String(a).trim())
    .filter(Boolean)

  return {
    ...entry,
    figmaName: i?.figmaName ?? name,
    aliases: [...new Set(aliases)],
    family: i?.family ?? null,
    exports: exportsForName.exports,
    typeExports: exportsForName.typeExports,
    intent: i
      ? {
          whenToUse: i.whenToUse.trim(),
          whenNotToUse: i.whenNotToUse.trim(),
          confusedWith: (i.confusedWith ?? []).map((c) => ({ component: c.component, rule: c.rule.trim() })),
        }
      : null,
  }
}

function readExports(root, name) {
  const p = join(root, 'src/components', name, 'index.ts')
  if (!existsSync(p)) return { exports: [], typeExports: [] }
  return parseExports(readFileSync(p, 'utf8'))
}

function main() {
  const root = process.cwd()
  const intent = loadIntent(root)
  const names = componentNames(root)

  const errors = validateIntent(intent, names)
  if (errors.length) {
    for (const e of errors) console.error(`  ✗ ${e}`)
    console.error(`\nintent.yaml invalid — catalog not written`)
    process.exit(1)
  }

  const catalogPath = join(root, 'klp-components.json')
  const catalog = JSON.parse(readFileSync(catalogPath, 'utf8'))
  catalog.components = catalog.components.map((entry) =>
    mergeEntry(entry, intent.components[entry.name], readExports(root, entry.name)),
  )
  catalog.families = intent.families
  writeFileSync(catalogPath, JSON.stringify(catalog, null, 2) + '\n')

  const withIntent = catalog.components.filter((c) => c.intent).length
  console.log(`klp-components.json updated — ${withIntent}/${catalog.components.length} components carry intent`)
}

if (import.meta.url === `file://${process.argv[1]}`) main()
