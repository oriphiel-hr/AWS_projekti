# Fix Production Database - Add projectType columns
# Uses Prisma seed to apply fix

Write-Host "🔧 Fixing Production Database" -ForegroundColor Cyan
Write-Host ""

cd uslugar\backend

# Set production DATABASE_URL
$env:DATABASE_URL = "postgres://uslugar_user:Pastor123@uslugar-db.cr80o0eeg3gy.eu-north-1.rds.amazonaws.com:5432/uslugar"

Write-Host "Connecting to production database..." -ForegroundColor Yellow
Write-Host ""

Write-Host "Running database fix..." -ForegroundColor Yellow
npm run db:fix

Write-Host ""
Write-Host "✅ Done! Check: https://uslugar.oriph.io/#leads" -ForegroundColor Green

