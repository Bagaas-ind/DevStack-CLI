# ⚡ React-Lara Forge

> **Stop wasting 2–3 hours wiring Laravel + React from scratch.**  
> Scaffold a full-stack **Laravel + React** starter project—complete with **Sanctum**, **CORS**, **Tailwind CSS**, **React Router**, **Login**, and **Admin Dashboard**—in one command.

![Node.js](https://img.shields.io/badge/Node.js-18%2B-339933?style=flat-square&logo=node.js&logoColor=white)
![Laravel](https://img.shields.io/badge/Laravel-API%20%2B%20Sanctum-FF2D20?style=flat-square&logo=laravel&logoColor=white)
![React](https://img.shields.io/badge/React-Vite%20%2B%20Tailwind-61DAFB?style=flat-square&logo=react&logoColor=black)
![License](https://img.shields.io/badge/License-MIT-blue?style=flat-square)

---

## Why This Exists

Every time you start a new full-stack app with **Laravel** and **React**, the early hours often go into repetitive setup instead of core features:
- Setting up backend & frontend folders cleanly
- Wiring **Laravel Sanctum** & **CORS** without hitting frustrating local origin mismatches
- Setting up routing, auth flow, and a clean **Admin Dashboard** shell

**React-Lara Forge** packages that repetitive baseline into a single CLI workflow so you can jump straight into building features.

---

## Quick Start

```bash
npx react-lara-forge my-app
```

Follow the prompts, enter your project directory, and start your backend and frontend services:

```bash
cd my-app
```

**Backend (Laravel):**
```bash
cd backend
cp .env.example .env
php artisan key:generate
php artisan migrate
php artisan serve
```

**Frontend (React):**
```bash
cd frontend
cp .env.example .env
npm install
npm run dev
```

---

## What You Get Out of the Box

- **One-Command Scaffolding**: Generates a structured full-stack project layout quickly.
- **Auth & API Ready**: Pre-wired **Laravel Sanctum** and **CORS** setup to speed up frontend-backend integration.
- **Modern Frontend Stack**: React + Vite + Tailwind CSS + React Router.
- **Starter Pages Included**: Ready-to-customize **Login** screen and **Admin Dashboard** layout.
- **Developer-Friendly Structure**: Clear separation between backend API and frontend UI.

---

## Preview

> *Tip: Add a terminal GIF or screenshots of the generated Login & Admin Dashboard here—visual previews boost repo engagement fast.*

- **CLI Scaffolding**: *(add screenshot/GIF)*
- **Login & Admin Layout**: *(add screenshot/GIF)*

---

## Project Structure

```text
my-app/
├── backend/     # Laravel API, Sanctum & CORS configuration
└── frontend/    # React app, router, auth screen & admin dashboard layout
```

---

## Roadmap

- [ ] Interactive CLI prompts (project name, database driver, starter modules)
- [ ] Ready-to-use CRUD module generator
- [ ] Docker / `.env` helper setup for faster local onboarding

---

## Contributing & Stars

Ideas, bug reports, and pull requests are welcome. If this saves you setup time, consider giving the repository a **Star** ⭐ to support development.

Licensed under the **MIT License**.
