<div align="center">
  <img src="docs/assets/stackpilot-icon.svg" width="104" height="104" alt="Logo StackPilot" />
  <h1>StackPilot</h1>
  <p><strong>One CLI. Every Development Environment.</strong></p>
  <p>Toolkit terminal untuk diagnostik runtime, instalasi framework, dan pembuatan starter aplikasi full-stack.</p>
  <p><a href="https://github.com/Bagaas-ind/StackPilot/actions/workflows/ci.yml"><img src="https://github.com/Bagaas-ind/StackPilot/actions/workflows/ci.yml/badge.svg?branch=main" alt="CI"></a> <img src="https://img.shields.io/badge/Node.js-22%20%7C%2024-339933?logo=node.js&logoColor=white" alt="Node.js 22/24"> <img src="https://img.shields.io/badge/License-MIT-blue.svg" alt="MIT"></p>
  <p><a href="README.md">English</a> · <strong>Bahasa Indonesia</strong></p>
</div>

---

## Apa itu StackPilot?

StackPilot menyatukan beberapa kebutuhan setup development ke dalam satu CLI interaktif. StackPilot membantu developer memeriksa tools lokal, membuat starter framework, dan menghasilkan fondasi aplikasi Laravel + React.

## Tampilan terminal

Jalankan StackPilot tanpa argumen untuk membuka menu interaktif. Terminal akan menampilkan logo ASCII StackPilot dan tagline sebelum daftar fitur.

```text
  ____  _             _    ____  _ _
 / ___|| |_ __ _  ___| | _|  _ \(_) |
 \___ \| __/ _` |/ __| |/ / |_) | | |
  ___) | || (_| | (__|   <|  __/| | |
 |____/ \__\__,_|\___|_|\_\_|   |_|

  StackPilot
  One CLI. Every Development Environment.

  1. Runtime Doctor
  2. Framework Installer
  3. Application Generator
  4. Environment Manager
  5. Database Manager
  6. Docker Manager
  7. Exit
```

File logo repository tersedia di [docs/assets/stackpilot-icon.svg](docs/assets/stackpilot-icon.svg).

## Fitur StackPilot

### 1. Runtime Doctor

Memeriksa ketersediaan dan menampilkan versi tools development:

- Node.js dan npm — wajib untuk menjalankan CLI.
- PHP dan Composer.
- Python.
- Java.
- Git.
- Docker.

Fitur ini menandai versi Node.js yang tidak didukung (StackPilot mendukung Node.js 22 dan 24), serta membedakan tools wajib dan opsional. Doctor hanya melakukan diagnostik; tidak memasang, memperbarui, atau menghapus software.

### 2. Environment Manager

Menampilkan inventaris runtime lokal: Node.js, npm, PHP, Composer, Python, Java, Git, dan Docker, termasuk entri PATH. Fitur ini bersifat read-only dan tidak mengubah PATH atau memasang/menghapus tools.

### 3. Database Manager

Mendeteksi client MySQL, MariaDB, PostgreSQL, SQLite, MongoDB Shell, dan Redis CLI. Fitur ini juga memeriksa ketersediaan Docker Compose. Versi awal bersifat read-only dan tidak membuat, menghapus, atau mengubah database.

### 4. Docker Manager

Memeriksa Docker CLI, daemon, dan Compose; menampilkan container yang berjalan; serta menyediakan daftar container/image dan perintah Compose up/down untuk project di direktori aktif. Aksi Compose memerlukan file konfigurasi yang terdeteksi dan konfirmasi eksplisit.

### 5. Framework Installer

Installer interaktif untuk 11 starter framework:

| Ekosistem | Framework |
| --- | --- |
| PHP | Laravel, CodeIgniter 4, Symfony |
| JavaScript | React, Vue.js, Next.js, Express.js |
| Python | Django, Flask, FastAPI |
| Java | Spring Boot |

Installer memeriksa runtime yang diperlukan, meminta nama project, lalu menjalankan perintah setup atau workflow starter framework. Beberapa installer membutuhkan koneksi internet untuk mengunduh project dan dependency.

### 6. Application Generator

Membuat starter full-stack Laravel API + React SPA dengan kemampuan:

- Backend Laravel 12 dan autentikasi API Sanctum.
- Frontend React + Vite.
- Pilihan JavaScript atau TypeScript.
- Konfigurasi database SQLite, MySQL, atau PostgreSQL.
- Pilihan template starter dan ecommerce.
- Opsi frontend saja menggunakan `--skip-backend`.
- Opsi melewati instalasi dependency dengan `--skip-install`.
- Script startup Windows dan Unix jika backend dibuat.

Project hasil generate adalah fondasi development, bukan sertifikasi keamanan production. Periksa konfigurasi, kredensial, otorisasi, CORS, dan keamanan deployment sebelum digunakan di production.

## Persyaratan

- Node.js 22 atau 24 LTS untuk menjalankan StackPilot.
- Runtime framework hanya diperlukan ketika framework terkait dipilih.
- PHP 8.2+ dan Composer 2.x untuk membuat aplikasi berbasis Laravel.
- Koneksi internet umumnya diperlukan untuk mengunduh starter framework dan dependency.

## Instalasi dan penggunaan

### Jalankan langsung dari GitHub

```bash
npx --yes github:Bagaas-ind/StackPilot
```

### Clone repository

```bash
git clone https://github.com/Bagaas-ind/StackPilot.git
cd StackPilot
npm ci
node index.js
```

### Perintah umum

```bash
# Membuka menu interaktif (menampilkan logo StackPilot)
node index.js

# Memeriksa runtime development
node index.js doctor
node index.js environment
node index.js database
node index.js docker

# Membuat starter Laravel + React
node index.js my-app

# Menggunakan TypeScript
node index.js my-app --typescript

# Memilih database tanpa prompt interaktif
node index.js my-app --database mysql --non-interactive

# Membuat frontend saja
node index.js my-frontend --skip-backend

# Melihat bantuan dan versi CLI
node index.js --help
node index.js --version
```

### Opsi Application Generator

| Opsi | Fungsi |
| --- | --- |
| `--template <starter|ecommerce>` | Memilih template aplikasi |
| `--typescript` | Menggunakan frontend React + TypeScript |
| `--language <javascript|typescript>` | Memilih bahasa frontend secara eksplisit |
| `--database <sqlite|mysql|pgsql>` | Memilih driver database Laravel |
| `--laravel-version <version>` | Memilih versi Laravel (default: `12.*`) |
| `--skip-backend` | Membuat frontend saja |
| `--skip-install` | Melewati `npm install` frontend |
| `--non-interactive` | Menggunakan opsi/default tanpa prompt interaktif |
| `--lang <en|id>` | Memilih bahasa antarmuka CLI |

Jika menggunakan hasil clone, jalankan perintah dengan `node index.js`. Package npm StackPilot belum dipublikasikan.

## Pengujian dan CI

```bash
npm ci
npm test
```

GitHub Actions menguji CLI pada sistem operasi dan versi Node.js yang didukung, memeriksa template PHP, serta menguji workflow pembuatan aplikasi.

## Status pengembangan

| Komponen | Status |
| --- | --- |
| Runtime Doctor | Tersedia |
| Framework Installer (11 framework) | Tersedia |
| Laravel + React Application Generator | Tersedia |
| Environment Manager | Tersedia (inventaris runtime dan PATH) |
| Database Manager | Tersedia (deteksi client, read-only) |
| Docker Manager | Tersedia (status daemon/Compose, daftar container/image, Compose up/down dengan konfirmasi) |

## Keamanan

StackPilot menjalankan perintah setup framework dan membuat file project di komputer pengguna. Periksa perintah dan kode hasil generate sebelum digunakan pada lingkungan penting. Jangan commit secret atau kredensial asli. Aplikasi hasil generate harus ditinjau dan diperkuat keamanannya sebelum deployment.

## Kontribusi

Issue, laporan bug, perbaikan dokumentasi, dan pull request yang terarah sangat diterima. Sertakan langkah reproduksi untuk bug dan test untuk perubahan perilaku.

## Lisensi

MIT — lihat [LICENSE](LICENSE).
