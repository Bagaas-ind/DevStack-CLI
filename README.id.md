<div align="center">
  <img src="docs/assets/stackpilot-icon.svg" width="92" height="92" alt="Logo StackPilot" />
  <h1>StackPilot</h1>
  <p><strong>One CLI. Every Development Environment.</strong></p>
  <p>CLI untuk diagnostik runtime, setup framework, dan pembuatan kerangka aplikasi.</p>
  <p><a href="https://github.com/Bagaas-ind/StackPilot/actions/workflows/ci.yml"><img src="https://github.com/Bagaas-ind/StackPilot/actions/workflows/ci.yml/badge.svg?branch=main" alt="CI"></a> <img src="https://img.shields.io/badge/Node.js-22%20%7C%2024-339933?logo=node.js&logoColor=white" alt="Node.js 22/24"> <img src="https://img.shields.io/badge/License-MIT-blue.svg" alt="MIT"></p>
  <p><a href="README.md">English</a> · <strong>Bahasa Indonesia</strong></p>
</div>

---

## Apa itu StackPilot?

StackPilot menyatukan workflow pengembangan umum dalam satu CLI. Tujuannya mengurangi setup berulang tanpa menyembunyikan tools yang digunakan atau mengubah sistem secara diam-diam.

## Gambaran workflow

<p align="center"><img src="docs/assets/stackpilot-workflow.svg" width="100%" alt="Gambaran workflow StackPilot"></p>

## Modul saat ini

| Modul | Kemampuan | Status |
| --- | --- | --- |
| Runtime Doctor | Mendeteksi versi Node.js, npm, PHP, Composer, Python, Java, Git, dan Docker | Tersedia |
| Framework Installer | Panduan setup starter framework yang didukung | Tersedia |
| Application Generator | Starter Laravel API + React SPA dengan JS/TS dan SQLite/MySQL/PostgreSQL | Tersedia |
| Environment Manager | Profil environment dan workflow konfigurasi | Direncanakan |
| Database Manager | Diagnostik dan bantuan setup database | Direncanakan |
| Docker Manager | Bantuan workflow Docker | Direncanakan |

StackPilot hanya mendiagnosis tools. Runtime sistem tidak dipasang, diperbarui, atau dihapus otomatis.

## Persyaratan

- Node.js 22 atau 24 LTS untuk menjalankan StackPilot.
- PHP 8.2+ dan Composer 2.x untuk generate Laravel.
- Tools lain bergantung pada framework yang dipilih. Git dan Docker bersifat opsional untuk diagnostik.

## Instalasi dan penggunaan

Jalankan dari GitHub:

~~~bash
npx --yes github:Bagaas-ind/StackPilot
~~~

Atau clone repository:

~~~bash
git clone https://github.com/Bagaas-ind/StackPilot.git
cd StackPilot
npm ci
node index.js
~~~

### Diagnostik runtime

~~~bash
node index.js doctor
~~~

Runtime Doctor menampilkan versi tools yang terdeteksi dan membedakan tools wajib dengan opsional. Fitur ini tidak mengubah sistem.

### Membuat aplikasi

~~~bash
node index.js my-app
node index.js my-app --typescript
node index.js my-app --database mysql --non-interactive
node index.js my-frontend --skip-backend
~~~

Generator membuat starter Laravel API + React SPA. Generate Laravel membutuhkan PHP 8.2+, Composer 2.x, dan koneksi internet.

## Perintah CLI

| Perintah | Fungsi |
| --- | --- |
| stackpilot | Membuka menu interaktif |
| stackpilot doctor | Memeriksa tools development |
| stackpilot <nama-project> | Membuat starter Laravel + React |
| stackpilot --help | Menampilkan opsi CLI |
| stackpilot --version | Menampilkan versi |

Jika dijalankan dari hasil clone, gunakan node index.js sebagai pengganti stackpilot. Package npm belum dipublikasikan; quick start menggunakan GitHub.

## Pengujian

~~~bash
npm ci
npm test
~~~

CI menjalankan automated test pada Node.js dan sistem operasi yang didukung, memvalidasi launcher dan template PHP, serta menguji proyek hasil generate.

## Keamanan

Proyek hasil generate adalah fondasi development, bukan sertifikasi keamanan production. Tinjau autentikasi, otorisasi, penyimpanan token, CORS, secret, HTTPS, dependency, logging, monitoring, backup, dan konfigurasi deployment sebelum production. Jangan commit file .env atau secret.

## Kontribusi

Laporan bug, perbaikan dokumentasi, dan pull request terarah sangat diterima. Tambahkan test untuk perubahan perilaku dan jalankan npm test.

## Lisensi

MIT — lihat LICENSE.
