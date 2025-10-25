# Update JWT_SECRET na AWS ECS Service - Jednostavna verzija
param(
    [string]$Region = "eu-north-1",
    [string]$Cluster = "project-cluster", 
    [string]$Service = "uslugar-backend-svc",
    [string]$NewJwtSecret = "dev-super-secret"
)

$ErrorActionPreference = 'Stop'

Write-Host "🔧 Ažuriram JWT_SECRET na AWS ECS..." -ForegroundColor Cyan
Write-Host "Region: $Region" -ForegroundColor Yellow
Write-Host "Cluster: $Cluster" -ForegroundColor Yellow  
Write-Host "Service: $Service" -ForegroundColor Yellow
Write-Host "Novi JWT_SECRET: $NewJwtSecret" -ForegroundColor Yellow

try {
    # 1. Dohvati trenutnu task definition
    Write-Host "📋 Dohvaćam trenutnu task definition..." -ForegroundColor Green
    $currentTaskDef = aws ecs describe-services --cluster $Cluster --services $Service --region $Region --query 'services[0].taskDefinition' --output text
    
    if (-not $currentTaskDef) {
        throw "Ne mogu pronaći ECS service: $Service"
    }
    
    Write-Host "Trenutna task definition: $currentTaskDef" -ForegroundColor Gray
    
    # 2. Dohvati detalje task definition
    $taskDefDetails = aws ecs describe-task-definition --task-definition $currentTaskDef --region $Region --query 'taskDefinition' | ConvertFrom-Json
    
    # 3. Ažuriraj JWT_SECRET u environment varijablama
    Write-Host "🔑 Ažuriram JWT_SECRET environment variable..." -ForegroundColor Green
    
    $containerDef = $taskDefDetails.containerDefinitions[0]
    $envVars = $containerDef.environment
    
    # Pronađi postojeći JWT_SECRET ili dodaj novi
    $jwtSecretFound = $false
    for ($i = 0; $i -lt $envVars.Count; $i++) {
        if ($envVars[$i].name -eq "JWT_SECRET") {
            $envVars[$i].value = $NewJwtSecret
            $jwtSecretFound = $true
            Write-Host "✅ Ažuriran postojeći JWT_SECRET" -ForegroundColor Green
            break
        }
    }
    
    if (-not $jwtSecretFound) {
        $envVars += @{
            name = "JWT_SECRET"
            value = $NewJwtSecret
        }
        Write-Host "✅ Dodan novi JWT_SECRET" -ForegroundColor Green
    }
    
    # 4. Ukloni nepotrebna polja za novu task definition
    $newTaskDef = $taskDefDetails | Select-Object -Property * -ExcludeProperty taskDefinitionArn, revision, status, requiresAttributes, placementConstraints, compatibilities, registeredAt, registeredBy
    
    # 5. Kreiraj novu task definition
    Write-Host "📝 Kreiram novu task definition..." -ForegroundColor Green
    $newTaskDefJson = $newTaskDef | ConvertTo-Json -Depth 10
    
    $newTaskDefResult = aws ecs register-task-definition --cli-input-json $newTaskDefJson --region $Region --query 'taskDefinition.taskDefinitionArn' --output text
    
    Write-Host "✅ Nova task definition kreirana: $newTaskDefResult" -ForegroundColor Green
    
    # 6. Ažuriraj ECS service s novom task definition
    Write-Host "🚀 Ažuriram ECS service..." -ForegroundColor Green
    aws ecs update-service --cluster $Cluster --service $Service --task-definition $newTaskDefResult --region $Region | Out-Null
    
    Write-Host "✅ ECS service ažuriran!" -ForegroundColor Green
    
    # 7. Čekaj da se deployment završi
    Write-Host "⏳ Čekam da se deployment završi..." -ForegroundColor Yellow
    aws ecs wait services-stable --cluster $Cluster --services $Service --region $Region
    
    Write-Host "🎉 Uspješno ažuriran JWT_SECRET na AWS ECS!" -ForegroundColor Green
    Write-Host "🔗 Service URL: https://uslugar.api.oriph.io" -ForegroundColor Cyan
    Write-Host "⏰ Može potrajati 1-2 minute da se promjene primijene..." -ForegroundColor Yellow
    
} catch {
    Write-Host "❌ Greška: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "Provjeri da li si ulogiran u AWS CLI: aws sts get-caller-identity" -ForegroundColor Yellow
    exit 1
}
