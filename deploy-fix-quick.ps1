# Quick Deploy - No Prompts
# Deploys projectType fix to AWS ECS

Write-Host "🚀 Quick Deploy: Project Type Fix" -ForegroundColor Cyan
Write-Host ""

$AWS_REGION = "eu-north-1"
$ECR_REPO = "339713096106.dkr.ecr.eu-north-1.amazonaws.com/uslugar-backend"
$CLUSTER_NAME = "uslugar-cluster" 
$SERVICE_NAME = "uslugar-backend-service"

cd uslugar\backend

Write-Host "Building Docker image..." -ForegroundColor Yellow
docker build -t uslugar-backend:fix . 2>&1 | Out-Null

Write-Host "Tagging..." -ForegroundColor Yellow
docker tag uslugar-backend:fix "${ECR_REPO}:latest"

Write-Host "Logging to ECR..." -ForegroundColor Yellow  
aws ecr get-login-password --region $AWS_REGION | docker login --username AWS --password-stdin $ECR_REPO 2>&1 | Out-Null

Write-Host "Pushing to ECR..." -ForegroundColor Yellow
docker push "${ECR_REPO}:latest" 2>&1 | Out-Null

Write-Host "Deploying to ECS..." -ForegroundColor Yellow
aws ecs update-service --cluster $CLUSTER_NAME --service $SERVICE_NAME --force-new-deployment --region $AWS_REGION 2>&1 | Out-Null

Write-Host ""
Write-Host "✅ Deployment complete!" -ForegroundColor Green
Write-Host "Migration will run automatically on startup" -ForegroundColor Gray
Write-Host ""
Write-Host "Check: https://uslugar.oriph.io/#leads" -ForegroundColor Cyan

