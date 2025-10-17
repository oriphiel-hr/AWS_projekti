# Pokreni kompletnu Uslugar aplikaciju (Backend + Frontend)
# Za Windows PowerShell

Write-Host "======================================" -ForegroundColor Cyan
Write-Host "   USLUGAR - Development Server      " -ForegroundColor Cyan
Write-Host "======================================" -ForegroundColor Cyan
Write-Host ""

# Provjeri da li Node.js postoji
if (!(Get-Command node -ErrorAction SilentlyContinue)) {
    Write-Host "❌ GREŠKA: Node.js nije instaliran!" -ForegroundColor Red
    Write-Host "   Instalirajte Node.js sa: https://nodejs.org" -ForegroundColor Yellow
    exit 1
}

Write-Host "✅ Node.js verzija: $(node --version)" -ForegroundColor Green
Write-Host ""

# Backend
Write-Host "📦 Pokrećem Backend server..." -ForegroundColor Yellow
$backendJob = Start-Job -ScriptBlock {
    Set-Location $using:PWD
    cd uslugar/backend
    $env:NODE_ENV = "development"
    node src/server.js
}

Start-Sleep -Seconds 3

# Provjeri da li je backend pokrenut
try {
    $response = Invoke-WebRequest -Uri "http://localhost:4000/api/health" -UseBasicParsing -TimeoutSec 5
    Write-Host "✅ Backend server radi na: http://localhost:4000" -ForegroundColor Green
} catch {
    Write-Host "⚠️  Backend server se još pokreće..." -ForegroundColor Yellow
}

Write-Host ""

# Frontend
Write-Host "🎨 Pokrećem Frontend server..." -ForegroundColor Yellow
$frontendJob = Start-Job -ScriptBlock {
    Set-Location $using:PWD
    cd uslugar/frontend
    npm run dev
}

Start-Sleep -Seconds 5

Write-Host ""
Write-Host "======================================" -ForegroundColor Cyan
Write-Host "   SERVERI POKRENUTI!                 " -ForegroundColor Green
Write-Host "======================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "🌐 Backend:  http://localhost:4000" -ForegroundColor Cyan
Write-Host "🎨 Frontend: http://localhost:5173" -ForegroundColor Cyan
Write-Host ""
Write-Host "📝 Logovi:" -ForegroundColor Yellow
Write-Host "   - Backend Job ID:  $($backendJob.Id)" -ForegroundColor Gray
Write-Host "   - Frontend Job ID: $($frontendJob.Id)" -ForegroundColor Gray
Write-Host ""
Write-Host "🛑 Za zaustavljanje servera:" -ForegroundColor Yellow
Write-Host "   Stop-Job -Id $($backendJob.Id),$($frontendJob.Id)" -ForegroundColor Gray
Write-Host "   Remove-Job -Id $($backendJob.Id),$($frontendJob.Id)" -ForegroundColor Gray
Write-Host ""
Write-Host "Ili jednostavno zatvorite ovaj terminal." -ForegroundColor Gray
Write-Host ""
Write-Host "Pritisnite CTRL+C za izlaz..." -ForegroundColor Yellow

# Drži skriptu aktivnom
try {
    while ($true) {
        Start-Sleep -Seconds 1
    }
} finally {
    Write-Host ""
    Write-Host "🛑 Zaustavljam servere..." -ForegroundColor Yellow
    Stop-Job -Job $backendJob, $frontendJob -ErrorAction SilentlyContinue
    Remove-Job -Job $backendJob, $frontendJob -ErrorAction SilentlyContinue
    Write-Host "✅ Serveri zaustavljeni." -ForegroundColor Green
}

