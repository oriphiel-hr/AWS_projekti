# Quick script to check backend status

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Backend Status Check" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

$AWS_REGION = "eu-north-1"
$CLUSTER = "apps-cluster"
$SERVICE = "uslugar-service-2gk1f1mv"

Write-Host "1. Checking ECS Service Status..." -ForegroundColor Yellow
Write-Host ""

try {
    $serviceInfo = aws ecs describe-services `
        --cluster $CLUSTER `
        --services $SERVICE `
        --region $AWS_REGION `
        --query "services[0].{Status:status,DesiredCount:desiredCount,RunningCount:runningCount,TaskDefinition:taskDefinition,Deployments:deployments[*].{Status:status,RunningCount:runningCount,DesiredCount:desiredCount}}" `
        --output json 2>&1 | ConvertFrom-Json
    
    Write-Host "  Service Status: $($serviceInfo.Status)" -ForegroundColor $(if ($serviceInfo.Status -eq 'ACTIVE') { 'Green' } else { 'Yellow' })
    Write-Host "  Desired Tasks: $($serviceInfo.DesiredCount)" -ForegroundColor White
    Write-Host "  Running Tasks: $($serviceInfo.RunningCount)" -ForegroundColor $(if ($serviceInfo.RunningCount -eq $serviceInfo.DesiredCount) { 'Green' } else { 'Yellow' })
    Write-Host "  Task Definition: $($serviceInfo.TaskDefinition)" -ForegroundColor White
    Write-Host ""
    
    if ($serviceInfo.Deployments) {
        Write-Host "  Deployments:" -ForegroundColor Yellow
        foreach ($deployment in $serviceInfo.Deployments) {
            Write-Host "    - Status: $($deployment.Status), Running: $($deployment.RunningCount)/$($deployment.DesiredCount)" -ForegroundColor White
        }
    }
    
} catch {
    Write-Host "  ❌ Error checking service status" -ForegroundColor Red
    Write-Host "  $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""
Write-Host "2. Checking Recent Backend Logs..." -ForegroundColor Yellow
Write-Host ""

try {
    $logs = aws logs tail /ecs/uslugar --since 5m --region $AWS_REGION --format short 2>&1
    
    if ($logs) {
        $corsLogs = $logs | Select-String -Pattern "CORS|Allowed origins" -CaseSensitive:$false | Select-Object -Last 5
        if ($corsLogs) {
            Write-Host "  Recent CORS logs:" -ForegroundColor Cyan
            $corsLogs | ForEach-Object { Write-Host "    $_" -ForegroundColor Gray }
        } else {
            Write-Host "  No CORS logs found in last 5 minutes" -ForegroundColor Gray
        }
        
        $errorLogs = $logs | Select-String -Pattern "error|Error|ERROR|fail|Fail|FAIL" -CaseSensitive:$false | Select-Object -Last 5
        if ($errorLogs) {
            Write-Host ""
            Write-Host "  Recent errors:" -ForegroundColor Red
            $errorLogs | ForEach-Object { Write-Host "    $_" -ForegroundColor Red }
        }
        
        $startLogs = $logs | Select-String -Pattern "Server listening|CORS.*Allowed origins" -CaseSensitive:$false | Select-Object -Last 3
        if ($startLogs) {
            Write-Host ""
            Write-Host "  Server startup info:" -ForegroundColor Green
            $startLogs | ForEach-Object { Write-Host "    $_" -ForegroundColor Gray }
        }
    } else {
        Write-Host "  No logs found" -ForegroundColor Yellow
    }
    
} catch {
    Write-Host "  ⚠️  Could not fetch logs" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "3. Testing API Health Endpoint..." -ForegroundColor Yellow
Write-Host ""

try {
    $response = Invoke-WebRequest -Uri "https://uslugar.api.oriph.io/api/health" -Method GET -TimeoutSec 5 -ErrorAction SilentlyContinue
    Write-Host "  ✅ Health endpoint responding: $($response.StatusCode)" -ForegroundColor Green
    Write-Host "  Response: $($response.Content)" -ForegroundColor Gray
} catch {
    Write-Host "  ❌ Health endpoint not responding" -ForegroundColor Red
    Write-Host "  Error: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""
Write-Host "4. Testing API with CORS..." -ForegroundColor Yellow
Write-Host ""

try {
    $headers = @{
        "Origin" = "https://uslugar.oriph.io"
        "Content-Type" = "application/json"
    }
    
    $body = @{
        email = "test@test.com"
        password = "test"
    } | ConvertTo-Json
    
    $response = Invoke-WebRequest -Uri "https://uslugar.api.oriph.io/api/auth/login" -Method POST -Headers $headers -Body $body -TimeoutSec 5 -ErrorAction SilentlyContinue
    
    Write-Host "  ✅ API responding: $($response.StatusCode)" -ForegroundColor Green
    
    $corsHeader = $response.Headers['Access-Control-Allow-Origin']
    if ($corsHeader) {
        Write-Host "  ✅ CORS header present: $corsHeader" -ForegroundColor Green
    } else {
        Write-Host "  ⚠️  CORS header missing" -ForegroundColor Yellow
    }
    
} catch {
    Write-Host "  ❌ API not responding" -ForegroundColor Red
    Write-Host "  Error: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Status Check Complete" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

