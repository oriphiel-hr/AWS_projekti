# AWS S3 Setup Script za Uslugar PDF Fakture (PowerShell)
# Ovaj skript kreira S3 bucket i postavlja lifecycle policy

$BUCKET_NAME = "uslugar-invoices"
$REGION = "eu-north-1"

Write-Host "🪣 Setting up S3 bucket for invoice PDFs..." -ForegroundColor Cyan

# Provjeri da li je AWS CLI instaliran
try {
    $null = Get-Command aws -ErrorAction Stop
} catch {
    Write-Host "❌ AWS CLI nije instaliran. Instaliraj ga prvo: https://aws.amazon.com/cli/" -ForegroundColor Red
    exit 1
}

# Provjeri AWS credentials
$identityCheck = aws sts get-caller-identity 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ AWS credentials nisu konfigurirani. Pokreni 'aws configure'" -ForegroundColor Red
    exit 1
}

Write-Host "✅ AWS CLI konfiguriran" -ForegroundColor Green

# Provjeri da li bucket već postoji
$bucketExists = $false
$bucketCheck = aws s3api head-bucket --bucket $BUCKET_NAME --region $REGION 2>&1
if ($LASTEXITCODE -eq 0) {
    $bucketExists = $true
} else {
    $bucketExists = $false
}

if ($bucketExists) {
    Write-Host "⚠️  Bucket '$BUCKET_NAME' već postoji. Preskačem kreiranje." -ForegroundColor Yellow
} else {
    Write-Host "📦 Kreiranje S3 bucket-a: $BUCKET_NAME" -ForegroundColor Cyan
    
    # Kreiraj bucket
    aws s3api create-bucket `
        --bucket $BUCKET_NAME `
        --region $REGION `
        --create-bucket-configuration LocationConstraint=$REGION
    
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Greška pri kreiranju bucket-a" -ForegroundColor Red
        exit 1
    }
    
    Write-Host "✅ Bucket kreiran" -ForegroundColor Green
    
    # Postavi versioning (disable)
    aws s3api put-bucket-versioning `
        --bucket $BUCKET_NAME `
        --versioning-configuration Status=Suspended
    
    # Postavi encryption
    $encryptionConfig = @{
        Rules = @(
            @{
                ApplyServerSideEncryptionByDefault = @{
                    SSEAlgorithm = "AES256"
                }
            }
        )
    } | ConvertTo-Json -Compress
    
    aws s3api put-bucket-encryption `
        --bucket $BUCKET_NAME `
        --server-side-encryption-configuration $encryptionConfig
    
    # Blokiraj public access
    aws s3api put-public-access-block `
        --bucket $BUCKET_NAME `
        --public-access-block-configuration `
        "BlockPublicAcls=true,IgnorePublicAcls=true,BlockPublicPolicy=true,RestrictPublicBuckets=true"
    
    Write-Host "✅ Bucket konfiguracija postavljena" -ForegroundColor Green
}

# Postavi lifecycle policy
Write-Host "🔄 Postavljanje lifecycle policy..." -ForegroundColor Cyan

$lifecyclePolicy = @{
    Rules = @(
        @{
            Id = "MoveOldInvoicesToGlacier"
            Status = "Enabled"
            Prefix = "invoices/"
            Transitions = @(
                @{
                    Days = 90
                    StorageClass = "GLACIER_IR"
                }
            )
            Expiration = @{
                Days = 2555
            }
        }
    )
} | ConvertTo-Json -Depth 10

$tempFile = [System.IO.Path]::GetTempFileName()
$lifecyclePolicy | Out-File -FilePath $tempFile -Encoding UTF8

aws s3api put-bucket-lifecycle-configuration `
    --bucket $BUCKET_NAME `
    --lifecycle-configuration file://$tempFile `
    --region $REGION

Remove-Item $tempFile

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Lifecycle policy postavljena" -ForegroundColor Green
} else {
    Write-Host "⚠️  Greška pri postavljanju lifecycle policy (možda već postoji)" -ForegroundColor Yellow
}

# Test upload
Write-Host "🧪 Testiranje uploada..." -ForegroundColor Cyan

$testFile = [System.IO.Path]::GetTempFileName() + ".pdf"
"Test PDF content" | Out-File -FilePath $testFile -Encoding UTF8

aws s3 cp $testFile "s3://$BUCKET_NAME/invoices/TEST-0001.pdf" --region $REGION

if ($LASTEXITCODE -eq 0) {
    # Obriši test file
    aws s3 rm "s3://$BUCKET_NAME/invoices/TEST-0001.pdf" --region $REGION
    Remove-Item $testFile
    
    Write-Host "✅ Test upload uspješan" -ForegroundColor Green
} else {
    Write-Host "❌ Test upload neuspješan - provjeri IAM permissions" -ForegroundColor Red
    Write-Host "   Možda bucket postoji, ali nemaš permissions za upload" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "🎉 S3 bucket setup završen!" -ForegroundColor Green
Write-Host ""
Write-Host "📝 Sljedeći koraci:" -ForegroundColor Cyan
Write-Host "1. Dodaj environment varijable u ECS task definition:" -ForegroundColor White
Write-Host "   - AWS_S3_BUCKET_NAME=$BUCKET_NAME" -ForegroundColor Gray
Write-Host "   - AWS_REGION=$REGION" -ForegroundColor Gray
Write-Host ""
Write-Host "2. Provjeri IAM permissions za ECS task role (S3 pristup)" -ForegroundColor White
Write-Host "   Vidi: iam-policy-s3-invoices.json" -ForegroundColor Gray
Write-Host ""
Write-Host "3. Testiraj generiranje fakture preko API-ja" -ForegroundColor White
