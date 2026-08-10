// cli/add.mjs
// `klp-ui add <name> [<name>...]` planning logic.
// Filesystem ops live in cli/copy.mjs and are wired in cli/index.mjs.

import { readInventory, resolveTransitive, upgradeInventory, needsMetaRefresh } from './inventory.mjs'

/**
 * @param {{ rootDir: string, names: string[], force: boolean, catalog?: object[] }} input
 * @returns {{ inventory: object, toInstall: string[], alreadyInstalled: string[], unknown: string[] }}
 */
export function planAdd({ rootDir, names, force, catalog }) {
  let inv = readInventory(rootDir)
  // An inventory written by an older CLI — or by a v2 CLI against a manifest that carried no
  // component metadata — is refreshed in place from the catalog; statuses are preserved.
  if (catalog && (inv.schemaVersion !== 'v2' || needsMetaRefresh(inv, catalog))) {
    inv = upgradeInventory(inv, catalog)
  }

  const unknown = []
  const alreadyInstalled = []
  const wanted = []

  for (const name of names) {
    if (!inv.components[name]) { unknown.push(name); continue }
    if (inv.components[name].status === 'installed' && !force) {
      alreadyInstalled.push(name); continue
    }
    wanted.push(name)
  }

  const transitive = resolveTransitive(inv, wanted)
  const toInstall = transitive.filter((n) => force || inv.components[n].status !== 'installed')

  return { inventory: inv, toInstall, alreadyInstalled, unknown }
}
