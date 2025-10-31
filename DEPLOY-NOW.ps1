# Quick Deployment Script - SMS Verification Fix
# Pokrenite ovu skriptu za kompletan deployment

$ErrorActionPreference = "Continue"

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  SMS Verification Fix - Deployment" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Frontend Build
Write-Host "📦 Step 1: Frontend Build..." -ForegroundColor Yellow
Set-Location "uslugar\frontend"
npm run build
if ($LASTEXITCODE -eq 0) {
    Write-Host "  ✅ Frontend build uspješan" -ForegroundColor Green
} else {
    Write-Host "  ❌ Frontend build neuspješan" -ForegroundColor Red
    exit 1
}

# Backend Deployment
Write-Host "`n🚀 Step 2: Backend Deployment..." -ForegroundColor Yellow
Set-Location "..\backend"
& ".\deploy-sms-verification-fix.ps1"
if ($LASTEXITCODE -eq 0) {
    Write-Host "  ✅ Backend deployment uspješan" -ForegroundColor Green
} else {
    Write-Host "  ❌ Backend deployment neuspješan" -ForegroundColor Red
    exit 1
}

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "  ✅ Deployment završen!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "📋 Sljedeći koraci:" -ForegroundColor Yellow
Write-Host "  1. Upload frontend/dist/ na FTP server" -ForegroundColor White
Write-Host "  2. Provjerite backend logove u CloudWatch" -ForegroundColor White
Write-Host "  3. Testirajte SMS verifikaciju" -ForegroundColor White
Write-Host ""

