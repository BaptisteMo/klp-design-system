// cli/prompts.mjs
// Thin wrapper over `prompts` that aborts cleanly on Ctrl-C.

import prompts from 'prompts'

function onCancel() {
  console.log('\nAborted.')
  process.exit(1)
}

export async function ask(question) {
  return prompts(question, { onCancel })
}

export async function askText(name, message, initial) {
  const res = await ask({ type: 'text', name, message, initial })
  return res[name]
}

export async function askSelect(name, message, choices, initial = 0) {
  const res = await ask({ type: 'select', name, message, choices, initial })
  return res[name]
}

export async function askConfirm(name, message, initial = false) {
  const res = await ask({ type: 'confirm', name, message, initial })
  return res[name]
}

export async function askMultiselect(name, message, choices) {
  const res = await ask({
    type: 'multiselect',
    name,
    message,
    choices,
    hint: 'Space to toggle. a to toggle all. Enter to confirm.',
    instructions: false,
  })
  return res[name]
}
