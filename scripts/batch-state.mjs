#!/usr/bin/env node
// klp batch-state — persist per-component status for /klp-build-batch.
// Usage:
//   node scripts/batch-state.mjs init <name1,name2,...>
//   node scripts/batch-state.mjs update <name> <status> [errorJSON]
//   node scripts/batch-state.mjs report
//   node scripts/batch-state.mjs path     # prints path to latest batch file

import fs from 'node:fs'
import path from 'node:path'

const VALID_STATUSES = new Set([
  'pending', 'extracted', 'adapted', 'validated', 'documented', 'failed', 'skipped',
])

const repoRoot = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..')
const stagingDir = path.join(repoRoot, '.klp', 'staging')
const latestPath = path.join(stagingDir, 'latest.json')

function ensureStagingDir() {
  if (!fs.existsSync(stagingDir)) {
    fs.mkdirSync(stagingDir, { recursive: true })
  }
}

function loadLatest() {
  if (!fs.existsSync(latestPath)) return null
  return JSON.parse(fs.readFileSync(latestPath, 'utf-8'))
}

function saveLatest(state) {
  fs.writeFileSync(latestPath, JSON.stringify(state, null, 2) + '\n')
  // Also write a timestamped snapshot — overwritten on each update, so it ends
  // up as the final state of this batch (useful for cross-batch comparisons later).
  const snapshotPath = path.join(stagingDir, `batch-${state.startedAt}.json`)
  fs.writeFileSync(snapshotPath, JSON.stringify(state, null, 2) + '\n')
}

function cmdInit(rawNames) {
  ensureStagingDir()
  if (!rawNames) {
    console.error('Usage: batch-state.mjs init <name1,name2,...>')
    process.exit(2)
  }
  const names = rawNames.split(',').map((n) => n.trim()).filter(Boolean)
  if (names.length === 0) {
    console.error('No component names provided')
    process.exit(2)
  }
  const startedAt = new Date().toISOString().replace(/[:.]/g, '-')
  const state = {
    startedAt,
    components: Object.fromEntries(
      names.map((name) => [name, { status: 'pending', warnings: [], error: null }])
    ),
  }
  saveLatest(state)
  console.log(JSON.stringify({ ok: true, startedAt, count: names.length }, null, 2))
}

function cmdUpdate(name, status, errorJson) {
  if (!name || !status) {
    console.error('Usage: batch-state.mjs update <name> <status> [errorJSON]')
    process.exit(2)
  }
  if (!VALID_STATUSES.has(status)) {
    console.error(`Invalid status "${status}". Valid: ${[...VALID_STATUSES].join(', ')}`)
    process.exit(2)
  }
  const state = loadLatest()
  if (!state) {
    console.error('No batch in progress. Run `init` first.')
    process.exit(2)
  }
  if (!state.components[name]) {
    console.error(`Component "${name}" not in current batch`)
    process.exit(2)
  }
  state.components[name].status = status
  if (errorJson) {
    try {
      state.components[name].error = JSON.parse(errorJson)
    } catch {
      state.components[name].error = { raw: errorJson }
    }
  }
  saveLatest(state)
  console.log(JSON.stringify({ ok: true, name, status }))
}

function cmdReport() {
  const state = loadLatest()
  if (!state) {
    console.error('No batch in progress.')
    process.exit(2)
  }
  const buckets = { documented: [], failed: [], skipped: [], inProgress: [] }
  for (const [name, c] of Object.entries(state.components)) {
    if (c.status === 'documented') buckets.documented.push({ name, warnings: c.warnings })
    else if (c.status === 'failed') buckets.failed.push({ name, error: c.error })
    else if (c.status === 'skipped') buckets.skipped.push({ name })
    else buckets.inProgress.push({ name, status: c.status })
  }
  const lines = []
  lines.push(`Batch started at ${state.startedAt}`)
  lines.push('')
  lines.push(`✅ SUCCESS (${buckets.documented.length})`)
  for (const c of buckets.documented) {
    lines.push(`  • ${c.name}` + (c.warnings.length ? `  (${c.warnings.length} warnings)` : ''))
  }
  if (buckets.failed.length > 0) {
    lines.push('')
    lines.push(`❌ FAILED (${buckets.failed.length})`)
    for (const c of buckets.failed) {
      lines.push(`  • ${c.name}: ${c.error?.message ?? c.error?.stage ?? 'unknown error'}`)
    }
  }
  if (buckets.skipped.length > 0) {
    lines.push('')
    lines.push(`⊘ SKIPPED (${buckets.skipped.length})`)
    for (const c of buckets.skipped) lines.push(`  • ${c.name}`)
  }
  if (buckets.inProgress.length > 0) {
    lines.push('')
    lines.push(`⏳ INCOMPLETE (${buckets.inProgress.length})  — batch may have crashed mid-run`)
    for (const c of buckets.inProgress) lines.push(`  • ${c.name} (last status: ${c.status})`)
  }
  lines.push('')
  console.log(lines.join('\n'))
}

function cmdPath() {
  if (!fs.existsSync(latestPath)) {
    console.error('No batch in progress.')
    process.exit(2)
  }
  console.log(latestPath)
}

const [, , subcmd, ...args] = process.argv
switch (subcmd) {
  case 'init':   cmdInit(args[0]); break
  case 'update': cmdUpdate(args[0], args[1], args[2]); break
  case 'report': cmdReport(); break
  case 'path':   cmdPath(); break
  default:
    console.error('Usage: batch-state.mjs <init|update|report|path> [args...]')
    process.exit(2)
}
