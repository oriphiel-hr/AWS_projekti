# 🚀 Final Deployment - SMS Verification Fix

## ✅ Što je pripremljeno

1. ✅ **Backend deployment skripta:** `uslugar/backend/deploy-sms-verification-fix.ps1`
2. ✅ **Frontend build skripta:** `DEPLOY-NOW.ps1` (pokreće oba)
3. ✅ **Kod promjene:**
   - Backend: `/kyc/verify-identity` provjerava SMS verifikaciju
   - Frontend: `IdentityBadgeVerification` koristi SMS workflow
   - Frontend: Popravljena navigacija za `#user` tab

---

## 🚀 Brzi Deployment (Sve u jednom)

**Otvorite PowerShell i pokrenite:**

```powershell
cd C:\GIT_PROJEKTI\AWS\AWS_projekti
.\DEPLOY-NOW.ps1
```

Ova skripta će:
1. Build frontend (`npm run build`)
2. Deploy backend na AWS ECS (Docker build → ECR push → ECS update)

---

## 📦 Ručni Deployment (Korak po korak)

### Backend (AWS ECS)

```powershell
cd C:\GIT_PROJEKTI\AWS\AWS_projekti\uslugar\backend

# Opcija 1: Koristite skriptu
.\deploy-sms-verification-fix.ps1

# Opcija 2: Ručno
docker build -t uslugar-backend:sms-verification-fix .
$ecrRepo = "666203386231.dkr.ecr.eu-north-1.amazonaws.com/uslugar-backend"
aws ecr get-login-password --region eu-north-1 | docker login --username AWS --password-stdin $ecrRepo
docker tag uslugar-backend:sms-verification-fix "$ecrRepo:latest"
docker push "$ecrRepo:latest"
aws ecs update-service --cluster uslugar-cluster --service uslugar-backend-service --force-new-deployment --region eu-north-1
```

**Provjerite AWS Account ID ako treba:**
```powershell
aws sts get-caller-identity --query Account --output text
```

Ako je drugačiji, koristite taj u `$ecrRepo`.

---

### Frontend (FTP Upload)

```powershell
# 1. Build
cd C:\GIT_PROJEKTI\AWS\AWS_projekti\uslugar\frontend
npm run build

# 2. Provjerite build
# Lokacija: uslugar/frontend/dist/
# Trebali biste vidjeti: index.html, assets/, uslugar.ico

# 3. Upload na FTP (FileZilla ili WinSCP)
# Host: ftp.oriph.io
# Lokacija: /domains/uslugar.oriph.io/public_html/
# Upload SVE iz dist/ direktorija
```

---

## 📊 Monitor Deployment

### Backend Status

```powershell
# Provjeri ECS service status
aws ecs describe-services --cluster uslugar-cluster --services uslugar-backend-service --region eu-north-1 --query 'services[0].deployments'

# Provjeri logove
aws logs tail /ecs/uslugar-backend --follow --region eu-north-1
```

### Frontend Status

- Provjerite FTP upload
- Hard refresh stranice (Ctrl + Shift + R)
- Provjerite browser konzolu za greške

---

## ✅ Testiranje

### 1. Backend Test
- Provjerite CloudWatch logove za `/api/kyc/verify-identity` endpoint
- Trebao bi vraćati grešku ako telefon nije verificiran SMS kodom

### 2. Frontend Test
1. Idite na Identity Badge verifikaciju
2. Odaberite "📱 Telefon"
3. Unesite telefonski broj
4. ✅ **Trebali biste vidjeti SMS verifikacijski workflow** (ne automatska verifikacija)
5. Pošaljite SMS kod
6. Unesite kod
7. ✅ **Tek nakon toga se verificira Identity Badge**

### 3. Navigacija Test
1. Idite na email verifikaciju
2. Kliknite "Nastavi na platformu"
3. ✅ **Trebali biste biti preusmjereni na `#user` tab**

---

## 🆘 Troubleshooting

**Docker build ne radi?**
```powershell
# Provjeri Docker Desktop
docker ps

# Provjeri Dockerfile
cd uslugar\backend
Get-Content Dockerfile | Select-Object -First 10
```

**ECR login ne radi?**
```powershell
# Provjeri AWS credentials
aws sts get-caller-identity

# Provjeri region
aws ecr describe-repositories --region eu-north-1
```

**Frontend build ne radi?**
```powershell
cd uslugar\frontend
npm install
npm run build
```

**SMS verifikacija ne radi?**
- Provjerite Twilio credentials u backend `.env`:
  - `TWILIO_ACCOUNT_SID`
  - `TWILIO_AUTH_TOKEN`
  - `TWILIO_PHONE_NUMBER`
- Provjerite CloudWatch logove
- Provjerite da je `phoneVerified` u `User` modelu `true` prije Identity Badge verifikacije

---

## 📝 Promjene u kodu

### Backend
- `uslugar/backend/src/routes/kyc.js`:
  - `/kyc/verify-identity` endpoint sada provjerava `User.phoneVerified` prije postavljanja `identityPhoneVerified`

### Frontend
- `uslugar/frontend/src/components/IdentityBadgeVerification.jsx`:
  - Integrirana `PhoneVerification` komponenta
  - SMS workflow umjesto automatske verifikacije
- `uslugar/frontend/src/App.jsx`:
  - Dodan `'user'` u `validTabs` array

---

**Status:** ✅ Sve je spremno za deployment! Pokrenite `DEPLOY-NOW.ps1` ili slijedite ručne korake gore.

