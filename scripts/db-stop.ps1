$pgCtl = "C:\Program Files\PostgreSQL\17\bin\pg_ctl.exe"
$dataDir = "C:\Program Files\PostgreSQL\17\data"

if (-not (Test-Path $pgCtl)) {
  Write-Error "pg_ctl not found at $pgCtl"
  exit 1
}

& $pgCtl -D $dataDir status *> $null
if ($LASTEXITCODE -ne 0) {
  Write-Output "PostgreSQL is already stopped"
  exit 0
}

& $pgCtl -D $dataDir stop -m fast
Write-Output "PostgreSQL stopped"
