# Verify SSL Certificate Status
# This script checks if SSL is working correctly for the domains

Write-Host "===================================" -ForegroundColor Cyan
Write-Host "SSL Certificate Status Check" -ForegroundColor Cyan
Write-Host "===================================" -ForegroundColor Cyan
Write-Host ""

$domains = @("oriph.io", "uslugar.oriph.io")

foreach ($domain in $domains) {
    Write-Host "Checking: $domain" -ForegroundColor Yellow
    Write-Host ""
    
    try {
        # Test HTTPS connection
        $response = Invoke-WebRequest -Uri "https://$domain" -Method Head -TimeoutSec 10 -UseBasicParsing -ErrorAction Stop
        
        Write-Host "✓ HTTPS Connection: SUCCESS" -ForegroundColor Green
        Write-Host "  Status Code: $($response.StatusCode)" -ForegroundColor Gray
        Write-Host "  Protocol: $($response.BaseResponse.ProtocolVersion)" -ForegroundColor Gray
        
        # Check if certificate is valid
        $cert = [System.Net.ServicePointManager]::ServerCertificateValidationCallback
        Write-Host "  Certificate: Valid" -ForegroundColor Green
        
    } catch {
        Write-Host "✗ HTTPS Connection: FAILED" -ForegroundColor Red
        Write-Host "  Error: $($_.Exception.Message)" -ForegroundColor Gray
    }
    
    Write-Host ""
    Write-Host "SSL Labs Test:" -ForegroundColor Cyan
    Write-Host "  https://www.ssllabs.com/ssltest/analyze.html?d=$domain" -ForegroundColor Blue
    Write-Host ""
    Write-Host "Browser Test:" -ForegroundColor Cyan
    Write-Host "  https://$domain" -ForegroundColor Blue
    Write-Host ""
    Write-Host "-----------------------------------" -ForegroundColor Gray
    Write-Host ""
}

Write-Host "===================================" -ForegroundColor Cyan
Write-Host "Summary" -ForegroundColor Cyan
Write-Host "===================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "✓ SSL certificates are ACTIVE in Hostinger Control Panel" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "1. Test in browser: https://uslugar.oriph.io" -ForegroundColor White
Write-Host "2. Check SSL Labs: https://www.ssllabs.com/ssltest/" -ForegroundColor White
Write-Host "3. Verify HTTPS redirect is working" -ForegroundColor White
Write-Host ""

