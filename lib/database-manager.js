import chalk from 'chalk'
import { runSync } from './run.js'

const databases = [
  ['MySQL', 'mysql', ['--version'], 'mysql'],
  ['MariaDB', 'mariadb', ['--version'], 'mysql'],
  ['PostgreSQL', 'psql', ['--version'], 'postgres'],
  ['SQLite', 'sqlite3', ['--version'], 'sqlite'],
  ['MongoDB Shell', 'mongosh', ['--version'], 'mongodb'],
  ['Redis CLI', 'redis-cli', ['--version'], 'redis'],
]
function check(command, args) {
  const r = runSync(command, args, { encoding: 'utf8', stdio: 'pipe', env: process.env })
  if (r.error || r.status !== 0) return null
  return [r.stdout, r.stderr].filter(Boolean).join('\n').trim().split(/\r?\n/)[0] || 'Available'
}
export function runDatabaseManager() {
  console.log(chalk.cyan.bold('\n  STACKPILOT / DATABASE MANAGER\n'))
  console.log('  Database client detection\n')
  for (const [name, command, args] of databases) {
    const version = check(command, args)
    console.log(`  [${version ? chalk.green('FOUND') : chalk.gray('NOT FOUND')}] ${name.padEnd(17)} ${version || 'Client not available in PATH'}`)
  }
  const docker = check('docker', ['--version'])
  if (docker) {
    const compose = check('docker', ['compose', 'version'])
    console.log(`\n  Docker Compose: ${compose || 'Not available'}`)
  }
  console.log(chalk.gray('\n  Safe mode: detection only. StackPilot never creates, drops, or modifies databases here.'))
  console.log(chalk.gray('  Start your database service with its own service manager or Docker Compose.\n'))
}
