# Force Backend Redeploy - Finalni korak

Write-Host "🚀 Force Backend Redeploy" -ForegroundColor Cyan
Write-Host ""

# Provjeri git status
Write-Host "📋 Provjera git statusa..." -ForegroundColor Yellow
$status = git status --porcelain 2>&1 | Out-String
if ($status) {
    Write-Host "⚠️  Ima necommited promjena:" -ForegroundColor Yellow
    Write-Host $status -ForegroundColor Gray
}

# Kreiraj marker file za force redeploy
$markerFile = "uslugar/backend/FORCE_REDEPLOY.txt"
$timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
$content = "# Force redeploy trigger - $timestamp`n# Ova datoteka triggeruje backend deployment workflow`n"

Write-Host "📝 Kreiranje marker file..." -ForegroundColor Yellow
Set-Content -Path $markerFile -Value $content -Encoding UTF8

# Git add
Write-Host "➕ Git add..." -ForegroundColor Yellow
git add $markerFile 2>&1 | Out-Null
git add uslugar/backend/src/routes/documentation.js 2>&1 | Out-Null
git add uslugar/backend/src/server.js 2>&1 | Out-Null

# Git commit
Write-Host "💾 Git commit..." -ForegroundColor Yellow
$commitMsg = "chore: Force backend redeploy for documentation route - $timestamp"
git commit -m $commitMsg 2>&1 | Out-String | Out-Null

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Commit kreiran!" -ForegroundColor Green
} else {
    # Možda nema promjena
    Write-Host "ℹ️  Commit možda nije kreiran (nema promjena?)" -ForegroundColor Gray
}

# Git push
Write-Host "📤 Git push na main..." -ForegroundColor Yellow
$pushOutput = git push origin main 2>&1 | Out-String

if ($LASTEXITCODE -eq 0 -or $pushOutput -match "up to date" -or $pushOutput -match "pushed") {
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
    Write-Host "   curl https://uslugar.api.oriph.io/api/documentation" -ForegroundColor Gray
    Write-Host "   curl https://uslugar.oriph.io/api/documentation" -ForegroundColor Gray
} else {
    Write-Host "⚠️  Push možda nije uspješan:" -ForegroundColor Yellow
    Write-Host $pushOutput -ForegroundColor Gray
    Write-Host ""
    Write-Host "💡 Ručno pokreni workflow:" -ForegroundColor Yellow
    Write-Host "   https://github.com/oriphiel/AWS_projekti/actions" -ForegroundColor Cyan
    Write-Host "   → Pronađi 'Backend - Reuse existing Task Definition'" -ForegroundColor Gray
    Write-Host "   → Klikni 'Run workflow'" -ForegroundColor Gray
}

Write-Host ""

