# Update ECS Task Definition with Sudreg credentials

Write-Host "🔄 Updating ECS Task Definition with Sudreg credentials..." -ForegroundColor Cyan

# Get current task definition
$taskDef = aws ecs describe-task-definition --task-definition uslugar:252 --region eu-north-1 --output json | ConvertFrom-Json

# Add new environment variables
$taskDef.taskDefinition.containerDefinitions[0].environment += @(
    @{ name = 'SUDREG_CLIENT_ID'; value = 'UcfrGwvRv3uGkqvYnUMxIA..' },
    @{ name = 'SUDREG_CLIENT_SECRET'; value = '-TX-7q_UfffSEaRmGIP4bA..' }
)

# Convert back to JSON
$json = $taskDef.taskDefinition | ConvertTo-Json -Depth 10 -Compress

# Write to temp file
$json | Out-File -FilePath /tmp/new-task-def.json -Encoding utf8

# Register new task definition
Write-Host "📝 Registering new task definition..." -ForegroundColor Yellow
aws ecs register-task-definition --cli-input-json file:///tmp/new-task-def.json --region eu-north-1

# Force new deployment
Write-Host "🚀 Force deploying new task definition..." -ForegroundColor Yellow
aws ecs update-service --cluster apps-cluster --service uslugar-service-2gk1f1mv --force-new-deployment --region eu-north-1

Write-Host "✅ Done! Wait ~5 minutes for deployment." -ForegroundColor Green

