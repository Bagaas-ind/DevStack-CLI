#!/usr/bin/env node

import { program } from 'commander';
import chalk from 'chalk';
import { execSync } from 'child_process';
import fs from 'fs-extra';
import path from 'path';

// Fungsi untuk menjalankan perintah terminal
function runCommand(command, cwd = process.cwd()) {
  try {
    execSync(command, { stdio: 'inherit', cwd });
  } catch (error) {
    console.error(chalk.red(`\n[X] Error saat menjalankan: ${command}`));
    process.exit(1);
  }
}

program
  .name('react-lara-forge')
  .description('CLI Scaffolding untuk project Laravel 11 API + React (Vite) + Tailwind')
  .version('1.0.0');

program
  .command('create <project-name>')
  .description('Membuat project Fullstack baru')
  .action(async (projectName) => {
    const rootDir = path.join(process.cwd(), projectName);
    const backendDir = path.join(rootDir, 'backend');
    const frontendDir = path.join(rootDir, 'frontend');

    console.log(chalk.cyan.bold(`\n🔥 MEMULAI PEMBUATAN PROJECT: ${projectName}\n`));

    // 1. Buat Folder Utama
    if (fs.existsSync(rootDir)) {
      console.error(chalk.red(`Folder ${projectName} sudah ada! Gunakan nama lain.`));
      process.exit(1);
    }
    fs.mkdirSync(rootDir);

    // 2. Setup Backend (Laravel)
    console.log(chalk.yellow('\n[1/4] Menginstall Laravel (Backend)...'));
    runCommand(`composer create-project laravel/laravel backend`, rootDir);
    console.log(chalk.green('[✔] Laravel berhasil diinstall.'));
    
    console.log(chalk.yellow('[2/4] Menginstall Laravel Sanctum & Setup CORS...'));
    runCommand(`php artisan install:api`, backendDir);
    
    // Membuat file cors.php otomatis
    const corsContent = `<?php
return [
    'paths' => ['api/*', 'sanctum/csrf-cookie'],
    'allowed_methods' => ['*'],
    'allowed_origins' => ['http://localhost:5173'],
    'allowed_origins_patterns' => [],
    'allowed_headers' => ['*'],
    'exposed_headers' => [],
    'max_age' => 0,
    'supports_credentials' => true,
];`;
    fs.writeFileSync(path.join(backendDir, 'config', 'cors.php'), corsContent);
    console.log(chalk.green('[✔] CORS & Sanctum siap digunakan.'));

    // 3. Setup Frontend (React + Vite)
    console.log(chalk.yellow('\n[3/4] Membuat React (Frontend)...'));
    runCommand(`npm create vite@latest frontend -- --template react`, rootDir);
    
    console.log(chalk.yellow('[4/4] Menginstall Dependencies Frontend (Tailwind, Router, Axios)...'));
    runCommand(`npm install`, frontendDir);
    runCommand(`npm install -D tailwindcss@3 postcss autoprefixer`, frontendDir);
    runCommand(`npx tailwindcss init -p`, frontendDir);
    runCommand(`npm install react-router-dom axios framer-motion`, frontendDir);

    // Konfigurasi Tailwind Otomatis
    const tailwindConfig = `/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: { extend: {} },
  plugins: [],
}`;
    fs.writeFileSync(path.join(frontendDir, 'tailwind.config.js'), tailwindConfig);
    
    // Index CSS Otomatis
    const indexCss = `@tailwind base;\n@tailwind components;\n@tailwind utilities;\n`;
    fs.writeFileSync(path.join(frontendDir, 'src', 'index.css'), indexCss);

    // 4. Buat File start.bat (Khusus Windows)
    const startBat = `@echo off
echo Menyalakan Backend...
start "Backend" cmd /k "cd backend && php artisan serve"
echo Menyalakan Frontend...
start "Frontend" cmd /k "cd frontend && npm run dev"
`;
    fs.writeFileSync(path.join(rootDir, 'start.bat'), startBat);

    // Selesai
    console.log(chalk.green.bold(`\n✅ PROJECT ${projectName} BERHASIL DIBUAT!`));
    console.log(chalk.white(`\nLangkah selanjutnya:`));
    console.log(chalk.cyan(`  1. cd ${projectName}`));
    console.log(chalk.cyan(`  2. Buka terminal backend: cd backend && php artisan serve`));
    console.log(chalk.cyan(`  3. Buka terminal frontend: cd frontend && npm run dev`));
    console.log(chalk.cyan(`  (Atau klik 2x file start.bat jika pakai Windows)\n`));
  });

program.parse(process.argv);