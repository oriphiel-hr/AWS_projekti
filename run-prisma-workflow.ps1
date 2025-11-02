# PowerShell skripta za pokretanje Prisma workflow-a

Write-Host "🚀 Pokretanje Prisma workflow-a..." -ForegroundColor Cyan
Write-Host ""

# Provjeri da li postoje necommited promjene
$status = git status --short
if ($status) {
    Write-Host "📝 Postoje necommited promjene, commitam ih..." -ForegroundColor Yellow
    git add -A
    git commit -m "chore: Trigger Prisma workflow - migracije i seed dokumentacije"
    Write-Host "✅ Promjene commitane" -ForegroundColor Green
} else {
    Write-Host "ℹ️  Nema necommited promjena" -ForegroundColor Gray
}

# Push na main branch
Write-Host ""
Write-Host "📤 Push na main branch..." -ForegroundColor Yellow
$pushResult = git push origin main 2>&1

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Push uspješan!" -ForegroundColor Green
    Write-Host ""
    Write-Host "🔄 GitHub Actions će automatski pokrenuti Prisma workflow" -ForegroundColor Cyan
    Write-Host "   Provjeri status: https://github.com/oriphiel/AWS_projekti/actions" -ForegroundColor Gray
    Write-Host ""
    Write-Host "📋 Workflow će:" -ForegroundColor Yellow
    Write-Host "   1. Buildati Prisma Docker image" -ForegroundColor Gray
    Write-Host "   2. Primijeniti migracije (DocumentationCategory i DocumentationFeature)" -ForegroundColor Gray
    Write-Host "   3. Pokrenuti seed (dodati sve kategorije i features u bazu)" -ForegroundColor Gray
    Write-Host "   4. Dodati statistiku '238 Implementirane funkcionalnosti'" -ForegroundColor Gray
} else {
    Write-Host "❌ Greška pri push-u:" -ForegroundColor Red
    Write-Host $pushResult -ForegroundColor Red
    Write-Host ""
    Write-Host "💡 Alternativa: Ručno pokreni workflow:" -ForegroundColor Yellow
    Write-Host "   https://github.com/oriphiel/AWS_projekti/actions/workflows/prisma-uslugar.yml" -ForegroundColor Gray
    Write-Host "   Klikni 'Run workflow' → 'main' → 'Run workflow'" -ForegroundColor Gray
}

