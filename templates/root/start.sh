#!/usr/bin/env bash
# Start the Laravel API and React development server together.
set -Eeuo pipefail
cd "$(dirname "$0")"

BACKEND_PID=""
FRONTEND_PID=""

cleanup() {
  if [[ -n "$FRONTEND_PID" ]]; then
    kill "$FRONTEND_PID" 2>/dev/null || true
    wait "$FRONTEND_PID" 2>/dev/null || true
  fi
  if [[ -n "$BACKEND_PID" ]]; then
    kill "$BACKEND_PID" 2>/dev/null || true
    wait "$BACKEND_PID" 2>/dev/null || true
  fi
}
trap cleanup EXIT
trap 'exit 130' INT TERM

fail() {
  echo "[ERROR] $*" >&2
  exit 1
}

if [[ ! -f backend/artisan || ! -f frontend/package.json ]]; then
  fail "Folder backend atau frontend tidak ditemukan. Simpan script ini di root proyek."
fi

for command in php npm curl; do
  command -v "$command" >/dev/null 2>&1 || fail "Perintah '$command' tidak ditemukan di PATH."
done

port_is_listening() {
  local port="$1"
  if command -v lsof >/dev/null 2>&1; then
    lsof -nP -iTCP:"$port" -sTCP:LISTEN -t >/dev/null 2>&1
  elif command -v ss >/dev/null 2>&1; then
    ss -ltn | grep -Eq ":${port}[[:space:]]"
  else
    echo "[ERROR] Perlu lsof (macOS) atau ss (Linux) untuk memeriksa port." >&2
    return 2
  fi
}

for port in 8000 5173; do
  if port_is_listening "$port"; then
    fail "Port $port sudah digunakan. Hentikan aplikasi yang memakai port tersebut lalu jalankan ulang."
  else
    result=$?
    [[ "$result" -eq 1 ]] || fail "Tidak dapat memeriksa port $port. Pastikan lsof atau ss tersedia."
  fi
done

if [[ ! -d frontend/node_modules ]]; then
  echo "Installing frontend dependencies for the first run..."
  (cd frontend && npm install) || fail "npm install gagal. Periksa koneksi internet dan coba lagi."
fi

echo "Starting Laravel API..."
(cd backend && php artisan serve --host=127.0.0.1 --port=8000) > backend.log 2>&1 &
BACKEND_PID=$!

backend_ready=0
for attempt in 1 2 3 4 5 6 7 8 9 10 11 12 13 14 15; do
  if ! kill -0 "$BACKEND_PID" 2>/dev/null; then
    break
  fi
  if curl -fsS http://127.0.0.1:8000/up >/dev/null 2>&1; then
    backend_ready=1
    break
  fi
  sleep 1
done

if [[ "$backend_ready" -ne 1 ]]; then
  echo "[ERROR] Backend Laravel gagal start atau tidak merespons dalam 15 detik." >&2
  tail -n 30 backend.log 2>/dev/null || true
  exit 1
fi

echo "Starting React frontend..."
(cd frontend && npm run dev -- --host 127.0.0.1 --port 5173 --strictPort) > frontend.log 2>&1 &
FRONTEND_PID=$!

frontend_ready=0
for attempt in 1 2 3 4 5 6 7 8 9 10 11 12 13 14 15; do
  if ! kill -0 "$FRONTEND_PID" 2>/dev/null; then
    break
  fi
  if curl -fsS http://127.0.0.1:5173/ >/dev/null 2>&1; then
    frontend_ready=1
    break
  fi
  sleep 1
done

if [[ "$frontend_ready" -ne 1 ]]; then
  echo "[ERROR] Frontend React gagal start atau tidak merespons dalam 15 detik." >&2
  tail -n 30 frontend.log 2>/dev/null || true
  exit 1
fi

echo
echo "Backend  : http://localhost:8000"
echo "Frontend : http://localhost:5173"
echo "Log      : backend.log dan frontend.log"
echo "Tekan Ctrl+C untuk menghentikan kedua server."

if command -v open >/dev/null 2>&1; then
  open http://localhost:5173 >/dev/null 2>&1 || true
elif command -v xdg-open >/dev/null 2>&1; then
  xdg-open http://localhost:5173 >/dev/null 2>&1 || true
fi

while true; do
  if ! kill -0 "$BACKEND_PID" 2>/dev/null; then
    echo "[ERROR] Backend Laravel berhenti secara tidak terduga." >&2
    tail -n 30 backend.log 2>/dev/null || true
    exit 1
  fi
  if ! kill -0 "$FRONTEND_PID" 2>/dev/null; then
    echo "[ERROR] Frontend React berhenti secara tidak terduga." >&2
    tail -n 30 frontend.log 2>/dev/null || true
    exit 1
  fi
  sleep 1
done
