# Apply cancelledAt fix via ECS task with PostgreSQL container

Write-Host "=== Adding cancelledAt column to Subscription table ===" -ForegroundColor Cyan
Write-Host ""

# SQL command
$sql = "ALTER TABLE `"Subscription`" ADD COLUMN IF NOT EXISTS `"cancelledAt`" TIMESTAMP(3);"

Write-Host "SQL: $sql"
Write-Host ""

# Create container definition
$containerDef = @{
    name = "add-cancelledat"
    image = "postgres:16"
    essential = $true
    environment = @(
        @{ name = "PGHOST"; value = "uslugar-db.cr80o0eeg3gy.eu-north-1.rds.amazonaws.com" }
        @{ name = "PGDATABASE"; value = "uslugar" }
        @{ name = "PGUSER"; value = "uslugar_user" }
    )
    secrets = @(
        @{
            name = "PGPASSWORD"
            valueFrom = "arn:aws:secretsmanager:eu-north-1:666203386231:secret:uslugar-db-secret:password::"
        }
    )
    logConfiguration = @{
        logDriver = "awslogs"
        options = @{
            "awslogs-region" = "eu-north-1"
            "awslogs-group" = "/ecs/uslugar/prisma"
            "awslogs-stream-prefix" = "add-column"
        }
    }
    command = @(
        "psql",
        "-c",
        $sql
    )
} | ConvertTo-Json -Depth 10 -Compress

Write-Host "Registering task definition..."
$tdArn = aws ecs register-task-definition `
  --family uslugar-add-cancelledat `
  --network-mode awsvpc `
  --cpu "256" `
  --memory "512" `
  --requires-compatibilities FARGATE `
  --execution-role-arn "arn:aws:iam::666203386231:role/uslugar-EcsTaskExecutionRole" `
  --container-definitions $containerDef `
  --region eu-north-1 `
  --query "taskDefinition.taskDefinitionArn" `
  --output text

if ($LASTEXITCODE -ne 0) {
    Write-Host "Error registering task definition" -ForegroundColor Red
    exit 1
}

Write-Host "Task definition: $tdArn" -ForegroundColor Green

# Network config
$netConfig = @{
    awsvpcConfiguration = @{
        subnets = @("subnet-0a00f97768705bbcf", "subnet-0546fb6cc0ad2cc37")
        securityGroups = @("sg-084c1e49c9c77aff1")
        assignPublicIp = "ENABLED"
    }
} | ConvertTo-Json -Depth 10 -Compress

Write-Host "Running task..."

$taskArn = aws ecs run-task `
  --cluster "apps-cluster" `
  --launch-type FARGATE `
  --task-definition $tdArn `
  --network-configuration $netConfig `
  --region eu-north-1 `
  --query "tasks[0].taskArn" `
  --output text

if ($LASTEXITCODE -ne 0) {
    Write-Host "Error running task" -ForegroundColor Red
    exit 1
}

Write-Host "Task started: $taskArn" -ForegroundColor Green
Write-Host "Waiting for completion..." -ForegroundColor Yellow

aws ecs wait tasks-stopped --cluster "apps-cluster" --tasks $taskArn --region eu-north-1

Write-Host ""
Write-Host "=== Task Completed ===" -ForegroundColor Cyan

# Get task details
$taskDetails = aws ecs describe-tasks --cluster apps-cluster --tasks $taskArn --region eu-north-1 | ConvertFrom-Json
$exitCode = $taskDetails.tasks[0].containers[0].exitCode

Write-Host "Exit code: $exitCode" -ForegroundColor $(if ($exitCode -eq 0) { "Green" } else { "Red" })

Write-Host ""
if ($exitCode -eq 0) {
    Write-Host "✅ Column added successfully!" -ForegroundColor Green
} else {
    Write-Host "❌ Failed to add column" -ForegroundColor Red
}

Write-Host ""
Write-Host "=== Done ===" -ForegroundColor Green
