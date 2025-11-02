# PowerShell skripta za pokretanje Prisma workflow-a

Write-Host "🚀 Pokretanje Prisma workflow-a..." -ForegroundColor Cyan
Write-Host ""

# Opcija 1: GitHub CLI
if (Get-Command gh -ErrorAction SilentlyContinue) {
    Write-Host "📦 Koristim GitHub CLI..." -ForegroundColor Yellow
    gh workflow run .github/workflows/prisma-uslugar.yml
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Workflow pokrenut!" -ForegroundColor Green
        Write-Host "   Provjeri: https://github.com/oriphiel/AWS_projekti/actions" -ForegroundColor Gray
        exit 0
    }
}

# Opcija 2: Empty commit da triggeri workflow
Write-Host "📝 Kreiram empty commit da se workflow pokrene..." -ForegroundColor Yellow
git add -A
git commit --allow-empty -m "chore: Trigger Prisma workflow - dokumentacija u bazu"
git push origin main

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "✅ Push uspješan! Workflow će se automatski pokrenuti." -ForegroundColor Green
    Write-Host "   Provjeri: https://github.com/oriphiel/AWS_projekti/actions" -ForegroundColor Gray
} else {
    Write-Host ""
    Write-Host "❌ Greška pri push-u" -ForegroundColor Red
    Write-Host "   Ručno pokreni workflow:" -ForegroundColor Yellow
    Write-Host "   https://github.com/oriphiel/AWS_projekti/actions/workflows/prisma-uslugar.yml" -ForegroundColor Gray
    exit 1
}
