# Brzi način da se pokrene Prisma workflow

Write-Host "🚀 Pokretanje Prisma workflow-a..." -ForegroundColor Cyan

# Provjeri status
$changes = git status --porcelain
if ($changes) {
    Write-Host "📝 Postoje promjene, commitam..." -ForegroundColor Yellow
    git add -A
    git commit -m "chore: Trigger Prisma workflow"
}

# Push
Write-Host "📤 Push na main..." -ForegroundColor Yellow
git push origin main

if ($LASTEXITCODE -eq 0) {
    Write-Host "`n✅ Workflow će se pokrenuti automatski!" -ForegroundColor Green
    Write-Host "   Provjeri: https://github.com/oriphiel/AWS_projekti/actions" -ForegroundColor Gray
} else {
    Write-Host "`n❌ Greška. Pokreni ručno:" -ForegroundColor Red
    Write-Host "   https://github.com/oriphiel/AWS_projekti/actions/workflows/prisma-uslugar.yml" -ForegroundColor Yellow
}

