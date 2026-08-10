#!/usr/bin/env node
// scripts/validate-intent.mjs
// Schema + referential-integrity check for .klp/intent.yaml.
// Exit 0 = valid, 1 = at least one error.

import { readFileSync, readdirSync, statSync } from 'node:fs'
import { join } from 'node:path'
import { parse } from 'yaml'

export function loadIntent(rootDir) {
  return parse(readFileSync(join(rootDir, '.klp/intent.yaml'), 'utf8'))
}

export function componentNames(rootDir) {
  const dir = join(rootDir, 'src/components')
  return readdirSync(dir).filter((n) => statSync(join(dir, n)).isDirectory()).sort()
}

export function validateIntent(intent, names) {
  const errors = []
  const known = new Set(names)

  if (!intent || typeof intent !== 'object') return ['intent.yaml: not an object']
  if (intent.schemaVersion !== 'v1') errors.push(`intent.yaml: schemaVersion must be "v1", got ${JSON.stringify(intent.schemaVersion)}`)

  const families = intent.families ?? {}
  const components = intent.components ?? {}

  for (const [famName, fam] of Object.entries(families)) {
    if (typeof fam?.rule !== 'string' || fam.rule.trim() === '') errors.push(`families.${famName}: rule is required`)
    if (!Array.isArray(fam?.members) || fam.members.length < 2) errors.push(`families.${famName}: members must list at least 2 components`)
    if (Array.isArray(fam?.members)) {
      for (const m of fam.members) {
        if (!known.has(m)) { errors.push(`families.${famName}.members: "${m}" matches no component`); continue }
        if (components[m]?.family !== famName) errors.push(`components.${m}: must declare family "${famName}" (listed in families.${famName}.members)`)
      }
    }
  }

  for (const [name, c] of Object.entries(components)) {
    if (!known.has(name)) { errors.push(`components.${name}: matches no component under src/components/`); continue }
    for (const field of ['whenToUse', 'whenNotToUse']) {
      if (typeof c?.[field] !== 'string' || c[field].trim() === '') errors.push(`components.${name}: ${field} is required and must be a non-empty string`)
    }
    if (c?.family && !families[c.family]) errors.push(`components.${name}: family "${c.family}" is not declared under families`)
    if (c?.aliases && !Array.isArray(c.aliases)) errors.push(`components.${name}: aliases must be a list`)
    if (c?.figmaName && typeof c.figmaName !== 'string') errors.push(`components.${name}: figmaName must be a string`)
    if (c?.confusedWith !== undefined && !Array.isArray(c.confusedWith)) {
      errors.push(`components.${name}: confusedWith must be a list`)
    } else {
      for (const cw of c?.confusedWith ?? []) {
        if (!known.has(cw?.component)) errors.push(`components.${name}.confusedWith: "${cw?.component}" matches no component`)
        if (cw?.component === name) errors.push(`components.${name}.confusedWith: cannot reference itself`)
        if (typeof cw?.rule !== 'string' || cw.rule.trim() === '') errors.push(`components.${name}.confusedWith[${cw?.component}]: rule is required`)
      }
    }
  }

  for (const name of names) {
    if (!components[name]) errors.push(`components.${name}: missing intent entry`)
  }

  return errors
}

function main() {
  const root = process.cwd()
  const errors = validateIntent(loadIntent(root), componentNames(root))
  if (errors.length) {
    for (const e of errors) console.error(`  ✗ ${e}`)
    console.error(`\nintent.yaml: ${errors.length} error(s)`)
    process.exit(1)
  }
  console.log('intent.yaml OK')
}

if (import.meta.url === `file://${process.argv[1]}`) main()
