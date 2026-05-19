// cli/add.mjs
// `klp-ui add <name> [<name>...]` planning logic.
// Filesystem ops live in cli/copy.mjs and are wired in cli/index.mjs.

import { readInventory, resolveTransitive } from './inventory.mjs'

/**
 * @param {{ rootDir: string, names: string[], force: boolean }} input
 * @returns {{ inventory: object, toInstall: string[], alreadyInstalled: string[], unknown: string[] }}
 */
export function planAdd({ rootDir, names, force }) {
  const inv = readInventory(rootDir)
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
