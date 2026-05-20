#!/usr/bin/env node
// cli/index.mjs
// Bin entrypoint: routes to init / update / help / version.

import { fileURLToPath } from 'node:url'
import { dirname, resolve } from 'node:path'
import { readFileSync } from 'node:fs'

const __dirname = dirname(fileURLToPath(import.meta.url))
const pkg = JSON.parse(readFileSync(resolve(__dirname, '../package.json'), 'utf8'))

const HELP = `klp-ui — design system distribution CLI (v${pkg.version})

Usage:
  klp-ui init [project-name] [--brand=<name>] [--pm=<pnpm|npm|yarn|bun>]
                              [--no-install] [--no-git] [--ref=<ref>] [--verbose] [--force]
  klp-ui update [--ref=<ref>] [--dry-run] [--verbose] [--force]
  klp-ui add <name> [<name>...] [--force] [--json] [--ref=<ref>]
  klp-ui list [--json]
  klp-ui --help
  klp-ui --version

Env:
  GITHUB_TOKEN   optional; avoids rate-limit (60 req/hr unauth)
`

const argv = process.argv.slice(2)

async function runAdd(rest) {
  const { planAdd } = await import('./add.mjs')
  const { copyComponent, copyDocOfComponent } = await import('./copy.mjs')
  const { writeInventory, writeInventoryMd, markInstalled } = await import('./inventory.mjs')
  const { join } = await import('node:path')
  const { readFileSync } = await import('node:fs')

  const positional = rest.filter((a) => !a.startsWith('--'))
  const force = rest.includes('--force')
  const json = rest.includes('--json')
  const refFlag = rest.find((a) => a.startsWith('--ref='))
  const ref = refFlag ? refFlag.slice(6) : 'main'

  const rootDir = process.cwd()
  const plan = planAdd({ rootDir, names: positional, force })

  if (plan.unknown.length) {
    console.error(`Unknown components: ${plan.unknown.join(', ')}`)
    process.exit(2)
  }
  if (!plan.toInstall.length) {
    console.log(`Nothing to install. Already installed: ${plan.alreadyInstalled.join(', ') || '(none)'}`)
    process.exit(0)
  }

  let manifest
  if (ref === 'local') {
    manifest = JSON.parse(readFileSync(resolve(__dirname, '../registry/manifest.json'), 'utf8'))
  } else {
    const { fetchText } = await import('./fetch.mjs')
    const url = `https://raw.githubusercontent.com/BaptisteMo/klp-design-system/${ref}/registry/manifest.json`
    manifest = JSON.parse(await fetchText(url))
  }

  const dsRoot  = join(rootDir, plan.inventory.dsDir)
  const docsRoot = join(rootDir, 'docs')

  for (const name of plan.toInstall) {
    await copyComponent(manifest, name, dsRoot, { ref })
    await copyDocOfComponent(manifest, name, docsRoot, { ref })
  }

  const updated = markInstalled(plan.inventory, plan.toInstall)
  writeInventory(rootDir, updated)
  writeInventoryMd(rootDir, updated)

  if (json) console.log(JSON.stringify({ installed: plan.toInstall }, null, 2))
  else console.log(`✓ Installed: ${plan.toInstall.join(', ')}`)
}

async function main() {
  if (argv.length === 0 || argv.includes('--help') || argv.includes('-h')) {
    console.log(HELP)
    return
  }
  if (argv.includes('--version') || argv.includes('-v')) {
    console.log(pkg.version)
    return
  }
  const cmd = argv[0]
  const rest = argv.slice(1)
  if (cmd === 'init') {
    const mod = await import('./init.mjs')
    await mod.run(rest)
  } else if (cmd === 'update') {
    const mod = await import('./update.mjs')
    await mod.run(rest)
  } else if (cmd === 'list') {
    const { runList } = await import('./list.mjs')
    const json = rest.includes('--json')
    console.log(runList({ rootDir: process.cwd(), json }))
  } else if (cmd === 'add') {
    await runAdd(rest)
  } else {
    console.error(`Unknown command: ${cmd}\n`)
    console.error(HELP)
    process.exit(3)
  }
}

main().catch((err) => {
  console.error('Error:', err.message)
  if (process.env.DEBUG) console.error(err.stack)
  process.exit(2)
})
