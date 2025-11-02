# Direktno pokretanje Prisma workflow-a

$ErrorActionPreference = "Continue"

Write-Host "🚀 Pokretanje Prisma workflow-a..." -ForegroundColor Cyan
Write-Host ""

# Provjeri da li postoje promjene
Write-Host "📋 Provjera statusa..." -ForegroundColor Yellow
$status = git status --short 2>&1 | Out-String

if ($status -match '\S') {
    Write-Host "📝 Pronađene promjene, commitam..." -ForegroundColor Yellow
    git add -A 2>&1 | Out-Null
    $commitResult = git commit -m "chore: Trigger Prisma workflow - migracije i seed dokumentacije" 2>&1 | Out-String
    Write-Host $commitResult
} else {
    Write-Host "ℹ️  Nema novih promjena, kreiram empty commit..." -ForegroundColor Gray
    git commit --allow-empty -m "chore: Trigger Prisma workflow" 2>&1 | Out-Null
}

# Push
Write-Host ""
Write-Host "📤 Push na main branch..." -ForegroundColor Yellow
$pushResult = git push origin main 2>&1 | Out-String

if ($LASTEXITCODE -eq 0 -or $pushResult -match "Everything up-to-date") {
    Write-Host "✅ Push uspješan!" -ForegroundColor Green
    Write-Host ""
    Write-Host "🔄 GitHub Actions će automatski pokrenuti Prisma workflow" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "📊 Provjeri status:" -ForegroundColor Yellow
    Write-Host "   https://github.com/oriphiel/AWS_projekti/actions" -ForegroundColor Gray
    Write-Host ""
    Write-Host "📋 Workflow će:" -ForegroundColor Yellow
    Write-Host "   1. ✓ Buildati Prisma Docker image" -ForegroundColor Gray
    Write-Host "   2. ✓ Primijeniti migracije (DocumentationCategory i DocumentationFeature)" -ForegroundColor Gray
    Write-Host "   3. ✓ Pokrenuti seed (dodati sve kategorije i features)" -ForegroundColor Gray
    Write-Host "   4. ✓ Dodati statistiku '238 Implementirane funkcionalnosti'" -ForegroundColor Gray
} else {
    Write-Host "⚠️  Push možda nije uspješan:" -ForegroundColor Yellow
    Write-Host $pushResult -ForegroundColor Gray
    Write-Host ""
    Write-Host "💡 Ručno pokreni workflow:" -ForegroundColor Yellow
    Write-Host "   https://github.com/oriphiel/AWS_projekti/actions/workflows/prisma-uslugar.yml" -ForegroundColor Cyan
    Write-Host "   → Klikni 'Run workflow' → 'main' → 'Run workflow'" -ForegroundColor Gray
}

