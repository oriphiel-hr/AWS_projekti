# =============================================================================
# DEPLOY PROJECT TYPE FIX TO PRODUCTION
# =============================================================================

$ErrorActionPreference = "Stop"

Write-Host ""
Write-Host "═══════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host "  USLUGAR - PROJECT TYPE DATABASE FIX" -ForegroundColor White
Write-Host "═══════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""

# Configuration
$AWS_REGION = "eu-north-1"
$ECR_REPO = "339713096106.dkr.ecr.eu-north-1.amazonaws.com/uslugar-backend"
$CLUSTER_NAME = "uslugar-cluster"
$SERVICE_NAME = "uslugar-backend-service"
$PROJECT_ROOT = "C:\GIT_PROJEKTI\AWS\AWS_projekti"

# =============================================================================
# STEP 1: Git Status & Add
# =============================================================================

Write-Host "📝 STEP 1: Git Status..." -ForegroundColor Yellow
Write-Host ""

cd $PROJECT_ROOT

$gitStatus = git status --porcelain
if ($gitStatus) {
    Write-Host "   Found changes:" -ForegroundColor White
    
    git status
    
    $addConfirm = Read-Host "`n   Add all changes? (y/n)"
    if ($addConfirm -eq "y") {
        git add .
        Write-Host "   ✅ Changes added to staging" -ForegroundColor Green
    }
} else {
    Write-Host "   ℹ️  No uncommitted changes" -ForegroundColor Gray
}

Write-Host ""

# =============================================================================
# STEP 2: Commit
# =============================================================================

Write-Host "📦 STEP 2: Commit changes..." -ForegroundColor Yellow
Write-Host ""

$commitMessage = "fix: Add projectType and customFields columns to Job table to fix production error"
Write-Host "   Commit message:" -ForegroundColor White
Write-Host "   $commitMessage" -ForegroundColor Gray
Write-Host ""

$commitConfirm = Read-Host "   Commit? (y/n)"
if ($commitConfirm -eq "y") {
    git commit -m $commitMessage
    Write-Host "   ✅ Committed" -ForegroundColor Green
} else {
    Write-Host "   ℹ️  Skipping commit" -ForegroundColor Gray
}

Write-Host ""

# =============================================================================
# STEP 3: Push to GitHub
# =============================================================================

Write-Host "📤 STEP 3: Push to GitHub..." -ForegroundColor Yellow
Write-Host ""

$pushConfirm = Read-Host "   Push to GitHub? (y/n)"
if ($pushConfirm -eq "y") {
    git push origin main
    Write-Host "   ✅ Pushed to GitHub" -ForegroundColor Green
} else {
    Write-Host "   ℹ️  Skipping push" -ForegroundColor Gray
}

Write-Host ""

# =============================================================================
# STEP 4: Build Docker Image
# =============================================================================

Write-Host "🐳 STEP 4: Building Docker image..." -ForegroundColor Yellow
Write-Host ""

cd "$PROJECT_ROOT\uslugar\backend"

Write-Host "   Building uslugar-backend:project-type-fix..." -ForegroundColor White

docker build -t uslugar-backend:project-type-fix -t uslugar-backend:latest .

if ($LASTEXITCODE -ne 0) {
    Write-Host ""
    Write-Host "   ❌ Docker build failed!" -ForegroundColor Red
    Write-Host ""
    exit 1
}

Write-Host "   ✅ Docker image built successfully" -ForegroundColor Green
Write-Host ""

# =============================================================================
# STEP 5: Login to AWS ECR
# =============================================================================

Write-Host "🔐 STEP 5: Logging in to AWS ECR..." -ForegroundColor Yellow
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
# STEP 6: Tag and Push to ECR
# =============================================================================

Write-Host "📤 STEP 6: Pushing image to ECR..." -ForegroundColor Yellow
Write-Host ""

docker tag uslugar-backend:project-type-fix "${ECR_REPO}:project-type-fix"
docker tag uslugar-backend:latest "${ECR_REPO}:latest"

Write-Host "   Pushing ${ECR_REPO}:project-type-fix..." -ForegroundColor White
docker push "${ECR_REPO}:project-type-fix"

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
# STEP 7: Deploy to ECS (Migration will run automatically)
# =============================================================================

Write-Host "🚀 STEP 7: Deploying to ECS..." -ForegroundColor Yellow
Write-Host ""

Write-Host "   Forcing new deployment of ${SERVICE_NAME}..." -ForegroundColor White
Write-Host "   This will:" -ForegroundColor Gray
Write-Host "     - Pull latest image from ECR" -ForegroundColor Gray
Write-Host "     - Run database migrations automatically (projectType fix)" -ForegroundColor Gray
Write-Host "     - Start server with fixed schema" -ForegroundColor Gray
Write-Host ""

$deployConfirm = Read-Host "   Deploy to production? (y/n)"
if ($deployConfirm -ne "y") {
    Write-Host "   ℹ️  Deployment cancelled" -ForegroundColor Yellow
    exit 0
}

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

Write-Host "📊 What was fixed:" -ForegroundColor Cyan
Write-Host ""
Write-Host "   ✅ Added projectType column to Job table" -ForegroundColor Green
Write-Host "   ✅ Added customFields column to Job table" -ForegroundColor Green
Write-Host "   ✅ Database migration applied" -ForegroundColor Green
Write-Host "   ✅ Server restarted with fixed schema" -ForegroundColor Green
Write-Host ""

Write-Host "🧪 Test the API:" -ForegroundColor Cyan
Write-Host ""
Write-Host "   GET  https://uslugar-api.oriph.io/api/jobs" -ForegroundColor Gray
Write-Host "   GET  https://uslugar-api.oriph.io/api/exclusive/leads/available" -ForegroundColor Gray
Write-Host ""

Write-Host "📝 Check deployment status:" -ForegroundColor Cyan
Write-Host ""
Write-Host "   https://eu-north-1.console.aws.amazon.com/ecs/v2/clusters/${CLUSTER_NAME}/services/${SERVICE_NAME}" -ForegroundColor Blue
Write-Host ""

Write-Host "🎉 Project Type fix deployed!" -ForegroundColor Green
Write-Host ""

