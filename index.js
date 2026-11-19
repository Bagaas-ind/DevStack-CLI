#!/usr/bin/env node
import { program } from 'commander'
import chalk from 'chalk'
import fs from 'fs-extra'
import path from 'path'
import { spawnSync } from 'child_process'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const templates = path.join(__dirname, 'templates')

const fail = (msg) => {
  console.log(chalk.red(`\n✖ ${msg}\n`))
  process.exit(1)
}

// Jalankan perintah, tampilkan outputnya langsung. shell:true agar composer.bat jalan di Windows.
function run(cmd, args, cwd) {
  const res = spawnSync(cmd, args, { cwd, stdio: 'inherit', shell: true })
  return res.status === 0
}

function has(cmd) {
  return spawnSync(cmd, ['--version'], { stdio: 'ignore', shell: true }).status === 0
}

// Tambahkan trait HasApiTokens ke model User bawaan Laravel
function patchUserModel(backendDir) {
  const file = path.join(backendDir, 'app', 'Models', 'User.php')
  if (!fs.existsSync(file)) return false
  let src = fs.readFileSync(file, 'utf8')
  if (src.includes('HasApiTokens')) return true

  src = src.replace(
    'use Illuminate\\Notifications\\Notifiable;',
    'use Illuminate\\Notifications\\Notifiable;\nuse Laravel\\Sanctum\\HasApiTokens;'
  )
  src = src.replace(/use (HasFactory, Notifiable);/, 'use HasApiTokens, $1;')
  fs.writeFileSync(file, src)
  return src.includes('use HasApiTokens')
}

program
  .name('react-lara-forge')
  .description('Buat starter full-stack Laravel + React dalam satu perintah')
  .version('0.1.0')
  .argument('<project-name>', 'nama folder project')
  .option('--skip-backend', 'hanya buat frontend (lewati Laravel)')
  .action((projectName, options) => {
    const target = path.resolve(process.cwd(), projectName)

    if (!/^[a-zA-Z0-9._-]+$/.test(projectName)) {
      fail('Nama project hanya boleh berisi huruf, angka, titik, strip, dan garis bawah.')
    }
    if (fs.existsSync(target)) fail(`Folder "${projectName}" sudah ada.`)
    if (!fs.existsSync(templates)) fail('Folder "templates" tidak ditemukan di paket CLI ini.')

    if (!options.skipBackend) {
      if (!has('php')) fail('PHP tidak ditemukan. Install PHP 8.2+ atau jalankan dengan --skip-backend.')
      if (!has('composer')) fail('Composer tidak ditemukan. Install dari https://getcomposer.org atau pakai --skip-backend.')
    }

    console.log(chalk.cyan(`\n⚒  Membuat "${projectName}"...\n`))
    fs.ensureDirSync(target)

    // 1. Frontend
    console.log(chalk.bold('1/3 Frontend React'))
    const frontendDir = path.join(target, 'frontend')
    fs.copySync(path.join(templates, 'frontend'), frontendDir)
    fs.copySync(path.join(frontendDir, '.env.example'), path.join(frontendDir, '.env'))
    fs.writeFileSync(path.join(frontendDir, '.gitignore'), 'node_modules\ndist\n.env\n')

    // 2. Backend
    if (!options.skipBackend) {
      console.log(chalk.bold('\n2/3 Backend Laravel (butuh koneksi internet, bisa beberapa menit)'))
      const backendDir = path.join(target, 'backend')

      if (!run('composer', ['create-project', 'laravel/laravel', 'backend', '--no-interaction'], target)) {
        fail('Gagal membuat project Laravel. Periksa koneksi internet dan versi PHP/Composer.')
      }
      if (!run('php', ['artisan', 'install:api', '--no-interaction'], backendDir)) {
        fail('Gagal memasang Sanctum (php artisan install:api). Butuh Laravel 11 atau lebih baru.')
      }

      // Timpa dengan file template (route, controller, CORS, seeder)
      fs.copySync(path.join(templates, 'backend'), backendDir, { overwrite: true })
      if (!patchUserModel(backendDir)) {
        console.log(chalk.yellow('! Tambahkan trait HasApiTokens ke app/Models/User.php secara manual.'))
      }

      fs.appendFileSync(path.join(backendDir, '.env'), '\nFRONTEND_URL=http://localhost:5173\n')
      fs.appendFileSync(path.join(backendDir, '.env.example'), '\nFRONTEND_URL=http://localhost:5173\n')

      if (!run('php', ['artisan', 'migrate', '--force', '--seed'], backendDir)) {
        console.log(chalk.yellow('! Migrasi gagal. Jalankan "php artisan migrate --seed" setelah database siap.'))
      }
    } else {
      console.log(chalk.gray('\n2/3 Backend dilewati (--skip-backend)'))
    }

    // Skrip peluncur: klik dua kali start.bat (Windows) atau jalankan ./start.sh
    if (!options.skipBackend) {
      fs.copySync(path.join(templates, 'root', 'start.bat'), path.join(target, 'start.bat'))
      const sh = path.join(target, 'start.sh')
      fs.copySync(path.join(templates, 'root', 'start.sh'), sh)
      try { fs.chmodSync(sh, 0o755) } catch {}
    }

    // 3. Selesai
    console.log(chalk.bold('\n3/3 Selesai'))
    console.log(chalk.green(`\n✔ Project "${projectName}" siap!\n`))
    if (!options.skipBackend) {
      console.log(chalk.bold('Cara tercepat:'))
      console.log(`  Windows : klik dua kali ${chalk.cyan(`${projectName}\\start.bat`)}`)
      console.log(`  Mac/Linux: ${chalk.cyan(`cd ${projectName} && ./start.sh`)}\n`)
      console.log(chalk.bold('Atau manual:\n'))
    } else {
      console.log('Langkah selanjutnya:\n')
    }
    console.log(chalk.cyan(`  cd ${projectName}/frontend`))
    console.log(chalk.cyan('  npm install'))
    console.log(chalk.cyan('  npm run dev'))
    if (!options.skipBackend) {
      console.log('\nDi terminal lain:\n')
      console.log(chalk.cyan(`  cd ${projectName}/backend`))
      console.log(chalk.cyan('  php artisan serve'))
      console.log('\nLogin demo: admin@example.com / password\n')
    }
  })

program.parse()
