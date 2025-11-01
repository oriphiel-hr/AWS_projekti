# 🚀 Pokreni Deployment - Sve u jednom
# Pokreni ovu skriptu iz uslugar/ direktorija

$ErrorActionPreference = "Continue"

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  🚀 Uslugar Deployment" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Provjeri trenutni direktorij
$currentDir = Get-Location
Write-Host "📍 Trenutni direktorij: $currentDir" -ForegroundColor Gray
Write-Host ""

# Backend deployment
Write-Host "🔵 Backend Deployment" -ForegroundColor Cyan
Write-Host "====================" -ForegroundColor Cyan
Write-Host ""

$backendScript = Join-Path $currentDir "backend\deploy-manual.ps1"
if (Test-Path $backendScript) {
    Write-Host "✅ Backend script pronađen" -ForegroundColor Green
    Write-Host "📂 Lokacija: $backendScript" -ForegroundColor Gray
    Write-Host ""
    Write-Host "Pokreni ovu komandu:" -ForegroundColor Yellow
    Write-Host "  cd backend" -ForegroundColor Cyan
    Write-Host "  .\deploy-manual.ps1" -ForegroundColor Cyan
    Write-Host ""
} else {
    Write-Host "❌ Backend script nije pronađen!" -ForegroundColor Red
    Write-Host "   Očekivana lokacija: $backendScript" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "🔵 Frontend Build" -ForegroundColor Cyan
Write-Host "=================" -ForegroundColor Cyan
Write-Host ""

$frontendScript = Join-Path $currentDir "frontend\deploy-manual.ps1"
if (Test-Path $frontendScript) {
    Write-Host "✅ Frontend script pronađen" -ForegroundColor Green
    Write-Host "📂 Lokacija: $frontendScript" -ForegroundColor Gray
    Write-Host ""
    Write-Host "Pokreni ovu komandu:" -ForegroundColor Yellow
    Write-Host "  cd frontend" -ForegroundColor Cyan
    Write-Host "  .\deploy-manual.ps1" -ForegroundColor Cyan
    Write-Host ""
} else {
    Write-Host "❌ Frontend script nije pronađen!" -ForegroundColor Red
    Write-Host "   Očekivana lokacija: $frontendScript" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "💡 Preporuka: Koristi GitHub Actions!" -ForegroundColor Yellow
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Backend:  https://github.com/oriphiel-hr/AWS_projekti/actions/workflows/backend-uslugar-ecs.yml" -ForegroundColor Cyan
Write-Host "Frontend: https://github.com/oriphiel-hr/AWS_projekti/actions/workflows/frontend-uslugar.yml" -ForegroundColor Cyan
Write-Host ""

