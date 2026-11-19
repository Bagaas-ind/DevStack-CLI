<div align="center">

# React-Lara Forge

**A practical Laravel API + React SPA project generator.**

Scaffold a separate Laravel backend and React frontend with Sanctum token authentication, a ready-to-customize admin interface, and an interactive setup.

[![Node.js](https://img.shields.io/badge/Node.js-18%2B-339933?logo=node.js&logoColor=white)](https://nodejs.org/)
[![CI](https://github.com/Bagaas-ind/react-lara-forge/actions/workflows/ci.yml/badge.svg?branch=main)](https://github.com/Bagaas-ind/react-lara-forge/actions/workflows/ci.yml)
[![Laravel](https://img.shields.io/badge/Laravel-12-FF2D20?logo=laravel&logoColor=white)](https://laravel.com/)
[![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-6-646CFF?logo=vite&logoColor=white)](https://vite.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

```bash
npx github:Bagaas-ind/react-lara-forge my-project
```

<table>
  <tr>
    <td align="center"><strong>Login</strong><br><img src="docs/login.png" width="420" alt="React-Lara Forge login screen"></td>
    <td align="center"><strong>Admin dashboard</strong><br><img src="docs/dashboard.png" width="420" alt="React-Lara Forge admin dashboard"></td>
  </tr>
</table>

</div>

---

## Why React-Lara Forge?

Starting a Laravel API and a separate React SPA usually means repeating the same setup: creating the Laravel application, installing Sanctum, configuring CORS, preparing Vite and Tailwind CSS, wiring API requests, and building an authentication flow.

React-Lara Forge automates that foundation so you can spend more time building the features that make your application unique.

## Features

- **Separate applications:** Laravel API in `backend/` and React SPA in `frontend/`.
- **Frontend language choice:** JavaScript (default) or TypeScript.
- **Database setup:** SQLite, MySQL, or PostgreSQL configuration.
- **Authentication starter:** Laravel Sanctum personal access tokens, registration, login, logout, and protected API routes.
- **Role-based access:** new accounts receive the `user` role; the seeded account receives `admin`.
- **Admin interface:** live dashboard statistics and database-backed user listing/creation/deletion with server-side admin authorization.
- **Frontend stack:** React 18, Vite 6, Tailwind CSS 4, React Router, and Axios.
- **Launch scripts:** `start.bat` for Windows and `start.sh` for macOS/Linux.
- **Safer setup behavior:** validates project names and existing paths, checks required tools, and cleans up an incomplete project after a fatal generation error.

> Dashboard metrics currently report user/account counts. Business-specific metrics (orders, revenue, tickets, and similar data) must be added by the application developer.

## Requirements

| Tool | Requirement | Used for |
|---|---|---|
| Node.js | 18 or newer | CLI and frontend tooling |
| npm | Included with Node.js | Frontend dependencies |
| PHP | 8.2 or newer | Laravel 12 backend |
| Composer | 2.x recommended | Creating the Laravel application |
| Database | SQLite, MySQL, or PostgreSQL | Application data |

For MySQL or PostgreSQL, install and start the database server yourself and create the database/user before running migrations. SQLite is the default and does not require a separate database server.

## Quick start

### 1. Generate a project

```bash
npx github:Bagaas-ind/react-lara-forge my-project
```

In an interactive terminal, choose JavaScript or TypeScript and select a database. The defaults are JavaScript and SQLite.

The generator downloads Laravel through Composer and installs frontend packages through npm. An internet connection is required for the initial setup.

### 2. Start the applications

**Windows** — open `my-project` and double-click `start.bat`, or run:

```powershell
cd my-project
.\start.bat
```

**macOS / Linux:**

```bash
cd my-project
./start.sh
```

The scripts start Laravel at `http://localhost:8000` and Vite at `http://localhost:5173`.

### 3. Sign in locally

Open `http://localhost:5173`.

For a local development project generated with the default settings:

| Field | Local demo value |
|---|---|
| Email | `admin@example.com` |
| Password | `password` |

**Security warning:** these demo credentials are only for local development. Change or remove the demo account before exposing the application to a network or deploying it. Never reuse the demo password in production.

## CLI options

```bash
npx github:Bagaas-ind/react-lara-forge <project-name> [options]
```

| Option | Description |
|---|---|
| `--typescript` | Use the TypeScript frontend template |
| `--language <language>` | Choose `javascript` or `typescript` |
| `--database <driver>` | Choose `sqlite`, `mysql`, or `pgsql` |
| `--skip-backend` | Generate only the React frontend |
| `--skip-install` | Generate files without running `npm install` |
| `--non-interactive` | Use defaults/options without interactive prompts |
| `-V, --version` | Print the CLI version |
| `-h, --help` | Show help |

Examples:

```bash
# TypeScript + default SQLite
npx github:Bagaas-ind/react-lara-forge my-app --typescript

# JavaScript + MySQL, no prompts
npx github:Bagaas-ind/react-lara-forge my-app --language javascript --database mysql --non-interactive

# Frontend only
npx github:Bagaas-ind/react-lara-forge my-frontend --skip-backend

# Generate without installing frontend packages
npx github:Bagaas-ind/react-lara-forge my-app --skip-install
```

When using `--non-interactive`, the default language is JavaScript and the default database is SQLite unless overridden with options.

## Generated project structure

```text
my-project/
├── backend/                 # Laravel 12 API + Sanctum
│   ├── app/Http/Controllers/ (authentication, dashboard, users)
│   ├── config/cors.php
│   ├── database/migrations/ (user role)
│   ├── database/seeders/DatabaseSeeder.php
│   └── routes/api.php
├── frontend/                # React + Vite + Tailwind CSS
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── lib/
│   │   └── pages/
│   ├── package.json
│   └── vite.config.js       # .ts for TypeScript projects
├── start.bat
└── start.sh
```

## Authentication and security notes

- The starter uses **Sanctum personal access tokens** with the `Authorization: Bearer` header. It does not configure Sanctum's stateful cookie-based SPA flow.
- Public registration is rate-limited and assigns the `user` role. Only an administrator can access the admin dashboard and user-management API.
- The admin API enforces authorization on the Laravel server. Hiding a frontend navigation item is not treated as a security boundary.
- Login is rate-limited to five attempts per minute by Laravel's route throttle middleware.
- The frontend stores the returned token in `localStorage` for a simple local starter flow. Be aware that JavaScript-accessible storage increases the impact of an XSS vulnerability. Review your application's threat model before production use; consider a properly configured cookie-based session flow for browser-only applications.
- CORS is restricted to the frontend origin in `FRONTEND_URL`. Set the exact production frontend origin in the backend environment; do not use `*` with credentials.
- The local seeder creates `admin@example.com` / `password` only in `local` or `testing` environments. Outside those environments, set `ADMIN_NAME`, `ADMIN_EMAIL`, and a strong `ADMIN_PASSWORD` in `backend/.env` before running the seeder. These values are loaded through `config/react-lara-forge.php` so they remain available when Laravel configuration is cached.
- The generated project is a development foundation, not a complete production security review. Review registration policy, token storage, authorization, validation, logging, monitoring, HTTPS, backups, and deployment-specific configuration before production use.

## Database configuration

The generator writes the selected driver to `backend/.env`:

- **SQLite:** creates `backend/database/database.sqlite`.
- **MySQL:** configures the standard local MySQL host and port. Create the database and set the correct credentials in `backend/.env`.
- **PostgreSQL:** configures the standard local PostgreSQL host and port. Create the database and set the correct credentials in `backend/.env`.

After editing database settings, run:

```bash
cd backend
php artisan migrate --seed
```

If the selected database server is not running or the database does not exist during generation, the project files are still created; run the migration command after correcting `backend/.env`.

## Development commands

Frontend:

```bash
cd frontend
npm install
npm run dev
npm run build
```

For TypeScript projects, run `npm run typecheck` to check frontend types.

Backend:

```bash
cd backend
php artisan serve
php artisan migrate --seed
```

The frontend API base URL is configured in `frontend/.env` using `VITE_API_URL`.

## Troubleshooting

**PHP or Composer is not found**
Install the required tool, add it to your system `PATH`, then open a new terminal and check `php -v` and `composer --version`.

**Frontend cannot connect to the API**
Make sure Laravel is running at `http://localhost:8000`, check `VITE_API_URL` in `frontend/.env`, and verify `FRONTEND_URL` in `backend/.env` matches the frontend origin.

**Migration fails with MySQL/PostgreSQL**
Confirm the database server is running, the database exists, and the username/password in `backend/.env` are correct. Then run `php artisan migrate --seed` again.

**The project folder already exists**
The generator never overwrites an existing path. Choose another project name.

**Frontend dependencies were not installed**
Run `npm install` inside the generated `frontend/` directory.

## Contributing

Contributions, bug reports, and documentation improvements are welcome. Please read [CONTRIBUTING.md](CONTRIBUTING.md) before opening a pull request and use GitHub Issues to report reproducible bugs or propose changes.

## License

React-Lara Forge is open source under the [MIT License](LICENSE).

---

<div align="center">

Built to make starting Laravel + React applications less repetitive.

</div>
