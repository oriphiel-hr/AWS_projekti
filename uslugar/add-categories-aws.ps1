# USLUGAR - Dodavanje kompletnih kategorija na AWS produkciju
# =============================================================

Write-Host "🌱 USLUGAR - Dodavanje kompletnih kategorija" -ForegroundColor Green
Write-Host "=============================================" -ForegroundColor Green

# Provjeri AWS CLI
try {
    $awsVersion = aws --version 2>$null
    Write-Host "✅ AWS CLI je instaliran: $awsVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ AWS CLI nije instaliran" -ForegroundColor Red
    exit 1
}

# Provjeri AWS konfiguraciju
try {
    $callerIdentity = aws sts get-caller-identity 2>$null
    Write-Host "✅ AWS CLI je konfiguriran" -ForegroundColor Green
} catch {
    Write-Host "❌ AWS CLI nije konfiguriran" -ForegroundColor Red
    exit 1
}

# Pronađi task definition
Write-Host "📋 Pronalazim task definition..." -ForegroundColor Yellow
$taskDefinition = aws ecs describe-task-definition --task-definition uslugar --query 'taskDefinition.taskDefinitionArn' --output text
Write-Host "📋 Task Definition: $taskDefinition" -ForegroundColor Cyan

# Pronađi cluster
$clusterName = aws ecs list-clusters --query 'clusterArns[0]' --output text | ForEach-Object { $_.Split('/')[-1] }
Write-Host "🏗️ Cluster: $clusterName" -ForegroundColor Cyan

# Pronađi subnet i security group
Write-Host "🔍 Pronalazim network konfiguraciju..." -ForegroundColor Yellow
$subnetId = "subnet-0a00f97768705bbcf"  # Prvi subnet iz liste
$securityGroupId = aws ec2 describe-security-groups --filters "Name=group-name,Values=*ecs*" --query 'SecurityGroups[0].GroupId' --output text

Write-Host "🌐 Subnet: $subnetId" -ForegroundColor Cyan
Write-Host "🔒 Security Group: $securityGroupId" -ForegroundColor Cyan

# Pokreni task za seed
Write-Host "🌱 Pokretanje seed task-a..." -ForegroundColor Yellow
$taskArn = aws ecs run-task `
    --cluster $clusterName `
    --task-definition uslugar `
    --launch-type FARGATE `
    --network-configuration "awsvpcConfiguration={subnets=[$subnetId],securityGroups=[$securityGroupId]}" `
    --overrides '{
        "containerOverrides": [{
            "name": "uslugar",
            "command": ["node", "prisma/seed-categories.js"]
        }]
    }' `
    --query 'tasks[0].taskArn' `
    --output text

Write-Host "✅ Seed task pokrenut: $taskArn" -ForegroundColor Green

# Čekaj da se task završi
Write-Host "⏳ Čekam da se task završi..." -ForegroundColor Yellow
aws ecs wait tasks-stopped --cluster $clusterName --tasks $taskArn

# Provjeri status
$taskStatus = aws ecs describe-tasks --cluster $clusterName --tasks $taskArn --query 'tasks[0].lastStatus' --output text
Write-Host "📊 Task status: $taskStatus" -ForegroundColor Cyan

if ($taskStatus -eq "STOPPED") {
    $exitCode = aws ecs describe-tasks --cluster $clusterName --tasks $taskArn --query 'tasks[0].containers[0].exitCode' --output text
    if ($exitCode -eq "0") {
        Write-Host "✅ Kategorije uspješno dodane!" -ForegroundColor Green
    } else {
        Write-Host "❌ Seed task završio s greškom (exit code: $exitCode)" -ForegroundColor Red
        # Prikaži logove
        Write-Host "📋 Logovi:" -ForegroundColor Yellow
        $logStreamName = "ecs/uslugar/" + ($taskArn.Split('/')[-1])
        aws logs get-log-events `
            --log-group-name /ecs/uslugar `
            --log-stream-name $logStreamName `
            --query 'events[*].message' `
            --output text
    }
} else {
    Write-Host "❌ Task nije završio uspješno" -ForegroundColor Red
}

Write-Host "🏁 Gotovo!" -ForegroundColor Green
