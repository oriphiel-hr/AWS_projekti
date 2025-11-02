# Finalni backend deployment

Write-Host "🚀 Backend Deployment - Finalni korak" -ForegroundColor Cyan
Write-Host ""

# Provjeri da li ima promjena
Write-Host "📋 Provjera statusa..." -ForegroundColor Yellow
$status = git status --porcelain 2>&1 | Out-String

if ($status -match 'M\s+uslugar/backend/src/routes/documentation.js') {
    Write-Host "📝 Pronađene promjene u documentation.js, commitam..." -ForegroundColor Yellow
    git add uslugar/backend/src/routes/documentation.js
    git commit -m "fix: Add graceful error handling for missing DocumentationCategory tables"
    Write-Host "✅ Commit kreiran" -ForegroundColor Green
} else {
    Write-Host "ℹ️  Nema necommited promjena u documentation.js" -ForegroundColor Gray
    
    # Provjeri da li je već commitano
    $lastCommit = git log --oneline -1 -- "uslugar/backend/src/routes/documentation.js" 2>&1 | Out-String
    if ($lastCommit) {
        Write-Host "✅ Route je već commitan:" -ForegroundColor Green
        Write-Host "   $lastCommit" -ForegroundColor Gray
    } else {
        Write-Host "⚠️  Route nije commitan, commitam..." -ForegroundColor Yellow
        git add uslugar/backend/src/routes/documentation.js
        git commit -m "fix: Add graceful error handling for missing DocumentationCategory tables"
    }
}

Write-Host ""
Write-Host "📤 Push na main branch..." -ForegroundColor Yellow
$pushResult = git push origin main 2>&1 | Out-String

if ($LASTEXITCODE -eq 0 -or $pushResult -match "up to date" -or $pushResult -match "pushed") {
    Write-Host "✅ Push uspješan!" -ForegroundColor Green
    Write-Host ""
    Write-Host "🔄 Backend workflow će se automatski pokrenuti" -ForegroundColor Cyan
    Write-Host "   (trigger: promjene u uslugar/backend/**)" -ForegroundColor Gray
    Write-Host ""
    Write-Host "📊 Provjeri status:" -ForegroundColor Yellow
    Write-Host "   https://github.com/oriphiel/AWS_projekti/actions" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "🔍 Traži workflow:" -ForegroundColor Yellow
    Write-Host "   'Backend - Reuse existing Task Definition (ECR→ECS)'" -ForegroundColor Gray
    Write-Host ""
    Write-Host "⏱️  Čekaj ~8-12 minuta za deployment" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "✅ Nakon deploymenta testiraj:" -ForegroundColor Green
    Write-Host "   curl https://uslugar.oriph.io/api/documentation" -ForegroundColor Gray
} else {
    Write-Host "⚠️  Push možda nije uspješan:" -ForegroundColor Yellow
    Write-Host $pushResult -ForegroundColor Gray
    Write-Host ""
    Write-Host "💡 Ručno pokreni workflow:" -ForegroundColor Yellow
    Write-Host "   https://github.com/oriphiel/AWS_projekti/actions" -ForegroundColor Cyan
    Write-Host "   → Pronađi 'Backend - Reuse existing Task Definition'" -ForegroundColor Gray
    Write-Host "   → Klikni 'Run workflow'" -ForegroundColor Gray
}

