import fs from 'node:fs'
import path from 'node:path'
import { randomBytes } from 'node:crypto'
import { runSync } from './run.js'

export function getProjectDatabaseName(projectName, suffix = randomBytes(4).toString('hex')) {
  const slug = String(projectName)
    .toLowerCase()
    .replace(/[^a-z0-9_]/g, '_')
    .replace(/_+/g, '_')
    .replace(/^_+|_+$/g, '')
    .slice(0, 40)

  if (!slug) throw new Error('Nama project tidak dapat dijadikan nama database.')
  if (!/^[a-f0-9]{8}$/.test(suffix)) throw new Error('Database suffix tidak valid.')
  return `stackpilot_${slug}_${suffix}`
}

function readEnvFile(filePath) {
  const values = {}
  const source = fs.readFileSync(filePath, 'utf8')

  for (const line of source.split(/\r?\n/)) {
    const match = line.match(/^\s*(DB_[A-Z_]+)\s*=\s*(.*)\s*$/)
    if (!match) continue

    let value = match[2].trim()
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1)
    }
    values[match[1]] = value
  }

  return values
}

/**
 * Create a dedicated database for this generated project without touching
 * existing databases. SQLite creates its database file separately.
 */
export function ensureDatabaseExists(backendDir, driver) {
  if (driver === 'sqlite') return

  if (!['mysql', 'pgsql'].includes(driver)) {
    throw new Error(`Database driver tidak didukung: ${driver}`)
  }

  const envPath = path.join(backendDir, '.env')
  const values = readEnvFile(envPath)
  const database = values.DB_DATABASE

  if (!/^stackpilot_[a-z0-9_]{1,40}_[a-f0-9]{8}$/.test(database || '')) {
    throw new Error('Nama database proyek tidak valid atau tidak terisolasi.')
  }

  const scriptPath = path.join(backendDir, '.stackpilot-create-db.php')
  const phpScript = `<?php
$driver = getenv('DB_CONNECTION');
$host = getenv('DB_HOST') ?: '127.0.0.1';
$port = getenv('DB_PORT') ?: ($driver === 'pgsql' ? '5432' : '3306');
$database = getenv('DB_DATABASE');
$username = getenv('DB_USERNAME') ?: '';
$password = getenv('DB_PASSWORD') ?: '';

if (!preg_match('/^stackpilot_[a-z0-9_]{1,50}$/', $database)) {
    fwrite(STDERR, "Invalid isolated database name.\\n");
    exit(2);
}

try {
    if ($driver === 'mysql') {
        $pdo = new PDO(
            "mysql:host={$host};port={$port};charset=utf8mb4",
            $username,
            $password,
            [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION]
        );
        $pdo->exec('CREATE DATABASE IF NOT EXISTS ' . chr(96) . $database . chr(96) . ' CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci');
    } elseif ($driver === 'pgsql') {
        $pdo = new PDO(
            "pgsql:host={$host};port={$port};dbname=postgres",
            $username,
            $password,
            [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION]
        );
        $check = $pdo->prepare('SELECT 1 FROM pg_database WHERE datname = :name');
        $check->execute(['name' => $database]);
        if (!$check->fetchColumn()) {
            $pdo->exec('CREATE DATABASE "' . $database . '"');
        }
    } else {
        throw new RuntimeException('Unsupported database driver: ' . $driver);
    }

    echo "Database {$database} is ready.\\n";
} catch (Throwable $error) {
    fwrite(STDERR, "Unable to create database {$database}: " . $error->getMessage() . "\\n");
    exit(1);
}
`

  fs.writeFileSync(scriptPath, phpScript, 'utf8')

  try {
    const result = runSync('php', [path.basename(scriptPath)], {
      cwd: backendDir,
      stdio: 'inherit',
      env: { ...process.env, ...values },
    })

    if (result.error || result.status !== 0) {
      throw new Error(
        `Gagal menyiapkan database "${database}". Pastikan server ${driver} aktif, kredensial benar, dan user database memiliki izin CREATE DATABASE.`
      )
    }
  } finally {
    fs.rmSync(scriptPath, { force: true })
  }
}
