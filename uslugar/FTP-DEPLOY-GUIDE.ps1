# 🚀 JEDNOSTAVNI FTP DEPLOYMENT GUIDE
# Korak po korak instrukcije za upload

Write-Host "🚀 USLUGAR FTP DEPLOYMENT" -ForegroundColor Green
Write-Host "=========================" -ForegroundColor Green

Write-Host "`n📋 PRIJE POČETKA:" -ForegroundColor Yellow
Write-Host "1. Otvorite FileZilla ili WinSCP" -ForegroundColor White
Write-Host "2. Spojite se na FTP server:" -ForegroundColor White
Write-Host "   Host: your-ftp-host.com" -ForegroundColor Cyan
Write-Host "   Username: your-username" -ForegroundColor Cyan
Write-Host "   Password: your-password" -ForegroundColor Cyan
Write-Host "   Port: 21" -ForegroundColor Cyan

Write-Host "`n📤 FRONTEND UPLOAD:" -ForegroundColor Yellow
Write-Host "Lokacija na serveru: /domains/uslugar.oriph.io/public_html/" -ForegroundColor White
Write-Host "`nUpload ove datoteke iz frontend/dist/:" -ForegroundColor White
Write-Host "✅ index.html" -ForegroundColor Green
Write-Host "✅ assets/ (cijeli direktorij)" -ForegroundColor Green
Write-Host "✅ uslugar.ico (ako postoji)" -ForegroundColor Green

Write-Host "`n📤 BACKEND UPLOAD:" -ForegroundColor Yellow
Write-Host "Lokacija na serveru: /domains/uslugar.oriph.io/public_html/api/" -ForegroundColor White
Write-Host "`nUpload ove datoteke/direktorije iz backend/:" -ForegroundColor White
Write-Host "✅ package.json" -ForegroundColor Green
Write-Host "✅ package-lock.json" -ForegroundColor Green
Write-Host "✅ src/ (cijeli direktorij sa svim poddirektorijima)" -ForegroundColor Green
Write-Host "✅ prisma/ (cijeli direktorij)" -ForegroundColor Green

Write-Host "`n⚠️ NE UPLOADAJ:" -ForegroundColor Red
Write-Host "❌ node_modules/" -ForegroundColor Red
Write-Host "❌ uploads/" -ForegroundColor Red
Write-Host "❌ .env" -ForegroundColor Red
Write-Host "❌ *.md datoteke" -ForegroundColor Red

Write-Host "`n🔧 NAKON UPLOADA - Na serveru (SSH):" -ForegroundColor Yellow
Write-Host "1. cd /domains/uslugar.oriph.io/public_html/api" -ForegroundColor White
Write-Host "2. npm install" -ForegroundColor White
Write-Host "3. npx prisma generate" -ForegroundColor White
Write-Host "4. npx prisma migrate deploy" -ForegroundColor White
Write-Host "5. mkdir -p uploads" -ForegroundColor White
Write-Host "6. chmod 755 uploads" -ForegroundColor White
Write-Host "7. Provjeri/kreiraj .env datoteku" -ForegroundColor White
Write-Host "8. Restartaj Node.js app u Hostinger Control Panel" -ForegroundColor White

Write-Host "`n🔗 TESTIRAJTE:" -ForegroundColor Yellow
Write-Host "Frontend: https://uslugar.oriph.io" -ForegroundColor White
Write-Host "Backend: https://uslugar.oriph.io/api/health" -ForegroundColor White
Write-Host "Jobs: https://uslugar.oriph.io/api/jobs" -ForegroundColor White

Write-Host "`n✅ GOTOVO!" -ForegroundColor Green
