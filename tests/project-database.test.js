import test from 'node:test'
import assert from 'node:assert/strict'
import { ensureDatabaseExists, getProjectDatabaseName } from '../lib/project-database.js'

test('project database names are unique, normalized, and portable', () => {
  assert.equal(getProjectDatabaseName('StackPilot-Test', 'a1b2c3d4'), 'stackpilot_stackpilot_test_a1b2c3d4')
  assert.equal(getProjectDatabaseName('My App 2026', 'a1b2c3d4'), 'stackpilot_my_app_2026_a1b2c3d4')
  assert.notEqual(
    getProjectDatabaseName('frontend', 'a1b2c3d4'),
    getProjectDatabaseName('backend', 'a1b2c3d4')
  )
})

test('project database names stay within PostgreSQL identifier limits', () => {
  const name = getProjectDatabaseName('a'.repeat(100), 'a1b2c3d4')
  assert.ok(name.length <= 63)
  assert.match(name, /^stackpilot_[a-z0-9_]+_[a-f0-9]{8}$/)
})

test('SQLite does not require a server database to be created', () => {
  assert.equal(ensureDatabaseExists('/path/that/does/not/exist', 'sqlite'), undefined)
})

test('unsupported database drivers fail clearly', () => {
  assert.throws(
    () => ensureDatabaseExists('/tmp', 'oracle'),
    /Database driver tidak didukung/
  )
})
