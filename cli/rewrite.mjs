// cli/rewrite.mjs
// Rewrite DS-repo import paths to consumer layout.
//   `@/components/<name>/` → `@/components/ui/<name>/`
// Exceptions: `@/components/brand-provider` stays flat (not under ui/).

const FLAT_COMPONENTS = new Set(['brand-provider'])

/**
 * @param {string} source raw file content
 * @param {string} dstPath consumer path (post-rewrite) — used to skip rewriting files outside components
 * @returns {string}
 */
export function rewriteImports(source, dstPath) {
  // Only rewrite in .ts/.tsx files
  if (!/\.(ts|tsx)$/.test(dstPath)) return source

  // Match `from '@/components/<name>` and `from "@/components/<name>`
  // Negative lookahead (?!ui\/) prevents double-rewrite of already-migrated imports
  return source.replace(
    /(['"])@\/components\/(?!ui\/)([a-z0-9-]+)/g,
    (match, quote, name) => {
      if (FLAT_COMPONENTS.has(name)) return match
      return `${quote}@/components/ui/${name}`
    },
  )
}
