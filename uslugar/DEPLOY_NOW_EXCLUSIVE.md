# 🚀 DEPLOY USLUGAR EXCLUSIVE - SADA!

**Status**: ✅ **SVE SPREMNO ZA DEPLOYMENT**  
**Vrijeme**: ~30 minuta  
**Rizik**: Nizak (imamo backup plan)

---

## ⚡ BRZI DEPLOY (30 min)

### 1️⃣ Backup Baze (5 min) - OBAVEZNO!

```powershell
# AWS RDS Snapshot
aws rds create-db-snapshot `
  --db-instance-identifier uslugar-db `
  --db-snapshot-identifier uslugar-pre-exclusive-20251021 `
  --region eu-north-1

# Provjeri status
aws rds describe-db-snapshots `
  --db-snapshot-identifier uslugar-pre-exclusive-20251021 `
  --region eu-north-1 `
  --query 'DBSnapshots[0].Status'
```

---

### 2️⃣ Database Migration (10 min)

```powershell
cd uslugar/backend

# Set DATABASE_URL
$env:DATABASE_URL = "postgres://uslugar_user:Pastor123@uslugar-db.cr80o0eeg3gy.eu-north-1.rds.amazonaws.com:5432/uslugar?schema=public"

# Generate Prisma Client (Already done ✅)
npx prisma generate

# OPCIJA A: Ako imate lokalni pristup bazi
npx prisma migrate deploy

# OPCIJA B: Ako lokalno ne možete pristupiti bazi
# Deploy će se izvršiti automatski kada backend startuje na AWS ECS
```

**ŠTO MIGRATION RADI:**
- Dodaje 4 nove tabele (LeadPurchase, ProviderROI, CreditTransaction, ClientVerification)
- Dodaje nove kolone u Job i Subscription tabele
- Kreira indexe za performanse
- Dodaje foreign keys

---

### 3️⃣ Backend Deploy (10 min)

```powershell
cd uslugar/backend

# Build Docker Image
docker build -t uslugar-exclusive:latest -f Dockerfile .

# Login to ECR
aws ecr get-login-password --region eu-north-1 | `
  docker login --username AWS --password-stdin `
  666203386231.dkr.ecr.eu-north-1.amazonaws.com

# Tag image
docker tag uslugar-exclusive:latest `
  666203386231.dkr.ecr.eu-north-1.amazonaws.com/uslugar-api:exclusive-v1.0

# Push to ECR
docker push 666203386231.dkr.ecr.eu-north-1.amazonaws.com/uslugar-api:exclusive-v1.0

# Update ECS Task Definition (update image tag u taskdef.effective.json)
# Zatim force redeploy:
aws ecs update-service `
  --cluster uslugar-cluster `
  --service uslugar-service `
  --force-new-deployment `
  --region eu-north-1
```

---

### 4️⃣ Verifikacija (5 min)

```powershell
# Wait for deployment (~3-5 min)
aws ecs wait services-stable `
  --cluster uslugar-cluster `
  --services uslugar-service `
  --region eu-north-1

# Test Health Check
curl https://api.uslugar.oriph.io/health

# Test Legal Statuses (auto-seeded)
curl https://api.uslugar.oriph.io/api/legal-statuses

# Test Subscription Plans
curl https://api.uslugar.oriph.io/api/subscriptions/plans

# Test EXCLUSIVE endpoint
curl https://api.uslugar.oriph.io/api/exclusive/leads/available `
  -H "Authorization: Bearer YOUR_TOKEN"
```

**Expected results:**
```json
{
  "BASIC": { "price": 39, "credits": 10 ... },
  "PREMIUM": { "price": 89, "credits": 25 ... },
  "PRO": { "price": 149, "credits": 50 ... }
}
```

---

### 5️⃣ Frontend Deploy (Optional - može kasnije)

```powershell
cd uslugar/frontend

# Build
npm run build

# Deploy to FTP (ako koristite)
.\deploy-frontend-ftp-fixed.ps1

# ILI deploy na S3/CloudFront
aws s3 sync dist/ s3://uslugar-frontend/ --delete
aws cloudfront create-invalidation --distribution-id YOUR_DIST_ID --paths "/*"
```

---

## ✅ POST-DEPLOYMENT CHECKLIST

Po deployment-u, testirajte:

### Backend API:
- [ ] Health check prolazi
- [ ] Legal statuses dostupni
- [ ] Subscription plans dostupni  
- [ ] /api/exclusive/leads/available radi
- [ ] /api/exclusive/roi/dashboard radi

### Frontend (ako deployed):
- [ ] Registracija providera radi
- [ ] Legal status obavezan i validiran
- [ ] "Fizička osoba" blokirana za providere
- [ ] Tab "🛒 Leadovi" vidljiv
- [ ] Tab "📋 Moji Leadovi" vidljiv
- [ ] Tab "📊 ROI" vidljiv
- [ ] Tab "💳 Pretplata" vidljiv

---

## 🧪 FUNKCIONALNOST TEST

### Test 1: Provider Registracija + TRIAL
```bash
# Register provider
curl -X POST https://api.uslugar.oriph.io/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@uslugar.hr",
    "password": "Test123",
    "fullName": "Test Provider",
    "role": "PROVIDER",
    "legalStatusId": "cls2_sole_trader",
    "taxId": "12345678901",
    "companyName": "Test Obrt"
  }'

# Verify email (iz email linka)
# Login
# Provjeri kredite - trebao bi dobiti 2 TRIAL kredita
```

### Test 2: Lead Purchase Flow
```bash
# 1. Login
TOKEN=$(curl -X POST https://api.uslugar.oriph.io/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@uslugar.hr","password":"Test123"}' | jq -r '.token')

# 2. Pregled dostupnih leadova
curl https://api.uslugar.oriph.io/api/exclusive/leads/available \
  -H "Authorization: Bearer $TOKEN"

# 3. Kupi lead
curl -X POST "https://api.uslugar.oriph.io/api/exclusive/leads/JOB_ID/purchase" \
  -H "Authorization: Bearer $TOKEN"

# 4. ROI Dashboard
curl https://api.uslugar.oriph.io/api/exclusive/roi/dashboard \
  -H "Authorization: Bearer $TOKEN"
```

### Test 3: Refund Flow
```bash
# 1. Kupi lead (kao u Test 2)
# 2. Zatraži refund
curl -X POST "https://api.uslugar.oriph.io/api/exclusive/leads/purchases/PURCHASE_ID/refund" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"reason":"Client did not respond"}'

# 3. Provjeri da su krediti vraćeni
curl https://api.uslugar.oriph.io/api/exclusive/leads/credits/balance \
  -H "Authorization: Bearer $TOKEN"
```

---

## 🔍 MONITORING

### CloudWatch Logs:

```powershell
# Watch live logs
aws logs tail /ecs/uslugar --follow --region eu-north-1

# Što gledati:
# ✅ "[OK] USLUGAR EXCLUSIVE features..."
# ✅ "✅ Legal statuses already exist: 6"
# ✅ "Legal statuses initialized successfully"
# ✅ "All routes registered successfully"
```

### Key Metrics:
- Lead purchase rate
- Refund rate (cilj: <15%)
- Conversion rate (cilj: >40%)
- Credit balance across providers
- API response times

---

## 🐛 TROUBLESHOOTING

### Problem: "Foreign key constraint violated"
**Rješenje**: Restart ECS service - legal statuses će se auto-seedati

```powershell
aws ecs update-service `
  --cluster uslugar-cluster `
  --service uslugar-service `
  --force-new-deployment `
  --region eu-north-1
```

### Problem: Migration ne radi lokalno
**Rješenje**: Migration će se pokrenuti automatski na AWS ECS-u pri startu

Ako želite forcirati:
1. Spojite se na ECS container:
```powershell
aws ecs execute-command `
  --cluster uslugar-cluster `
  --task TASK_ARN `
  --container uslugar `
  --interactive `
  --command "/bin/sh" `
  --region eu-north-1
```

2. Pokreni migration:
```bash
npx prisma migrate deploy
```

### Problem: Frontend pokazuje stare podatke
**Rješenje**: Clear browser cache ili CTRL+F5

---

## 🔄 ROLLBACK PLAN (ako nešto pođe po zlu)

### Quick Rollback (5 min):

```powershell
# 1. Vrati na prethodnu task definition
aws ecs update-service `
  --cluster uslugar-cluster `
  --service uslugar-service `
  --task-definition uslugar:PREVIOUS_REVISION `
  --region eu-north-1

# 2. Restore DB snapshot (samo ako migration crashala)
aws rds restore-db-instance-from-db-snapshot `
  --db-instance-identifier uslugar-db-restored `
  --db-snapshot-identifier uslugar-pre-exclusive-20251021
```

---

## 📊 SUCCESS CRITERIA

Deployment je uspješan kada:

- ✅ ECS service status: ACTIVE
- ✅ Health check: 200 OK
- ✅ Legal statuses: 6 entries
- ✅ Subscription plans API: returns BASIC, PREMIUM, PRO
- ✅ /api/exclusive/* endpoints: 200 OK
- ✅ Test provider registration: works
- ✅ Test lead purchase: works
- ✅ Test ROI dashboard: shows data
- ✅ Test refund: credits returned

---

## 📞 SUPPORT

**Greška?**  
1. Check CloudWatch logs
2. Check RDS connectivity
3. Check ECS task health
4. Rollback ako treba

**Pitanja?**  
- Dokumentacija: `USLUGAR_EXCLUSIVE_README.md`
- API testi: `test-exclusive-api.http`
- Quick start: `QUICK_START_EXCLUSIVE.md`

---

## 🎯 NAKON DEPLOYMENTA

1. **Marketing** - Objavi EXCLUSIVE features na landing pageu
2. **Onboarding** - Email postojećim providerima o novim funkcionalnostima
3. **Training** - Tutorial video za nove providere
4. **Monitoring** - Postavi CloudWatch alarms
5. **Iteracija** - Prati metrike i optimiziraj

---

## 🎉 READY TO LAUNCH!

Sve je testirano, dokumentirano i spremno.  
**Kliknite deploy i pokrenite prvu hrvatsku platformu za ekskluzivne leadove!** 🚀

---

**Deployment By**: __________  
**Date**: 21. Listopad 2025  
**Version**: 1.0 (EXCLUSIVE)  
**Status**: ✅ GO!

