import fs from 'fs-extra'
import path from 'node:path'

export function patchUserModel(backendDir) {
  const file = path.join(backendDir, 'app', 'Models', 'User.php')
  if (!fs.existsSync(file)) throw new Error('Model app/Models/User.php tidak ditemukan.')

  let source = fs.readFileSync(file, 'utf8')

  if (!source.includes('use Laravel\\Sanctum\\HasApiTokens;')) {
    const importAnchor = 'use Illuminate\\Notifications\\Notifiable;'
    if (!source.includes(importAnchor)) throw new Error('Tidak dapat menemukan import Notifiable pada model User.')
    source = source.replace(importAnchor, importAnchor + '\nuse Laravel\\Sanctum\\HasApiTokens;')
  }

  const hasApiTokensTrait = /^[ \t]*use\s+HasApiTokens(?:\s*,|\s*;)/m.test(source)
  if (!hasApiTokensTrait) {
    const traitLine = source.match(/^[ \t]*use\s+((?:HasFactory|Notifiable)(?:\s*,\s*(?:HasFactory|Notifiable))*)\s*;/m)
    if (!traitLine) throw new Error('Tidak dapat menemukan deklarasi trait HasFactory/Notifiable pada model User.')
    source = source.replace(traitLine[0], '    use HasApiTokens, ' + traitLine[1].trim() + ';')
  }

  const fillable = source.match(/protected\s+\$fillable\s*=\s*\[([\s\S]*?)\];/)
  if (!fillable) throw new Error('Tidak dapat menemukan properti $fillable pada model User.')

  if (!/(?:'role'|"role")/.test(fillable[1])) {
    const body = fillable[1].trim().replace(/,\s*$/, '')
    const updated = body ? body + ",\n        'role'," : "\n        'role',"
    source = source.replace(fillable[0], 'protected $fillable = [' + updated + '\n    ];')
  }

  fs.writeFileSync(file, source)
  return source
}
