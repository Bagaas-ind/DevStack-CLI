import test from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { t, normalizeLang, DEFAULT_LANG, SUPPORTED_LANGS } from '../lib/i18n.js'
import { validateProjectName } from '../lib/project-name.js'

const localesDir = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'locales')
const read = (lang) => JSON.parse(fs.readFileSync(path.join(localesDir, `${lang}.json`), 'utf8'))

test('default language is English', () => {
  assert.equal(DEFAULT_LANG, 'en')
  assert.equal(normalizeLang(undefined), 'en')
  assert.equal(normalizeLang(''), 'en')
})

test('normalizeLang accepts id/en variants and rejects unknown languages', () => {
  assert.equal(normalizeLang('id'), 'id')
  assert.equal(normalizeLang('ID'), 'id')
  assert.equal(normalizeLang('id-ID'), 'id')
  assert.equal(normalizeLang('en_US'), 'en')
  assert.equal(normalizeLang('fr'), null)
  assert.equal(normalizeLang('javascript'), null)
})

test('every supported language has exactly the same keys as English', () => {
  const english = Object.keys(read('en')).sort()
  for (const lang of SUPPORTED_LANGS) assert.deepEqual(Object.keys(read(lang)).sort(), english, lang)
})

test('every language keeps the same {placeholders} per key', () => {
  const placeholders = (s) => [...s.matchAll(/\{(\w+)\}/g)].map((m) => m[1]).sort()
  const en = read('en')
  for (const lang of SUPPORTED_LANGS) {
    const messages = read(lang)
    for (const key of Object.keys(en)) assert.deepEqual(placeholders(messages[key]), placeholders(en[key]), `${lang}:${key}`)
  }
})

test('t interpolates params and falls back to the key for unknown keys', () => {
  assert.match(t('en', 'error.target_exists', { name: 'demo' }), /"demo" already exists/)
  assert.match(t('id', 'error.target_exists', { name: 'demo' }), /"demo" sudah ada/)
  assert.equal(t('en', 'no.such.key'), 'no.such.key')
})

test('Indonesian strings keep the legacy wording relied on by existing CLI tests', () => {
  assert.match(t('id', 'error.projectName.invalid_chars'), /Nama project harus diawali/)
  assert.match(t('id', 'error.target_exists', { name: 'templates' }), /sudah ada/)
})

test('every project-name error code has a locale entry', () => {
  const codes = ['', '.', 'a'.repeat(101), '-x', 'app.', 'con'].map((n) => validateProjectName(n).code)
  assert.equal(new Set(codes).size, codes.length)
  for (const code of codes) for (const lang of SUPPORTED_LANGS) assert.ok(read(lang)[`error.projectName.${code}`], `${lang}:${code}`)
})
