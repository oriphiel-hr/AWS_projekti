# Deploy SMS Logs Feature
Set-Location C:\GIT_PROJEKTI\AWS\AWS_projekti

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  DEPLOY: SMS Logs Admin Feature" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Add all changes
Write-Host "[1/3] Adding files..." -ForegroundColor Yellow
git add . 2>&1 | Out-Host

# Commit
Write-Host "`n[2/3] Committing..." -ForegroundColor Yellow
git commit -m "feat: Dodan admin pregled SMS logova s automatskim logiranjem u bazu" 2>&1 | Out-Host

# Push
Write-Host "`n[3/3] Pushing to origin/main..." -ForegroundColor Yellow
git push origin main 2>&1 | Out-Host

Write-Host "`n========================================" -ForegroundColor Green
Write-Host "  ✅ DONE!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "Feature: Admin SMS Logs" -ForegroundColor Yellow
Write-Host "  - Database: SmsLog model" -ForegroundColor Gray
Write-Host "  - Backend: Admin endpoints + SMS logging" -ForegroundColor Gray
Write-Host "  - Frontend: AdminSmsLogs page" -ForegroundColor Gray
Write-Host "  - Documentation: Updated" -ForegroundColor Gray
Write-Host ""
Write-Host "Workflows will auto-trigger:" -ForegroundColor Yellow
Write-Host "  - Prisma: uslugar/backend/prisma/** changes" -ForegroundColor Gray
Write-Host "  - Backend: uslugar/backend/** changes" -ForegroundColor Gray
Write-Host "  - Frontend: uslugar/frontend/** changes" -ForegroundColor Gray
Write-Host ""

