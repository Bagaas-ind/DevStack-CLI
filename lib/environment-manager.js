import readline from 'node:readline/promises'
import { stdin as input, stdout as output } from 'node:process'
import chalk from 'chalk'
import { runSync } from './run.js'

const tools = [
  ['Node.js', process.execPath, ['--version'], true],
  ['npm', 'npm', ['--version'], true],
  ['PHP', 'php', ['--version']],
  ['Composer', 'composer', ['--version']],
  ['Python', 'python', ['--version']],
  ['Python 3', 'python3', ['--version']],
  ['Java', 'java', ['--version']],
  ['Git', 'git', ['--version']],
  ['Docker', 'docker', ['--version']],
]

function inspect(command, args) {
  const result = runSync(command, args, { encoding: 'utf8', stdio: 'pipe', env: process.env })
  if (result.error || result.status !== 0) return null
  return [result.stdout, result.stderr].filter(Boolean).join('\n').trim().split(/\r?\n/)[0] || 'Installed'
}

export async function runEnvironmentManager() {
  console.log(chalk.cyan.bold('\n  STACKPILOT / ENVIRONMENT MANAGER\n'))
  console.log('  Runtime inventory and compatibility overview\n')
  let missing = 0
  for (const [name, command, args, required] of tools) {
    const version = inspect(command, args)
    const status = version ? 'DETECTED' : required ? 'MISSING' : 'OPTIONAL'
    if (required && !version) missing++
    console.log(`  [${status.padEnd(8)}] ${name.padEnd(12)} ${version || (required ? 'Required runtime not found in PATH' : 'Not installed (optional)')}`)
  }
  console.log('\n  PATH entries:')
  const entries = (process.env.PATH || '').split(requirePathDelimiter()).filter(Boolean)
  for (const entry of entries.slice(0, 12)) console.log(`   • ${entry}`)
  if (entries.length > 12) console.log(`   • ... and ${entries.length - 12} more`)
  console.log(missing ? chalk.yellow('\n  Action: install Node.js LTS and ensure npm is available.') : chalk.green('\n  Core JavaScript runtime is ready.'))
  console.log(chalk.gray('  This manager is read-only: it does not change PATH or install/uninstall software.\n'))
}
function requirePathDelimiter() { return process.platform === 'win32' ? ';' : ':' }
