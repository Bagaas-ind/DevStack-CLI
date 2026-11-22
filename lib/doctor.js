import { runSync } from './run.js'

const checks = [
  { name: 'Node.js', command: process.execPath, args: ['--version'], required: true },
  { name: 'npm', command: 'npm', args: ['--version'], required: true },
  { name: 'PHP', command: 'php', args: ['-v'] },
  { name: 'Composer', command: 'composer', args: ['--version'] },
  { name: 'Python', command: 'python', args: ['--version'] },
  { name: 'Java', command: 'java', args: ['--version'] },
  { name: 'Git', command: 'git', args: ['--version'] },
  { name: 'Docker', command: 'docker', args: ['--version'] },
]

function inspect(tool) {
  const result = runSync(tool.command, tool.args, { encoding: 'utf8', stdio: 'pipe', env: process.env })
  if (result.error || result.status !== 0) return null
  return [result.stdout, result.stderr].filter(Boolean).join('\n').trim().split(/\r?\n/).find(Boolean) || 'Installed'
}

export function runDoctor() {
  console.log('\nStackPilot Runtime Doctor')
  console.log('One CLI. Every Development Environment.\n')
  let missingRequired = 0
  for (const tool of checks) {
    const version = inspect(tool)
    const compatible = tool.name !== 'Node.js' || [22, 24].includes(Number(process.versions.node.split('.')[0]))
    const status = !version ? (tool.required ? 'MISSING' : 'OPTIONAL') : compatible ? 'OK' : 'UNSUPPORTED'
    if (tool.required && (!version || !compatible)) missingRequired += 1
    const detail = !version ? (tool.required ? 'Not found in PATH' : 'Not detected (optional)') : !compatible ? 'Requires Node.js 22 or 24 LTS' : version
    console.log(`  [${status.padEnd(10)}] ${tool.name.padEnd(10)} ${detail}`)
  }
  console.log('\nSummary:')
  if (missingRequired) {
    console.log('  A required tool is missing or unsupported. Use Node.js 22/24 LTS and ensure npm is on PATH.')
    process.exitCode = 1
  } else {
    console.log('  Core StackPilot runtime requirements are available.')
    console.log('  Other tools are optional and depend on your framework.')
  }
}
