# Provjeri Twilio Secrets u AWS Secrets Manager
$Region = "eu-north-1"
$SecretName = "uslugar-twilio-config"

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  AWS Secrets Manager - Twilio Check" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Lista svih secrets
Write-Host "📋 Svi secrets u regionu $Region:" -ForegroundColor Yellow
Write-Host ""
aws secretsmanager list-secrets --region $Region --query 'SecretList[].Name' --output table

Write-Host ""
Write-Host "🔍 Provjera Twilio secret-a: '$SecretName'..." -ForegroundColor Yellow
Write-Host ""

# Provjeri da li secret postoji
try {
    $secretInfo = aws secretsmanager describe-secret --secret-id $SecretName --region $Region 2>$null | ConvertFrom-Json
    
    if ($secretInfo) {
        Write-Host "✅ Secret '$SecretName' POSTOJI" -ForegroundColor Green
        Write-Host ""
        Write-Host "📊 Informacije o secret-u:" -ForegroundColor Cyan
        Write-Host "   Name: $($secretInfo.Name)" -ForegroundColor White
        Write-Host "   ARN: $($secretInfo.ARN)" -ForegroundColor White
        Write-Host "   Created: $($secretInfo.CreatedDate)" -ForegroundColor White
        Write-Host "   Last Changed: $($secretInfo.LastChangedDate)" -ForegroundColor White
        Write-Host ""
        
        # Dohvati vrijednosti
        Write-Host "🔐 Dohvaćanje vrijednosti..." -ForegroundColor Yellow
        $secretValue = aws secretsmanager get-secret-value `
            --secret-id $SecretName `
            --region $Region `
            --query 'SecretString' `
            --output text | ConvertFrom-Json
        
        Write-Host ""
        Write-Host "✅ Vrijednosti u secret-u:" -ForegroundColor Green
        Write-Host ""
        
        if ($secretValue.TWILIO_ACCOUNT_SID) {
            Write-Host "   TWILIO_ACCOUNT_SID: ✅ $($secretValue.TWILIO_ACCOUNT_SID)" -ForegroundColor Green
        } else {
            Write-Host "   TWILIO_ACCOUNT_SID: ❌ NEDOSTAJE" -ForegroundColor Red
        }
        
        if ($secretValue.TWILIO_AUTH_TOKEN) {
            $tokenLength = $secretValue.TWILIO_AUTH_TOKEN.Length
            Write-Host "   TWILIO_AUTH_TOKEN: ✅ Postoji ($tokenLength znakova)" -ForegroundColor Green
        } else {
            Write-Host "   TWILIO_AUTH_TOKEN: ❌ NEDOSTAJE" -ForegroundColor Red
        }
        
        if ($secretValue.TWILIO_PHONE_NUMBER) {
            Write-Host "   TWILIO_PHONE_NUMBER: ✅ $($secretValue.TWILIO_PHONE_NUMBER)" -ForegroundColor Green
        } else {
            Write-Host "   TWILIO_PHONE_NUMBER: ❌ NEDOSTAJE" -ForegroundColor Red
        }
        
        Write-Host ""
        
        # Provjeri da li su svi podaci prisutni
        $allPresent = $secretValue.TWILIO_ACCOUNT_SID -and $secretValue.TWILIO_AUTH_TOKEN -and $secretValue.TWILIO_PHONE_NUMBER
        
        if ($allPresent) {
            Write-Host "✅ SVI TWILIO CREDENTIALS SU POSTAVLJENI!" -ForegroundColor Green
            Write-Host ""
            Write-Host "💡 Sljedeći korak:" -ForegroundColor Yellow
            Write-Host "   Provjeri da li su credentials dodani u ECS Task Definition" -ForegroundColor Gray
        } else {
            Write-Host "⚠️  Neki credentials nedostaju!" -ForegroundColor Yellow
            Write-Host ""
            Write-Host "💡 Ažuriraj secret:" -ForegroundColor Yellow
            Write-Host "   .\uslugar\backend\update-twilio-secret-now.ps1" -ForegroundColor Gray
        }
        
    } else {
        Write-Host "❌ Secret '$SecretName' NE POSTOJI" -ForegroundColor Red
        Write-Host ""
        Write-Host "💡 Kreiraj secret:" -ForegroundColor Yellow
        Write-Host "   aws secretsmanager create-secret --name $SecretName --region $Region" -ForegroundColor Gray
    }
    
} catch {
    Write-Host "❌ Secret '$SecretName' NE POSTOJI" -ForegroundColor Red
    Write-Host ""
    Write-Host "💡 Kreiraj secret:" -ForegroundColor Yellow
    Write-Host "   aws secretsmanager create-secret --name $SecretName --region $Region" -ForegroundColor Gray
    Write-Host ""
    Write-Host "   Ili koristi:" -ForegroundColor Yellow
    Write-Host "   .\uslugar\backend\update-twilio-secret-now.ps1" -ForegroundColor Gray
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan

