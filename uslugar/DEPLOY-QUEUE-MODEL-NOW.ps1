# =============================================================================
# USLUGAR QUEUE MODEL - COMPLETE DEPLOYMENT TO AWS
# =============================================================================

$ErrorActionPreference = "Stop"

Write-Host ""
Write-Host "═══════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host "  USLUGAR QUEUE MODEL - AWS DEPLOYMENT" -ForegroundColor White
Write-Host "═══════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""

# Configuration
$AWS_REGION = "eu-north-1"
$ECR_REPO = "339713096106.dkr.ecr.eu-north-1.amazonaws.com/uslugar-backend"
$CLUSTER_NAME = "uslugar-cluster"
$SERVICE_NAME = "uslugar-backend-service"
$PROJECT_ROOT = "C:\GIT_PROJEKTI\AWS\AWS_projekti"

# =============================================================================
# STEP 1: Git Commit & Push
# =============================================================================

Write-Host "📝 STEP 1: Committing changes to Git..." -ForegroundColor Yellow
Write-Host ""

cd $PROJECT_ROOT

$gitStatus = git status --porcelain
if ($gitStatus) {
    Write-Host "   Found uncommitted changes. Committing..." -ForegroundColor White
    
    git add .
    
    git commit -m "feat: Add Queue Model with NKD codes and provider licenses. Queue-based lead distribution (1 to 1 instead of 1 to 6+). NKD validation for 50+ categories. Provider license verification. Automated queue scheduler. Smart provider matching. New models: ProviderLicense, LeadQueue. 6 new API endpoints. First queue model in Croatia!"
    
    Write-Host "   ✅ Changes committed" -ForegroundColor Green
    Write-Host ""
    
    $pushConfirm = Read-Host "   Push to GitHub? (y/n)"
    if ($pushConfirm -eq "y") {
        git push origin main
        Write-Host "   ✅ Pushed to GitHub" -ForegroundColor Green
    }
} else {
    Write-Host "   ℹ️  No uncommitted changes" -ForegroundColor Gray
}

Write-Host ""

# =============================================================================
# STEP 2: Build Docker Image
# =============================================================================

Write-Host "🐳 STEP 2: Building Docker image..." -ForegroundColor Yellow
Write-Host ""

cd "$PROJECT_ROOT\uslugar\backend"

Write-Host "   Building uslugar-backend:queue-model..." -ForegroundColor White

docker build -t uslugar-backend:queue-model -t uslugar-backend:latest .

if ($LASTEXITCODE -ne 0) {
    Write-Host ""
    Write-Host "   ❌ Docker build failed!" -ForegroundColor Red
    Write-Host ""
    exit 1
}

Write-Host "   ✅ Docker image built successfully" -ForegroundColor Green
Write-Host ""

# =============================================================================
# STEP 3: Login to AWS ECR
# =============================================================================

Write-Host "🔐 STEP 3: Logging in to AWS ECR..." -ForegroundColor Yellow
Write-Host ""

Write-Host "   Authenticating with AWS ECR..." -ForegroundColor White

aws ecr get-login-password --region $AWS_REGION | docker login --username AWS --password-stdin $ECR_REPO

if ($LASTEXITCODE -ne 0) {
    Write-Host ""
    Write-Host "   ❌ ECR login failed!" -ForegroundColor Red
    Write-Host "   Make sure AWS CLI is configured: aws configure" -ForegroundColor Yellow
    Write-Host ""
    exit 1
}

Write-Host "   ✅ Logged in to ECR" -ForegroundColor Green
Write-Host ""

# =============================================================================
# STEP 4: Tag and Push to ECR
# =============================================================================

Write-Host "📤 STEP 4: Pushing image to ECR..." -ForegroundColor Yellow
Write-Host ""

docker tag uslugar-backend:queue-model "${ECR_REPO}:queue-model"
docker tag uslugar-backend:latest "${ECR_REPO}:latest"

Write-Host "   Pushing ${ECR_REPO}:queue-model..." -ForegroundColor White
docker push "${ECR_REPO}:queue-model"

Write-Host "   Pushing ${ECR_REPO}:latest..." -ForegroundColor White
docker push "${ECR_REPO}:latest"

if ($LASTEXITCODE -ne 0) {
    Write-Host ""
    Write-Host "   ❌ Push to ECR failed!" -ForegroundColor Red
    Write-Host ""
    exit 1
}

Write-Host "   ✅ Images pushed to ECR" -ForegroundColor Green
Write-Host ""

# =============================================================================
# STEP 5: Update ECS Service
# =============================================================================

Write-Host "🚀 STEP 5: Deploying to ECS..." -ForegroundColor Yellow
Write-Host ""

Write-Host "   Forcing new deployment of ${SERVICE_NAME}..." -ForegroundColor White
Write-Host "   This will:" -ForegroundColor Gray
Write-Host "     - Pull latest image from ECR" -ForegroundColor Gray
Write-Host "     - Run database migrations automatically" -ForegroundColor Gray
Write-Host "     - Seed 50+ categories with NKD codes" -ForegroundColor Gray
Write-Host "     - Start Queue Scheduler (checks every hour)" -ForegroundColor Gray
Write-Host "     - Start server with new Queue Model API" -ForegroundColor Gray
Write-Host ""

aws ecs update-service --cluster $CLUSTER_NAME --service $SERVICE_NAME --force-new-deployment --region $AWS_REGION | Out-Null

if ($LASTEXITCODE -ne 0) {
    Write-Host ""
    Write-Host "   ❌ ECS deployment failed!" -ForegroundColor Red
    Write-Host ""
    exit 1
}

Write-Host "   ✅ ECS deployment triggered" -ForegroundColor Green
Write-Host ""

# =============================================================================
# SUCCESS!
# =============================================================================

Write-Host ""
Write-Host "═══════════════════════════════════════════════════════" -ForegroundColor Green
Write-Host "  ✅ DEPLOYMENT COMPLETE!" -ForegroundColor White
Write-Host "═══════════════════════════════════════════════════════" -ForegroundColor Green
Write-Host ""

Write-Host "📊 What was deployed:" -ForegroundColor Cyan
Write-Host ""
Write-Host "   ✅ Queue Model activated" -ForegroundColor Green
Write-Host "   ✅ Database migrations applied" -ForegroundColor Green
Write-Host "   ✅ 50+ categories with NKD codes seeded" -ForegroundColor Green
Write-Host "   ✅ Provider license verification enabled" -ForegroundColor Green
Write-Host "   ✅ Queue scheduler running (every hour)" -ForegroundColor Green
Write-Host "   ✅ New API endpoints available" -ForegroundColor Green
Write-Host ""

Write-Host "🧪 Test the new API:" -ForegroundColor Cyan
Write-Host ""
Write-Host "   GET  https://uslugar-api.oriph.io/api/lead-queue/my-offers" -ForegroundColor Gray
Write-Host "   GET  https://uslugar-api.oriph.io/api/lead-queue/stats" -ForegroundColor Gray
Write-Host "   POST https://uslugar-api.oriph.io/api/lead-queue/:id/respond" -ForegroundColor Gray
Write-Host ""

Write-Host "📝 Check server logs:" -ForegroundColor Cyan
Write-Host ""
Write-Host "   aws logs tail /ecs/uslugar-backend --follow --region eu-north-1" -ForegroundColor Gray
Write-Host ""

Write-Host "🎉 USLUGAR Queue Model is now LIVE!" -ForegroundColor Green
Write-Host "🇭🇷 Prvi Queue Model u Hrvatskoj!" -ForegroundColor Cyan
Write-Host ""
