# 🔄 Ažuriraj Twilio i Stripe Credentials u AWS Secrets Manager
# Automatski ažurira credentials i restartuje ECS service

param(
    [string]$Region = "eu-north-1",
    [string]$Cluster = "apps-cluster",
    [string]$Service = "uslugar-service-2gk1f1mv"
)

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Ažuriranje Twilio i Stripe Credentials" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# ========================================
# 1. TWILIO CREDENTIALS
# ========================================
Write-Host "📱 TWILIO CREDENTIALS" -ForegroundColor Yellow
Write-Host ""

$twilioSecretName = "uslugar-twilio-config"

# Provjeri da li secret postoji
try {
    $twilioSecretExists = aws secretsmanager describe-secret --secret-id $twilioSecretName --region $Region 2>$null
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Twilio secret '$twilioSecretName' ne postoji!" -ForegroundColor Red
        Write-Host "💡 Kreiraj secret prvo: .\uslugar\backend\setup-twilio-secrets.ps1" -ForegroundColor Yellow
        $createTwilioSecret = Read-Host "Želiš li kreirati novi secret? (y/n)"
        if ($createTwilioSecret -ne 'y') {
            exit 1
        }
    } else {
        Write-Host "✅ Twilio secret postoji" -ForegroundColor Green
    }
} catch {
    Write-Host "❌ Greška pri provjeri Twilio secret-a" -ForegroundColor Red
    exit 1
}

# Unos novih Twilio credentials
Write-Host ""
Write-Host "Unesi nove Twilio credentials:" -ForegroundColor Cyan
$twilioAccountSID = Read-Host "  Twilio Account SID"
$twilioAuthToken = Read-Host "  Twilio Auth Token" -AsSecureString
$twilioAuthTokenPlain = [Runtime.InteropServices.Marshal]::PtrToStringAuto(
    [Runtime.InteropServices.Marshal]::SecureStringToBSTR($twilioAuthToken)
)
$twilioPhoneNumber = Read-Host "  Twilio Phone Number (format: +1234567890)"

# Validacija
if ([string]::IsNullOrWhiteSpace($twilioAccountSID) -or 
    [string]::IsNullOrWhiteSpace($twilioAuthTokenPlain) -or 
    [string]::IsNullOrWhiteSpace($twilioPhoneNumber)) {
    Write-Host "❌ Svi Twilio podaci su obavezni!" -ForegroundColor Red
    exit 1
}

# Ažuriraj Twilio secret
Write-Host ""
Write-Host "📝 Ažuriranje Twilio secret-a..." -ForegroundColor Yellow
$twilioSecretJson = @{
    TWILIO_ACCOUNT_SID = $twilioAccountSID
    TWILIO_AUTH_TOKEN = $twilioAuthTokenPlain
    TWILIO_PHONE_NUMBER = $twilioPhoneNumber
} | ConvertTo-Json -Compress

try {
    aws secretsmanager put-secret-value `
        --secret-id $twilioSecretName `
        --secret-string $twilioSecretJson `
        --region $Region | Out-Null
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Twilio secret uspješno ažuriran!" -ForegroundColor Green
    } else {
        Write-Host "❌ Greška pri ažuriranju Twilio secret-a!" -ForegroundColor Red
        exit 1
    }
} catch {
    Write-Host "❌ Greška pri ažuriranju Twilio secret-a: $_" -ForegroundColor Red
    exit 1
}

# Očisti osjetljive podatke iz memorije
[Runtime.InteropServices.Marshal]::ZeroFreeBSTR(
    [Runtime.InteropServices.Marshal]::SecureStringToBSTR($twilioAuthToken)
)

# ========================================
# 2. STRIPE CREDENTIALS
# ========================================
Write-Host ""
Write-Host "💳 STRIPE CREDENTIALS" -ForegroundColor Yellow
Write-Host ""

# Stripe secret ARN-ovi (prema STRIPE-SETUP.ps1)
$stripeSecretKeyArn = "arn:aws:secretsmanager:eu-north-1:666203386231:secret:uslugar/stripe-secret-key-jKdcdD"
$stripePublishableKeyArn = "arn:aws:secretsmanager:eu-north-1:666203386231:secret:uslugar/stripe-publishable-key-37rvJI"

# Provjeri da li Stripe secrets postoje
Write-Host "Provjera Stripe secrets..." -ForegroundColor Gray
try {
    $stripeSecretExists = aws secretsmanager describe-secret --secret-id $stripeSecretKeyArn --region $Region 2>$null
    $stripePublishableExists = aws secretsmanager describe-secret --secret-id $stripePublishableKeyArn --region $Region 2>$null
    
    if ($LASTEXITCODE -ne 0) {
        Write-Host "⚠️  Neki Stripe secrets možda ne postoje. Nastavljamo..." -ForegroundColor Yellow
    } else {
        Write-Host "✅ Stripe secrets postoje" -ForegroundColor Green
    }
} catch {
    Write-Host "⚠️  Greška pri provjeri Stripe secrets. Nastavljamo..." -ForegroundColor Yellow
}

# Unos novih Stripe credentials
Write-Host ""
Write-Host "Unesi nove Stripe credentials:" -ForegroundColor Cyan
$stripeSecretKey = Read-Host "  Stripe Secret Key (sk_live_...)" -AsSecureString
$stripeSecretKeyPlain = [Runtime.InteropServices.Marshal]::PtrToStringAuto(
    [Runtime.InteropServices.Marshal]::SecureStringToBSTR($stripeSecretKey)
)
$stripePublishableKey = Read-Host "  Stripe Publishable Key (pk_live_...)" -AsSecureString
$stripePublishableKeyPlain = [Runtime.InteropServices.Marshal]::PtrToStringAuto(
    [Runtime.InteropServices.Marshal]::SecureStringToBSTR($stripePublishableKey)
)

$includeWebhook = Read-Host "  Ažurirati Stripe Webhook Secret? (y/n)"
$stripeWebhookSecretPlain = ""
if ($includeWebhook -eq 'y') {
    $stripeWebhookSecret = Read-Host "  Stripe Webhook Secret (whsec_...)" -AsSecureString
    $stripeWebhookSecretPlain = [Runtime.InteropServices.Marshal]::PtrToStringAuto(
        [Runtime.InteropServices.Marshal]::SecureStringToBSTR($stripeWebhookSecret)
    )
}

# Validacija
if ([string]::IsNullOrWhiteSpace($stripeSecretKeyPlain) -or 
    [string]::IsNullOrWhiteSpace($stripePublishableKeyPlain)) {
    Write-Host "⚠️  Stripe Secret Key i Publishable Key su obavezni!" -ForegroundColor Yellow
    $skipStripe = Read-Host "  Preskoči ažuriranje Stripe-a? (y/n)"
    if ($skipStripe -eq 'y') {
        Write-Host "⏭️  Preskačem Stripe ažuriranje" -ForegroundColor Gray
    } else {
        exit 1
    }
} else {
    # Ažuriraj Stripe Secret Key
    Write-Host ""
    Write-Host "📝 Ažuriranje Stripe Secret Key..." -ForegroundColor Yellow
    try {
        aws secretsmanager put-secret-value `
            --secret-id $stripeSecretKeyArn `
            --secret-string $stripeSecretKeyPlain `
            --region $Region | Out-Null
        
        if ($LASTEXITCODE -eq 0) {
            Write-Host "✅ Stripe Secret Key uspješno ažuriran!" -ForegroundColor Green
        } else {
            Write-Host "❌ Greška pri ažuriranju Stripe Secret Key!" -ForegroundColor Red
        }
    } catch {
        Write-Host "❌ Greška pri ažuriranju Stripe Secret Key: $_" -ForegroundColor Red
    }

    # Ažuriraj Stripe Publishable Key
    Write-Host "📝 Ažuriranje Stripe Publishable Key..." -ForegroundColor Yellow
    try {
        aws secretsmanager put-secret-value `
            --secret-id $stripePublishableKeyArn `
            --secret-string $stripePublishableKeyPlain `
            --region $Region | Out-Null
        
        if ($LASTEXITCODE -eq 0) {
            Write-Host "✅ Stripe Publishable Key uspješno ažuriran!" -ForegroundColor Green
        } else {
            Write-Host "❌ Greška pri ažuriranju Stripe Publishable Key!" -ForegroundColor Red
        }
    } catch {
        Write-Host "❌ Greška pri ažuriranju Stripe Publishable Key: $_" -ForegroundColor Red
    }

    # Ažuriraj Stripe Webhook Secret (ako je unesen)
    if (![string]::IsNullOrWhiteSpace($stripeWebhookSecretPlain)) {
        Write-Host "📝 Ažuriranje Stripe Webhook Secret..." -ForegroundColor Yellow
        
        # Pronađi ARN za webhook secret (može biti u drugom secret-u ili u istom)
        $webhookSecretArn = Read-Host "  Unesi ARN za Stripe Webhook Secret (ili pritisni Enter za preskakanje)"
        
        if (![string]::IsNullOrWhiteSpace($webhookSecretArn)) {
            try {
                aws secretsmanager put-secret-value `
                    --secret-id $webhookSecretArn `
                    --secret-string $stripeWebhookSecretPlain `
                    --region $Region | Out-Null
                
                if ($LASTEXITCODE -eq 0) {
                    Write-Host "✅ Stripe Webhook Secret uspješno ažuriran!" -ForegroundColor Green
                } else {
                    Write-Host "❌ Greška pri ažuriranju Stripe Webhook Secret!" -ForegroundColor Red
                }
            } catch {
                Write-Host "❌ Greška pri ažuriranju Stripe Webhook Secret: $_" -ForegroundColor Red
            }
        }
    }

    # Očisti osjetljive podatke iz memorije
    [Runtime.InteropServices.Marshal]::ZeroFreeBSTR(
        [Runtime.InteropServices.Marshal]::SecureStringToBSTR($stripeSecretKey)
    )
    [Runtime.InteropServices.Marshal]::ZeroFreeBSTR(
        [Runtime.InteropServices.Marshal]::SecureStringToBSTR($stripePublishableKey)
    )
    if (![string]::IsNullOrWhiteSpace($stripeWebhookSecretPlain)) {
        [Runtime.InteropServices.Marshal]::ZeroFreeBSTR(
            [Runtime.InteropServices.Marshal]::SecureStringToBSTR($stripeWebhookSecret)
        )
    }
}

# ========================================
# 3. RESTART ECS SERVICE
# ========================================
Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  RESTART ECS SERVICE" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "🔄 Restartovanje ECS service '$Service'..." -ForegroundColor Yellow
Write-Host "   Cluster: $Cluster" -ForegroundColor Gray
Write-Host "   Region: $Region" -ForegroundColor Gray
Write-Host ""

$confirmRestart = Read-Host "Želiš li restartovati ECS service? (y/n)"
if ($confirmRestart -ne 'y') {
    Write-Host "⏭️  Preskačem restart. Restartuj ručno:" -ForegroundColor Yellow
    Write-Host "   aws ecs update-service --cluster $Cluster --service $Service --force-new-deployment --region $Region" -ForegroundColor Gray
    exit 0
}

try {
    $updateResult = aws ecs update-service `
        --cluster $Cluster `
        --service $Service `
        --force-new-deployment `
        --region $Region | ConvertFrom-Json
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ ECS service restartovan!" -ForegroundColor Green
        Write-Host ""
        Write-Host "📊 Deployment Status:" -ForegroundColor Cyan
        Write-Host "   Service ARN: $($updateResult.service.serviceArn)" -ForegroundColor Gray
        Write-Host "   Desired Count: $($updateResult.service.desiredCount)" -ForegroundColor Gray
        Write-Host "   Running Count: $($updateResult.service.runningCount)" -ForegroundColor Gray
        Write-Host ""
        Write-Host "⏳ Pričekaj 2-3 minute da se deployment završi..." -ForegroundColor Yellow
    } else {
        Write-Host "❌ Greška pri restartovanju ECS service!" -ForegroundColor Red
        exit 1
    }
} catch {
    Write-Host "❌ Greška pri restartovanju ECS service: $_" -ForegroundColor Red
    exit 1
}

# ========================================
# 4. PROVJERA STATUSA
# ========================================
Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  PROVJERA STATUSA" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "🔍 Sljedeći koraci za provjeru:" -ForegroundColor Yellow
Write-Host ""
Write-Host "1. Provjeri Twilio logove (nakon 2-3 minute):" -ForegroundColor Cyan
Write-Host "   aws logs tail /ecs/uslugar --region $Region --filter-pattern `"TWILIO`" --since 5m" -ForegroundColor Gray
Write-Host ""
Write-Host "2. Provjeri Stripe logove (nakon 2-3 minute):" -ForegroundColor Cyan
Write-Host "   aws logs tail /ecs/uslugar --region $Region --filter-pattern `"STRIPE|PAYMENTS`" --since 5m" -ForegroundColor Gray
Write-Host ""
Write-Host "3. Provjeri da su novi credentials učitani:" -ForegroundColor Cyan
Write-Host "   Očekivani logovi:" -ForegroundColor Gray
Write-Host "   - [SMS Service] Twilio config check: { hasAccountSID: true, ... }" -ForegroundColor Gray
Write-Host "   - [PAYMENTS] Stripe initialized successfully" -ForegroundColor Gray
Write-Host ""

# Automatska provjera (opcionalno)
$autoCheck = Read-Host "Želiš li automatski provjeriti logove nakon 30 sekundi? (y/n)"
if ($autoCheck -eq 'y') {
    Write-Host ""
    Write-Host "⏳ Čekam 30 sekundi..." -ForegroundColor Yellow
    Start-Sleep -Seconds 30
    
    Write-Host ""
    Write-Host "🔍 Provjera Twilio logova..." -ForegroundColor Cyan
    aws logs tail /ecs/uslugar --region $Region --filter-pattern "TWILIO" --since 2m
    
    Write-Host ""
    Write-Host "🔍 Provjera Stripe logova..." -ForegroundColor Cyan
    aws logs tail /ecs/uslugar --region $Region --filter-pattern "STRIPE|PAYMENTS" --since 2m
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  ✅ ZAVRŠENO" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "💡 Napomene:" -ForegroundColor Yellow
Write-Host "   - Twilio: Provjeri da je phone number verificiran (ako je trial)" -ForegroundColor Gray
Write-Host "   - Stripe: Ažuriraj webhook URL u Stripe Dashboard-u ako je potrebno" -ForegroundColor Gray
Write-Host "   - Stripe: Kreiraj nove webhooke ako prelaziš na novi račun" -ForegroundColor Gray
Write-Host ""

