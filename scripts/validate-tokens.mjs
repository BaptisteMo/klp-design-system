#!/usr/bin/env node
// klp token validator — verifies that a component's source uses the right
// semantic alias tokens for each (layer × state × property) as bound in spec.json.
// Usage: node scripts/validate-tokens.mjs <component-name>

import fs from 'node:fs'
import path from 'node:path'

// ---------------------------------------------------------------------------
// State-name → Tailwind selector prefix, per Radix primitive
// ---------------------------------------------------------------------------
const STATE_MAP = {
  '@radix-ui/react-checkbox': {
    rest: '', hover: 'hover:', focus: 'focus-visible:',
    clicked: 'data-[state=checked]:',
    mixed:   'data-[state=indeterminate]:',
    disable: 'data-[disabled]:',
  },
  '@radix-ui/react-switch': {
    rest: '', hover: 'hover:', focus: 'focus-visible:',
    clicked:     'data-[state=checked]:',
    'toggle-on': 'data-[state=checked]:',
    'toggle-off': '', // base (unchecked is the default Radix state)
    disable: 'data-[disabled]:',
  },
  '@radix-ui/react-toggle': {
    rest: '', hover: 'hover:', focus: 'focus-visible:',
    on: 'data-[state=on]:', off: 'data-[state=off]:',
    disable: 'data-[disabled]:',
  },
  '@radix-ui/react-accordion': {
    rest: '', hover: 'hover:',
    open: 'data-[state=open]:', closed: 'data-[state=closed]:',
  },
}

// Generic fallback: native buttons / Slot-based components / no Radix state.
const GENERIC_STATE_MAP = {
  rest:    '',
  hover:   'hover:',
  focus:   'focus-visible:',
  clicked: 'active:',
  active:  'active:',
  disable: 'disabled:',
  pressed: 'data-[pressed]:',
}

// ---------------------------------------------------------------------------
// Spec property → Tailwind utility prefix
// Accepts both vocabularies (Checkbox-style + Button-style).
// ---------------------------------------------------------------------------
const PROPERTY_TO_PREFIX = {
  fill:          'bg-',
  background:    'bg-',
  stroke:        'border-',
  borderColor:   'border-',
  color:         'text-',
  cornerRadius:  'rounded-',
  borderRadius:  'rounded-',
  paddingTop:    'pt-',
  paddingRight:  'pr-',
  paddingBottom: 'pb-',
  paddingLeft:   'pl-',
  paddingX:      'px-',
  paddingY:      'py-',
  gap:           'gap-',
  width:         'w-',
  height:        'h-',
  fontFamily:    'font-',
  fontWeight:    'font-',
  fontSize:      'text-',
}

const PADDING_PER_SIDE = ['paddingTop', 'paddingRight', 'paddingBottom', 'paddingLeft']

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
function tokenSuffix(token) {
  return token.replace(/^--/, '')
}

// Convert a klp CSS variable (e.g. "--klp-radius-m") + spec property to the
// Tailwind utility class string (e.g. "rounded-klp-m").
//
// theme.css remaps the alias namespace into Tailwind's own namespaces:
//   --klp-bg-X         → --color-klp-bg-X         → bg-klp-bg-X        (suffix kept as-is)
//   --klp-fg-X         → --color-klp-fg-X         → text-klp-fg-X      (suffix kept as-is)
//   --klp-border-X     → --color-klp-border-X     → border-klp-border-X(suffix kept as-is)
//   --klp-size-X       → --spacing-klp-size-X     → p-klp-size-X       (suffix kept as-is)
//   --klp-radius-X     → --radius-klp-X           → rounded-klp-X      ⚠ "radius-" stripped
//   --klp-font-family-X→ --font-klp-X             → font-klp-X         ⚠ "font-family-" stripped
//   --klp-font-weight-X→ --font-weight-klp-X      → font-klp-X         ⚠ "font-weight-" stripped
//   --klp-font-size-X  → --text-klp-X             → text-klp-X         ⚠ "font-size-" stripped
function tokenToUtility(token, property) {
  const prefix = PROPERTY_TO_PREFIX[property]
  if (!prefix) return null
  let suffix = tokenSuffix(token) // "klp-bg-default" or "klp-radius-m" or "klp-font-size-text-medium"
  // Strip Tailwind-namespace prefixes that don't appear in the utility class.
  suffix = suffix.replace(/^klp-(radius|font-family|font-weight|font-size)-/, 'klp-')
  return prefix + suffix
}

// V1-laxest: accept the utility appearing anywhere in the layer's cva, with
// any state selector prefix or none. Token-correctness is validated; state-
// scoping is left to manual visual review at the playground.
function classSetHasUtility(classSet, utility) {
  if (classSet.has(utility)) return true
  for (const tok of classSet) {
    if (tok.endsWith(':' + utility)) return true
  }
  return false
}

function kebabToPascal(name) {
  return name.split('-').map((w) => w[0].toUpperCase() + w.slice(1)).join('')
}

// Extract every cva(...) block from the source. Returns [{ name, body }].
function extractCvaBlocks(source) {
  const blocks = []
  // Use matchAll to find every "const <name> = cva(" anchor.
  const anchors = [...source.matchAll(/const\s+(\w+)\s*=\s*cva\s*\(/g)]
  for (const m of anchors) {
    const name = m[1]
    const start = m.index + m[0].length
    let depth = 1
    let i = start
    let inStr = null
    while (i < source.length && depth > 0) {
      const ch = source[i]
      const prev = source[i - 1]
      if (inStr) {
        if (ch === inStr && prev !== '\\') inStr = null
      } else {
        if (ch === "'" || ch === '"' || ch === '`') inStr = ch
        else if (ch === '(') depth++
        else if (ch === ')') depth--
      }
      i++
    }
    blocks.push({ name, body: source.slice(start, i - 1) })
  }
  return blocks
}

// Pick the cva block matching a layer name.
// Convention: kebab layer name → camelCase + "Variants" suffix.
//   "root"        → "rootVariants"
//   "icon-left"   → "iconLeftVariants"      (then strip -left/-right suffix → "iconVariants" fallback)
//   "info-icon"   → "infoIconVariants"
//   "input-box"   → "inputBoxVariants"
function kebabToCamel(s) {
  return s.replace(/-([a-z])/g, (_, c) => c.toUpperCase())
}
function pickCvaForLayer(blocks, layerName) {
  // 1. Exact match: full layer name camelCased + Variants (e.g. "icon-left" → "iconLeftVariants")
  const fullCamel = kebabToCamel(layerName) + 'Variants'
  const fullMatch = blocks.find((b) => b.name.toLowerCase() === fullCamel.toLowerCase())
  if (fullMatch) return fullMatch
  // 2. Strip directional suffix (-left/-right/-top/-bottom) and try again
  //    e.g. "icon-left" → "icon" → "iconVariants"
  const norm = layerName.replace(/-(left|right|top|bottom)$/, '')
  if (norm !== layerName) {
    const normCamel = kebabToCamel(norm) + 'Variants'
    const normMatch = blocks.find((b) => b.name.toLowerCase() === normCamel.toLowerCase())
    if (normMatch) return normMatch
  }
  // 3. Last-ditch substring match — but use the FULL camelCased name so we don't
  //    accidentally match infoIconVariants when looking for iconLeftVariants.
  const substringMatch = blocks.find((b) => b.name.toLowerCase().includes(kebabToCamel(norm).toLowerCase()))
  if (substringMatch) return substringMatch
  return null
}

// Find all DS-component imports in a source file. Returns a map
// { '<kebab-name>': { pascalNames: Set<string>, line: number } }.
function extractDsImports(source) {
  const out = new Map()
  const importRe = /import\s+(?:\*\s+as\s+\w+|\{([^}]+)\}|(\w+))\s+from\s+['"]@\/components\/([\w-]+)['"]/g
  for (const m of source.matchAll(importRe)) {
    const namedClause = m[1]
    const defaultClause = m[2]
    const pkg = m[3]
    const line = source.slice(0, m.index).split('\n').length
    const pascalNames = new Set()
    if (namedClause) {
      for (const n of namedClause.split(',')) {
        const trimmed = n.replace(/\s+as\s+\w+/, '').trim()
        if (trimmed) pascalNames.add(trimmed)
      }
    }
    if (defaultClause) pascalNames.add(defaultClause)
    const existing = out.get(pkg)
    if (existing) {
      for (const n of pascalNames) existing.pascalNames.add(n)
    } else {
      out.set(pkg, { pascalNames, line })
    }
  }
  return out
}

// Returns true if the source contains any JSX opening tag or namespace
// access matching the given pascal name (e.g. `<Button`, `<Button\n`,
// `<Button.Foo`, `Button.Foo`).
function usesPascalName(source, pascal) {
  const re = new RegExp(`(?:<${pascal}[\\s/>]|\\b${pascal}\\.)`)
  return re.test(source)
}

function loadKlpComponentsSet(repoRoot) {
  const p = path.join(repoRoot, 'klp-components.json')
  if (!fs.existsSync(p)) return new Set()
  try {
    const data = JSON.parse(fs.readFileSync(p, 'utf-8'))
    return new Set((data.components ?? []).map((c) => c.name))
  } catch {
    return new Set()
  }
}

// Tokenize a cva body into the set of class names that appear inside string literals.
function tokenizeClasses(cvaBody) {
  const set = new Set()
  const stringRe = /'([^'\\]*(?:\\.[^'\\]*)*)'|"([^"\\]*(?:\\.[^"\\]*)*)"|`([^`\\]*(?:\\.[^`\\]*)*)`/g
  for (const sm of cvaBody.matchAll(stringRe)) {
    const content = sm[1] ?? sm[2] ?? sm[3] ?? ''
    for (const tok of content.split(/\s+/)) {
      if (tok) set.add(tok)
    }
  }
  return set
}

function checkPaddingShorthand(classSet, sizeSuffix) {
  // V1-laxest: any of these forms appearing in the layer's cva (with or without
  // a state-selector prefix) satisfies the binding.
  if (classSetHasUtility(classSet, `p-${sizeSuffix}`)) return true
  if (classSetHasUtility(classSet, `px-${sizeSuffix}`) && classSetHasUtility(classSet, `py-${sizeSuffix}`)) return true
  if (
    classSetHasUtility(classSet, `pt-${sizeSuffix}`) &&
    classSetHasUtility(classSet, `pr-${sizeSuffix}`) &&
    classSetHasUtility(classSet, `pb-${sizeSuffix}`) &&
    classSetHasUtility(classSet, `pl-${sizeSuffix}`)
  ) return true
  return false
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------
function validate(componentName) {
  const repoRoot = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..')
  const specPath = path.join(repoRoot, '.klp', 'figma-refs', componentName, 'spec.json')
  if (!fs.existsSync(specPath)) {
    return { component: componentName, passed: false, error: `spec.json not found at ${specPath}` }
  }
  const spec = JSON.parse(fs.readFileSync(specPath, 'utf-8'))
  const pascalName = kebabToPascal(componentName)
  const sourcePath = path.join(repoRoot, 'src', 'components', componentName, `${pascalName}.tsx`)
  if (!fs.existsSync(sourcePath)) {
    return { component: componentName, passed: false, error: `source not found at ${sourcePath}` }
  }
  const source = fs.readFileSync(sourcePath, 'utf-8')

  const stateMap = STATE_MAP[spec.radixPrimitive] ?? GENERIC_STATE_MAP
  const cvaBlocks = extractCvaBlocks(source)
  const cvaClassSets = new Map(cvaBlocks.map((b) => [b.name, tokenizeClasses(b.body)]))

  const tokenMismatches = []
  const tokenWarnings = []

  // Hex/rgb literal scan (warning, not failure)
  for (const hm of source.matchAll(/#[0-9a-fA-F]{3,8}\b/g)) {
    const line = source.slice(0, hm.index).split('\n').length
    tokenWarnings.push({ type: 'hex-literal', match: hm[0], line })
  }

  // Primitive-token usage scan (forbid --klp-color-* / --klp-spacing-* primitives in source)
  for (const pm of source.matchAll(/\bklp-color-[\w-]+|\bklp-spacing-[\w-]+\b/g)) {
    const line = source.slice(0, pm.index).split('\n').length
    tokenWarnings.push({ type: 'primitive-token', match: pm[0], line })
  }

  // lucide-react import check (triggered if spec names an icon by name)
  const iconNames = new Set()
  for (const v of spec.variants) {
    for (const layer of Object.values(v.layers)) {
      if (layer?.literals?.icon) iconNames.add(layer.literals.icon)
    }
  }
  if (iconNames.size > 0 && !/from\s+['"]lucide-react['"]/.test(source)) {
    tokenWarnings.push({ type: 'missing-lucide-import', icons: [...iconNames] })
  }

  // Inline-SVG detection — klp components must use lucide-react for icons, never
  // write `<svg>` markup inline. The extractor doesn't always name the icon in
  // literals.icon, so we also scan source JSX.
  const inlineSvgCount = [...source.matchAll(/<svg\b/g)].length
  if (inlineSvgCount > 0) {
    // find the first line for the hint
    const firstMatch = source.match(/<svg\b/)
    const line = firstMatch ? source.slice(0, firstMatch.index).split('\n').length : null
    tokenWarnings.push({
      type: 'inline-svg',
      count: inlineSvgCount,
      line,
      hint: 'Replace inline <svg> markup with a lucide-react import (e.g. `import { Check } from "lucide-react"`). See SKILL.md.',
    })
  }

  // Per-variant validation
  for (const variant of spec.variants) {
    const stateName = variant.axes?.state
    if (stateName === undefined) continue
    const selector = stateMap[stateName]
    if (selector === undefined) {
      tokenWarnings.push({
        type: 'unknown-state',
        state: stateName,
        primitive: spec.radixPrimitive ?? 'generic',
        variantId: variant.id,
      })
      continue
    }
    for (const [layerName, layer] of Object.entries(variant.layers ?? {})) {
      if (!layer) continue
      const cva = pickCvaForLayer(cvaBlocks, layerName)
      if (!cva) {
        tokenWarnings.push({
          type: 'layer-no-cva',
          layer: layerName,
          variantId: variant.id,
          hint: `No cva block found for layer "${layerName}". Inline classes are not validated.`,
        })
        continue
      }
      const classSet = cvaClassSets.get(cva.name) ?? new Set()
      const visible = layer.literals?.visible !== 'false'

      const allFourPad =
        layer.paddingTop?.token &&
        PADDING_PER_SIDE.every((p) => layer[p]?.token === layer.paddingTop?.token)
      if (allFourPad) {
        const sizeSuffix = tokenSuffix(layer.paddingTop.token)
        if (!checkPaddingShorthand(classSet, sizeSuffix)) {
          tokenMismatches.push({
            variantId: variant.id,
            layer: layerName,
            property: 'padding (all 4 sides)',
            stateSelector: selector,
            expectedUtility: `p-${sizeSuffix} (or px+py, or pt/pr/pb/pl) — with or without state prefix`,
            expectedToken: layer.paddingTop.token,
            figmaVar: layer.paddingTop.figmaVar,
            hint: `${pascalName}.tsx → ${cva.name}`,
          })
        }
      }

      for (const [property, binding] of Object.entries(layer)) {
        if (property === 'literals') continue
        if (allFourPad && PADDING_PER_SIDE.includes(property)) continue
        if (!binding || typeof binding !== 'object') continue
        if (!binding.token) continue
        if (!visible && ['fill', 'background', 'color', 'stroke', 'borderColor'].includes(property)) continue
        const utility = tokenToUtility(binding.token, property)
        if (!utility) {
          tokenWarnings.push({
            type: 'unknown-property',
            property,
            variantId: variant.id,
            layer: layerName,
            hint: 'Add this property to PROPERTY_TO_PREFIX in scripts/validate-tokens.mjs',
          })
          continue
        }
        // Fallback: paddingX is satisfied by the all-sides `p-` shorthand. Same for paddingY.
        let satisfied = classSetHasUtility(classSet, utility)
        if (!satisfied && (property === 'paddingX' || property === 'paddingY')) {
          const pShorthand = `p-${tokenSuffix(binding.token)}`
          satisfied = classSetHasUtility(classSet, pShorthand)
        }
        // Fallback: `stroke` on an SVG icon layer is applied via `text-klp-border-*` +
        // `stroke="currentColor"` in the SVG. Accept the text-* form as equivalent to
        // the border-* form. Any color-namespace utility with the same suffix drives
        // the same CSS variable (theme.css exposes `--color-klp-border-*`).
        if (!satisfied && property === 'stroke') {
          const textForm = 'text-' + tokenSuffix(binding.token)
          satisfied = classSetHasUtility(classSet, textForm)
        }
        // Fallback: cornerRadius bound to a spacing token (e.g. --klp-size-round used
        // when a designer reaches for Sizing/Round instead of a Radius/* token) has no
        // corresponding `rounded-klp-size-*` utility — the project's theme exposes
        // spacing tokens only under p-/m-/gap-/w-/h- namespaces. Accept any `rounded-*`
        // class (e.g. `rounded-full` for klp-size-round=9999px) and warn.
        if (!satisfied && property === 'cornerRadius' && /^klp-size-/.test(tokenSuffix(binding.token))) {
          const hasAnyRounded = [...classSet].some((tok) => {
            const bare = tok.includes(':') ? tok.slice(tok.lastIndexOf(':') + 1) : tok
            return bare.startsWith('rounded-')
          })
          if (hasAnyRounded) {
            satisfied = true
            tokenWarnings.push({
              type: 'spacing-token-for-radius',
              variantId: variant.id,
              layer: layerName,
              figmaVar: binding.figmaVar,
              hint: `Figma spec binds cornerRadius to spacing token ${binding.token}; accepting any rounded-* utility. Consider asking the designer to switch to a Radius/* token.`,
            })
          }
        }
        if (!satisfied) {
          tokenMismatches.push({
            variantId: variant.id,
            layer: layerName,
            property,
            stateSelector: selector,
            expectedUtility: utility,
            expectedToken: binding.token,
            figmaVar: binding.figmaVar,
            hint: `${pascalName}.tsx → ${cva.name} cva block (V1-laxest: bare or any selector-prefixed form accepted)`,
          })
        }
      }
    }
  }

  // --- reuse check -------------------------------------------------------
  const reuseMismatches = []
  const reuseWarnings = []

  const integratedSet = loadKlpComponentsSet(repoRoot)
  const dsImports = extractDsImports(source)
  const instances = spec.composition?.instances ?? []

  // Forward rule: each declared klpComponent must be imported + used.
  for (const inst of instances) {
    const klp = inst.klpComponent
    if (!klp) continue // candidate-only entries are handled as adapter gaps
    const importEntry = dsImports.get(klp)
    if (!importEntry) {
      reuseMismatches.push({
        kind: 'missing-import',
        part: inst.part,
        klpComponent: klp,
        hint: `Spec declares klpComponent="${klp}" on part "${inst.part}" but source does not import from '@/components/${klp}'.`,
      })
      continue
    }
    const pascal = kebabToPascal(klp)
    if (!usesPascalName(source, pascal)) {
      reuseMismatches.push({
        kind: 'imported-not-used',
        part: inst.part,
        klpComponent: klp,
        hint: `Source imports '@/components/${klp}' but does not render <${pascal}>.`,
      })
    }
  }

  // Reverse rule: each DS import should correspond to a declared reuse.
  const declaredReuses = new Set((spec.composition?.reuses ?? []))
  for (const [pkg] of dsImports) {
    if (!integratedSet.has(pkg)) {
      reuseWarnings.push({
        kind: 'import-unknown-component',
        component: pkg,
        hint: `Source imports '@/components/${pkg}' but this component is not registered in klp-components.json.`,
      })
      continue
    }
    if (!declaredReuses.has(pkg)) {
      reuseWarnings.push({
        kind: 'undeclared-reuse',
        component: pkg,
        hint: `Source imports '@/components/${pkg}' but spec.composition.reuses does not list it. Verify this is intentional or add it to the spec.`,
      })
    }
  }

  // NEW: icons check (empty stub — filled in Task 3)
  const iconsMismatches = []
  const iconsWarnings = []

  const checks = {
    tokens: {
      passed: tokenMismatches.length === 0,
      mismatchCount: tokenMismatches.length,
      warningCount: tokenWarnings.length,
      mismatches: tokenMismatches,
      warnings: tokenWarnings,
    },
    reuse: {
      passed: reuseMismatches.length === 0,
      mismatchCount: reuseMismatches.length,
      warningCount: reuseWarnings.length,
      mismatches: reuseMismatches,
      warnings: reuseWarnings,
    },
    icons: {
      passed: iconsMismatches.length === 0,
      mismatchCount: iconsMismatches.length,
      warningCount: iconsWarnings.length,
      mismatches: iconsMismatches,
      warnings: iconsWarnings,
    },
  }

  const mismatches = [...tokenMismatches, ...reuseMismatches, ...iconsMismatches]
  const warnings = [...tokenWarnings, ...reuseWarnings, ...iconsWarnings]

  return {
    component: componentName,
    radixPrimitive: spec.radixPrimitive ?? null,
    passed: mismatches.length === 0,
    mismatchCount: mismatches.length,
    warningCount: warnings.length,
    checks,
    mismatches, // BC flat list
    warnings,   // BC flat list
  }
}

const componentName = process.argv[2]
if (!componentName) {
  console.error('Usage: node scripts/validate-tokens.mjs <component-name>')
  process.exit(2)
}
const result = validate(componentName)
console.log(JSON.stringify(result, null, 2))
process.exit(result.passed ? 0 : 1)
