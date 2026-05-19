// cli/detect-app.mjs
// Scan target repo for sub-projects whose package.json declares react.
// Returns relative paths from the root.

import { readdir, readFile } from 'node:fs/promises'
import { join, relative, sep } from 'node:path'

const IGNORE = new Set(['node_modules', '.git', 'dist', 'build', '.next', '.turbo', '.cache'])

async function walk(dir, out) {
  let entries
  try { entries = await readdir(dir, { withFileTypes: true }) } catch { return }
  for (const entry of entries) {
    if (entry.name.startsWith('.') && entry.name !== '.') continue
    if (IGNORE.has(entry.name)) continue
    const abs = join(dir, entry.name)
    if (entry.isDirectory()) await walk(abs, out)
    else if (entry.name === 'package.json') out.push(abs)
  }
}

/**
 * Scan `rootDir` for sub-projects whose `package.json` declares react.
 * Only sub-project paths are returned; `rootDir` itself is never included
 * — `klep-ds-init` consumes this to find the sub-app to patch, and patching
 * the consumer's repo-root package.json is out of scope.
 *
 * @returns {Promise<{ matches: string[] }>}
 */
export async function detectReactApp(rootDir) {
  const found = []
  await walk(rootDir, found)
  const matches = []
  for (const pkgPath of found) {
    let pkg
    try { pkg = JSON.parse(await readFile(pkgPath, 'utf8')) } catch { continue }
    const deps = { ...(pkg.dependencies ?? {}), ...(pkg.devDependencies ?? {}) }
    if (deps.react) {
      const rel = relative(rootDir, pkgPath).split(sep).slice(0, -1).join('/')
      // empty rel == package.json sits at rootDir; skip per JSDoc contract above
      if (rel) matches.push(rel)
    }
  }
  return { matches }
}
