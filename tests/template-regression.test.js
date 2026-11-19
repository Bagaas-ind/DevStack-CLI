import test from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { patchUserModel } from '../lib/patch-user-model.js'

test('patchUserModel adds Sanctum and role without creating an empty array element', (t) => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'rlf-user-model-'))
  t.after(() => fs.rmSync(root, { recursive: true, force: true }))
  const modelDir = path.join(root, 'app', 'Models')
  fs.mkdirSync(modelDir, { recursive: true })
  const modelFile = path.join(modelDir, 'User.php')

  fs.writeFileSync(modelFile, \`<?php

namespace App\\Models;

use Illuminate\\Foundation\\Auth\\User as Authenticatable;
use Illuminate\\Notifications\\Notifiable;

class User extends Authenticatable
{
    use HasFactory, Notifiable;

    protected $fillable = [
        'name',
        'email',
        'password',
    ];
}
\`)

  const patched = patchUserModel(root)
  assert.match(patched, /use Laravel\\Sanctum\\HasApiTokens;/)
  assert.match(patched, /use HasApiTokens, HasFactory, Notifiable;/)
  assert.match(patched, /'password',\\s*'role',/)
  assert.doesNotMatch(patched, /'password',\\s*,/)
  assert.equal((patched.match(/'role'/g) || []).length, 1)
})
