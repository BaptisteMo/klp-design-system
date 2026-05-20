// cli/list.mjs
// `klp-ui list` — print inventory grouped by status.

import { readInventory, listByStatus } from './inventory.mjs'

export function runList({ rootDir, json }) {
  const inv = readInventory(rootDir)
  if (json) return JSON.stringify(inv, null, 2)

  const installed = listByStatus(inv, 'installed').sort()
  const available = listByStatus(inv, 'available').sort()
  const lines = [
    `klp-ui inventory — brand=${inv.brand} ref=${inv.ref}`,
    '',
    `installed (${installed.length}):`,
    ...installed.map((n) => `  ${n}  [${inv.components[n].category}]`),
    '',
    `available (${available.length}):`,
    ...available.map((n) => `  ${n}  [${inv.components[n].category}]`),
  ]
  return lines.join('\n')
}
