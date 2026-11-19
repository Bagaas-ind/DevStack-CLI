@echo off
setlocal
title React-Lara Forge - Launcher
cd /d "%~dp0"

if not exist "backend\artisan" (
  echo [ERROR] Laravel backend was not found.
  echo This launcher must stay beside the backend and frontend folders.
  pause
  exit /b 1
)
if not exist "frontend\package.json" (
  echo [ERROR] React frontend was not found.
  pause
  exit /b 1
)

where php >nul 2>nul
if errorlevel 1 (
  echo [ERROR] PHP was not found in PATH.
  pause
  exit /b 1
)
where npm >nul 2>nul
if errorlevel 1 (
  echo [ERROR] npm was not found in PATH.
  pause
  exit /b 1
)

if not exist "frontend\node_modules" (
  echo Installing frontend dependencies for the first run...
  pushd frontend
  call npm install
  if errorlevel 1 (
    popd
    echo [ERROR] npm install failed. Check your network connection and try again.
    pause
    exit /b 1
  )
  popd
)

echo Starting Laravel at http://localhost:8000 ...
start "Backend Laravel" cmd /k "cd /d ""%~dp0backend"" && php artisan serve"

echo Starting React at http://localhost:5173 ...
start "Frontend React" cmd /k "cd /d ""%~dp0frontend"" && npm run dev"

timeout /t 6 /nobreak >nul
start "" http://localhost:5173

echo.
echo Both development servers have been started in separate windows.
echo Close those windows or press Ctrl+C in each one to stop the servers.
timeout /t 5 >nul
