# PowerShell script to seed documentation on AWS ECS

Write-Host "=========================================" -ForegroundColor Cyan
Write-Host "  SEED DOCUMENTATION ON AWS ECS" -ForegroundColor Cyan
Write-Host "=========================================" -ForegroundColor Cyan
Write-Host ""

# Configuration
$CLUSTER = "apps-cluster"
$SERVICE = "uslugar-service-2gk1f1mv"
$REGION = "eu-north-1"

Write-Host "1. Finding running ECS task..." -ForegroundColor Yellow

# Get task ARN
$taskArn = aws ecs list-tasks --cluster $CLUSTER --service-name $SERVICE --region $REGION --query 'taskArns[0]' --output text

if (-Not $taskArn -or $taskArn -eq "None") {
    Write-Host "ERROR: No running tasks found!" -ForegroundColor Red
    Write-Host "Make sure ECS service is running." -ForegroundColor Yellow
    exit 1
}

Write-Host "   Task: $taskArn" -ForegroundColor Green
Write-Host ""

Write-Host "2. Running documentation seed..." -ForegroundColor Yellow
Write-Host "   This will update all feature documentation in the database" -ForegroundColor Gray
Write-Host ""

# Run documentation seed
aws ecs execute-command `
    --cluster $CLUSTER `
    --task $taskArn `
    --container uslugar `
    --region $REGION `
    --interactive `
    --command "cd /app && npm run seed:documentation" `
    2>&1

Write-Host ""
Write-Host "=========================================" -ForegroundColor Cyan
Write-Host "Done! Check results above." -ForegroundColor Green
Write-Host "Documentation should now be updated at:" -ForegroundColor Gray
Write-Host "https://uslugar.oriph.io/#documentation" -ForegroundColor Cyan
Write-Host "=========================================" -ForegroundColor Cyan

