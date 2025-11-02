# Trigger Prisma i Backend Workflows - FINALNO RJEŠENJE

Write-Host "🚀 Trigger Workflows za Dokumentaciju Route" -ForegroundColor Cyan
Write-Host ""

# Provjeri da li route postoji
if (-not (Test-Path "uslugar/backend/src/routes/documentation.js")) {
    Write-Host "❌ Route ne postoji!" -ForegroundColor Red
    exit 1
}
Write-Host "✅ Route postoji: uslugar/backend/src/routes/documentation.js" -ForegroundColor Green

# Provjeri da li je u server.js
$serverContent = Get-Content "uslugar/backend/src/server.js" -Raw
if ($serverContent -notmatch "documentationRouter") {
    Write-Host "❌ Route nije registriran u server.js!" -ForegroundColor Red
    exit 1
}
Write-Host "✅ Route je registriran u server.js" -ForegroundColor Green

# Kreiraj trigger file
$timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
$triggerFile = "uslugar/backend/WORKFLOW_TRIGGER_$(Get-Date -Format 'yyyyMMddHHmmss').txt"
$content = @"
# Workflow Trigger - $timestamp
# Ovaj file triggeruje:
# 1. Prisma workflow (migracije + seed) - jer promjena u backend/**
# 2. Backend workflow (deployment) - jer promjena u uslugar/backend/**
"@

Write-Host "📝 Kreiranje trigger file-a..." -ForegroundColor Yellow
Set-Content -Path $triggerFile -Value $content -Encoding UTF8
Write-Host "✅ File kreiran: $triggerFile" -ForegroundColor Green

# Git add
Write-Host "➕ Git add..." -ForegroundColor Yellow
git add $triggerFile 2>&1 | Out-Null
git add uslugar/backend/src/routes/documentation.js 2>&1 | Out-Null
git add uslugar/backend/src/server.js 2>&1 | Out-Null

# Git commit
Write-Host "💾 Git commit..." -ForegroundColor Yellow
$commitMsg = "chore: Trigger workflows for documentation route - $timestamp"
$commitResult = git commit -m $commitMsg 2>&1

if ($LASTEXITCODE -eq 0 -or $commitResult -match "nothing to commit") {
    if ($commitResult -match "nothing to commit") {
        Write-Host "ℹ️  Nema promjena za commit (već su commitane)" -ForegroundColor Gray
    } else {
        Write-Host "✅ Commit kreiran!" -ForegroundColor Green
    }
} else {
    Write-Host "⚠️  Commit možda nije uspješan:" -ForegroundColor Yellow
    Write-Host $commitResult -ForegroundColor Gray
}

# Git push
Write-Host "📤 Git push na main..." -ForegroundColor Yellow
$pushResult = git push origin main 2>&1 | Out-String

if ($LASTEXITCODE -eq 0 -or $pushResult -match "up to date" -or $pushResult -match "pushed") {
    Write-Host "✅ Push uspješan!" -ForegroundColor Green
    Write-Host ""
    Write-Host "🔄 Workflow-i će se automatski pokrenuti:" -ForegroundColor Cyan
    Write-Host "   1. Prisma workflow (migracije + seed)" -ForegroundColor Gray
    Write-Host "   2. Backend workflow (deployment)" -ForegroundColor Gray
    Write-Host ""
    Write-Host "📊 Provjeri status:" -ForegroundColor Yellow
    Write-Host "   Prisma: https://github.com/oriphiel/AWS_projekti/actions/workflows/prisma-uslugar.yml" -ForegroundColor Cyan
    Write-Host "   Backend: https://github.com/oriphiel/AWS_projekti/actions/workflows/backend-uslugar-ecs.yml" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "⏱️  Timeline:" -ForegroundColor Yellow
    Write-Host "   Prisma workflow: ~5-7 minuta" -ForegroundColor Gray
    Write-Host "   Backend workflow: ~8-12 minuta" -ForegroundColor Gray
    Write-Host "   Ukupno: ~15 minuta" -ForegroundColor Gray
    Write-Host ""
    Write-Host "✅ Nakon deploymenta testiraj:" -ForegroundColor Green
    Write-Host "   curl https://uslugar.api.oriph.io/api/documentation" -ForegroundColor Gray
    Write-Host "   curl https://uslugar.oriph.io/api/documentation" -ForegroundColor Gray
} else {
    Write-Host "⚠️  Push možda nije uspješan:" -ForegroundColor Yellow
    Write-Host $pushResult -ForegroundColor Gray
    Write-Host ""
    Write-Host "💡 Ručno pokreni workflow-e:" -ForegroundColor Yellow
    Write-Host "   https://github.com/oriphiel/AWS_projekti/actions" -ForegroundColor Cyan
}

Write-Host ""

