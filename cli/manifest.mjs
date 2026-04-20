// cli/manifest.mjs
// Manifest fetching, parsing, and shape validation.

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

export async function fetchManifest(ref, repo, options = {}) {
  const url = `https://raw.githubusercontent.com/${repo}/${ref}/registry/manifest.json`
  const text = await fetchText(url)
  const parsed = JSON.parse(text)
  validateManifest(parsed, options)
  return parsed
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
export function flattenManifest(manifest) {
  const out = []
  for (const [groupName, group] of Object.entries(manifest.groups)) {
    if (group.files) {
      for (const f of group.files) out.push({ ...f, group: groupName })
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
