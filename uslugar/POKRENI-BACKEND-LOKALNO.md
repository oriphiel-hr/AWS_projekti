# 🚀 Pokreni Backend Lokalno - Korak po korak

## Preduvjeti

### 1. PostgreSQL baza mora biti pokrenuta

**Provjeri:**
```powershell
# Ako koristiš PostgreSQL lokalno
pg_isready
```

**Ako nemaš PostgreSQL:**
- Download: https://www.postgresql.org/download/
- Ili koristi Docker: `docker run -d -p 5432:5432 -e POSTGRES_PASSWORD=password postgres`

---

### 2. Ažuriraj DATABASE_URL u `.env`

Otvori `uslugar/backend/.env` i promijeni:

```env
# Ako koristiš lokalnu PostgreSQL bazu
DATABASE_URL="postgresql://postgres:password@localhost:5432/uslugar_db?schema=public"

# Ili ako imaš remote bazu (npr. Railway, Supabase, itd.)
DATABASE_URL="postgresql://user:pass@host:5432/database?schema=public"
```

---

### 3. Run Prisma migrations (prvi put)

```powershell
cd C:\GIT_PROJEKTI\AWS\AWS_projekti\uslugar\backend

# Generate Prisma Client
npx prisma generate

# Run migrations (ako imaš lokalnu bazu)
npx prisma migrate dev
```

---

## Pokretanje Backend Servera

### Opcija A: Direktno u terminalu (preporučeno za debug)

```powershell
cd C:\GIT_PROJEKTI\AWS\AWS_projekti\uslugar\backend
node src/server.js
```

**Očekivani output:**
```
[OK] API listening on :8080
[OK] Socket.io ready for real-time chat
[OK] New features enabled: Upload, Notifications, Chat, Subscriptions, Geolocation
[OK] Routes registered: /api/jobs, /api/categories, /api/admin, /api/users
```

---

### Opcija B: Npm skripta

```powershell
cd C:\GIT_PROJEKTI\AWS\AWS_projekti\uslugar\backend
npm run dev
```

---

## Testiranje Email Slanja

### 1. Provjeri da server radi

```powershell
curl http://localhost:8080/health -UseBasicParsing
```

**Očekivano:** `{"ok":true}`

---

### 2. Testiraj registraciju sa email verifikacijom

```powershell
# Koristi test skriptu
cd C:\GIT_PROJEKTI\AWS\AWS_projekti\uslugar
.\test-registration.ps1
```

**Ili ručno:**

```powershell
$body = @{
    email = "test@example.com"
    password = "test123"
    fullName = "Test User"
    role = "USER"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:8080/api/auth/register" `
    -Method POST `
    -Headers @{"Content-Type"="application/json"} `
    -Body $body
```

---

### 3. Provjeri backend logs

**Očekivano (SUCCESS):**
```
[OK] Verification email sent to: test@example.com
```

**Ako vidiš ERROR:**
```
Error sending verification email: <detalji greške>
```

---

## Česte Greške

### ❌ "Environment variable not found: DATABASE_URL"

**Rješenje:**
- Provjeri da `.env` fajl postoji u `uslugar/backend/`
- Provjeri da ima `DATABASE_URL="..."`

---

### ❌ "Can't reach database server"

**Rješenje:**
- PostgreSQL nije pokrenuta
- Pokreni PostgreSQL servis
- Ili provjeri DATABASE_URL connection string

---

### ❌ "Error: P1001: Can't reach database server"

**Rješenje:**
- Host/Port u DATABASE_URL je krivi
- Check: `localhost:5432` ili remote host

---

### ❌ "Error sending verification email"

**Možući uzroci:**

**1. Invalid SMTP credentials**
```
Error: Invalid login
```
→ Provjeri SMTP_USER i SMTP_PASS u `.env`

**2. Connection timeout**
```
Error: Connection timeout
```
→ Provjeri SMTP_HOST i SMTP_PORT
→ Za Hostinger: `smtp.hostinger.com` port `465`

**3. SSL/TLS greška**
```
Error: self signed certificate
```
→ Port 465 koristi SSL (secure: true)
→ Port 587 koristi TLS (secure: false)

---

## Trenutna SMTP konfiguracija (.env)

```env
SMTP_HOST="smtp.hostinger.com"
SMTP_PORT="465"
SMTP_USER="uslugar@uslugar.oriph.io"
SMTP_PASS="Ja1Sam2Uslugar3!"
```

✅ **Ovo je PRAVILNA konfiguracija za Hostinger!**

---

## Debug Checklist

- [ ] PostgreSQL baza pokrenuta
- [ ] `.env` fajl postoji u `backend/`
- [ ] DATABASE_URL ispravno postavljen
- [ ] `npx prisma generate` pokrenut
- [ ] SMTP credentials ispravni
- [ ] Server pokrenut (`node src/server.js`)
- [ ] Port 8080 dostupan (nije zauzet)
- [ ] Test registracija poslana
- [ ] Backend logs pregledani

---

## Quick Start (Sve u jednom)

```powershell
# 1. Otvori novi PowerShell terminal
cd C:\GIT_PROJEKTI\AWS\AWS_projekti\uslugar\backend

# 2. Provjeri .env
Get-Content .env | Select-String "SMTP"
Get-Content .env | Select-String "DATABASE"

# 3. Generate Prisma (prvi put)
npx prisma generate

# 4. Pokreni server
node src/server.js

# Server bi trebao ispisati:
# [OK] API listening on :8080
# [OK] Socket.io ready...

# 5. U DRUGOM terminalu, testiraj:
cd C:\GIT_PROJEKTI\AWS\AWS_projekti\uslugar
.\test-registration.ps1
```

---

## Sljedeći koraci

Ako registracija uspije:
✅ Provjeriti email inbox `uslugar@uslugar.oriph.io`
✅ Kliknuti verification link
✅ User je verificiran!

Ako ne uspije:
❌ Pogledati backend logs za grešku
❌ Debug prema gore navedenim greškama

---

**Sad možeš pokrenuti backend i testirati email slanje!** 📧🚀


