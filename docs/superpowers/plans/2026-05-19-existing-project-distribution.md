# Existing-Project Distribution Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship `klep-ds-init` binary + `klp-ui add`/`list` subcommands + OpenCode-flavor scaffold so the DS can be installed into an existing project (target: `forge-conflits/`).

**Architecture:** Reuse existing manifest/hash/diff/rewrite primitives. Add a separate binary `klep-ds-init` plus inventory + sub-app detection + idempotent config patcher modules. Keep `init` and `update` untouched. OpenCode scaffold is a parallel templates dir consumed by a new manifest group.

**Tech Stack:** Node 20+ ESM (`.mjs`), no framework deps. Tests use Node stdlib `spawnSync` + custom assert (existing pattern in `scripts/test-cli.mjs`). Manifest built via `tsx scripts/build-manifest.ts`.

---

## File Structure

**New CLI modules (`cli/`):**
- `inventory.mjs` — read/write `klp-inventory.json`, status transitions
- `detect-app.mjs` — auto-detect React sub-app
- `patch-config.mjs` — idempotent edits to `tsconfig.app.json` + `vite.config.ts`
- `add.mjs` — `klp-ui add` planning logic
- `list.mjs` — `klp-ui list`
- `copy.mjs` — shared file-copy helpers
- `klep-ds-init.mjs` — new binary entry point

**Modified CLI modules:**
- `cli/index.mjs` — register `add`, `list` subcommands
- `cli/rewrite.mjs` — add `mode: 'fresh' | 'attach'` parameter

**OpenCode scaffold (`cli/scaffold/opencode/`):**
- `agents/{request-analyzer,ad-hoc-builder,mockup-composer,design-finalizer}.md`
- `commands/{klp-design,klp-design-review,klp-design-validate,klp-design-reset}.md`

**Build / config:**
- `package.json` — add `"klep-ds-init"` bin entry
- `scripts/build-manifest.ts` — register `opencode-scaffold` group
- `registry/manifest.json` — regenerated

**Tests:**
- `scripts/test-cli.mjs` — append new test functions
- `tests/fixtures/attach/` — fixture target project for E2E

---

## Conventions in this plan

- ESM imports with explicit `.mjs` extensions.
- No external deps. Prompts use `readline/promises` (Node stdlib).
- One commit per task. Test before code (TDD). Commit prefix: `feat:` / `fix:` / `chore:` / `docs:` / `test:`.
- All paths are absolute from repo root `/Users/morillonbaptiste/klp-design-system/`.

---

## Task 1: Add `tests/fixtures/attach/` test fixture

**Files:**
- Create: `tests/fixtures/attach/package.json`
- Create: `tests/fixtures/attach/forge-output/04-app/package.json`
- Create: `tests/fixtures/attach/forge-output/04-app/tsconfig.app.json`
- Create: `tests/fixtures/attach/forge-output/04-app/vite.config.ts`

- [ ] **Step 1: Create root fixture package.json**

```json
{
  "name": "fixture-attach-root",
  "private": true,
  "version": "0.0.0"
}
```

- [ ] **Step 2: Create sub-app package.json**

```json
{
  "name": "fixture-app",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "dependencies": {
    "react": "18.3.1",
    "react-dom": "18.3.1"
  }
}
```

- [ ] **Step 3: Create sub-app tsconfig.app.json**

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "moduleResolution": "Bundler",
    "jsx": "react-jsx",
    "strict": true
  },
  "include": ["src"]
}
```

- [ ] **Step 4: Create sub-app vite.config.ts**

```ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
})
```

- [ ] **Step 5: Commit**

```bash
git add tests/fixtures/attach
git commit -m "test: add attach-flow fixture target project"
```

---

## Task 2: `cli/detect-app.mjs` — sub-app auto-detection

**Files:**
- Create: `cli/detect-app.mjs`
- Modify: `scripts/test-cli.mjs`

- [ ] **Step 1: Append failing test to `scripts/test-cli.mjs`**

```js
async function testDetectApp() {
  console.log('\n[test] detect-app')
  const { detectReactApp } = await import(join(REPO_ROOT, 'cli/detect-app.mjs'))
  const fixture = join(REPO_ROOT, 'tests/fixtures/attach')

  const single = await detectReactApp(fixture)
  assert(single.matches.length === 1, 'detects exactly one react sub-app')
  assert(single.matches[0] === 'forge-output/04-app', 'returns relative path to sub-app')

  const none = await detectReactApp(REPO_ROOT)
  assert(Array.isArray(none.matches), 'returns matches array on no match too')
}
```

Register `await testDetectApp()` in the `main` runner (search for `await testRewrite()` and add the call after it).

- [ ] **Step 2: Run test to verify it fails**

Run: `node scripts/test-cli.mjs`
Expected: FAIL — module not found.

- [ ] **Step 3: Implement `cli/detect-app.mjs`**

```js
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
      if (rel) matches.push(rel)
    }
  }
  return { matches }
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `node scripts/test-cli.mjs`
Expected: PASS — all detect-app asserts.

- [ ] **Step 5: Commit**

```bash
git add cli/detect-app.mjs scripts/test-cli.mjs
git commit -m "feat(cli): add detect-app module for react sub-app auto-detection"
```

---

## Task 3: `cli/patch-config.mjs` — idempotent tsconfig + vite alias injection

**Files:**
- Create: `cli/patch-config.mjs`
- Modify: `scripts/test-cli.mjs`

- [ ] **Step 1: Append failing tests**

```js
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
```

Register `await testPatchConfig()`.

- [ ] **Step 2: Run test to verify it fails**

Run: `node scripts/test-cli.mjs` — module not found.

- [ ] **Step 3: Implement `cli/patch-config.mjs`**

```js
// cli/patch-config.mjs
// Idempotent edits to inject @klp/* alias.

export function patchTsconfig(source, relPath) {
  const json = JSON.parse(source)
  json.compilerOptions ??= {}
  json.compilerOptions.paths ??= {}
  const existing = json.compilerOptions.paths['@klp/*']
  const wanted = [`${relPath}/*`]
  if (Array.isArray(existing) && existing[0] === wanted[0]) return source
  json.compilerOptions.paths['@klp/*'] = wanted
  if (!json.compilerOptions.baseUrl) json.compilerOptions.baseUrl = '.'
  return JSON.stringify(json, null, 2) + '\n'
}

const VITE_IMPORT_LINE = `import path from 'node:path'`
const ALIAS_RE = /'@klp'\s*:\s*path\.resolve\(__dirname,\s*'[^']+'\)/

export function patchViteConfig(source, relPath) {
  if (ALIAS_RE.test(source) && source.includes(relPath)) return source
  let out = source
  if (!out.includes(VITE_IMPORT_LINE)) out = `${VITE_IMPORT_LINE}\n${out}`

  if (/resolve:\s*\{/.test(out)) {
    out = out.replace(
      /resolve:\s*\{([\s\S]*?)\}/,
      (_m, inner) => `resolve: {${inner}\n      '@klp': path.resolve(__dirname, '${relPath}'),\n  }`
    )
  } else {
    const snippet = `  resolve: {\n    alias: {\n      '@klp': path.resolve(__dirname, '${relPath}'),\n    },\n  },\n`
    out = out.replace(/defineConfig\(\{\s*\n/, (m) => `${m}${snippet}`)
  }
  return out
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `node scripts/test-cli.mjs`

- [ ] **Step 5: Commit**

```bash
git add cli/patch-config.mjs scripts/test-cli.mjs
git commit -m "feat(cli): add patch-config for tsconfig+vite alias injection"
```

---

## Task 4: `cli/inventory.mjs` — inventory file read/write

**Files:**
- Create: `cli/inventory.mjs`
- Modify: `scripts/test-cli.mjs`

- [ ] **Step 1: Add imports at top of `scripts/test-cli.mjs`** (if not present already)

```js
import { mkdtempSync, rmSync, writeFileSync, readFileSync, existsSync } from 'node:fs'
import { tmpdir } from 'node:os'
```

- [ ] **Step 2: Append failing test**

```js
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
```

Register `await testInventory()`.

- [ ] **Step 3: Run test to verify it fails**

Run: `node scripts/test-cli.mjs`

- [ ] **Step 4: Implement `cli/inventory.mjs`**

```js
// cli/inventory.mjs
import { readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'

const FILE = 'klp-inventory.json'
const SCHEMA = 'v1'

export function createInventory({ ref, brand, appDir, dsDir, catalog, initiallyInstalled = [] }) {
  const installed = new Set(initiallyInstalled)
  const components = {}
  for (const e of catalog) {
    components[e.name] = {
      status: installed.has(e.name) ? 'installed' : 'available',
      category: e.category,
      deps: e.deps ?? [],
    }
  }
  return { schemaVersion: SCHEMA, ref, brand, appDir, dsDir, components }
}

export function inventoryPath(rootDir) { return join(rootDir, FILE) }
export function readInventory(rootDir) { return JSON.parse(readFileSync(inventoryPath(rootDir), 'utf8')) }
export function writeInventory(rootDir, inv) { writeFileSync(inventoryPath(rootDir), JSON.stringify(inv, null, 2) + '\n') }

export function markInstalled(inv, names) {
  const next = JSON.parse(JSON.stringify(inv))
  for (const name of names) if (next.components[name]) next.components[name].status = 'installed'
  return next
}

export function listByStatus(inv, status) {
  return Object.entries(inv.components).filter(([, v]) => v.status === status).map(([k]) => k)
}

export function resolveTransitive(inv, names) {
  const out = new Set(names)
  let changed = true
  while (changed) {
    changed = false
    for (const n of Array.from(out)) {
      const e = inv.components[n]
      if (!e) continue
      for (const d of e.deps) if (!out.has(d)) { out.add(d); changed = true }
    }
  }
  return Array.from(out)
}
```

- [ ] **Step 5: Run test to verify it passes**

Run: `node scripts/test-cli.mjs`

- [ ] **Step 6: Commit**

```bash
git add cli/inventory.mjs scripts/test-cli.mjs
git commit -m "feat(cli): add inventory module"
```

---

## Task 5: Extend `cli/rewrite.mjs` with attach mode

**Files:**
- Modify: `cli/rewrite.mjs`
- Modify: `scripts/test-cli.mjs`

- [ ] **Step 1: Read existing rewrite module**

Run: `cat cli/rewrite.mjs` — note current signature `rewriteImports(content, dstRelPath)`.

- [ ] **Step 2: Append failing tests to existing `testRewrite` block**

```js
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
```

- [ ] **Step 3: Run test to verify it fails**

Run: `node scripts/test-cli.mjs`

- [ ] **Step 4: Add attach branch to `cli/rewrite.mjs`**

Preserve existing fresh-mode logic verbatim. Modify the exported function to accept `opts`:

```js
export function rewriteImports(source, dstRelPath, opts = {}) {
  const mode = opts.mode ?? 'fresh'
  if (!/\.tsx?$/.test(dstRelPath)) return source

  if (mode === 'attach') {
    return source
      .replace(/(['"])@\/components\/([a-z0-9-]+)\1/g, (_m, q, n) => `${q}@klp/components/${n}${q}`)
      .replace(/(['"])@\/lib\/([a-z0-9-]+)\1/g, (_m, q, n) => `${q}@klp/lib/${n}${q}`)
  }

  // existing 'fresh' logic preserved below
  // ...
}
```

- [ ] **Step 5: Run test to verify it passes**

Run: `node scripts/test-cli.mjs`

- [ ] **Step 6: Commit**

```bash
git add cli/rewrite.mjs scripts/test-cli.mjs
git commit -m "feat(cli): add attach mode to rewrite.mjs"
```

---

## Task 6: `cli/list.mjs` — list command

**Files:**
- Create: `cli/list.mjs`
- Modify: `scripts/test-cli.mjs`

- [ ] **Step 1: Append failing test**

```js
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
```

Register `await testListCommand()`.

- [ ] **Step 2: Run test to verify it fails**

Run: `node scripts/test-cli.mjs`

- [ ] **Step 3: Implement `cli/list.mjs`**

```js
// cli/list.mjs
import { readInventory, listByStatus } from './inventory.mjs'

export function runList({ rootDir, json }) {
  const inv = readInventory(rootDir)
  if (json) return JSON.stringify(inv, null, 2)

  const installed = listByStatus(inv, 'installed').sort()
  const available = listByStatus(inv, 'available').sort()
  const lines = [
    `klp-ui inventory — brand=${inv.brand} ref=${inv.ref}`,
    '',
    `installed (${installed.length}):`,
    ...installed.map((n) => `  ${n}  [${inv.components[n].category}]`),
    '',
    `available (${available.length}):`,
    ...available.map((n) => `  ${n}  [${inv.components[n].category}]`),
  ]
  return lines.join('\n')
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `node scripts/test-cli.mjs`

- [ ] **Step 5: Commit**

```bash
git add cli/list.mjs scripts/test-cli.mjs
git commit -m "feat(cli): add list command"
```

---

## Task 7: `cli/add.mjs` — add command planning logic

**Files:**
- Create: `cli/add.mjs`
- Modify: `scripts/test-cli.mjs`

- [ ] **Step 1: Append failing test**

```js
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
```

Register `await testAddCommand()`.

- [ ] **Step 2: Run test to verify it fails**

Run: `node scripts/test-cli.mjs`

- [ ] **Step 3: Implement `cli/add.mjs`**

```js
// cli/add.mjs
import { readInventory, resolveTransitive } from './inventory.mjs'

export function planAdd({ rootDir, names, force }) {
  const inv = readInventory(rootDir)
  const unknown = []
  const alreadyInstalled = []
  const wanted = []

  for (const name of names) {
    if (!inv.components[name]) { unknown.push(name); continue }
    if (inv.components[name].status === 'installed' && !force) {
      alreadyInstalled.push(name); continue
    }
    wanted.push(name)
  }

  const transitive = resolveTransitive(inv, wanted)
  const toInstall = transitive.filter((n) => force || inv.components[n].status !== 'installed')

  return { inventory: inv, toInstall, alreadyInstalled, unknown }
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `node scripts/test-cli.mjs`

- [ ] **Step 5: Commit**

```bash
git add cli/add.mjs scripts/test-cli.mjs
git commit -m "feat(cli): add planning logic for add command"
```

---

## Task 8: Wire `add` and `list` into `cli/index.mjs`

**Files:**
- Modify: `cli/index.mjs`
- Modify: `scripts/test-cli.mjs`

- [ ] **Step 1: Read current dispatcher**

Run: `cat cli/index.mjs` — identify the command dispatcher and help text block.

- [ ] **Step 2: Append failing test**

```js
function testListSubcommand() {
  console.log('\n[test] list subcommand')
  const dir = mkdtempSync(join(tmpdir(), 'klp-list-cli-'))
  try {
    writeFileSync(join(dir, 'klp-inventory.json'), JSON.stringify({
      schemaVersion: 'v1', ref: 'main', brand: 'wireframe',
      appDir: 'app', dsDir: 'external/ds',
      components: { button: { status: 'installed', category: 'inputs', deps: [] } },
    }, null, 2))

    const out = spawnSync('node', [join(REPO_ROOT, 'cli/index.mjs'), 'list', '--json'], {
      cwd: dir, encoding: 'utf8',
    })
    assert(out.status === 0, 'klp-ui list exits 0')
    assert(JSON.parse(out.stdout).components.button.status === 'installed', 'list --json returns valid inventory')

    const help = spawnSync('node', [join(REPO_ROOT, 'cli/index.mjs'), '--help'], { encoding: 'utf8' })
    assert(/klp-ui list/.test(help.stdout), 'help lists `list` command')
    assert(/klp-ui add/.test(help.stdout), 'help lists `add` command')
  } finally {
    rmSync(dir, { recursive: true, force: true })
  }
}
```

Register `testListSubcommand()` (synchronous).

- [ ] **Step 3: Run test to verify it fails**

Run: `node scripts/test-cli.mjs`

- [ ] **Step 4: Add cases to `cli/index.mjs`**

Inside the dispatcher:

```js
case 'list': {
  const { runList } = await import('./list.mjs')
  const json = args.includes('--json')
  console.log(runList({ rootDir: process.cwd(), json }))
  process.exit(0)
}
case 'add': {
  const { planAdd } = await import('./add.mjs')
  const positional = args.filter((a) => !a.startsWith('--'))
  const force = args.includes('--force')
  const json = args.includes('--json')
  const plan = planAdd({ rootDir: process.cwd(), names: positional, force })
  if (plan.unknown.length) {
    console.error(`Unknown components: ${plan.unknown.join(', ')}`)
    process.exit(2)
  }
  if (json) console.log(JSON.stringify(plan, null, 2))
  else {
    console.log(`Would install: ${plan.toInstall.join(', ') || '(none)'}`)
    if (plan.alreadyInstalled.length) console.log(`Already installed: ${plan.alreadyInstalled.join(', ')}`)
  }
  process.exit(0)
}
```

Note: this is dry-run only; Task 14 promotes it to a real install.

Update help text to include:
```
  klp-ui add <name> [<name>...]   Add components after install
  klp-ui list [--json]            Print inventory
```

- [ ] **Step 5: Run test to verify it passes**

Run: `node scripts/test-cli.mjs`

- [ ] **Step 6: Commit**

```bash
git add cli/index.mjs scripts/test-cli.mjs
git commit -m "feat(cli): register add and list subcommands (dry-run)"
```

---

## Task 9: OpenCode agents — port 4 from Claude flavor

**Files:**
- Create: `cli/scaffold/opencode/agents/request-analyzer.md`
- Create: `cli/scaffold/opencode/agents/ad-hoc-builder.md`
- Create: `cli/scaffold/opencode/agents/mockup-composer.md`
- Create: `cli/scaffold/opencode/agents/design-finalizer.md`

- [ ] **Step 1: Read each source template**

```bash
ls cli/scaffold/claude/agents/
cat cli/scaffold/claude/agents/request-analyzer.md.tmpl
cat cli/scaffold/claude/agents/ad-hoc-builder.md.tmpl
cat cli/scaffold/claude/agents/mockup-composer.md.tmpl
cat cli/scaffold/claude/agents/design-finalizer.md.tmpl
```

- [ ] **Step 2: For each agent, create the OpenCode equivalent**

Translation rules:

| Claude frontmatter                  | OpenCode frontmatter                                          |
|-------------------------------------|---------------------------------------------------------------|
| `name: <slug>`                      | drop (file name is identity)                                  |
| `description: …`                    | `description: \|` (same content, literal block)               |
| `tools: Read, Write, Edit, Bash`    | `permission: { edit: allow, bash: <allow if Bash else deny>, webfetch: deny }` |
| `model: …`                          | drop                                                          |
| —                                   | `mode: subagent`                                              |
| —                                   | `temperature: 0.2`                                            |
| —                                   | `forge-level: project`                                        |
| —                                   | `forge-role: producer` (use `reviewer` for `design-finalizer`)|

Body rules (apply to all 4):
- Copy body verbatim from the source `.md.tmpl`.
- Replace any "Use the Task tool to dispatch …" with "Spawn a subagent (mode: subagent) to …".
- Remove any "Use TodoWrite to track …" sentences entirely.
- Keep `{{brand}}` / `{{projectName}}` placeholders verbatim (interpolated at install time).

Example header for `request-analyzer.md`:

```markdown
---
description: |
  Stage 1 of klp-design pipeline. Parses requests/pending/<id>.yaml
  and produces .klp/staging/<id>/plan.json (component inventory,
  ad-hoc needs, DS gaps).
mode: subagent
temperature: 0.2
forge-level: project
forge-role: producer
permission:
  edit: allow
  bash: deny
  webfetch: deny
---

<body copied verbatim from cli/scaffold/claude/agents/request-analyzer.md.tmpl,
adjusted per body rules above>
```

Repeat for the 3 others. Use `forge-role: reviewer` for `design-finalizer`.

- [ ] **Step 3: Verify the 4 files have valid frontmatter**

```bash
for f in cli/scaffold/opencode/agents/*.md; do
  node --input-type=module -e "
    import fs from 'node:fs'
    const src = fs.readFileSync(process.argv[1], 'utf8')
    const m = src.match(/^---\n([\s\S]+?)\n---/)
    if (!m) { console.error(process.argv[1] + ': missing frontmatter'); process.exit(1) }
    if (!/mode:\s*subagent/.test(m[1])) { console.error(process.argv[1] + ': mode missing'); process.exit(1) }
    console.log(process.argv[1] + ': ok')
  " "$f"
done
```

Expected: 4 lines, all `ok`.

- [ ] **Step 4: Commit**

```bash
git add cli/scaffold/opencode/agents
git commit -m "feat(scaffold): add OpenCode-flavor design-pipeline agents"
```

---

## Task 10: OpenCode commands — port 4 from Claude flavor

**Files:**
- Create: `cli/scaffold/opencode/commands/klp-design.md`
- Create: `cli/scaffold/opencode/commands/klp-design-review.md`
- Create: `cli/scaffold/opencode/commands/klp-design-validate.md`
- Create: `cli/scaffold/opencode/commands/klp-design-reset.md`

- [ ] **Step 1: Read each source template**

```bash
ls cli/scaffold/claude/commands/
cat cli/scaffold/claude/commands/klp-design.md.tmpl
cat cli/scaffold/claude/commands/klp-design-review.md.tmpl
cat cli/scaffold/claude/commands/klp-design-validate.md.tmpl
cat cli/scaffold/claude/commands/klp-design-reset.md.tmpl
```

- [ ] **Step 2: Create OpenCode commands**

Translation rules:
- Drop `allowed-tools:` field.
- Add `agent: <agent-name>` delegation.
- Keep `description:`.
- Body verbatim.

Agent mapping:
- `klp-design.md` → `agent: request-analyzer`
- `klp-design-review.md` → `agent: mockup-composer`
- `klp-design-validate.md` → `agent: design-finalizer`
- `klp-design-reset.md` → `agent: request-analyzer`

Example for `klp-design.md`:

```markdown
---
description: Run the 4-stage klp-design pipeline on a request YAML.
agent: request-analyzer
---

<body verbatim from cli/scaffold/claude/commands/klp-design.md.tmpl>
```

- [ ] **Step 3: Verify**

```bash
for f in cli/scaffold/opencode/commands/*.md; do
  node --input-type=module -e "
    import fs from 'node:fs'
    const src = fs.readFileSync(process.argv[1], 'utf8')
    const m = src.match(/^---\n([\s\S]+?)\n---/)
    if (!m || !/agent:/.test(m[1]) || !/description:/.test(m[1])) {
      console.error(process.argv[1] + ': frontmatter missing agent or description')
      process.exit(1)
    }
    console.log(process.argv[1] + ': ok')
  " "$f"
done
```

Expected: 4 `ok`.

- [ ] **Step 4: Commit**

```bash
git add cli/scaffold/opencode/commands
git commit -m "feat(scaffold): add OpenCode-flavor design-pipeline commands"
```

---

## Task 11: Register `opencode-scaffold` group in manifest builder

**Files:**
- Modify: `scripts/build-manifest.ts`
- Generated: `registry/manifest.json`
- Modify: `scripts/test-cli.mjs`

- [ ] **Step 1: Read current manifest builder**

```bash
grep -n "scaffold" scripts/build-manifest.ts
```

Identify where the `scaffold` group is constructed.

- [ ] **Step 2: Add parallel block for `opencode-scaffold`**

In `scripts/build-manifest.ts`, after the `scaffold` group block, add:

```ts
// opencode-scaffold group — agents/commands installed by klep-ds-init
const opencodeRoot = path.join(repoRoot, 'cli/scaffold/opencode')
const opencodeFiles = await collectFiles(opencodeRoot)
manifest.groups['opencode-scaffold'] = {
  description: 'OpenCode-flavor agents + commands installed by klep-ds-init',
  files: await Promise.all(opencodeFiles.map(async (f) => ({
    src: path.relative(repoRoot, f),
    dst: path.relative(opencodeRoot, f), // e.g. "agents/request-analyzer.md"
    hash: await sha256File(f),
  }))),
}
```

Adapt to the actual signatures of `collectFiles` / `sha256File` in the existing file. Do not introduce new helpers if the existing ones work.

- [ ] **Step 3: Regenerate manifest**

```bash
pnpm run build:manifest
pnpm run validate:manifest
```

Expected: both succeed, `registry/manifest.json` contains `groups.opencode-scaffold` with 8 entries.

- [ ] **Step 4: Append manifest test**

```js
function testOpencodeScaffoldGroup() {
  console.log('\n[test] opencode-scaffold manifest group')
  const manifest = JSON.parse(readFileSync(join(REPO_ROOT, 'registry/manifest.json'), 'utf8'))
  const group = manifest.groups['opencode-scaffold']
  assert(group, 'opencode-scaffold group present')
  assert(group.files.length === 8, 'group has 8 files')
  assert(group.files.some((f) => /agents\/request-analyzer\.md$/.test(f.dst)), 'includes request-analyzer')
  assert(group.files.some((f) => /commands\/klp-design\.md$/.test(f.dst)), 'includes klp-design')
}
```

Register `testOpencodeScaffoldGroup()`.

- [ ] **Step 5: Run test**

Run: `node scripts/test-cli.mjs`

- [ ] **Step 6: Commit**

```bash
git add scripts/build-manifest.ts registry/manifest.json scripts/test-cli.mjs
git commit -m "feat(manifest): register opencode-scaffold group"
```

---

## Task 12: `cli/copy.mjs` — shared file-copy helpers

**Files:**
- Create: `cli/copy.mjs`

- [ ] **Step 1: Implement helpers (used by both klep-ds-init and add)**

```js
// cli/copy.mjs
// Shared file-copy helpers.

import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { join, dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { rewriteImports } from './rewrite.mjs'

const SELF_DIR = dirname(fileURLToPath(import.meta.url))
const REPO_ROOT = resolve(SELF_DIR, '..')

export async function loadFile(ref, srcPath) {
  if (ref === 'local') return readFile(join(REPO_ROOT, srcPath))
  const { fetchFile } = await import('./fetch.mjs')
  return fetchFile(ref, srcPath)
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
  const item = manifest.groups.components.items.find((c) => c.name === name)
  if (!item) throw new Error(`Unknown component: ${name}`)
  for (const f of item.files) {
    const raw = await loadFile(opts.ref ?? 'main', f.src)
    const transformed = applyTransforms(raw, f.dst, { ...opts, mode: 'attach' })
    await writeFileTo(join(dsRoot, 'src', f.dst), transformed)
  }
}

export async function copyDocOfComponent(manifest, name, docsRoot, opts = {}) {
  const docFile = manifest.groups.docs?.files?.find((f) => f.dst === `components/_index_${name}.md`)
  if (!docFile) return
  const raw = await loadFile(opts.ref ?? 'main', docFile.src)
  await writeFileTo(join(docsRoot, docFile.dst), raw)
}

export async function copyInstalledDocs(manifest, installedNames, brand, dstRoot, opts = {}) {
  const docs = manifest.groups.docs
  if (!docs) return
  const wantedRoot = new Set(['agent-brief.md', 'index.md', 'overview.md'])
  const wantedBrand = `brands/${brand}.md`
  for (const f of docs.files) {
    const compMatch = /^components\/_index_([a-z0-9-]+)\.md$/.exec(f.dst)
    const isToken = f.dst.startsWith('tokens/')
    const keep =
      (compMatch && installedNames.includes(compMatch[1])) ||
      f.dst === wantedBrand ||
      wantedRoot.has(f.dst) ||
      isToken
    if (!keep) continue
    const raw = await loadFile(opts.ref ?? 'main', f.src)
    await writeFileTo(join(dstRoot, f.dst), raw)
  }
}
```

- [ ] **Step 2: Commit**

```bash
git add cli/copy.mjs
git commit -m "feat(cli): add shared copy module for install operations"
```

---

## Task 13: `cli/klep-ds-init.mjs` — new binary

**Files:**
- Create: `cli/klep-ds-init.mjs`
- Modify: `package.json`
- Modify: `scripts/test-cli.mjs`

- [ ] **Step 1: Declare the new binary in `package.json`**

```json
{
  "bin": {
    "klp-ui": "cli/index.mjs",
    "klep-ds-init": "cli/klep-ds-init.mjs"
  }
}
```

- [ ] **Step 2: Append failing help test**

```js
function testKlepDsInitHelp() {
  console.log('\n[test] klep-ds-init help')
  const out = spawnSync('node', [join(REPO_ROOT, 'cli/klep-ds-init.mjs'), '--help'], { encoding: 'utf8' })
  assert(out.status === 0, 'klep-ds-init --help exits 0')
  assert(/Usage: klep-ds-init/.test(out.stdout), 'help shows binary name')
  assert(/--app-dir/.test(out.stdout), 'help lists --app-dir')
  assert(/--brand/.test(out.stdout), 'help lists --brand')
  assert(/--components/.test(out.stdout), 'help lists --components')
}
```

Register `testKlepDsInitHelp()`.

- [ ] **Step 3: Run test to verify it fails**

Run: `node scripts/test-cli.mjs`

- [ ] **Step 4: Implement `cli/klep-ds-init.mjs`**

```js
#!/usr/bin/env node
// cli/klep-ds-init.mjs
// Install klp-design-system into an existing project.

import { readFileSync, writeFileSync, existsSync } from 'node:fs'
import { join, relative } from 'node:path'
import { createInterface } from 'node:readline/promises'

import { detectReactApp } from './detect-app.mjs'
import { patchTsconfig, patchViteConfig } from './patch-config.mjs'
import { createInventory, writeInventory, resolveTransitive } from './inventory.mjs'
import { copyGroup, copyComponent, copyInstalledDocs } from './copy.mjs'

const HELP = `Usage: klep-ds-init [options]

Install klp-design-system into an existing project.

Options:
  --app-dir=<rel>      Sub-app directory (auto-detected if omitted)
  --brand=<name>       Brand: wireframe (default) | klub | atlas | showup
  --all                Install all components (skips picker)
  --minimal            Install only tokens+lib (skips picker)
  --components=<csv>   Install named components (skips picker)
  --no-config-patch    Skip tsconfig/vite alias injection
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
    else if (a === '--verbose') out.verbose = true
    else if (a.startsWith('--app-dir=')) out.appDir = a.slice(10)
    else if (a.startsWith('--brand=')) out.brand = a.slice(8)
    else if (a.startsWith('--components=')) out.components = a.slice(13).split(',')
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
  if (matches.length === 0) throw new Error('No React sub-app found. Pass --app-dir=<rel>.')

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
    const { fileURLToPath } = await import('node:url')
    const { dirname, resolve } = await import('node:path')
    const SELF_DIR = dirname(fileURLToPath(import.meta.url))
    const REPO_ROOT = resolve(SELF_DIR, '..')
    return JSON.parse(readFileSync(join(REPO_ROOT, 'registry/manifest.json'), 'utf8'))
  }
  const { fetchManifest } = await import('./fetch.mjs')
  return fetchManifest(ref)
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
      for (const item of group.items ?? []) {
        if (!installedSet.has(item.name)) continue
        for (const f of item.files) lock.files[f.dst] = { hash: f.hash, source: f.src, component: item.name }
      }
    } else if (group.files) {
      for (const f of group.files) lock.files[f.dst] = { hash: f.hash, source: f.src, group: groupName }
    }
  }
  writeFileSync(join(rootDir, 'klp.lock.json'), JSON.stringify(lock, null, 2) + '\n')
}

async function main() {
  const flags = parseFlags(process.argv.slice(2))
  if (flags.help) { console.log(HELP); process.exit(0) }

  const rootDir = process.cwd()
  if (!existsSync(join(rootDir, 'package.json'))) {
    console.error('No package.json at cwd — run klep-ds-init from your project root.')
    process.exit(2)
  }
  if (existsSync(join(rootDir, 'klp.lock.json')) && !flags.force) {
    console.error('klp.lock.json already exists. Use --force or run `klp-ui update`.')
    process.exit(2)
  }

  const ref = flags.ref ?? 'main'
  const manifest = await loadManifest(ref)

  const appDir = await chooseAppDir(rootDir, flags.appDir)
  const brand  = await chooseBrand(flags.brand)
  const catalog = (manifest.groups.components.items ?? []).map((c) => ({
    name: c.name,
    category: c.category ?? 'misc',
    deps: c.deps?.components ?? [],
  }))
  const chosen = await chooseScope(catalog, flags)

  const stagingInv = createInventory({
    ref, brand, appDir,
    dsDir: 'external/klp-design-system',
    catalog, initiallyInstalled: [],
  })
  const toInstall = resolveTransitive(stagingInv, chosen)
  if (flags.verbose) console.log(`Installing ${toInstall.length} components: ${toInstall.join(', ')}`)

  const dsRoot = join(rootDir, 'external/klp-design-system')

  await copyGroup(manifest, 'lib', dsRoot, { ref, mode: 'attach' })
  await copyGroup(manifest, 'tokens', dsRoot, { ref })
  for (const name of toInstall) await copyComponent(manifest, name, dsRoot, { ref })
  await copyGroup(manifest, 'opencode-scaffold', join(rootDir, '.opencode'), { ref, interpolate: { brand } })
  await copyInstalledDocs(manifest, toInstall, brand, join(rootDir, 'docs'), { ref })

  if (!flags.noConfigPatch) {
    const appAbs = join(rootDir, appDir)
    const rel = relative(appAbs, join(dsRoot, 'src'))
    const tsPath = join(appAbs, 'tsconfig.app.json')
    if (existsSync(tsPath)) writeFileSync(tsPath, patchTsconfig(readFileSync(tsPath, 'utf8'), rel))
    const vitePath = join(appAbs, 'vite.config.ts')
    if (existsSync(vitePath)) writeFileSync(vitePath, patchViteConfig(readFileSync(vitePath, 'utf8'), rel))
  }

  const finalInv = createInventory({
    ref, brand, appDir,
    dsDir: 'external/klp-design-system',
    catalog, initiallyInstalled: toInstall,
  })
  writeInventory(rootDir, finalInv)
  writeLockfile(rootDir, manifest, toInstall, ref, brand)

  console.log(`✓ Installed ${toInstall.length} components into external/klp-design-system/`)
  console.log(`✓ Agents + commands written to .opencode/`)
  console.log(`✓ Docs written to docs/`)
}

main().catch((e) => { console.error(e.message); process.exit(1) })
```

Make executable:
```bash
chmod +x cli/klep-ds-init.mjs
```

- [ ] **Step 5: Run help test**

Run: `node scripts/test-cli.mjs`
Expected: PASS `testKlepDsInitHelp`.

- [ ] **Step 6: Commit**

```bash
git add cli/klep-ds-init.mjs package.json scripts/test-cli.mjs
git commit -m "feat(cli): add klep-ds-init binary"
```

---

## Task 14: E2E test for klep-ds-init + promote `add` to real install

**Files:**
- Modify: `cli/index.mjs`
- Modify: `scripts/test-cli.mjs`

- [ ] **Step 1: Append E2E test for klep-ds-init**

```js
function testKlepDsInitE2E() {
  console.log('\n[test] klep-ds-init E2E')
  const fixtureSrc = join(REPO_ROOT, 'tests/fixtures/attach')
  const dir = mkdtempSync(join(tmpdir(), 'klp-attach-'))
  spawnSync('cp', ['-R', `${fixtureSrc}/.`, dir])

  const out = spawnSync('node', [
    join(REPO_ROOT, 'cli/klep-ds-init.mjs'),
    '--brand=wireframe',
    '--components=button',
    '--ref=local',
  ], { cwd: dir, encoding: 'utf8' })

  try {
    assert(out.status === 0, `klep-ds-init E2E exits 0 (stderr: ${out.stderr})`)
    assert(existsSync(join(dir, 'external/klp-design-system/src/components/button')), 'button installed')
    assert(existsSync(join(dir, 'external/klp-design-system/src/lib/cn.ts')), 'lib/cn.ts installed')
    assert(existsSync(join(dir, '.opencode/agents/request-analyzer.md')), 'opencode agent installed')
    assert(existsSync(join(dir, '.opencode/commands/klp-design.md')), 'opencode command installed')
    assert(existsSync(join(dir, 'docs/agent-brief.md')), 'docs/agent-brief.md installed')
    assert(existsSync(join(dir, 'klp.lock.json')), 'lockfile created')
    assert(existsSync(join(dir, 'klp-inventory.json')), 'inventory created')

    const ts = JSON.parse(readFileSync(join(dir, 'forge-output/04-app/tsconfig.app.json'), 'utf8'))
    assert(ts.compilerOptions.paths['@klp/*'][0].includes('external/klp-design-system/src'), 'tsconfig patched')

    const vite = readFileSync(join(dir, 'forge-output/04-app/vite.config.ts'), 'utf8')
    assert(/'@klp':\s*path\.resolve/.test(vite), 'vite patched')

    const inv = JSON.parse(readFileSync(join(dir, 'klp-inventory.json'), 'utf8'))
    assert(inv.components.button.status === 'installed', 'inventory shows button installed')
  } finally {
    rmSync(dir, { recursive: true, force: true })
  }
}
```

Register `testKlepDsInitE2E()`.

- [ ] **Step 2: Append E2E test for `klp-ui add`**

```js
function testAddCommandE2E() {
  console.log('\n[test] add command E2E')
  const fixtureSrc = join(REPO_ROOT, 'tests/fixtures/attach')
  const dir = mkdtempSync(join(tmpdir(), 'klp-add-e2e-'))
  spawnSync('cp', ['-R', `${fixtureSrc}/.`, dir])

  const init = spawnSync('node', [
    join(REPO_ROOT, 'cli/klep-ds-init.mjs'),
    '--brand=wireframe', '--components=button', '--ref=local',
  ], { cwd: dir, encoding: 'utf8' })
  assert(init.status === 0, `init succeeds (stderr: ${init.stderr})`)

  const add = spawnSync('node', [
    join(REPO_ROOT, 'cli/index.mjs'), 'add', 'input', '--ref=local',
  ], { cwd: dir, encoding: 'utf8' })

  try {
    assert(add.status === 0, `add succeeds (stderr: ${add.stderr})`)
    assert(existsSync(join(dir, 'external/klp-design-system/src/components/input')), 'input installed')

    const inv = JSON.parse(readFileSync(join(dir, 'klp-inventory.json'), 'utf8'))
    assert(inv.components.input.status === 'installed', 'inventory updated')
    assert(inv.components.button.status === 'installed', 'button still installed')
  } finally {
    rmSync(dir, { recursive: true, force: true })
  }
}
```

Register `testAddCommandE2E()`.

- [ ] **Step 3: Run tests — both should fail (add is still dry-run)**

Run: `node scripts/test-cli.mjs`
Expected: `testAddCommandE2E` FAILS (input not actually installed).

- [ ] **Step 4: Promote `add` in `cli/index.mjs` to a real install**

Replace the existing `case 'add':` block:

```js
case 'add': {
  const { planAdd } = await import('./add.mjs')
  const { copyComponent, copyDocOfComponent } = await import('./copy.mjs')
  const { writeInventory, markInstalled } = await import('./inventory.mjs')

  const positional = args.filter((a) => !a.startsWith('--'))
  const force = args.includes('--force')
  const json = args.includes('--json')
  const refFlag = args.find((a) => a.startsWith('--ref='))
  const ref = refFlag ? refFlag.slice(6) : 'main'

  const rootDir = process.cwd()
  const plan = planAdd({ rootDir, names: positional, force })

  if (plan.unknown.length) {
    console.error(`Unknown components: ${plan.unknown.join(', ')}`)
    process.exit(2)
  }
  if (!plan.toInstall.length) {
    console.log(`Nothing to install. Already installed: ${plan.alreadyInstalled.join(', ') || '(none)'}`)
    process.exit(0)
  }

  let manifest
  if (ref === 'local') {
    const { fileURLToPath } = await import('node:url')
    const { dirname, resolve, join: pathJoin } = await import('node:path')
    const SELF_DIR = dirname(fileURLToPath(import.meta.url))
    const REPO_ROOT = resolve(SELF_DIR, '..')
    const { readFileSync: readSync } = await import('node:fs')
    manifest = JSON.parse(readSync(pathJoin(REPO_ROOT, 'registry/manifest.json'), 'utf8'))
  } else {
    const { fetchManifest } = await import('./fetch.mjs')
    manifest = await fetchManifest(ref)
  }

  const dsRoot = join(rootDir, plan.inventory.dsDir)
  const docsRoot = join(rootDir, 'docs')

  for (const name of plan.toInstall) {
    await copyComponent(manifest, name, dsRoot, { ref })
    await copyDocOfComponent(manifest, name, docsRoot, { ref })
  }

  const updated = markInstalled(plan.inventory, plan.toInstall)
  writeInventory(rootDir, updated)

  if (json) console.log(JSON.stringify({ installed: plan.toInstall }, null, 2))
  else console.log(`✓ Installed: ${plan.toInstall.join(', ')}`)
  process.exit(0)
}
```

Note: this requires `join` to be imported at the top of `cli/index.mjs` if it isn't already.

- [ ] **Step 5: Run tests**

Run: `node scripts/test-cli.mjs`
Expected: PASS — both `testKlepDsInitE2E` and `testAddCommandE2E`.

- [ ] **Step 6: Commit**

```bash
git add cli/index.mjs scripts/test-cli.mjs
git commit -m "feat(cli): promote add subcommand to real install"
```

---

## Task 15: README + CLAUDE.md updates

**Files:**
- Modify: `README.md`
- Modify: `CLAUDE.md`

- [ ] **Step 1: Append a section to README**

```markdown
### Install into an existing project

```bash
cd path/to/your/project
npx github:BaptisteMo/klp-design-system klep-ds-init
```

Installs the design system into `external/klp-design-system/`, drops OpenCode-flavor agents into `.opencode/`, and patches your sub-app's `tsconfig.app.json` + `vite.config.ts` with a `@klp/*` alias.

Add or list components on demand:

```bash
klp-ui list                  # inventory
klp-ui add input badges      # install + transitive deps
klp-ui list --json           # machine-readable for agents
```
```

- [ ] **Step 2: Append a section to CLAUDE.md under "## CLI distribution workflow"**

```markdown
### Existing-project distribution (`klep-ds-init`)

For consumers who don't start fresh. Separate binary in the same npm package. Installs DS under `external/klp-design-system/`, puts agents at `.opencode/` (OpenCode flavor — distinct from `.claude/`), and writes `klp-inventory.json` at the consumer repo root so agents can compose `klp-ui add` calls against current install state. `klp-ui add <name>...` auto-resolves transitive component deps via the manifest.

Plan: `docs/superpowers/plans/2026-05-19-existing-project-distribution.md`.
```

- [ ] **Step 3: Commit**

```bash
git add README.md CLAUDE.md
git commit -m "docs: document klep-ds-init + klp-ui add/list"
```

---

## Final verification

After all 15 tasks land:

- [ ] **Run full test suite**

```bash
node scripts/test-cli.mjs
pnpm run build:manifest
pnpm run validate:manifest
```

Expected: all tests pass, manifest valid.

- [ ] **Manual E2E against forge-conflits**

```bash
cd /Users/morillonbaptiste/forge-conflits
node /Users/morillonbaptiste/klp-design-system/cli/klep-ds-init.mjs --brand=wireframe --ref=local
```

Verify:
- `external/klp-design-system/src/components/{...}/` exist
- `external/klp-design-system/src/lib/cn.ts` exists
- `external/klp-design-system/src/styles/tokens/*.css` exist
- `.opencode/agents/*.md` × 4 exist; each has `mode: subagent`
- `.opencode/commands/*.md` × 4 exist; each has `agent:` field
- `docs/agent-brief.md`, `docs/components/_index_<n>.md` exist
- `klp.lock.json` + `klp-inventory.json` at root
- `forge-output/04-app/tsconfig.app.json` has `"@klp/*"` path
- `forge-output/04-app/vite.config.ts` has `'@klp': path.resolve(__dirname, ...)`

Then:
```bash
node /Users/morillonbaptiste/klp-design-system/cli/index.mjs list
node /Users/morillonbaptiste/klp-design-system/cli/index.mjs add modal-variation data-table --ref=local
node /Users/morillonbaptiste/klp-design-system/cli/index.mjs list
```

Expected: list output correct; `add` installs the two components plus transitive `pagination` + `table`; second list shows them as installed.

- [ ] **Known parked item: Tailwind**

Components copied into forge-conflits will not render correctly until the Tailwind question is resolved (see "Open items deferred" in the design spec). Install plumbing is correct independent of that decision.

---

## Self-Review

**Spec coverage:** Every section of the design spec maps to a task — layout (Tasks 2/3/12/13), distribution surface (Tasks 6/7/8/13), `klep-ds-init` flow (Tasks 12/13), inventory schema (Task 4), add/list (Tasks 6/7/8/14), OpenCode scaffold (Tasks 9/10), manifest changes (Task 11), files-to-modify list (all tasks), verification (final section). Tailwind parked is preserved.

**Placeholder scan:** No "TBD" or "implement later". Each step has complete code or an exact shell command. Tasks 9 and 10 contain "body copied verbatim" directives because the source bodies in `cli/scaffold/claude/agents/*.md.tmpl` are long; the engineer copies them directly rather than the plan duplicating their contents.

**Type consistency:** `planAdd` returns `{ inventory, toInstall, alreadyInstalled, unknown }` (Task 7) — same shape consumed in Tasks 8 and 14. `createInventory` signature matches between Task 4 (definition) and Task 13 (consumption). `rewriteImports(source, dstRelPath, opts?)` signature matches between Task 5 definition and Task 12 consumption. `copyComponent` is defined in `cli/copy.mjs` (Task 12) and consumed in Tasks 13 and 14 with the same signature. `loadFile`/`writeFileTo` defined once in `cli/copy.mjs`.
