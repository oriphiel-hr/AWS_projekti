# USLUGAR - Redeploy backend s novim endpoint-om
# ===============================================

Write-Host "🌱 USLUGAR - Redeploy backend s novim endpoint-om" -ForegroundColor Green
Write-Host "===============================================" -ForegroundColor Green

Write-Host "💡 KORAK 1: Kreiraj novi task definition" -ForegroundColor Yellow
Write-Host "=====================================" -ForegroundColor Yellow

# Kreiraj novi task definition s novim endpoint-om
$newTaskDef = @{
    containerDefinitions = @(
        @{
            name = "uslugar"
            image = "666203386231.dkr.ecr.eu-north-1.amazonaws.com/uslugar:72331f9b839866642ad06c959bc194e4e9bf07fb"
            essential = $true
            portMappings = @(
                @{
                    containerPort = 8080
                    protocol = "tcp"
                }
            )
            environment = @(
                @{
                    name = "PORT"
                    value = "8080"
                },
                @{
                    name = "JWT_SECRET"
                    value = "dev-super-secret"
                }
            )
            secrets = @(
                @{
                    name = "DATABASE_URL"
                    valueFrom = "arn:aws:secretsmanager:eu-north-1:666203386231:secret:uslugar-db-connection-string"
                }
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
        },
        @{
            name = "nginx-proxy"
            image = "nginx:alpine"
            essential = $false
            portMappings = @(
                @{
                    containerPort = 80
                    protocol = "tcp"
                }
            )
            command = @(
                "sh",
                "-c",
                "echo 'server { listen 80; location / { proxy_pass http://localhost:8080; proxy_set_header Host `$host; proxy_set_header X-Real-IP `$remote_addr; proxy_set_header X-Forwarded-For `$proxy_add_x_forwarded_for; proxy_set_header X-Forwarded-Proto `$scheme; } }' > /etc/nginx/conf.d/default.conf && nginx -g 'daemon off;'"
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
    family = "uslugar-with-categories-endpoint"
    executionRoleArn = "arn:aws:iam::666203386231:role/ecsTaskExecutionRole"
    networkMode = "awsvpc"
    requiresCompatibilities = @("FARGATE")
    cpu = "512"
    memory = "1024"
}

# Spremi task definition
$newTaskDef | ConvertTo-Json -Depth 10 | Out-File -FilePath "uslugar-categories-task-def.json" -Encoding UTF8

# Registriraj task definition
Write-Host "📝 Registriranje novog task definition-a..." -ForegroundColor Yellow
$newTaskDefArn = aws ecs register-task-definition --cli-input-json file://uslugar-categories-task-def.json --query 'taskDefinition.taskDefinitionArn' --output text

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Greška pri registriranju task definition-a" -ForegroundColor Red
    exit 1
}

Write-Host "✅ Task definition registriran: $newTaskDefArn" -ForegroundColor Green

Write-Host "💡 KORAK 2: Ažuriraj ECS service" -ForegroundColor Yellow
Write-Host "=============================" -ForegroundColor Yellow

# Ažuriraj service s novim task definition-om
Write-Host "🔄 Ažuriranje ECS service-a..." -ForegroundColor Yellow
aws ecs update-service --cluster apps-cluster --service uslugar-service-2gk1f1mv --task-definition uslugar-with-categories-endpoint

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Greška pri ažuriranju service-a" -ForegroundColor Red
    exit 1
}

Write-Host "✅ Service ažuriran!" -ForegroundColor Green

Write-Host "💡 KORAK 3: Čekaj da se service stabilizira" -ForegroundColor Yellow
Write-Host "=======================================" -ForegroundColor Yellow

# Čekaj da se service stabilizira
Write-Host "⏳ Čekam da se service stabilizira..." -ForegroundColor Yellow
aws ecs wait services-stable --cluster apps-cluster --services uslugar-service-2gk1f1mv

Write-Host "✅ Service je stabilan!" -ForegroundColor Green

Write-Host "💡 KORAK 4: Testiraj novi endpoint" -ForegroundColor Yellow
Write-Host "=============================" -ForegroundColor Yellow

# Testiraj novi endpoint
Write-Host "🌱 Testiranje novog endpoint-a..." -ForegroundColor Yellow
Start-Sleep -Seconds 10

$response = Invoke-RestMethod -Uri "https://uslugar.api.oriph.io/api/add-categories" -Method POST -ContentType "application/json" -Body "{}"

Write-Host "✅ Odgovor:" -ForegroundColor Green
$response | ConvertTo-Json -Depth 3

Write-Host "🎉 Kategorije uspješno dodane!" -ForegroundColor Green
Write-Host "🌐 Provjerite rezultate na https://uslugar.oriph.io" -ForegroundColor Cyan

# Očisti privremene datoteke
Remove-Item "uslugar-categories-task-def.json" -ErrorAction SilentlyContinue

Write-Host "🏁 Gotovo!" -ForegroundColor Green
