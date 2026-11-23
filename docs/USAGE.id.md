# Panduan Menjalankan StackPilot

Panduan ini menjelaskan tiga cara menjalankan StackPilot di Windows: CMD, PowerShell, dan Node.js. Pilih metode yang sesuai dengan perangkat dan kebutuhanmu.

## 1. Menjalankan dari CMD (direkomendasikan untuk pemula)

Metode ini cocok untuk pengguna Windows yang belum memasang Node.js, npm, atau Git.

1. Pastikan komputer menggunakan Windows 10/11 64-bit (Intel/AMD) dan terhubung ke internet.
2. Tekan `Win + R`, ketik `cmd`, lalu tekan Enter.
3. Salin satu perintah berikut ke jendela CMD:

```cmd
powershell.exe -NoLogo -NoProfile -Command "irm 'https://raw.githubusercontent.com/Bagaas-ind/StackPilot/main/scripts/install.ps1' | iex"
```

4. Tekan Enter dan tunggu proses persiapan selesai.
5. Setelah menu StackPilot muncul, ketik nomor fitur yang ingin digunakan lalu tekan Enter.
6. Ikuti instruksi pada layar. Pilih **Exit** untuk menutup aplikasi.

Launcher menyiapkan Node.js 22 LTS portable di profil pengguna Windows. Launcher tidak memasang Node.js secara global, tidak mengubah PATH sistem, dan tidak memerlukan Administrator. Source sementara dibersihkan setelah aplikasi ditutup.

## 2. Menjalankan dari PowerShell

Metode ini memiliki hasil yang sama dengan metode CMD.

1. Buka PowerShell biasa (tidak perlu Run as Administrator).
2. Salin dan jalankan:

```powershell
irm https://raw.githubusercontent.com/Bagaas-ind/StackPilot/main/scripts/install.ps1 | iex
```

3. Tunggu launcher menyiapkan runtime dan dependency.
4. Gunakan menu interaktif StackPilot.

Perintah ini juga dapat dijalankan dari terminal VS Code jika profil terminal yang aktif adalah PowerShell.

## 3. Menjalankan dengan Node.js yang sudah terpasang

Pilih metode ini jika Node.js 22 atau 24 LTS dan npm sudah tersedia.

### Opsi A — Jalankan langsung dari GitHub

Buka CMD, PowerShell, atau terminal VS Code, kemudian jalankan:

```bash
npx --yes github:Bagaas-ind/StackPilot
```

npx akan mengambil source repository dan menjalankan CLI. Koneksi internet diperlukan. Jika perintah tidak dikenali, pastikan Node.js dan npm sudah terpasang dan tersedia di PATH. Package StackPilot belum dipublikasikan ke npm registry.

### Opsi B — Clone repository

```bash
git clone https://github.com/Bagaas-ind/StackPilot.git
cd StackPilot
npm ci
node index.js
```

Perintah tersebut mengunduh repository, memasang dependency yang terkunci di package-lock, lalu membuka menu StackPilot. Metode ini memerlukan Git, Node.js, npm, dan koneksi internet.

Untuk menjalankan kembali setelah clone, masuk ke folder repository lalu jalankan:

```bash
node index.js
```

## 4. Menggunakan menu StackPilot

Setelah CLI terbuka, menu utama menyediakan:

| Menu | Fungsi |
| --- | --- |
| Runtime Doctor | Memeriksa runtime dan tools development |
| Framework Installer | Menjalankan workflow setup 11 framework |
| Application Generator | Membuat starter Laravel API + React |
| Environment Manager | Melihat inventaris runtime dan PATH |
| Database Manager | Memeriksa database client dan keterjangkauan port lokal |
| Docker Manager | Memeriksa Docker/Compose dan mengelola project Compose dengan konfirmasi |
| Exit | Menutup StackPilot |

Ketik nomor menu lalu tekan Enter. Ikuti pertanyaan dan konfirmasi yang ditampilkan. Baca ringkasan aksi sebelum menyetujui operasi yang dapat menjalankan perintah atau mengubah project.

## 5. Prasyarat framework

Launcher satu-perintah hanya menyediakan Node.js untuk menjalankan StackPilot. Runtime khusus framework tidak otomatis dipasang.

- Laravel, CodeIgniter 4, Symfony: PHP dan Composer.
- React, Vue.js, Next.js, Express.js: Node.js dan npm (sudah disediakan launcher untuk sesi launcher).
- Django, Flask, FastAPI: Python dan pip.
- Spring Boot: Java dan `tar`.
- Docker Manager: Docker Engine/Desktop dan plugin Docker Compose.

Application Generator backend membutuhkan PHP 8.2+ dan Composer 2.x. Koneksi internet umumnya diperlukan untuk mengunduh framework dan dependency.

## 6. Troubleshooting

- **Perintah CMD tidak dikenali:** pastikan perintah disalin lengkap, termasuk tanda kutip.
- **Launcher gagal mengunduh:** periksa koneksi internet, proxy, firewall, atau coba lagi nanti.
- **Windows ARM64 atau 32-bit:** launcher satu-perintah saat ini hanya mendukung Windows x64 Intel/AMD.
- **Node.js tidak ditemukan saat memakai npx:** instal Node.js 22/24 LTS dan pastikan npm tersedia di PATH.
- **Runtime framework tidak ditemukan:** instal prasyarat framework yang ingin digunakan, lalu jalankan kembali workflow.
- **Docker tidak terhubung:** jalankan Docker Desktop/Engine dan tunggu daemon siap.

## 7. Catatan keamanan

Perintah instalasi satu-baris mengunduh dan menjalankan script launcher dari repository. Jalankan hanya jika kamu mempercayai repository dan sudah meninjau `scripts/install.ps1`. Kamu dapat membuka file tersebut di GitHub dan memeriksanya sebelum menjalankan perintah. Jangan menjalankan perintah atau file Compose yang tidak kamu pahami. Tinjau kode dan konfigurasi hasil generate sebelum digunakan pada lingkungan penting atau production.
