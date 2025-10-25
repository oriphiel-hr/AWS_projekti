# 🚀 FTP DEPLOYMENT SCRIPT za Uslugar
# PowerShell skripta za upload na Hostinger FTP

param(
    [Parameter(Mandatory=$true)]
    [string]$FtpHost,
    
    [Parameter(Mandatory=$true)]
    [string]$FtpUsername,
    
    [Parameter(Mandatory=$true)]
    [string]$FtpPassword,
    
    [string]$FtpPort = "21"
)

Write-Host "🚀 POČINJE FTP DEPLOYMENT..." -ForegroundColor Green
Write-Host "=================================" -ForegroundColor Green

# Provjeri da li postoje potrebni direktoriji
$frontendDist = "frontend/dist"
$backendSrc = "backend"

if (-not (Test-Path $frontendDist)) {
    Write-Host "❌ GREŠKA: $frontendDist ne postoji! Prvo pokrenite npm run build" -ForegroundColor Red
    exit 1
}

if (-not (Test-Path $backendSrc)) {
    Write-Host "❌ GREŠKA: $backendSrc ne postoji!" -ForegroundColor Red
    exit 1
}

Write-Host "✅ Frontend dist direktorij pronađen" -ForegroundColor Green
Write-Host "✅ Backend direktorij pronađen" -ForegroundColor Green

# Kreiraj FTP konekciju
try {
    Write-Host "🔌 Spajam se na FTP server..." -ForegroundColor Yellow
    
    # Kreiraj FTP request
    $ftpRequest = [System.Net.FtpWebRequest]::Create("ftp://$FtpHost`:$FtpPort/")
    $ftpRequest.Credentials = New-Object System.Net.NetworkCredential($FtpUsername, $FtpPassword)
    $ftpRequest.Method = [System.Net.WebRequestMethods+Ftp]::ListDirectory
    
    $response = $ftpRequest.GetResponse()
    $response.Close()
    
    Write-Host "✅ FTP konekcija uspješna!" -ForegroundColor Green
}
catch {
    Write-Host "❌ GREŠKA: Ne mogu se spojiti na FTP server: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

# Funkcija za upload datoteke
function Upload-File {
    param(
        [string]$LocalPath,
        [string]$RemotePath
    )
    
    try {
        Write-Host "📤 Uploadam: $LocalPath -> $RemotePath" -ForegroundColor Cyan
        
        $ftpRequest = [System.Net.FtpWebRequest]::Create("ftp://$FtpHost`:$FtpPort$RemotePath")
        $ftpRequest.Credentials = New-Object System.Net.NetworkCredential($FtpUsername, $FtpPassword)
        $ftpRequest.Method = [System.Net.WebRequestMethods+Ftp]::UploadFile
        $ftpRequest.UseBinary = $true
        
        $fileBytes = [System.IO.File]::ReadAllBytes($LocalPath)
        $ftpRequest.ContentLength = $fileBytes.Length
        
        $requestStream = $ftpRequest.GetRequestStream()
        $requestStream.Write($fileBytes, 0, $fileBytes.Length)
        $requestStream.Close()
        
        $response = $ftpRequest.GetResponse()
        $response.Close()
        
        Write-Host "✅ Upload uspješan: $RemotePath" -ForegroundColor Green
        return $true
    }
    catch {
        Write-Host "❌ GREŠKA uploada $LocalPath`: $($_.Exception.Message)" -ForegroundColor Red
        return $false
    }
}

Write-Host "`n📤 UPLOADAM FRONTEND..." -ForegroundColor Yellow

# Upload frontend datoteke
if (Test-Path "frontend/dist/index.html") {
    Upload-File "frontend/dist/index.html" "/domains/uslugar.oriph.io/public_html/index.html"
}

if (Test-Path "frontend/dist/uslugar.ico") {
    Upload-File "frontend/dist/uslugar.ico" "/domains/uslugar.oriph.io/public_html/uslugar.ico"
}

# Upload assets direktorij
$assetsDir = "frontend/dist/assets"
if (Test-Path $assetsDir) {
    Write-Host "📁 Uploadam assets direktorij..." -ForegroundColor Cyan
    
    $assetFiles = Get-ChildItem -Path $assetsDir -Recurse -File
    foreach ($file in $assetFiles) {
        $relativePath = $file.FullName.Replace((Get-Location).Path + "\frontend\dist\", "").Replace("\", "/")
        $remotePath = "/domains/uslugar.oriph.io/public_html/$relativePath"
        
        Upload-File $file.FullName $remotePath
    }
}

Write-Host "`n📤 UPLOADAM BACKEND..." -ForegroundColor Yellow

# Upload backend datoteke
if (Test-Path "backend/package.json") {
    Upload-File "backend/package.json" "/domains/uslugar.oriph.io/public_html/api/package.json"
}

if (Test-Path "backend/package-lock.json") {
    Upload-File "backend/package-lock.json" "/domains/uslugar.oriph.io/public_html/api/package-lock.json"
}

# Upload src direktorij
$srcDir = "backend/src"
if (Test-Path $srcDir) {
    Write-Host "📁 Uploadam src direktorij..." -ForegroundColor Cyan
    
    $srcFiles = Get-ChildItem -Path $srcDir -Recurse -File
    foreach ($file in $srcFiles) {
        $relativePath = $file.FullName.Replace((Get-Location).Path + "\backend\", "").Replace("\", "/")
        $remotePath = "/domains/uslugar.oriph.io/public_html/api/$relativePath"
        
        Upload-File $file.FullName $remotePath
    }
}

# Upload prisma direktorij
$prismaDir = "backend/prisma"
if (Test-Path $prismaDir) {
    Write-Host "📁 Uploadam prisma direktorij..." -ForegroundColor Cyan
    
    $prismaFiles = Get-ChildItem -Path $prismaDir -Recurse -File
    foreach ($file in $prismaFiles) {
        $relativePath = $file.FullName.Replace((Get-Location).Path + "\backend\", "").Replace("\", "/")
        $remotePath = "/domains/uslugar.oriph.io/public_html/api/$relativePath"
        
        Upload-File $file.FullName $remotePath
    }
}

Write-Host "`n🎉 DEPLOYMENT ZAVRŠEN!" -ForegroundColor Green
Write-Host "=================================" -ForegroundColor Green

Write-Host "`n📋 SLJEDEĆI KORACI:" -ForegroundColor Yellow
Write-Host "1. Spojite se na server preko SSH ili Terminal" -ForegroundColor White
Write-Host "2. Idite u direktorij: cd /domains/uslugar.oriph.io/public_html/api" -ForegroundColor White
Write-Host "3. Instalirajte dependencies: npm install" -ForegroundColor White
Write-Host "4. Pokrenite Prisma: npx prisma generate" -ForegroundColor White
Write-Host "5. Pokrenite migracije: npx prisma migrate deploy" -ForegroundColor White
Write-Host "6. Kreirajte uploads direktorij: mkdir -p uploads" -ForegroundColor White
Write-Host "7. Provjerite/kreirajte .env datoteku" -ForegroundColor White
Write-Host "8. Restartajte Node.js aplikaciju u Hostinger Control Panel" -ForegroundColor White

Write-Host "`n🔗 TESTIRAJTE:" -ForegroundColor Yellow
Write-Host "Frontend: https://uslugar.oriph.io" -ForegroundColor White
Write-Host "Backend: https://uslugar.oriph.io/api/health" -ForegroundColor White
Write-Host "Jobs: https://uslugar.oriph.io/api/jobs" -ForegroundColor White

Write-Host "`n✅ FTP DEPLOYMENT USPJEŠAN!" -ForegroundColor Green