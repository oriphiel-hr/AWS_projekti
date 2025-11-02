# PowerShell skripta za commit i push dokumentacije

Write-Host "🚀 Pokretanje git commit i push..." -ForegroundColor Cyan
Write-Host ""

# Promijeni u backend direktorij
Set-Location "C:\GIT_PROJEKTI\AWS\AWS_projekti"

# Provjeri status
Write-Host "📋 Git status:" -ForegroundColor Yellow
git status --short

Write-Host ""
Write-Host "➕ Dodajem sve promjene..." -ForegroundColor Yellow
git add -A

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Promjene dodane" -ForegroundColor Green
} else {
    Write-Host "❌ Greška pri dodavanju promjena" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "📝 Commit promjena..." -ForegroundColor Yellow
git commit -m "feat: Migracija dokumentacije u bazu podataka - integrirano u Prisma seed workflow

- Dodani Prisma modeli (DocumentationCategory, DocumentationFeature)
- Backend route /api/documentation za dohvat podataka
- Frontend refaktoriran da koristi API umjesto hardkodiranih podataka
- Seed skripta integrirana u glavni Prisma seed workflow
- Ekstrakt skripta za automatsko generiranje seed fajla
- Dodana Prisma seed konfiguracija u package.json"

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Commit uspješan" -ForegroundColor Green
} else {
    Write-Host "⚠️  Commit možda nije potreban (nema promjena) ili je već napravljen" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "⬆️  Push na remote..." -ForegroundColor Yellow
git push

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "✅ Uspješno pushano!" -ForegroundColor Green
} else {
    Write-Host ""
    Write-Host "❌ Greška pri push-u" -ForegroundColor Red
    Write-Host "Provjeri da li imaš postavljen remote i permisije" -ForegroundColor Yellow
    exit 1
}

Write-Host ""
Write-Host "🎉 Gotovo!" -ForegroundColor Green

