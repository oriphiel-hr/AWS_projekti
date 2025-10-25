# USLUGAR - Pokreni SQL migraciju kroz Docker container
# ====================================================

Write-Host "🌱 USLUGAR - Pokreni SQL migraciju kroz Docker container" -ForegroundColor Green
Write-Host "===================================================" -ForegroundColor Green

Write-Host "💡 KORAK 1: Provjeri Docker" -ForegroundColor Yellow
Write-Host "=========================" -ForegroundColor Yellow

# Provjeri da li je Docker pokrenut
try {
    docker --version | Out-Null
    Write-Host "✅ Docker je dostupan" -ForegroundColor Green
} catch {
    Write-Host "❌ Docker nije pokrenut ili nije instaliran" -ForegroundColor Red
    Write-Host "Molimo pokrenite Docker Desktop i pokušajte ponovno" -ForegroundColor Yellow
    exit 1
}

Write-Host "💡 KORAK 2: Pokreni PostgreSQL container s SQL migracijom" -ForegroundColor Yellow
Write-Host "=====================================================" -ForegroundColor Yellow

# Pokreni PostgreSQL container i izvrši SQL migraciju
Write-Host "🐳 Pokretanje PostgreSQL container-a..." -ForegroundColor Yellow

$containerName = "uslugar-sql-migration-$(Get-Date -Format 'yyyyMMdd-HHmmss')"

# Pokreni container s SQL migracijom
docker run --rm --name $containerName `
    -e PGHOST=uslugar-db.cr80o0eeg3gy.eu-north-1.rds.amazonaws.com `
    -e PGPORT=5432 `
    -e PGDATABASE=uslugar `
    -e PGUSER=uslugar_user `
    -e PGPASSWORD=Pastor123 `
    -v "${PWD}/add-categories.sql:/sql/add-categories.sql" `
    postgres:15 `
    psql -h uslugar-db.cr80o0eeg3gy.eu-north-1.rds.amazonaws.com -p 5432 -U uslugar_user -d uslugar -f /sql/add-categories.sql

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ SQL migracija uspješno završena!" -ForegroundColor Green
    Write-Host "🎉 Kategorije su dodane u bazu podataka!" -ForegroundColor Green
    Write-Host "🌐 Provjerite rezultate na https://uslugar.oriph.io" -ForegroundColor Cyan
} else {
    Write-Host "❌ SQL migracija završila s greškom" -ForegroundColor Red
    Write-Host "Provjerite Docker logove za više detalja" -ForegroundColor Yellow
}

Write-Host "🏁 Gotovo!" -ForegroundColor Green
