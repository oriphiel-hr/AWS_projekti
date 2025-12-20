# Update Domain Configuration Script
# This script updates all domain references from uslugar.oriph.io to uslugar.oriphiel.hr

Write-Host "===================================" -ForegroundColor Cyan
Write-Host "Domain Configuration Update" -ForegroundColor Cyan
Write-Host "===================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Old domain: uslugar.oriph.io" -ForegroundColor Yellow
Write-Host "New domain: uslugar.oriphiel.hr" -ForegroundColor Green
Write-Host ""

# Update AWS Secrets Manager
Write-Host "Updating AWS Secrets Manager..." -ForegroundColor Yellow
try {
    $secretValue = aws secretsmanager get-secret-value `
        --secret-id uslugar-smtp-config `
        --region eu-north-1 `
        --query 'SecretString' `
        --output text `
        2>&1

    if ($LASTEXITCODE -eq 0) {
        # Parse and update
        $secretJson = $secretValue -replace '\\"', '"' | ConvertFrom-Json
        $secretJson.FRONTEND_URL = "https://uslugar.oriphiel.hr"
        
        $updatedSecret = $secretJson | ConvertTo-Json -Compress
        
        aws secretsmanager put-secret-value `
            --secret-id uslugar-smtp-config `
            --secret-string $updatedSecret `
            --region eu-north-1 `
            > $null 2>&1

        if ($LASTEXITCODE -eq 0) {
            Write-Host "✓ AWS Secrets Manager updated" -ForegroundColor Green
        } else {
            Write-Host "✗ Failed to update AWS Secrets Manager" -ForegroundColor Red
        }
    }
} catch {
    Write-Host "✗ Error updating AWS Secrets Manager: $_" -ForegroundColor Red
}

Write-Host ""
Write-Host "===================================" -ForegroundColor Cyan
Write-Host "Next Steps:" -ForegroundColor Yellow
Write-Host "===================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "1. Upload .htaccess file to Hostinger public_html/" -ForegroundColor White
Write-Host "2. Update backend .env file (if using local development)" -ForegroundColor White
Write-Host "3. Update frontend .env file (if using local development)" -ForegroundColor White
Write-Host "4. Test redirect: https://uslugar.oriph.io" -ForegroundColor White
Write-Host "5. Verify new domain: https://uslugar.oriphiel.hr" -ForegroundColor White
Write-Host ""

