#!/usr/bin/env node
// Run scripts/validate-tokens.mjs for every component registered in
// klp-components.json. Exits 1 if any component fails validation.
import { spawnSync } from 'node:child_process'
import { readFileSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const repoRoot = path.resolve(__dirname, '..')
const indexPath = path.join(repoRoot, 'klp-components.json')
const validator = path.join(__dirname, 'validate-tokens.mjs')

const data = JSON.parse(readFileSync(indexPath, 'utf-8'))
const names = (data.components ?? []).map((c) => c.name)

let anyFailed = false
for (const name of names) {
  const result = spawnSync('node', [validator, name], { stdio: 'inherit' })
  if (result.status !== 0) anyFailed = true
}

process.exit(anyFailed ? 1 : 0)
