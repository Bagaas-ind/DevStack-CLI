// Golden tests: freeze the Laravel + React generator inputs BEFORE any refactor.
// These tests need no npm dependencies, PHP, or network access.
//
// If a template change is intentional, regenerate the manifest and review the diff:
//   UPDATE_GOLDEN=1 node --test tests/golden-templates.test.js
import test from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import crypto from 'node:crypto'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const manifestPath = path.join(root, 'tests', 'golden', 'templates.manifest.json')
const contractPath = path.join(root, 'tests', 'golden', 'cli-contract.json')

function walk(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name)
    return entry.isDirectory() ? walk(full) : [full]
  })
}

// Hash with CRLF normalised so the manifest is identical on Windows and POSIX checkouts.
function hashFile(file) {
  const text = fs.readFileSync(file).toString('latin1').replace(/\r\n/g, '\n')
  return crypto.createHash('sha256').update(text, 'latin1').digest('hex')
}

function buildManifest() {
  const base = path.join(root, 'templates')
  const out = {}
  for (const file of walk(base).sort()) {
    out[path.relative(base, file).split(path.sep).join('/')] = hashFile(file)
  }
  return out
}

function readCliContract() {
  const source = fs.readFileSync(path.join(root, 'index.js'), 'utf8')
  const flags = [...source.matchAll(/\.option\('(--[A-Za-z0-9-]+)/g)].map((m) => m[1]).sort()
  const argument = (source.match(/\.argument\('([^']+)'/) || [])[1]
  const binName = (source.match(/\.name\('([^']+)'\)/) || [])[1]
  const pkg = JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf8'))
  return { binName, argument, flags, packageBin: pkg.bin }
}

test('golden: generator template tree is unchanged', () => {
  const actual = buildManifest()
  if (process.env.UPDATE_GOLDEN === '1') {
    fs.mkdirSync(path.dirname(manifestPath), { recursive: true })
    fs.writeFileSync(manifestPath, JSON.stringify(actual, null, 2) + '\n')
    return
  }
  const expected = JSON.parse(fs.readFileSync(manifestPath, 'utf8'))
  const added = Object.keys(actual).filter((f) => !(f in expected))
  const removed = Object.keys(expected).filter((f) => !(f in actual))
  const changed = Object.keys(expected).filter((f) => f in actual && actual[f] !== expected[f])
  assert.deepEqual({ added, removed, changed }, { added: [], removed: [], changed: [] })
})

test('golden: legacy CLI contract `devstack-cli <project-name> [options]` is preserved', () => {
  const actual = readCliContract()
  if (process.env.UPDATE_GOLDEN === '1') {
    fs.writeFileSync(contractPath, JSON.stringify(actual, null, 2) + '\n')
    return
  }
  const expected = JSON.parse(fs.readFileSync(contractPath, 'utf8'))
  // New flags/commands may be added later; existing ones must not disappear or change.
  for (const flag of expected.flags) assert.ok(actual.flags.includes(flag), `missing legacy flag ${flag}`)
  assert.equal(actual.argument, expected.argument)
  assert.equal(actual.binName, expected.binName)
  assert.deepEqual(actual.packageBin, expected.packageBin)
})
