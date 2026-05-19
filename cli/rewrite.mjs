// cli/rewrite.mjs
// Rewrite DS-repo import paths to consumer layout.
//   fresh mode: `@/components/<name>/` → `@/components/ui/<name>/`
//   attach mode: `@/components/<name>/` → `@klp/components/<name>/` (also @/lib/* → @klp/lib/*)
// Exceptions (fresh only): `@/components/brand-provider` stays flat (not under ui/).

const FLAT_COMPONENTS = new Set(['brand-provider'])

/**
 * @param {string} source raw file content
 * @param {string} dstPath consumer path (post-rewrite) — used to skip rewriting files outside components
 * @param {{ mode?: 'fresh' | 'attach' }} [opts]
 * @returns {string}
 */
export function rewriteImports(source, dstPath, opts = {}) {
  if (!/\.(ts|tsx)$/.test(dstPath)) return source
  const mode = opts.mode ?? 'fresh'

  if (mode === 'attach') {
    return source
      .replace(/(['"])@\/components\/([a-z0-9-]+)\1/g, (_m, q, n) => `${q}@klp/components/${n}${q}`)
      .replace(/(['"])@\/lib\/([a-z0-9-]+)\1/g, (_m, q, n) => `${q}@klp/lib/${n}${q}`)
  }

  // fresh (default): preserve existing behavior
  return source.replace(
    /(['"])@\/components\/(?!ui\/)([a-z0-9-]+)/g,
    (match, quote, name) => {
      if (FLAT_COMPONENTS.has(name)) return match
      return `${quote}@/components/ui/${name}`
    },
  )
}
