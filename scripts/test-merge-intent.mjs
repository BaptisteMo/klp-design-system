// scripts/test-merge-intent.mjs
import { parseExports, mergeEntry } from './merge-intent.mjs'

let failures = 0
function assert(cond, msg) {
  if (cond) console.log(`  ok   ${msg}`)
  else { console.error(`  FAIL ${msg}`); failures++ }
}

function testParseExports() {
  console.log('parseExports')
  const src = [
    "export { Badge, rootVariants } from './Badges'",
    "export type { BadgeProps, BadgeType } from './Badges'",
  ].join('\n')
  const r = parseExports(src)
  assert(r.exports.join(',') === 'Badge,rootVariants', 'value exports parsed in order')
  assert(r.typeExports.join(',') === 'BadgeProps,BadgeType', 'type exports parsed separately')

  const multi = "export {\n  Table,\n  TableRow,\n} from './Table'"
  assert(parseExports(multi).exports.join(',') === 'Table,TableRow', 'multi-line export block parsed')

  const aliased = "export { Foo as Bar } from './Foo'"
  assert(parseExports(aliased).exports.join(',') === 'Bar', 'aliased export uses the exported name')
}

function testMergeEntry() {
  console.log('mergeEntry')
  const entry = { name: 'badges', description: 'd' }
  const intent = {
    figmaName: 'badges',
    aliases: ['badge', 'chip'],
    family: null,
    whenToUse: 'a',
    whenNotToUse: 'b',
    confusedWith: [{ component: 'tabulation-cells', rule: 'r' }],
  }
  const merged = mergeEntry(entry, intent, { exports: ['Badge'], typeExports: ['BadgeProps'] })

  assert(merged.description === 'd', 'existing fields are preserved')
  assert(merged.intent.whenToUse === 'a', 'whenToUse copied into intent')
  assert(merged.intent.confusedWith[0].component === 'tabulation-cells', 'confusedWith copied')
  assert(merged.exports.join(',') === 'Badge', 'exports attached')
  assert(merged.typeExports.join(',') === 'BadgeProps', 'typeExports attached')
  assert(merged.aliases.includes('badges'), 'folder name always present in aliases')
  assert(merged.aliases.includes('Badge'), 'primary export always present in aliases')
  assert(new Set(merged.aliases).size === merged.aliases.length, 'aliases deduped')

  const bare = mergeEntry({ name: 'x' }, undefined, { exports: [], typeExports: [] })
  assert(bare.intent === null, 'no intent entry yields intent: null')
  assert(bare.figmaName === 'x', 'figmaName defaults to the folder name')
  assert(bare.family === null, 'family defaults to null')
}

function testIdempotent() {
  console.log('mergeEntry — idempotence')
  const intent = { whenToUse: 'a', whenNotToUse: 'b' }
  const once = mergeEntry({ name: 'badges' }, intent, { exports: ['Badge'], typeExports: [] })
  const twice = mergeEntry(once, intent, { exports: ['Badge'], typeExports: [] })
  assert(JSON.stringify(once) === JSON.stringify(twice), 'merging twice yields identical output')
}

testParseExports()
testMergeEntry()
testIdempotent()

if (failures > 0) { console.error(`\n${failures} assertion(s) failed`); process.exit(1) }
console.log('\nmerge-intent OK')
