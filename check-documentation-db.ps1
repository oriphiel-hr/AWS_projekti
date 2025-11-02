# Provjeri da li su migracije i seed izvršeni

Write-Host "🔍 Provjera statusa dokumentacije u bazi..." -ForegroundColor Cyan
Write-Host ""

Write-Host "📊 GitHub Actions Workflow:" -ForegroundColor Yellow
Write-Host "   Workflow #133: https://github.com/oriphiel/AWS_projekti/actions/runs" -ForegroundColor Gray
Write-Host "   Status: Provjeri da li ima zelenu kvačicu ✅" -ForegroundColor Gray
Write-Host ""

Write-Host "📋 Što provjeriti:" -ForegroundColor Yellow
Write-Host "   1. ✓ Da li je workflow uspješno završio (zelena kvačica)" -ForegroundColor Gray
Write-Host "   2. ✓ Da li su migracije primijenjene (prisma job)" -ForegroundColor Gray
Write-Host "   3. ✓ Da li je seed pokrenut (seed job)" -ForegroundColor Gray
Write-Host "   4. ✓ Da li postoje podaci u bazi" -ForegroundColor Gray
Write-Host ""

Write-Host "🧪 Test API endpointa:" -ForegroundColor Yellow
Write-Host "   curl https://uslugar.oriph.io/api/documentation" -ForegroundColor Gray
Write-Host ""

Write-Host "📊 CloudWatch Logs (ako imaš AWS pristup):" -ForegroundColor Yellow
Write-Host "   /ecs/uslugar/prisma - prisma job logs" -ForegroundColor Gray
Write-Host "   /ecs/uslugar/prisma-seed - seed job logs" -ForegroundColor Gray
Write-Host ""

Write-Host "✅ Ako workflow ima zelenu kvačicu:" -ForegroundColor Green
Write-Host "   → Migracije i seed su uspješno izvršeni!" -ForegroundColor Gray
Write-Host "   → Tablice DocumentationCategory i DocumentationFeature postoje" -ForegroundColor Gray
Write-Host "   → Podaci su seedani" -ForegroundColor Gray
Write-Host "   → Frontend može učitati podatke preko /api/documentation" -ForegroundColor Gray
Write-Host ""

Write-Host "🌐 Test na produkciji:" -ForegroundColor Yellow
Write-Host "   https://uslugar.oriph.io/#documentation" -ForegroundColor Cyan

