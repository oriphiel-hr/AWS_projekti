# Simple Deployment Script - Pokreni direktno u PowerShell
Set-Location C:\GIT_PROJEKTI\AWS\AWS_projekti

Write-Host "🚀 Deploying technicalDetails..." -ForegroundColor Cyan

# Add file
git add uslugar/backend/prisma/seeds/seed-documentation.js

# Commit
git commit -m "feat: Dodani technicalDetails za sve javne funkcionalnosti u seed-documentation.js"

# Push
git push origin main

Write-Host "`n✅ Push completed!" -ForegroundColor Green
Write-Host "`n⏳ Prisma workflow should auto-trigger..." -ForegroundColor Yellow
Write-Host "   Check: https://github.com/oriphiel/AWS_projekti/actions/workflows/prisma-uslugar.yml" -ForegroundColor Cyan

# Pokušaj pokrenuti ručno ako GitHub CLI postoji
try {
    gh workflow run prisma-uslugar.yml
    Write-Host "✅ Workflow triggered via GitHub CLI!" -ForegroundColor Green
} catch {
    Write-Host "ℹ️  GitHub CLI not available. Workflow will auto-trigger on push." -ForegroundColor Yellow
}

Write-Host "`n✨ Done! Wait ~5 minutes for workflow to complete." -ForegroundColor Green

