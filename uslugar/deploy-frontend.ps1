# USLUGAR Frontend Deploy Script
# Upload nova verzija frontend-a na server

Write-Host "🚀 USLUGAR Frontend Deploy" -ForegroundColor Green
Write-Host "=========================" -ForegroundColor Green

# Provjeri da li postoji dist direktorij
if (!(Test-Path "frontend/dist")) {
    Write-Host "❌ frontend/dist ne postoji! Pokreni npm run build prvo." -ForegroundColor Red
    exit 1
}

Write-Host "✅ frontend/dist postoji" -ForegroundColor Green

# Prikaži sadržaj dist direktorija
Write-Host "📁 Sadržaj dist direktorija:" -ForegroundColor Yellow
Get-ChildItem "frontend/dist" -Recurse | ForEach-Object {
    Write-Host "  $($_.FullName)" -ForegroundColor Cyan
}

Write-Host ""
Write-Host "📋 SLJEDEĆI KORACI:" -ForegroundColor Yellow
Write-Host "1. Otvorite FileZilla ili WinSCP" -ForegroundColor White
Write-Host "2. Spojite se na FTP server" -ForegroundColor White
Write-Host "3. Upload ove datoteke iz frontend/dist/ na server:" -ForegroundColor White
Write-Host "   - index.html" -ForegroundColor Cyan
Write-Host "   - assets/ (cijeli direktorij)" -ForegroundColor Cyan
Write-Host "   - uslugar.ico (ako postoji)" -ForegroundColor Cyan
Write-Host ""
Write-Host "4. Lokacija na serveru: /domains/uslugar.oriph.io/public_html/" -ForegroundColor White
Write-Host ""
Write-Host "5. Nakon upload-a, hard refresh stranice (Ctrl+F5)" -ForegroundColor White
Write-Host ""
Write-Host "✅ GOTOVO!" -ForegroundColor Green
