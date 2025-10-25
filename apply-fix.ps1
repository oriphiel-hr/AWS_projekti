# Apply cancelledAt fix via ECS task

Write-Host "=== Applying cancelledAt fix ===" -ForegroundColor Cyan
Write-Host ""

# Read SQL
$sql = "ALTER TABLE `"Subscription`" ADD COLUMN IF NOT EXISTS `"cancelledAt`" TIMESTAMP(3);"

# Create container definition
$containerDef = @{
    name = "apply-fix"
    image = "postgres:16"
    essential = $true
    environment = @()
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
            "awslogs-stream-prefix" = "fix"
        }
    }
    command = @(
        "psql",
        "-h", "uslugar-db.cr80o0eeg3gy.eu-north-1.rds.amazonaws.com",
        "-U", "uslugar_user",
        "-d", "uslugar",
        "-c", $sql
    )
} | ConvertTo-Json -Depth 10 -Compress

Write-Host "Registering task..."
$tdArn = aws ecs register-task-definition `
  --family uslugar-apply-fix `
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

Write-Host "Running task..."
$taskArn = aws ecs run-task `
  --cluster "apps-cluster" `
  --launch-type FARGATE `
  --task-definition $tdArn `
  --network-configuration $netConfig `
  --region eu-north-1 `
  --query "tasks[0].taskArn" `
  --output text

Write-Host "Task: $taskArn"
Write-Host "Waiting..."
aws ecs wait tasks-stopped --cluster "apps-cluster" --tasks $taskArn --region eu-north-1

Write-Host ""
Write-Host "Done!" -ForegroundColor Green
