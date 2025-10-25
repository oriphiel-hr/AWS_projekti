# USLUGAR - Brza migracija kategorija
# ====================================

Write-Host "🌱 USLUGAR - Brza migracija kategorija" -ForegroundColor Green
Write-Host "=====================================" -ForegroundColor Green

# Koristi postojeći image i samo dodaj admin endpoint kroz environment variable
Write-Host "📋 Kreiranje task definition-a s admin endpoint-om..." -ForegroundColor Yellow

$taskDef = @{
    containerDefinitions = @(
        @{
            name = "uslugar"
            image = "666203386231.dkr.ecr.eu-north-1.amazonaws.com/uslugar:72331f9b839866642ad06c959bc194e4e9bf07fb"
            essential = $true
            environment = @(
                @{
                    name = "PORT"
                    value = "8080"
                },
                @{
                    name = "JWT_SECRET"
                    value = "dev-super-secret"
                },
                @{
                    name = "ENABLE_CATEGORIES_SEED"
                    value = "true"
                }
            )
            secrets = @(
                @{
                    name = "DATABASE_URL"
                    valueFrom = "arn:aws:secretsmanager:eu-north-1:666203386231:secret:uslugar-db-secret-FBWhyv:DATABASE_URL::"
                },
                @{
                    name = "SMTP_HOST"
                    valueFrom = "arn:aws:secretsmanager:eu-north-1:666203386231:secret:uslugar-smtp-config-5xXBg5:SMTP_HOST::"
                },
                @{
                    name = "SMTP_PORT"
                    valueFrom = "arn:aws:secretsmanager:eu-north-1:666203386231:secret:uslugar-smtp-config-5xXBg5:SMTP_PORT::"
                },
                @{
                    name = "SMTP_USER"
                    valueFrom = "arn:aws:secretsmanager:eu-north-1:666203386231:secret:uslugar-smtp-config-5xXBg5:SMTP_USER::"
                },
                @{
                    name = "SMTP_PASS"
                    valueFrom = "arn:aws:secretsmanager:eu-north-1:666203386231:secret:uslugar-smtp-config-5xXBg5:SMTP_PASS::"
                },
                @{
                    name = "FRONTEND_URL"
                    valueFrom = "arn:aws:secretsmanager:eu-north-1:666203386231:secret:uslugar-smtp-config-5xXBg5:FRONTEND_URL::"
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
            image = "666203386231.dkr.ecr.eu-north-1.amazonaws.com/nginx-proxy-uslugar:stable-alpine"
            essential = $true
            portMappings = @(
                @{
                    containerPort = 80
                    hostPort = 80
                    protocol = "tcp"
                    name = "nginx-proxy-80-tcp"
                }
            )
            command = @(
                "/bin/sh",
                "-lc",
                "cat >/etc/nginx/conf.d/default.conf <<'CONF'`nserver {`n  listen 80;`n  location / {`n    proxy_pass http://127.0.0.1:8080;`n    proxy_http_version 1.1;`n    proxy_set_header Host `$host;`n    proxy_set_header X-Real-IP `$remote_addr;`n    proxy_set_header X-Forwarded-For `$proxy_add_x_forwarded_for;`n    proxy_set_header X-Forwarded-Proto `$scheme;`n  }`n  location = /hc { return 200 ok; add_header Content-Type text/plain; }`n}`nCONF`nexec nginx -g 'daemon off;'"
            )
            environment = @()
            mountPoints = @()
            volumesFrom = @()
            logConfiguration = @{
                logDriver = "awslogs"
                options = @{
                    "awslogs-group" = "/ecs/uslugar"
                    "awslogs-create-group" = "true"
                    "awslogs-region" = "eu-north-1"
                    "awslogs-stream-prefix" = "ecs"
                }
            }
            healthCheck = @{
                command = @(
                    "CMD-SHELL",
                    "wget -q -O- http://127.0.0.1:80/hc >/dev/null || exit 1"
                )
                interval = 15
                timeout = 5
                retries = 2
                startPeriod = 10
            }
            systemControls = @()
        }
    )
    family = "uslugar"
    executionRoleArn = "arn:aws:iam::666203386231:role/ecsTaskExecutionRole"
    networkMode = "awsvpc"
    requiresCompatibilities = @("FARGATE")
    cpu = "512"
    memory = "1024"
}

# Spremi task definition u JSON file
$taskDef | ConvertTo-Json -Depth 10 | Out-File -FilePath "quick-categories-task-def.json" -Encoding UTF8

# Registriraj novi task definition
Write-Host "📝 Registriranje novog task definition-a..." -ForegroundColor Yellow
$newTaskDefArn = aws ecs register-task-definition --cli-input-json file://quick-categories-task-def.json --query 'taskDefinition.taskDefinitionArn' --output text

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Greška pri registriranju task definition-a" -ForegroundColor Red
    exit 1
}

Write-Host "✅ Novi task definition registriran: $newTaskDefArn" -ForegroundColor Green

# Ažuriraj ECS service
Write-Host "🔄 Ažuriranje ECS service-a..." -ForegroundColor Yellow
aws ecs update-service --cluster apps-cluster --service uslugar --task-definition $newTaskDefArn --force-new-deployment

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Greška pri ažuriranju service-a" -ForegroundColor Red
    exit 1
}

Write-Host "✅ ECS service uspješno ažuriran" -ForegroundColor Green

# Čekaj da se service stabilizira
Write-Host "⏳ Čekam da se service stabilizira..." -ForegroundColor Yellow
aws ecs wait services-stable --cluster apps-cluster --services uslugar

Write-Host "🎉 Backend uspješno ažuriran!" -ForegroundColor Green

# Očisti privremene datoteke
Remove-Item "quick-categories-task-def.json" -ErrorAction SilentlyContinue

Write-Host "🏁 Gotovo! Sada možete pokrenuti migraciju kategorija" -ForegroundColor Green
