#!/usr/bin/env bash
# Jalankan backend Laravel dan frontend React sekaligus (macOS / Linux / Git Bash)
cd "$(dirname "$0")" || exit 1

if [ ! -f backend/artisan ] || [ ! -f frontend/package.json ]; then
  echo "[GAGAL] Folder backend atau frontend tidak ditemukan."
  echo "Letakkan start.sh di folder project, sejajar dengan backend dan frontend."
  exit 1
fi

if [ ! -d frontend/node_modules ]; then
  echo "Pertama kali dijalankan: memasang dependensi frontend..."
  (cd frontend && npm install) || exit 1
fi

echo "Backend  : http://localhost:8000"
echo "Frontend : http://localhost:5173"
echo "Tekan Ctrl+C untuk menghentikan keduanya."

(cd backend && php artisan serve) &
BACKEND_PID=$!
trap 'kill $BACKEND_PID 2>/dev/null' EXIT INT TERM

cd frontend && npm run dev
