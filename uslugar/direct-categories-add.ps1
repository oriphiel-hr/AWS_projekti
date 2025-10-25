# USLUGAR - Direktno dodavanje kategorija kroz postojeći service
# ==============================================================

Write-Host "🌱 USLUGAR - Direktno dodavanje kategorija" -ForegroundColor Green
Write-Host "=========================================" -ForegroundColor Green

# Koristi postojeći service i pokreni migraciju kroz nginx proxy
Write-Host "🚀 Pokretanje migracije kroz postojeći service..." -ForegroundColor Yellow

# Testiraj da li service radi
Write-Host "🔍 Testiranje service-a..." -ForegroundColor Yellow
$healthCheck = curl -s https://uslugar.api.oriph.io/hc
if ($healthCheck -eq "ok") {
    Write-Host "✅ Service radi" -ForegroundColor Green
} else {
    Write-Host "❌ Service ne radi" -ForegroundColor Red
    exit 1
}

# Pokušaj dodati kategorije kroz API
Write-Host "🌱 Dodavanje kategorija kroz API..." -ForegroundColor Yellow

# Kreiraj jednostavan JSON s kategorijama
$categories = @{
    categories = @(
        @{ name = "Građevina"; description = "Opći građevinski radovi, renovacije, adaptacije"; icon = "🏗️"; nkdCode = "41.20"; requiresLicense = $true; licenseType = "Građevinska licenca"; licenseAuthority = "Hrvatska komora inženjera građevinarstva" },
        @{ name = "Građevinski nadzor"; description = "Nadzor nad izvođenjem građevinskih radova"; icon = "👷"; nkdCode = "71.12"; requiresLicense = $true; licenseType = "Licenca građevinskog nadzora"; licenseAuthority = "Hrvatska komora inženjera građevinarstva" },
        @{ name = "Geodetske usluge"; description = "Mjerenja, izrada geodetskih elaborata"; icon = "📐"; nkdCode = "71.12"; requiresLicense = $true; licenseType = "Geodetska licenca"; licenseAuthority = "Hrvatska komora inženjera geodezije" },
        @{ name = "Energetski certifikati"; description = "Izdavanje energetskih certifikata za zgrade"; icon = "⚡"; nkdCode = "71.12"; requiresLicense = $true; licenseType = "Licenca energetskog certifikata"; licenseAuthority = "Hrvatska energetska agencija" },
        @{ name = "Legalizacija objekata"; description = "Pomoć pri legalizaciji bespravno sagrađenih objekata"; icon = "📋"; nkdCode = "71.12"; requiresLicense = $false },
        @{ name = "Dizajn interijera"; description = "Uređenje i dizajn unutarnjih prostora"; icon = "🎨"; nkdCode = "74.10"; requiresLicense = $false },
        @{ name = "Arhitektonske usluge"; description = "Projektiranje, izrada arhitektonskih planova"; icon = "🏛️"; nkdCode = "71.11"; requiresLicense = $true; licenseType = "Arhitektonska licenca"; licenseAuthority = "Hrvatska komora arhitekata" },
        @{ name = "Landscape dizajn"; description = "Uređenje vanjskih prostora, vrtovi"; icon = "🌳"; nkdCode = "71.12"; requiresLicense = $false },
        @{ name = "Solarni sustavi"; description = "Ugradnja solarnih panela i sustava"; icon = "☀️"; nkdCode = "43.21"; requiresLicense = $true; licenseType = "Elektrotehnička licenca"; licenseAuthority = "Hrvatska komora inženjera elektrotehnike" },
        @{ name = "Web dizajn"; description = "Izrada i dizajn web stranica"; icon = "🌐"; nkdCode = "62.01"; requiresLicense = $false },
        @{ name = "SEO usluge"; description = "Optimizacija web stranica za pretraživače"; icon = "🔍"; nkdCode = "62.01"; requiresLicense = $false },
        @{ name = "Digitalni marketing"; description = "Online marketing, društvene mreže"; icon = "📱"; nkdCode = "73.11"; requiresLicense = $false },
        @{ name = "E-commerce"; description = "Izrada online trgovina"; icon = "🛒"; nkdCode = "62.01"; requiresLicense = $false },
        @{ name = "Fotografija"; description = "Profesionalno fotografiranje za različite potrebe"; icon = "📸"; nkdCode = "74.20"; requiresLicense = $false },
        @{ name = "Drone snimanje"; description = "Zračno snimanje dronovima"; icon = "🚁"; nkdCode = "74.20"; requiresLicense = $false },
        @{ name = "3D vizualizacija"; description = "3D modeli, renderi, vizualizacije"; icon = "🎬"; nkdCode = "74.20"; requiresLicense = $false },
        @{ name = "Dostava"; description = "Dostava paketa, hrane, pošiljki"; icon = "📦"; nkdCode = "53.20"; requiresLicense = $false },
        @{ name = "Prijevoz putnika"; description = "Taxi, prijevoz putnika"; icon = "🚕"; nkdCode = "49.32"; requiresLicense = $true; licenseType = "Licenca za prijevoz putnika"; licenseAuthority = "Ministarstvo mora, prometa i infrastrukture" },
        @{ name = "Čišćenje kućanstva"; description = "Čišćenje domova, stanova"; icon = "🏠"; nkdCode = "81.21"; requiresLicense = $false },
        @{ name = "Čišćenje ureda"; description = "Čišćenje poslovnih prostora"; icon = "🏢"; nkdCode = "81.21"; requiresLicense = $false },
        @{ name = "Čišćenje nakon gradnje"; description = "Čišćenje nakon građevinskih radova"; icon = "🏗️"; nkdCode = "81.21"; requiresLicense = $false },
        @{ name = "Fizioterapija"; description = "Fizioterapijske usluge, rehabilitacija"; icon = "🏥"; nkdCode = "86.90"; requiresLicense = $true; licenseType = "Licenca fizioterapeuta"; licenseAuthority = "Hrvatska komora fizioterapeuta" },
        @{ name = "Masage"; description = "Opuštajuće i terapeutske masaže"; icon = "💆"; nkdCode = "96.09"; requiresLicense = $false },
        @{ name = "Kozmetika"; description = "Kozmetičke usluge, njega lica"; icon = "💄"; nkdCode = "96.02"; requiresLicense = $false },
        @{ name = "Manikura/Pedikura"; description = "Njega noktiju ruku i nogu"; icon = "💅"; nkdCode = "96.02"; requiresLicense = $false },
        @{ name = "Instrukcije"; description = "Poduka učenika, instrukcije"; icon = "📚"; nkdCode = "85.59"; requiresLicense = $false },
        @{ name = "Jezici"; description = "Učenje stranih jezika"; icon = "🗣️"; nkdCode = "85.59"; requiresLicense = $false },
        @{ name = "Muzika"; description = "Glazbena nastava, poduka"; icon = "🎵"; nkdCode = "85.59"; requiresLicense = $false },
        @{ name = "Računovodstvo"; description = "Knjigovodstvo, računovodstvene usluge"; icon = "📊"; nkdCode = "69.20"; requiresLicense = $false },
        @{ name = "Osiguranje"; description = "Osiguravajuće usluge"; icon = "🛡️"; nkdCode = "65.20"; requiresLicense = $true; licenseType = "Licenca osiguravajućeg agenta"; licenseAuthority = "Hrvatska agencija za nadzor financijskih usluga" },
        @{ name = "Energetska učinkovitost"; description = "Energetski pregledi, optimizacija potrošnje"; icon = "🌱"; nkdCode = "71.12"; requiresLicense = $true; licenseType = "Licenca energetskog savjetnika"; licenseAuthority = "Hrvatska energetska agencija" },
        @{ name = "Recikliranje"; description = "Usluge recikliranja, odvoz otpada"; icon = "♻️"; nkdCode = "38.11"; requiresLicense = $false },
        @{ name = "Popravak kućanskih aparata"; description = "Popravak perilica, sušilica, frižidera"; icon = "🔧"; nkdCode = "95.21"; requiresLicense = $false },
        @{ name = "Montaža namještaja"; description = "Montaža namještaja, sklapanje"; icon = "🪑"; nkdCode = "43.30"; requiresLicense = $false },
        @{ name = "Montaža klima uređaja"; description = "Ugradnja i servis klima uređaja"; icon = "❄️"; nkdCode = "43.22"; requiresLicense = $true; licenseType = "Licenca za klimatizaciju"; licenseAuthority = "Hrvatska komora inženjera građevinarstva" }
    )
}

$jsonData = $categories | ConvertTo-Json -Depth 10

try {
    $response = Invoke-RestMethod -Uri "https://uslugar.api.oriph.io/api/admin/seed-categories" -Method POST -Body $jsonData -ContentType "application/json" -TimeoutSec 60
    
    Write-Host "✅ Kategorije uspješno dodane!" -ForegroundColor Green
    Write-Host "📊 Rezultat:" -ForegroundColor Cyan
    Write-Host "➕ Dodano: $($response.addedCount) kategorija" -ForegroundColor Green
    Write-Host "✅ Ažurirano: $($response.updatedCount) kategorija" -ForegroundColor Green
    Write-Host "📋 Ukupno: $($response.totalCount) kategorija" -ForegroundColor Green
    
} catch {
    Write-Host "❌ Greška pri dodavanju kategorija:" -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
    
    # Pokušaj alternativni pristup
    Write-Host "🔄 Pokušavam alternativni pristup..." -ForegroundColor Yellow
    
    try {
        $curlResponse = curl -X POST https://uslugar.api.oriph.io/api/admin/seed-categories -H "Content-Type: application/json" -d $jsonData --max-time 60
        Write-Host "✅ Alternativni pristup uspješan!" -ForegroundColor Green
        Write-Host $curlResponse -ForegroundColor Cyan
    } catch {
        Write-Host "❌ Alternativni pristup također ne radi" -ForegroundColor Red
        Write-Host "💡 Možda je potrebno redeploy backend-a s novim kodom" -ForegroundColor Yellow
    }
}

Write-Host "🏁 Gotovo!" -ForegroundColor Green
