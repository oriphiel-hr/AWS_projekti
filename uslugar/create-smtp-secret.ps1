# Create SMTP Secret in AWS Secrets Manager (PowerShell)
# Usage: .\create-smtp-secret.ps1

Write-Host "===================================" -ForegroundColor Cyan
Write-Host "AWS Secrets Manager - SMTP Setup" -ForegroundColor Cyan
Write-Host "===================================" -ForegroundColor Cyan
Write-Host ""

# Prompt for SMTP credentials
$SMTP_HOST = Read-Host "SMTP Host (default: smtp.gmail.com)"
if ([string]::IsNullOrWhiteSpace($SMTP_HOST)) {
    $SMTP_HOST = "smtp.gmail.com"
}

$SMTP_PORT = Read-Host "SMTP Port (default: 587)"
if ([string]::IsNullOrWhiteSpace($SMTP_PORT)) {
    $SMTP_PORT = "587"
}

$SMTP_USER = Read-Host "SMTP User (email)"
if ([string]::IsNullOrWhiteSpace($SMTP_USER)) {
    Write-Host "Error: SMTP User is required" -ForegroundColor Red
    exit 1
}

$SMTP_PASS = Read-Host "SMTP Password (App Password)" -AsSecureString
$SMTP_PASS_Plain = [Runtime.InteropServices.Marshal]::PtrToStringAuto([Runtime.InteropServices.Marshal]::SecureStringToBSTR($SMTP_PASS))
if ([string]::IsNullOrWhiteSpace($SMTP_PASS_Plain)) {
    Write-Host "Error: SMTP Password is required" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "Creating secret with following values:" -ForegroundColor Yellow
Write-Host "  Host: $SMTP_HOST"
Write-Host "  Port: $SMTP_PORT"
Write-Host "  User: $SMTP_USER"
Write-Host "  Pass: ********"
Write-Host ""

# Create JSON object
$secretObject = @{
    SMTP_HOST = $SMTP_HOST
    SMTP_PORT = $SMTP_PORT
    SMTP_USER = $SMTP_USER
    SMTP_PASS = $SMTP_PASS_Plain
}

$secretJson = $secretObject | ConvertTo-Json -Compress

# Create secret in AWS
Write-Host "Creating secret in AWS Secrets Manager..." -ForegroundColor Yellow

try {
    $result = aws secretsmanager create-secret `
        --name uslugar-smtp-secret `
        --description "SMTP credentials for Uslugar email notifications" `
        --secret-string $secretJson `
        --region eu-north-1 `
        --output json 2>&1
    
    if ($LASTEXITCODE -eq 0) {
        $secretData = $result | ConvertFrom-Json
        Write-Host ""
        Write-Host "✓ Secret created successfully!" -ForegroundColor Green
        Write-Host ""
        Write-Host "Secret ARN: $($secretData.ARN)" -ForegroundColor Cyan
        Write-Host ""
        Write-Host "Next steps:" -ForegroundColor Yellow
        Write-Host "1. Update taskdef-new.json with this ARN"
        Write-Host "2. Deploy backend with new task definition"
        Write-Host "3. Test email sending"
    } else {
        throw "Failed to create secret"
    }
} catch {
    Write-Host ""
    Write-Host "✗ Error creating secret:" -ForegroundColor Red
    Write-Host $result
    
    # Check if secret already exists
    if ($result -match "ResourceExistsException") {
        Write-Host ""
        Write-Host "Secret already exists. Updating..." -ForegroundColor Yellow
        
        $updateResult = aws secretsmanager update-secret `
            --secret-id uslugar-smtp-secret `
            --secret-string $secretJson `
            --region eu-north-1 `
            --output json 2>&1
        
        if ($LASTEXITCODE -eq 0) {
            Write-Host "✓ Secret updated successfully!" -ForegroundColor Green
            
            # Get ARN
            $describeResult = aws secretsmanager describe-secret `
                --secret-id uslugar-smtp-secret `
                --region eu-north-1 `
                --output json | ConvertFrom-Json
            
            Write-Host ""
            Write-Host "Secret ARN: $($describeResult.ARN)" -ForegroundColor Cyan
        } else {
            Write-Host "✗ Error updating secret:" -ForegroundColor Red
            Write-Host $updateResult
        }
    }
}

Write-Host ""
Write-Host "Done!" -ForegroundColor Green

