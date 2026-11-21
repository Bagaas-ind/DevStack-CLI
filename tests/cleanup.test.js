import test from 'node:test'
import assert from 'node:assert/strict'
import { EventEmitter } from 'node:events'
import { spawnSync } from 'node:child_process'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { registerInterruptCleanup } from '../lib/cleanup.js'

test('cleanup runs once on SIGINT and exits with 130', () => {
  const proc = new EventEmitter()
  const calls = []
  registerInterruptCleanup((signal) => calls.push(['cleanup', signal]), { proc, exit: (code) => calls.push(['exit', code]) })
  proc.emit('SIGINT')
  proc.emit('SIGINT')
  proc.emit('SIGTERM')
  assert.deepEqual(calls, [['cleanup', 'SIGINT'], ['exit', 130]])
})

test('SIGTERM exits with 143, and exit still happens if cleanup throws', () => {
  const proc = new EventEmitter()
  const exits = []
  registerInterruptCleanup(() => { throw new Error('boom') }, { proc, exit: (code) => exits.push(code) })
  assert.throws(() => proc.emit('SIGTERM'), /boom/)
  assert.deepEqual(exits, [143])
})

test('dispose removes the handlers', () => {
  const proc = new EventEmitter()
  let called = false
  const dispose = registerInterruptCleanup(() => { called = true }, { proc, exit: () => {} })
  dispose()
  assert.equal(proc.listenerCount('SIGINT'), 0)
  assert.equal(proc.listenerCount('SIGTERM'), 0)
  proc.emit('SIGINT')
  assert.equal(called, false)
})

test('real SIGINT removes a half-created folder and exits 130', { skip: process.platform === 'win32' }, (t) => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'devstack-sigint-'))
  t.after(() => fs.rmSync(dir, { recursive: true, force: true }))
  const target = path.join(dir, 'half-created')
  const lib = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'lib', 'cleanup.js')
  const script = `
    import fs from 'node:fs'
    import { registerInterruptCleanup } from ${JSON.stringify('file://' + lib)}
    fs.mkdirSync(${JSON.stringify(target)})
    registerInterruptCleanup(() => fs.rmSync(${JSON.stringify(target)}, { recursive: true, force: true }))
    process.kill(process.pid, 'SIGINT')
    setTimeout(() => {}, 5000)
  `
  const result = spawnSync(process.execPath, ['--input-type=module', '-e', script], { encoding: 'utf8' })
  assert.equal(result.status, 130, result.stderr)
  assert.equal(fs.existsSync(target), false)
})
