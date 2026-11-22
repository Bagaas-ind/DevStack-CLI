#!/usr/bin/env node

import { program } from 'commander'
import chalk from 'chalk'
import fs from 'fs-extra'
import path from 'node:path'
import { runSync } from './lib/run.js'
import { fileURLToPath } from 'node:url'
import readline from 'node:readline/promises'
import { stdin as input, stdout as output } from 'node:process'
import { patchUserModel } from './lib/patch-user-model.js'
import { runMainMenu, askProjectName } from './lib/menu.js'
import { runFrameworkInstaller } from './lib/installer.js'
import { normalizeLang, t } from './lib/i18n.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const templates = path.join(__dirname, 'templates')
const VERSION = '0.5.0'

function fail(message) {
  console.error(chalk.red(`\n[ERROR] ${message}\n`))
  process.exitCode = 1
}

function run(command, args, cwd, { stdio = 'inherit' } = {}) {
  const result = runSync(command, args, {
    cwd,
    stdio,
    env: process.env,
  })

  return {
    ok: result.status === 0,
    error: result.error,
    status: result.status,
  }
}

function checkRuntimeRequirements(skipBackend) {
  const nodeMajor = Number(process.versions.node.split('.')[0])

  if (![22, 24].includes(nodeMajor)) {
    throw new Error(
      `Node.js 22 atau 24 LTS diperlukan. Versi saat ini: ${process.versions.node}. Instal versi LTS dari https://nodejs.org/ lalu jalankan ulang.`
    )
  }

  const npm = runSync('npm', ['--version'], {
    encoding: 'utf8',
    stdio: 'pipe',
  })

  if (npm.error || npm.status !== 0) {
    throw new Error(
      'npm tidak ditemukan. Instal ulang Node.js LTS atau periksa PATH, lalu jalankan ulang.'
    )
  }

  if (skipBackend) return

  const php = runSync('php', ['-v'], {
    encoding: 'utf8',
    stdio: 'pipe',
  })

  const phpOutput = `${php.stdout || ''}\n${php.stderr || ''}`
  const phpVersion = phpOutput.match(/PHP\s+(\d+)\.(\d+)/)

  if (
    php.error ||
    php.status !== 0 ||
    !phpVersion ||
    Number(phpVersion[1]) < 8 ||
    (Number(phpVersion[1]) === 8 && Number(phpVersion[2]) < 2)
  ) {
    throw new Error(
      'PHP 8.2 atau lebih baru diperlukan untuk backend. Periksa instalasi/PATH PHP atau gunakan --skip-backend.'
    )
  }

  const composer = runSync('composer', ['--version'], {
    encoding: 'utf8',
    stdio: 'pipe',
  })

  const composerOutput = `${composer.stdout || ''}\n${composer.stderr || ''}`

  if (
    composer.error ||
    composer.status !== 0 ||
    !/Composer version 2\./i.test(composerOutput)
  ) {
    throw new Error(
      'Composer 2.x diperlukan untuk membuat backend Laravel. Instal dari https://getcomposer.org/ dan periksa PATH.'
    )
  }
}

async function ask(rl, label, choices, defaultValue) {
  const menu = choices
    .map(
      (choice, index) =>
        `${index + 1}) ${choice.label}${choice.value === defaultValue ? ' (default)' : ''}`
    )
    .join('\n')

  while (true) {
    const answer = (
      await rl.question(
        `${label}\n${menu}\nPilih [${choices.findIndex((choice) => choice.value === defaultValue) + 1}]: `
      )
    ).trim()

    if (!answer) return defaultValue

    const selected = Number(answer)

    if (Number.isInteger(selected) && choices[selected - 1]) {
      return choices[selected - 1].value
    }

    const byValue = choices.find(
      (choice) => choice.value.toLowerCase() === answer.toLowerCase()
    )

    if (byValue) return byValue.value

    console.log(chalk.yellow('Pilihan tidak valid. Masukkan nomor pilihan.\n'))
  }
}

async function collectConfig(options) {
  const config = {
    language: options.language || (options.typescript ? 'typescript' : 'javascript'),
    database: options.database || 'sqlite',
    laravelVersion: options.laravelVersion || '12.*',
  }

  if (options.nonInteractive || !process.stdin.isTTY || !process.stdout.isTTY) {
    return config
  }

  const rl = readline.createInterface({ input, output })

  try {
    console.log(chalk.cyan('\nKonfigurasi StackPilot\n'))

    config.language = await ask(
      rl,
      'Bahasa frontend:',
      [
        {
          label: 'JavaScript - lebih sederhana untuk mulai',
          value: 'javascript',
        },
        {
          label: 'TypeScript - type checking untuk proyek terstruktur',
          value: 'typescript',
        },
      ],
      config.language
    )

    if (!options.skipBackend) {
      config.database = await ask(
        rl,
        'Database Laravel:',
        [
          {
            label: 'SQLite - tanpa server database (default)',
            value: 'sqlite',
          },
          {
            label: 'MySQL',
            value: 'mysql',
          },
          {
            label: 'PostgreSQL',
            value: 'pgsql',
          },
        ],
        config.database
      )
    }
  } finally {
    rl.close()
  }

  return config
}

function configureDatabase(backendDir, database) {
  const values = {
    DB_CONNECTION: database,
    DB_HOST: database === 'sqlite' ? '' : '127.0.0.1',
    DB_PORT:
      database === 'mysql'
        ? '3306'
        : database === 'pgsql'
          ? '5432'
          : '',
    DB_DATABASE:
      database === 'sqlite' ? 'database/database.sqlite' : 'laravel',
    DB_USERNAME:
      database === 'mysql'
        ? 'root'
        : database === 'pgsql'
          ? 'postgres'
          : '',
    DB_PASSWORD: '',
  }

  for (const fileName of ['.env', '.env.example']) {
    const file = path.join(backendDir, fileName)

    let env = fs.readFileSync(file, 'utf8')

    for (const [key, value] of Object.entries(values)) {
      const line = `${key}=${value}`
      const pattern = new RegExp(`^${key}=.*$`, 'm')

      if (pattern.test(env)) {
        env = env.replace(pattern, line)
      } else {
        env += `\n${line}`
      }
    }

    if (!/^FRONTEND_URL=/m.test(env)) {
      env += '\nFRONTEND_URL=http://localhost:5173'
    }

    if (!/^ADMIN_NAME=/m.test(env)) {
      env += '\nADMIN_NAME='
    }

    if (!/^ADMIN_EMAIL=/m.test(env)) {
      env += '\nADMIN_EMAIL='
    }

    if (!/^ADMIN_PASSWORD=/m.test(env)) {
      env += '\nADMIN_PASSWORD='
    }

    fs.writeFileSync(file, `${env.trimEnd()}\n`)
  }

  if (database === 'sqlite') {
    fs.ensureFileSync(
      path.join(backendDir, 'database', 'database.sqlite')
    )
  }
}

async function createProject(projectName, options) {
  if (
    !/^[a-zA-Z0-9][a-zA-Z0-9._-]*$/.test(projectName) ||
    projectName === '.' ||
    projectName === '..'
  ) {
    throw new Error(
      'Nama project harus diawali huruf/angka dan hanya boleh berisi huruf, angka, titik, strip, atau garis bawah.'
    )
  }

  const templateName = options.template || 'starter'

  if (!['starter', 'ecommerce'].includes(templateName)) {
    throw new Error('Template tidak dikenal. Pilihan: starter, ecommerce.')
  }

  const templateDir =
    templateName === 'starter'
      ? templates
      : path.join(templates, templateName)

  if (!fs.existsSync(templateDir)) {
    throw new Error(`Folder template "${templateName}" tidak ditemukan.`)
  }

  if (templateName === 'ecommerce' && options.skipBackend) {
    throw new Error('Template ecommerce membutuhkan backend Laravel.')
  }

  const laravelVersion = options.laravelVersion || '12.*'

  if (!/^\d+\.(?:\d+(?:\.\d+)?|\*)$/.test(laravelVersion)) {
    throw new Error(
      'Versi Laravel tidak valid. Gunakan format seperti 12.* atau 12.8.0.'
    )
  }

  const target = path.resolve(process.cwd(), projectName)

  if (fs.existsSync(target)) {
    throw new Error(
      `Folder atau file "${projectName}" sudah ada. Pilih nama lain.`
    )
  }

  if (!fs.existsSync(templates)) {
    throw new Error(
      'Folder templates tidak ditemukan. Instalasi paket mungkin tidak lengkap.'
    )
  }

  checkRuntimeRequirements(options.skipBackend)

  const config = await collectConfig(options)

  if (!['javascript', 'typescript'].includes(config.language)) {
    throw new Error('Bahasa frontend harus javascript atau typescript.')
  }

  if (!['sqlite', 'mysql', 'pgsql'].includes(config.database)) {
    throw new Error('Database harus sqlite, mysql, atau pgsql.')
  }

  let created = false
  let currentStep = 'menyiapkan direktori proyek'

  try {
    fs.ensureDirSync(target)
    created = true

    console.log(chalk.cyan(`\n[CREATE] Membuat ${projectName}\n`))

    const frontendTemplate = path.join(
      templateDir,
      config.language === 'typescript' ? 'frontend-ts' : 'frontend'
    )

    const frontendDir = path.join(target, 'frontend')

    currentStep = 'menyiapkan frontend React'

    console.log(chalk.bold('1/3 Menyiapkan frontend React'))

    fs.copySync(frontendTemplate, frontendDir)

    fs.copySync(
      path.join(frontendDir, '.env.example'),
      path.join(frontendDir, '.env')
    )

    fs.writeFileSync(
      path.join(frontendDir, '.gitignore'),
      'node_modules/\ndist/\n.env\n'
    )

    fs.copyFileSync(
      path.join(templateDir, 'root', 'PROJECT_README.md'),
      path.join(target, 'README.md')
    )

    if (!options.skipBackend) {
      console.log(
        chalk.bold('\n2/3 Membuat backend Laravel dan memasang Sanctum')
      )

      const backendDir = path.join(target, 'backend')

      currentStep = 'membuat backend Laravel'

      const composerResult = run(
        'composer',
        [
          'create-project',
          `laravel/laravel:${config.laravelVersion}`,
          'backend',
          '--no-interaction',
          '--no-scripts',
        ],
        target
      )

      if (!composerResult.ok) {
        throw new Error(
          'Composer gagal membuat Laravel. Periksa koneksi internet, versi PHP, dan output Composer di atas.'
        )
      }

      currentStep = 'menyiapkan environment Laravel'

      const envFile = path.join(backendDir, '.env')
      const envExample = path.join(backendDir, '.env.example')

      if (!fs.existsSync(envFile)) {
        if (!fs.existsSync(envExample)) {
          throw new Error('File .env.example Laravel tidak ditemukan.')
        }

        fs.copyFileSync(envExample, envFile)
      }

      currentStep = 'menerapkan template backend dan konfigurasi database'

      fs.copySync(
        path.join(templateDir, 'backend'),
        backendDir,
        { overwrite: true }
      )

      patchUserModel(backendDir)
      configureDatabase(backendDir, config.database)

      currentStep = 'membuat application key Laravel'

      const keyResult = run(
        'php',
        ['artisan', 'key:generate', '--force', '--no-interaction'],
        backendDir
      )

      if (!keyResult.ok) {
        throw new Error('Gagal membuat application key Laravel.')
      }

      currentStep = 'memasang API dan Sanctum Laravel'

      const apiResult = run(
        'php',
        ['artisan', 'install:api', '--no-interaction'],
        backendDir
      )

      if (!apiResult.ok) {
        throw new Error(
          'Laravel gagal memasang API/Sanctum. Periksa versi Laravel dan output Artisan di atas.'
        )
      }

      console.log(
        chalk.gray(`\nMenjalankan migrasi database (${config.database})...`)
      )

      currentStep = 'menjalankan migrasi database'

      const migration = run(
        'php',
        ['artisan', 'migrate', '--seed', '--no-interaction'],
        backendDir
      )

      if (!migration.ok) {
        throw new Error(
          'Migrasi database gagal. Periksa konfigurasi database di backend/.env dan pastikan server database tersedia.'
        )
      }

      currentStep = 'menyalin script launcher lintas platform'

      fs.copySync(
        path.join(templateDir, 'root', 'start.bat'),
        path.join(target, 'start.bat')
      )

      const shellScript = path.join(target, 'start.sh')

      fs.copySync(
        path.join(templateDir, 'root', 'start.sh'),
        shellScript
      )

      fs.chmodSync(shellScript, 0o755)
    } else {
      console.log(
        chalk.gray('\n2/3 Backend dilewati (--skip-backend)')
      )
    }

    if (!options.skipInstall) {
      console.log(chalk.bold('\n3/3 Memasang dependency frontend'))

      currentStep = 'memasang dependency frontend'

      const install = run('npm', ['install'], frontendDir)

      if (!install.ok) {
        throw new Error(
          'npm install gagal. Periksa koneksi internet dan pesan error npm di atas.'
        )
      }
    } else {
      console.log(
        chalk.gray('\n3/3 Instalasi dependency dilewati (--skip-install)')
      )
    }

    console.log(chalk.green(`\n[SUCCESS] ${projectName} berhasil dibuat.\n`))

    console.log(chalk.bold('Konfigurasi project:'))

    console.log(
      `  Frontend  : React + Vite + ${
        config.language === 'typescript' ? 'TypeScript' : 'JavaScript'
      }`
    )

    if (!options.skipBackend) {
      console.log(
        `  Backend   : Laravel + Sanctum (${config.database})`
      )
    }

    console.log('\nLangkah berikutnya:')

    if (!options.skipBackend) {
      console.log(chalk.cyan(`  cd ${projectName}`))

      console.log(
        chalk.cyan(
          process.platform === 'win32'
            ? '  start.bat'
            : '  ./start.sh'
        )
      )

      console.log(
        '\nAtau jalankan backend dan frontend secara terpisah. Baca README.md di project hasil generate.'
      )

      console.log(
        chalk.yellow(
          '\nPENTING: akun demo hanya untuk development lokal. Ganti/hapus kredensial sebelum deployment.'
        )
      )
    } else {
      console.log(
        chalk.cyan(`  cd ${projectName}/frontend && npm run dev`)
      )
    }
  } catch (error) {
    if (created && fs.existsSync(target)) {
      fs.removeSync(target)

      console.log(
        chalk.yellow('\nFolder project yang gagal dibuat telah dibersihkan.')
      )
    }

    throw new Error(
      `Gagal pada langkah: ${currentStep}. ${
        error.message || 'Kesalahan tidak diketahui.'
      }`
    )
  }
}

program
  .name('stackpilot')
  .description('Universal developer environment manager: diagnostics, framework setup, and project generation')
  .version(VERSION)
  .option('--lang <language>', 'bahasa CLI: en atau id', 'en')
  .argument('[project-name]', 'nama project atau perintah manager')
  .option('--template <name>', 'jenis template: starter atau ecommerce', 'starter')
  .option('--skip-backend', 'buat frontend saja tanpa Laravel')
  .option('--typescript', 'gunakan template React + TypeScript')
  .option('--language <language>', 'bahasa frontend: javascript atau typescript')
  .option('--database <driver>', 'database Laravel: sqlite, mysql, atau pgsql')
  .option('--laravel-version <version>', 'versi Laravel, default 12.*')
  .option('--non-interactive', 'gunakan konfigurasi default tanpa prompt')
  .option('--skip-install', 'lewati npm install frontend')
  .addHelpText(
    'after',
    `\nContoh:
  $ node index.js
  $ node index.js doctor
  $ node index.js environment
  $ node index.js database
  $ node index.js docker
  $ node index.js my-app
  $ node index.js my-app --typescript
  $ node index.js my-app --database mysql --non-interactive
  $ node index.js my-app --laravel-version '12.*'
  $ node index.js my-frontend --skip-backend`
  )
  .action(async (projectName, options) => {
    try {
      const lang = normalizeLang(options.lang)

      if (!lang) {
        throw new Error(
          t('en', 'error.lang_unsupported', {
            value: options.lang,
            supported: 'en, id',
          })
        )
      }


      if (['environment', 'database', 'docker'].includes(projectName)) {
        if (projectName === 'environment') {
          const { runEnvironmentManager } = await import('./lib/environment-manager.js')
          await runEnvironmentManager()
        } else if (projectName === 'database') {
          const { runDatabaseManager } = await import('./lib/database-manager.js')
          runDatabaseManager()
        } else {
          const { runDockerManager } = await import('./lib/docker-manager.js')
          await runDockerManager()
        }
        return
      }

      if (projectName === 'doctor') {
        const { runDoctor } = await import('./lib/doctor.js')
        runDoctor()
        return
      }

      if (projectName === '__STACKPILOT_MAIN_MENU__') {
        while (true) {
          const selected = await runMainMenu({ lang })

          if (selected === 'exit') return

          if (selected === 'doctor') {
            const { runDoctor } = await import('./lib/doctor.js')
            runDoctor()
            continue
          }

          if (selected === 'environment') {
            const { runEnvironmentManager } = await import('./lib/environment-manager.js')
            await runEnvironmentManager()
            continue
          }

          if (selected === 'database') {
            const { runDatabaseManager } = await import('./lib/database-manager.js')
            runDatabaseManager()
            continue
          }

          if (selected === 'docker') {
            const { runDockerManager } = await import('./lib/docker-manager.js')
            await runDockerManager()
            continue
          }

          if (selected === 'installer') {
            await runFrameworkInstaller({ lang })
            continue
          }

          if (selected === 'generator') break
        }

        projectName = await askProjectName({ lang })

        if (!projectName) return
      }

      await createProject(projectName, options)
    } catch (error) {
      fail(error.message || 'Terjadi kesalahan yang tidak diketahui.')
    }
  })

// Support main menu without breaking the legacy CLI contract.
const cliArgs = process.argv.slice(2)

const valueOptions = new Set([
  '--lang',
  '--template',
  '--language',
  '--database',
  '--laravel-version',
])

let hasProjectName = false

for (let i = 0; i < cliArgs.length; i++) {
  const arg = cliArgs[i]

  if (arg === '--') {
    hasProjectName = i + 1 < cliArgs.length
    break
  }

  if (arg.startsWith('--')) {
    if (valueOptions.has(arg) && !arg.includes('=')) {
      i++
    }

    continue
  }

  if (arg.startsWith('-')) continue

  hasProjectName = true
  break
}

if (!hasProjectName) {
  process.argv.splice(2, 0, '__STACKPILOT_MAIN_MENU__')
}

await program.parseAsync()