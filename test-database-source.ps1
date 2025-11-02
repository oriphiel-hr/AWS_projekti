# Test: Provjeri da se podaci vade iz baze

Write-Host "🔍 Provjera: Da li se podaci vade iz baze?" -ForegroundColor Cyan
Write-Host ""

# Test 1: Direktni API poziv
Write-Host "1️⃣ Test API endpointa..." -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri "https://uslugar.api.oriph.io/api/documentation" -TimeoutSec 10
    
    Write-Host "   ✅ API radi!" -ForegroundColor Green
    Write-Host "   📊 Kategorija: $($response.features.Count)" -ForegroundColor Gray
    Write-Host "   📊 Opisi: $($response.featureDescriptions.Count)" -ForegroundColor Gray
    
    if ($response.features.Count -gt 0) {
        Write-Host "   ✅ PODACI SE VUČU IZ BAZE!" -ForegroundColor Green
        Write-Host "   📝 Prva kategorija: $($response.features[0].category)" -ForegroundColor Gray
    } else {
        Write-Host "   ⚠️  API vraća prazne podatke" -ForegroundColor Yellow
    }
} catch {
    Write-Host "   ❌ API ne radi: $_" -ForegroundColor Red
}

Write-Host ""

# Test 2: Provjeri kod
Write-Host "2️⃣ Provjera koda..." -ForegroundColor Yellow
$docFile = "uslugar/frontend/src/pages/Documentation.jsx"
if (Test-Path $docFile) {
    $content = Get-Content $docFile -Raw
    
    if ($content -match "api\.get\('/documentation'\)") {
        Write-Host "   ✅ Dokumentacija koristi API poziv!" -ForegroundColor Green
    } else {
        Write-Host "   ❌ Dokumentacija NE koristi API poziv" -ForegroundColor Red
    }
    
    if ($content -match "_hardcodedFeatures") {
        Write-Host "   ⚠️  Kod sadrži hardkodirane podatke!" -ForegroundColor Yellow
    } else {
        Write-Host "   ✅ Kod NE sadrži hardkodirane podatke" -ForegroundColor Green
    }
    
    if ($content -match "fallbackFeatureDescriptions") {
        Write-Host "   ⚠️  Kod sadrži fallback podatke!" -ForegroundColor Yellow
    } else {
        Write-Host "   ✅ Kod NE sadrži fallback podatke" -ForegroundColor Green
    }
} else {
    Write-Host "   ❌ Documentation.jsx nije pronađen" -ForegroundColor Red
}

Write-Host ""

# Test 3: Backend route
Write-Host "3️⃣ Provjera backend route-a..." -ForegroundColor Yellow
$routeFile = "uslugar/backend/src/routes/documentation.js"
if (Test-Path $routeFile) {
    $content = Get-Content $routeFile -Raw
    
    if ($content -match "prisma\.documentationCategory") {
        Write-Host "   ✅ Backend route koristi Prisma!" -ForegroundColor Green
        Write-Host "   ✅ Podaci se vade iz baze!" -ForegroundColor Green
    } else {
        Write-Host "   ❌ Backend route NE koristi Prisma" -ForegroundColor Red
    }
} else {
    Write-Host "   ❌ documentation.js route nije pronađen" -ForegroundColor Red
}

Write-Host ""
Write-Host "=== ZAKLJUČAK ===" -ForegroundColor Cyan
Write-Host ""
Write-Host "Provjeri u browseru:" -ForegroundColor Yellow
Write-Host "1. Otvori: https://uslugar.oriph.io/#documentation" -ForegroundColor Gray
Write-Host "2. F12 → Network tab" -ForegroundColor Gray
Write-Host "3. Traži: /api/documentation" -ForegroundColor Gray
Write-Host "4. Klikni na zahtjev → Response tab" -ForegroundColor Gray
Write-Host "5. Provjeri da li vidiš JSON podatke" -ForegroundColor Gray
Write-Host ""

