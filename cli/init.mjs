// cli/init.mjs
// `klp-ui init` — scaffolds a fresh project and copies DS files.

import { readFile, writeFile, mkdir, readdir } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, resolve, join } from 'node:path'
import { spawnSync } from 'node:child_process'
import pc from 'picocolors'
import { fetchManifest, flattenManifest, collectNpmDeps } from './manifest.mjs'
import { fetchBuffer } from './fetch.mjs'
import { sha256 } from './hash.mjs'
import { rewriteImports } from './rewrite.mjs'
import { askText, askSelect, askConfirm } from './prompts.mjs'

const __dirname = dirname(fileURLToPath(import.meta.url))
const SCAFFOLD_DIR = resolve(__dirname, 'scaffold')
const REPO = 'BaptisteMo/klp-design-system'

const BASELINE_DEPS = {
  react: '^19.0.0',
  'react-dom': '^19.0.0',
  clsx: '^2.1.1',
  'tailwind-merge': '^2.5.4',
}

const DEP_VERSIONS = {
  '@radix-ui/react-checkbox': '^1.3.3',
  '@radix-ui/react-popover': '^1.1.15',
  '@radix-ui/react-radio-group': '^1.3.8',
  '@radix-ui/react-slot': '^1.2.4',
  '@radix-ui/react-switch': '^1.2.6',
  '@radix-ui/react-tabs': '^1.1.13',
  '@radix-ui/react-tooltip': '^1.2.8',
  '@tanstack/react-table': '^8.21.3',
  'class-variance-authority': '^0.7.1',
  'lucide-react': '^1.8.0',
  '@fontsource/inter': '^5.2.8',
}

function parseArgs(rest) {
  const out = { projectName: null, brand: null, pm: null, install: true, git: true, ref: 'main', verbose: false, force: false }
  for (const arg of rest) {
    if (arg.startsWith('--brand=')) out.brand = arg.slice(8)
    else if (arg.startsWith('--pm=')) out.pm = arg.slice(5)
    else if (arg === '--no-install') out.install = false
    else if (arg === '--no-git') out.git = false
    else if (arg.startsWith('--ref=')) out.ref = arg.slice(6)
    else if (arg === '--verbose') out.verbose = true
    else if (arg === '--force') out.force = true
    else if (!arg.startsWith('--') && !out.projectName) out.projectName = arg
  }
  return out
}

export async function run(rest) {
  const args = parseArgs(rest)

  const projectName = args.projectName ?? (await askText('projectName', 'Project name', 'klp-app'))
  const brand = args.brand ?? (await askSelect('brand', 'Brand', [
    { title: 'wireframe', value: 'wireframe' },
    { title: 'klub', value: 'klub' },
    { title: 'atlas', value: 'atlas' },
    { title: 'showup', value: 'showup' },
  ]))
  const pm = args.pm ?? (await askSelect('pm', 'Package manager', [
    { title: 'pnpm', value: 'pnpm' },
    { title: 'npm', value: 'npm' },
    { title: 'yarn', value: 'yarn' },
    { title: 'bun', value: 'bun' },
  ]))

  validateBrand(brand)

  const cwd = resolve(process.cwd(), projectName)
  if (existsSync(cwd)) {
    const entries = await readdir(cwd).catch(() => [])
    if (entries.length > 0) {
      const ok = await askConfirm('ok', `Directory "${projectName}" exists and is non-empty. Overwrite?`, false)
      if (!ok) { console.log('Aborted.'); process.exit(1) }
    }
  }
  await mkdir(cwd, { recursive: true })

  console.log(pc.cyan(`\n→ fetching manifest from ${args.ref}`))
  const manifest = await fetchManifest(args.ref, REPO, { force: args.force })
  const files = flattenManifest(manifest, { brand })
  console.log(pc.gray(`  manifest v${manifest.version}, ${files.length} files`))

  const npmDeps = resolveNpmDeps(manifest)

  const writtenPaths = []

  try {
    console.log(pc.cyan(`→ writing scaffold templates`))
    await writeScaffoldFiles({ cwd, manifest, projectName, brand, npmDeps, verbose: args.verbose, writtenPaths })

    console.log(pc.cyan(`→ fetching ${files.length} DS files`))
    const lockFiles = {}
    let i = 0
    for (const f of files) {
      i++
      const status = args.verbose ? '' : `\r[${i}/${files.length}] `
      process.stdout.write(status + pc.gray(f.dst))
      if (args.verbose) process.stdout.write('\n')

      if (f.group === 'scaffold') {
        // scaffold group files already written above; record manifest (raw template) hash
        lockFiles[f.dst] = { hash: f.hash, source: f.group }
        continue
      }

      const url = `https://raw.githubusercontent.com/${REPO}/${args.ref}/${f.src}`
      const buf = await fetchBuffer(url)

      // integrity check
      if (sha256(buf) !== f.hash) {
        throw new Error(`Integrity mismatch for ${f.src}`)
      }

      // apply rewrite for .ts/.tsx
      let content = buf
      if (/\.(ts|tsx)$/.test(f.dst)) {
        content = Buffer.from(rewriteImports(buf.toString('utf8'), f.dst), 'utf8')
      }

      const absDst = resolve(cwd, f.dst)
      await mkdir(dirname(absDst), { recursive: true })
      writtenPaths.push(absDst)
      await writeFile(absDst, content)

      lockFiles[f.dst] = {
        hash: f.hash,
        source: f.item ?? f.group,
      }
    }
    process.stdout.write('\n')

    const lockfile = {
      manifestVersion: manifest.version,
      ref: args.ref,
      brand,
      installedAt: new Date().toISOString(),
      files: lockFiles,
    }
    const lockPath = resolve(cwd, 'klp.lock.json')
    writtenPaths.push(lockPath)
    await writeFile(lockPath, JSON.stringify(lockfile, null, 2) + '\n')
    console.log(pc.green(`✓ wrote klp.lock.json`))
  } catch (err) {
    console.error(pc.red(`\n✗ init failed: ${err.message}`))
    console.error(pc.gray('  rolling back written files…'))
    const { unlink } = await import('node:fs/promises')
    for (const p of writtenPaths.reverse()) {
      try { await unlink(p) } catch {}
    }
    process.exit(2)
  }

  if (args.install) {
    console.log(pc.cyan(`→ installing deps with ${pm}`))
    const res = spawnSync(pm, ['install'], { cwd, stdio: 'inherit' })
    if (res.status !== 0) {
      console.error(pc.yellow(`! ${pm} install failed — run "${pm} install" in ${projectName} manually`))
    }
  }

  if (args.git) {
    console.log(pc.cyan(`→ git init + initial commit`))
    spawnSync('git', ['init', '--initial-branch=main'], { cwd, stdio: 'ignore' })
    spawnSync('git', ['add', '.'], { cwd, stdio: 'ignore' })
    spawnSync('git', ['commit', '-m', `chore: init klp-ui project (brand: ${brand})`], { cwd, stdio: 'ignore' })
  }

  console.log(pc.green(`\n✓ Project "${projectName}" ready (brand: ${brand}).`))
  console.log(pc.gray(`\n  cd ${projectName}`))
  console.log(pc.gray(`  ${pm} dev\n`))
}

function validateBrand(brand) {
  const valid = ['wireframe', 'klub', 'atlas', 'showup']
  if (!valid.includes(brand)) {
    console.error(`Invalid brand "${brand}". Valid: ${valid.join(', ')}`)
    process.exit(3)
  }
}

function resolveNpmDeps(manifest) {
  const components = collectNpmDeps(manifest)
  const all = { ...BASELINE_DEPS }
  for (const pkg of components) {
    all[pkg] = DEP_VERSIONS[pkg] ?? 'latest'
  }
  return all
}

function formatNpmDepsJson(deps) {
  const entries = Object.entries(deps).sort(([a], [b]) => a.localeCompare(b))
  return entries.map(([name, ver], i) => {
    const comma = i < entries.length - 1 ? ',' : ''
    return `    "${name}": "${ver}"${comma}`
  }).join('\n')
}

async function writeScaffoldFiles({ cwd, manifest, projectName, brand, npmDeps, verbose, writtenPaths }) {
  const scaffoldFiles = manifest.groups.scaffold?.files ?? []
  if (scaffoldFiles.length === 0) {
    throw new Error('manifest.groups.scaffold.files is empty — cannot initialize project')
  }
  const npmDepsJson = formatNpmDepsJson(npmDeps)

  for (const f of scaffoldFiles) {
    const relToScaffold = f.src.replace(/^cli\/scaffold\//, '')
    const srcPath = join(SCAFFOLD_DIR, relToScaffold)
    const raw = await readFile(srcPath, 'utf8')
    const rendered = f.template
      ? raw
          .replace(/\{\{projectName\}\}/g, projectName)
          .replace(/\{\{brand\}\}/g, brand)
          .replace(/\{\{npmDeps\}\}/g, npmDepsJson)
      : raw
    const absDst = resolve(cwd, f.dst)
    await mkdir(dirname(absDst), { recursive: true })
    writtenPaths.push(absDst)
    await writeFile(absDst, rendered)
    if (verbose) console.log(pc.gray(`  ${f.dst}`))
  }
}
