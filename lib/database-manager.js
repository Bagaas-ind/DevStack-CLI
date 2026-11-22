import net from 'node:net'
import chalk from 'chalk'
import { runSync } from './run.js'

const databaseClients = [
  ['MySQL', 'mysql', ['--version']],
  ['MariaDB', 'mariadb', ['--version']],
  ['PostgreSQL', 'psql', ['--version']],
  ['SQLite', 'sqlite3', ['--version']],
  ['MongoDB Shell', 'mongosh', ['--version']],
  ['Redis CLI', 'redis-cli', ['--version']],
]

export const databaseServers = [
  { name: 'MySQL / MariaDB', ports: [3306, 3307] },
  { name: 'PostgreSQL', ports: [5432] },
  { name: 'MongoDB', ports: [27017] },
  { name: 'Redis', ports: [6379] },
]

function checkClient(command, args) {
  const result = runSync(command, args, {
    encoding: 'utf8',
    stdio: 'pipe',
    env: process.env,
  })

  if (result.error || result.status !== 0) return null

  return [result.stdout, result.stderr]
    .filter(Boolean)
    .join('\n')
    .trim()
    .split(/\r?\n/)[0] || 'Available'
}

/**
 * Checks whether a TCP port accepts a local connection.
 * This does not authenticate or verify the database protocol.
 */
export function probeTcpPort(host, port, timeoutMs = 700) {
  if (
    typeof host !== 'string' ||
    !host.trim() ||
    !Number.isInteger(port) ||
    port < 1 ||
    port > 65535 ||
    !Number.isFinite(timeoutMs) ||
    timeoutMs <= 0
  ) {
    return Promise.resolve(false)
  }

  return new Promise((resolve) => {
    let socket
    let settled = false

    const finish = (reachable) => {
      if (settled) return
      settled = true
      clearTimeout(timer)
      socket?.destroy()
      resolve(reachable)
    }

    const timer = setTimeout(() => finish(false), timeoutMs)

    try {
      socket = net.createConnection({ host, port })
      socket.once('connect', () => finish(true))
      socket.once('error', () => finish(false))
    } catch {
      finish(false)
    }
  })
}

/**
 * Probe common local database ports without sending credentials or queries.
 * The probe function is injectable so the mapping can be tested deterministically.
 */
export async function getDatabaseServerStatuses({
  host = '127.0.0.1',
  probe = probeTcpPort,
} = {}) {
  return Promise.all(databaseServers.map(async (server) => {
    const checks = await Promise.all(
      server.ports.map((port) => probe(host, port))
    )

    return {
      name: server.name,
      host,
      ports: server.ports,
      openPorts: server.ports.filter((port, index) => checks[index]),
    }
  }))
}

export async function runDatabaseManager() {
  const host = process.env.STACKPILOT_DB_HOST?.trim() || '127.0.0.1'

  console.log(chalk.cyan.bold('\n  STACKPILOT / DATABASE MANAGER\n'))
  console.log('  Local database server and client diagnostics\n')

  console.log(chalk.bold('  Command-line clients'))
  for (const [name, command, args] of databaseClients) {
    const version = checkClient(command, args)
    console.log(
      `  [${version ? chalk.green('FOUND') : chalk.gray('NOT FOUND')}] ${name.padEnd(17)} ${version || 'Client executable not found in PATH'}`
    )
  }

  console.log(chalk.bold(`\n  Local server reachability (${host})`))
  const statuses = await getDatabaseServerStatuses({ host })

  for (const status of statuses) {
    if (status.openPorts.length) {
      const ports = status.openPorts.join(', ')
      console.log(
        `  [${chalk.green('TCP OPEN')}] ${status.name.padEnd(17)} ${host}:${ports}`
      )
    } else {
      console.log(
        `  [${chalk.gray('NO TCP')}]   ${status.name.padEnd(17)} No listener detected on port(s) ${status.ports.join(', ')}`
      )
    }
  }

  console.log(
    `  [${chalk.cyan('FILE-BASED')}] SQLite            No server port required; the sqlite3 CLI is optional.`
  )

  const docker = checkClient('docker', ['--version'])
  if (docker) {
    const compose = checkClient('docker', ['compose', 'version'])
    console.log(`\n  Docker Compose: ${compose || 'Not available'}`)
  }

  console.log(chalk.gray('\n  Notes: TCP OPEN only means a local port accepted a connection; it does not verify database authentication, permissions, or query health.'))
  console.log(chalk.gray('  MySQL and MariaDB share a compatible protocol/port and cannot be distinguished by this TCP check.'))
  console.log(chalk.gray('  Set STACKPILOT_DB_HOST to probe another host. No credentials or SQL queries are sent.'))
  console.log(chalk.gray('  Safe mode: detection only. StackPilot never creates, drops, or modifies databases here.\n'))
}
