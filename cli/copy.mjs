// cli/copy.mjs
// Shared file-copy helpers used by klep-ds-init and klp-ui add.

import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { join, dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { rewriteImports } from './rewrite.mjs'
import { fetchBuffer } from './fetch.mjs'

const SELF_DIR = dirname(fileURLToPath(import.meta.url))
const REPO_ROOT = resolve(SELF_DIR, '..')
const GITHUB_REPO = 'BaptisteMo/klp-design-system'

export async function loadFile(ref, srcPath) {
  if (ref === 'local') return readFile(join(REPO_ROOT, srcPath))
  const url = `https://raw.githubusercontent.com/${GITHUB_REPO}/${ref}/${srcPath}`
  return fetchBuffer(url)
}

export async function writeFileTo(absDst, contents) {
  await mkdir(dirname(absDst), { recursive: true })
  await writeFile(absDst, contents)
}

function applyTransforms(content, dst, opts) {
  let out = content
  if (opts.mode) {
    out = Buffer.from(rewriteImports(out.toString('utf8'), dst, { mode: opts.mode }))
  }
  if (opts.interpolate) {
    let s = out.toString('utf8')
    for (const [k, v] of Object.entries(opts.interpolate)) s = s.replaceAll(`{{${k}}}`, v)
    out = Buffer.from(s)
  }
  return out
}

export async function copyGroup(manifest, groupName, dstRoot, opts = {}) {
  const group = manifest.groups[groupName]
  if (!group) throw new Error(`Manifest missing group: ${groupName}`)
  for (const f of group.files) {
    const raw = await loadFile(opts.ref ?? 'main', f.src)
    const transformed = applyTransforms(raw, f.dst, opts)
    await writeFileTo(join(dstRoot, f.dst), transformed)
  }
}

export async function copyComponent(manifest, name, dsRoot, opts = {}) {
  const item = manifest.groups.components.items[name]
  if (!item) throw new Error(`Unknown component: ${name}`)
  for (const f of item.files) {
    const raw = await loadFile(opts.ref ?? 'main', f.src)
    // In attach mode the destination mirrors the DS repo layout (no ui/ segment),
    // so use f.src — manifest's f.dst is fresh-init shape (src/components/ui/<n>/...).
    const transformed = applyTransforms(raw, f.src, { ...opts, mode: 'attach' })
    await writeFileTo(join(dsRoot, f.src), transformed)
  }
}

export async function copyDocOfComponent(manifest, name, docsRoot, opts = {}) {
  const docs = manifest.groups.docs?.files ?? []
  const docFile = docs.find((f) => f.dst === `docs/components/_index_${name}.md`)
  if (!docFile) return
  const raw = await loadFile(opts.ref ?? 'main', docFile.src)
  const rel = docFile.dst.replace(/^docs\//, '')
  await writeFileTo(join(docsRoot, rel), raw)
}

export async function copyInstalledDocs(manifest, installedNames, brand, dstRoot, opts = {}) {
  const docs = manifest.groups.docs
  if (!docs) return
  const wantedRoot = new Set(['docs/agent-brief.md', 'docs/index.md', 'docs/overview.md'])
  const wantedBrand = `docs/brands/${brand}.md`

  for (const f of docs.files ?? []) {
    const compMatch = /^docs\/components\/_index_([a-z0-9-]+)\.md$/.exec(f.dst)
    const isToken = f.dst.startsWith('docs/tokens/')
    const keep =
      (compMatch && installedNames.includes(compMatch[1])) ||
      wantedRoot.has(f.dst) ||
      isToken
    if (!keep) continue
    const raw = await loadFile(opts.ref ?? 'main', f.src)
    const rel = f.dst.replace(/^docs\//, '')
    await writeFileTo(join(dstRoot, rel), raw)
  }

  for (const bf of docs.brandFiles ?? []) {
    if (bf.dst !== wantedBrand) continue
    const raw = await loadFile(opts.ref ?? 'main', bf.src)
    const rel = bf.dst.replace(/^docs\//, '')
    await writeFileTo(join(dstRoot, rel), raw)
  }
}
