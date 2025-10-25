# USLUGAR - Jednostavan pristup za dodavanje kategorija
# =====================================================

Write-Host "🌱 USLUGAR - Jednostavan pristup za dodavanje kategorija" -ForegroundColor Green
Write-Host "=====================================================" -ForegroundColor Green

Write-Host "💡 KORAK 1: Dobij admin token" -ForegroundColor Yellow
Write-Host "===========================" -ForegroundColor Yellow

# Dobij admin token
$loginData = @{
    email = "admin@uslugar.hr"
    password = "Admin123!"
}

$loginResponse = Invoke-RestMethod -Uri "https://uslugar.api.oriph.io/api/auth/login" -Method POST -ContentType "application/json" -Body ($loginData | ConvertTo-Json)
$token = $loginResponse.token

Write-Host "🔑 Token dobiven!" -ForegroundColor Green

Write-Host "💡 KORAK 2: Dodaj kategorije po grupama" -ForegroundColor Yellow
Write-Host "=====================================" -ForegroundColor Yellow

$headers = @{
    "Authorization" = "Bearer $token"
    "Content-Type" = "application/json"
}

# Dodaj kategorije po grupama
$categories = @(
    # Građevinske usluge
    @{ name = "Građevina"; description = "Opći građevinski radovi, renovacije, adaptacije"; icon = "🏗️"; nkdCode = "41.20"; requiresLicense = $true; licenseType = "Građevinska licenca"; licenseAuthority = "Hrvatska komora inženjera građevinarstva" },
    @{ name = "Građevinski nadzor"; description = "Nadzor nad izvođenjem građevinskih radova"; icon = "👷"; nkdCode = "71.12"; requiresLicense = $true; licenseType = "Licenca građevinskog nadzora"; licenseAuthority = "Hrvatska komora inženjera građevinarstva" },
    @{ name = "Geodetske usluge"; description = "Mjerenja, izrada geodetskih elaborata"; icon = "📐"; nkdCode = "71.12"; requiresLicense = $true; licenseType = "Geodetska licenca"; licenseAuthority = "Hrvatska komora inženjera geodezije" },
    @{ name = "Energetski certifikati"; description = "Izdavanje energetskih certifikata za zgrade"; icon = "⚡"; nkdCode = "71.12"; requiresLicense = $true; licenseType = "Licenca energetskog certifikata"; licenseAuthority = "Hrvatska energetska agencija" },
    @{ name = "Legalizacija objekata"; description = "Pomoć pri legalizaciji bespravno sagrađenih objekata"; icon = "📋"; nkdCode = "71.12"; requiresLicense = $false },
    
    # Dizajn i interijer
    @{ name = "Dizajn interijera"; description = "Uređenje i dizajn unutarnjih prostora"; icon = "🎨"; nkdCode = "74.10"; requiresLicense = $false },
    @{ name = "Arhitektonske usluge"; description = "Projektiranje, izrada arhitektonskih planova"; icon = "🏛️"; nkdCode = "71.11"; requiresLicense = $true; licenseType = "Arhitektonska licenca"; licenseAuthority = "Hrvatska komora arhitekata" },
    @{ name = "Landscape dizajn"; description = "Uređenje vanjskih prostora, vrtovi"; icon = "🌳"; nkdCode = "71.12"; requiresLicense = $false },
    
    # IT i digitalne usluge
    @{ name = "Solarni sustavi"; description = "Ugradnja solarnih panela i sustava"; icon = "☀️"; nkdCode = "43.21"; requiresLicense = $true; licenseType = "Elektrotehnička licenca"; licenseAuthority = "Hrvatska komora inženjera elektrotehnike" },
    @{ name = "Web dizajn"; description = "Izrada i dizajn web stranica"; icon = "🌐"; nkdCode = "62.01"; requiresLicense = $false },
    @{ name = "SEO usluge"; description = "Optimizacija web stranica za pretraživače"; icon = "🔍"; nkdCode = "62.01"; requiresLicense = $false },
    @{ name = "Digitalni marketing"; description = "Online marketing, društvene mreže"; icon = "📱"; nkdCode = "73.11"; requiresLicense = $false },
    @{ name = "E-commerce"; description = "Izrada online trgovina"; icon = "🛒"; nkdCode = "62.01"; requiresLicense = $false },
    
    # Medijske usluge
    @{ name = "Fotografija"; description = "Profesionalno fotografiranje za različite potrebe"; icon = "📸"; nkdCode = "74.20"; requiresLicense = $false },
    @{ name = "Drone snimanje"; description = "Zračno snimanje dronovima"; icon = "🚁"; nkdCode = "74.20"; requiresLicense = $false },
    @{ name = "3D vizualizacija"; description = "3D modeli, renderi, vizualizacije"; icon = "🎬"; nkdCode = "74.20"; requiresLicense = $false },
    
    # Logistika i transport
    @{ name = "Dostava"; description = "Dostava paketa, hrane, pošiljki"; icon = "📦"; nkdCode = "53.20"; requiresLicense = $false },
    @{ name = "Prijevoz putnika"; description = "Taxi, prijevoz putnika"; icon = "🚕"; nkdCode = "49.32"; requiresLicense = $true; licenseType = "Licenca za prijevoz putnika"; licenseAuthority = "Ministarstvo mora, prometa i infrastrukture" },
    
    # Čišćenje i održavanje
    @{ name = "Čišćenje kućanstva"; description = "Čišćenje domova, stanova"; icon = "🏠"; nkdCode = "81.21"; requiresLicense = $false },
    @{ name = "Čišćenje ureda"; description = "Čišćenje poslovnih prostora"; icon = "🏢"; nkdCode = "81.21"; requiresLicense = $false },
    @{ name = "Čišćenje nakon gradnje"; description = "Čišćenje nakon građevinskih radova"; icon = "🏗️"; nkdCode = "81.21"; requiresLicense = $false },
    
    # Zdravlje i ljepota
    @{ name = "Fizioterapija"; description = "Fizioterapijske usluge, rehabilitacija"; icon = "🏥"; nkdCode = "86.90"; requiresLicense = $true; licenseType = "Licenca fizioterapeuta"; licenseAuthority = "Hrvatska komora fizioterapeuta" },
    @{ name = "Masage"; description = "Opuštajuće i terapeutske masaže"; icon = "💆"; nkdCode = "96.09"; requiresLicense = $false },
    @{ name = "Kozmetika"; description = "Kozmetičke usluge, njega lica"; icon = "💄"; nkdCode = "96.02"; requiresLicense = $false },
    @{ name = "Manikura/Pedikura"; description = "Njega noktiju ruku i nogu"; icon = "💅"; nkdCode = "96.02"; requiresLicense = $false },
    
    # Obrazovanje
    @{ name = "Instrukcije"; description = "Poduka učenika, instrukcije"; icon = "📚"; nkdCode = "85.59"; requiresLicense = $false },
    @{ name = "Jezici"; description = "Učenje stranih jezika"; icon = "🗣️"; nkdCode = "85.59"; requiresLicense = $false },
    @{ name = "Muzika"; description = "Glazbena nastava, poduka"; icon = "🎵"; nkdCode = "85.59"; requiresLicense = $false },
    
    # Poslovne usluge
    @{ name = "Računovodstvo"; description = "Knjigovodstvo, računovodstvene usluge"; icon = "📊"; nkdCode = "69.20"; requiresLicense = $false },
    @{ name = "Osiguranje"; description = "Osiguravajuće usluge"; icon = "🛡️"; nkdCode = "65.20"; requiresLicense = $true; licenseType = "Licenca osiguravajućeg agenta"; licenseAuthority = "Hrvatska agencija za nadzor financijskih usluga" },
    
    # Ekologija i održivost
    @{ name = "Energetska učinkovitost"; description = "Energetski pregledi, optimizacija potrošnje"; icon = "🌱"; nkdCode = "71.12"; requiresLicense = $true; licenseType = "Licenca energetskog savjetnika"; licenseAuthority = "Hrvatska energetska agencija" },
    @{ name = "Recikliranje"; description = "Usluge recikliranja, odvoz otpada"; icon = "♻️"; nkdCode = "38.11"; requiresLicense = $false },
    
    # Popravci
    @{ name = "Popravak kućanskih aparata"; description = "Popravak perilica, sušilica, frižidera"; icon = "🔧"; nkdCode = "95.21"; requiresLicense = $false },
    @{ name = "Montaža namještaja"; description = "Montaža namještaja, sklapanje"; icon = "🪑"; nkdCode = "43.30"; requiresLicense = $false },
    @{ name = "Montaža klima uređaja"; description = "Ugradnja i servis klima uređaja"; icon = "❄️"; nkdCode = "43.22"; requiresLicense = $true; licenseType = "Licenca za klimatizaciju"; licenseAuthority = "Hrvatska komora inženjera građevinarstva" }
)

$addedCount = 0
$errorCount = 0

foreach ($category in $categories) {
    try {
        Write-Host "➕ Dodajem: $($category.name)" -ForegroundColor Yellow
        
        $categoryData = @{
            name = $category.name
            description = $category.description
            icon = $category.icon
            nkdCode = $category.nkdCode
            requiresLicense = $category.requiresLicense
            licenseType = $category.licenseType
            licenseAuthority = $category.licenseAuthority
            isActive = $true
        }
        
        # Pokušaj s različitim endpoint-ima
        $endpoints = @(
            "https://uslugar.api.oriph.io/api/categories",
            "https://uslugar.api.oriph.io/api/admin/categories",
            "https://uslugar.api.oriph.io/api/admin/seed-categories"
        )
        
        $success = $false
        foreach ($endpoint in $endpoints) {
            try {
                $response = Invoke-RestMethod -Uri $endpoint -Method POST -Headers $headers -Body ($categoryData | ConvertTo-Json)
                Write-Host "✅ Dodana: $($category.name) (endpoint: $endpoint)" -ForegroundColor Green
                $addedCount++
                $success = $true
                break
            } catch {
                Write-Host "⚠️ Endpoint $endpoint ne radi za $($category.name)" -ForegroundColor Yellow
            }
        }
        
        if (-not $success) {
            Write-Host "❌ Greška za $($category.name): Nema radnog endpoint-a" -ForegroundColor Red
            $errorCount++
        }
        
    } catch {
        Write-Host "❌ Greška za $($category.name): $($_.Exception.Message)" -ForegroundColor Red
        $errorCount++
    }
}

Write-Host "📊 REZULTAT:" -ForegroundColor Cyan
Write-Host "✅ Dodano: $addedCount kategorija" -ForegroundColor Green
Write-Host "❌ Greške: $errorCount kategorija" -ForegroundColor Red
Write-Host "📋 Ukupno: $($categories.Count) kategorija" -ForegroundColor Cyan

if ($addedCount -gt 0) {
    Write-Host "🎉 Kategorije uspješno dodane!" -ForegroundColor Green
    Write-Host "🌐 Provjerite rezultate na https://uslugar.oriph.io" -ForegroundColor Cyan
}

Write-Host "🏁 Gotovo!" -ForegroundColor Green
