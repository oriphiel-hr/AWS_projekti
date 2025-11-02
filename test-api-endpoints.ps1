# Test API endpoints

Write-Host "🔍 Testiranje API endpointa..." -ForegroundColor Cyan
Write-Host ""

# Test direktnog backend API-ja
Write-Host "1️⃣ Direktni backend API:" -ForegroundColor Yellow
Write-Host "   https://uslugar.api.oriph.io/api/health" -ForegroundColor Gray
try {
    $health = Invoke-RestMethod -Uri "https://uslugar.api.oriph.io/api/health" -Method Get -ErrorAction Stop
    Write-Host "   ✅ Health check OK: $($health | ConvertTo-Json)" -ForegroundColor Green
} catch {
    Write-Host "   ❌ Health check FAILED: $_" -ForegroundColor Red
}

Write-Host ""

# Test documentation endpointa direktno
Write-Host "2️⃣ Dokumentacija endpoint (direktno):" -ForegroundColor Yellow
Write-Host "   https://uslugar.api.oriph.io/api/documentation" -ForegroundColor Gray
try {
    $doc = Invoke-RestMethod -Uri "https://uslugar.api.oriph.io/api/documentation" -Method Get -ErrorAction Stop
    Write-Host "   ✅ Dokumentacija OK: $($doc.features.Count) kategorija" -ForegroundColor Green
    Write-Host "   ✅ Opisi: $($doc.featureDescriptions.Count) opisa" -ForegroundColor Green
} catch {
    Write-Host "   ❌ Dokumentacija FAILED: $_" -ForegroundColor Red
    Write-Host "   Status Code: $($_.Exception.Response.StatusCode.value__)" -ForegroundColor Gray
}

Write-Host ""

# Test kroz frontend Nginx proxy
Write-Host "3️⃣ Kroz Nginx proxy (frontend):" -ForegroundColor Yellow
Write-Host "   https://uslugar.oriph.io/api/documentation" -ForegroundColor Gray
try {
    $docProxy = Invoke-RestMethod -Uri "https://uslugar.oriph.io/api/documentation" -Method Get -ErrorAction Stop
    Write-Host "   ✅ Proxy OK: $($docProxy.features.Count) kategorija" -ForegroundColor Green
} catch {
    Write-Host "   ❌ Proxy FAILED: $_" -ForegroundColor Red
    Write-Host "   Status Code: $($_.Exception.Response.StatusCode.value__)" -ForegroundColor Gray
}

Write-Host ""
Write-Host "📊 Sažetak:" -ForegroundColor Cyan
Write-Host "   - Ako direktni backend radi → problem je u Nginx proxy konfiguraciji" -ForegroundColor Gray
Write-Host "   - Ako direktni backend NE radi → backend nije deployan s novim kodom" -ForegroundColor Gray
Write-Host "   - Pokreni backend deployment workflow ako treba!" -ForegroundColor Yellow

