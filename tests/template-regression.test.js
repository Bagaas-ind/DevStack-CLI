import test from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { patchUserModel } from '../lib/patch-user-model.js'

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)))

test('patchUserModel adds Sanctum and role without creating an empty array element', (t) => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'rlf-user-model-'))
  t.after(() => fs.rmSync(root, { recursive: true, force: true }))
  const modelDir = path.join(root, 'app', 'Models')
  fs.mkdirSync(modelDir, { recursive: true })
  const modelFile = path.join(modelDir, 'User.php')
  const fixture = [
    '<?php',
    '',
    'namespace App\\Models;',
    '',
    'use Illuminate\\Foundation\\Auth\\User as Authenticatable;',
    'use Illuminate\\Notifications\\Notifiable;',
    '',
    'class User extends Authenticatable',
    '{',
    '    use HasFactory, Notifiable;',
    '',
    '    protected $fillable = [',
    "        'name',",
    "        'email',",
    "        'password',",
    '    ];',
    '}',
    '',
  ].join('\n')
  fs.writeFileSync(modelFile, fixture)

  const patched = patchUserModel(root)
  assert.match(patched, /use Laravel\\Sanctum\\HasApiTokens;/)
  assert.match(patched, /use HasApiTokens, HasFactory, Notifiable;/)
  assert.match(patched, /'password',\s*'role',/)
  assert.doesNotMatch(patched, /'password',\s*,/)
  assert.equal((patched.match(/'role'/g) || []).length, 1)
})

test('Laravel API exceptions are rendered as JSON without an Accept header', () => {
  const bootstrap = fs.readFileSync(
    path.join(root, 'templates', 'backend', 'bootstrap', 'app.php'),
    'utf8'
  )
  assert.ok(bootstrap.includes(String.raw`use Illuminate\Http\Request;`))
  assert.match(bootstrap, /shouldRenderJsonWhen/)
  assert.match(bootstrap, /\$request->is\('api\/\*'\) \|\| \$request->expectsJson\(\)/)
})


test('Sanctum tokens have a finite lifetime and login revokes older tokens', async () => {
  const auth = fs.readFileSync(path.join(root, 'templates', 'backend', 'app', 'Http', 'Controllers', 'AuthController.php'), 'utf8')
  const sanctum = fs.readFileSync(path.join(root, 'templates', 'backend', 'config', 'sanctum.php'), 'utf8')
  assert.match(sanctum, /'expiration'\s*=>\s*env\('SANCTUM_EXPIRATION',\s*43200\)/)
  const login = auth.slice(auth.indexOf('public function login'), auth.indexOf('public function logout'))
  assert.match(login, /\$user->tokens\(\)->delete\(\)/)
})

test('demo credentials are blocked outside local and testing environments', () => {
  const seeder = fs.readFileSync(path.join(root, 'templates', 'backend', 'database', 'seeders', 'DatabaseSeeder.php'), 'utf8')
  assert.match(seeder, /! \$isLocal && \(\$email === 'admin@example.com' \|\| \$password === 'password'\)/)
})
