# Panduan Pemula: Dari GitHub sampai Menjalankan StackPilot

**Bahasa:** [English](BEGINNER_GUIDE.md) · Bahasa Indonesia

Panduan ini ditujukan untuk pengguna yang baru mengenal GitHub dan terminal. Kamu tidak perlu memahami Git terlebih dahulu untuk mencoba StackPilot di Windows.

## 1. Kenali istilah dasarnya

- **Repository (repo):** folder proyek yang disimpan di GitHub.
- **README:** halaman pengenalan proyek dan petunjuk awal.
- **Clone:** mengunduh salinan repository ke komputer menggunakan Git.
- **Terminal:** aplikasi untuk mengetik perintah, misalnya CMD atau PowerShell.
- **Runtime:** software yang menjalankan program, misalnya Node.js untuk StackPilot.
- **Dependency:** library tambahan yang dibutuhkan aplikasi.
- **Framework:** fondasi untuk membangun aplikasi, misalnya Laravel, React, atau Django.
- **CLI:** aplikasi yang digunakan melalui perintah dan menu di terminal.
- **Fork:** salinan repository milik akunmu sendiri di GitHub, biasanya untuk mengusulkan perubahan dengan aman.
- **Branch:** jalur kerja terpisah agar kamu bisa mengubah kode tanpa langsung mengubah branch utama.
- **Commit:** rekaman/snapshot perubahan yang disimpan dengan pesan singkat.
- **Issue:** ruang diskusi GitHub untuk melaporkan bug, bertanya, atau mengusulkan peningkatan.
- **Pull request (PR):** usulan agar perubahan dari sebuah branch ditinjau dan digabungkan ke branch lain.

Kamu boleh menggunakan StackPilot tanpa melakukan clone. Pilih cara instalasi satu perintah di bagian berikut.

## 2. Persiapan

Untuk metode paling mudah, siapkan:

1. Komputer Windows 10/11 64-bit (Intel/AMD x64).
2. Koneksi internet.
3. Jendela CMD biasa — tidak perlu Run as Administrator.

Launcher satu-perintah StackPilot saat ini belum mendukung Windows ARM64 atau 32-bit. Launcher menyiapkan Node.js 22 LTS portable, tetapi tidak memasang semua runtime framework.

## 3. Jalankan StackPilot dari CMD

1. Tekan tombol Windows + R.
2. Ketik `cmd`, lalu tekan Enter.
3. Salin perintah berikut secara lengkap dan tempel ke CMD:

```cmd
powershell.exe -NoLogo -NoProfile -Command "irm 'https://raw.githubusercontent.com/Bagaas-ind/StackPilot/main/scripts/install.ps1' | iex"
```

4. Tekan Enter.
5. Tunggu launcher mengunduh runtime dan menyiapkan StackPilot.
6. Saat menu utama muncul, ketik angka menu yang ingin dibuka lalu tekan Enter.

**Penting:** perintah ini mengunduh dan menjalankan script dari internet. Sebelum menjalankannya, kamu dapat membaca [script installer](../scripts/install.ps1) terlebih dahulu. Jalankan hanya jika kamu mempercayai source code dan memahami bahwa script akan dijalankan di komputer sendiri.

## 4. Pilih metode lain jika diperlukan

### PowerShell

Buka PowerShell biasa, lalu jalankan:

```powershell
irm https://raw.githubusercontent.com/Bagaas-ind/StackPilot/main/scripts/install.ps1 | iex
```

### Node.js sudah terpasang

Jika Node.js 22 atau 24 LTS dan npm sudah tersedia:

```bash
npx --yes github:Bagaas-ind/StackPilot
```

### Ingin mempelajari source code dengan Git

Metode ini memerlukan Git, Node.js 22/24, npm, dan internet:

```bash
git clone https://github.com/Bagaas-ind/StackPilot.git
cd StackPilot
npm ci
node index.js
```

## 5. Memahami menu StackPilot

| Menu | Kegunaan | Catatan |
| --- | --- | --- |
| Runtime Doctor | Memeriksa runtime dan versi tools | Tidak memasang atau menghapus software |
| Framework Installer | Membantu membuat project dari 11 framework | Periksa prasyarat framework terlebih dahulu |
| Application Generator | Membuat starter Laravel API + React | Backend memerlukan PHP 8.2+ dan Composer 2.x |
| Environment Manager | Melihat inventaris runtime dan PATH | Read-only; tidak mengubah PATH |
| Database Manager | Memeriksa database client dan port TCP umum | Tidak menguji login atau menjalankan query SQL |
| Docker Manager | Memeriksa Docker/Compose dan menawarkan aksi Compose | Start/stop memerlukan konfirmasi |
| Exit | Menutup aplikasi | — |

Untuk memilih menu, masukkan nomor yang ditampilkan. Baca setiap prompt dan ringkasan aksi sebelum menyetujui operasi.

## 6. Prasyarat sebelum membuat project

Launcher otomatis hanya menyediakan Node.js untuk menjalankan StackPilot. Tools lain tetap dibutuhkan sesuai pilihan:

- Laravel, CodeIgniter 4, Symfony: PHP dan Composer.
- React, Vue.js, Next.js, Express.js: Node.js dan npm.
- Django, Flask, FastAPI: Python dan pip.
- Spring Boot: Java dan `tar`.
- Docker Manager: Docker Engine/Desktop dan plugin Compose.

Pembuatan backend Laravel melalui Application Generator memerlukan PHP 8.2+ dan Composer 2.x. Framework dan dependency umumnya diunduh dari internet.

## 7. Jika mengalami masalah

| Gejala | Yang perlu diperiksa |
| --- | --- |
| Perintah tidak berjalan di CMD | Salin seluruh perintah termasuk tanda kutip; pastikan kamu berada di CMD |
| Download gagal | Periksa internet, proxy, firewall, lalu coba lagi |
| Node.js tidak ditemukan saat memakai npx | Pastikan Node.js 22/24 LTS dan npm terpasang serta tersedia di PATH |
| PHP/Composer tidak terdeteksi | Instal versi yang dibutuhkan framework lalu buka terminal baru |
| Docker daemon tidak terhubung | Jalankan Docker Desktop/Engine dan tunggu sampai siap |
| Generator gagal mengunduh dependency | Periksa koneksi internet dan pesan error dari Composer/npm |

Saat meminta bantuan, sertakan sistem operasi, metode instalasi, perintah yang dijalankan, dan pesan error lengkap. Hapus password, token, dan nilai rahasia dari log sebelum membagikannya.

## 8. Belajar dari source code dan berkontribusi

Jika ingin mempelajari proyek:

1. Buka [repository StackPilot](https://github.com/Bagaas-ind/StackPilot).
2. Gunakan tab **Code** untuk melihat folder dan file.
3. Baca README sebelum menjalankan perintah.
4. Baca folder `lib/` untuk memahami modul CLI, `scripts/` untuk launcher, dan `templates/` untuk template project.
5. Baca [CONTRIBUTING.md](../CONTRIBUTING.md) sebelum mengirim perubahan.

Untuk mencoba perubahan secara lokal, clone repository dan jalankan:

```bash
npm ci
npm test
```

Jangan mengunggah file `.env`, password, token, database pribadi, atau folder `node_modules` ke commit publik.

## 9. Keamanan dan batasan

- Jangan menjalankan script atau perintah yang tidak kamu pahami.
- Tinjau file Compose sebelum menyetujui Docker Compose up/down.
- Jangan memasukkan kredensial database ke laporan bug publik.
- Project hasil generator adalah starter development, bukan aplikasi yang otomatis aman untuk production.
- Periksa autentikasi, otorisasi, konfigurasi CORS, secret, dependency, dan deployment sebelum aplikasi dipublikasikan.

## Referensi

- [Repository StackPilot](https://github.com/Bagaas-ind/StackPilot)
- [Panduan penggunaan lengkap](USAGE.id.md)
- [Panduan kontribusi](../CONTRIBUTING.md)
- [Kebijakan keamanan](../SECURITY.md)
