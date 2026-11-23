# StackPilot One-Command Launcher for Windows 10/11 x64
# Downloads a verified, portable Node.js 22 runtime into the current user's profile.
# It does not require Administrator rights and does not modify the machine PATH.

$ErrorActionPreference = 'Stop'
[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12

function Write-StackPilotBanner {
    Write-Host ''
    Write-Host '  ____  _             _    ____  _ _' -ForegroundColor Cyan
    Write-Host ' / ___|| |_ __ _  ___| | _|  _ \(_) |' -ForegroundColor Cyan
    Write-Host ' \___ \| __/ _\` |/ __| |/ / |_) | | |' -ForegroundColor Cyan
    Write-Host '  ___) | || (_| | (__|   <|  __/| | |' -ForegroundColor Cyan
    Write-Host ' |____/ \__\__,_|\___|_|\_\_|   |_|_|' -ForegroundColor Cyan
    Write-Host ''
    Write-Host '  StackPilot One-Command Launcher' -ForegroundColor White
    Write-Host '  Preparing a private, portable runtime...' -ForegroundColor DarkGray
    Write-Host ''
}

try {
    if ($env:OS -ne 'Windows_NT') {
        throw 'Launcher ini hanya mendukung Windows 10/11.'
    }

    if (-not [Environment]::Is64BitOperatingSystem) {
        throw 'Launcher saat ini membutuhkan Windows 64-bit (x64).'
    }

    Write-StackPilotBanner

    $runtimeRoot = Join-Path $env:LOCALAPPDATA 'StackPilot\runtime'
    New-Item -ItemType Directory -Path $runtimeRoot -Force | Out-Null

    Write-Host '[1/3] Memeriksa runtime Node.js 22 LTS...' -ForegroundColor Cyan
    $releases = Invoke-RestMethod -Uri 'https://nodejs.org/dist/index.json'
    $release = $releases |
        Where-Object { $_.version -like 'v22.*' -and $_.lts } |
        Select-Object -First 1

    if (-not $release) {
        throw 'Tidak dapat menemukan rilis Node.js 22 LTS dari nodejs.org.'
    }

    $version = $release.version
    $folderName = "node-$version-win-x64"
    $runtimeDir = Join-Path $runtimeRoot $folderName
    $nodeExe = Join-Path $runtimeDir 'node.exe'
    $npxCli = Join-Path $runtimeDir 'node_modules\npm\bin\npx-cli.js'

    if (-not ((Test-Path $nodeExe) -and (Test-Path $npxCli))) {
        $tempRoot = Join-Path ([IO.Path]::GetTempPath()) ("stackpilot-bootstrap-" + [guid]::NewGuid().ToString('N'))
        New-Item -ItemType Directory -Path $tempRoot -Force | Out-Null

        try {
            $archiveName = "$folderName.zip"
            $archiveUrl = "https://nodejs.org/dist/$version/$archiveName"
            $checksumsUrl = "https://nodejs.org/dist/$version/SHASUMS256.txt"
            $archivePath = Join-Path $tempRoot $archiveName
            $checksumsPath = Join-Path $tempRoot 'SHASUMS256.txt'

            Write-Host "      Mengunduh runtime portable $version..." -ForegroundColor Gray
            Invoke-WebRequest -Uri $checksumsUrl -OutFile $checksumsPath -UseBasicParsing
            Invoke-WebRequest -Uri $archiveUrl -OutFile $archivePath -UseBasicParsing

            $escapedName = [regex]::Escape($archiveName)
            $checksumLine = Get-Content -LiteralPath $checksumsPath |
                Where-Object { $_ -match "^\s*([a-fA-F0-9]{64})\s+\*?$escapedName\s*$" } |
                Select-Object -First 1

            if (-not $checksumLine) {
                throw 'Checksum arsip Node.js tidak ditemukan. Unduhan dibatalkan.'
            }

            $expectedHash = [regex]::Match($checksumLine, '([a-fA-F0-9]{64})').Groups[1].Value.ToLowerInvariant()
            $actualHash = (Get-FileHash -LiteralPath $archivePath -Algorithm SHA256).Hash.ToLowerInvariant()

            if ($actualHash -ne $expectedHash) {
                throw 'Verifikasi SHA-256 Node.js gagal. Arsip tidak akan diekstrak.'
            }

            Write-Host '      SHA-256 valid. Mengekstrak runtime...' -ForegroundColor Green
            Expand-Archive -LiteralPath $archivePath -DestinationPath $tempRoot -Force

            $extractedDir = Join-Path $tempRoot $folderName
            if (-not ((Test-Path (Join-Path $extractedDir 'node.exe')) -and
                      (Test-Path (Join-Path $extractedDir 'node_modules\npm\bin\npx-cli.js')))) {
                throw 'Isi runtime Node.js tidak lengkap.'
            }

            if (Test-Path $runtimeDir) {
                Remove-Item -LiteralPath $runtimeDir -Recurse -Force
            }
            Move-Item -LiteralPath $extractedDir -Destination $runtimeDir
        }
        finally {
            if (Test-Path $tempRoot) {
                Remove-Item -LiteralPath $tempRoot -Recurse -Force -ErrorAction SilentlyContinue
            }
        }
    }
    else {
        Write-Host "      Runtime portable $version sudah tersedia." -ForegroundColor Green
    }

    $env:PATH = "$runtimeDir;$env:PATH"
    $nodeVersion = & $nodeExe --version
    if ($LASTEXITCODE -ne 0) {
        throw 'Runtime Node.js portable tidak dapat dijalankan.'
    }

    Write-Host "      Node.js $nodeVersion siap (lokal, tanpa instalasi global)." -ForegroundColor Green

    Write-Host '[2/3] Mengunduh dan menyiapkan StackPilot dari GitHub...' -ForegroundColor Cyan
    Write-Host '      npx akan mengambil source dan dependency StackPilot.' -ForegroundColor Gray

    Write-Host '[3/3] Menjalankan StackPilot...' -ForegroundColor Cyan
    & $nodeExe $npxCli --yes 'github:Bagaas-ind/StackPilot'
    $stackPilotExitCode = $LASTEXITCODE

    if ($stackPilotExitCode -ne 0) {
        throw "StackPilot berhenti dengan kode keluar $stackPilotExitCode."
    }
}
catch {
    Write-Host ''
    Write-Host "[STACKPILOT ERROR] $($_.Exception.Message)" -ForegroundColor Red
    Write-Host 'Periksa koneksi internet, lalu coba lagi. Tidak perlu menjalankan PowerShell sebagai Administrator.' -ForegroundColor Yellow
    throw
}