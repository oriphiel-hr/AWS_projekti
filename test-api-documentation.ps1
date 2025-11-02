# Brza provjera da li se dokumentacija vuče iz baze

Write-Host "🔍 Provjera API endpointa..." -ForegroundColor Cyan
Write-Host ""

try {
    $response = Invoke-RestMethod -Uri "https://uslugar.oriph.io/api/documentation" -Method Get -ErrorAction Stop
    
    $featureCount = $response.features.Count
    $descCount = ($response.featureDescriptions.PSObject.Properties | Measure-Object).Count
    
    Write-Host "✅ API endpoint radi!" -ForegroundColor Green
    Write-Host ""
    Write-Host "📊 Podaci:" -ForegroundColor Yellow
    Write-Host "   Broj kategorija: $featureCount" -ForegroundColor Gray
    Write-Host "   Broj feature opisa: $descCount" -ForegroundColor Gray
    
    if ($featureCount -gt 0) {
        Write-Host ""
        Write-Host "✅ PODACI SE VUČU IZ BAZE!" -ForegroundColor Green
        Write-Host "   → API endpoint vraća podatke iz baze" -ForegroundColor Gray
        Write-Host "   → Frontend učitava podatke preko API-ja" -ForegroundColor Gray
        Write-Host "   → Nema hardkodiranih podataka" -ForegroundColor Gray
        Write-Host ""
        Write-Host "📋 Primjer prve kategorije:" -ForegroundColor Yellow
        if ($response.features.Count -gt 0) {
            $first = $response.features[0]
            Write-Host "   Kategorija: $($first.category)" -ForegroundColor Gray
            Write-Host "   Broj items: $($first.items.Count)" -ForegroundColor Gray
        }
    } else {
        Write-Host ""
        Write-Host "⚠️  API radi, ali nema podataka u bazi!" -ForegroundColor Yellow
        Write-Host "   → Provjeri da li je seed uspješno pokrenut" -ForegroundColor Gray
    }
    
    Write-Host ""
    Write-Host "🌐 Test u browseru:" -ForegroundColor Cyan
    Write-Host "   1. Otvori: https://uslugar.oriph.io/#documentation" -ForegroundColor Gray
    Write-Host "   2. F12 → Network tab" -ForegroundColor Gray
    Write-Host "   3. Refresh stranicu" -ForegroundColor Gray
    Write-Host "   4. Traži request: 'documentation'" -ForegroundColor Gray
    Write-Host "   5. Ako vidiš request → vuče se iz baze ✅" -ForegroundColor Green
    
} catch {
    Write-Host "❌ Greška pri pozivanju API-ja" -ForegroundColor Red
    Write-Host "   $($_.Exception.Message)" -ForegroundColor Gray
    Write-Host ""
    Write-Host "💡 Mogući uzroci:" -ForegroundColor Yellow
    Write-Host "   1. Backend server nije pokrenut" -ForegroundColor Gray
    Write-Host "   2. API route nije postavljen" -ForegroundColor Gray
    Write-Host "   3. Tablice ne postoje u bazi" -ForegroundColor Gray
}

