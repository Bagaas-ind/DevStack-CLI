import fs from 'fs-extra'
import path from 'node:path'
import readline from 'node:readline/promises'
import { stdin as input, stdout as output } from 'node:process'
import chalk from 'chalk'

import { FRAMEWORKS } from './frameworks.js'
import { runSync } from './run.js'
import { validateProjectName } from './project-name.js'
import { registerInterruptCleanup } from './cleanup.js'
import { t } from './i18n.js'

const messages = {
  en: {
    title: 'FRAMEWORK INSTALLER',
    question: 'Select a framework:',
    project: 'Enter project name:',
    choose: 'Choose a number:',
    invalid: 'Invalid selection.',
    cancelled: 'Installation cancelled.',
    exists: 'Project directory already exists.',
    checking: 'Checking requirements...',
    installing: 'Installing',
    success: 'Installation completed successfully!',
    failed: 'Installation failed:',
    pythonInfo: 'Python virtual environment created in .venv.',
    springInfo: 'Downloading Spring Boot project from Spring Initializr...',
    springError: 'Could not download Spring Boot project. Check internet connection.',
    runtime: 'Required runtime not found:',
    done: 'Next steps:',
  },
  id: {
    title: 'PEMASANG FRAMEWORK',
    question: 'Pilih framework:',
    project: 'Masukkan nama project:',
    choose: 'Pilih nomor:',
    invalid: 'Pilihan tidak valid.',
    cancelled: 'Instalasi dibatalkan.',
    exists: 'Folder project sudah tersedia.',
    checking: 'Memeriksa kebutuhan sistem...',
    installing: 'Memasang',
    success: 'Instalasi berhasil diselesaikan!',
    failed: 'Instalasi gagal:',
    pythonInfo: 'Virtual environment Python dibuat di .venv.',
    springInfo: 'Mengunduh project Spring Boot dari Spring Initializr...',
    springError: 'Gagal mengunduh Spring Boot. Periksa koneksi internet.',
    runtime: 'Runtime yang diperlukan tidak ditemukan:',
    done: 'Langkah berikutnya:',
  },
}

function getMessages(lang) {
  return messages[lang] || messages.en
}

function execute(command, args, cwd, options = {}) {
  const result = runSync(command, args, {
    cwd,
    stdio: options.stdio || 'inherit',
    encoding: options.encoding,
    env: process.env,
  })

  if (result.status !== 0) {
    throw result.error || new Error(`${command} exited with code ${result.status}`)
  }

  return result
}

function checkCommand(command, args = ['--version']) {
  try {
    const result = runSync(command, args, {
      stdio: 'pipe',
      encoding: 'utf8',
      env: process.env,
    })

    return result.status === 0
  } catch {
    return false
  }
}

function checkRequirements(framework) {
  const missing = []

  for (const runtime of framework.runtime) {
    let available = false

    switch (runtime) {
      case 'node':
        available = checkCommand('node', ['--version'])
        break

      case 'npm':
        available = checkCommand('npm', ['--version'])
        break

      case 'php':
        available = checkCommand('php', ['-v'])
        break

      case 'composer':
        available = checkCommand('composer', ['--version'])
        break

      case 'python':
        available =
          checkCommand('python', ['--version']) ||
          checkCommand('py', ['--version'])
        break

      case 'java':
        available = checkCommand('java', ['-version'])
        break
    }

    if (!available) missing.push(runtime)
  }

  if (framework.id === 'spring' && !checkCommand('tar', ['--version'])) {
    missing.push('tar')
  }

  if (missing.length) {
    throw new Error(missing.join(', '))
  }
}

function pythonCommand() {
  if (checkCommand('python', ['--version'])) return 'python'
  if (checkCommand('py', ['--version'])) return 'py'

  throw new Error('Python tidak ditemukan.')
}

function pythonExecutable(target) {
  return process.platform === 'win32'
    ? path.join(target, '.venv', 'Scripts', 'python.exe')
    : path.join(target, '.venv', 'bin', 'python')
}

async function installPython(framework, target) {
  const command = pythonCommand()

  execute(command, ['-m', 'venv', '.venv'], target)

  const python = pythonExecutable(target)

  if (!fs.existsSync(python)) {
    throw new Error('Python virtual environment gagal dibuat.')
  }

  const packages = {
    django: 'Django',
    flask: 'Flask',
    fastapi: 'fastapi',
  }

  const packageName = packages[framework.id]

  execute(
    python,
    ['-m', 'pip', 'install', '--upgrade', 'pip'],
    target
  )

  execute(
    python,
    ['-m', 'pip', 'install', packageName],
    target
  )

  const requirements = `${packageName}\n`

  fs.writeFileSync(
    path.join(target, 'requirements.txt'),
    requirements
  )

  if (framework.id === 'django') {
    execute(
      python,
      ['-m', 'django', 'startproject', 'config', '.'],
      target
    )
  }

  if (framework.id === 'flask') {
    fs.writeFileSync(
      path.join(target, 'app.py'),
      `from flask import Flask

app = Flask(__name__)

@app.route("/")
def home():
    return "Hello from StackPilot!"

if __name__ == "__main__":
    app.run(debug=True)
`
    )
  }

  if (framework.id === 'fastapi') {
    execute(
      python,
      ['-m', 'pip', 'install', 'uvicorn'],
      target
    )

    fs.writeFileSync(
      path.join(target, 'main.py'),
      `from fastapi import FastAPI

app = FastAPI()

@app.get("/")
def home():
    return {"message": "Hello from StackPilot!"}
`
    )

    fs.appendFileSync(
      path.join(target, 'requirements.txt'),
      'uvicorn\n'
    )
  }
}

async function installExpress(target) {
  execute('npm', ['init', '-y'], target)

  execute('npm', ['install', 'express'], target)

  const packageFile = path.join(target, 'package.json')
  const packageJson = fs.readJsonSync(packageFile)

  packageJson.scripts = {
    ...packageJson.scripts,
    start: 'node server.js',
    dev: 'node --watch server.js',
  }

  fs.writeJsonSync(packageFile, packageJson, { spaces: 2 })

  fs.writeFileSync(
    path.join(target, 'server.js'),
    `const express = require('express')

const app = express()
const PORT = process.env.PORT || 3000

app.get('/', (req, res) => {
  res.send('Hello from StackPilot!')
})

app.listen(PORT, () => {
  console.log(\`Server running at http://localhost:\${PORT}\`)
})
`
  )
}

async function installSpring(target, projectName, lang) {
  const msg = getMessages(lang)

  console.log(chalk.gray(msg.springInfo))

  const url = new URL('https://start.spring.io/starter.zip')

  url.searchParams.set('type', 'maven-project')
  url.searchParams.set('language', 'java')
  url.searchParams.set('packaging', 'jar')
  url.searchParams.set('javaVersion', '17')
  url.searchParams.set('groupId', 'com.example')
  url.searchParams.set('artifactId', projectName)
  url.searchParams.set('name', projectName)
  url.searchParams.set('packageName', 'com.example.stackpilot')
  url.searchParams.set('dependencies', 'web')

  const response = await fetch(url)

  if (!response.ok) {
    throw new Error(msg.springError)
  }

  const buffer = Buffer.from(await response.arrayBuffer())

  if (buffer.length < 1000) {
    throw new Error(msg.springError)
  }

  fs.writeFileSync(path.join(target, 'starter.zip'), buffer)

  execute('tar', ['-xf', 'starter.zip', '-C', '.'], target)

  fs.removeSync(path.join(target, 'starter.zip'))
}

async function installFramework(framework, projectName, lang) {
  const msg = getMessages(lang)

  const target = path.resolve(process.cwd(), projectName)

  if (fs.existsSync(target)) {
    throw new Error(msg.exists)
  }

  const validation = validateProjectName(projectName)

  if (!validation.ok) {
    throw new Error(
      t(lang, `error.projectName.${validation.code}`, validation.params)
    )
  }

  console.log(chalk.cyan(`\n${msg.checking}`))

  checkRequirements(framework)

  console.log(
    chalk.cyan(`\n${msg.installing} ${framework.name}...\n`)
  )

  let created = false

  const dispose = registerInterruptCleanup(() => {
    if (created && fs.existsSync(target)) {
      fs.removeSync(target)
    }
  })

  try {
    if (framework.setup === 'spring') {
      fs.ensureDirSync(target)
      created = true

      await installSpring(target, projectName, lang)
    } else if (framework.setup === 'express') {
      fs.ensureDirSync(target)
      created = true

      await installExpress(target)
    } else if (framework.setup) {
      fs.ensureDirSync(target)
      created = true

      await installPython(framework, target)
    } else {
      execute(
        framework.command,
        framework.args(projectName),
        process.cwd()
      )

      created = true
    }

    dispose()

    console.log(chalk.green(`\n[SUCCESS] ${msg.success}\n`))

    console.log(chalk.bold(msg.done))

    console.log(chalk.cyan(`  cd ${projectName}`))

    if (framework.id === 'django') {
      console.log('  .venv\\Scripts\\activate')
      console.log('  python manage.py runserver')
    } else if (framework.id === 'flask') {
      console.log('  .venv\\Scripts\\activate')
      console.log('  python app.py')
    } else if (framework.id === 'fastapi') {
      console.log('  .venv\\Scripts\\activate')
      console.log('  uvicorn main:app --reload')
    } else if (framework.id === 'express') {
      console.log('  npm start')
    } else if (framework.id === 'spring') {
      console.log('  ./mvnw spring-boot:run')
    } else if (framework.id === 'laravel') {
      console.log('  php artisan serve')
    } else if (framework.id === 'codeigniter') {
      console.log('  php spark serve')
    } else if (framework.id === 'symfony') {
      console.log('  symfony server:start')
    } else {
      console.log('  npm run dev')
    }

    return true
  } catch (error) {
    dispose()

    if (created && fs.existsSync(target)) {
      fs.removeSync(target)
    }

    throw error
  }
}

export async function runFrameworkInstaller({ lang = 'en' } = {}) {
  if (!process.stdin.isTTY || !process.stdout.isTTY) {
    throw new Error('Framework Installer membutuhkan terminal interaktif.')
  }

  const msg = getMessages(lang)

  const rl = readline.createInterface({ input, output })

  try {
    console.log(chalk.cyan.bold(`\n${msg.title}\n`))
    console.log(`${msg.question}\n`)

    FRAMEWORKS.forEach((framework, index) => {
      console.log(
        `  ${index + 1}. ${framework.name} (${framework.category})`
      )
    })

    console.log(`  0. ${lang === 'id' ? 'Kembali' : 'Back'}`)

    const answer = (await rl.question(`\n${msg.choose} `)).trim()

    if (answer === '0') return

    const index = Number(answer) - 1
    const framework = FRAMEWORKS[index]

    if (!Number.isInteger(index) || !framework) {
      console.log(chalk.yellow(msg.invalid))
      return
    }

    const projectName = (
      await rl.question(`\n${msg.project} `)
    ).trim()

    if (!projectName) return

    rl.close()

    await installFramework(framework, projectName, lang)
  } finally {
    if (rl.closed === false) rl.close()
  }
}