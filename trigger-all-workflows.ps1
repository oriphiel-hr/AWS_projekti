# Trigger sve workflow-e za admin dokumentaciju

Write-Host "🚀 Pokretanje Workflow-a za Admin Dokumentaciju" -ForegroundColor Cyan
Write-Host ""

# Provjeri fajlove
Write-Host "📋 Provjera fajlova..." -ForegroundColor Yellow
$requiredFiles = @(
    "uslugar/backend/prisma/schema.prisma",
    "uslugar/backend/prisma/seeds/seed-documentation.js",
    "uslugar/backend/src/routes/documentation.js",
    "uslugar/frontend/src/pages/AdminDocumentation.jsx"
)

$allExist = $true
foreach ($file in $requiredFiles) {
    if (Test-Path $file) {
        Write-Host "   ✅ $file" -ForegroundColor Green
    } else {
        Write-Host "   ❌ $file NE POSTOJI" -ForegroundColor Red
        $allExist = $false
    }
}

if (-not $allExist) {
    Write-Host ""
    Write-Host "❌ Neki fajlovi nedostaju!" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "💾 Git add..." -ForegroundColor Yellow
git add -A 2>&1 | Out-Null

Write-Host "📝 Git commit..." -ForegroundColor Yellow
$commitMsg = @"
feat: Admin documentation from database with detailed descriptions

- Added isAdminOnly flag to DocumentationFeature
- Created migration for isAdminOnly column
- Added 23 admin features with detailed descriptions in seed
- Updated /api/documentation/admin route
- Refactored AdminDocumentation.jsx to load from API
"@

git commit -m $commitMsg 2>&1 | Out-String | Out-Null

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Commit kreiran!" -ForegroundColor Green
} else {
    # Možda nema promjena
    $status = git status --porcelain 2>&1 | Out-String
    if ($status -match "nothing to commit") {
        Write-Host "ℹ️  Nema novih promjena za commit" -ForegroundColor Gray
    } else {
        Write-Host "⚠️  Commit možda nije uspješan" -ForegroundColor Yellow
    }
}

Write-Host ""
Write-Host "📤 Git push na main..." -ForegroundColor Yellow
$pushResult = git push origin main 2>&1 | Out-String

if ($LASTEXITCODE -eq 0 -or $pushResult -match "up to date" -or $pushResult -match "pushed") {
    Write-Host "✅ Push uspješan!" -ForegroundColor Green
    Write-Host ""
    Write-Host "🔄 Workflow-i će se automatski pokrenuti:" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "1️⃣ Prisma Workflow (migracije + seed)" -ForegroundColor Yellow
    Write-Host "   👉 https://github.com/oriphiel/AWS_projekti/actions/workflows/prisma-uslugar.yml" -ForegroundColor Cyan
    Write-Host "   ⏱️  ~5-7 minuta" -ForegroundColor Gray
    Write-Host ""
    Write-Host "2️⃣ Backend Workflow (deployment)" -ForegroundColor Yellow
    Write-Host "   👉 https://github.com/oriphiel/AWS_projekti/actions/workflows/backend-uslugar-ecs.yml" -ForegroundColor Cyan
    Write-Host "   ⏱️  ~8-12 minuta" -ForegroundColor Gray
    Write-Host ""
    Write-Host "3️⃣ Frontend Workflow (deployment)" -ForegroundColor Yellow
    Write-Host "   👉 https://github.com/oriphiel/AWS_projekti/actions/workflows/frontend-uslugar.yml" -ForegroundColor Cyan
    Write-Host "   ⏱️  ~3-5 minuta" -ForegroundColor Gray
    Write-Host ""
    Write-Host "⏱️  Ukupno: ~16-24 minuta" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "✅ Provjeri GitHub Actions za napredak!" -ForegroundColor Green
} else {
    Write-Host "⚠️  Push možda nije uspješan:" -ForegroundColor Yellow
    Write-Host $pushResult -ForegroundColor Gray
    Write-Host ""
    Write-Host "💡 Ručno pokreni workflow-e:" -ForegroundColor Yellow
    Write-Host "   https://github.com/oriphiel/AWS_projekti/actions" -ForegroundColor Cyan
}

Write-Host ""

