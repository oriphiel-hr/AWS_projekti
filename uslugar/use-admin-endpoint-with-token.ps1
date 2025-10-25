# USLUGAR - Koristi postojeći admin endpoint s tokenom
# =====================================================

Write-Host "🌱 USLUGAR - Koristi postojeći admin endpoint s tokenom" -ForegroundColor Green
Write-Host "=====================================================" -ForegroundColor Green

Write-Host "💡 KORAK 1: Dobij token za admin korisnika" -ForegroundColor Yellow
Write-Host "=======================================" -ForegroundColor Yellow

# Kreiraj admin korisnika ako ne postoji
$adminUser = @{
    email = "admin@uslugar.hr"
    password = "Admin123!"
    fullName = "Admin User"
    role = "ADMIN"
}

Write-Host "🔐 Kreiranje admin korisnika..." -ForegroundColor Yellow

# Registriraj admin korisnika
$registerResponse = Invoke-RestMethod -Uri "https://uslugar.api.oriph.io/api/auth/register" -Method POST -ContentType "application/json" -Body ($adminUser | ConvertTo-Json)

if ($LASTEXITCODE -ne 0) {
    Write-Host "⚠️ Admin korisnik možda već postoji, pokušavam login..." -ForegroundColor Yellow
    
    # Pokušaj login
    $loginData = @{
        email = $adminUser.email
        password = $adminUser.password
    }
    
    try {
        $loginResponse = Invoke-RestMethod -Uri "https://uslugar.api.oriph.io/api/auth/login" -Method POST -ContentType "application/json" -Body ($loginData | ConvertTo-Json)
        $token = $loginResponse.token
        Write-Host "✅ Login uspješan!" -ForegroundColor Green
    } catch {
        Write-Host "❌ Login neuspješan, pokušavam registraciju..." -ForegroundColor Red
        
        # Pokušaj registraciju
        try {
            $registerResponse = Invoke-RestMethod -Uri "https://uslugar.api.oriph.io/api/auth/register" -Method POST -ContentType "application/json" -Body ($adminUser | ConvertTo-Json)
            $token = $registerResponse.token
            Write-Host "✅ Registracija uspješna!" -ForegroundColor Green
        } catch {
            Write-Host "❌ Greška pri registraciji/login-u" -ForegroundColor Red
            Write-Host "Greška: $($_.Exception.Message)" -ForegroundColor Red
            exit 1
        }
    }
} else {
    $token = $registerResponse.token
    Write-Host "✅ Admin korisnik kreiran!" -ForegroundColor Green
}

Write-Host "🔑 Token: $($token.Substring(0, 20))..." -ForegroundColor Cyan

Write-Host "💡 KORAK 2: Pozovi admin endpoint s tokenom" -ForegroundColor Yellow
Write-Host "=========================================" -ForegroundColor Yellow

# Pozovi admin endpoint s tokenom
$headers = @{
    "Authorization" = "Bearer $token"
    "Content-Type" = "application/json"
}

Write-Host "🌱 Pozivanje admin endpoint-a..." -ForegroundColor Yellow

try {
    $response = Invoke-RestMethod -Uri "https://uslugar.api.oriph.io/api/admin/seed-categories" -Method POST -Headers $headers -Body "{}"
    
    Write-Host "✅ Odgovor:" -ForegroundColor Green
    $response | ConvertTo-Json -Depth 3
    
    Write-Host "🎉 Kategorije uspješno dodane!" -ForegroundColor Green
    Write-Host "🌐 Provjerite rezultate na https://uslugar.oriph.io" -ForegroundColor Cyan
    
} catch {
    Write-Host "❌ Greška pri pozivanju endpoint-a:" -ForegroundColor Red
    Write-Host "Status: $($_.Exception.Response.StatusCode)" -ForegroundColor Red
    Write-Host "Greška: $($_.Exception.Message)" -ForegroundColor Red
    
    # Pokušaj s drugim endpoint-om
    Write-Host "🔄 Pokušavam s drugim endpoint-om..." -ForegroundColor Yellow
    
    try {
        $response2 = Invoke-RestMethod -Uri "https://uslugar.api.oriph.io/api/admin/add-categories" -Method POST -Headers $headers -Body "{}"
        
        Write-Host "✅ Odgovor (drugi endpoint):" -ForegroundColor Green
        $response2 | ConvertTo-Json -Depth 3
        
        Write-Host "🎉 Kategorije uspješno dodane!" -ForegroundColor Green
        
    } catch {
        Write-Host "❌ Oba endpoint-a ne rade" -ForegroundColor Red
        Write-Host "Status: $($_.Exception.Response.StatusCode)" -ForegroundColor Red
        Write-Host "Greška: $($_.Exception.Message)" -ForegroundColor Red
    }
}

Write-Host "🏁 Gotovo!" -ForegroundColor Green
