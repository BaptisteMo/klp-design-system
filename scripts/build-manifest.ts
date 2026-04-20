// scripts/build-manifest.ts
// Regenerates registry/manifest.json by scanning src/ and per-component registry entries.

import { readFileSync, writeFileSync, readdirSync, statSync, existsSync } from 'node:fs'
import { createHash } from 'node:crypto'
import { join, relative } from 'node:path'

const ROOT = process.cwd()
const MANIFEST_VERSION = '0.1.0'

const BRANDS = ['wireframe', 'klub', 'atlas', 'showup']

// Components that ship to the flat `src/components/<name>.tsx` path (not under ui/).
const FLAT_COMPONENTS = new Set(['brand-provider'])

type ManifestFile = { src: string; dst: string; hash: string; template?: boolean }
type ComponentManifest = {
  files: ManifestFile[]
  deps: { npm: string[]; components: string[] }
}

function sha256(content: Buffer | string): string {
  return 'sha256:' + createHash('sha256').update(content).digest('hex')
}

function hashFile(path: string): string {
  return sha256(readFileSync(path))
}

function walkDir(dir: string): string[] {
  const out: string[] = []
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry)
    if (statSync(full).isDirectory()) out.push(...walkDir(full))
    else out.push(full)
  }
  return out
}

function buildTokenGroup(): { files: ManifestFile[] } {
  const files: ManifestFile[] = [
    'src/styles/tokens.css',
    'src/styles/tokens/primitives.css',
    'src/styles/tokens/aliases.css',
    'src/styles/tokens/theme.css',
  ].map((p) => ({
    src: p,
    dst: p,
    hash: hashFile(join(ROOT, p)),
  }))
  return { files }
}

function buildLibGroup(): { files: ManifestFile[] } {
  return {
    files: [
      { src: 'src/lib/cn.ts', dst: 'src/lib/cn.ts', hash: hashFile(join(ROOT, 'src/lib/cn.ts')) },
    ],
  }
}

function buildComponentsGroup(): { items: Record<string, ComponentManifest> } {
  const srcDir = join(ROOT, 'src/components')
  const items: Record<string, ComponentManifest> = {}
  const registryDir = join(ROOT, 'registry')

  for (const name of readdirSync(srcDir)) {
    const full = join(srcDir, name)
    if (!statSync(full).isDirectory()) continue
    const files = walkDir(full)
      .filter((p) => /\.(tsx?|css)$/.test(p))
      .filter((p) => !/\.example\.tsx$/.test(p))
      .map((p) => {
        const relSrc = relative(ROOT, p).replace(/\\/g, '/')
        const dst = FLAT_COMPONENTS.has(name)
          ? relSrc.replace(
              /^src\/components\/([^/]+)\/([^/]+)\.tsx$/,
              (_, n) => `src/components/${n}.tsx`,
            )
          : relSrc.replace(/^src\/components\//, 'src/components/ui/')
        return { src: relSrc, dst, hash: hashFile(p) }
      })

    // Parse registry file for deps hints (npm + component)
    const registryFile = join(registryDir, `${name}.json`)
    const deps = { npm: [] as string[], components: [] as string[] }
    if (existsSync(registryFile)) {
      const reg = JSON.parse(readFileSync(registryFile, 'utf8'))
      if (reg.meta?.radixPrimitive) deps.npm.push(reg.meta.radixPrimitive)
      if (Array.isArray(reg.dependencies?.npm)) deps.npm.push(...reg.dependencies.npm)
      if (Array.isArray(reg.dependencies?.components)) deps.components.push(...reg.dependencies.components)
    }
    // dedupe
    deps.npm = [...new Set(deps.npm)].sort()
    deps.components = [...new Set(deps.components)].sort()

    items[name] = { files, deps }
  }

  // brand-provider is handled by the same scan (if present under src/components/brand-provider/)
  return { items }
}

function buildScaffoldGroup(): { files: ManifestFile[] } {
  const dir = join(ROOT, 'cli/scaffold')
  const entries = walkDir(dir).map((p) => {
    const relSrc = relative(ROOT, p).replace(/\\/g, '/')
    const tmplName = relSrc.replace(/^cli\/scaffold\//, '')
    const dst = tmplToDst(tmplName)
    return { src: relSrc, dst, hash: hashFile(p), template: /\.tmpl$/.test(relSrc) }
  })
  return { files: entries }
}

function tmplToDst(tmpl: string): string {
  const mapping: Record<string, string> = {
    'package.json.tmpl': 'package.json',
    'vite.config.ts.tmpl': 'vite.config.ts',
    'tsconfig.json.tmpl': 'tsconfig.json',
    'tsconfig.node.json.tmpl': 'tsconfig.node.json',
    'index.html.tmpl': 'index.html',
    'main.tsx.tmpl': 'src/main.tsx',
    'App.tsx.tmpl': 'src/App.tsx',
    'index.css.tmpl': 'src/index.css',
    'gitignore.tmpl': '.gitignore',
    'claude/CLAUDE.md.tmpl': '.claude/CLAUDE.md',
    'claude/agents/.gitkeep': '.claude/agents/.gitkeep',
    'claude/skills/.gitkeep': '.claude/skills/.gitkeep',
  }
  return mapping[tmpl] ?? tmpl
}

function buildClaudeGroup(): { files: ManifestFile[] } {
  // Claude files are sourced from cli/scaffold/claude/* — declared in scaffold group already.
  // Leaving group empty (reserved for future agent/skill files fetched from .claude/).
  return { files: [] }
}

function main() {
  const manifest = {
    version: MANIFEST_VERSION,
    generatedAt: new Date().toISOString(),
    ref: 'main',
    brands: BRANDS,
    groups: {
      tokens: { required: true, ...buildTokenGroup() },
      lib: { required: true, ...buildLibGroup() },
      components: { required: true, ...buildComponentsGroup() },
      claude: { required: false, ...buildClaudeGroup() },
      scaffold: { required: true, ...buildScaffoldGroup() },
    },
  }

  const out = join(ROOT, 'registry/manifest.json')
  writeFileSync(out, JSON.stringify(manifest, null, 2) + '\n')
  console.log(`Wrote ${out}`)
  console.log(`  ${Object.keys(manifest.groups.components.items).length} components`)
  console.log(`  ${manifest.groups.scaffold.files.length} scaffold files`)
  console.log(`  ${manifest.groups.tokens.files.length + manifest.groups.lib.files.length} token+lib files`)
}

main()
