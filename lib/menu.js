import readline from 'node:readline/promises'
import { stdin as input, stdout as output } from 'node:process'
import chalk from 'chalk'
import { t } from './i18n.js'

const STACKPILOT_LOGO = String.raw`  ____  _             _    ____  _ _
 / ___|| |_ __ _  ___| | _|  _ \\(_) |
 \\___ \\| __/ _` |/ __| |/ / |_) | | |
  ___) | || (_| | (__|   <|  __/| | |
 |____/ \\__\\__,_|\\___|_|\\_\\_|   |_|`

async function choose(rl, lang, title, choices) {
  while (true) {
    console.log(`\n${title}`)
    choices.forEach((choice, index) => console.log(`  ${index + 1}. ${choice.label}`))
    const answer = (await rl.question(`${t(lang, 'menu.choose')} `)).trim()
    const index = Number(answer) - 1
    if (Number.isInteger(index) && choices[index]) return choices[index].value
    console.log(chalk.yellow(t(lang, 'menu.invalid')))
  }
}

export async function runMainMenu({ lang = 'en' } = {}) {
  if (!process.stdin.isTTY || !process.stdout.isTTY) {
    throw new Error(t(lang, 'menu.tty_required'))
  }
  const rl = readline.createInterface({ input, output })
  try {
    console.log(chalk.cyan.bold(`\n${STACKPILOT_LOGO}`))
    console.log(chalk.bold('  StackPilot'))
    console.log(chalk.gray('  One CLI. Every Development Environment.'))
    return await choose(rl, lang, t(lang, 'menu.question'), [
      { label: t(lang, 'menu.runtime_doctor'), value: 'doctor' },
      { label: t(lang, 'menu.framework_installer'), value: 'installer' },
      { label: t(lang, 'menu.application_generator'), value: 'generator' },
      { label: t(lang, 'menu.exit'), value: 'exit' },
    ])
  } finally {
    rl.close()
  }
}

export async function askProjectName({ lang = 'en' } = {}) {
  const rl = readline.createInterface({ input, output })
  try {
    return (await rl.question(`\n${t(lang, 'menu.project_name')} `)).trim() || null
  } finally {
    rl.close()
  }
}
