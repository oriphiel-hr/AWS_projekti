# Direct SQL Fix - Run via ECS Exec
# Applies projectType fix directly to production database

Write-Host "🔧 Applying projectType fix to production database" -ForegroundColor Cyan
Write-Host ""

$AWS_REGION = "eu-north-1"
$CLUSTER_NAME = "uslugar-cluster"

# Get running task
Write-Host "Getting ECS task ARN..." -ForegroundColor Yellow
$tasks = aws ecs list-tasks --cluster $CLUSTER_NAME --region $AWS_REGION --query 'taskArns[0]' --output text

if (-not $tasks -or $tasks -eq "None") {
    Write-Host "❌ No running tasks found!" -ForegroundColor Red
    exit 1
}

Write-Host "Task ARN: $tasks" -ForegroundColor Gray
Write-Host ""

# SQL fix
$sql = @"
ALTER TABLE \"Job\" ADD COLUMN IF NOT EXISTS \"projectType\" TEXT;
ALTER TABLE \"Job\" ADD COLUMN IF NOT EXISTS \"customFields\" JSONB;
"@

Write-Host "Running SQL migration..." -ForegroundColor Yellow
Write-Host "SQL:"
Write-Host $sql
Write-Host ""

# Execute SQL via ECS
Write-Host "Connecting to ECS task..." -ForegroundColor Yellow

# Create temp SQL file on container
$sqlCommands = @'
ALTER TABLE "Job" ADD COLUMN IF NOT EXISTS "projectType" TEXT;
ALTER TABLE "Job" ADD COLUMN IF NOT EXISTS "customFields" JSONB;
'@

# Save to temp file
$tempFile = "temp_fix.sql"
$sqlCommands | Out-File -FilePath $tempFile -Encoding utf8

# Copy file to container and execute
Write-Host "Uploading SQL to container..." -ForegroundColor Yellow

aws ecs execute-command `
    --cluster $CLUSTER_NAME `
    --task $tasks `
    --container uslugar `
    --region $AWS_REGION `
    --command "cat > /tmp/fix.sql && psql `$DATABASE_URL -f /tmp/fix.sql" `
    --interactive `
    --input $sqlCommands

# Cleanup
Remove-Item $tempFile -ErrorAction SilentlyContinue

Write-Host ""
Write-Host "✅ Done! Check: https://uslugar.oriph.io/#leads" -ForegroundColor Green

