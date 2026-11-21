// Project-name validation. Rules are portable: a project generated on macOS/Linux
// may later be opened on Windows, so Windows restrictions apply on every platform.
//
// Stricter than the legacy regex only for: trailing dot, Windows reserved device names,
// and names longer than MAX_LENGTH. Everything the legacy rule rejected is still rejected.

export const MAX_LENGTH = 100

const WINDOWS_RESERVED = new Set([
  'con', 'prn', 'aux', 'nul',
  ...Array.from({ length: 9 }, (_, i) => `com${i + 1}`),
  ...Array.from({ length: 9 }, (_, i) => `lpt${i + 1}`),
])

const LEGACY_PATTERN = /^[a-zA-Z0-9][a-zA-Z0-9._-]*$/

/**
 * @param {unknown} name
 * @returns {{ ok: true } | { ok: false, code: string, params?: Record<string, string|number> }}
 *   `code` maps to the locale key `error.projectName.<code>`.
 */
export function validateProjectName(name) {
  if (typeof name !== 'string' || name.length === 0) return { ok: false, code: 'empty' }
  if (name === '.' || name === '..') return { ok: false, code: 'dot' }
  if (name.length > MAX_LENGTH) return { ok: false, code: 'too_long', params: { max: MAX_LENGTH } }
  if (!LEGACY_PATTERN.test(name)) return { ok: false, code: 'invalid_chars' }
  if (/[. ]$/.test(name)) return { ok: false, code: 'trailing_dot' }
  // Windows treats "con.txt" like "con": only the part before the first dot counts.
  if (WINDOWS_RESERVED.has(name.split('.')[0].toLowerCase())) {
    return { ok: false, code: 'reserved', params: { name } }
  }
  return { ok: true }
}
