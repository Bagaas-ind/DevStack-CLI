# ⚡ React-Lara Forge

> **Skip repetitive boilerplate setup.**  
> Scaffold a **Laravel + React** full-stack starter project—pre-configured for **Sanctum**, **CORS**, **Tailwind CSS**, **React Router**, **Login**, and an **Admin Dashboard** layout—in one command.

![Node.js](https://img.shields.io/badge/Node.js-18%2B-339933?style=flat-square&logo=node.js&logoColor=white)
![Laravel](https://img.shields.io/badge/Laravel-API%20%2B%20Sanctum-FF2D20?style=flat-square&logo=laravel&logoColor=white)
![React](https://img.shields.io/badge/React-Tailwind%20%2B%20Router-61DAFB?style=flat-square&logo=react&logoColor=black)
![License](https://img.shields.io/badge/License-MIT-blue?style=flat-square)

---

## Before vs After (Alur Kerja & UI)

| Aspek | Before (Setup Manual / Tanpa Tool) | After (Dengan React-Lara Forge) |
| :--- | :--- | :--- |
| **Waktu Setup Awal** | Menghabiskan sekitar 2–3 jam untuk merangkai proyek, konfigurasi, dan halaman dasar. | Menyiapkan kerangka proyek awal dalam hitungan menit lewat satu perintah CLI. |
| **Konfigurasi Backend & CORS** | Sering lupa menyamakan *origin* CORS, konfigurasi Sanctum, atau struktur *endpoint* dasar saat awal mulai. | Struktur Laravel, CORS, dan autentikasi dasar sudah disiapkan sebagai titik awal. |
| **Frontend & Routing** | Setup Vite, Tailwind CSS, React Router, serta komponen *layout* dilakukan satu per satu dari nol. | Sudah terstruktur dengan React + Tailwind + Router dan siap dikembangkan lebih lanjut. |
| **Tampilan UI Awal (Login & Admin)** | Kosong / masih halaman *starter* bawaan framework yang belum punya alur login & *sidebar* admin. | Sudah ada halaman **Login** dan *layout* **Admin Dashboard** dasar untuk langsung diisi fitur inti. |

---

## Prasyarat (Prerequisites)

- **Node.js** (v18+ direkomendasikan) & `npm`
- **PHP** (v8.2+ direkomendasikan) & **Composer**
- **Database** (MySQL / MariaDB / SQLite)

---

## Cara Instalasi & Menjalankan Project

### A. Menjalankan Langsung dari GitHub (Tanpa Publish npm Dulu)

```bash
npx github:Bagaas-ind/instal-react-lara-forge nama-project
```

### B. Instalasi Lokal untuk Pengembangan / Testing (`npm link`)

```bash
git clone [https://github.com/Bagaas-ind/instal-react-lara-forge.git](https://github.com/Bagaas-ind/instal-react-lara-forge.git)
cd instal-react-lara-forge
npm install
npm link
```

Setelah di-link, uji perintah CLI dari folder mana saja:

```bash
react-lara-forge test-project
```

### C. Menjalankan Hasil Generate (Backend & Frontend)

Masuk ke folder project yang sudah dibuat:

```bash
cd nama-project
```

**1. Backend (Laravel):**

```bash
cd backend
cp .env.example .env
php artisan key:generate
php artisan migrate
php artisan serve
```

**2. Frontend (React) di terminal terpisah:**

```bash
cd frontend
cp .env.example .env
npm install
npm run dev
```

---

## UI Preview (Before vs After)

> *(Ganti bagian ini dengan screenshot tampilan asli halaman Login & Admin Dashboard kamu nanti)*

- **Before (Blank Starter):** `<!-- tambahkan link/path gambar before di sini -->`
- **After (Login & Admin Dashboard):** `<!-- tambahkan link/path gambar after di sini -->`

---

## Roadmap

- [ ] Interactive CLI prompts & template customization
- [ ] Ready-to-use CRUD module generator
- [ ] Screenshots/GIFs of CLI execution, Login page, and Admin Dashboard

---

## Lisensi

Dirilis di bawah lisensi **MIT**.
