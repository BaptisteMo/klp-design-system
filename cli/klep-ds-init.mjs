#!/usr/bin/env node
// cli/klep-ds-init.mjs
// Install klp-design-system into an existing project.

import { readFileSync, writeFileSync, existsSync } from 'node:fs'
import { join, relative, dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { createInterface } from 'node:readline/promises'
import { spawnSync } from 'node:child_process'

import { detectReactApp } from './detect-app.mjs'
import { patchTsconfig, patchViteConfig } from './patch-config.mjs'
import { createInventory, writeInventory, writeInventoryMd, resolveTransitive } from './inventory.mjs'
import { copyGroup, copyComponent, copyInstalledDocs } from './copy.mjs'

const SELF_DIR = dirname(fileURLToPath(import.meta.url))
const REPO_ROOT = resolve(SELF_DIR, '..')
const REPO = 'BaptisteMo/klp-design-system'

const HELP = `Usage: klep-ds-init [options]

Install klp-design-system into an existing project.

Options:
  --app-dir=<rel>      Sub-app directory (auto-detected if omitted)
  --brand=<name>       Brand: wireframe (default) | klub | atlas | showup
  --all                Install all components (skips picker)
  --minimal            Install only tokens+lib (skips picker)
  --components=<csv>   Install named components (skips picker)
  --no-config-patch    Skip tsconfig/vite alias injection
  --no-install         Skip auto pnpm install in the DS dir
  --pm=<pnpm|npm|yarn|bun>  Package manager for the install (default: pnpm)
  --ref=<ref>          Git ref to install from (default: main)
  --force              Overwrite existing klp.lock.json
  --verbose            Print extra detail
  --help               Show this message
`

function parseFlags(argv) {
  const out = { _: [] }
  for (const a of argv) {
    if (a === '--help') out.help = true
    else if (a === '--all') out.all = true
    else if (a === '--minimal') out.minimal = true
    else if (a === '--force') out.force = true
    else if (a === '--no-config-patch') out.noConfigPatch = true
    else if (a === '--no-install') out.noInstall = true
    else if (a.startsWith('--pm=')) out.pm = a.slice(5)
    else if (a === '--verbose') out.verbose = true
    else if (a.startsWith('--app-dir=')) out.appDir = a.slice(10)
    else if (a.startsWith('--brand=')) out.brand = a.slice(8)
    else if (a.startsWith('--components=')) out.components = a.slice(13).split(',').filter(Boolean)
    else if (a.startsWith('--ref=')) out.ref = a.slice(6)
    else out._.push(a)
  }
  return out
}

async function prompt(rl, q) { return (await rl.question(q)).trim() }

async function chooseAppDir(rootDir, flag) {
  if (flag) return flag
  const { matches } = await detectReactApp(rootDir)
  if (matches.length === 1) return matches[0]
  if (matches.length === 0) {
    console.warn('! No React sub-app found — appDir left unset. Config patch (tsconfig/vite alias) skipped.')
    console.warn('  Re-run with --app-dir=<rel> once the app exists, or patch the alias manually.')
    return null
  }

  const rl = createInterface({ input: process.stdin, output: process.stdout })
  try {
    console.log('Multiple React sub-apps detected:')
    matches.forEach((m, i) => console.log(`  [${i + 1}] ${m}`))
    const ans = await prompt(rl, `Choose (1-${matches.length}): `)
    const idx = Number(ans) - 1
    if (!Number.isInteger(idx) || idx < 0 || idx >= matches.length) throw new Error(`Invalid choice: ${ans}`)
    return matches[idx]
  } finally { rl.close() }
}

async function chooseScope(catalog, flags) {
  if (flags.all) return catalog.map((c) => c.name)
  if (flags.minimal) return []
  if (flags.components) return flags.components

  const rl = createInterface({ input: process.stdin, output: process.stdout })
  try {
    console.log(`\n${catalog.length} components available:`)
    const byCat = {}
    for (const c of catalog) (byCat[c.category] ??= []).push(c.name)
    for (const [cat, names] of Object.entries(byCat)) console.log(`  [${cat}] ${names.join(', ')}`)
    console.log('\nScope: [a]ll  [m]inimal  [s]elect')
    const ans = (await prompt(rl, 'Choice: ')).toLowerCase()
    if (ans === 'a') return catalog.map((c) => c.name)
    if (ans === 'm') return []
    if (ans === 's') {
      const list = await prompt(rl, 'Comma-separated names: ')
      return list.split(',').map((s) => s.trim()).filter(Boolean)
    }
    throw new Error(`Invalid choice: ${ans}`)
  } finally { rl.close() }
}

async function chooseBrand(flag) {
  if (flag) return flag
  const rl = createInterface({ input: process.stdin, output: process.stdout })
  try {
    const ans = (await prompt(rl, 'Brand [wireframe/klub/atlas/showup] (default wireframe): ')).toLowerCase()
    if (!ans) return 'wireframe'
    if (!['wireframe', 'klub', 'atlas', 'showup'].includes(ans)) throw new Error(`Unknown brand: ${ans}`)
    return ans
  } finally { rl.close() }
}

async function loadManifest(ref) {
  if (ref === 'local') {
    return JSON.parse(readFileSync(join(REPO_ROOT, 'registry/manifest.json'), 'utf8'))
  }
  const { fetchText } = await import('./fetch.mjs')
  const url = `https://raw.githubusercontent.com/BaptisteMo/klp-design-system/${ref}/registry/manifest.json`
  return JSON.parse(await fetchText(url))
}

// Runtime deps shipped by lib/ + components — same versions as the DS repo root.
const RUNTIME_DEPS = {
  '@radix-ui/react-slot': '^1.1.0',
  'class-variance-authority': '^0.7.0',
  'clsx': '^2.1.1',
  'lucide-react': '^0.469.0',
  'tailwind-merge': '^2.5.5',
}

function collectComponentNpmDeps(manifest, installedNames) {
  const deps = {}
  const items = manifest.groups.components.items ?? {}
  for (const name of installedNames) {
    const item = items[name]
    if (!item) continue
    for (const d of item.deps?.npm ?? []) {
      if (!deps[d]) deps[d] = '*'
    }
  }
  return deps
}

function detectPackageManager(rootDir) {
  if (existsSync(join(rootDir, 'pnpm-lock.yaml'))) return 'pnpm'
  if (existsSync(join(rootDir, 'yarn.lock'))) return 'yarn'
  if (existsSync(join(rootDir, 'bun.lockb'))) return 'bun'
  if (existsSync(join(rootDir, 'package-lock.json'))) return 'npm'
  return 'pnpm'
}

function runInstall(dsRoot, pm, verbose) {
  const cmd = pm
  const args = ['install']
  if (verbose) console.log(`Running: ${cmd} ${args.join(' ')} (in ${dsRoot})`)
  const result = spawnSync(cmd, args, {
    cwd: dsRoot,
    stdio: verbose ? 'inherit' : 'pipe',
    encoding: 'utf8',
  })
  if (result.status !== 0) {
    console.warn(`! ${cmd} install failed (exit ${result.status}). Stderr:`)
    if (result.stderr) console.warn(result.stderr.slice(0, 800))
    console.warn(`  Run "${cmd} install" manually inside ${dsRoot}`)
    return false
  }
  return true
}

function writeDsTsconfig(dsRoot) {
  const tsconfig = {
    compilerOptions: {
      target: 'ES2020',
      lib: ['ES2020', 'DOM', 'DOM.Iterable'],
      module: 'ESNext',
      moduleResolution: 'Bundler',
      jsx: 'react-jsx',
      strict: true,
      esModuleInterop: true,
      allowSyntheticDefaultImports: true,
      skipLibCheck: true,
      isolatedModules: true,
      noEmit: true,
      resolveJsonModule: true,
      paths: { '@klp/*': ['./src/*'] },
    },
    include: ['src/**/*'],
  }
  writeFileSync(join(dsRoot, 'tsconfig.json'), JSON.stringify(tsconfig, null, 2) + '\n')
}

function writeDsPackageJson(dsRoot, manifest, installedNames) {
  const componentDeps = collectComponentNpmDeps(manifest, installedNames)
  // RUNTIME_DEPS pin known-good versions; componentDeps only contributes deps
  // not already pinned (e.g. unusual Radix sub-packages from new components).
  const merged = { ...componentDeps, ...RUNTIME_DEPS }
  const pkg = {
    name: '@klp/ui-vendored',
    private: true,
    version: '0.0.0',
    description: 'Vendored klp-design-system source. Installed by klep-ds-init.',
    dependencies: Object.fromEntries(Object.entries(merged).sort()),
    peerDependencies: {
      react: '^18 || ^19',
      'react-dom': '^18 || ^19',
    },
  }
  writeFileSync(join(dsRoot, 'package.json'), JSON.stringify(pkg, null, 2) + '\n')
}

function writeLockfile(rootDir, manifest, installedNames, ref, brand) {
  const lock = {
    manifestVersion: manifest.version ?? '1',
    ref, brand,
    installedAt: new Date().toISOString(),
    files: {},
  }
  const installedSet = new Set(installedNames)
  for (const [groupName, group] of Object.entries(manifest.groups)) {
    if (groupName === 'components') {
      const items = group.items ?? {}
      for (const [name, item] of Object.entries(items)) {
        if (!installedSet.has(name)) continue
        for (const f of item.files) lock.files[f.dst] = { hash: f.hash, source: f.src, component: name }
      }
    } else if (group.files) {
      for (const f of group.files) lock.files[f.dst] = { hash: f.hash, source: f.src, group: groupName }
    }
  }
  writeFileSync(join(rootDir, 'klp.lock.json'), JSON.stringify(lock, null, 2) + '\n')
}

// Make `klp-ui` resolvable from the consumer root without a global link or PATH
// hack: declare @klp/ui as a pinned devDependency in a root package.json, then
// install so node_modules/.bin/klp-ui exists. Agents invoke `npx klp-ui …`.
function depSpecForRef(ref) {
  if (ref === 'local') return `file:${REPO_ROOT}`
  return `github:${REPO}#${ref}`
}

function ensureRootPackageJson(rootDir, ref, basename) {
  const pkgPath = join(rootDir, 'package.json')
  let pkg = {}
  if (existsSync(pkgPath)) {
    try { pkg = JSON.parse(readFileSync(pkgPath, 'utf8')) } catch { pkg = {} }
  } else {
    pkg = { name: basename || 'klp-consumer', private: true, version: '0.0.0' }
  }
  pkg.devDependencies = { ...(pkg.devDependencies ?? {}), '@klp/ui': depSpecForRef(ref) }
  writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + '\n')
}

function ensureGitignoreNodeModules(rootDir) {
  const giPath = join(rootDir, '.gitignore')
  if (!existsSync(giPath)) {
    writeFileSync(giPath, 'node_modules/\n')
    return
  }
  const content = readFileSync(giPath, 'utf8')
  if (/^\s*node_modules\/?\s*$/m.test(content)) return
  writeFileSync(giPath, content.replace(/\n?$/, '\n') + 'node_modules/\n')
}

function installRootCli(rootDir, pm, verbose) {
  if (verbose) console.log(`Running: ${pm} install (in ${rootDir})`)
  const result = spawnSync(pm, ['install'], {
    cwd: rootDir,
    stdio: verbose ? 'inherit' : 'pipe',
    encoding: 'utf8',
  })
  if (result.status !== 0) {
    console.warn(`! ${pm} install (root, for klp-ui bin) failed (exit ${result.status}). Stderr:`)
    if (result.stderr) console.warn(result.stderr.slice(0, 800))
    console.warn(`  Run "${pm} install" manually in ${rootDir}, then use "npx klp-ui add <name>".`)
    return false
  }
  return true
}

function catalogFromManifest(manifest) {
  const items = manifest.groups.components.items ?? {}
  // Categories live in registry/<name>.json; manifest doesn't currently carry them per-item.
  // For attach-mode catalog purposes, derive category from the per-component registry shipped
  // alongside the manifest by loading it lazily. Fallback to 'misc'.
  const catalog = []
  for (const [name, item] of Object.entries(items)) {
    catalog.push({
      name,
      category: item.category ?? 'misc',
      deps: item.deps?.components ?? [],
    })
  }
  return catalog
}

async function main() {
  const flags = parseFlags(process.argv.slice(2))
  if (flags.help) { console.log(HELP); process.exit(0) }

  const rootDir = process.cwd()
  if (existsSync(join(rootDir, 'klp.lock.json')) && !flags.force) {
    console.error('klp.lock.json already exists. Use --force or run `klp-ui update`.')
    process.exit(2)
  }

  const ref = flags.ref ?? 'main'
  const manifest = await loadManifest(ref)

  const appDir = await chooseAppDir(rootDir, flags.appDir)
  const brand  = await chooseBrand(flags.brand)
  const catalog = catalogFromManifest(manifest)
  const chosen = await chooseScope(catalog, flags)

  const stagingInv = createInventory({
    ref, brand, appDir,
    dsDir: 'external/klp-design-system',
    catalog, initiallyInstalled: [],
  })
  const toInstall = resolveTransitive(stagingInv, chosen)
  if (flags.verbose) console.log(`Installing ${toInstall.length} components: ${toInstall.join(', ')}`)

  const dsRoot = join(rootDir, 'external/klp-design-system')

  await copyGroup(manifest, 'lib',    dsRoot, { ref, mode: 'attach' })
  await copyGroup(manifest, 'tokens', dsRoot, { ref })
  for (const name of toInstall) await copyComponent(manifest, name, dsRoot, { ref })
  await copyGroup(manifest, 'opencode-scaffold', join(rootDir, '.opencode'), { ref, interpolate: { brand } })
  await copyInstalledDocs(manifest, toInstall, brand, join(rootDir, 'docs'), { ref })

  if (!flags.noConfigPatch && appDir) {
    const appAbs = join(rootDir, appDir)
    const rel = relative(appAbs, join(dsRoot, 'src'))
    // Patch whichever tsconfig is present. Prefer tsconfig.app.json (Vite split convention),
    // fall back to tsconfig.json.
    const tsCandidates = ['tsconfig.app.json', 'tsconfig.json']
    let tsPatched = false
    for (const name of tsCandidates) {
      const p = join(appAbs, name)
      if (existsSync(p)) {
        writeFileSync(p, patchTsconfig(readFileSync(p, 'utf8'), rel))
        if (flags.verbose) console.log(`patched ${name}`)
        tsPatched = true
        break
      }
    }
    if (!tsPatched) console.warn(`! no tsconfig found in ${appDir} — skipped`)

    const vitePath = join(appAbs, 'vite.config.ts')
    if (existsSync(vitePath)) {
      writeFileSync(vitePath, patchViteConfig(readFileSync(vitePath, 'utf8'), rel))
      if (flags.verbose) console.log('patched vite.config.ts')
    } else {
      console.warn(`! no vite.config.ts in ${appDir} — skipped`)
    }
  }

  const finalInv = createInventory({
    ref, brand, appDir,
    dsDir: 'external/klp-design-system',
    catalog, initiallyInstalled: toInstall,
  })
  writeInventory(rootDir, finalInv)
  writeInventoryMd(rootDir, finalInv)
  writeLockfile(rootDir, manifest, toInstall, ref, brand)
  writeDsPackageJson(dsRoot, manifest, toInstall)
  writeDsTsconfig(dsRoot)

  // Make `klp-ui` resolvable from this repo root via a pinned devDependency.
  const basename = rootDir.split(/[\\/]/).filter(Boolean).pop()
  ensureRootPackageJson(rootDir, ref, basename)
  ensureGitignoreNodeModules(rootDir)

  console.log(`✓ Installed ${toInstall.length} components into external/klp-design-system/`)
  console.log(`✓ Agents + commands written to .opencode/`)
  console.log(`✓ Docs written to docs/`)
  console.log(`✓ Added @klp/ui devDependency to package.json (pinned: ${depSpecForRef(ref)})`)

  if (!flags.noInstall) {
    const pm = flags.pm ?? detectPackageManager(rootDir)
    console.log(`\nInstalling runtime deps via ${pm}...`)
    const ok = runInstall(dsRoot, pm, flags.verbose)
    if (ok) console.log(`✓ Runtime deps installed in external/klp-design-system/node_modules/`)
    console.log(`\nInstalling klp-ui CLI at repo root via ${pm}...`)
    const cliOk = installRootCli(rootDir, pm, flags.verbose)
    if (cliOk) console.log(`✓ klp-ui CLI available — run: npx klp-ui add <name>`)
  } else {
    console.log(`\nSkipped install (--no-install). Run manually:`)
    console.log(`  cd external/klp-design-system && pnpm install`)
    console.log(`  (in repo root) npm install   # to expose the klp-ui CLI`)
  }

  console.log(`\nCanonical CLI invocation for this repo (agents + humans):`)
  console.log(`  npx klp-ui list`)
  console.log(`  npx klp-ui add <name> [<name>...]`)
  console.log(`  npx klp-ui update`)
}

main().catch((e) => { console.error(e.message); process.exit(1) })
