# Force redeploy documentation route

Write-Host "🔧 Force redeploy documentation route..." -ForegroundColor Cyan
Write-Host ""

# Provjeri da li je route commitan
$routeCommit = git log --oneline --all -- "uslugar/backend/src/routes/documentation.js" -1
if ($routeCommit) {
    Write-Host "✅ Route je commitan:" -ForegroundColor Green
    Write-Host "   $routeCommit" -ForegroundColor Gray
} else {
    Write-Host "❌ Route NIJE commitan!" -ForegroundColor Red
    Write-Host "   Commitam route..." -ForegroundColor Yellow
    git add uslugar/backend/src/routes/documentation.js
    git add uslugar/backend/src/server.js
    git commit -m "feat: Add documentation API route"
    Write-Host "✅ Route commitan" -ForegroundColor Green
}

# Provjeri da li server.js ima route
$serverHasRoute = git show HEAD:uslugar/backend/src/server.js | Select-String -Pattern "documentationRouter"
if ($serverHasRoute) {
    Write-Host "✅ server.js ima route registriran" -ForegroundColor Green
} else {
    Write-Host "❌ server.js NEMA route!" -ForegroundColor Red
    Write-Host "   Treba dodati route u server.js" -ForegroundColor Yellow
    exit 1
}

Write-Host ""
Write-Host "📤 Push i trigger workflow..." -ForegroundColor Yellow
git push origin main

Write-Host ""
Write-Host "🔄 Backend workflow će se pokrenuti automatski" -ForegroundColor Cyan
Write-Host ""
Write-Host "📊 Provjeri status:" -ForegroundColor Yellow
Write-Host "   https://github.com/oriphiel/AWS_projekti/actions" -ForegroundColor Gray
Write-Host ""
Write-Host "⏱️  Čekaj ~10 minuta za deployment" -ForegroundColor Yellow
Write-Host ""
Write-Host "💡 Ako i dalje ne radi nakon deploymenta:" -ForegroundColor Yellow
Write-Host "   - Provjeri CloudWatch logs za greške" -ForegroundColor Gray
Write-Host "   - Force restart ECS service" -ForegroundColor Gray

