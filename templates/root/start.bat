@echo off
setlocal
title React-Lara Forge - Launcher
cd /d "%~dp0"

if not exist "backend\artisan" (
  echo [GAGAL] Folder backend tidak ditemukan.
  echo Letakkan start.bat di folder project, sejajar dengan folder backend dan frontend.
  pause
  exit /b 1
)
if not exist "frontend\package.json" (
  echo [GAGAL] Folder frontend tidak ditemukan.
  pause
  exit /b 1
)

if not exist "frontend\node_modules" (
  echo Pertama kali dijalankan: memasang dependensi frontend...
  pushd frontend
  call npm install
  popd
)

echo Menjalankan backend Laravel di http://localhost:8000 ...
start "Backend Laravel" cmd /k "cd /d %~dp0backend && php artisan serve"

echo Menjalankan frontend React di http://localhost:5173 ...
start "Frontend React" cmd /k "cd /d %~dp0frontend && npm run dev"

timeout /t 6 /nobreak >nul
start "" http://localhost:5173

echo.
echo Selesai. Dua jendela server sudah terbuka.
echo Untuk berhenti, tutup kedua jendela tersebut atau tekan Ctrl+C di dalamnya.
timeout /t 5 >nul
