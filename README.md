<div align="center">

<img src="docs/assets/devstack-mark.svg" alt="DevStack CLI logo" width="72" />

# DevStack CLI

**Install frameworks. Generate application starters. Start coding.**

A beginner-friendly command-line toolkit for setting up development projects and generating a Laravel API + React application starter.

[English](README.md) | [Bahasa Indonesia](README.id.md)

[![Node.js](https://img.shields.io/badge/Node.js-22%2F24_LTS-339933?logo=node.js&logoColor=white)](https://nodejs.org/)
[![CI](https://github.com/Bagaas-ind/DevStack-CLI/actions/workflows/ci.yml/badge.svg?branch=main)](https://github.com/Bagaas-ind/DevStack-CLI/actions/workflows/ci.yml)
[![Laravel](https://img.shields.io/badge/Laravel-12-FF2D20?logo=laravel&logoColor=white)](https://laravel.com/)
[![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

[![GitHub stars](https://img.shields.io/github/stars/Bagaas-ind/DevStack-CLI?style=for-the-badge&logo=github)](https://github.com/Bagaas-ind/DevStack-CLI/stargazers)
[![GitHub issues](https://img.shields.io/github/issues/Bagaas-ind/DevStack-CLI?style=for-the-badge&logo=github)](https://github.com/Bagaas-ind/DevStack-CLI/issues)

</div>

---

## 📖 What is DevStack CLI?

Setting up a new development environment can be confusing, especially when you are learning a framework for the first time. You may need to remember installation commands, create project folders, configure dependencies, and connect several tools before writing your first line of application code.

**DevStack CLI aims to make that first step easier.** The long-term direction is to bring two workflows together:

1. **Framework Installer** — guided installation and project setup for supported development frameworks.
2. **Application Generator** — ready-to-customize application starters with useful features already connected.

The project is being expanded in stages. The existing React + Laravel generator is the current implemented foundation; the broader multi-framework installer is part of the planned direction and should not be considered available until it is documented as released.

## ✨ Current functionality

The current generator creates a separate Laravel API backend and React single-page application (SPA).

- **JavaScript or TypeScript** frontend.
- **Laravel 12.x** backend with Sanctum personal access token authentication.
- **SQLite, MySQL, or PostgreSQL** database configuration.
- Registration, login, logout, protected API routes, and role-based authorization.
- Local development administrator seeder and admin dashboard/user management.
- React 18, Vite 6, Tailwind CSS 4, React Router, and Axios.
- Windows and macOS/Linux launch scripts.
- CLI validation and automated tests.

> The current scaffold is a development starting point, not a finished business application or a production security certification. Review and adapt generated code before deployment.

## 🧭 Project direction

The planned architecture keeps the two workflows separate:

| Part | Purpose | Status |
|---|---|---|
| Framework Installer | Help users set up supported frameworks through guided CLI steps | Planned / in development |
| Application Generator | Generate a Laravel API + React SPA starter | Existing functionality |
| More application templates | Add reusable project types while preserving existing templates | Planned |

The framework list and supported versions will be published here only after each installer has been implemented and tested.

## 📋 Requirements

For the current Laravel + React generator:

| Tool | Version | Purpose |
|---|---|---|
| Node.js | 22 or 24 LTS | Runs the CLI and frontend tooling |
| npm | Included with Node.js | Installs frontend dependencies |
| PHP | 8.2 or newer | Runs Laravel 12 |
| Composer | 2.x | Creates and manages the Laravel backend |
| Database | SQLite, MySQL, or PostgreSQL | Stores application data |

Check your environment:

```bash
node --version
npm --version
php --version
composer --version
```

## 🚀 Quick start

Generate a project from the current repository:

```bash
npx github:Bagaas-ind/DevStack-CLI my-project
```

Follow the prompts to select JavaScript or TypeScript and a database. The default choices are JavaScript and SQLite.

The generator downloads Laravel through Composer and installs frontend dependencies through npm, so an internet connection is required during generation.

### ▶️ Start the generated project

**Windows**

```powershell
cd my-project
.\start.bat
```

**macOS / Linux**

```bash
cd my-project
chmod +x start.sh
./start.sh
```

Default development addresses:

| Application | Address |
|---|---|
| React frontend | http://localhost:5173 |
| Laravel backend | http://localhost:8000 |

Open the frontend at http://localhost:5173.

For the default local development setup, the seeded administrator credentials are:

| Field | Local demo value |
|---|---|
| Email | `admin@example.com` |
| Password | `password` |

**Security:** These credentials are for local development only. Change or remove the demo account before exposing the application to other users. Never use the demo password in production.

## ⚙️ CLI options

General syntax:

```bash
npx github:Bagaas-ind/DevStack-CLI <project-name> [options]
```

| Option | Description |
|---|---|
| `--typescript` | Use the TypeScript frontend template |
| `--language <language>` | Choose `javascript` or `typescript` |
| `--laravel-version <version>` | Pin the Laravel version; defaults to `12.*` |
| `--database <driver>` | Choose `sqlite`, `mysql`, or `pgsql` |
| `--skip-backend` | Generate only the React frontend |
| `--skip-install` | Generate files without running frontend `npm install` |
| `--non-interactive` | Use supplied options and defaults without prompts |
| `-V, --version` | Display the CLI version |
| `-h, --help` | Display help |

Examples:

```bash
# TypeScript frontend
npx github:Bagaas-ind/DevStack-CLI my-app --typescript

# JavaScript + MySQL, without interactive prompts
npx github:Bagaas-ind/DevStack-CLI my-app --language javascript --database mysql --non-interactive

# Generate only the frontend
npx github:Bagaas-ind/DevStack-CLI my-frontend --skip-backend
```

When using `--non-interactive`, JavaScript and SQLite are selected by default unless overridden.

## 🗂️ Generated project structure

```text
my-project/
├── backend/                     # Laravel API + Sanctum
│   ├── app/Http/Controllers/
│   ├── database/
│   │   ├── migrations/
│   │   └── seeders/
│   └── routes/
│       └── api.php
├── frontend/                    # React + Vite + Tailwind CSS
│   ├── src/
│   ├── package.json
│   └── vite.config.js            # .ts for TypeScript projects
├── start.bat                     # Windows launcher
└── start.sh                      # macOS/Linux launcher
```

Exact files may vary depending on the selected language and generator options.

## 🔐 Authentication and security

The current scaffold uses Laravel Sanctum personal access tokens sent through the `Authorization: Bearer` header. It does not configure Sanctum's stateful cookie-based SPA authentication flow.

- Public registration is rate-limited and assigns the `user` role.
- Administrator-only operations are authorized by the Laravel backend.
- The frontend stores the returned token in `localStorage` for a straightforward starter experience. JavaScript-accessible storage increases the impact of cross-site scripting (XSS); review token storage and your threat model before production use.
- CORS is configured through `FRONTEND_URL`. Set it to the exact frontend origin used by your deployment.
- The demo administrator is intended for local/testing environments only.
- Do not commit `.env` files, credentials, access tokens, or production secrets.

Generated projects are development foundations. Before deployment, review authentication, authorization, validation, token handling, HTTPS, logging, monitoring, backups, dependency updates, and environment configuration.

## 🗄️ Database configuration

The selected driver is written to `backend/.env`.

| Driver | Notes |
|---|---|
| SQLite | Uses `backend/database/database.sqlite`; no separate database server is required. |
| MySQL | Create the database and update credentials in `backend/.env`. |
| PostgreSQL | Create the database and update credentials in `backend/.env`. |

After changing database settings:

```bash
cd backend
php artisan migrate --seed
```

## 🧪 Development and tests

Frontend:

```bash
cd frontend
npm install
npm run dev
npm run build
```

For a TypeScript project:

```bash
npm run typecheck
```

Backend:

```bash
cd backend
php artisan serve
php artisan migrate --seed
```

Run repository tests from the project root:

```bash
npm ci
npm test
```

The CI workflow checks the CLI across supported Node.js versions and operating systems, and exercises generated Laravel/React templates.

## 🤝 Contributing

Contributions, bug reports, documentation improvements, and feature suggestions are welcome.

1. Create a focused branch from `main`.
2. Add or update tests for behavior changes.
3. Run `npm test`.
4. Explain what changed and how you tested it in your pull request.

Do not commit generated application folders, `node_modules`, `.env` files, local databases, or secrets.

## 📄 License

DevStack CLI is released under the [MIT License](LICENSE). You may use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the software, subject to the license conditions.

---

<div align="center">

**Install Frameworks. Build Projects. Start Coding.**

Built to make getting started with development tools less intimidating.

</div>
