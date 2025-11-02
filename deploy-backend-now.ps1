# Backend deployment script

Write-Host "🚀 Backend Deployment za Documentation Route" -ForegroundColor Cyan
Write-Host ""

# Provjeri status
$status = git status --porcelain
if ($status) {
    Write-Host "📝 Postoje necommited promjene:" -ForegroundColor Yellow
    Write-Host $status -ForegroundColor Gray
    Write-Host ""
    
    Write-Host "➕ Dodajem promjene..." -ForegroundColor Yellow
    git add uslugar/backend/src/routes/documentation.js
    git add uslugar/backend/src/server.js
    
    Write-Host "💾 Commitam..." -ForegroundColor Yellow
    git commit -m "feat: Deploy documentation API route - dodana podrška za čitanje iz baze"
} else {
    Write-Host "ℹ️  Nema necommited promjena" -ForegroundColor Gray
}

Write-Host ""
Write-Host "📤 Push na main branch..." -ForegroundColor Yellow
$pushOutput = git push origin main 2>&1 | Out-String

if ($LASTEXITCODE -eq 0 -or $pushOutput -match "up to date" -or $pushOutput -match "pushed") {
    Write-Host "✅ Push uspješan!" -ForegroundColor Green
    Write-Host ""
    Write-Host "🔄 Backend deployment workflow će se automatski pokrenuti" -ForegroundColor Cyan
    Write-Host "   (zbog promjena u uslugar/backend/**)" -ForegroundColor Gray
    Write-Host ""
    Write-Host "📊 Provjeri status:" -ForegroundColor Yellow
    Write-Host "   https://github.com/oriphiel/AWS_projekti/actions" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "🔍 Traži:" -ForegroundColor Yellow
    Write-Host "   'Backend - Reuse existing Task Definition (ECR→ECS)'" -ForegroundColor Gray
    Write-Host ""
    Write-Host "⏱️  Vrijeme deploymenta: ~7-10 minuta" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "✅ Nakon deploymenta testiraj:" -ForegroundColor Green
    Write-Host "   curl https://uslugar.oriph.io/api/documentation" -ForegroundColor Gray
} else {
    Write-Host "⚠️  Push možda nije uspješan:" -ForegroundColor Yellow
    Write-Host $pushOutput -ForegroundColor Gray
    Write-Host ""
    Write-Host "💡 Ručno pokreni workflow:" -ForegroundColor Yellow
    Write-Host "   https://github.com/oriphiel/AWS_projekti/actions/workflows/backend-uslugar-ecs.yml" -ForegroundColor Cyan
    Write-Host "   → Klikni 'Run workflow' → 'main' → 'Run workflow'" -ForegroundColor Gray
}

