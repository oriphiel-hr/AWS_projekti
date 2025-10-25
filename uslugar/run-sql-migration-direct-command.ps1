# USLUGAR - Pokreni SQL migraciju s direktnim komandama
# ====================================================

Write-Host "🌱 USLUGAR - Pokreni SQL migraciju s direktnim komandama" -ForegroundColor Green
Write-Host "===================================================" -ForegroundColor Green

Write-Host "💡 KORAK 1: Kreiraj ECS task za SQL migraciju" -ForegroundColor Yellow
Write-Host "===========================================" -ForegroundColor Yellow

# Kreiraj task definition za SQL migraciju
$taskDef = @{
    containerDefinitions = @(
        @{
            name = "sql-migration"
            image = "postgres:15"
            essential = $true
            environment = @(
                @{
                    name = "PGHOST"
                    value = "uslugar-db.cr80o0eeg3gy.eu-north-1.rds.amazonaws.com"
                },
                @{
                    name = "PGPORT"
                    value = "5432"
                },
                @{
                    name = "PGDATABASE"
                    value = "uslugar"
                },
                @{
                    name = "PGUSER"
                    value = "uslugar_user"
                },
                @{
                    name = "PGPASSWORD"
                    value = "Pastor123"
                }
            )
            command = @(
                "psql",
                "-h", "uslugar-db.cr80o0eeg3gy.eu-north-1.rds.amazonaws.com",
                "-p", "5432",
                "-U", "uslugar_user",
                "-d", "uslugar",
                "-c", "INSERT INTO \"Category\" (id, name, description, icon, \"nkdCode\", \"requiresLicense\", \"licenseType\", \"licenseAuthority\", \"isActive\", \"createdAt\", \"updatedAt\") VALUES ('cat_gradevina', 'Građevina', 'Opći građevinski radovi, renovacije, adaptacije', '🏗️', '41.20', true, 'Građevinska licenca', 'Hrvatska komora inženjera građevinarstva', true, NOW(), NOW()) ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, description = EXCLUDED.description, icon = EXCLUDED.icon, \"nkdCode\" = EXCLUDED.\"nkdCode\", \"requiresLicense\" = EXCLUDED.\"requiresLicense\", \"licenseType\" = EXCLUDED.\"licenseType\", \"licenseAuthority\" = EXCLUDED.\"licenseAuthority\", \"isActive\" = EXCLUDED.\"isActive\", \"updatedAt\" = NOW();"
            )
            logConfiguration = @{
                logDriver = "awslogs"
                options = @{
                    "awslogs-group" = "/ecs/uslugar"
                    "awslogs-create-group" = "true"
                    "awslogs-region" = "eu-north-1"
                    "awslogs-stream-prefix" = "ecs"
                }
            }
        }
    )
    family = "uslugar-sql-migration"
    executionRoleArn = "arn:aws:iam::666203386231:role/ecsTaskExecutionRole"
    networkMode = "awsvpc"
    requiresCompatibilities = @("FARGATE")
    cpu = "256"
    memory = "512"
}

# Spremi task definition
$taskDef | ConvertTo-Json -Depth 10 | Out-File -FilePath "sql-migration-task.json" -Encoding UTF8

# Registriraj task definition
Write-Host "📝 Registriranje SQL migration task definition-a..." -ForegroundColor Yellow
$taskDefArn = aws ecs register-task-definition --cli-input-json file://sql-migration-task.json --query 'taskDefinition.taskDefinitionArn' --output text

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Greška pri registriranju task definition-a" -ForegroundColor Red
    exit 1
}

Write-Host "✅ Task definition registriran: $taskDefArn" -ForegroundColor Green

Write-Host "💡 KORAK 2: Pokreni SQL migraciju" -ForegroundColor Yellow
Write-Host "=============================" -ForegroundColor Yellow

# Pronađi subnet i security group
$subnetId = "subnet-0a00f97768705bbcf"
$securityGroupId = aws ec2 describe-security-groups --filters "Name=group-name,Values=*ecs*" --query 'SecurityGroups[0].GroupId' --output text

Write-Host "🌐 Subnet: $subnetId" -ForegroundColor Cyan
Write-Host "🔒 Security Group: $securityGroupId" -ForegroundColor Cyan

# Pokreni task za SQL migraciju
Write-Host "🌱 Pokretanje SQL migracije..." -ForegroundColor Yellow
$taskArn = aws ecs run-task `
    --cluster apps-cluster `
    --task-definition uslugar-sql-migration `
    --launch-type FARGATE `
    --network-configuration "awsvpcConfiguration={subnets=[$subnetId],securityGroups=[$securityGroupId]}" `
    --query 'tasks[0].taskArn' `
    --output text

Write-Host "✅ SQL migration task pokrenut: $taskArn" -ForegroundColor Green

# Čekaj da se task završi
Write-Host "⏳ Čekam da se SQL migration task završi..." -ForegroundColor Yellow
aws ecs wait tasks-stopped --cluster apps-cluster --tasks $taskArn

# Provjeri status
$status = aws ecs describe-tasks --cluster apps-cluster --tasks $taskArn --query 'tasks[0].lastStatus' --output text
Write-Host "📊 SQL migration task status: $status" -ForegroundColor Cyan

if ($status -eq "STOPPED") {
    $exitCode = aws ecs describe-tasks --cluster apps-cluster --tasks $taskArn --query 'tasks[0].containers[0].exitCode' --output text
    if ($exitCode -eq "0") {
        Write-Host "✅ SQL migracija uspješno završena!" -ForegroundColor Green
        Write-Host "🎉 Kategorije su dodane u bazu podataka!" -ForegroundColor Green
        Write-Host "🌐 Provjerite rezultate na https://uslugar.oriph.io" -ForegroundColor Cyan
    } else {
        Write-Host "❌ SQL migracija završila s greškom (exit code: $exitCode)" -ForegroundColor Red
    }
} else {
    Write-Host "❌ SQL migration task nije završio uspješno" -ForegroundColor Red
}

# Očisti privremene datoteke
Remove-Item "sql-migration-task.json" -ErrorAction SilentlyContinue

Write-Host "🏁 Gotovo!" -ForegroundColor Green
