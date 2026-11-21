import test from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { spawnSync } from 'node:child_process'
import { pathToFileURL, fileURLToPath } from 'node:url'
import { runSync, resolveExecution, assertShellSafe, UnsafeArgumentError } from '../lib/run.js'

const node = process.execPath
const isWin = process.platform === 'win32'
const runLib = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'lib', 'run.js')
const HOSTILE = ['& calc', '| calc', '; calc', '&& calc', '> out.txt', '< in.txt', '^', '%PATH%', '$(id)', '`id`', '"quoted"', "'single'", 'a b', '(x)', 'x\ny', '']
const WIN_NODE = 'C:\\Program Files\\nodejs\\node.exe'

// ---------- Pure decision logic: runs on every OS, simulates Windows with platform: 'win32' ----------

test('Windows: bare npm/composer use the shell mode with one validated command line', () => {
  assert.deepEqual(resolveExecution('npm', ['install'], 'win32'), { mode: 'shell', commandLine: 'npm install' })
  assert.deepEqual(
    resolveExecution('composer', ['create-project', 'laravel/laravel:12.*', 'backend', '--no-interaction'], 'win32'),
    { mode: 'shell', commandLine: 'composer create-project laravel/laravel:12.* backend --no-interaction' },
  )
})

test('Windows shell mode keeps the strict allowlist for every argument', () => {
  assert.doesNotThrow(() => assertShellSafe('composer', ['create-project', 'laravel/laravel:12.*', 'backend', '--no-interaction']))
  for (const bad of HOSTILE) {
    assert.throws(() => resolveExecution('npm', ['install', bad], 'win32'), UnsafeArgumentError, JSON.stringify(bad))
    assert.throws(() => assertShellSafe('npm', [bad]), UnsafeArgumentError, JSON.stringify(bad))
  }
  assert.throws(() => resolveExecution('npm', [42], 'win32'), UnsafeArgumentError)
})

test('Windows: a command that is not a bare name never reaches the shell allowlist path', () => {
  for (const bad of ['npm && calc', 'npm install', 'npm;calc', 'my app', '..\\npm', 'tools\\npm']) {
    assert.throws(() => resolveExecution(bad, [], 'win32'), UnsafeArgumentError, JSON.stringify(bad))
  }
})

test('Windows: absolute .exe path with spaces runs directly (no shell), arguments untouched', () => {
  for (const exe of [WIN_NODE, 'C:\\Program Files (x86)\\PHP\\php.exe', 'D:\\R&D tools\\composer.EXE', '\\\\server\\share\\tool.com']) {
    assert.deepEqual(resolveExecution(exe, ['-e', ...HOSTILE.filter((a) => !a.includes('\n'))], 'win32').mode, 'direct', exe)
  }
  const plan = resolveExecution(WIN_NODE, ['-e', '& calc', '"q"', '%PATH%'], 'win32')
  assert.deepEqual(plan, { mode: 'direct', file: WIN_NODE, args: ['-e', '& calc', '"q"', '%PATH%'] })
})

test('Windows: direct mode refuses .cmd/.bat, extensionless, relative and malformed executable paths', () => {
  for (const bad of [
    'C:\\Program Files\\nodejs\\npm.cmd',
    'C:\\tools\\composer.bat',
    'C:\\Program Files\\nodejs\\node',
    'C:\\Program Files\\x.exe && calc',
    '.\\tools\\x.exe',
    'tools\\x.exe',
    'C:\\a"b.exe',
    'C:\\a\u0000b.exe',
    'C:\\a\nb.exe',
  ]) {
    assert.throws(() => resolveExecution(bad, [], 'win32'), UnsafeArgumentError, JSON.stringify(bad))
  }
  assert.throws(() => resolveExecution(WIN_NODE, ['bad\u0000arg'], 'win32'), UnsafeArgumentError)
})

test('POSIX: always direct, nothing is rejected up front', () => {
  const plan = resolveExecution('/usr/bin/some tool', ['a;b', '$(x)'], 'linux')
  assert.deepEqual(plan, { mode: 'direct', file: '/usr/bin/some tool', args: ['a;b', '$(x)'] })
})

test('Windows mode rejects an unsafe argument before any process is started', () => {
  assert.throws(
    () => runSync('npm', ['install', '& calc'], { platform: 'win32', stdio: 'pipe' }),
    (error) => error.code === 'UNSAFE_ARGUMENT',
  )
})

// ---------- Real processes, POSIX ----------

test('POSIX: no shell is used, so metacharacters in args are passed through literally', { skip: isWin }, () => {
  const tricky = 'a;touch /tmp/devstack-pwned #$(id)`x` | &&'
  const result = runSync(node, ['-e', 'process.stdout.write(process.argv[1])', tricky], { stdio: 'pipe', encoding: 'utf8' })
  assert.equal(result.ok, true)
  assert.equal(result.stdout, tricky)
})

test('POSIX: an executable whose path contains spaces runs, with hostile args kept literal', { skip: isWin }, (t) => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'devstack run '))
  t.after(() => fs.rmSync(dir, { recursive: true, force: true }))
  const script = path.join(dir, 'echo arg.sh')
  fs.writeFileSync(script, '#!/bin/sh\nprintf "%s" "$1"\n', { mode: 0o755 })
  const hostile = '& calc; $(id) "q" %PATH%'
  const result = runSync(script, [hostile], { stdio: 'pipe', encoding: 'utf8' })
  assert.equal(result.ok, true, String(result.error))
  assert.equal(result.stdout, hostile)
})

// ---------- Real processes, any OS (on Windows this is the case that originally failed) ----------

test('reports non-zero exit status and missing commands without throwing', () => {
  assert.deepEqual(
    (({ ok, status }) => ({ ok, status }))(runSync(node, ['-e', 'process.exit(3)'], { stdio: 'pipe' })),
    { ok: false, status: 3 },
  )
  const missing = runSync('devstack-no-such-binary', [], { stdio: 'pipe', platform: 'linux' })
  assert.equal(missing.ok, false)
  assert.ok(missing.error)
})

test('process.execPath runs through runSync on this OS, whatever its path contains', () => {
  const result = runSync(node, ['-e', 'process.stdout.write("ok")'], { stdio: 'pipe', encoding: 'utf8' })
  assert.equal(result.ok, true, String(result.error))
  assert.equal(result.stdout, 'ok')
})

// ---------- Real processes, Windows only (skipped elsewhere; run these on a Windows machine) ----------

test('Windows: hostile arguments reach node.exe literally, with no shell interpretation', { skip: !isWin }, (t) => {
  const marker = path.join(os.tmpdir(), `devstack-pwned-${process.pid}.txt`)
  t.after(() => fs.rmSync(marker, { force: true }))
  const hostile = [`& echo x > "${marker}"`, '| calc', '"q"', '%PATH%', '^', 'a b']
  const result = runSync(node, ['-e', 'process.stdout.write(JSON.stringify(process.argv.slice(1)))', ...hostile], { stdio: 'pipe', encoding: 'utf8' })
  assert.equal(result.ok, true, String(result.error))
  assert.deepEqual(JSON.parse(result.stdout), hostile)
  assert.equal(fs.existsSync(marker), false, 'a shell must not have interpreted the arguments')
})

test('Windows: a node.exe copied into a folder whose name contains spaces runs', { skip: !isWin }, (t) => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'devstack run dir '))

  t.after(async () => {
    for (let attempt = 0; attempt < 5; attempt++) {
      try {
        fs.rmSync(dir, { recursive: true, force: true })
        return
      } catch (error) {
        if (
          !['EBUSY', 'EPERM', 'ENOTEMPTY'].includes(error.code) ||
          attempt === 4
        ) {
          throw error
        }

        await new Promise(resolve => setTimeout(resolve, 200 * (attempt + 1)))
      }
    }
  })

  const copy = path.join(dir, 'node.exe')
  fs.copyFileSync(node, copy)

  assert.ok(copy.includes(' '))

  const result = runSync(
    copy,
    ['-e', 'process.stdout.write("spaced")'],
    { stdio: 'pipe', encoding: 'utf8' },
  )

  assert.equal(result.ok, true, String(result.error))
  assert.equal(result.stdout, 'spaced')
})