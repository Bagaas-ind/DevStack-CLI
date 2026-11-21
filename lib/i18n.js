// Minimal dependency-free i18n. Default language is English; Indonesian via `--lang id`.
// This is the CLI language only (`--language` still means JavaScript/TypeScript).
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const localesDir = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'locales')

export const DEFAULT_LANG = 'en'
export const SUPPORTED_LANGS = ['en', 'id']

const cache = new Map()

function load(lang) {
  if (!cache.has(lang)) {
    cache.set(lang, JSON.parse(fs.readFileSync(path.join(localesDir, `${lang}.json`), 'utf8')))
  }
  return cache.get(lang)
}

/** Returns a supported language code, or null when `value` is not supported. Empty/undefined -> default. */
export function normalizeLang(value) {
  if (value === undefined || value === null || value === '') return DEFAULT_LANG
  const base = String(value).trim().toLowerCase().split(/[-_]/)[0]
  return SUPPORTED_LANGS.includes(base) ? base : null
}

/** Translate `key`. Falls back to English, then to the key itself. `{name}` placeholders are replaced. */
export function t(lang, key, params = {}) {
  const template = load(lang)[key] ?? load(DEFAULT_LANG)[key] ?? key
  return template.replace(/\{(\w+)\}/g, (match, name) => (name in params ? String(params[name]) : match))
}
