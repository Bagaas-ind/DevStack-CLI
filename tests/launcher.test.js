import test from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)))
const launcherRoot = path.join(root, 'templates', 'root')

test('POSIX launcher checks ports, backend health, and frontend startup', () => {
  const script = fs.readFileSync(path.join(launcherRoot, 'start.sh'), 'utf8')
  assert.match(script, /port_is_listening/)
  assert.match(script, /8000/)
  assert.match(script, /5173/)
  assert.match(script, /curl -fsS http:\/\/127\.0\.0\.1:8000\/up/)
  assert.match(script, /npm run dev/)
  assert.match(script, /trap cleanup EXIT/)
})

test('Windows launcher checks ports and verifies both servers before opening the browser', () => {
  const script = fs.readFileSync(path.join(launcherRoot, 'start.bat'), 'utf8')
  assert.match(script, /netstat -ano/)
  assert.match(script, /:8000/)
  assert.match(script, /:5173/)
  assert.match(script, /curl -fsS http:\/\/127\.0\.0\.1:8000\/up/)
  assert.match(script, /curl -fsS http:\/\/127\.0\.0\.1:5173\//)
  assert.match(script, /taskkill/)
})

test('POSIX launcher is committed with executable permissions', (t) => {
  if (process.platform === 'win32') return t.skip('Windows checkout does not expose POSIX executable bits.')
  const mode = fs.statSync(path.join(launcherRoot, 'start.sh')).mode
  assert.ok((mode & 0o111) !== 0, 'templates/root/start.sh must be executable')
})

test('generated project requirements match the CLI runtime requirements', () => {
  const readme = fs.readFileSync(path.join(launcherRoot, 'PROJECT_README.md'), 'utf8')
  assert.match(readme, /Node\.js 22\/24 LTS/)
  assert.match(readme, /PHP 8\.2\+/)
  assert.match(readme, /Composer 2\.x/)
})
