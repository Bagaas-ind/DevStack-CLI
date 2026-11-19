# Your Laravel + React application

Generated with **React-Lara Forge**. This project keeps Laravel as the API backend and React + Vite as the frontend.

## Requirements

- Node.js 18+ and npm
- PHP 8.2+
- Composer 2.x
- SQLite, MySQL, or PostgreSQL (the selected database server must be available)

## Start locally

- Windows: run `start.bat`.
- macOS/Linux: run `./start.sh`.

The Laravel API runs at `http://localhost:8000`; Vite runs at `http://localhost:5173`.

## Manual start

Backend: `cd backend && php artisan serve`

Frontend in another terminal: `cd frontend && npm install && npm run dev`

## Database and first administrator

Configure `backend/.env` (`DB_*` and `FRONTEND_URL`). Then run:

```bash
cd backend
php artisan migrate --seed
```

For local development, the seeder creates `admin@example.com` with password `password` unless `ADMIN_NAME`, `ADMIN_EMAIL`, and `ADMIN_PASSWORD` are set. This demo account is strictly for local development. Set unique credentials before deployment. Outside local/testing, the seeder requires all three `ADMIN_*` values and a password of at least 12 characters.

## Included functionality

- Register, login, and logout using Laravel Sanctum personal access tokens.
- New registrations receive the `user` role.
- The seeded administrator receives the `admin` role.
- Admin-only dashboard statistics and user management endpoints.
- User creation and deletion are protected by server-side role checks.

## Frontend configuration

Set `VITE_API_URL` in `frontend/.env` if the Laravel API is not at `http://localhost:8000/api`.

## Production checklist

Do not deploy demo credentials. Configure HTTPS, a strong unique administrator password, correct CORS origins, secure environment variables, database backups, logging, and production infrastructure. Review the authentication model and application authorization before exposing the app publicly.
