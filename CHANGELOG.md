# Changelog

All notable changes to React-Lara Forge are documented here.

## [Unreleased]

- Added Laravel feature tests for demo admin login, invalid credentials, protected endpoints, and logout token revocation.
- Expanded CI to generate real Laravel + React and TypeScript projects, build both frontends, and run backend tests.
- Updated pinned frontend dependencies, aligned Tailwind packages, and moved React Router to a patched v7 release while retaining the v6-compatible `react-router-dom` import path.
- Added npm package-content verification and cross-platform CLI checks on Node.js 22/24.
- Aligned launcher behavior across Windows, macOS, and Linux.
- Failed database migrations now stop generation and remove the incomplete output directory.

## [0.3.0] - 2026-11-19

- Added registration flow for JavaScript and TypeScript frontends.
- Added user/admin roles and a database migration.
- Added server-protected admin dashboard statistics and user management API.
- Replaced static dashboard metrics and sample user rows with API-backed data.
- Added admin account role enforcement in the seeder.

## [0.2.0] - 2026-11-19

### Added
- Interactive selection of JavaScript or TypeScript frontend templates.
- SQLite, MySQL, and PostgreSQL environment configuration.
- `--language`, `--typescript`, `--database`, `--non-interactive`, and `--skip-install` CLI options.
- CLI validation and cleanup after fatal generation errors.
- Basic automated CLI tests and GitHub Actions CI.
- Generated-project README, contribution and security reporting guidance.

### Improved
- Login rate limiting and safer authentication response payloads.
- Local-only demo administrator seeding; production seeding requires explicit credentials.
- CORS origin configuration through `FRONTEND_URL`.
- Frontend API error handling and clearer starter/demo data labels.
- Documentation for installation, database setup, security limitations, and troubleshooting.

### Notes
- The generator currently scaffolds Laravel 12 with React 18 and Vite 6.
- This release does not claim production readiness for applications generated from the starter; review and harden each application for its deployment context.
