# USLUGAR - Pokretanje SQL migracije kategorija
# ==============================================

Write-Host "🌱 USLUGAR - Pokretanje SQL migracije kategorija" -ForegroundColor Green
Write-Host "===============================================" -ForegroundColor Green

# Pokreni SQL migraciju kroz ECS task
Write-Host "🚀 Pokretanje SQL migracije..." -ForegroundColor Yellow

# Pronađi subnet
$subnetId = "subnet-0a00f97768705bbcf"
$securityGroupId = aws ec2 describe-security-groups --filters "Name=group-name,Values=*ecs*" --query 'SecurityGroups[0].GroupId' --output text

Write-Host "🌐 Subnet: $subnetId" -ForegroundColor Cyan
Write-Host "🔒 Security Group: $securityGroupId" -ForegroundColor Cyan

# Pokreni task za SQL migraciju
Write-Host "🌱 Pokretanje SQL migracije task-a..." -ForegroundColor Yellow
$taskArn = aws ecs run-task `
    --cluster apps-cluster `
    --task-definition uslugar `
    --launch-type FARGATE `
    --network-configuration "awsvpcConfiguration={subnets=[$subnetId],securityGroups=[$securityGroupId]}" `
    --overrides '{
        "containerOverrides": [{
            "name": "uslugar",
            "command": ["npx", "prisma", "db", "execute", "--file", "add-categories-direct.sql"]
        }]
    }' `
    --query 'tasks[0].taskArn' `
    --output text

Write-Host "✅ SQL migracija task pokrenut: $taskArn" -ForegroundColor Green

# Čekaj da se task završi
Write-Host "⏳ Čekam da se task završi..." -ForegroundColor Yellow
aws ecs wait tasks-stopped --cluster apps-cluster --tasks $taskArn

# Provjeri status
$taskStatus = aws ecs describe-tasks --cluster apps-cluster --tasks $taskArn --query 'tasks[0].lastStatus' --output text
Write-Host "📊 Task status: $taskStatus" -ForegroundColor Cyan

if ($taskStatus -eq "STOPPED") {
    $exitCode = aws ecs describe-tasks --cluster apps-cluster --tasks $taskArn --query 'tasks[0].containers[0].exitCode' --output text
    if ($exitCode -eq "0") {
        Write-Host "✅ SQL migracija uspješno završena!" -ForegroundColor Green
    } else {
        Write-Host "❌ SQL migracija završila s greškom (exit code: $exitCode)" -ForegroundColor Red
        # Prikaži logove
        Write-Host "📋 Logovi:" -ForegroundColor Yellow
        $logStreamName = "ecs/uslugar/" + ($taskArn.Split('/')[-1])
        try {
            aws logs get-log-events `
                --log-group-name /ecs/uslugar `
                --log-stream-name $logStreamName `
                --query 'events[*].message' `
                --output text
        } catch {
            Write-Host "Nije moguće dohvatiti logove" -ForegroundColor Yellow
        }
    }
} else {
    Write-Host "❌ Task nije završio uspješno" -ForegroundColor Red
}

Write-Host "🏁 Gotovo!" -ForegroundColor Green
