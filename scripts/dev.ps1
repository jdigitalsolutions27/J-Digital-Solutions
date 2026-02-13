$ErrorActionPreference = "Stop"

$envFile = ".env.local"
if (-not (Test-Path $envFile)) {
  $envFile = ".env"
}

$databaseUrl = ""
if (Test-Path $envFile) {
  $line = Get-Content $envFile | Where-Object { $_ -match '^DATABASE_URL=' } | Select-Object -First 1
  if ($line) {
    $databaseUrl = ($line -replace '^DATABASE_URL=', '').Trim('"')
  }
}

if ($databaseUrl -match 'localhost:5432') {
  Write-Output "Detected local PostgreSQL database. Ensuring it is running..."
  & powershell -ExecutionPolicy Bypass -File "scripts\db-start.ps1"
}

& npm run dev:next
