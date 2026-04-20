// scripts/test-cli.mjs
// End-to-end smoke test for `klp-ui` CLI.
// Verifies: --help, --version, rewrite module, diff categorization, manifest validator.
// Network-dependent init flow deferred to manual E2E.

import { spawnSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'
import { dirname, resolve, join } from 'node:path'

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

async function main() {
  testCliBasics()
  testManifestValidator()
  await testRewrite()
  await testHash()
  await testManifestModule()
  await testDiff()

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
