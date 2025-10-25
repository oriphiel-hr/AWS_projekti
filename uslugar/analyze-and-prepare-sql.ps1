# USLUGAR - Analiza postojećih kategorija i dodavanje nedostajućih
# ================================================================

Write-Host "🌱 USLUGAR - Analiza postojećih kategorija i dodavanje nedostajućih" -ForegroundColor Green
Write-Host "===============================================================" -ForegroundColor Green

Write-Host "💡 KORAK 1: Dohvati postojeće kategorije" -ForegroundColor Yellow
Write-Host "=====================================" -ForegroundColor Yellow

# Dohvati postojeće kategorije
$existingCategories = Invoke-RestMethod -Uri "https://uslugar.api.oriph.io/api/categories" -Method GET -ContentType "application/json"

Write-Host "📊 Postojeće kategorije: $($existingCategories.Count)" -ForegroundColor Cyan

# Kreiraj popis postojećih naziva kategorija
$existingNames = $existingCategories | ForEach-Object { $_.name }

Write-Host "💡 KORAK 2: Identificiraj nedostajuće kategorije" -ForegroundColor Yellow
Write-Host "=============================================" -ForegroundColor Yellow

# Nedostajuće kategorije s Trebam.hr
$missingCategories = @(
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

# Filtriraj kategorije koje već postoje
$newCategories = $missingCategories | Where-Object { $_.name -notin $existingNames }

Write-Host "📋 Nedostajuće kategorije: $($newCategories.Count)" -ForegroundColor Cyan

if ($newCategories.Count -eq 0) {
    Write-Host "✅ Sve kategorije već postoje!" -ForegroundColor Green
    Write-Host "🌐 Provjerite rezultate na https://uslugar.oriph.io" -ForegroundColor Cyan
    exit 0
}

Write-Host "💡 KORAK 3: Pripremi SQL za dodavanje" -ForegroundColor Yellow
Write-Host "=================================" -ForegroundColor Yellow

# Kreiraj SQL skript
$sqlScript = @"
-- USLUGAR - Dodavanje nedostajućih kategorija
-- ===========================================

"@

foreach ($category in $newCategories) {
    $sqlScript += @"

INSERT INTO "Category" (id, name, description, icon, "nkdCode", "requiresLicense", "licenseType", "licenseAuthority", "isActive", "createdAt", "updatedAt")
VALUES (
    'cat_$($category.name.ToLower().Replace(' ', '_').Replace('ć', 'c').Replace('č', 'c').Replace('đ', 'd').Replace('š', 's').Replace('ž', 'z'))',
    '$($category.name)',
    '$($category.description)',
    '$($category.icon)',
    '$($category.nkdCode)',
    $($category.requiresLicense.ToString().ToLower()),
    $(if ($category.licenseType) { "'$($category.licenseType)'" } else { "NULL" }),
    $(if ($category.licenseAuthority) { "'$($category.licenseAuthority)'" } else { "NULL" }),
    true,
    NOW(),
    NOW()
) ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    icon = EXCLUDED.icon,
    "nkdCode" = EXCLUDED."nkdCode",
    "requiresLicense" = EXCLUDED."requiresLicense",
    "licenseType" = EXCLUDED."licenseType",
    "licenseAuthority" = EXCLUDED."licenseAuthority",
    "isActive" = EXCLUDED."isActive",
    "updatedAt" = NOW();

"@
}

$sqlScript += @"

-- Provjeri rezultat
SELECT COUNT(*) as "Ukupno kategorija" FROM "Category" WHERE "isActive" = true;
"@

# Spremi SQL skript
$sqlScript | Out-File -FilePath "add-missing-categories-final.sql" -Encoding UTF8

Write-Host "📝 SQL skript kreiran: add-missing-categories-final.sql" -ForegroundColor Green
Write-Host "📋 Kategorije za dodavanje:" -ForegroundColor Cyan

foreach ($category in $newCategories) {
    Write-Host "  • $($category.name)" -ForegroundColor Yellow
}

Write-Host "💡 KORAK 4: Instrukcije za pokretanje" -ForegroundColor Yellow
Write-Host "===================================" -ForegroundColor Yellow

Write-Host "🔧 Za pokretanje SQL skripta:" -ForegroundColor Cyan
Write-Host "1. Otvorite AWS RDS Query Editor" -ForegroundColor White
Write-Host "2. Spojite se na bazu: uslugar-db.cr80o0eeg3gy.eu-north-1.rds.amazonaws.com" -ForegroundColor White
Write-Host "3. Kopirajte sadržaj datoteke add-missing-categories-final.sql" -ForegroundColor White
Write-Host "4. Pokrenite SQL komande" -ForegroundColor White
Write-Host "5. Provjerite rezultate na https://uslugar.oriph.io" -ForegroundColor White

Write-Host "🎉 Gotovo! SQL skript je spreman za pokretanje." -ForegroundColor Green
