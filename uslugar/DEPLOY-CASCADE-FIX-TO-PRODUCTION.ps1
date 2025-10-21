# Skripta za deploy CASCADE DELETE fix-a na AWS produkciju
# Pokreni sa: .\DEPLOY-CASCADE-FIX-TO-PRODUCTION.ps1

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  CASCADE DELETE FIX - Production Deploy" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

$ErrorActionPreference = 'Stop'

# 1. FRONTEND BUILD
Write-Host "KORAK 1/3: Building Frontend..." -ForegroundColor Yellow
Write-Host ""

cd frontend

Write-Host "Pokrecem Vite build..." -ForegroundColor Gray
npm run build

if ($LASTEXITCODE -ne 0) {
    Write-Host "GRESKA: Frontend build failed!" -ForegroundColor Red
    exit 1
}

Write-Host "OK Frontend build uspjesan!" -ForegroundColor Green
Write-Host "   Build lokacija: frontend/dist/" -ForegroundColor Gray
Write-Host ""

cd ..

# 2. BACKEND DOCKER BUILD & DEPLOY
Write-Host "KORAK 2/3: Deploying Backend na AWS ECS..." -ForegroundColor Yellow
Write-Host ""

cd backend

Write-Host "Provjera AWS credentials..." -ForegroundColor Gray
$accountId = aws sts get-caller-identity --query Account --output text 2>$null

if (-not $accountId) {
    Write-Host "UPOZORENJE: AWS credentials nisu konfigurisani!" -ForegroundColor Yellow
    Write-Host "Pokrenite: aws configure" -ForegroundColor Yellow
    Write-Host ""
    $skipAws = Read-Host "Preskociti AWS deploy? (y/n)"
    if ($skipAws -ne "y") {
        exit 1
    }
} else {
    Write-Host "AWS Account: $accountId" -ForegroundColor Green
    Write-Host ""
    
    Write-Host "Pokrecem Docker build i push na ECR..." -ForegroundColor Gray
    .\Deploy-UslugarApi.ps1 -Region "eu-central-1" -Cluster "apps-cluster" -Service "uslugar-api"
    
    if ($LASTEXITCODE -ne 0) {
        Write-Host "GRESKA: AWS deployment failed!" -ForegroundColor Red
        exit 1
    }
    
    Write-Host ""
    Write-Host "OK Backend deployovan na AWS ECS!" -ForegroundColor Green
    Write-Host ""
}

cd ..

# 3. SUMMARY
Write-Host "KORAK 3/3: Deployment Summary" -ForegroundColor Yellow
Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "FRONTEND:" -ForegroundColor White
Write-Host "  OK Build gotov: frontend/dist/" -ForegroundColor Green
Write-Host "  Sljedeci koraci:" -ForegroundColor Yellow
Write-Host "    1. Upload dist/ sadrzaj na FTP (uslugar.oriph.io)" -ForegroundColor Gray
Write-Host "    2. Ili deploy na S3/CloudFront ako koristite AWS" -ForegroundColor Gray
Write-Host ""

if ($accountId) {
    Write-Host "BACKEND:" -ForegroundColor White
    Write-Host "  OK Deployovan na AWS ECS" -ForegroundColor Green
    Write-Host "  AWS Region: eu-central-1" -ForegroundColor Gray
    Write-Host "  Cluster: apps-cluster" -ForegroundColor Gray
    Write-Host "  Service: uslugar-api" -ForegroundColor Gray
    Write-Host ""
    Write-Host "  Provjera statusa:" -ForegroundColor Yellow
    Write-Host "    aws ecs describe-services --cluster apps-cluster --services uslugar-api --region eu-central-1" -ForegroundColor Gray
}
Write-Host ""

Write-Host "IZMJENE KOJE SU DEPLOYOVANE:" -ForegroundColor White
Write-Host "  OK Frontend navigacija fix" -ForegroundColor Green
Write-Host "  OK Backend cascade delete fix" -ForegroundColor Green
Write-Host "  OK delete-helpers.js dodan" -ForegroundColor Green
Write-Host "  OK admin.js azuriran" -ForegroundColor Green
Write-Host "  OK auth.js azuriran" -ForegroundColor Green
Write-Host ""

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "OK DEPLOYMENT ZAVRSEN!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "TESTIRANJE:" -ForegroundColor Yellow
Write-Host "  1. Frontend: https://uslugar.oriph.io" -ForegroundColor Gray
Write-Host "  2. Backend API: https://uslugar.api.oriph.io/api/health" -ForegroundColor Gray
Write-Host ""

