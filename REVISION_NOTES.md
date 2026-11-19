# React-Lara Forge revision notes

## Version 0.3.0

This revision continues the existing React-Lara Forge project. It does not replace its Laravel + React architecture.

### Implemented in templates

- Registration endpoint and React registration screen for JavaScript and TypeScript variants.
- Role column migration (`admin` / `user`) and role-aware Laravel user model patching during generation.
- Local/provisioned administrator role assignment in the seeder.
- Server-side admin-only route group for dashboard and user management.
- Live dashboard account statistics from the generated database.
- Database-backed user listing, creation, and deletion for administrators.
- Admin navigation visibility based on the authenticated user's role.
- Updated generated project README with setup and security guidance.

### Important scope notes

- The generator still creates Laravel 12 + React 18 + Vite; Laravel remains the backend.
- Registration creates ordinary `user` accounts. Admin accounts are provisioned by the seeder or by an existing administrator.
- Token authentication continues to use Sanctum personal access tokens stored by the frontend in `localStorage`; evaluate cookie-based authentication and XSS protections before production deployment.
- Automated tests, full Composer installation, database migrations, and browser-level authentication flows have not been run as part of this revision package. Run them in a local environment before publishing a release.
