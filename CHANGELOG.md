# Changelog

All notable changes to StackPilot are documented here.

## [0.5.0] - 2026-11-23

- Added Environment Manager for local runtime inventory and PATH inspection.
- Added Database Manager for detecting common database clients.
- Added Docker Manager for daemon/Compose diagnostics, container/image listing, and confirmed Compose lifecycle actions.
- Expanded the interactive menu and added direct CLI commands for all three managers.

## [0.4.0] - 2026-11-23

- Rebranded the CLI and repository identity as StackPilot.
- Added Runtime Doctor diagnostics for common developer tools.
- Added a StackPilot terminal wordmark and refreshed documentation.
- Preserved the existing framework installer and Laravel + React generator.

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
- Generated applications are development starters; review and harden each application for its deployment context before production use.
