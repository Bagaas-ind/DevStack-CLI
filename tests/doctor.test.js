import test from 'node:test'
import assert from 'node:assert/strict'
import { spawnSync } from 'node:child_process'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)))
test('Runtime Doctor reports core tools', () => {
  const result = spawnSync(process.execPath, [path.join(root, 'index.js'), 'doctor'], { cwd: root, encoding: 'utf8', env: { ...process.env, NO_COLOR: '1' } })
  assert.equal(result.status, 0, result.stdout + result.stderr)
  assert.match(result.stdout, /StackPilot Runtime Doctor/)
  assert.match(result.stdout, /Node\.js/)
  assert.match(result.stdout, /npm/)
})
