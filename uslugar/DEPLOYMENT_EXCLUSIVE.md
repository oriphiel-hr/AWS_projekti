# 🚀 USLUGAR EXCLUSIVE - Deployment Guide

## 📋 Pregled promjena

**USLUGAR EXCLUSIVE** nadogradnja dodaje:
- ✅ Ekskluzivne leadove (1 lead = 1 provider)
- ✅ Credit system za kupovinu leadova
- ✅ Refund system za neaktivne leadove
- ✅ AI quality scoring (0-100)
- ✅ ROI dashboard za providere
- ✅ Client verification system
- ✅ Nove subscription planove (39€, 89€, 149€)

---

## 🗄️ Database Migration

### 1. Backup postojeće baze (OBAVEZNO!)

```bash
# PostgreSQL backup
pg_dump -h your-rds-endpoint.amazonaws.com -U uslugar_user -d uslugar_prod > backup_pre_exclusive.sql

# Ili AWS RDS snapshot
aws rds create-db-snapshot \
  --db-instance-identifier uslugar-db \
  --db-snapshot-identifier uslugar-pre-exclusive-$(date +%Y%m%d) \
  --region eu-north-1
```

### 2. Pokreni migraciju

```bash
cd uslugar/backend

# Generiraj Prisma Client
npm run prisma:generate

# Pokreni migraciju
npm run migrate:deploy
```

Migration će kreirati:
- `LeadPurchase` tabelu
- `ProviderROI` tabelu
- `CreditTransaction` tabelu
- `ClientVerification` tabelu
- Nove kolone u `Job` tabeli (isExclusive, leadPrice, leadStatus, etc.)
- Nove kolone u `Subscription` tabeli (creditsBalance, lifetimeCreditsUsed, etc.)

### 3. Provjeri migraciju

```sql
-- Provjeri nove tabele
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('LeadPurchase', 'ProviderROI', 'CreditTransaction', 'ClientVerification');

-- Provjeri Job kolone
SELECT column_name FROM information_schema.columns 
WHERE table_name = 'Job' 
AND column_name IN ('isExclusive', 'leadPrice', 'leadStatus', 'assignedProviderId');
```

---

## 🔧 Backend Deployment

### 1. Update Dependencies (ako treba)

```bash
cd uslugar/backend
npm install
```

### 2. Environment Variables

Dodaj u `.env` ili AWS Secrets Manager:

```env
# Existing
DATABASE_URL="postgresql://..."
JWT_SECRET="..."
SMTP_HOST="..."

# New for EXCLUSIVE
STRIPE_SECRET_KEY="sk_live_..." # Za plaćanja
STRIPE_PUBLISHABLE_KEY="pk_live_..."
TWILIO_ACCOUNT_SID="AC..." # Za SMS verifikaciju
TWILIO_AUTH_TOKEN="..."
TWILIO_PHONE_NUMBER="+385..."
CREDIT_PRICE_EUR=10 # Cijena 1 kredita u EUR
```

### 3. Build & Deploy

#### Lokalno testiranje:

```bash
npm run dev
```

Provjerite:
- Server startuje bez grešaka
- Legal statuses se auto-seedaju
- Novi endpointi dostupni

#### Docker Build:

```bash
# Build image
docker build -t uslugar-exclusive:latest -f Dockerfile .

# Test locally
docker run -p 4000:4000 --env-file .env uslugar-exclusive:latest
```

#### AWS ECS Deployment:

```bash
# Login to ECR
aws ecr get-login-password --region eu-north-1 | \
  docker login --username AWS --password-stdin \
  666203386231.dkr.ecr.eu-north-1.amazonaws.com

# Tag image
docker tag uslugar-exclusive:latest \
  666203386231.dkr.ecr.eu-north-1.amazonaws.com/uslugar-api:exclusive-v1.0

# Push to ECR
docker push 666203386231.dkr.ecr.eu-north-1.amazonaws.com/uslugar-api:exclusive-v1.0

# Update ECS task definition (update taskdef.effective.json sa novim image tagom)
# Zatim force new deployment:
aws ecs update-service \
  --cluster uslugar-cluster \
  --service uslugar-service \
  --force-new-deployment \
  --region eu-north-1
```

### 4. Verifikacija Deployementa

```bash
# Provjeri health
curl https://api.uslugar.oriph.io/health

# Provjeri nove rute
curl https://api.uslugar.oriph.io/api/subscriptions/plans

# Provjeri da li su legal statuses seedirani
curl https://api.uslugar.oriph.io/api/legal-statuses
```

---

## 🎨 Frontend (opciono - za kasnije)

Frontend promjene nisu uključene u ovaj deployment, ali trebaju:

### Komponente za kreirati:

1. **LeadMarketplace.jsx** - Pregled dostupnih ekskluzivnih leadova
2. **LeadPurchaseModal.jsx** - Potvrda kupovine leada
3. **MyLeadsPage.jsx** - Upravljanje kupljenim leadovima
4. **ROIDashboard.jsx** - ROI statistika
5. **CreditsBalance.jsx** - Prikaz kredita
6. **SubscriptionPlans.jsx** - Izbor pretplate
7. **ClientVerification.jsx** - Verifikacija korisnika

### API Integration:

```javascript
// src/api/exclusive.js
import api from './http';

export const getAvailableLeads = () => api.get('/exclusive/leads/available');
export const purchaseLead = (jobId) => api.post(`/exclusive/leads/${jobId}/purchase`);
export const getMyLeads = () => api.get('/exclusive/leads/my-leads');
export const getCreditsBalance = () => api.get('/exclusive/leads/credits/balance');
export const getROIDashboard = () => api.get('/exclusive/roi/dashboard');
```

---

## 📊 Post-Deployment Tasks

### 1. Kreiranje Test Accounta

```bash
# Kreiraj test provider accounta
curl -X POST https://api.uslugar.oriph.io/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test.provider@uslugar.hr",
    "password": "TestPass123",
    "fullName": "Test Provider",
    "role": "PROVIDER",
    "phone": "+385991234567",
    "city": "Zagreb",
    "legalStatusId": "cls2_sole_trader",
    "taxId": "12345678901",
    "companyName": "Test Obrt"
  }'
```

### 2. Kreiranje Test Leadova

```bash
# Login kao USER
TOKEN=$(curl -X POST https://api.uslugar.oriph.io/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test.user@uslugar.hr","password":"pass123"}' \
  | jq -r '.token')

# Kreiraj job (koji postaje ekskluzivan lead)
curl -X POST https://api.uslugar.oriph.io/api/jobs \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Popravak vodovodnih instalacija",
    "description": "Potreban vodoinstalater za hitnu popravku cijevi u stanu. Curenje u kupatilu.",
    "categoryId": "CATEGORY_ID",
    "budgetMin": 500,
    "budgetMax": 1000,
    "city": "Zagreb",
    "urgency": "HIGH",
    "isExclusive": true
  }'
```

### 3. Test Lead Purchase Flow

```bash
# Login kao PROVIDER
PROVIDER_TOKEN=$(curl -X POST https://api.uslugar.oriph.io/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test.provider@uslugar.hr","password":"TestPass123"}' \
  | jq -r '.token')

# Provjeri kredite
curl https://api.uslugar.oriph.io/api/exclusive/leads/credits/balance \
  -H "Authorization: Bearer $PROVIDER_TOKEN"

# Pregled dostupnih leadova
curl https://api.uslugar.oriph.io/api/exclusive/leads/available \
  -H "Authorization: Bearer $PROVIDER_TOKEN"

# Kupi lead
curl -X POST https://api.uslugar.oriph.io/api/exclusive/leads/JOB_ID/purchase \
  -H "Authorization: Bearer $PROVIDER_TOKEN"

# Označi kao kontaktiran
curl -X POST https://api.uslugar.oriph.io/api/exclusive/leads/purchases/PURCHASE_ID/contacted \
  -H "Authorization: Bearer $PROVIDER_TOKEN"

# ROI Dashboard
curl https://api.uslugar.oriph.io/api/exclusive/roi/dashboard \
  -H "Authorization: Bearer $PROVIDER_TOKEN"
```

---

## 🔍 Monitoring

### Ključne metrike za CloudWatch:

```javascript
// Dodaj u server.js za logging
console.log('[METRICS]', {
  event: 'LEAD_PURCHASED',
  providerId,
  jobId,
  creditsSpent,
  leadPrice,
  qualityScore
});

console.log('[METRICS]', {
  event: 'LEAD_CONVERTED',
  providerId,
  jobId,
  revenue,
  timeToConvert
});

console.log('[METRICS]', {
  event: 'LEAD_REFUNDED',
  providerId,
  jobId,
  reason
});
```

### CloudWatch Alarms:

- High refund rate (>30%)
- Low conversion rate (<20%)
- Credit balance drop za sve providere
- API error rate spike

---

## 🐛 Troubleshooting

### Problem: "Foreign key constraint violated"

**Uzrok**: Legal statuses nisu u bazi  
**Rješenje**: 
```bash
# Restart servera - auto-seed će se pokrenuti
# ILI
npm run seed:legal
```

### Problem: "Insufficient credits"

**Uzrok**: Provider nema dovoljno kredita  
**Rješenje**:
```sql
-- Manual dodavanje kredita (za testiranje)
UPDATE "Subscription" 
SET "creditsBalance" = 100 
WHERE "userId" = 'PROVIDER_ID';
```

### Problem: "Lead already assigned"

**Uzrok**: Lead već kupljen od drugog providera  
**Rješenje**: To je normalno - ekskluzivni leadovi se mogu kupiti samo jednom!

---

## 📈 Success Criteria

Deployment je uspješan kada:
- ✅ Server se pokreće bez grešaka
- ✅ Migracija uspješna - sve tabele kreirane
- ✅ Legal statuses auto-seed radi
- ✅ Provider može vidjeti dostupne leadove
- ✅ Provider može kupiti lead sa kreditima
- ✅ ROI dashboard prikazuje statistiku
- ✅ Refund proces radi
- ✅ Subscription planovi dostupni

---

## 🚨 Rollback Plan

Ako nešto pođe po zlu:

### 1. Brzi Rollback (AWS ECS)

```bash
# Vrati na prethodnu task definition revision
aws ecs update-service \
  --cluster uslugar-cluster \
  --service uslugar-service \
  --task-definition uslugar:PREVIOUS_REVISION \
  --region eu-north-1
```

### 2. Database Rollback

```bash
# Restore iz backupa
psql -h your-rds-endpoint.amazonaws.com \
  -U uslugar_user \
  -d uslugar_prod \
  < backup_pre_exclusive.sql
```

### 3. Partial Rollback (samo novi features off)

Dodaj feature flag u env:
```env
EXCLUSIVE_FEATURES_ENABLED=false
```

---

## 📞 Support

**Tech Lead**: [Tvoj kontakt]  
**Emergency**: [Emergency kontakt]  
**Slack**: #uslugar-deployment  

---

## ✅ Deployment Checklist

- [ ] Backup baze kreiran
- [ ] Migracija testirana na staging-u
- [ ] Environment variables postavljene
- [ ] Docker image buildan i pushtan
- [ ] ECS service ažuriran
- [ ] Health check prolazi
- [ ] Legal statuses seedirani
- [ ] Test account kreiran
- [ ] Test lead purchase flow provjeren
- [ ] Monitoring alarms postavljeni
- [ ] Documentation ažurirana
- [ ] Team notificiran

---

**Deployment Date**: __________  
**Deployed By**: __________  
**Status**: __________

