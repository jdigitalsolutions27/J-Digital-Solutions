$pgCtl = "C:\Program Files\PostgreSQL\17\bin\pg_ctl.exe"
$pgIsReady = "C:\Program Files\PostgreSQL\17\bin\pg_isready.exe"
$dataDir = "C:\Program Files\PostgreSQL\17\data"

if (-not (Test-Path $pgCtl)) {
  Write-Error "pg_ctl not found at $pgCtl"
  exit 1
}

& $pgCtl -D $dataDir status *> $null
if ($LASTEXITCODE -eq 0) {
  & $pgIsReady -h localhost -p 5432 -t 2 | Out-Null
  if ($LASTEXITCODE -eq 0) {
    Write-Output "localhost:5432 - accepting connections"
    exit 0
  }
}

& $pgCtl -D $dataDir start
& $pgIsReady -h localhost -p 5432 -t 2 | Out-Null
if ($LASTEXITCODE -eq 0) {
  Write-Output "localhost:5432 - accepting connections"
  exit 0
}

Write-Error "PostgreSQL started command ran but database is not accepting connections yet."
exit 1
