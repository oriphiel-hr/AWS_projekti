# Testiraj admin endpoint
Write-Host "🌱 Testiranje admin endpoint-a..." -ForegroundColor Yellow

$response = Invoke-RestMethod -Uri "https://uslugar.api.oriph.io/api/admin/categories/add-missing-categories" -Method POST -ContentType "application/json"

Write-Host "✅ Odgovor:" -ForegroundColor Green
$response | ConvertTo-Json -Depth 3

Write-Host "🎉 Kategorije uspješno dodane!" -ForegroundColor Green
