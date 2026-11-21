// Safe process runner.
//
// There are two execution modes, chosen by resolveExecution():
//
//   direct  Spawn the executable itself, never a shell. Arguments are passed as an array and are
//           never re-parsed by cmd.exe/sh, so spaces and metacharacters stay literal.
//           - POSIX: always used.
//           - Windows: used for an ABSOLUTE path to a real .exe/.com (for example process.execPath,
//             "C:\Program Files\nodejs\node.exe"). Spaces in the path are fine because no shell is
//             involved. A .cmd/.bat target is refused: Node cannot start those without a shell, and a
//             shell would re-parse a path containing spaces.
//
//   shell   Windows only, for bare command names such as npm/composer, which are .cmd/.bat shims that
//           Node can only start through cmd.exe. cmd.exe re-parses the command line, so the command and
//           EVERY argument must match a conservative allowlist (no spaces, quotes, & | < > ^ % ; $
//           backticks or parentheses). Anything else is rejected before a process is started, instead
//           of being escaped. This allowlist must not be loosened.
//
// `command` must come from trusted code (a literal name or process.execPath), never from user input.
import { spawnSync } from 'node:child_process'
import path from 'node:path'

const SAFE_COMMAND = /^[A-Za-z0-9._-]+$/
const SAFE_SHELL_ARG = /^[A-Za-z0-9._:@/\\=*+,~-]+$/
const DIRECT_EXTENSIONS = new Set(['.exe', '.com'])

export class UnsafeArgumentError extends Error {
  constructor(value, reason = 'unsafe argument') {
    super(`Refusing to run a command with an ${reason}: ${JSON.stringify(value)}`)
    this.name = 'UnsafeArgumentError'
    this.code = 'UNSAFE_ARGUMENT'
  }
}

/** Throws UnsafeArgumentError when command/args are not safe to hand to a shell. */
export function assertShellSafe(command, args) {
  if (!SAFE_COMMAND.test(command)) throw new UnsafeArgumentError(command)
  for (const arg of args) {
    if (typeof arg !== 'string' || !SAFE_SHELL_ARG.test(arg)) throw new UnsafeArgumentError(arg)
  }
}

function assertDirectSafe(command, args) {
  // No shell is involved, so spaces, parentheses, & etc. are legitimate in a Windows path.
  // Quotes and control characters are never valid in a Windows file name.
  if (/["\u0000-\u001f]/.test(command)) throw new UnsafeArgumentError(command, 'unsafe executable path')
  if (!path.win32.isAbsolute(command)) {
    throw new UnsafeArgumentError(command, 'executable path (a bare name needs the shell allowlist; a path must be absolute)')
  }
  if (!DIRECT_EXTENSIONS.has(path.win32.extname(command).toLowerCase())) {
    throw new UnsafeArgumentError(command, 'executable (only .exe/.com can run without a shell; .cmd/.bat need a shell)')
  }
  for (const arg of args) {
    if (typeof arg !== 'string' || arg.includes('\u0000')) throw new UnsafeArgumentError(arg)
  }
}

/**
 * Decide how to run `command` on `platform` and validate it. Pure: starts nothing.
 * @returns {{ mode: 'direct', file: string, args: string[] } | { mode: 'shell', commandLine: string }}
 * @throws {UnsafeArgumentError}
 */
export function resolveExecution(command, args = [], platform = process.platform) {
  if (platform !== 'win32') return { mode: 'direct', file: command, args }
  if (SAFE_COMMAND.test(command)) {
    assertShellSafe(command, args)
    // Same string Node builds itself for `shell: true` + args (joined by spaces). Passing one string
    // avoids Node's "args with shell: true" deprecation (DEP0190); the allowlist makes it injection-free.
    return { mode: 'shell', commandLine: [command, ...args].join(' ') }
  }
  assertDirectSafe(command, args)
  return { mode: 'direct', file: command, args }
}

/**
 * @returns {{ ok: boolean, status: number|null, signal: string|null, error?: Error, stdout?: string, stderr?: string }}
 */
export function runSync(command, args = [], { cwd, stdio = 'inherit', platform = process.platform, env = process.env, encoding } = {}) {
  const plan = resolveExecution(command, args, platform)
  const result = plan.mode === 'shell'
    ? spawnSync(plan.commandLine, { cwd, stdio, shell: true, env, encoding })
    : spawnSync(plan.file, plan.args, { cwd, stdio, shell: false, env, encoding })
  return {
    ok: result.status === 0,
    status: result.status,
    signal: result.signal ?? null,
    error: result.error,
    stdout: result.stdout,
    stderr: result.stderr,
  }
}
