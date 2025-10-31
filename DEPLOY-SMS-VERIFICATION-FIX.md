# 🚀 Deployment: SMS Verifikacija Fix za Identity Badge

## 📋 Što je promijenjeno

### Backend
- ✅ `uslugar/backend/src/routes/kyc.js` - `/kyc/verify-identity` endpoint sada provjerava da li je telefon verificiran SMS kodom prije postavljanja `identityPhoneVerified`

### Frontend  
- ✅ `uslugar/frontend/src/components/IdentityBadgeVerification.jsx` - Integrirana `PhoneVerification` komponenta za SMS workflow
- ✅ `uslugar/frontend/src/App.jsx` - Dodan `'user'` u `validTabs` za ispravnu navigaciju

---

## 🐳 Backend Deployment (AWS ECS)

### Opcija 1: Korištenje postojeće skripte

```powershell
cd C:\GIT_PROJEKTI\AWS\AWS_projekti\uslugar\backend

# Koristite postojeću skriptu (provjerite parametre)
.\Deploy-UslugarApi.ps1 -Region "eu-north-1" -Cluster "uslugar-cluster" -Service "uslugar-backend-service" -Repo "uslugar-backend" -ForceLatest
```

### Opcija 2: Ručni deployment

```powershell
cd C:\GIT_PROJEKTI\AWS\AWS_projekti\uslugar\backend

# 1. Build Docker image
docker build -t uslugar-backend:sms-verification-fix .

# 2. Login to ECR (provjerite account ID)
$ECR_REPO = "666203386231.dkr.ecr.eu-north-1.amazonaws.com/uslugar-backend"
aws ecr get-login-password --region eu-north-1 | docker login --username AWS --password-stdin $ECR_REPO

# 3. Tag image
docker tag uslugar-backend:sms-verification-fix "$ECR_REPO:latest"

# 4. Push to ECR
docker push "$ECR_REPO:latest"

# 5. Update ECS service
aws ecs update-service `
    --cluster uslugar-cluster `
    --service uslugar-backend-service `
    --force-new-deployment `
    --region eu-north-1
```

**Provjerite AWS Account ID:**
```powershell
aws sts get-caller-identity --query Account --output text
```

Ako je drugačiji account ID, koristite taj u `$ECR_REPO`.

---

## 📦 Frontend Deployment (FTP)

### Korak 1: Build Frontend

```powershell
cd C:\GIT_PROJEKTI\AWS\AWS_projekti\uslugar\frontend
npm run build
```

Ovo kreira `dist/` direktorij s optimiziranim fajlovima.

### Korak 2: Upload na FTP

**FileZilla ili WinSCP:**

1. **Connect:**
   - Host: `ftp.oriph.io`
   - Username: vaš FTP username
   - Password: vaša FTP lozinka

2. **Upload lokacija:**
   - Remote: `/domains/uslugar.oriph.io/public_html/`

3. **Upload fajlove iz `frontend/dist/`:**
   - ✅ `index.html`
   - ✅ `assets/` (cijeli direktorij)
   - ✅ `uslugar.ico` (ako postoji)

4. **Overwrite** sve postojeće fajlove

---

## ✅ Testiranje

Nakon deploymenta:

1. **Backend:**
   - Provjerite CloudWatch logove: `/ecs/uslugar-backend`
   - Testirajte `/api/kyc/verify-identity` endpoint s telefonskim brojem

2. **Frontend:**
   - Hard refresh stranice (Ctrl + Shift + R)
   - Idite na Identity Badge verifikaciju
   - Odaberite "📱 Telefon"
   - Unesite telefonski broj
   - ✅ Trebali biste vidjeti SMS verifikacijski workflow

3. **Navigacija:**
   - Testirajte gumb "Nastavi na platformu" s email verifikacije
   - ✅ Trebao bi vodi na `#user` tab

---

## 📝 Notes

- Backend promjene nisu breaking changes - endpoint samo provjerava da li je telefon već verificiran
- Frontend promjene dodaju novi workflow, ali ne mijenjaju postojeće funkcionalnosti
- SMS verifikacija koristi postojeću Twilio integraciju

---

## 🆘 Troubleshooting

**Backend deployment ne radi?**
- Provjerite da je Docker Desktop pokrenut
- Provjerite AWS credentials: `aws sts get-caller-identity`
- Provjerite ECR repository name i region

**Frontend build ne radi?**
- Provjerite da je `node_modules` instaliran: `npm install`
- Provjerite da je `dist/` direktorij kreiran nakon builda

**SMS verifikacija ne radi?**
- Provjerite Twilio credentials u `.env` fajlu
- Provjerite CloudWatch logove za backend greške

