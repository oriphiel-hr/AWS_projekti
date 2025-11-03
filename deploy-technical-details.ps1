# Deploy Technical Details - Prisma Seed Workflow
Write-Host "🚀 Deploying technicalDetails updates..." -ForegroundColor Cyan

# Provjeri git status
Write-Host "`n📋 Checking git status..." -ForegroundColor Yellow
git status

# Add file ako nije staged
Write-Host "`n➕ Staging seed-documentation.js..." -ForegroundColor Yellow
git add uslugar/backend/prisma/seeds/seed-documentation.js

# Commit ako ima promjena
Write-Host "`n💾 Committing changes..." -ForegroundColor Yellow
git commit -m "feat: Dodani technicalDetails za sve javne funkcionalnosti u seed-documentation.js" || Write-Host "No changes to commit or already committed" -ForegroundColor Gray

# Push na main
Write-Host "`n📤 Pushing to origin/main..." -ForegroundColor Yellow
git push origin main

# Provjeri da li postoji GitHub CLI
if (Get-Command gh -ErrorAction SilentlyContinue) {
    Write-Host "`n🎯 Triggering Prisma workflow via GitHub CLI..." -ForegroundColor Yellow
    gh workflow run prisma-uslugar.yml
    Write-Host "✅ Workflow triggered! Check: https://github.com/oriphiel/AWS_projekti/actions/workflows/prisma-uslugar.yml" -ForegroundColor Green
} else {
    Write-Host "`n⚠️  GitHub CLI not found. Please manually trigger workflow:" -ForegroundColor Yellow
    Write-Host "   https://github.com/oriphiel/AWS_projekti/actions/workflows/prisma-uslugar.yml" -ForegroundColor Cyan
}

Write-Host "`n✨ Deployment initiated!" -ForegroundColor Green
Write-Host "   Wait for Prisma workflow to complete (~4-5 minutes)" -ForegroundColor Gray
Write-Host "   Then backend will have updated documentation with technicalDetails" -ForegroundColor Gray

