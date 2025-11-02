# Provjera da li je workflow #133 uspješno završio

Write-Host "🔍 Provjera statusa workflow-a #133..." -ForegroundColor Cyan
Write-Host ""

Write-Host "📊 GitHub Actions:" -ForegroundColor Yellow
Write-Host "   Workflow run: #133" -ForegroundColor Gray
Write-Host "   Commit: 91a191f (refactor: Uklonjeni hardkodirani podaci...)" -ForegroundColor Gray
Write-Host "   Trajanje: 4m 7s" -ForegroundColor Gray
Write-Host "   Status: Provjeri da li ima zelenu kvačicu ✅" -ForegroundColor Gray
Write-Host ""

Write-Host "🧪 Provjera da li API endpoint vraća podatke..." -ForegroundColor Yellow

try {
    $response = Invoke-RestMethod -Uri "https://uslugar.oriph.io/api/documentation" -Method Get -ErrorAction Stop
    $featureCount = $response.features.Count
    $descCount = ($response.featureDescriptions.PSObject.Properties | Measure-Object).Count
    
    Write-Host "✅ API endpoint radi!" -ForegroundColor Green
    Write-Host "   Broj kategorija: $featureCount" -ForegroundColor Gray
    Write-Host "   Broj feature opisa: $descCount" -ForegroundColor Gray
    
    if ($featureCount -gt 0) {
        Write-Host ""
        Write-Host "✅ PODACI SU U BAZI!" -ForegroundColor Green
        Write-Host "   → Migracije su uspješno primijenjene" -ForegroundColor Gray
        Write-Host "   → Seed je uspješno pokrenut" -ForegroundColor Gray
        Write-Host "   → Tablice DocumentationCategory i DocumentationFeature postoje" -ForegroundColor Gray
        Write-Host ""
        Write-Host "🌐 Frontend može učitati podatke:" -ForegroundColor Cyan
        Write-Host "   https://uslugar.oriph.io/#documentation" -ForegroundColor Yellow
    } else {
        Write-Host ""
        Write-Host "⚠️  API radi, ali nema podataka!" -ForegroundColor Yellow
        Write-Host "   → Možda seed nije uspješno pokrenut" -ForegroundColor Gray
        Write-Host "   → Provjeri CloudWatch logs za seed job" -ForegroundColor Gray
    }
} catch {
    Write-Host "❌ API endpoint ne radi ili vraća grešku" -ForegroundColor Red
    Write-Host "   Greška: $($_.Exception.Message)" -ForegroundColor Gray
    Write-Host ""
    Write-Host "💡 Mogući uzroci:" -ForegroundColor Yellow
    Write-Host "   1. Backend server nije pokrenut" -ForegroundColor Gray
    Write-Host "   2. Tablice još nisu kreirane (migracije nisu primijenjene)" -ForegroundColor Gray
    Write-Host "   3. Podaci nisu seedani" -ForegroundColor Gray
    Write-Host ""
    Write-Host "📊 Provjeri GitHub Actions logs:" -ForegroundColor Yellow
    Write-Host "   https://github.com/oriphiel/AWS_projekti/actions/runs" -ForegroundColor Cyan
}

Write-Host ""
Write-Host "📋 CloudWatch Logs:" -ForegroundColor Yellow
Write-Host "   Prisma job: /ecs/uslugar/prisma" -ForegroundColor Gray
Write-Host "   Seed job: /ecs/uslugar/prisma (stream-prefix: seed)" -ForegroundColor Gray

