#!/usr/bin/env node
// klp-doc-rules-validator — deterministic structural checks on component docs.
// Usage: node validate-doc-rules.mjs <component|--all> [--fix]

import { readFile, writeFile } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const SCRIPT_DIR = dirname(fileURLToPath(import.meta.url))
const REPO_ROOT = process.env.CLAUDE_PROJECT_DIR ?? process.cwd()

/** Convert kebab-case component name to PascalCase file stem. */
export function pascalName(kebab) {
  return kebab.split('-').map(s => s[0].toUpperCase() + s.slice(1)).join('')
}

/**
 * Parse the exported Props interface from a component source string.
 * Returns { propsInterface, props: [{name, type, hasPropClass, propClass, derivedFrom, description}] }.
 * Handles both semicolon-terminated and newline-terminated prop declarations.
 */
export function parsePropsInterface(source) {
  // Extract the interface body with brace counting to handle nested generics
  const ifaceStart = source.match(/export\s+interface\s+(\w*Props)\s*(?:extends[^{]+)?\{/)
  if (!ifaceStart) return { propsInterface: null, props: [] }
  const name = ifaceStart[1]
  const startIdx = ifaceStart.index + ifaceStart[0].length
  let depth = 1
  let endIdx = startIdx
  while (endIdx < source.length && depth > 0) {
    if (source[endIdx] === '{') depth++
    else if (source[endIdx] === '}') depth--
    endIdx++
  }
  const body = source.slice(startIdx, endIdx - 1)

  const props = []
  // Line-by-line state machine: accumulate jsdoc lines, then emit a prop when we see it.
  // Track bracket depth across lines so nested inline types (e.g. `Array<{ value: string }>`)
  // do NOT have their members mis-parsed as top-level props.
  const lines = body.split('\n')
  let jsdocLines = []
  let inJsdoc = false
  let bracketDepth = 0

  const updateDepth = (s) => {
    // Strip string literals before counting brackets.
    const clean = s.replace(/'[^']*'|"[^"]*"|`[^`]*`/g, '')
    for (const ch of clean) {
      if (ch === '{' || ch === '[' || ch === '(' || ch === '<') bracketDepth++
      else if (ch === '}' || ch === ']' || ch === ')' || ch === '>') bracketDepth--
    }
  }

  for (const line of lines) {
    const stripped = line.trim()
    if (!stripped) continue

    // Track JSDoc blocks — JSDoc content never affects bracket depth.
    if (stripped.startsWith('/**')) {
      inJsdoc = true
      jsdocLines = [stripped]
      if (stripped.endsWith('*/')) inJsdoc = false
      continue
    }
    if (inJsdoc) {
      jsdocLines.push(stripped)
      if (stripped.endsWith('*/')) inJsdoc = false
      continue
    }

    // Standalone `// comment` line — skip, but clear any accumulated jsdoc.
    if (stripped.startsWith('//')) {
      jsdocLines = []
      continue
    }

    // Only emit a prop when this line STARTS at top-level (depth 0).
    const depthAtLineStart = bracketDepth
    updateDepth(stripped)

    if (depthAtLineStart !== 0) {
      // Inside a nested type body — skip without touching jsdoc accumulator.
      continue
    }

    // Prop line: `name?: type` optionally followed by `;`
    const propMatch = stripped.match(/^(\w[\w\d]*)\s*(\??):\s*(.+?)\s*;?\s*$/)
    if (!propMatch) {
      jsdocLines = []
      continue
    }
    const [, propName, , type] = propMatch

    // Build jsdoc string from accumulated lines
    const jsdoc = jsdocLines
      .join('\n')
      .replace(/^\/\*\*/, '')
      .replace(/\*\/$/, '')
      .split('\n')
      .map(l => l.replace(/^\s*\*\s?/, ''))
      .join('\n')

    const propClassMatch = jsdoc.match(/@propClass\s+(required|optional|computed|persistent)\b/)
    const derivedFromMatch = jsdoc.match(/@derivedFrom\s+([^\n*]+)/)
    const description = jsdoc
      .split('\n')
      .filter(l => l.trim() && !l.trim().startsWith('@'))
      .join(' ')
      .trim()

    props.push({
      name: propName,
      type: type.trim(),
      hasPropClass: Boolean(propClassMatch),
      propClass: propClassMatch ? propClassMatch[1] : null,
      derivedFrom: derivedFromMatch ? derivedFromMatch[1].trim() : null,
      description,
    })

    jsdocLines = []
  }
  return { propsInterface: name, props }
}

/**
 * Extract the content of a balanced `{ ... }` block starting at `startIdx` in `source`.
 * Returns the inner content (without the outer braces).
 */
function extractBraceBlock(source, startIdx) {
  let depth = 0
  let i = startIdx
  while (i < source.length) {
    if (source[i] === '{') { if (depth === 0) { depth = 1; i++; continue } depth++ }
    else if (source[i] === '}') { depth--; if (depth === 0) return source.slice(startIdx + 1, i) }
    i++
  }
  return null
}

/**
 * Detect whether any cva() call in the source declares a non-empty `state` variant axis.
 * Uses brace-counting to handle multi-line nested variant objects.
 */
export function hasCvaStateAxis(source) {
  // Find `variants: {` and extract the full block with brace counting
  const variantsRe = /\bvariants\s*:\s*\{/g
  let m
  while ((m = variantsRe.exec(source)) !== null) {
    const blockStart = m.index + m[0].length - 1 // points at the `{`
    const body = extractBraceBlock(source, blockStart)
    if (!body) continue
    // Now check if `state:` exists as a key within this body
    const stateRe = /\bstate\s*:\s*\{/g
    let sm
    while ((sm = stateRe.exec(body)) !== null) {
      const stateBlockStart = sm.index + sm[0].length - 1
      const stateBody = extractBraceBlock(body, stateBlockStart)
      if (stateBody && /\w/.test(stateBody.trim())) return true
    }
  }
  return false
}

/**
 * Split a markdown table row on unescaped `|` characters.
 * Handles `\|` inside cells (e.g. union types like `'a' \| 'b'`).
 */
function splitTableRow(line) {
  // Replace escaped pipes temporarily, split on real pipes, restore
  const PLACEHOLDER = '\x00'
  const safe = line.replace(/\\\|/g, PLACEHOLDER)
  const parts = safe.split('|').map(s => s.replace(new RegExp(PLACEHOLDER, 'g'), '\\|').trim())
  // Remove first and last empty strings produced by leading/trailing `|`
  if (parts[0] === '') parts.shift()
  if (parts[parts.length - 1] === '') parts.pop()
  return parts
}

/**
 * Parse the first markdown table under a `## <heading>` section.
 */
export function extractTable(doc, heading) {
  const sectionRe = new RegExp(`^## ${heading}\\s*$([\\s\\S]*?)(?=^## |\\Z)`, 'm')
  const sectionMatch = doc.match(sectionRe)
  if (!sectionMatch) return null
  const section = sectionMatch[1]
  const lines = section.split('\n').map(l => l.trim())
  const start = lines.findIndex(l => l.startsWith('| '))
  if (start < 0) return null
  const headers = splitTableRow(lines[start])
  const rows = []
  for (let i = start + 2; i < lines.length; i++) {
    if (!lines[i].startsWith('|')) break
    const cells = splitTableRow(lines[i])
    if (cells.length === headers.length) rows.push(cells)
  }
  return { headers, rows }
}

// --- R1 ---

const PROPS_USAGE_STUB = `## Props usage

| Prop | Class | Type | Default | Description |
|---|---|---|---|---|

`

export function checkR1(doc) {
  const passed = /^## Props usage\s*$/m.test(doc)
  return { rule: 'R1', passed, fixable: true }
}

// --- R2 ---

export function checkR2(doc) {
  const table = extractTable(doc, 'Props usage')
  if (!table) return { rule: 'R2', passed: true, fixable: true, emptyRows: [] }
  const classIdx = table.headers.findIndex(h => h === 'Class')
  if (classIdx < 0) return { rule: 'R2', passed: false, fixable: false, emptyRows: [], hint: 'no Class column header' }
  const emptyRows = []
  for (const row of table.rows) {
    const cell = row[classIdx] ?? ''
    if (cell.trim() === '') {
      const prop = (row[0] ?? '').replace(/`/g, '').trim()
      emptyRows.push({ prop })
    }
  }
  return { rule: 'R2', passed: emptyRows.length === 0, fixable: true, emptyRows }
}

// --- R3 ---

const DODONT_STUB = `### Do / Don't

**Do:** Let the component auto-derive its own state when a \`computed\` prop is involved. Pass \`persistent\` props for user-owned semantic states (current page, selected row).

**Don't:** Hardcode a \`computed\` prop in real forms — it freezes the visual state and breaks interactive transitions.

`

export function checkR3(doc) {
  const table = extractTable(doc, 'Props usage')
  const needsBlock = table
    ? table.rows.some(row => /\*\*(computed|persistent)\*\*/.test(row[1] ?? ''))
    : false
  const hasBlock = /^### Do \/ Don't/m.test(doc)
  if (needsBlock && !hasBlock) return { rule: 'R3', passed: false, fixable: true, action: 'insert' }
  if (!needsBlock && hasBlock) return { rule: 'R3', passed: false, fixable: true, action: 'remove' }
  return { rule: 'R3', passed: true, fixable: true, action: null }
}

// --- R4 ---

const CLASS_B_BLOCKQUOTE = `> The \`state\` column below documents visual appearances driven by CSS pseudo-classes
> (\`:hover\`, \`:focus\`, \`:disabled\`) or the Radix \`data-state\` attribute. It is NOT a
> runtime prop — the component derives it automatically.

`

export function checkR4(source, doc) {
  const hasAxis = hasCvaStateAxis(source)
  const { props } = parsePropsInterface(source)
  const hasStateProp = props.some(p => p.name === 'state')
  const needsBlock = hasAxis && !hasStateProp
  const hasBlock = /^> The `state` column below/m.test(doc)
  if (needsBlock && !hasBlock) return { rule: 'R4', passed: false, fixable: true, action: 'insert' }
  if (!needsBlock && hasBlock) return { rule: 'R4', passed: false, fixable: true, action: 'remove' }
  return { rule: 'R4', passed: true, fixable: true, action: null }
}

// --- R5 ---

export function checkR5(source) {
  const { props } = parsePropsInterface(source)
  const missing = props
    .filter(p => !p.hasPropClass)
    .map(p => ({ prop: p.name, hint: `source declares prop '${p.name}' without @propClass JSDoc tag` }))
  return { rule: 'R5', passed: missing.length === 0, fixable: false, missing }
}

// --- Auto-fix ---

export function applyAutoFixes(doc, violations) {
  let out = doc
  const fixes = []
  for (const v of violations) {
    if (v.rule === 'R1') {
      if (/^## Tokens\s*$/m.test(out)) {
        out = out.replace(/^## Tokens\s*$/m, PROPS_USAGE_STUB + '\n## Tokens')
      } else {
        out = out.trimEnd() + '\n\n' + PROPS_USAGE_STUB
      }
      fixes.push({ rule: 'R1', hint: 'inserted empty Props usage section' })
    }
    if (v.rule === 'R2') {
      for (const row of v.emptyRows) {
        const rowRe = new RegExp(`(\\|\\s*\`${row.prop}\`\\s*\\|)\\s*(\\|)`, 'g')
        out = out.replace(rowRe, `$1 optional $2`)
      }
      fixes.push({ rule: 'R2', hint: `filled ${v.emptyRows.length} empty Class cell(s) with "optional"` })
    }
    if (v.rule === 'R3' && v.action === 'insert') {
      const sectionRe = /(## Props usage[\s\S]*?)(\n## )/m
      if (sectionRe.test(out)) {
        out = out.replace(sectionRe, `$1\n${DODONT_STUB}$2`)
      } else {
        out = out.trimEnd() + '\n\n' + DODONT_STUB
      }
      fixes.push({ rule: 'R3', hint: "inserted Do / Don't block" })
    }
    if (v.rule === 'R3' && v.action === 'remove') {
      out = out.replace(/^### Do \/ Don't[\s\S]*?(?=^## |\Z)/m, '')
      fixes.push({ rule: 'R3', hint: "removed extraneous Do / Don't block" })
    }
    if (v.rule === 'R4' && v.action === 'insert') {
      out = out.replace(/^## Variants\s*$/m, `${CLASS_B_BLOCKQUOTE}## Variants`)
      fixes.push({ rule: 'R4', hint: 'inserted Class B blockquote above ## Variants' })
    }
    if (v.rule === 'R4' && v.action === 'remove') {
      out = out.replace(/^> The `state` column below[\s\S]*?\n\n/m, '')
      fixes.push({ rule: 'R4', hint: 'removed extraneous Class B blockquote' })
    }
  }
  return { fixed: out, fixes }
}

// --- CLI ---

async function runOne(component, { fix }) {
  const pascal = pascalName(component)
  const sourcePath = resolve(REPO_ROOT, `src/components/${component}/${pascal}.tsx`)
  const docPath = resolve(REPO_ROOT, `docs/components/_index_${component}.md`)
  if (!existsSync(sourcePath) || !existsSync(docPath)) {
    return { component, passed: false, rulesChecked: 0, autoFixed: [], mismatches: [{ rule: '*', hint: `missing source or doc file for ${component}` }], warnings: [] }
  }
  const source = await readFile(sourcePath, 'utf8')
  let doc = await readFile(docPath, 'utf8')

  const collected = []
  const r1 = checkR1(doc); if (!r1.passed) collected.push(r1)
  const r2 = checkR2(doc); if (!r2.passed) collected.push(r2)
  const r3 = checkR3(doc); if (!r3.passed) collected.push(r3)
  const r4 = checkR4(source, doc); if (!r4.passed) collected.push(r4)
  const r5 = checkR5(source)

  const autoFixed = []
  const mismatches = []

  if (fix && collected.length > 0) {
    const fixable = collected.filter(v => v.fixable)
    const { fixed, fixes } = applyAutoFixes(doc, fixable)
    if (fixes.length > 0) {
      const notes = doc.match(/<!-- KLP:NOTES:BEGIN -->[\s\S]*?<!-- KLP:NOTES:END -->/)
      let out = fixed
      if (notes && !out.includes(notes[0])) {
        out = out.replace(/<!-- KLP:NOTES:BEGIN -->[\s\S]*?<!-- KLP:NOTES:END -->/, notes[0])
      }
      await writeFile(docPath, out)
      doc = out
      for (const f of fixes) autoFixed.push({ ...f, component })
    }
  }

  for (const v of [checkR1(doc), checkR2(doc), checkR3(doc), checkR4(source, doc)]) {
    if (!v.passed) {
      if (!fix || !v.fixable) mismatches.push({ rule: v.rule, component, hint: v.hint ?? 'rule failed' })
    }
  }
  if (!r5.passed) {
    for (const m of r5.missing) mismatches.push({ rule: 'R5', component, prop: m.prop, hint: m.hint })
  }

  return {
    component,
    passed: mismatches.length === 0,
    rulesChecked: 5,
    autoFixed,
    mismatches,
    warnings: [],
  }
}

async function runAll({ fix }) {
  const manifestPath = resolve(REPO_ROOT, 'klp-components.json')
  if (!existsSync(manifestPath)) {
    console.error('klp-components.json not found')
    process.exit(2)
  }
  const manifest = JSON.parse(await readFile(manifestPath, 'utf8'))
  // Skip utility/exempt components (e.g. brand-provider) — no doc page by design.
  const components = Array.isArray(manifest.components)
    ? manifest.components.filter(c => !c.exemptFromFigmaPipeline).map(c => c.name)
    : Object.entries(manifest.components ?? {})
        .filter(([, c]) => !c.exemptFromFigmaPipeline)
        .map(([name]) => name)
  const results = []
  for (const name of components) {
    results.push(await runOne(name, { fix }))
  }
  return {
    component: '--all',
    passed: results.every(r => r.passed),
    rulesChecked: 5,
    autoFixed: results.flatMap(r => r.autoFixed),
    mismatches: results.flatMap(r => r.mismatches),
    warnings: results.flatMap(r => r.warnings),
  }
}

async function main() {
  const args = process.argv.slice(2)
  if (args.length === 0) {
    console.error('usage: validate-doc-rules.mjs <component|--all> [--fix]')
    process.exit(2)
  }
  const fix = args.includes('--fix')
  const positional = args.find(a => !a.startsWith('--'))
  try {
    const out = positional === '--all' || args[0] === '--all'
      ? await runAll({ fix })
      : await runOne(positional, { fix })
    console.log(JSON.stringify(out, null, 2))
    process.exit(out.passed ? 0 : 1)
  } catch (err) {
    console.error(err.stack || String(err))
    process.exit(2)
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main()
}
