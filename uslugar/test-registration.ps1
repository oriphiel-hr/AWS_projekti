# Test registracija sa email verifikacijom

Write-Host "Testing User Registration with Email Verification" -ForegroundColor Cyan
Write-Host "=================================================" -ForegroundColor Cyan
Write-Host ""

$testEmail = "test-$(Get-Random)@example.com"
$body = @{
    email = $testEmail
    password = "test123"
    fullName = "Test User"
    role = "USER"
} | ConvertTo-Json

Write-Host "Sending registration request..." -ForegroundColor Yellow
Write-Host "Email: $testEmail" -ForegroundColor Gray
Write-Host ""

try {
    $response = Invoke-RestMethod -Uri "http://localhost:8080/api/auth/register" `
        -Method POST `
        -Headers @{"Content-Type"="application/json"} `
        -Body $body `
        -ErrorAction Stop
    
    Write-Host "✓ SUCCESS!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Response:" -ForegroundColor Cyan
    $response | ConvertTo-Json -Depth 3
    Write-Host ""
    Write-Host "✓ User created successfully" -ForegroundColor Green
    Write-Host "✓ JWT token received" -ForegroundColor Green
    Write-Host "✓ Check email: $testEmail for verification link" -ForegroundColor Yellow
    
} catch {
    Write-Host "✗ FAILED!" -ForegroundColor Red
    Write-Host ""
    Write-Host "Error:" -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
    
    if ($_.ErrorDetails.Message) {
        Write-Host ""
        Write-Host "Details:" -ForegroundColor Yellow
        Write-Host $_.ErrorDetails.Message
    }
}

Write-Host ""
Write-Host "Check backend logs for email sending status" -ForegroundColor Gray

