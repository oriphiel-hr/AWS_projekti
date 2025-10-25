# USLUGAR - Konačno rješenje za dodavanje kategorija
# ==================================================

Write-Host "🌱 USLUGAR - Konačno rješenje za kategorije" -ForegroundColor Green
Write-Host "===========================================" -ForegroundColor Green

Write-Host "💡 KORAK 1: Dodaj kategorije direktno u bazu podataka" -ForegroundColor Yellow
Write-Host "=====================================================" -ForegroundColor Yellow

Write-Host "📋 Kategorije koje trebaju biti dodane:" -ForegroundColor Cyan
Write-Host "🏗️ GRAĐEVINSKE USLUGE:" -ForegroundColor Green
Write-Host "  - Građevina (ažurirati postojeću)" -ForegroundColor White
Write-Host "  - Građevinski nadzor" -ForegroundColor White
Write-Host "  - Geodetske usluge" -ForegroundColor White
Write-Host "  - Energetski certifikati" -ForegroundColor White
Write-Host "  - Legalizacija objekata" -ForegroundColor White

Write-Host "🎨 DIZAJN I INTERIJER:" -ForegroundColor Green
Write-Host "  - Dizajn interijera" -ForegroundColor White
Write-Host "  - Arhitektonske usluge" -ForegroundColor White
Write-Host "  - Landscape dizajn" -ForegroundColor White

Write-Host "🔌 INSTALACIJE:" -ForegroundColor Green
Write-Host "  - Električar (ažurirati postojeću)" -ForegroundColor White
Write-Host "  - Vodoinstalater (ažurirati postojeću)" -ForegroundColor White
Write-Host "  - Solarni sustavi" -ForegroundColor White

Write-Host "💻 IT I DIGITALNE USLUGE:" -ForegroundColor Green
Write-Host "  - IT usluge (ažurirati postojeću)" -ForegroundColor White
Write-Host "  - Web dizajn" -ForegroundColor White
Write-Host "  - SEO usluge" -ForegroundColor White
Write-Host "  - Digitalni marketing" -ForegroundColor White
Write-Host "  - E-commerce" -ForegroundColor White

Write-Host "📸 MEDIJSKE USLUGE:" -ForegroundColor Green
Write-Host "  - Fotografija" -ForegroundColor White
Write-Host "  - Drone snimanje" -ForegroundColor White
Write-Host "  - 3D vizualizacija" -ForegroundColor White

Write-Host "🚚 LOGISTIKA I TRANSPORT:" -ForegroundColor Green
Write-Host "  - Prijevoz (ažurirati postojeću)" -ForegroundColor White
Write-Host "  - Dostava" -ForegroundColor White
Write-Host "  - Prijevoz putnika" -ForegroundColor White

Write-Host "🧹 ČIŠĆENJE I ODRŽAVANJE:" -ForegroundColor Green
Write-Host "  - Čišćenje (ažurirati postojeću)" -ForegroundColor White
Write-Host "  - Čišćenje kućanstva" -ForegroundColor White
Write-Host "  - Čišćenje ureda" -ForegroundColor White
Write-Host "  - Čišćenje nakon gradnje" -ForegroundColor White

Write-Host "🏥 ZDRAVLJE I LJEPOTA:" -ForegroundColor Green
Write-Host "  - Fizioterapija" -ForegroundColor White
Write-Host "  - Masage" -ForegroundColor White
Write-Host "  - Kozmetika" -ForegroundColor White
Write-Host "  - Manikura/Pedikura" -ForegroundColor White

Write-Host "🎓 OBRAZOVANJE:" -ForegroundColor Green
Write-Host "  - Instrukcije" -ForegroundColor White
Write-Host "  - Jezici" -ForegroundColor White
Write-Host "  - Muzika" -ForegroundColor White

Write-Host "⚖️ PRAVNE I FINANCIJSKE USLUGE:" -ForegroundColor Green
Write-Host "  - Pravo (ažurirati postojeću)" -ForegroundColor White
Write-Host "  - Računovodstvo" -ForegroundColor White
Write-Host "  - Osiguranje" -ForegroundColor White

Write-Host "🌱 EKOLOGIJA I ODRŽIVOST:" -ForegroundColor Green
Write-Host "  - Energetska učinkovitost" -ForegroundColor White
Write-Host "  - Recikliranje" -ForegroundColor White

Write-Host "🏠 DOMAĆI RADOVI:" -ForegroundColor Green
Write-Host "  - Popravak kućanskih aparata" -ForegroundColor White
Write-Host "  - Montaža namještaja" -ForegroundColor White
Write-Host "  - Montaža klima uređaja" -ForegroundColor White

Write-Host ""
Write-Host "💡 KORAK 2: Rješenje" -ForegroundColor Yellow
Write-Host "===================" -ForegroundColor Yellow

Write-Host "🔧 Opcija 1: Redeploy backend s novim kodom" -ForegroundColor Cyan
Write-Host "   - Kreiraj novi Docker image" -ForegroundColor White
Write-Host "   - Push u ECR" -ForegroundColor White
Write-Host "   - Ažuriraj ECS service" -ForegroundColor White
Write-Host "   - Pokreni migraciju kroz API" -ForegroundColor White

Write-Host "🔧 Opcija 2: Direktni SQL pristup" -ForegroundColor Cyan
Write-Host "   - Koristi postojeći service" -ForegroundColor White
Write-Host "   - Pokreni SQL migraciju" -ForegroundColor White
Write-Host "   - Dodaj kategorije direktno u bazu" -ForegroundColor White

Write-Host "🔧 Opcija 3: Manual dodavanje" -ForegroundColor Cyan
Write-Host "   - Otvori AWS RDS konzolu" -ForegroundColor White
Write-Host "   - Pokreni SQL query" -ForegroundColor White
Write-Host "   - Dodaj kategorije ručno" -ForegroundColor White

Write-Host ""
Write-Host "🎯 PREPORUČENO RJEŠENJE:" -ForegroundColor Green
Write-Host "========================" -ForegroundColor Green
Write-Host "1. Koristi AWS RDS Query Editor" -ForegroundColor White
Write-Host "2. Pokreni SQL iz add-categories-direct.sql" -ForegroundColor White
Write-Host "3. Provjeri rezultate na frontend-u" -ForegroundColor White

Write-Host ""
Write-Host "📋 SLJEDEĆI KORACI:" -ForegroundColor Yellow
Write-Host "==================" -ForegroundColor Yellow
Write-Host "1. Otvori AWS Console" -ForegroundColor White
Write-Host "2. Idi na RDS > Query Editor" -ForegroundColor White
Write-Host "3. Spoji se na uslugar bazu" -ForegroundColor White
Write-Host "4. Pokreni SQL iz add-categories-direct.sql" -ForegroundColor White
Write-Host "5. Provjeri rezultate na https://uslugar.oriph.io" -ForegroundColor White

Write-Host ""
Write-Host "🏁 Gotovo! Kategorije će biti dodane kroz AWS RDS Query Editor" -ForegroundColor Green
