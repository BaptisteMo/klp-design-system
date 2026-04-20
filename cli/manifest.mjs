// cli/manifest.mjs
// Manifest fetching, parsing, and shape validation.

import { readFileSync, writeFileSync, mkdirSync, existsSync, statSync } from 'node:fs'
import { createHash } from 'node:crypto'
import { homedir } from 'node:os'
import { join } from 'node:path'
import { fetchText } from './fetch.mjs'

export const MANIFEST_SCHEMA_VERSION = '0.1.0'

/**
 * @typedef {Object} ManifestFile
 * @property {string} src
 * @property {string} dst
 * @property {string} hash
 * @property {boolean} [template]
 *
 * @typedef {Object} ManifestComponent
 * @property {ManifestFile[]} files
 * @property {{ npm: string[], components: string[] }} deps
 *
 * @typedef {Object} Manifest
 * @property {string} version
 * @property {string} generatedAt
 * @property {string} ref
 * @property {string[]} brands
 * @property {Object} groups
 */

const CACHE_DIR = join(homedir(), '.klp', 'cache')
const CACHE_TTL_MS = 5 * 60 * 1000

function cachePath(repo, ref) {
  const key = createHash('sha256').update(`${repo}:${ref}`).digest('hex').slice(0, 16)
  return join(CACHE_DIR, `manifest-${key}.json`)
}

function readCache(repo, ref) {
  const p = cachePath(repo, ref)
  if (!existsSync(p)) return null
  try {
    const stat = statSync(p)
    const age = Date.now() - stat.mtimeMs
    const fresh = age < CACHE_TTL_MS
    return { text: readFileSync(p, 'utf8'), fresh, age }
  } catch {
    return null
  }
}

function writeCache(repo, ref, text) {
  try {
    mkdirSync(CACHE_DIR, { recursive: true })
    writeFileSync(cachePath(repo, ref), text)
  } catch {
    // best-effort — do not fail on cache write errors
  }
}

export async function fetchManifest(ref, repo, options = {}) {
  const cached = readCache(repo, ref)
  if (cached?.fresh) {
    const parsed = JSON.parse(cached.text)
    validateManifest(parsed, options)
    return parsed
  }
  const url = `https://raw.githubusercontent.com/${repo}/${ref}/registry/manifest.json`
  try {
    const text = await fetchText(url)
    writeCache(repo, ref, text)
    const parsed = JSON.parse(text)
    validateManifest(parsed, options)
    return parsed
  } catch (err) {
    if (cached) {
      console.error(`! network failed, falling back to cache (${Math.round(cached.age / 1000)}s old)`)
      const parsed = JSON.parse(cached.text)
      validateManifest(parsed, options)
      return parsed
    }
    throw err
  }
}

export function validateManifest(manifest, options = {}) {
  if (!manifest || typeof manifest !== 'object') {
    throw new Error('Manifest must be an object')
  }
  if (typeof manifest.version !== 'string') {
    throw new Error('Manifest.version missing')
  }
  if (manifest.version !== MANIFEST_SCHEMA_VERSION) {
    const msg = `Manifest schema version mismatch: got ${manifest.version}, expected ${MANIFEST_SCHEMA_VERSION}`
    if (options.force) {
      console.error(`! ${msg} (proceeding because --force)`)
    } else {
      throw new Error(`${msg}. Re-run with --force to proceed.`)
    }
  }
  if (!Array.isArray(manifest.brands) || manifest.brands.length === 0) {
    throw new Error('Manifest.brands missing or empty')
  }
  if (!manifest.groups || typeof manifest.groups !== 'object') {
    throw new Error('Manifest.groups missing')
  }
  for (const [groupName, group] of Object.entries(manifest.groups)) {
    if (group.files) {
      for (const f of group.files) validateFile(f, `groups.${groupName}.files`)
    }
    if (group.brandFiles) {
      for (const f of group.brandFiles) {
        validateFile(f, `groups.${groupName}.brandFiles`)
        if (typeof f.brand !== 'string' || !f.brand) {
          throw new Error(`groups.${groupName}.brandFiles: missing brand for ${f.src}`)
        }
      }
    }
    if (group.items) {
      for (const [itemName, item] of Object.entries(group.items)) {
        for (const f of item.files) validateFile(f, `groups.${groupName}.items.${itemName}.files`)
      }
    }
  }
}

function validateFile(f, ctx) {
  if (typeof f.src !== 'string') throw new Error(`${ctx}: missing src`)
  if (typeof f.dst !== 'string') throw new Error(`${ctx}: missing dst`)
  if (typeof f.hash !== 'string' || !f.hash.startsWith('sha256:')) {
    throw new Error(`${ctx}: invalid hash for ${f.src}`)
  }
}

/**
 * Returns a flat array of all files in manifest order, across all groups and items.
 * Each entry carries its group name + (if item-based) item name.
 */
export function flattenManifest(manifest, options = {}) {
  const selectedBrand = options.brand ?? null
  const out = []
  for (const [groupName, group] of Object.entries(manifest.groups)) {
    if (group.files) {
      for (const f of group.files) out.push({ ...f, group: groupName })
    }
    if (group.brandFiles) {
      for (const f of group.brandFiles) {
        if (selectedBrand && f.brand !== selectedBrand) continue
        out.push({ ...f, group: groupName })
      }
    }
    if (group.items) {
      for (const [itemName, item] of Object.entries(group.items)) {
        for (const f of item.files) out.push({ ...f, group: groupName, item: itemName })
      }
    }
  }
  return out
}

/**
 * Aggregate npm deps across all installed components.
 * @param {Manifest} manifest
 * @returns {string[]} sorted unique package names
 */
export function collectNpmDeps(manifest) {
  const set = new Set()
  const components = manifest.groups.components?.items ?? {}
  for (const item of Object.values(components)) {
    for (const pkg of item.deps?.npm ?? []) set.add(pkg)
  }
  return [...set].sort()
}
