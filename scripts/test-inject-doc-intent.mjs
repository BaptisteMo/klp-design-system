// scripts/test-inject-doc-intent.mjs
import { renderIntentBlock, injectBlock } from './inject-doc-intent.mjs'

let failures = 0
function assert(cond, msg) {
  if (cond) console.log(`  ok   ${msg}`)
  else { console.error(`  FAIL ${msg}`); failures++ }
}

const ENTRY = {
  name: 'badges',
  family: null,
  intent: {
    whenToUse: 'Short read-only status.',
    whenNotToUse: 'Never as a button.',
    confusedWith: [{ component: 'tabulation-cells', rule: 'Badge labels state.' }],
  },
}
const FAMILIES = { collections: { members: ['table', 'list'], rule: 'the rule' } }

const PAGE = ['---', 'title: Badge', '---', '', '# Badge', '', 'Lead paragraph.', '', '## Anatomy', '', 'body'].join('\n')

function testRender() {
  console.log('renderIntentBlock')
  const b = renderIntentBlock(ENTRY, FAMILIES)
  assert(b.startsWith('<!-- KLP:INTENT:BEGIN -->'), 'block opens with the BEGIN marker')
  assert(b.trimEnd().endsWith('<!-- KLP:INTENT:END -->'), 'block closes with the END marker')
  assert(/## When to use/.test(b), 'renders a When to use heading')
  assert(/Short read-only status\./.test(b), 'renders whenToUse text')
  assert(/Never as a button\./.test(b), 'renders whenNotToUse text')
  assert(/## Don't confuse with/.test(b), 'renders the confusion table heading')
  assert(/`tabulation-cells`/.test(b), 'confusion table lists the sibling')

  const noConf = renderIntentBlock({ ...ENTRY, intent: { ...ENTRY.intent, confusedWith: [] } }, FAMILIES)
  assert(!/Don't confuse with/.test(noConf), 'confusion table omitted when confusedWith is empty')

  const fam = renderIntentBlock({ ...ENTRY, family: 'collections' }, FAMILIES)
  assert(/the rule/.test(fam), 'family rule quoted when the component belongs to a family')
}

function testInject() {
  console.log('injectBlock')
  const block = renderIntentBlock(ENTRY, FAMILIES)
  const once = injectBlock(PAGE, block)
  assert(once.indexOf('KLP:INTENT:BEGIN') < once.indexOf('## Anatomy'), 'block lands before the first ## heading')
  assert(once.indexOf('# Badge') < once.indexOf('KLP:INTENT:BEGIN'), 'block lands after the H1')
  assert(/Lead paragraph\./.test(once), 'existing lead paragraph preserved')

  const twice = injectBlock(once, block)
  assert(twice === once, 'injecting twice is a no-op')

  const changed = injectBlock(once, renderIntentBlock({ ...ENTRY, intent: { ...ENTRY.intent, whenToUse: 'NEW' } }, FAMILIES))
  assert(/NEW/.test(changed) && !/Short read-only status\./.test(changed), 're-injection replaces the old block')
  assert((changed.match(/KLP:INTENT:BEGIN/g) || []).length === 1, 'exactly one block after re-injection')

  const withNotes = injectBlock(PAGE + '\n<!-- KLP:NOTES:BEGIN -->\nhand prose\n<!-- KLP:NOTES:END -->\n', block)
  assert(/hand prose/.test(withNotes), 'KLP:NOTES content preserved')
}

testRender()
testInject()

if (failures > 0) { console.error(`\n${failures} assertion(s) failed`); process.exit(1) }
console.log('\ninject-doc-intent OK')
