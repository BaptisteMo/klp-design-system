// scripts/test-intent.mjs
// Hand-rolled assertions, same style as scripts/test-cli.mjs.
import { validateIntent } from './validate-intent.mjs'

let failures = 0
function assert(cond, msg) {
  if (cond) console.log(`  ok   ${msg}`)
  else { console.error(`  FAIL ${msg}`); failures++ }
}

const NAMES = ['badges', 'table', 'data-table', 'list', 'list-content']

function base() {
  return {
    schemaVersion: 'v1',
    families: {
      collections: { members: ['table', 'data-table', 'list', 'list-content'], rule: 'r' },
    },
    components: {
      badges: { whenToUse: 'a', whenNotToUse: 'b' },
      table: { family: 'collections', whenToUse: 'a', whenNotToUse: 'b' },
      'data-table': { family: 'collections', whenToUse: 'a', whenNotToUse: 'b' },
      list: { family: 'collections', whenToUse: 'a', whenNotToUse: 'b' },
      'list-content': { family: 'collections', whenToUse: 'a', whenNotToUse: 'b' },
    },
  }
}

function testValid() {
  console.log('validateIntent — valid document')
  assert(validateIntent(base(), NAMES).length === 0, 'a well-formed document yields no errors')
}

function testMissingRequired() {
  console.log('validateIntent — missing required fields')
  const doc = base()
  delete doc.components.badges.whenNotToUse
  const errs = validateIntent(doc, NAMES)
  assert(errs.some((e) => /badges.*whenNotToUse/.test(e)), 'missing whenNotToUse is reported')
}

function testUnknownComponent() {
  console.log('validateIntent — unknown references')
  const doc = base()
  doc.components.ghost = { whenToUse: 'a', whenNotToUse: 'b' }
  assert(validateIntent(doc, NAMES).some((e) => /ghost/.test(e)), 'intent key with no component is reported')

  const doc2 = base()
  doc2.components.badges.confusedWith = [{ component: 'nope', rule: 'r' }]
  assert(validateIntent(doc2, NAMES).some((e) => /nope/.test(e)), 'confusedWith pointing nowhere is reported')

  const doc3 = base()
  doc3.families.collections.members.push('nope')
  assert(validateIntent(doc3, NAMES).some((e) => /nope/.test(e)), 'family member pointing nowhere is reported')
}

function testFamilyBackReference() {
  console.log('validateIntent — family back-reference')
  const doc = base()
  delete doc.components.list.family
  assert(
    validateIntent(doc, NAMES).some((e) => /list.*collections/.test(e)),
    'a family member that does not carry the family is reported',
  )
}

function testCoverage() {
  console.log('validateIntent — coverage')
  const doc = base()
  delete doc.components['list-content']
  const errs = validateIntent(doc, NAMES)
  assert(errs.some((e) => /list-content/.test(e)), 'a component with no intent entry is reported')
}

function testMalformedFields() {
  console.log('validateIntent — malformed non-array fields do not throw')

  const doc = base()
  doc.families.collections.members = 4
  let errs
  assert(
    (() => { try { errs = validateIntent(doc, NAMES); return true } catch { return false } })(),
    'non-array family members does not throw',
  )
  assert(errs.some((e) => /collections.*members/.test(e)), 'non-array family members is reported')

  const doc2 = base()
  doc2.components.badges.confusedWith = { component: 'table' }
  let errs2
  assert(
    (() => { try { errs2 = validateIntent(doc2, NAMES); return true } catch { return false } })(),
    'non-array confusedWith does not throw',
  )
  assert(errs2.some((e) => /badges.*confusedWith/.test(e)), 'non-array confusedWith is reported')

  const doc3 = base()
  doc3.components.badges.confusedWith = 'fix-me-later'
  let errs3
  assert(
    (() => { try { errs3 = validateIntent(doc3, NAMES); return true } catch { return false } })(),
    'string confusedWith does not throw',
  )
  assert(errs3.some((e) => /badges.*confusedWith/.test(e)), 'string confusedWith is reported, not silently iterated')
}

testValid()
testMissingRequired()
testUnknownComponent()
testFamilyBackReference()
testCoverage()
testMalformedFields()

if (failures > 0) { console.error(`\n${failures} assertion(s) failed`); process.exit(1) }
console.log('\nintent validator OK')
