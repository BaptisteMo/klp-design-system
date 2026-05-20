// cli/patch-config.mjs
// Idempotent edits to inject @klp/* alias into tsconfig.app.json + vite.config.ts.

export function patchTsconfig(source, relPath) {
  const json = JSON.parse(source)
  json.compilerOptions ??= {}
  json.compilerOptions.paths ??= {}
  const existing = json.compilerOptions.paths['@klp/*']
  const wanted = [`${relPath}/*`]
  const includeEntry = `${relPath}/**/*`

  const aliasOk = Array.isArray(existing) && existing[0] === wanted[0]
  const includeOk = Array.isArray(json.include) && json.include.includes(includeEntry)
  if (aliasOk && includeOk) return source

  json.compilerOptions.paths['@klp/*'] = wanted
  if (!json.compilerOptions.baseUrl) json.compilerOptions.baseUrl = '.'

  // Include the DS source so TS type-checks @klp imports against the local
  // node_modules (otherwise resolution falls back up the filesystem tree).
  json.include ??= []
  if (!json.include.includes(includeEntry)) json.include.push(includeEntry)

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
