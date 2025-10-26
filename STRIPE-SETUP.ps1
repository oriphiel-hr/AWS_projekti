# Stripe Setup via PowerShell
Write-Host "🔧 Starting Stripe configuration..." -ForegroundColor Cyan

# 1. Get current task definition
Write-Host "📥 Fetching current task definition..." -ForegroundColor Yellow
aws ecs describe-task-definition --task-definition uslugar:203 --region eu-north-1 --output json > task-def.json

# 2. Create Python script to fix JSON
Write-Host "🔨 Preparing JSON..." -ForegroundColor Yellow
@"
import json

with open('task-def.json', 'r') as f:
    data = json.load(f)

task_def = data['taskDefinition']

# Remove ALL read-only fields
read_only_fields = [
    'taskDefinitionArn', 'revision', 'status', 'registeredAt', 'registeredBy',
    'requiresAttributes', 'compatibilities'
]

for field in read_only_fields:
    task_def.pop(field, None)

# Update secrets in first container
container = task_def['containerDefinitions'][0]
new_secrets = [s for s in container.get('secrets', []) 
             if s['name'] not in ['STRIPE_SECRET_KEY', 'STRIPE_PUBLISHABLE_KEY']]

# Add new Stripe secrets
new_secrets.extend([
    {
        'name': 'STRIPE_SECRET_KEY',
        'valueFrom': 'arn:aws:secretsmanager:eu-north-1:666203386231:secret:uslugar/stripe-secret-key-jKdcdD'
    },
    {
        'name': 'STRIPE_PUBLISHABLE_KEY',
        'valueFrom': 'arn:aws:secretsmanager:eu-north-1:666203386231:secret:uslugar/stripe-publishable-key-37rvJI'
    }
])

container['secrets'] = new_secrets

with open('task-def-fixed.json', 'w') as f:
    json.dump(task_def, f, indent=2)

print("✅ Fixed JSON created")
"@ | Out-File -FilePath fix-json.py -Encoding UTF8

# 3. Run Python script
python fix-json.py

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Python script failed" -ForegroundColor Red
    exit 1
}

# 4. Register new task definition
Write-Host "📝 Registering new task definition..." -ForegroundColor Yellow
$newRevision = aws ecs register-task-definition --cli-input-json file://task-def-fixed.json --region eu-north-1 --query 'taskDefinition.revision' --output text

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Failed to register task definition" -ForegroundColor Red
    Get-Content task-def-fixed.json | Select-Object -First 5
    exit 1
}

Write-Host "✅ New revision created: uslugar:$newRevision" -ForegroundColor Green

# 5. Update ECS service
Write-Host "🚀 Updating ECS service..." -ForegroundColor Yellow
aws ecs update-service --cluster apps-cluster --service uslugar-service-2gk1f1mv --task-definition "uslugar:$newRevision" --force-new-deployment --region eu-north-1

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Failed to update service" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "✅ Deployment started!" -ForegroundColor Green
Write-Host "📊 Wait 2-3 minutes, then check status:" -ForegroundColor Cyan
Write-Host "   aws logs tail /ecs/uslugar --follow --region eu-north-1 --filter-pattern `"STRIPE`"" -ForegroundColor Gray
Write-Host ""
Write-Host "🎉 Stripe should be working after deployment completes!" -ForegroundColor Green

# Cleanup
Remove-Item task-def.json, task-def-fixed.json, fix-json.py -ErrorAction SilentlyContinue

