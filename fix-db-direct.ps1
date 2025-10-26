# Direct SQL Fix - Connect to RDS PostgreSQL
# Adds projectType and customFields columns

$DATABASE_URL = "postgres://uslugar_user:Pastor123@uslugar-db.cr80o0eeg3gy.eu-north-1.rds.amazonaws.com:5432/uslugar"

Write-Host "🔧 Fixing Database: Adding projectType columns" -ForegroundColor Cyan
Write-Host ""

$SQL = @"
ALTER TABLE "Job" ADD COLUMN IF NOT EXISTS "projectType" TEXT;
ALTER TABLE "Job" ADD COLUMN IF NOT EXISTS "customFields" JSONB;
"@

Write-Host "SQL Commands:" -ForegroundColor Yellow
Write-Host $SQL
Write-Host ""

# Execute via psql
Write-Host "Executing SQL on production database..." -ForegroundColor Yellow

$env:PGPASSWORD = "Pastor123"

echo $SQL | psql -h uslugar-db.cr80o0eeg3gy.eu-north-1.rds.amazonaws.com -p 5432 -U uslugar_user -d uslugar

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "✅ Database columns added successfully!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Testing: https://uslugar.oriph.io/#leads" -ForegroundColor Cyan
} else {
    Write-Host ""
    Write-Host "❌ Failed to execute SQL" -ForegroundColor Red
    Write-Host ""
    Write-Host "Alternative: Run manually via SQL client:" -ForegroundColor Yellow
    Write-Host $SQL
}

