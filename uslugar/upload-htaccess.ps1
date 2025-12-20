# Upload .htaccess file to Hostinger FTP
# Usage: .\upload-htaccess.ps1

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Upload .htaccess to Hostinger FTP" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check if .htaccess file exists
$htaccessPath = Join-Path $PSScriptRoot ".htaccess"
if (!(Test-Path $htaccessPath)) {
    Write-Host "ERROR: .htaccess file not found at: $htaccessPath" -ForegroundColor Red
    Write-Host "Expected location: uslugar/.htaccess" -ForegroundColor Yellow
    exit 1
}

Write-Host "✓ Found .htaccess file" -ForegroundColor Green
Write-Host ""

# FTP Configuration
# Try to get from environment variables first, otherwise prompt
$ftpHost = $env:HOSTINGER_HOST
$ftpUser = $env:HOSTINGER_USERNAME
$ftpPass = $env:HOSTINGER_PASSWORD

if (!$ftpHost) {
    $ftpHost = Read-Host "FTP Host (e.g., ftp.oriph.io or ftp.uslugar.oriph.io)"
}

if (!$ftpUser) {
    $ftpUser = Read-Host "FTP Username"
}

if (!$ftpPass) {
    $securePass = Read-Host "FTP Password" -AsSecureString
    $ftpPass = [Runtime.InteropServices.Marshal]::PtrToStringAuto([Runtime.InteropServices.Marshal]::SecureStringToBSTR($securePass))
}

# FTP Path - adjust based on your Hostinger setup
# Common paths:
# - /domains/uslugar.oriph.io/public_html/
# - /public_html/
# - /domains/oriph.io/public_html/uslugar/
$ftpBasePath = "/domains/uslugar.oriph.io/public_html/"

Write-Host "FTP Configuration:" -ForegroundColor Yellow
Write-Host "  Host: $ftpHost" -ForegroundColor White
Write-Host "  User: $ftpUser" -ForegroundColor White
Write-Host "  Path: $ftpBasePath" -ForegroundColor White
Write-Host ""

# Confirm
$confirm = Read-Host "Continue with upload? (Y/N)"
if ($confirm -ne "Y" -and $confirm -ne "y") {
    Write-Host "Upload cancelled." -ForegroundColor Yellow
    exit 0
}

Write-Host ""
Write-Host "Uploading .htaccess file..." -ForegroundColor Cyan

try {
    # Create FTP URI
    $ftpUri = "ftp://$ftpHost$ftpBasePath.htaccess"
    
    # Create FTP request
    $ftpRequest = [System.Net.FtpWebRequest]::Create($ftpUri)
    $ftpRequest.Credentials = New-Object System.Net.NetworkCredential($ftpUser, $ftpPass)
    $ftpRequest.Method = [System.Net.WebRequestMethods+Ftp]::UploadFile
    $ftpRequest.UseBinary = $false  # .htaccess is text file
    $ftpRequest.UsePassive = $true
    $ftpRequest.EnableSsl = $false  # Change to $true if using FTPS
    
    # Read file content
    $fileContent = [System.IO.File]::ReadAllBytes($htaccessPath)
    $ftpRequest.ContentLength = $fileContent.Length
    
    # Upload file
    $requestStream = $ftpRequest.GetRequestStream()
    $requestStream.Write($fileContent, 0, $fileContent.Length)
    $requestStream.Close()
    
    # Get response
    $response = $ftpRequest.GetResponse()
    $response.Close()
    
    Write-Host ""
    Write-Host "✅ .htaccess file uploaded successfully!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Next steps:" -ForegroundColor Yellow
    Write-Host "  1. Test redirect: https://uslugar.oriph.io" -ForegroundColor White
    Write-Host "  2. Verify it redirects to: https://uslugar.oriphiel.hr" -ForegroundColor White
    Write-Host "  3. Check SSL for new domain" -ForegroundColor White
    Write-Host ""
    
} catch {
    Write-Host ""
    Write-Host "❌ Error uploading .htaccess file:" -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
    Write-Host ""
    Write-Host "Troubleshooting:" -ForegroundColor Yellow
    Write-Host "  1. Verify FTP credentials are correct" -ForegroundColor White
    Write-Host "  2. Check FTP host and path" -ForegroundColor White
    Write-Host "  3. Ensure FTP access is enabled on Hostinger" -ForegroundColor White
    Write-Host "  4. Try using FileZilla or WinSCP for manual upload" -ForegroundColor White
    Write-Host ""
    exit 1
}

