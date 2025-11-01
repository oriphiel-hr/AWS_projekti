# Ažuriraj Twilio Secret u AWS Secrets Manager s novim Auth Token-om

$Region = "eu-north-1"
$SecretName = "uslugar-twilio-config"

# Novi Auth Token iz Twilio Console
$NewAuthToken = "2017a579c1c1494e25e6def3004fdea2"
$AccountSID = "AC5616e4c456d9f0354ef1f5a61c7734e6"
$PhoneNumber = "+18027276987"

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Ažuriranje Twilio Secret u AWS" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Provjeri da li secret postoji
try {
    aws secretsmanager describe-secret --secret-id $SecretName --region $Region 2>$null | Out-Null
    if ($LASTEXITCODE -ne 0) {
        throw "Secret ne postoji"
    }
} catch {
    Write-Host "❌ Secret '$SecretName' ne postoji!" -ForegroundColor Red
    Write-Host "💡 Kreiraj secret prvo:" -ForegroundColor Yellow
    Write-Host "   aws secretsmanager create-secret --name $SecretName --region $Region" -ForegroundColor Yellow
    exit 1
}

Write-Host "✅ Secret postoji" -ForegroundColor Green
Write-Host ""

# Pripremi JSON
Write-Host "📝 Ažuriranje secret-a..." -ForegroundColor Yellow
$secretJson = @{
    TWILIO_ACCOUNT_SID = $AccountSID
    TWILIO_AUTH_TOKEN = $NewAuthToken
    TWILIO_PHONE_NUMBER = $PhoneNumber
} | ConvertTo-Json -Compress

# Ažuriraj secret
aws secretsmanager put-secret-value `
    --secret-id $SecretName `
    --secret-string $secretJson `
    --region $Region | Out-Null

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Secret uspješno ažuriran!" -ForegroundColor Green
    Write-Host ""
    
    # Provjeri ažurirani secret
    Write-Host "🔍 Provjera ažuriranog secret-a:" -ForegroundColor Cyan
    $secretValue = aws secretsmanager get-secret-value `
        --secret-id $SecretName `
        --region $Region `
        --query 'SecretString' `
        --output text | ConvertFrom-Json
    
    Write-Host "   Account SID: $($secretValue.TWILIO_ACCOUNT_SID)" -ForegroundColor White
    Write-Host "   Auth Token: ✅ Postoji ($($secretValue.TWILIO_AUTH_TOKEN.Length) znakova)" -ForegroundColor Green
    Write-Host "   Phone Number: $($secretValue.TWILIO_PHONE_NUMBER)" -ForegroundColor White
    Write-Host ""
    
    Write-Host "🔄 Sljedeći korak: Restart ECS service da učita novi token" -ForegroundColor Yellow
    Write-Host "   aws ecs update-service --cluster apps-cluster --service uslugar-service-2gk1f1mv --force-new-deployment --region eu-north-1" -ForegroundColor Gray
} else {
    Write-Host "❌ Greška pri ažuriranju secret-a!" -ForegroundColor Red
    exit 1
}

