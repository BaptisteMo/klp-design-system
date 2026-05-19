// scripts/test-cli.mjs
// End-to-end smoke test for `klp-ui` CLI.
// Verifies: --help, --version, rewrite module, diff categorization, manifest validator.
// Network-dependent init flow deferred to manual E2E.

import { spawnSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'
import { dirname, resolve, join } from 'node:path'
import { mkdtempSync, rmSync, writeFileSync, readFileSync, existsSync } from 'node:fs'
import { tmpdir } from 'node:os'

const __dirname = dirname(fileURLToPath(import.meta.url))
const REPO_ROOT = resolve(__dirname, '..')

let failed = 0
function assert(cond, msg) {
  if (cond) console.log(`  ✓ ${msg}`)
  else { console.log(`  ✗ ${msg}`); failed++ }
}

function testCliBasics() {
  console.log('\n[test] CLI basics')

  const help = spawnSync('node', [join(REPO_ROOT, 'cli/index.mjs'), '--help'], { encoding: 'utf8' })
  assert(help.status === 0, 'klp-ui --help exits 0')
  assert(/Usage:/.test(help.stdout), 'help contains Usage:')
  assert(/klp-ui init/.test(help.stdout), 'help lists init command')
  assert(/klp-ui update/.test(help.stdout), 'help lists update command')

  const version = spawnSync('node', [join(REPO_ROOT, 'cli/index.mjs'), '--version'], { encoding: 'utf8' })
  assert(version.status === 0, 'klp-ui --version exits 0')
  assert(/\d+\.\d+\.\d+/.test(version.stdout.trim()), 'version matches semver')

  const unknown = spawnSync('node', [join(REPO_ROOT, 'cli/index.mjs'), 'bogus-command'], { encoding: 'utf8' })
  assert(unknown.status === 3, 'unknown command exits with code 3')
}

function testManifestValidator() {
  console.log('\n[test] manifest validator')
  const validate = spawnSync('node', [join(REPO_ROOT, 'scripts/validate-manifest.mjs')], {
    cwd: REPO_ROOT,
    encoding: 'utf8',
  })
  assert(validate.status === 0, 'manifest validator passes')
  assert(/manifest OK/.test(validate.stdout), 'validator prints OK message')
}

async function testRewrite() {
  console.log('\n[test] rewrite')
  const { rewriteImports } = await import(join(REPO_ROOT, 'cli/rewrite.mjs'))

  assert(
    rewriteImports(`import { Button } from '@/components/button'`, 'src/components/ui/foo/Foo.tsx')
      === `import { Button } from '@/components/ui/button'`,
    'rewrites @/components/<name> to @/components/ui/<name>',
  )
  assert(
    rewriteImports(`import { X } from '@/components/ui/button'`, 'src/foo.tsx')
      === `import { X } from '@/components/ui/button'`,
    'already-rewritten paths unchanged (no double ui/)',
  )
  assert(
    rewriteImports(`import { BrandProvider } from '@/components/brand-provider'`, 'src/App.tsx')
      === `import { BrandProvider } from '@/components/brand-provider'`,
    'preserves flat component brand-provider',
  )
  assert(
    rewriteImports(`/* css content */`, 'src/foo.css')
      === `/* css content */`,
    'non-ts files unchanged',
  )
  assert(
    rewriteImports(`import { A } from "@/components/data-table"`, 'src/foo.tsx')
      === `import { A } from "@/components/ui/data-table"`,
    'double-quoted imports rewritten',
  )

  // attach mode
  assert(
    rewriteImports(`import { Button } from '@/components/button'`, 'src/foo.tsx', { mode: 'attach' })
      === `import { Button } from '@klp/components/button'`,
    'attach mode rewrites to @klp/components/<name>',
  )
  assert(
    rewriteImports(`import { BrandProvider } from '@/components/brand-provider'`, 'src/App.tsx', { mode: 'attach' })
      === `import { BrandProvider } from '@klp/components/brand-provider'`,
    'attach mode rewrites brand-provider too',
  )
  assert(
    rewriteImports(`import { cn } from '@/lib/cn'`, 'src/foo.tsx', { mode: 'attach' })
      === `import { cn } from '@klp/lib/cn'`,
    'attach mode rewrites @/lib/* to @klp/lib/*',
  )
}

async function testHash() {
  console.log('\n[test] hash')
  const { sha256 } = await import(join(REPO_ROOT, 'cli/hash.mjs'))
  const h = sha256('A')
  assert(h.startsWith('sha256:'), 'hash has sha256: prefix')
  assert(h.length === 7 + 64, 'hash has correct hex length')
  assert(sha256('A') === sha256('A'), 'hash is deterministic')
  assert(sha256('A') !== sha256('B'), 'different inputs → different hashes')
}

async function testManifestModule() {
  console.log('\n[test] manifest module')
  const { validateManifest, flattenManifest, collectNpmDeps, MANIFEST_SCHEMA_VERSION } =
    await import(join(REPO_ROOT, 'cli/manifest.mjs'))

  assert(MANIFEST_SCHEMA_VERSION === '0.1.0', 'schema version is 0.1.0')

  let threw = false
  try { validateManifest(null) } catch { threw = true }
  assert(threw, 'validateManifest rejects null')

  threw = false
  try { validateManifest({ version: '99.0.0', brands: ['x'], groups: {} }) } catch { threw = true }
  assert(threw, 'validateManifest rejects mismatched version')

  // Load the real manifest
  const { readFileSync } = await import('node:fs')
  const real = JSON.parse(readFileSync(join(REPO_ROOT, 'registry/manifest.json'), 'utf8'))

  let valid = true
  try { validateManifest(real) } catch (e) { valid = false; console.error('  (validateManifest error:', e.message, ')') }
  assert(valid, 'real manifest validates OK')

  const flat = flattenManifest(real)
  assert(flat.length > 0, 'flattenManifest returns entries')
  assert(flat.every(f => f.src && f.dst && f.hash), 'every flattened entry has src/dst/hash')

  const deps = collectNpmDeps(real)
  assert(Array.isArray(deps), 'collectNpmDeps returns array')
}

async function testDiff() {
  console.log('\n[test] diff categorization')
  const { computeDiff, groupByStatus } = await import(join(REPO_ROOT, 'cli/diff.mjs'))
  const { sha256 } = await import(join(REPO_ROOT, 'cli/hash.mjs'))

  const hA = sha256('A')
  const hB = sha256('B')

  // Synthetic case: one new file not in lockfile
  const manifest = {
    groups: {
      g: { files: [{ src: 'x', dst: 'nonexistent-test-file.xyz', hash: hA }] },
    },
  }
  const lock = { files: {} }
  const entries = await computeDiff({ cwd: '/tmp', lockfile: lock, remoteManifest: manifest })
  assert(entries.length === 1, 'one entry produced')
  assert(entries[0].status === 'new', 'missing-from-lockfile → new')

  // Synthetic case: removed upstream (in lockfile, not in manifest)
  const manifest2 = { groups: { g: { files: [] } } }
  const lock2 = { files: { 'gone.txt': { hash: hB } } }
  const entries2 = await computeDiff({ cwd: '/tmp', lockfile: lock2, remoteManifest: manifest2 })
  assert(entries2.length === 1 && entries2[0].status === 'removed-upstream', 'removed-upstream detected')

  // groupByStatus
  const grouped = groupByStatus(entries2)
  assert(Array.isArray(grouped['removed-upstream']) && grouped['removed-upstream'].length === 1, 'groupByStatus bucket populated')
  assert(Array.isArray(grouped['new']) && grouped['new'].length === 0, 'groupByStatus initializes empty buckets')
}

async function testDetectApp() {
  console.log('\n[test] detect-app')
  const { detectReactApp } = await import(join(REPO_ROOT, 'cli/detect-app.mjs'))
  const fixture = join(REPO_ROOT, 'tests/fixtures/attach')

  const single = await detectReactApp(fixture)
  assert(single.matches.length === 1, 'detects exactly one react sub-app')
  assert(single.matches[0] === 'forge-output/04-app', 'returns relative path to sub-app')

  // Scan an empty tmp dir to prove no false positives, not just shape.
  const emptyDir = mkdtempSync(join(tmpdir(), 'klp-detect-empty-'))
  try {
    const none = await detectReactApp(emptyDir)
    assert(Array.isArray(none.matches), 'returns matches array on no match too')
    assert(none.matches.length === 0, 'returns empty matches when no react sub-app present')
  } finally {
    rmSync(emptyDir, { recursive: true, force: true })
  }
}

async function testPatchConfig() {
  console.log('\n[test] patch-config')
  const { patchTsconfig, patchViteConfig } = await import(join(REPO_ROOT, 'cli/patch-config.mjs'))

  const tsBefore = JSON.stringify({ compilerOptions: { strict: true } }, null, 2)
  const tsAfter = patchTsconfig(tsBefore, '../../external/klp-design-system/src')
  const parsed = JSON.parse(tsAfter)
  assert(parsed.compilerOptions.paths['@klp/*'][0] === '../../external/klp-design-system/src/*', 'tsconfig paths injected')

  const tsAfter2 = patchTsconfig(tsAfter, '../../external/klp-design-system/src')
  assert(tsAfter === tsAfter2, 'tsconfig patch is idempotent')

  const viteBefore = `import { defineConfig } from 'vite'\nimport react from '@vitejs/plugin-react'\n\nexport default defineConfig({\n  plugins: [react()],\n})\n`
  const viteAfter = patchViteConfig(viteBefore, '../../external/klp-design-system/src')
  assert(/'@klp':\s*path\.resolve/.test(viteAfter), 'vite alias injected')
  assert(/import path from 'node:path'/.test(viteAfter), 'vite import path added')

  const viteAfter2 = patchViteConfig(viteAfter, '../../external/klp-design-system/src')
  assert(viteAfter === viteAfter2, 'vite patch is idempotent')
}

async function testInventory() {
  console.log('\n[test] inventory')
  const { createInventory, readInventory, writeInventory, markInstalled, listByStatus, resolveTransitive } =
    await import(join(REPO_ROOT, 'cli/inventory.mjs'))

  const dir = mkdtempSync(join(tmpdir(), 'klp-inv-'))
  try {
    const inv = createInventory({
      ref: 'main', brand: 'wireframe',
      appDir: 'forge-output/04-app',
      dsDir: 'external/klp-design-system',
      catalog: [
        { name: 'button', category: 'inputs', deps: [] },
        { name: 'pagination', category: 'navigation', deps: [] },
        { name: 'table', category: 'data-display', deps: [] },
        { name: 'data-table', category: 'data-display', deps: ['pagination', 'table'] },
      ],
      initiallyInstalled: ['button'],
    })

    assert(inv.components.button.status === 'installed', 'button is installed')
    assert(inv.components['data-table'].status === 'available', 'data-table is available')

    writeInventory(dir, inv)
    assert(existsSync(join(dir, 'klp-inventory.json')), 'inventory file written')

    const read = readInventory(dir)
    assert(read.brand === 'wireframe', 'inventory read back')

    const transitive = resolveTransitive(read, ['data-table'])
    assert(transitive.sort().join(',') === 'data-table,pagination,table', 'transitive deps resolved')

    const updated = markInstalled(read, transitive)
    assert(updated.components['data-table'].status === 'installed', 'data-table now installed')
    assert(updated.components.pagination.status === 'installed', 'pagination transitively marked')

    const installed = listByStatus(updated, 'installed')
    assert(installed.length === 4, 'four components installed total')
  } finally {
    rmSync(dir, { recursive: true, force: true })
  }
}

async function testListCommand() {
  console.log('\n[test] list command')
  const { runList } = await import(join(REPO_ROOT, 'cli/list.mjs'))
  const { writeInventory, createInventory } = await import(join(REPO_ROOT, 'cli/inventory.mjs'))

  const dir = mkdtempSync(join(tmpdir(), 'klp-list-'))
  try {
    const inv = createInventory({
      ref: 'main', brand: 'wireframe', appDir: 'app', dsDir: 'external/ds',
      catalog: [
        { name: 'button', category: 'inputs', deps: [] },
        { name: 'input',  category: 'inputs', deps: [] },
      ],
      initiallyInstalled: ['button'],
    })
    writeInventory(dir, inv)

    const jsonOut = runList({ rootDir: dir, json: true })
    assert(JSON.parse(jsonOut).components.button.status === 'installed', 'list --json returns inventory')

    const textOut = runList({ rootDir: dir, json: false })
    assert(/installed/.test(textOut) && /button/.test(textOut), 'list text shows installed section')
    assert(/available/.test(textOut) && /input/.test(textOut), 'list text shows available section')
  } finally {
    rmSync(dir, { recursive: true, force: true })
  }
}

async function testAddCommand() {
  console.log('\n[test] add command planning')
  const { planAdd } = await import(join(REPO_ROOT, 'cli/add.mjs'))
  const { writeInventory, createInventory } = await import(join(REPO_ROOT, 'cli/inventory.mjs'))

  const dir = mkdtempSync(join(tmpdir(), 'klp-add-'))
  try {
    const inv = createInventory({
      ref: 'main', brand: 'wireframe', appDir: 'app', dsDir: 'external/ds',
      catalog: [
        { name: 'pagination', category: 'navigation',   deps: [] },
        { name: 'table',      category: 'data-display', deps: [] },
        { name: 'data-table', category: 'data-display', deps: ['pagination', 'table'] },
        { name: 'button',     category: 'inputs',       deps: [] },
      ],
      initiallyInstalled: ['button'],
    })
    writeInventory(dir, inv)

    const plan = planAdd({ rootDir: dir, names: ['data-table'], force: false })
    assert(plan.toInstall.sort().join(',') === 'data-table,pagination,table', 'plans transitive deps')
    assert(plan.unknown.length === 0, 'no unknown')

    const planExisting = planAdd({ rootDir: dir, names: ['button'], force: false })
    assert(planExisting.alreadyInstalled[0] === 'button', 'flags already-installed')
    assert(planExisting.toInstall.length === 0, 'does not re-plan already-installed')

    const planForce = planAdd({ rootDir: dir, names: ['button'], force: true })
    assert(planForce.toInstall[0] === 'button', 'force re-includes already-installed')

    const planBogus = planAdd({ rootDir: dir, names: ['nonexistent'], force: false })
    assert(planBogus.unknown[0] === 'nonexistent', 'unknown component flagged')
  } finally {
    rmSync(dir, { recursive: true, force: true })
  }
}

async function main() {
  testCliBasics()
  testManifestValidator()
  await testRewrite()
  await testHash()
  await testManifestModule()
  await testDiff()
  await testDetectApp()
  await testPatchConfig()
  await testInventory()
  await testListCommand()
  await testAddCommand()

  if (failed > 0) {
    console.log(`\n${failed} test(s) failed.`)
    process.exit(1)
  }
  console.log('\n✓ all tests passed')
}

main().catch((err) => {
  console.error('Test harness crashed:', err)
  process.exit(1)
})
