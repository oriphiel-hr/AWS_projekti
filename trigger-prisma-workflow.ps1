# Trigger Prisma Workflow za technicalDetails
Write-Host "🚀 Triggering Prisma Workflow..." -ForegroundColor Cyan

Set-Location C:\GIT_PROJEKTI\AWS\AWS_projekti

# Provjeri da li seed-documentation.js ima promjene
Write-Host "`n📋 Checking for changes in seed-documentation.js..." -ForegroundColor Yellow
$hasChanges = git diff HEAD -- uslugar/backend/prisma/seeds/seed-documentation.js

if ($hasChanges) {
    Write-Host "✅ Changes found, committing..." -ForegroundColor Green
    git add uslugar/backend/prisma/seeds/seed-documentation.js
    git commit -m "feat: Dodani technicalDetails za sve javne funkcionalnosti u seed-documentation.js"
    git push origin main
    Write-Host "✅ Pushed! Workflow should auto-trigger." -ForegroundColor Green
} else {
    Write-Host "ℹ️  No changes in seed-documentation.js (already committed)" -ForegroundColor Cyan
    Write-Host "   Triggering workflow manually..." -ForegroundColor Yellow
}

# Pokušaj pokrenuti workflow ručno
if (Get-Command gh -ErrorAction SilentlyContinue) {
    Write-Host "`n🎯 Triggering workflow via GitHub CLI..." -ForegroundColor Yellow
    gh workflow run prisma-uslugar.yml
    Write-Host "✅ Workflow triggered!" -ForegroundColor Green
} else {
    Write-Host "`n⚠️  GitHub CLI not found." -ForegroundColor Yellow
    Write-Host "   Please manually trigger workflow:" -ForegroundColor White
    Write-Host "   https://github.com/oriphiel/AWS_projekti/actions/workflows/prisma-uslugar.yml" -ForegroundColor Cyan
}

Write-Host "`n✨ Done! Check workflow status at:" -ForegroundColor Green
Write-Host "   https://github.com/oriphiel/AWS_projekti/actions/workflows/prisma-uslugar.yml" -ForegroundColor Cyan
