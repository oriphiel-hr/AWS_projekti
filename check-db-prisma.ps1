# Check database migration status via Prisma container

Write-Host "=== Checking Database via Prisma ===" -ForegroundColor Cyan
Write-Host ""

# Get latest Prisma image
$IMAGE = "666203386231.dkr.ecr.eu-north-1.amazonaws.com/uslugar-prisma-tasks:latest"
Write-Host "Using image: $IMAGE"

# Create container definition JSON
$containerDef = @{
    name = "prisma-check"
    image = $IMAGE
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
            "awslogs-stream-prefix" = "check-db"
        }
    }
    command = @(
        "sh",
        "-c",
        "npx prisma db execute --stdin <<'ENDSQL'
SELECT 
  (SELECT COUNT(*) FROM pg_tables WHERE tablename = 'SubscriptionPlan') as has_subscription_plan,
  (SELECT is_nullable FROM information_schema.columns WHERE table_name = 'Job' AND column_name = 'userId') as job_userid_nullable,
  (SELECT COUNT(*) FROM information_schema.columns WHERE table_name = 'Job' AND column_name IN ('linkingToken', 'linkingTokenExpiresAt')) as has_linking_columns,
  (SELECT COUNT(*) FROM _prisma_migrations WHERE migration_name LIKE '%20250121%') as has_migration;
ENDSQL"
    )
} | ConvertTo-Json -Depth 10 -Compress

Write-Host "Container definition created"

# Register task definition
Write-Host "Registering task definition..."
$tdArn = aws ecs register-task-definition `
  --family uslugar-prisma-check-db `
  --network-mode awsvpc `
  --cpu "256" `
  --memory "512" `
  --requires-compatibilities FARGATE `
  --execution-role-arn "arn:aws:iam::666203386231:role/uslugar-EcsTaskExecutionRole" `
  --container-definitions $containerDef `
  --region eu-north-1 `
  --query "taskDefinition.taskDefinitionArn" `
  --output text

Write-Host "Task definition: $tdArn"

# Network config
$netConfig = @{
    awsvpcConfiguration = @{
        subnets = @("subnet-0a00f97768705bbcf", "subnet-0546fb6cc0ad2cc37")
        securityGroups = @("sg-084c1e49c9c77aff1")
        assignPublicIp = "ENABLED"
    }
} | ConvertTo-Json -Depth 10 -Compress

# Run task
Write-Host "Running task..."
$taskArn = aws ecs run-task `
  --cluster "apps-cluster" `
  --launch-type FARGATE `
  --task-definition $tdArn `
  --network-configuration $netConfig `
  --region eu-north-1 `
  --query "tasks[0].taskArn" `
  --output text

Write-Host "Task started: $taskArn"
Write-Host "Waiting for task to complete..."

# Wait for task
aws ecs wait tasks-stopped `
  --cluster "apps-cluster" `
  --tasks $taskArn `
  --region eu-north-1

# Get logs
Write-Host ""
Write-Host "=== Task Logs ===" -ForegroundColor Yellow
$taskId = $taskArn.Split('/')[-1]
aws logs get-log-events `
  --log-group-name "/ecs/uslugar/prisma" `
  --log-stream-name "check-db/prisma-check/$taskId" `
  --region eu-north-1 `
  --query "events[*].message" `
  --output text

Write-Host ""
Write-Host "=== Done ===" -ForegroundColor Green
