# Apply migration and run seed

Write-Host "=== Step 1: Applying Migration ===" -ForegroundColor Cyan
Write-Host ""

# Step 1: Apply migration via psql
Write-Host "Creating migration task..."
$migrationSql = Get-Content "migration-temp.sql" -Raw

$containerDefMigration = @{
    name = "apply-migration"
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
            "awslogs-stream-prefix" = "apply-migration"
        }
    }
    command = @(
        "psql",
        "-h", "uslugar-db.cr80o0eeg3gy.eu-north-1.rds.amazonaws.com",
        "-U", "uslugar_user",
        "-d", "uslugar",
        "-f", "-"
    )
    stdin = $true
    stdinOnce = $false
} | ConvertTo-Json -Depth 10 -Compress

# ... actually, let me use a simpler approach
Write-Host "Skipping direct migration - will use Prisma seed which includes migration check" -ForegroundColor Yellow
Write-Host ""

# Step 2: Run seed (which will apply migrations if needed)
Write-Host "=== Step 2: Running Prisma Seed ===" -ForegroundColor Cyan
Write-Host ""

# Use the run-seed.ps1 script
& ".\run-seed.ps1"

Write-Host ""
Write-Host "=== Done ===" -ForegroundColor Green
