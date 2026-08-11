// scripts/test-inject-doc-intent.mjs
import { renderIntentBlock, injectBlock } from './inject-doc-intent.mjs'
import { execFileSync } from 'node:child_process'
import { mkdtempSync, mkdirSync, writeFileSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'

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

const PAGE_WITH_FENCE = [
  '---', 'title: Foo', '---', '',
  '# Foo', '',
  'Some intro text.', '',
  '```md', '## Not a real heading', 'still inside the fence', '```', '',
  '## Real Heading', '',
  'body',
].join('\n')

function testFenceAwareInsertion() {
  console.log('injectBlock — fenced code blocks')
  const block = renderIntentBlock(ENTRY, FAMILIES)
  const result = injectBlock(PAGE_WITH_FENCE, block)
  assert(result.indexOf('```md') < result.indexOf('KLP:INTENT:BEGIN'), 'fenced block precedes the intent block')
  assert(result.indexOf('KLP:INTENT:BEGIN') < result.indexOf('## Real Heading'), 'intent block lands before the real heading, not the fenced one')
  assert(!/```md\n<!-- KLP:INTENT:BEGIN/.test(result), 'block is not spliced inside the fence')
  assert(/```md\n## Not a real heading\nstill inside the fence\n```/.test(result), 'fence contents left untouched')
}

const PAGE_WITH_FRONTMATTER_HEADING = [
  '---', 'title: Foo', '## looks like a heading but is a YAML comment', '---', '',
  '# Foo', '',
  'Lead.', '',
  '## Real Heading', '',
  'body',
].join('\n')

function testFrontmatterAwareInsertion() {
  console.log('injectBlock — heading-like line in frontmatter')
  const block = renderIntentBlock(ENTRY, FAMILIES)
  const result = injectBlock(PAGE_WITH_FRONTMATTER_HEADING, block)
  const frontmatterCloseIdx = result.indexOf('\n---\n')
  assert(result.indexOf('KLP:INTENT:BEGIN') > frontmatterCloseIdx, 'intent block lands after frontmatter closes, not inside it')
  assert(result.indexOf('KLP:INTENT:BEGIN') < result.indexOf('## Real Heading'), 'intent block lands before the real heading')
}

function testMainDoesNotCrashOnMalformedPage() {
  console.log('main() — malformed page does not crash the batch')
  const dir = mkdtempSync(join(tmpdir(), 'inject-doc-intent-'))
  try {
    mkdirSync(join(dir, 'docs/components'), { recursive: true })
    writeFileSync(
      join(dir, 'klp-components.json'),
      JSON.stringify({
        components: [
          { name: 'broken', family: null, intent: null },
          { name: 'ok', family: null, intent: null },
        ],
        families: {},
      }),
    )
    // BEGIN with no END — malformed on purpose.
    writeFileSync(join(dir, 'docs/components/_index_broken.md'), '# Broken\n\n<!-- KLP:INTENT:BEGIN -->\nno end marker\n')
    writeFileSync(join(dir, 'docs/components/_index_ok.md'), '# Ok\n\nLead.\n\n## Anatomy\n\nbody\n')

    const scriptPath = fileURLToPath(new URL('./inject-doc-intent.mjs', import.meta.url))
    let error = null
    try {
      execFileSync('node', [scriptPath], { cwd: dir, encoding: 'utf8' })
    } catch (err) {
      error = err
    }

    assert(error !== null, 'process exits non-zero rather than hanging or succeeding silently')
    assert(error && error.status === 1, 'exit code is 1')
    const stderr = (error && error.stderr) || ''
    assert(!/at file:|at Object\.<anonymous>/.test(stderr), 'no raw Node stack trace — the error was caught, not thrown out of main')
    assert(/✗ .*_index_broken\.md/.test(stderr), 'reports the specific failing page')
    assert(/1 page\(s\) failed/.test(stderr), 'one-line summary names how many pages failed')
    assert(/1 page\(s\) updated/.test(stderr), 'the other, well-formed page was still processed')
  } finally {
    rmSync(dir, { recursive: true, force: true })
  }
}

function testBlankLineAfterEnd() {
  console.log('injectBlock — exactly one blank line after END')
  const block = renderIntentBlock(ENTRY, FAMILIES)
  const once = injectBlock(PAGE, block)
  assert(/<!-- KLP:INTENT:END -->\n\n## Anatomy/.test(once), 'one blank line between END and the next heading after insert')

  const twice = injectBlock(once, block)
  assert(twice === once, 're-injection is a no-op and does not disturb the blank line')
  assert(/<!-- KLP:INTENT:END -->\n\n## Anatomy/.test(twice), 'blank line still exactly one after a second injection')

  // Simulate a page that had accumulated extra blank padding before the marker was regenerated.
  const messy = once.replace('<!-- KLP:INTENT:END -->\n\n## Anatomy', '<!-- KLP:INTENT:END -->\n\n\n\n## Anatomy')
  const cleaned = injectBlock(messy, block)
  assert(/<!-- KLP:INTENT:END -->\n\n## Anatomy/.test(cleaned), 'blank-line padding normalized back to exactly one on re-injection')
  assert(!/<!-- KLP:INTENT:END -->\n\n\n/.test(cleaned), 'no extra blank lines accumulate')
}

testRender()
testInject()
testFenceAwareInsertion()
testFrontmatterAwareInsertion()
testMainDoesNotCrashOnMalformedPage()
testBlankLineAfterEnd()

if (failures > 0) { console.error(`\n${failures} assertion(s) failed`); process.exit(1) }
console.log('\ninject-doc-intent OK')
