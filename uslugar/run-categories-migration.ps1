# USLUGAR - Pokretanje migracije kategorija kroz API
# ===================================================

Write-Host "🌱 USLUGAR - Pokretanje migracije kategorija" -ForegroundColor Green
Write-Host "=============================================" -ForegroundColor Green

# API endpoint za migraciju
$apiUrl = "https://uslugar.api.oriph.io/api/admin/seed-categories"

Write-Host "🚀 Pokretanje migracije preko API-ja..." -ForegroundColor Yellow
Write-Host "📡 API URL: $apiUrl" -ForegroundColor Cyan

try {
    # Pokreni migraciju
    $response = Invoke-RestMethod -Uri $apiUrl -Method POST -ContentType "application/json" -TimeoutSec 300
    
    Write-Host "✅ Migracija uspješno pokrenuta!" -ForegroundColor Green
    Write-Host "📊 Rezultat:" -ForegroundColor Cyan
    Write-Host "➕ Dodano: $($response.addedCount) kategorija" -ForegroundColor Green
    Write-Host "✅ Ažurirano: $($response.updatedCount) kategorija" -ForegroundColor Green
    Write-Host "📋 Ukupno: $($response.totalCount) kategorija" -ForegroundColor Green
    
} catch {
    Write-Host "❌ Greška pri pokretanju migracije:" -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
    
    # Pokušaj alternativni pristup - direktno kroz curl
    Write-Host "🔄 Pokušavam alternativni pristup..." -ForegroundColor Yellow
    
    try {
        $curlResponse = curl -X POST $apiUrl -H "Content-Type: application/json" -d "{}" 2>$null
        Write-Host "✅ Alternativni pristup uspješan!" -ForegroundColor Green
        Write-Host $curlResponse -ForegroundColor Cyan
    } catch {
        Write-Host "❌ Alternativni pristup također ne radi" -ForegroundColor Red
    }
}

Write-Host "🏁 Gotovo!" -ForegroundColor Green
