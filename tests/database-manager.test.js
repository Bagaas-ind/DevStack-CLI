import test from 'node:test'
import assert from 'node:assert/strict'
import {
  databaseServers,
  getDatabaseServerStatuses,
  probeTcpPort,
} from '../lib/database-manager.js'

test('database server checks cover common local server ports', () => {
  assert.deepEqual(
    databaseServers.map(({ name, ports }) => [name, ports]),
    [
      ['MySQL / MariaDB', [3306, 3307]],
      ['PostgreSQL', [5432]],
      ['MongoDB', [27017]],
      ['Redis', [6379]],
    ]
  )
})

test('server status reports reachable ports without claiming authentication', async () => {
  const calls = []
  const statuses = await getDatabaseServerStatuses({
    host: '127.0.0.1',
    probe: async (host, port) => {
      calls.push([host, port])
      return port === 3307 || port === 5432
    },
  })

  assert.deepEqual(statuses[0].openPorts, [3307])
  assert.deepEqual(statuses[1].openPorts, [5432])
  assert.deepEqual(statuses[2].openPorts, [])
  assert.deepEqual(statuses[3].openPorts, [])
  assert.equal(calls.length, 5)
  assert.ok(calls.every(([host]) => host === '127.0.0.1'))
})

test('server checks accept a custom host', async () => {
  const statuses = await getDatabaseServerStatuses({
    host: 'db.example.test',
    probe: async () => true,
  })

  assert.ok(statuses.every((status) => status.host === 'db.example.test'))
  assert.ok(statuses.every((status) => status.openPorts.length === status.ports.length))
})

test('TCP probe rejects invalid ports safely', async () => {
  assert.equal(await probeTcpPort('127.0.0.1', 0), false)
  assert.equal(await probeTcpPort('127.0.0.1', 65536), false)
  assert.equal(await probeTcpPort('', 3306), false)
})
