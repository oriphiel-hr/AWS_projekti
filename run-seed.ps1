# Run Prisma seed via ECS task

Write-Host "=== Running Prisma Seed ===" -ForegroundColor Cyan
Write-Host ""

# Create container definition
$containerDef = @{
    name = "prisma-seed-task"
    image = "666203386231.dkr.ecr.eu-north-1.amazonaws.com/uslugar-prisma-tasks:latest"
    essential = $true
    environment = @(
        @{ name = "PRISMA_OPENSSL_VERSION"; value = "3.0.x" }
    )
    secrets = @(
        @{
            name = "DATABASE_URL"
            valueFrom = "arn:aws:secretsmanager:eu-north-1:666203386231:secret:uslugar-db-secret:DATABASE_URL::"
        }
    )
    logConfiguration = @{
        logDriver = "awslogs"
        options = @{
            "awslogs-region" = "eu-north-1"
            "awslogs-group" = "/ecs/uslugar/prisma"
            "awslogs-stream-prefix" = "manual-seed"
        }
    }
    command = @(
        "sh",
        "-lc",
        "npx prisma generate --schema=./prisma/schema.prisma && npm run seed"
    )
} | ConvertTo-Json -Depth 10 -Compress

Write-Host "Container definition created"

# Register task definition
Write-Host "Registering task definition..."
$tdArn = aws ecs register-task-definition `
  --family uslugar-prisma-seed-manual `
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

# Wait for task
aws ecs wait tasks-stopped --cluster "apps-cluster" --tasks $taskArn --region eu-north-1

Write-Host ""
Write-Host "=== Task Completed ===" -ForegroundColor Cyan

# Get task details
Write-Host "Getting task details..."
$taskDetails = aws ecs describe-tasks --cluster apps-cluster --tasks $taskArn --region eu-north-1 | ConvertFrom-Json
$exitCode = $taskDetails.tasks[0].containers[0].exitCode
$stoppedReason = $taskDetails.tasks[0].stoppedReason

Write-Host "Exit code: $exitCode" -ForegroundColor $(if ($exitCode -eq 0) { "Green" } else { "Red" })
if ($stoppedReason) {
    Write-Host "Stopped reason: $stoppedReason" -ForegroundColor Yellow
}

# Get logs
Write-Host ""
Write-Host "=== Task Logs ===" -ForegroundColor Yellow
$taskId = $taskArn.Split('/')[-1]

try {
    $logOutput = aws logs get-log-events `
      --log-group-name "/ecs/uslugar/prisma" `
      --log-stream-name "manual-seed/prisma-seed-task/$taskId" `
      --region eu-north-1 `
      --query "events[*].message" `
      --output text `
      --limit 200
    Write-Host $logOutput
} catch {
    Write-Host "Could not retrieve logs: $_" -ForegroundColor Yellow
}

Write-Host ""
if ($exitCode -eq 0) {
    Write-Host "✅ Seed completed successfully!" -ForegroundColor Green
} else {
    Write-Host "❌ Seed failed with exit code: $exitCode" -ForegroundColor Red
}

Write-Host ""
Write-Host "=== Done ===" -ForegroundColor Green
