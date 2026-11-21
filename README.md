<div align="center">

<img src="docs/assets/devstack-mark.svg" width="64" alt="DevStack CLI logo" />

# DevStack CLI

**Install frameworks. Generate application starters. Start building faster.**

A beginner-friendly command-line toolkit for setting up development projects and generating application starters.

[English](README.md) · [Bahasa Indonesia](README.id.md)

[![Node.js](https://img.shields.io/badge/Node.js-22%20%7C%2024_LTS-339933?logo=node.js&logoColor=white)](https://nodejs.org/)
[![CI](https://github.com/Bagaas-ind/DevStack-CLI/actions/workflows/ci.yml/badge.svg?branch=main)](https://github.com/Bagaas-ind/DevStack-CLI/actions/workflows/ci.yml)
[![Laravel](https://img.shields.io/badge/Laravel-12-FF2D20?logo=laravel&logoColor=white)](https://laravel.com/)
[![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

[![GitHub stars](https://img.shields.io/github/stars/Bagaas-ind/DevStack-CLI?style=for-the-badge&logo=github)](https://github.com/Bagaas-ind/DevStack-CLI/stargazers)
[![GitHub issues](https://img.shields.io/github/issues/Bagaas-ind/DevStack-CLI?style=for-the-badge&logo=github)](https://github.com/Bagaas-ind/DevStack-CLI/issues)

</div>

---

## 📖 Overview

Starting a development project often means repeating the same setup tasks: preparing folders, installing dependencies, configuring tools, and connecting the pieces before writing application code.

**DevStack CLI is designed to make that starting process simpler.** The project brings together two complementary workflows:

- **Framework Installer** — guided setup for supported development frameworks.
- **Application Generator** — customizable application starters with common project foundations already connected.

Development is happening incrementally. The existing Laravel API + React SPA generator is the current published foundation. The broader multi-framework installer is being developed and tested separately; framework support will be listed here as it becomes ready for release.

## ✨ Current features

The currently documented generator creates a Laravel API backend and a React single-page application (SPA).

- **Frontend choices:** JavaScript or TypeScript.
- **Backend:** Laravel 12.x with Sanctum personal access token authentication.
- **Database options:** SQLite, MySQL, or PostgreSQL.
- **Authentication:** registration, login, logout, and protected API routes.
- **Authorization:** role-based access control for administrator operations.
- **Admin foundation:** local development seeder, dashboard, and user management.
- **Frontend stack:** React 18, Vite 6, Tailwind CSS 4, React Router, and Axios.
- **Launch scripts:** Windows and macOS/Linux.
- **Developer experience:** CLI input validation and automated tests.

> **Note:** Generated projects are development starters, not finished business applications or security certifications. Review and adapt the generated code before deploying it.

## 🧭 Project roadmap

| Component | Purpose | Status |
|---|---|---|
| Application Generator | Generate a Laravel API + React SPA starter | Available |
| Framework Installer | Guided setup for supported frameworks | In development |
| Additional application templates | Expand reusable project types | Planned |

Framework names and supported versions will be documented after their installers have been implemented and tested.

## 📋 Requirements

Requirements for the current Laravel + React generator:

| Tool | Version | Purpose |
|---|---|---|
| Node.js | 22 or 24 LTS | Runs the CLI and frontend tooling |
| npm | Bundled with Node.js | Installs frontend dependencies |
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

Create a project directly from the GitHub repository:

```bash
npx github:Bagaas-ind/DevStack-CLI my-project
```

Follow the prompts to choose JavaScript or TypeScript and a database. The defaults are **JavaScript** and **SQLite**.

An internet connection is required while generating the project because Composer and npm download the required dependencies.

### Run the generated project

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

Default local addresses:

| Service | URL |
|---|---|
| React frontend | http://localhost:5173 |
| Laravel backend | http://localhost:8000 |

Open the frontend at **http://localhost:5173**.

### Local demo administrator

The default local development seeder provides:

| Field | Demo value |
|---|---|
| Email | `admin@example.com` |
| Password | `password` |

**Security:** This account is for local development and testing only. Change or remove it before making the application accessible to other users. Never use the demo password in production.

## ⚙️ CLI options

General syntax:

```bash
npx github:Bagaas-ind/DevStack-CLI <project-name> [options]
```

| Option | Description |
|---|---|
| `--typescript` | Use the TypeScript frontend template |
| `--language <language>` | Choose `javascript` or `typescript` |
| `--laravel-version <version>` | Select a Laravel version; defaults to `12.*` |
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

# JavaScript + MySQL without interactive prompts
npx github:Bagaas-ind/DevStack-CLI my-app --language javascript --database mysql --non-interactive

# Generate only the frontend
npx github:Bagaas-ind/DevStack-CLI my-frontend --skip-backend
```

With `--non-interactive`, JavaScript and SQLite are selected unless you override them.

## 🗂️ Generated project structure

A typical generated project looks like this:

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
│   └── vite.config.js           # .ts for TypeScript projects
├── start.bat                    # Windows launcher
└── start.sh                     # macOS/Linux launcher
```

The exact files may vary depending on the selected language and generator options.

## 🔐 Authentication and security

The current scaffold uses Laravel Sanctum personal access tokens sent through the `Authorization: Bearer` header. It does not configure Sanctum's stateful cookie-based SPA authentication flow.

- Public registration is rate-limited and assigns the `user` role.
- Administrator-only operations are authorized by the Laravel backend.
- The frontend stores the returned token in `localStorage` for a straightforward starter experience. Because JavaScript can access this storage, an XSS vulnerability can expose tokens; review token storage and your threat model before production use.
- CORS is configured through `FRONTEND_URL`. Set it to the exact frontend origin used by your deployment.
- The demo administrator is intended for local/testing environments only.
- Never commit `.env` files, credentials, access tokens, or production secrets.

Before deployment, review authentication, authorization, validation, token handling, HTTPS, logging, monitoring, backups, dependency updates, and environment configuration.

## 🗄️ Database configuration

The selected database driver is written to `backend/.env`.

| Driver | Notes |
|---|---|
| SQLite | Uses `backend/database/database.sqlite`; no separate database server is required. |
| MySQL | Create the database and update the credentials in `backend/.env`. |
| PostgreSQL | Create the database and update the credentials in `backend/.env`. |

After changing database settings, run:

```bash
cd backend
php artisan migrate --seed
```

## 🧪 Development and tests

**Frontend**

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

**Backend**

```bash
cd backend
php artisan serve
php artisan migrate --seed
```

**Repository tests**

Run from the repository root:

```bash
npm ci
npm test
```

The CI workflow checks the CLI on configured Node.js versions and operating systems, and exercises the generated Laravel/React templates.

## 🤝 Contributing

Contributions, bug reports, documentation improvements, and feature suggestions are welcome.

1. Create a focused branch from `main`.
2. Add or update tests for behavior changes.
3. Run `npm test`.
4. Describe the changes and testing performed in your pull request.

Please do not commit generated application folders, `node_modules`, `.env` files, local databases, or secrets.

## 📄 License

DevStack CLI is released under the [MIT License](LICENSE).

---

<div align="center">

**Install Frameworks. Build Projects. Start Coding.**

Made to make getting started with development tools less intimidating.

</div>
