Write-Host "🚀 Finalizing Sudreg deployment..." -ForegroundColor Cyan

# Kreiraj temp direktorij
$tempDir = "$env:TEMP\uslugar"
if (-not (Test-Path $tempDir)) {
    New-Item -ItemType Directory -Path $tempDir | Out-Null
}

# Get current task definition
Write-Host "📥 Downloading current task definition..." -ForegroundColor Yellow
aws ecs describe-task-definition --task-definition uslugar:252 --region eu-north-1 --query 'taskDefinition' > "$tempDir\task-def.json"

# Read and update JSON
$json = Get-Content "$tempDir\task-def.json" -Raw | ConvertFrom-Json

# Add environment variables
$newEnvVar1 = @{
    name  = 'SUDREG_CLIENT_ID'
    value = 'UcfrGwvRv3uGkqvYnUMxIA..'
}

$newEnvVar2 = @{
    name  = 'SUDREG_CLIENT_SECRET'
    value = '-TX-7q_UfffSEaRmGIP4bA..'
}

# Add to first container
$json.containerDefinitions[0].environment += $newEnvVar1
$json.containerDefinitions[0].environment += $newEnvVar2

# Remove unwanted fields for registration
$json.PSObject.Properties.Remove('taskDefinitionArn')
$json.PSObject.Properties.Remove('revision')
$json.PSObject.Properties.Remove('status')
$json.PSObject.Properties.Remove('requiresAttributes')
$json.PSObject.Properties.Remove('compatibilities')
$json.PSObject.Properties.Remove('registeredAt')
$json.PSObject.Properties.Remove('registeredBy')

# Save updated JSON
$json | ConvertTo-Json -Depth 10 -Compress | Out-File -FilePath "$tempDir\new-task-def.json" -Encoding utf8 -NoNewline

Write-Host "📝 Registering new task definition..." -ForegroundColor Yellow
$newTaskDefArn = aws ecs register-task-definition --cli-input-json "file://$tempDir/new-task-def.json" --region eu-north-1 --query 'taskDefinition.taskDefinitionArn' --output text

Write-Host "🔄 Force deploying with new task definition..." -ForegroundColor Yellow
aws ecs update-service --cluster apps-cluster --service uslugar-service-2gk1f1mv --task-definition $newTaskDefArn --force-new-deployment --region eu-north-1 | Out-Null

# Cleanup
Remove-Item "$tempDir\*" -Force

Write-Host "✅ Done! Wait ~5 minutes for deployment." -ForegroundColor Green
Write-Host "📊 Monitor: https://eu-north-1.console.aws.amazon.com/ecs/v2/clusters/apps-cluster/services" -ForegroundColor Cyan

