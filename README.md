<div align="center">
  <img src="docs/assets/stackpilot-icon.svg" width="104" height="104" alt="StackPilot logo" />
  <h1>StackPilot</h1>
  <p><strong>One CLI. Every Development Environment.</strong></p>
  <p>A terminal toolkit for runtime diagnostics, framework installation, and full-stack application scaffolding.</p>
  <p><a href="https://github.com/Bagaas-ind/StackPilot/actions/workflows/ci.yml"><img src="https://github.com/Bagaas-ind/StackPilot/actions/workflows/ci.yml/badge.svg?branch=main" alt="CI"></a> <img src="https://img.shields.io/badge/Node.js-22%20%7C%2024-339933?logo=node.js&logoColor=white" alt="Node.js 22/24"> <img src="https://img.shields.io/badge/License-MIT-blue.svg" alt="MIT"></p>
  <p><a href="README.md">English</a> · <a href="README.id.md">Bahasa Indonesia</a></p>
</div>

---

## What is StackPilot?

StackPilot brings several everyday development setup tasks into one interactive CLI. It helps developers inspect their local tools, scaffold supported frameworks, and generate a Laravel + React application starter.

## Terminal experience

Run StackPilot without arguments to open the interactive menu. The terminal displays the StackPilot ASCII wordmark and tagline before showing the available actions.

```text
  ____  _             _    ____  _ _
 / ___|| |_ __ _  ___| | _|  _ \\(_) |
 \\___ \\| __/ _` |/ __| |/ / |_) | | |
  ___) | || (_| | (__|   <|  __/| | |
 |____/ \\__\\__,_|\\___|_|\\_\\_|   |_|

  StackPilot
  One CLI. Every Development Environment.

  1. Runtime Doctor
  2. Framework Installer
  3. Application Generator
  4. Exit
```

The repository logo is available at [docs/assets/stackpilot-icon.svg](docs/assets/stackpilot-icon.svg).

## Features

### 1. Runtime Doctor

Checks whether common developer tools are available and prints their detected versions:

- Node.js and npm — required by the CLI.
- PHP and Composer.
- Python.
- Java.
- Git.
- Docker.

It flags unsupported Node.js versions (StackPilot supports Node.js 22 and 24) and reports optional tools separately. Doctor is diagnostic only: it does not install, update, or remove software.

### 2. Framework Installer

Interactive installer for 11 framework starters:

| Ecosystem | Frameworks |
| --- | --- |
| PHP | Laravel, CodeIgniter 4, Symfony |
| JavaScript | React, Vue.js, Next.js, Express.js |
| Python | Django, Flask, FastAPI |
| Java | Spring Boot |

The installer checks the required runtime, asks for a project name, and runs the framework's setup command or starter workflow. Some installers require internet access and may download dependencies.

### 3. Application Generator

Creates a full-stack Laravel API + React SPA starter with:

- Laravel 12 backend and Sanctum API authentication.
- React + Vite frontend.
- JavaScript or TypeScript frontend.
- SQLite, MySQL, or PostgreSQL configuration.
- Starter and ecommerce template selection.
- Optional frontend-only generation with `--skip-backend`.
- Optional dependency-install skip with `--skip-install`.
- Windows and Unix startup scripts when the backend is generated.

Generated projects are development starting points, not production security certifications. Review configuration, credentials, authorization, CORS, and deployment hardening before production use.

## Requirements

- Node.js 22 or 24 LTS to run StackPilot.
- Framework-specific runtimes are required only for the selected installer.
- PHP 8.2+ and Composer 2.x for Laravel-based application generation.
- Internet access is generally needed to download framework starters and dependencies.

## Install and run

### Run directly from GitHub

```bash
npx --yes github:Bagaas-ind/StackPilot
```

### Clone the repository

```bash
git clone https://github.com/Bagaas-ind/StackPilot.git
cd StackPilot
npm ci
node index.js
```

### Common commands

```bash
# Open the interactive menu (shows the StackPilot logo)
node index.js

# Check developer runtimes
node index.js doctor

# Generate the default Laravel + React starter
node index.js my-app

# Generate with TypeScript
node index.js my-app --typescript

# Select a database without interactive prompts
node index.js my-app --database mysql --non-interactive

# Generate a frontend-only project
node index.js my-frontend --skip-backend

# Show CLI help and version
node index.js --help
node index.js --version
```

### Application Generator options

| Option | Purpose |
| --- | --- |
| `--template <starter|ecommerce>` | Select the application template |
| `--typescript` | Use the React + TypeScript frontend |
| `--language <javascript|typescript>` | Explicitly select the frontend language |
| `--database <sqlite|mysql|pgsql>` | Select the Laravel database driver |
| `--laravel-version <version>` | Select the Laravel version (default: `12.*`) |
| `--skip-backend` | Generate frontend only |
| `--skip-install` | Skip frontend `npm install` |
| `--non-interactive` | Use defaults/options without interactive prompts |
| `--lang <en|id>` | Select CLI interface language |

When using a local clone, run commands with `node index.js`. The npm package has not yet been published.

## Tests and CI

```bash
npm ci
npm test
```

GitHub Actions validates the CLI across supported operating systems and Node.js versions, checks PHP templates, and tests generated application workflows.

## Project status

| Component | Status |
| --- | --- |
| Runtime Doctor | Available |
| Framework Installer (11 frameworks) | Available |
| Laravel + React Application Generator | Available |
| Environment Manager | Planned |
| Database Manager | Planned |
| Docker Manager | Planned |

## Security

StackPilot runs framework setup commands and creates project files on your machine. Review commands and generated code before using them in important environments. Never commit secrets or real credentials. Generated applications must be reviewed and hardened before deployment.

## Contributing

Issues, bug reports, documentation improvements, and focused pull requests are welcome. Please include reproduction steps for bugs and tests for behavior changes.

## License

MIT — see [LICENSE](LICENSE).
