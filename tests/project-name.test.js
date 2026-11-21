import test from 'node:test'
import assert from 'node:assert/strict'
import { validateProjectName, MAX_LENGTH } from '../lib/project-name.js'

test('accepts normal project names', () => {
  for (const name of ['my-app', 'App1', 'a', 'my.app_2', 'x'.repeat(MAX_LENGTH)]) {
    assert.deepEqual(validateProjectName(name), { ok: true }, name)
  }
})

test('rejects everything the legacy rule rejected', () => {
  for (const name of ['', '.', '..', '../x', '-a', '_a', '.a', 'a b', 'a/b', 'a\\b', 'a:b', 'a*b', 'a?b', 'a"b', 'a<b', 'a|b', 'é']) {
    assert.equal(validateProjectName(name).ok, false, JSON.stringify(name))
  }
})

test('rejects Windows reserved device names, with or without extension, any case', () => {
  for (const name of ['con', 'CON', 'Prn', 'aux', 'NUL', 'com1', 'COM9', 'lpt1', 'LPT9', 'con.txt', 'nul.tar.gz']) {
    const result = validateProjectName(name)
    assert.equal(result.ok, false, name)
    assert.equal(result.code, 'reserved', name)
  }
  for (const name of ['com0', 'com10', 'console', 'my-con', 'lpt']) {
    assert.equal(validateProjectName(name).ok, true, name)
  }
})

test('rejects trailing dot and over-long names', () => {
  assert.equal(validateProjectName('app.').code, 'trailing_dot')
  assert.equal(validateProjectName('a'.repeat(MAX_LENGTH + 1)).code, 'too_long')
})

test('non-string input is rejected', () => {
  assert.equal(validateProjectName(undefined).code, 'empty')
  assert.equal(validateProjectName(42).code, 'empty')
})
