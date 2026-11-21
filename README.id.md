<div align="center">

<img src="docs/assets/devstack-mark.svg" alt="Logo DevStack CLI" width="72" />

# DevStack CLI

**Pasang framework. Buat starter aplikasi. Mulai coding.**

Toolkit command-line yang membantu developer menyiapkan proyek dan membuat starter aplikasi Laravel API + React dengan lebih mudah, termasuk bagi pemula.

[English](README.md) | **Bahasa Indonesia**

[![Node.js](https://img.shields.io/badge/Node.js-22%2F24_LTS-339933?logo=node.js&logoColor=white)](https://nodejs.org/)
[![CI](https://github.com/Bagaas-ind/DevStack-CLI/actions/workflows/ci.yml/badge.svg?branch=main)](https://github.com/Bagaas-ind/DevStack-CLI/actions/workflows/ci.yml)
[![Laravel](https://img.shields.io/badge/Laravel-12-FF2D20?logo=laravel&logoColor=white)](https://laravel.com/)
[![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![Lisensi: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

[![GitHub stars](https://img.shields.io/github/stars/Bagaas-ind/DevStack-CLI?style=for-the-badge&logo=github)](https://github.com/Bagaas-ind/DevStack-CLI/stargazers)
[![GitHub issues](https://img.shields.io/github/issues/Bagaas-ind/DevStack-CLI?style=for-the-badge&logo=github)](https://github.com/Bagaas-ind/DevStack-CLI/issues)

</div>

---

## 📖 Apa itu DevStack CLI?

Menyiapkan lingkungan development baru terkadang membingungkan, terutama saat baru belajar sebuah framework. Kita perlu mengingat perintah instalasi, membuat folder proyek, memasang dependency, dan mengatur berbagai tools sebelum mulai menulis kode aplikasi.

**DevStack CLI bertujuan menyederhanakan langkah awal tersebut.** Dalam jangka panjang, proyek ini akan menggabungkan dua alur kerja:

1. **Framework Installer** — membantu pengguna memasang dan menyiapkan framework yang didukung melalui panduan CLI.
2. **Application Generator** — membuat kerangka aplikasi yang siap dikembangkan dengan fitur-fitur dasar yang sudah terhubung.

Pengembangan dilakukan secara bertahap. Generator React + Laravel yang sudah ada merupakan fondasi yang saat ini telah diimplementasikan. Installer untuk berbagai framework masih menjadi arah pengembangan dan belum boleh dianggap tersedia sebelum didokumentasikan sebagai fitur yang sudah dirilis.

## ✨ Fitur yang tersedia saat ini

Generator yang ada membuat backend Laravel API dan frontend React SPA secara terpisah.

- Pilihan frontend **JavaScript atau TypeScript**.
- Backend **Laravel 12.x** dengan autentikasi personal access token Laravel Sanctum.
- Konfigurasi database **SQLite, MySQL, atau PostgreSQL**.
- Registrasi, login, logout, protected API routes, dan otorisasi berbasis peran.
- Seeder administrator untuk pengembangan lokal serta dashboard dan manajemen pengguna.
- React 18, Vite 6, Tailwind CSS 4, React Router, dan Axios.
- Script launcher untuk Windows serta macOS/Linux.
- Validasi CLI dan pengujian otomatis.

> Scaffold saat ini adalah fondasi untuk pengembangan, bukan aplikasi bisnis siap pakai atau jaminan bahwa aplikasi sudah aman untuk production. Tinjau dan sesuaikan kode hasil generate sebelum deployment.

## 🧭 Arah pengembangan

Arsitektur yang direncanakan memisahkan dua kemampuan berikut:

| Bagian | Tujuan | Status |
|---|---|---|
| Framework Installer | Membantu memasang framework yang didukung melalui langkah CLI yang terpandu | Direncanakan / dalam pengembangan |
| Application Generator | Membuat starter Laravel API + React SPA | Fitur yang sudah ada |
| Template aplikasi tambahan | Menambahkan tipe proyek yang dapat digunakan ulang tanpa menghilangkan template lama | Direncanakan |

Daftar framework dan versi yang didukung akan dicantumkan setelah setiap installer selesai dibuat dan diuji.

## 📋 Persyaratan

Untuk generator Laravel + React yang tersedia saat ini:

| Tool | Versi | Kegunaan |
|---|---|---|
| Node.js | 22 atau 24 LTS | Menjalankan CLI dan tools frontend |
| npm | Termasuk dengan Node.js | Memasang dependency frontend |
| PHP | 8.2 atau lebih baru | Menjalankan Laravel 12 |
| Composer | 2.x | Membuat dan mengelola backend Laravel |
| Database | SQLite, MySQL, atau PostgreSQL | Menyimpan data aplikasi |

Periksa instalasi:

```bash
node --version
npm --version
php --version
composer --version
```

## 🚀 Memulai dengan cepat

Buat proyek dari repository saat ini:

```bash
npx github:Bagaas-ind/DevStack-CLI my-project
```

Ikuti instruksi untuk memilih JavaScript atau TypeScript serta database. Pilihan default adalah JavaScript dan SQLite.

Generator mengunduh Laravel melalui Composer dan memasang dependency frontend melalui npm. Karena itu, koneksi internet diperlukan saat proses generate.

### ▶️ Jalankan proyek hasil generate

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

Alamat default server development:

| Aplikasi | Alamat |
|---|---|
| React frontend | http://localhost:5173 |
| Laravel backend | http://localhost:8000 |

Buka frontend melalui http://localhost:5173.

Untuk konfigurasi development lokal default, kredensial administrator dari seeder adalah:

| Field | Nilai demo lokal |
|---|---|
| Email | `admin@example.com` |
| Password | `password` |

**Keamanan:** Kredensial tersebut hanya untuk development lokal. Ganti atau hapus akun demo sebelum aplikasi dibuka untuk pengguna lain. Jangan gunakan password demo di production.

## ⚙️ Opsi CLI

Sintaks umum:

```bash
npx github:Bagaas-ind/DevStack-CLI <nama-proyek> [options]
```

| Opsi | Keterangan |
|---|---|
| `--typescript` | Menggunakan template frontend TypeScript |
| `--language <language>` | Memilih `javascript` atau `typescript` |
| `--laravel-version <version>` | Mengunci versi Laravel; default `12.*` |
| `--database <driver>` | Memilih `sqlite`, `mysql`, atau `pgsql` |
| `--skip-backend` | Hanya membuat frontend React |
| `--skip-install` | Membuat file tanpa menjalankan `npm install` frontend |
| `--non-interactive` | Menggunakan opsi/default tanpa prompt interaktif |
| `-V, --version` | Menampilkan versi CLI |
| `-h, --help` | Menampilkan bantuan |

Contoh:

```bash
# Frontend TypeScript
npx github:Bagaas-ind/DevStack-CLI my-app --typescript

# JavaScript + MySQL tanpa prompt interaktif
npx github:Bagaas-ind/DevStack-CLI my-app --language javascript --database mysql --non-interactive

# Hanya membuat frontend
npx github:Bagaas-ind/DevStack-CLI my-frontend --skip-backend
```

Jika menggunakan `--non-interactive`, pilihan default adalah JavaScript dan SQLite kecuali ditentukan lain.

## 🗂️ Struktur proyek hasil generate

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
│   └── vite.config.js            # .ts untuk proyek TypeScript
├── start.bat                     # Launcher Windows
└── start.sh                      # Launcher macOS/Linux
```

File yang dihasilkan dapat sedikit berbeda sesuai bahasa dan opsi generator yang dipilih.

## 🔐 Autentikasi dan keamanan

Scaffold saat ini menggunakan Laravel Sanctum personal access token yang dikirim melalui header `Authorization: Bearer`. Generator belum mengatur alur autentikasi SPA Sanctum berbasis stateful cookie.

- Registrasi publik dilindungi rate limit dan memberikan peran `user`.
- Operasi khusus administrator diotorisasi oleh backend Laravel.
- Frontend menyimpan token di `localStorage` untuk pengalaman awal yang sederhana. Penyimpanan yang dapat diakses JavaScript meningkatkan dampak risiko cross-site scripting (XSS); tinjau penyimpanan token dan model ancaman sebelum production.
- CORS dikonfigurasi melalui `FRONTEND_URL`. Atur ke origin frontend yang tepat saat deployment.
- Akun administrator demo ditujukan hanya untuk lingkungan lokal/testing.
- Jangan commit file `.env`, kredensial, access token, atau secret production.

Proyek hasil generate adalah fondasi development. Sebelum deployment, tinjau autentikasi, otorisasi, validasi, pengelolaan token, HTTPS, logging, monitoring, backup, pembaruan dependency, dan konfigurasi environment.

## 🗄️ Konfigurasi database

Driver yang dipilih ditulis ke `backend/.env`.

| Driver | Keterangan |
|---|---|
| SQLite | Menggunakan `backend/database/database.sqlite`; tidak memerlukan server database terpisah. |
| MySQL | Buat database dan perbarui kredensial di `backend/.env`. |
| PostgreSQL | Buat database dan perbarui kredensial di `backend/.env`. |

Setelah mengubah pengaturan database:

```bash
cd backend
php artisan migrate --seed
```

## 🧪 Pengembangan dan pengujian

Frontend:

```bash
cd frontend
npm install
npm run dev
npm run build
```

Untuk proyek TypeScript:

```bash
npm run typecheck
```

Backend:

```bash
cd backend
php artisan serve
php artisan migrate --seed
```

Jalankan pengujian repository dari direktori utama:

```bash
npm ci
npm test
```

Workflow CI memeriksa CLI pada versi Node.js dan sistem operasi yang didukung, serta menguji template Laravel/React yang dihasilkan.

## 🤝 Kontribusi

Kontribusi, laporan bug, perbaikan dokumentasi, dan usulan fitur sangat terbuka.

1. Buat branch khusus dari `main`.
2. Tambahkan atau perbarui test untuk perubahan perilaku.
3. Jalankan `npm test`.
4. Jelaskan perubahan dan cara pengujiannya pada pull request.

Jangan commit folder aplikasi hasil generate, `node_modules`, file `.env`, database lokal, atau secret.

## 📄 Lisensi

DevStack CLI dirilis menggunakan [MIT License](LICENSE). Kamu boleh menggunakan, menyalin, memodifikasi, menggabungkan, menerbitkan, mendistribusikan, memberikan sublisensi, dan/atau menjual salinan perangkat lunak ini sesuai ketentuan lisensi.

---

<div align="center">

**Install Frameworks. Build Projects. Start Coding.**

Dibuat agar proses memulai development terasa lebih mudah, termasuk bagi pemula.

</div>
