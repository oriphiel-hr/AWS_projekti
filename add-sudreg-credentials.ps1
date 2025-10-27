# Add Sudski Registar API Credentials to AWS Secrets Manager

$clientId = "UcfrGwvRv3uGkqvYnUMxIA.."
$clientSecret = "-TX-7q_UfffSEaRmGIP4bA.."

Write-Host "🔐 Adding Sudski registar API credentials..." -ForegroundColor Cyan

# Get current secret if exists
$secretArn = aws secretsmanager list-secrets --region eu-north-1 --query "SecretList[?starts_with(Name, 'uslugar')].ARN" --output text | Select-Object -First 1

if ($secretArn) {
    Write-Host "✅ Found existing secret: $secretArn" -ForegroundColor Green
    
    # Get current secret value
    $currentSecret = aws secretsmanager get-secret-value --secret-id $secretArn --region eu-north-1 --query 'SecretString' --output text
    
    try {
        $secretJson = $currentSecret | ConvertFrom-Json
    } catch {
        Write-Host "⚠️  Current secret is not JSON, will create new structure" -ForegroundColor Yellow
        $secretJson = @{}
    }
    
    # Add Sudreg credentials
    $secretJson | Add-Member -MemberType NoteProperty -Name "SUDREG_CLIENT_ID" -Value $clientId -Force
    $secretJson | Add-Member -MemberType NoteProperty -Name "SUDREG_CLIENT_SECRET" -Value $clientSecret -Force
    
    $newSecretString = $secretJson | ConvertTo-Json -Compress
    
    Write-Host "📝 Updating secret..." -ForegroundColor Yellow
    aws secretsmanager update-secret `
        --secret-id $secretArn `
        --secret-string "$newSecretString" `
        --region eu-north-1
    
    Write-Host "✅ Secret updated successfully!" -ForegroundColor Green
    
} else {
    Write-Host "⚠️  No existing secret found. Creating new secret..." -ForegroundColor Yellow
    
    $secretJson = @{
        SUDREG_CLIENT_ID = $clientId
        SUDREG_CLIENT_SECRET = $clientSecret
    } | ConvertTo-Json -Compress
    
    $newSecretArn = aws secretsmanager create-secret `
        --name uslugar-backend-secrets `
        --secret-string "$secretJson" `
        --region eu-north-1 `
        --query 'ARN' `
        --output text
    
    Write-Host "✅ New secret created: $newSecretArn" -ForegroundColor Green
}

Write-Host ""
Write-Host "🔄 Now force redeploying ECS service..." -ForegroundColor Cyan

# Force new deployment
aws ecs update-service `
    --cluster apps-cluster `
    --service uslugar-service-2gk1f1mv `
    --force-new-deployment `
    --region eu-north-1 `
    --query 'service.status' `
    --output text

Write-Host ""
Write-Host "✅ Deployment started! Wait ~5 minutes for ECS to restart." -ForegroundColor Green
Write-Host ""
Write-Host "📊 Monitor progress:" -ForegroundColor Cyan
Write-Host "  https://eu-north-1.console.aws.amazon.com/ecs/v2/clusters/apps-cluster/services" -ForegroundColor Gray
Write-Host ""
Write-Host "🧪 Test after deployment:" -ForegroundColor Cyan
Write-Host "  https://uslugar.oriph.io/#register-provider" -ForegroundColor Gray
Write-Host ""

