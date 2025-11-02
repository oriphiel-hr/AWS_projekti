# Quick redeploy backend for CORS fix
# This script triggers a redeploy of the backend service with CORS fixes

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Backend CORS Fix - Force Redeploy" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

$AWS_REGION = "eu-north-1"
$CLUSTER = "apps-cluster"
$SERVICE = "uslugar-service-2gk1f1mv"

Write-Host "📋 Configuration:" -ForegroundColor Yellow
Write-Host "  Region: $AWS_REGION" -ForegroundColor White
Write-Host "  Cluster: $CLUSTER" -ForegroundColor White
Write-Host "  Service: $SERVICE" -ForegroundColor White
Write-Host ""

# Check if AWS CLI is available
Write-Host "🔍 Checking AWS CLI..." -ForegroundColor Cyan
try {
    $awsVersion = aws --version 2>&1
    Write-Host "  ✅ AWS CLI found: $awsVersion" -ForegroundColor Green
} catch {
    Write-Host "  ❌ AWS CLI not found. Please install AWS CLI first." -ForegroundColor Red
    exit 1
}

# Check AWS credentials
Write-Host ""
Write-Host "🔐 Checking AWS credentials..." -ForegroundColor Cyan
try {
    $identity = aws sts get-caller-identity --region $AWS_REGION 2>&1
    Write-Host "  ✅ AWS credentials valid" -ForegroundColor Green
} catch {
    Write-Host "  ❌ AWS credentials not configured. Run 'aws configure' first." -ForegroundColor Red
    exit 1
}

# Force new deployment
Write-Host ""
Write-Host "🚀 Forcing new deployment..." -ForegroundColor Cyan
Write-Host "  This will restart the service with the latest task definition" -ForegroundColor White
Write-Host ""

try {
    aws ecs update-service `
        --cluster $CLUSTER `
        --service $SERVICE `
        --force-new-deployment `
        --region $AWS_REGION `
        --no-cli-pager

    Write-Host ""
    Write-Host "  ✅ Deployment triggered successfully!" -ForegroundColor Green
    Write-Host ""
    Write-Host "⏳ Waiting for deployment to stabilize..." -ForegroundColor Yellow
    
    # Wait for service to stabilize
    Write-Host "  (This may take 2-5 minutes)" -ForegroundColor Gray
    
    aws ecs wait services-stable `
        --cluster $CLUSTER `
        --services $SERVICE `
        --region $AWS_REGION `
        --no-cli-pager
    
    Write-Host ""
    Write-Host "  ✅ Deployment completed!" -ForegroundColor Green
    Write-Host ""
    
} catch {
    Write-Host ""
    Write-Host "  ❌ Error during deployment:" -ForegroundColor Red
    Write-Host "  $($_.Exception.Message)" -ForegroundColor Red
    Write-Host ""
    Write-Host "  💡 Tip: Check AWS Console -> ECS -> Services -> $SERVICE" -ForegroundColor Yellow
    exit 1
}

# Verify deployment
Write-Host ""
Write-Host "🔍 Verifying deployment status..." -ForegroundColor Cyan

try {
    $serviceStatus = aws ecs describe-services `
        --cluster $CLUSTER `
        --services $SERVICE `
        --region $AWS_REGION `
        --query 'services[0].{Status:status,DesiredCount:desiredCount,RunningCount:runningCount,TaskDefinition:taskDefinition}' `
        --output json `
        --no-cli-pager | ConvertFrom-Json
    
    Write-Host ""
    Write-Host "  Service Status: $($serviceStatus.Status)" -ForegroundColor $(if ($serviceStatus.Status -eq 'ACTIVE') { 'Green' } else { 'Yellow' })
    Write-Host "  Desired Count: $($serviceStatus.DesiredCount)" -ForegroundColor White
    Write-Host "  Running Count: $($serviceStatus.RunningCount)" -ForegroundColor White
    Write-Host "  Task Definition: $($serviceStatus.TaskDefinition)" -ForegroundColor White
    Write-Host ""
    
    if ($serviceStatus.RunningCount -eq $serviceStatus.DesiredCount) {
        Write-Host "  ✅ All tasks are running!" -ForegroundColor Green
    } else {
        Write-Host "  ⚠️  Some tasks may still be starting..." -ForegroundColor Yellow
    }
    
} catch {
    Write-Host "  ⚠️  Could not verify service status" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "✅ CORS Fix Deployment Complete!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "📝 Next Steps:" -ForegroundColor Yellow
Write-Host "  1. Wait 1-2 minutes for tasks to fully start" -ForegroundColor White
Write-Host "  2. Test admin login at: https://uslugar.oriph.io/admin" -ForegroundColor White
Write-Host "  3. Check backend logs if issues persist:" -ForegroundColor White
Write-Host "     aws logs tail /ecs/uslugar --follow --region $AWS_REGION" -ForegroundColor Gray
Write-Host ""
Write-Host "🔗 Useful Commands:" -ForegroundColor Yellow
Write-Host "  # Check service status:" -ForegroundColor White
Write-Host "  aws ecs describe-services --cluster $CLUSTER --services $SERVICE --region $AWS_REGION" -ForegroundColor Gray
Write-Host ""
Write-Host "  # View recent logs:" -ForegroundColor White
Write-Host "  aws logs tail /ecs/uslugar --since 5m --region $AWS_REGION" -ForegroundColor Gray
Write-Host ""

