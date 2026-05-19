// cli/inventory.mjs
// Inventory state: which components are installed vs available.
// Lives at <consumer-root>/klp-inventory.json; maintained by klep-ds-init + klp-ui add.

import { readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'

const FILE = 'klp-inventory.json'
const SCHEMA = 'v1'

export function createInventory({ ref, brand, appDir, dsDir, catalog, initiallyInstalled = [] }) {
  const installed = new Set(initiallyInstalled)
  const components = {}
  for (const e of catalog) {
    components[e.name] = {
      status: installed.has(e.name) ? 'installed' : 'available',
      category: e.category,
      deps: e.deps ?? [],
    }
  }
  return { schemaVersion: SCHEMA, ref, brand, appDir, dsDir, components }
}

export function inventoryPath(rootDir) { return join(rootDir, FILE) }
export function readInventory(rootDir) { return JSON.parse(readFileSync(inventoryPath(rootDir), 'utf8')) }
export function writeInventory(rootDir, inv) {
  writeFileSync(inventoryPath(rootDir), JSON.stringify(inv, null, 2) + '\n')
}

export function markInstalled(inv, names) {
  const next = JSON.parse(JSON.stringify(inv))
  for (const name of names) if (next.components[name]) next.components[name].status = 'installed'
  return next
}

export function listByStatus(inv, status) {
  return Object.entries(inv.components).filter(([, v]) => v.status === status).map(([k]) => k)
}

export function resolveTransitive(inv, names) {
  const out = new Set(names)
  let changed = true
  while (changed) {
    changed = false
    for (const n of Array.from(out)) {
      const e = inv.components[n]
      if (!e) continue
      for (const d of e.deps) if (!out.has(d)) { out.add(d); changed = true }
    }
  }
  return Array.from(out)
}
