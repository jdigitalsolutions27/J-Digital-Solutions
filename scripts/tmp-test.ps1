& 'C:\Program Files\PostgreSQL\17\bin\pg_ctl.exe' -D 'C:\Program Files\PostgreSQL\17\data' start
Write-Output "AFTER_START"
& 'C:\Program Files\PostgreSQL\17\bin\pg_isready.exe' -h localhost -p 5432
Write-Output "DONE"
