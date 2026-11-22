import readline from 'node:readline/promises'
import { stdin as input, stdout as output } from 'node:process'
import chalk from 'chalk'
import { runSync } from './run.js'

function execute(args) {
  return runSync('docker', args, { stdio: 'inherit', env: process.env })
}
function available(args) {
  const r = runSync('docker', args, { encoding: 'utf8', stdio: 'pipe', env: process.env })
  return !r.error && r.status === 0 ? [r.stdout, r.stderr].filter(Boolean).join('\n').trim() : null
}
export async function runDockerManager() {
  console.log(chalk.cyan.bold('\n  STACKPILOT / DOCKER MANAGER\n'))
  const version = available(['--version'])
  if (!version) {
    console.log(chalk.yellow('  Docker CLI was not found. Install Docker Desktop/Engine and ensure docker is in PATH.\n'))
    return
  }
  console.log(`  ${version}`)
  const info = available(['info'])
  if (!info) {
    console.log(chalk.yellow('\n  Docker daemon is not running or is not reachable. Start Docker Desktop/Engine first.\n'))
    return
  }
  console.log(`  Docker daemon: reachable\n`)
  const compose = available(['compose', 'version'])
  console.log(`  Compose: ${compose || 'Unavailable'}`)
  console.log('\n  Running containers:\n')
  execute(['ps'])
  console.log('\n  Actions:')
  console.log('   1. List containers')
  console.log('   2. List local images')
  console.log('   3. Start Compose project in current directory')
  console.log('   4. Stop Compose project in current directory')
  console.log('   0. Back')
  if (!process.stdin.isTTY || !process.stdout.isTTY) return
  const rl = readline.createInterface({ input, output })
  try {
    const choice = (await rl.question('\n  Select action: ')).trim()
    if (choice === '1') execute(['ps', '-a'])
    else if (choice === '2') execute(['images'])
    else if (choice === '3' || choice === '4') {
      if (!compose) { console.log(chalk.yellow('  Docker Compose plugin is required.')); return }
      const fs = await import('node:fs')
      if (!fs.existsSync('compose.yaml') && !fs.existsSync('compose.yml') && !fs.existsSync('docker-compose.yml') && !fs.existsSync('docker-compose.yaml')) {
        console.log(chalk.yellow('  No Compose file found in the current directory.')); return
      }
      const verb = choice === '3' ? 'up' : 'down'
      const confirm = (await rl.question(`  Confirm "docker compose ${verb}" in this directory? [y/N]: `)).trim().toLowerCase()
      if (confirm === 'y' || confirm === 'yes') execute(verb === 'up' ? ['compose', 'up', '-d'] : ['compose', 'down'])
      else console.log('  Cancelled.')
    } else if (choice !== '0' && choice !== '') console.log(chalk.yellow('  Invalid selection.'))
  } finally { rl.close() }
  console.log('')
}
