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
      .filter((p) => !(FLAT_COMPONENTS.has(name) && /\/index\.ts$/.test(p)))
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

function buildDocsGroup(): { files: ManifestFile[]; brandFiles: (ManifestFile & { brand: string })[] } {
  const files: ManifestFile[] = []
  const simple = [
    'docs/agent-brief.md',
    'docs/index.md',
    'docs/overview.md',
    'docs/tokens/_index_tokens.md',
    'docs/tokens/colors.md',
    'docs/tokens/radius.md',
    'docs/tokens/spacing.md',
    'docs/tokens/typography.md',
    'docs/brands/_index_brands.md',
  ]
  for (const p of simple) {
    if (!existsSync(join(ROOT, p))) continue
    files.push({ src: p, dst: p, hash: hashFile(join(ROOT, p)) })
  }
  const compDir = join(ROOT, 'docs/components')
  if (existsSync(compDir)) {
    for (const entry of readdirSync(compDir)) {
      if (!/^_index_.*\.md$/.test(entry)) continue
      const p = `docs/components/${entry}`
      files.push({ src: p, dst: p, hash: hashFile(join(ROOT, p)) })
    }
  }
  const brandFiles: (ManifestFile & { brand: string })[] = []
  const brandDir = join(ROOT, 'docs/brands')
  if (existsSync(brandDir)) {
    for (const entry of readdirSync(brandDir)) {
      if (!/^(klub|atlas|showup|wireframe)\.md$/.test(entry)) continue
      const brand = entry.replace(/\.md$/, '')
      const p = `docs/brands/${entry}`
      brandFiles.push({ src: p, dst: p, hash: hashFile(join(ROOT, p)), brand })
    }
  }
  return { files, brandFiles }
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
    'claude/CLAUDE.md.tmpl': 'CLAUDE.md',
    'claude/agents/.gitkeep': '.claude/agents/.gitkeep',
    'claude/skills/.gitkeep': '.claude/skills/.gitkeep',
    'claude/agents/request-analyzer.md.tmpl': '.claude/agents/request-analyzer.md',
    'claude/agents/ad-hoc-builder.md.tmpl': '.claude/agents/ad-hoc-builder.md',
    'claude/agents/mockup-composer.md.tmpl': '.claude/agents/mockup-composer.md',
    'claude/agents/design-finalizer.md.tmpl': '.claude/agents/design-finalizer.md',
    'claude/commands/klp-design.md.tmpl': '.claude/commands/klp-design.md',
    'claude/commands/klp-design-review.md.tmpl': '.claude/commands/klp-design-review.md',
    'claude/commands/klp-design-validate.md.tmpl': '.claude/commands/klp-design-validate.md',
    'claude/commands/klp-design-reset.md.tmpl': '.claude/commands/klp-design-reset.md',
    'mockups/_index.tsx.tmpl': 'src/mockups/_index.tsx',
    'requests/pending/.gitkeep': 'requests/pending/.gitkeep',
    'requests/to-be-review/.gitkeep': 'requests/to-be-review/.gitkeep',
    'requests/to-be-validate/.gitkeep': 'requests/to-be-validate/.gitkeep',
    'requests/processed/.gitkeep': 'requests/processed/.gitkeep',
  }
  return mapping[tmpl] ?? tmpl
}

function buildClaudeGroup(): { files: ManifestFile[] } {
  // Claude files are sourced from cli/scaffold/claude/* — declared in scaffold group already.
  // Leaving group empty (reserved for future agent/skill files fetched from .claude/).
  return { files: [] }
}

function main() {
  const docs = buildDocsGroup()
  const manifest = {
    version: MANIFEST_VERSION,
    generatedAt: new Date().toISOString(),
    ref: 'main',
    brands: BRANDS,
    groups: {
      tokens: { required: true, ...buildTokenGroup() },
      lib: { required: true, ...buildLibGroup() },
      components: { required: true, ...buildComponentsGroup() },
      docs: { required: true, files: docs.files, brandFiles: docs.brandFiles },
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
