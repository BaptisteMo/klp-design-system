import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import {
  parsePropsInterface,
  hasCvaStateAxis,
  extractTable,
  pascalName,
  checkR1,
  checkR2,
  checkR3,
  checkR4,
  checkR5,
  applyAutoFixes,
} from './validate-doc-rules.mjs'

const HERE = dirname(fileURLToPath(import.meta.url))
const FIXTURES = resolve(HERE, '..', '__fixtures__')

// --- Task 8: Parsers ---

test('pascalName converts kebab to pascal', () => {
  assert.equal(pascalName('item-side-bar'), 'ItemSideBar')
  assert.equal(pascalName('input'), 'Input')
})

test('parsePropsInterface extracts props from baseline fixture', async () => {
  const source = await readFile(resolve(FIXTURES, 'pass-baseline/Component.tsx'), 'utf8')
  const { propsInterface, props } = parsePropsInterface(source)
  assert.equal(propsInterface, 'ComponentProps')
  assert.equal(props.length, 2)
  assert.equal(props[0].name, 'label')
  assert.equal(props[0].propClass, 'optional')
  assert.equal(props[1].name, 'children')
  assert.equal(props[1].propClass, 'required')
})

test('parsePropsInterface flags missing @propClass', async () => {
  const source = await readFile(resolve(FIXTURES, 'r5-missing-propclass/Component.tsx'), 'utf8')
  const { props } = parsePropsInterface(source)
  const foo = props.find(p => p.name === 'foo')
  assert.ok(foo)
  assert.equal(foo.hasPropClass, false)
})

test('hasCvaStateAxis detects non-empty state axis', async () => {
  const withState = await readFile(resolve(FIXTURES, 'r4-missing-classb/Component.tsx'), 'utf8')
  assert.equal(hasCvaStateAxis(withState), true)

  const withoutState = await readFile(resolve(FIXTURES, 'pass-baseline/Component.tsx'), 'utf8')
  assert.equal(hasCvaStateAxis(withoutState), false)
})

test('extractTable parses Props usage table from doc', async () => {
  const doc = await readFile(resolve(FIXTURES, 'pass-baseline/doc.md'), 'utf8')
  const table = extractTable(doc, 'Props usage')
  assert.ok(table)
  assert.equal(table.headers[0], 'Prop')
  assert.equal(table.headers[1], 'Class')
  assert.equal(table.rows.length, 2)
})

// --- Task 9: R1 + R2 ---

test('R1 detects missing Props usage section', async () => {
  const doc = await readFile(resolve(FIXTURES, 'r1-missing-props-usage/doc.md'), 'utf8')
  const result = checkR1(doc)
  assert.equal(result.passed, false)
  assert.equal(result.fixable, true)
})

test('R1 passes on baseline', async () => {
  const doc = await readFile(resolve(FIXTURES, 'pass-baseline/doc.md'), 'utf8')
  const result = checkR1(doc)
  assert.equal(result.passed, true)
})

test('R2 detects empty Class cell', async () => {
  const doc = await readFile(resolve(FIXTURES, 'r2-empty-class-cell/doc.md'), 'utf8')
  const result = checkR2(doc)
  assert.equal(result.passed, false)
  assert.equal(result.emptyRows.length, 1)
  assert.equal(result.emptyRows[0].prop, 'label')
})

test('R1 auto-fix inserts empty section', async () => {
  const doc = await readFile(resolve(FIXTURES, 'r1-missing-props-usage/doc.md'), 'utf8')
  const { fixed, fixes } = applyAutoFixes(doc, [{ rule: 'R1' }])
  assert.match(fixed, /## Props usage/)
  assert.equal(fixes.length, 1)
  assert.equal(fixes[0].rule, 'R1')
})

test('R2 auto-fix fills empty Class cell with `optional`', async () => {
  const doc = await readFile(resolve(FIXTURES, 'r2-empty-class-cell/doc.md'), 'utf8')
  const { fixed } = applyAutoFixes(doc, [{ rule: 'R2', emptyRows: [{ prop: 'label' }] }])
  const table = extractTable(fixed, 'Props usage')
  const labelRow = table.rows.find(r => r[0].includes('label'))
  assert.equal(labelRow[1], 'optional')
})

// --- Task 10: R3 ---

test("R3 detects missing Do/Don't block when computed prop present", async () => {
  const doc = await readFile(resolve(FIXTURES, 'r3-missing-dodont/doc.md'), 'utf8')
  const result = checkR3(doc)
  assert.equal(result.passed, false)
  assert.equal(result.action, 'insert')
})

test("R3 passes on baseline (no computed/persistent, no Do/Don't needed)", async () => {
  const doc = await readFile(resolve(FIXTURES, 'pass-baseline/doc.md'), 'utf8')
  const result = checkR3(doc)
  assert.equal(result.passed, true)
})

test("R3 auto-fix inserts Do/Don't block", async () => {
  const doc = await readFile(resolve(FIXTURES, 'r3-missing-dodont/doc.md'), 'utf8')
  const { fixed } = applyAutoFixes(doc, [{ rule: 'R3', action: 'insert' }])
  assert.match(fixed, /^### Do \/ Don't/m)
})

// --- Task 11: R4 ---

test('R4 flags missing Class B blockquote', async () => {
  const source = await readFile(resolve(FIXTURES, 'r4-missing-classb/Component.tsx'), 'utf8')
  const doc = await readFile(resolve(FIXTURES, 'r4-missing-classb/doc.md'), 'utf8')
  const result = checkR4(source, doc)
  assert.equal(result.passed, false)
  assert.equal(result.action, 'insert')
})

test('R4 passes on baseline (no state axis)', async () => {
  const source = await readFile(resolve(FIXTURES, 'pass-baseline/Component.tsx'), 'utf8')
  const doc = await readFile(resolve(FIXTURES, 'pass-baseline/doc.md'), 'utf8')
  const result = checkR4(source, doc)
  assert.equal(result.passed, true)
})

test('R4 auto-fix inserts blockquote above ## Variants', async () => {
  const doc = await readFile(resolve(FIXTURES, 'r4-missing-classb/doc.md'), 'utf8')
  const { fixed } = applyAutoFixes(doc, [{ rule: 'R4', action: 'insert' }])
  assert.match(fixed, /> The `state` column below/)
  const blockIdx = fixed.indexOf('> The `state` column below')
  const varIdx = fixed.indexOf('## Variants')
  assert.ok(blockIdx < varIdx && blockIdx >= 0)
})

// --- Task 12: R5 ---

test('R5 flags source prop without @propClass', async () => {
  const source = await readFile(resolve(FIXTURES, 'r5-missing-propclass/Component.tsx'), 'utf8')
  const result = checkR5(source)
  assert.equal(result.passed, false)
  assert.equal(result.missing.length, 1)
  assert.equal(result.missing[0].prop, 'foo')
  assert.equal(result.fixable, false)
})

test('R5 passes on baseline (all props tagged)', async () => {
  const source = await readFile(resolve(FIXTURES, 'pass-baseline/Component.tsx'), 'utf8')
  const result = checkR5(source)
  assert.equal(result.passed, true)
  assert.equal(result.missing.length, 0)
})
