// cli/diff.mjs
// Compute per-file diff status between (remote manifest, local lockfile, local disk).

import { readFile } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import { resolve } from 'node:path'
import { sha256 } from './hash.mjs'
import { flattenManifest } from './manifest.mjs'

/**
 * Status values:
 *   'new'               - in remote, not in lockfile
 *   'changed-upstream'  - remote≠lock, local==lock (safe override)
 *   'local-only'        - remote==lock, local≠lock (skip)
 *   'conflict'          - remote≠lock, local≠lock, local≠remote
 *   'already-applied'   - remote≠lock, local==remote (silent refresh lock)
 *   'unchanged'         - remote==lock, local==lock
 *   'removed-upstream'  - in lockfile, not in remote
 */

export async function computeDiff({ cwd, lockfile, remoteManifest }) {
  const remoteFiles = new Map()
  for (const f of flattenManifest(remoteManifest)) {
    remoteFiles.set(f.dst, f)
  }

  const lockFiles = new Map(Object.entries(lockfile.files ?? {}))

  const entries = []

  for (const [dst, rf] of remoteFiles) {
    const lock = lockFiles.get(dst)
    const abs = resolve(cwd, dst)
    const localHash = existsSync(abs) ? sha256(await readFile(abs)) : null

    let status
    if (!lock) {
      status = 'new'
    } else if (rf.hash === lock.hash) {
      status = localHash === lock.hash ? 'unchanged' : 'local-only'
    } else {
      if (localHash === null) {
        status = 'changed-upstream'
      } else if (localHash === lock.hash) {
        status = 'changed-upstream'
      } else if (localHash === rf.hash) {
        status = 'already-applied'
      } else {
        status = 'conflict'
      }
    }

    entries.push({ dst, src: rf.src, remoteHash: rf.hash, lockHash: lock?.hash ?? null, localHash, status, group: rf.group, item: rf.item })
  }

  for (const [dst, lock] of lockFiles) {
    if (!remoteFiles.has(dst)) {
      entries.push({ dst, src: null, remoteHash: null, lockHash: lock.hash, localHash: null, status: 'removed-upstream' })
    }
  }

  return entries
}

export function groupByStatus(entries) {
  const groups = {
    new: [],
    'changed-upstream': [],
    conflict: [],
    'removed-upstream': [],
    'local-only': [],
    'already-applied': [],
    unchanged: [],
  }
  for (const e of entries) groups[e.status].push(e)
  return groups
}
