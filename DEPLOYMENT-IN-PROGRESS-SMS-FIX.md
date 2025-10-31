# 🚀 Deployment u tijeku: SMS Verifikacija Fix

## ✅ Što je napravljeno

1. **Backend deployment skripta kreirana:**
   - `uslugar/backend/deploy-sms-verification-fix.ps1`
   - Automatski build, push na ECR, i update ECS service

2. **Frontend build:**
   - Provjerite da li postoji `uslugar/frontend/dist/index.html`

---

## 🔄 Sljedeći koraci

### Backend Deployment (AWS ECS)

**Opcija 1: Pokrenite skriptu ručno:**
```powershell
cd C:\GIT_PROJEKTI\AWS\AWS_projekti\uslugar\backend
.\deploy-sms-verification-fix.ps1
```

**Opcija 2: Ručni deployment:**
```powershell
cd C:\GIT_PROJEKTI\AWS\AWS_projekti\uslugar\backend

# Build
docker build -t uslugar-backend:sms-verification-fix .

# Login ECR
$ecrRepo = "666203386231.dkr.ecr.eu-north-1.amazonaws.com/uslugar-backend"
aws ecr get-login-password --region eu-north-1 | docker login --username AWS --password-stdin $ecrRepo

# Tag
docker tag uslugar-backend:sms-verification-fix "$ecrRepo:latest"

# Push
docker push "$ecrRepo:latest"

# Update ECS
aws ecs update-service --cluster uslugar-cluster --service uslugar-backend-service --force-new-deployment --region eu-north-1
```

**Ako je drugačiji AWS Account ID, provjerite:**
```powershell
aws sts get-caller-identity --query Account --output text
```

---

### Frontend Deployment

**1. Build frontend (ako nije napravljen):**
```powershell
cd C:\GIT_PROJEKTI\AWS\AWS_projekti\uslugar\frontend
npm run build
```

**2. Upload na FTP:**
- **FileZilla ili WinSCP:**
  - Host: `ftp.oriph.io`
  - Lokacija: `/domains/uslugar.oriph.io/public_html/`
  - Upload sve iz `frontend/dist/`:
    - `index.html`
    - `assets/` (cijeli direktorij)
    - `uslugar.ico`

---

## 📊 Monitor Backend Deployment

```powershell
# Provjeri status servisa
aws ecs describe-services --cluster uslugar-cluster --services uslugar-backend-service --region eu-north-1

# Provjeri logove
aws logs tail /ecs/uslugar-backend --follow --region eu-north-1
```

---

## ✅ Testiranje nakon deploymenta

1. **Backend:**
   - Provjerite CloudWatch logove
   - Testirajte `/api/kyc/verify-identity` endpoint

2. **Frontend:**
   - Hard refresh (Ctrl + Shift + R)
   - Idite na Identity Badge verifikaciju
   - Odaberite "📱 Telefon"
   - Trebali biste vidjeti SMS workflow umjesto automatske verifikacije

3. **Navigacija:**
   - Testirajte "Nastavi na platformu" gumb
   - Trebao bi vodi na `#user` tab

---

## 🆘 Troubleshooting

**Backend deployment ne radi?**
- Provjerite Docker Desktop: `docker ps`
- Provjerite AWS credentials: `aws sts get-caller-identity`
- Provjerite ECR repository: `aws ecr describe-repositories --region eu-north-1`

**Frontend build ne radi?**
- Provjerite node_modules: `npm install`
- Provjerite da postoji `dist/` folder nakon builda

**SMS ne radi?**
- Provjerite Twilio credentials u backend `.env`
- Provjerite CloudWatch logove

---

**Status:** Deployment skripte su pripremljene i spremne za pokretanje! 🚀

