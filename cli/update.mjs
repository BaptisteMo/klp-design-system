// cli/update.mjs
// `klp-ui update` — pull remote DS changes interactively.

import { readFile, writeFile, mkdir, unlink } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import pc from 'picocolors'
import { fetchManifest, collectNpmDeps } from './manifest.mjs'
import { fetchBuffer } from './fetch.mjs'
import { sha256 } from './hash.mjs'
import { rewriteImports } from './rewrite.mjs'
import { computeDiff, groupByStatus } from './diff.mjs'
import { askMultiselect } from './prompts.mjs'

const REPO = 'BaptisteMo/klp-design-system'

function parseArgs(rest) {
  const out = { ref: 'main', dryRun: false, verbose: false, force: false }
  for (const arg of rest) {
    if (arg.startsWith('--ref=')) out.ref = arg.slice(6)
    else if (arg === '--dry-run') out.dryRun = true
    else if (arg === '--verbose') out.verbose = true
    else if (arg === '--force') out.force = true
  }
  return out
}

export async function run(rest) {
  const args = parseArgs(rest)
  const cwd = process.cwd()
  const lockPath = resolve(cwd, 'klp.lock.json')

  if (!existsSync(lockPath)) {
    console.error(pc.red('Missing klp.lock.json in current directory. Run `klp-ui init` first.'))
    process.exit(1)
  }

  const lockfile = JSON.parse(await readFile(lockPath, 'utf8'))

  console.log(pc.cyan(`→ fetching manifest from ${args.ref}`))
  const manifest = await fetchManifest(args.ref, REPO, { force: args.force })

  const entries = await computeDiff({ cwd, lockfile, remoteManifest: manifest })
  const grouped = groupByStatus(entries)

  const countLine = (label, color, arr, note = '') => {
    if (arr.length === 0) return
    console.log(`  ${color(label.padEnd(20))} ${arr.length} files${note ? pc.gray(' ' + note) : ''}`)
  }

  console.log(pc.bold('\nChanges detected:'))
  countLine('NEW', pc.green, grouped['new'])
  countLine('CHANGED', pc.yellow, grouped['changed-upstream'], '(safe override)')
  countLine('CONFLICT', pc.red, grouped['conflict'], '(both changed)')
  countLine('REMOVED', pc.magenta, grouped['removed-upstream'])
  countLine('LOCAL-ONLY', pc.gray, grouped['local-only'])
  countLine('ALREADY-APPLIED', pc.gray, grouped['already-applied'])
  countLine('UNCHANGED', pc.gray, grouped['unchanged'])

  const actionable = [
    ...grouped['new'],
    ...grouped['changed-upstream'],
    ...grouped['conflict'],
    ...grouped['removed-upstream'],
  ].filter((e) => e.group !== 'scaffold')

  if (actionable.length === 0) {
    console.log(pc.green('\n✓ Up to date.'))
    return
  }

  if (args.dryRun) {
    console.log(pc.gray('\n(dry-run — nothing applied)'))
    return
  }

  const choices = actionable.map((e) => {
    const badge =
      e.status === 'new' ? pc.green('[NEW]     ') :
      e.status === 'changed-upstream' ? pc.yellow('[CHANGED] ') :
      e.status === 'conflict' ? pc.red('[CONFLICT]') :
      pc.magenta('[REMOVED] ')
    return {
      title: `${badge} ${e.dst}`,
      value: e,
      selected: e.status === 'new' || e.status === 'changed-upstream',
    }
  })

  const selected = await askMultiselect('files', 'Pick files to apply', choices)
  if (!selected || selected.length === 0) {
    console.log(pc.gray('No selection. Done.'))
    return
  }

  console.log(pc.cyan(`\n→ applying ${selected.length} changes`))
  const newLockFiles = { ...lockfile.files }

  // Silent refresh: entries already in sync with remote (user manually applied before update).
  for (const e of grouped['already-applied']) {
    newLockFiles[e.dst] = { hash: e.remoteHash, source: e.item ?? e.group ?? 'unknown' }
  }

  for (const e of selected) {
    if (e.status === 'removed-upstream') {
      const abs = resolve(cwd, e.dst)
      if (existsSync(abs)) await unlink(abs)
      delete newLockFiles[e.dst]
      console.log(pc.magenta(`  − ${e.dst}`))
      continue
    }
    const url = `https://raw.githubusercontent.com/${REPO}/${args.ref}/${e.src}`
    const buf = await fetchBuffer(url)
    if (sha256(buf) !== e.remoteHash) {
      throw new Error(`Integrity mismatch for ${e.src}`)
    }
    let content = buf
    if (/\.(ts|tsx)$/.test(e.dst)) {
      content = Buffer.from(rewriteImports(buf.toString('utf8'), e.dst), 'utf8')
    }
    const abs = resolve(cwd, e.dst)
    await mkdir(dirname(abs), { recursive: true })
    await writeFile(abs, content)
    newLockFiles[e.dst] = { hash: sha256(content), source: e.item ?? e.group ?? 'unknown' }
    const sign = e.status === 'new' ? '+' : '~'
    console.log(pc.gray(`  ${sign} ${e.dst}`))
  }

  const newLock = {
    ...lockfile,
    manifestVersion: manifest.version,
    ref: args.ref,
    files: newLockFiles,
  }
  await writeFile(lockPath, JSON.stringify(newLock, null, 2) + '\n')
  console.log(pc.green('✓ klp.lock.json updated'))

  // Deps reconcile
  const newDeps = collectNpmDeps(manifest)
  const pkgJsonPath = resolve(cwd, 'package.json')
  if (existsSync(pkgJsonPath)) {
    const pkgJson = JSON.parse(await readFile(pkgJsonPath, 'utf8'))
    const currentDeps = new Set(Object.keys(pkgJson.dependencies ?? {}))
    const missing = newDeps.filter((d) => !currentDeps.has(d))
    if (missing.length > 0) {
      console.log(pc.yellow(`\n! New npm deps detected: ${missing.join(', ')}`))
      console.log(pc.gray(`  Run your package manager's add command manually.`))
    }
  }

  console.log(pc.green(`\n✓ Update complete. Run 'git diff' to review.`))
}
