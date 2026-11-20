@echo off
setlocal EnableExtensions EnableDelayedExpansion
title React-Lara Forge - Launcher
cd /d "%~dp0"

if not exist "backend\artisan" (
  echo [ERROR] Laravel backend tidak ditemukan.
  echo Simpan launcher ini di root proyek.
  goto :FAIL
)
if not exist "frontend\package.json" (
  echo [ERROR] React frontend tidak ditemukan.
  goto :FAIL
)

for %%C in (php npm curl netstat) do (
  where %%C >nul 2>nul
  if errorlevel 1 (
    echo [ERROR] Perintah %%C tidak ditemukan di PATH.
    goto :FAIL
  )
)

set "PORT_PID="
for /f "tokens=5" %%P in ('netstat -ano ^| findstr /R /C:":8000 .*LISTENING"') do set "PORT_PID=%%P"
if defined PORT_PID (
  echo [ERROR] Port 8000 sudah digunakan oleh PID !PORT_PID!.
  goto :FAIL
)
set "PORT_PID="
for /f "tokens=5" %%P in ('netstat -ano ^| findstr /R /C:":5173 .*LISTENING"') do set "PORT_PID=%%P"
if defined PORT_PID (
  echo [ERROR] Port 5173 sudah digunakan oleh PID !PORT_PID!.
  goto :FAIL
)

if not exist "frontend\node_modules" (
  echo Installing frontend dependencies for the first run...
  pushd frontend
  call npm install
  if errorlevel 1 (
    popd
    echo [ERROR] npm install gagal. Periksa koneksi internet.
    goto :FAIL
  )
  popd
)

echo Starting Laravel API...
start "Backend Laravel" /min cmd /c "cd /d ""%~dp0backend"" && php artisan serve --host=127.0.0.1 --port=8000 > ""%~dp0backend.log"" 2>&1"

set /a ATTEMPT=0
:WAIT_BACKEND
curl -fsS http://127.0.0.1:8000/up >nul 2>nul
if not errorlevel 1 goto :BACKEND_READY
set /a ATTEMPT+=1
if !ATTEMPT! GEQ 15 goto :BACKEND_FAILED
timeout /t 1 /nobreak >nul
goto :WAIT_BACKEND

:BACKEND_FAILED
echo [ERROR] Backend Laravel gagal start atau tidak merespons dalam 15 detik.
if exist "backend.log" type "backend.log"
goto :FAIL

:BACKEND_READY
echo Starting React frontend...
start "Frontend React" /min cmd /c "cd /d ""%~dp0frontend"" && npm run dev -- --host 127.0.0.1 --port 5173 --strictPort > ""%~dp0frontend.log"" 2>&1"

set /a ATTEMPT=0
:WAIT_FRONTEND
curl -fsS http://127.0.0.1:5173/ >nul 2>nul
if not errorlevel 1 goto :FRONTEND_READY
set /a ATTEMPT+=1
if !ATTEMPT! GEQ 15 goto :FRONTEND_FAILED
timeout /t 1 /nobreak >nul
goto :WAIT_FRONTEND

:FRONTEND_FAILED
echo [ERROR] Frontend React gagal start atau tidak merespons dalam 15 detik.
if exist "frontend.log" type "frontend.log"
for /f "tokens=5" %%P in ('netstat -ano ^| findstr /R /C:":8000 .*LISTENING"') do taskkill /PID %%P /T /F >nul 2>nul
goto :FAIL

:FRONTEND_READY
echo.
echo Backend  : http://localhost:8000
echo Frontend : http://localhost:5173
echo Log      : backend.log dan frontend.log
start "" http://localhost:5173
echo Kedua server berjalan di jendela terpisah yang diminimalkan.
echo Tutup jendela server untuk menghentikannya.
exit /b 0

:FAIL
echo.
echo Launcher gagal. Periksa pesan di atas.
pause
exit /b 1
