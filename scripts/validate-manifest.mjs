// scripts/validate-manifest.mjs
// Integrity check: asserts manifest.json matches filesystem content + dep references resolve.

import { readFileSync, existsSync } from 'node:fs'
import { createHash } from 'node:crypto'
import { join } from 'node:path'

const ROOT = process.cwd()

function sha256(content) {
  return 'sha256:' + createHash('sha256').update(content).digest('hex')
}

function hashFile(path) {
  return sha256(readFileSync(path))
}

const manifest = JSON.parse(readFileSync(join(ROOT, 'registry/manifest.json'), 'utf8'))
let errors = 0

function flatten(m) {
  const out = []
  for (const [g, group] of Object.entries(m.groups)) {
    if (group.files) for (const f of group.files) out.push({ ...f, group: g })
    if (group.brandFiles) for (const f of group.brandFiles) out.push({ ...f, group: g, brand: f.brand })
    if (group.items) {
      for (const [i, item] of Object.entries(group.items)) {
        for (const f of item.files) out.push({ ...f, group: g, item: i })
        // Check component deps resolve
        for (const dep of item.deps.components) {
          if (!m.groups.components.items[dep]) {
            console.error(`✗ ${g}.items.${i}: depends on unknown component "${dep}"`)
            errors++
          }
        }
      }
    }
  }
  return out
}

for (const f of flatten(manifest)) {
  const abs = join(ROOT, f.src)
  if (!existsSync(abs)) {
    console.error(`✗ missing file on disk: ${f.src}`)
    errors++
    continue
  }
  const actual = hashFile(abs)
  if (actual !== f.hash) {
    console.error(`✗ hash mismatch: ${f.src}`)
    console.error(`    manifest: ${f.hash}`)
    console.error(`    disk:     ${actual}`)
    errors++
  }
}

if (errors > 0) {
  console.error(`\n${errors} error(s). Regenerate with 'pnpm run build:manifest'.`)
  process.exit(1)
}
console.log(`✓ manifest OK (${flatten(manifest).length} files)`)
