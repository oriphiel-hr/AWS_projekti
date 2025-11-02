# Pokretanje backend deploymenta za documentation route

Write-Host "🚀 Pokretanje backend deploymenta..." -ForegroundColor Cyan
Write-Host ""

# Provjeri da li je documentation route commitan
$docRoute = git log --oneline -- "uslugar/backend/src/routes/documentation.js" -1
if ($docRoute) {
    Write-Host "✅ Documentation route je commitan" -ForegroundColor Green
    Write-Host "   $docRoute" -ForegroundColor Gray
} else {
    Write-Host "⚠️  Documentation route nije commitan" -ForegroundColor Yellow
    Write-Host "   Commitam promjene..." -ForegroundColor Yellow
    git add uslugar/backend/src/routes/documentation.js
    git add uslugar/backend/src/server.js
    git commit -m "feat: Add documentation API route"
}

# Provjeri da li je server.js ažuriran
$serverCheck = git log --oneline -- "uslugar/backend/src/server.js" -1 | Select-String "documentation"
if ($serverCheck) {
    Write-Host "✅ server.js ima documentation route" -ForegroundColor Green
} else {
    Write-Host "⚠️  server.js možda nije ažuriran" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "📤 Push na main branch..." -ForegroundColor Yellow
git push origin main

Write-Host ""
Write-Host "🔄 GitHub Actions će automatski pokrenuti backend deployment" -ForegroundColor Cyan
Write-Host ""
Write-Host "📊 Provjeri status:" -ForegroundColor Yellow
Write-Host "   https://github.com/oriphiel/AWS_projekti/actions" -ForegroundColor Gray
Write-Host ""
Write-Host "🔍 Traži workflow:" -ForegroundColor Yellow
Write-Host "   'Backend - Reuse existing Task Definition (ECR→ECS)'" -ForegroundColor Gray
Write-Host ""
Write-Host "⏱️  Nakon deploymenta (5-10 minuta):" -ForegroundColor Yellow
Write-Host "   Test: curl https://uslugar.oriph.io/api/documentation" -ForegroundColor Gray

