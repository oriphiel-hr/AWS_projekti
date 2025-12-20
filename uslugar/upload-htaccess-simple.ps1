# Upload .htaccess file to Hostinger FTP
# Usage: .\upload-htaccess-simple.ps1 -FtpHost "ftp.oriph.io" -FtpUser "username" -FtpPass "password"

param(
    [Parameter(Mandatory=$false)]
    [string]$FtpHost = $env:HOSTINGER_HOST,
    
    [Parameter(Mandatory=$false)]
    [string]$FtpUser = $env:HOSTINGER_USERNAME,
    
    [Parameter(Mandatory=$false)]
    [string]$FtpPass = $env:HOSTINGER_PASSWORD,
    
    [Parameter(Mandatory=$false)]
    [string]$FtpPath = "/domains/uslugar.oriph.io/public_html/"
)

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Upload .htaccess to Hostinger FTP" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check if .htaccess file exists
$htaccessPath = Join-Path $PSScriptRoot ".htaccess"
if (!(Test-Path $htaccessPath)) {
    Write-Host "ERROR: .htaccess file not found at: $htaccessPath" -ForegroundColor Red
    exit 1
}

Write-Host "✓ Found .htaccess file" -ForegroundColor Green
Write-Host ""

# Check if credentials are provided
if (!$FtpHost -or !$FtpUser -or !$FtpPass) {
    Write-Host "❌ Missing FTP credentials!" -ForegroundColor Red
    Write-Host ""
    Write-Host "Usage:" -ForegroundColor Yellow
    Write-Host "  .\upload-htaccess-simple.ps1 -FtpHost 'ftp.oriph.io' -FtpUser 'username' -FtpPass 'password'" -ForegroundColor White
    Write-Host ""
    Write-Host "Or set environment variables:" -ForegroundColor Yellow
    Write-Host "  `$env:HOSTINGER_HOST = 'ftp.oriph.io'" -ForegroundColor White
    Write-Host "  `$env:HOSTINGER_USERNAME = 'username'" -ForegroundColor White
    Write-Host "  `$env:HOSTINGER_PASSWORD = 'password'" -ForegroundColor White
    Write-Host ""
    Write-Host "Alternative: Use FileZilla or WinSCP to manually upload:" -ForegroundColor Yellow
    Write-Host "  Source: uslugar/.htaccess" -ForegroundColor White
    Write-Host "  Destination: public_html/.htaccess" -ForegroundColor White
    Write-Host ""
    exit 1
}

# Clean FTP host (remove protocol prefix)
$FtpHost = $FtpHost -replace '^ftp://', '' -replace '^ftps://', '' -replace '^sftp://', ''
$FtpHost = $FtpHost -replace '/$', ''  # Remove trailing slash
$FtpHost = $FtpHost -split ':' | Select-Object -First 1  # Remove port if present

Write-Host "FTP Configuration:" -ForegroundColor Yellow
Write-Host "  Host: $FtpHost" -ForegroundColor White
Write-Host "  User: $FtpUser" -ForegroundColor White
Write-Host "  Path: $FtpPath" -ForegroundColor White
Write-Host ""

Write-Host "Uploading .htaccess file..." -ForegroundColor Cyan

try {
    # Create FTP URI
    $ftpUri = "ftp://$FtpHost$FtpPath.htaccess"
    
    Write-Host "  URI: $ftpUri" -ForegroundColor Gray
    
    # Create FTP request
    $ftpRequest = [System.Net.FtpWebRequest]::Create($ftpUri)
    $ftpRequest.Credentials = New-Object System.Net.NetworkCredential($FtpUser, $FtpPass)
    $ftpRequest.Method = [System.Net.WebRequestMethods+Ftp]::UploadFile
    $ftpRequest.UseBinary = $false  # .htaccess is text file
    $ftpRequest.UsePassive = $true
    $ftpRequest.EnableSsl = $false  # Change to $true if using FTPS
    
    # Read file content
    $fileContent = [System.IO.File]::ReadAllBytes($htaccessPath)
    $ftpRequest.ContentLength = $fileContent.Length
    
    Write-Host "  File size: $($fileContent.Length) bytes" -ForegroundColor Gray
    
    # Upload file
    $requestStream = $ftpRequest.GetRequestStream()
    $requestStream.Write($fileContent, 0, $fileContent.Length)
    $requestStream.Close()
    
    # Get response
    $response = $ftpRequest.GetResponse()
    $statusCode = $response.StatusCode
    $response.Close()
    
    Write-Host ""
    Write-Host "✅ .htaccess file uploaded successfully!" -ForegroundColor Green
    Write-Host "   Status: $statusCode" -ForegroundColor Gray
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
    Write-Host "  2. Check FTP host format (no ftp:// prefix, no port)" -ForegroundColor White
    Write-Host "  3. Ensure FTP access is enabled on Hostinger" -ForegroundColor White
    Write-Host "  4. Try using FileZilla or WinSCP for manual upload" -ForegroundColor White
    Write-Host ""
    Write-Host "Manual upload instructions:" -ForegroundColor Cyan
    Write-Host "  - Use FileZilla or WinSCP" -ForegroundColor White
    Write-Host "  - Connect to: $FtpHost" -ForegroundColor White
    Write-Host "  - Navigate to: $FtpPath" -ForegroundColor White
    Write-Host "  - Upload: uslugar/.htaccess" -ForegroundColor White
    Write-Host ""
    exit 1
}

