import test from 'node:test'
import assert from 'node:assert/strict'
import { spawnSync } from 'node:child_process'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)))
const cli = path.join(root, 'index.js')

function execute(args, cwd = root) {
  return spawnSync(process.execPath, [cli, ...args], {
    cwd,
    encoding: 'utf8',
    env: { ...process.env, NO_COLOR: '1' },
  })
}

test('CLI help lists the supported generator options', () => {
  const result = execute(['--help'])
  assert.equal(result.status, 0)
  assert.match(result.stdout, /--typescript/)
  assert.match(result.stdout, /--database <driver>/)
  assert.match(result.stdout, /--skip-backend/)
  assert.match(result.stdout, /--laravel-version <version>/)
})

test('CLI reports an invalid project name before creating files', () => {
  const result = execute(['../not-allowed', '--non-interactive'])
  assert.equal(result.status, 1)
  assert.match(result.stdout + result.stderr, /Nama project harus diawali/)
})

test('CLI rejects an existing project path instead of overwriting it', () => {
  const result = execute(['templates', '--skip-backend', '--non-interactive'])
  assert.equal(result.status, 1)
  assert.match(result.stdout + result.stderr, /sudah ada/)
})

test('CLI generates the JavaScript frontend template without a backend', (t) => {
  const temp = fs.mkdtempSync(path.join(os.tmpdir(), 'stackpilot-js-'))
  t.after(() => fs.rmSync(temp, { recursive: true, force: true }))
  const result = execute(['sample-app', '--skip-backend', '--skip-install', '--non-interactive'], temp)
  assert.equal(result.status, 0, result.stdout + result.stderr)
  assert.ok(fs.existsSync(path.join(temp, 'sample-app', 'frontend', 'src', 'App.jsx')))
  assert.ok(fs.existsSync(path.join(temp, 'sample-app', 'frontend', 'package.json')))
  assert.ok(fs.existsSync(path.join(temp, 'sample-app', 'README.md')))
})

test('CLI generates the TypeScript frontend template without a backend', (t) => {
  const temp = fs.mkdtempSync(path.join(os.tmpdir(), 'stackpilot-ts-'))
  t.after(() => fs.rmSync(temp, { recursive: true, force: true }))
  const result = execute(['sample-app', '--skip-backend', '--skip-install', '--typescript', '--non-interactive'], temp)
  assert.equal(result.status, 0, result.stdout + result.stderr)
  assert.ok(fs.existsSync(path.join(temp, 'sample-app', 'frontend', 'src', 'App.tsx')))
  assert.ok(fs.existsSync(path.join(temp, 'sample-app', 'frontend', 'tsconfig.json')))
  assert.ok(fs.existsSync(path.join(temp, 'sample-app', 'frontend', 'src', 'vite-env.d.ts')))
})


test('CLI version matches the package release version', () => {
  const result = execute(['--version'])
  assert.equal(result.status, 0)
  const pkg = JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf8'))
  assert.match(result.stdout, new RegExp(`^${pkg.version.replaceAll('.', '\\.')}\\b`))
})

test('Laravel admin routes use a registered middleware alias, not a route closure', () => {
  const routes = fs.readFileSync(path.join(root, 'templates', 'backend', 'routes', 'api.php'), 'utf8')
  const bootstrap = fs.readFileSync(path.join(root, 'templates', 'backend', 'bootstrap', 'app.php'), 'utf8')
  const middleware = fs.readFileSync(path.join(root, 'templates', 'backend', 'app', 'Http', 'Middleware', 'EnsureAdmin.php'), 'utf8')

  assert.match(routes, /prefix\('admin'\)\s*->middleware\('admin'\)/)
  assert.doesNotMatch(routes, /Route::middleware\(function/)
  assert.match(bootstrap, /'admin'\s*=>\s*\\App\\Http\\Middleware\\EnsureAdmin::class/)
  assert.match(middleware, /role\s*!==\s*'admin'/)
})

test('JavaScript dashboard template uses valid JSX structure', () => {
  const dashboard = fs.readFileSync(path.join(root, 'templates', 'frontend', 'src', 'pages', 'Dashboard.jsx'), 'utf8')
  assert.match(dashboard, /return \(\s*<div>/)
  assert.match(dashboard, /cards\.map\(\(card\) => \(\s*<div/)
})


test('CLI rejects an invalid Laravel version constraint', () => {
  const temp = fs.mkdtempSync(path.join(os.tmpdir(), 'stackpilot-version-'))
  try {
    const result = execute(['sample-app', '--skip-backend', '--skip-install', '--non-interactive', '--laravel-version', '12;invalid'], temp)
    assert.equal(result.status, 1)
    assert.match(result.stdout + result.stderr, /Versi Laravel tidak valid/)
    assert.equal(fs.existsSync(path.join(temp, 'sample-app')), false)
  } finally {
    fs.rmSync(temp, { recursive: true, force: true })
  }
})
