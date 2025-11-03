# Quick Prisma Deployment Trigger
Set-Location C:\GIT_PROJEKTI\AWS\AWS_projekti

Write-Host "🚀 Deploying technicalDetails..." -ForegroundColor Cyan

# Add, commit, push
Write-Host "`n📝 Committing changes..." -ForegroundColor Yellow
git add uslugar/backend/prisma/seeds/seed-documentation.js 2>&1
git commit -m "feat: Dodani technicalDetails za sve javne funkcionalnosti" 2>&1
git push origin main 2>&1

Write-Host "`n✅ Push completed!" -ForegroundColor Green
Write-Host "`n⏳ Prisma workflow should auto-trigger..." -ForegroundColor Yellow
Write-Host "   Check: https://github.com/oriphiel/AWS_projekti/actions/workflows/prisma-uslugar.yml" -ForegroundColor Cyan

# Pokreni ručno ako GitHub CLI postoji
if (Get-Command gh -ErrorAction SilentlyContinue) {
    Write-Host "`n🎯 Manually triggering workflow..." -ForegroundColor Yellow
    gh workflow run prisma-uslugar.yml 2>&1
}

