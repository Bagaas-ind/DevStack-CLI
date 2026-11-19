#!/usr/bin/env bash
# Start the Laravel API and React development server together.
set -Eeuo pipefail
cd "$(dirname "$0")"

if [[ ! -f backend/artisan || ! -f frontend/package.json ]]; then
  echo "[ERROR] Backend or frontend folder is missing. Keep this script at the project root." >&2
  exit 1
fi

for command in php npm; do
  if ! command -v "$command" >/dev/null 2>&1; then
    echo "[ERROR] Required command '$command' was not found in PATH." >&2
    exit 1
  fi
done

if [[ ! -d frontend/node_modules ]]; then
  echo "Installing frontend dependencies for the first run..."
  (cd frontend && npm install)
fi

echo "Backend  : http://localhost:8000"
echo "Frontend : http://localhost:5173"
echo "Press Ctrl+C to stop both development servers."

(cd backend && php artisan serve) &
BACKEND_PID=$!
cleanup() {
  kill "$BACKEND_PID" 2>/dev/null || true
  wait "$BACKEND_PID" 2>/dev/null || true
}
trap cleanup EXIT INT TERM

cd frontend
npm run dev
