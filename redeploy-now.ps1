# Quick Redeploy - Triggers ECS to pull latest code
# Auto-fix runs on server startup

Write-Host "🚀 Redeploying Uslugar to AWS" -ForegroundColor Cyan
Write-Host ""

$AWS_REGION = "eu-north-1"
$CLUSTER_NAME = "apps-cluster"
$SERVICE_NAME = "uslugar-service-2gk1f1mv"

Write-Host "Forcing new ECS deployment..." -ForegroundColor Yellow
Write-Host "This will restart server with auto-fix code" -ForegroundColor Gray
Write-Host ""

aws ecs update-service `
    --cluster $CLUSTER_NAME `
    --service $SERVICE_NAME `
    --force-new-deployment `
    --region $AWS_REGION

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "✅ Deployment triggered!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Server will automatically add projectType columns on startup" -ForegroundColor Gray
    Write-Host ""
    Write-Host "Wait ~2 minutes and test:" -ForegroundColor Cyan
    Write-Host "  https://uslugar.oriph.io/#leads" -ForegroundColor Blue
} else {
    Write-Host ""
    Write-Host "❌ Deployment failed" -ForegroundColor Red
}

