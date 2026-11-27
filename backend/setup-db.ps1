# PostgreSQL Database Setup Script
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "PostgreSQL Database Setup for OsiedleL" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

$env:PGPASSWORD = "postgres"
$psqlPath = "C:\Program Files\PostgreSQL\17\bin\psql.exe"

Write-Host "Step 1: Creating database 'osiedlel'..." -ForegroundColor Yellow
& $psqlPath -U postgres -c "CREATE DATABASE osiedlel;" 2>&1 | Out-Null
if ($LASTEXITCODE -eq 0) {
    Write-Host "✓ Database created successfully!" -ForegroundColor Green
} else {
    Write-Host "! Database might already exist (this is OK)" -ForegroundColor Yellow
}
Write-Host ""

Write-Host "Step 2: Running database schema..." -ForegroundColor Yellow
& $psqlPath -U postgres -d osiedlel -f "database\schema.sql"
if ($LASTEXITCODE -eq 0) {
    Write-Host "✓ Schema applied successfully!" -ForegroundColor Green
} else {
    Write-Host "✗ Error running schema" -ForegroundColor Red
    exit 1
}
Write-Host ""

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Database setup completed successfully!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "You can now restart your backend server." -ForegroundColor White
Write-Host "The database connection should work now." -ForegroundColor White
Write-Host ""

$env:PGPASSWORD = $null
