# ⚡ USLUGAR EXCLUSIVE - Quick Start

## 🚀 Za Deployment (30 min)

### 1. Backup baze (2 min)
```bash
aws rds create-db-snapshot \
  --db-instance-identifier uslugar-db \
  --db-snapshot-identifier pre-exclusive-$(date +%Y%m%d)
```

### 2. Database Migration (5 min)
```bash
cd uslugar/backend
npm run migrate:deploy
```

### 3. Deploy Backend (10 min)
```bash
# Build & Push
docker build -t uslugar-exclusive .
aws ecr get-login-password | docker login ...
docker tag uslugar-exclusive:latest ...ECR.../uslugar-api:exclusive
docker push ...ECR.../uslugar-api:exclusive

# Deploy
aws ecs update-service --cluster uslugar-cluster --service uslugar-service --force-new-deployment
```

### 4. Verifikacija (5 min)
```bash
# Health check
curl https://api.uslugar.oriph.io/health

# Test subscription plans
curl https://api.uslugar.oriph.io/api/subscriptions/plans

# Test legal statuses (auto-seeded)
curl https://api.uslugar.oriph.io/api/legal-statuses
```

---

## 🧪 Za Testiranje (15 min)

### 1. Kreiraj Test Provider
```bash
curl -X POST https://api.uslugar.oriph.io/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test.provider@uslugar.hr",
    "password": "Test123",
    "fullName": "Test Provider",
    "role": "PROVIDER",
    "legalStatusId": "cls2_sole_trader",
    "taxId": "12345678901",
    "companyName": "Test Obrt"
  }'
```

### 2. Login & Get Token
```bash
TOKEN=$(curl -X POST https://api.uslugar.oriph.io/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test.provider@uslugar.hr","password":"Test123"}' \
  | jq -r '.token')
```

### 3. Provjeri Kredite (trebao bi imati 2 free - TRIAL)
```bash
curl https://api.uslugar.oriph.io/api/exclusive/leads/credits/balance \
  -H "Authorization: Bearer $TOKEN"
```

### 4. Pregled Dostupnih Leadova
```bash
curl https://api.uslugar.oriph.io/api/exclusive/leads/available \
  -H "Authorization: Bearer $TOKEN"
```

### 5. Kupi Lead
```bash
curl -X POST https://api.uslugar.oriph.io/api/exclusive/leads/JOB_ID/purchase \
  -H "Authorization: Bearer $TOKEN"
```

### 6. ROI Dashboard
```bash
curl https://api.uslugar.oriph.io/api/exclusive/roi/dashboard \
  -H "Authorization: Bearer $TOKEN"
```

---

## 📱 Što je novo?

### ✅ Ekskluzivni Leadovi
- 1 lead = 1 provider (bez konkurencije)
- AI quality score 0-100
- Cijena 5-20 kredita

### ✅ Credit System
- TRIAL: 2 free kredita
- BASIC: 39€ = 10 kredita
- PREMIUM: 89€ = 25 kredita
- PRO: 149€ = 50 kredita

### ✅ Refund System
- Automatska refundacija ako klijent ne odgovori
- Request preko API: `POST /api/exclusive/leads/purchases/:id/refund`

### ✅ ROI Dashboard
- Conversion rate
- ROI postotak
- Prosječna vrijednost leada
- Personalizirani insights

### ✅ Client Verification
- Phone verification (SMS)
- Email verification
- ID verification
- Company verification
- Trust score 0-100

---

## 🔑 Ključni Endpointi

```
# LEADOVI
GET    /api/exclusive/leads/available
POST   /api/exclusive/leads/:jobId/purchase
GET    /api/exclusive/leads/my-leads
POST   /api/exclusive/leads/purchases/:id/contacted
POST   /api/exclusive/leads/purchases/:id/converted
POST   /api/exclusive/leads/purchases/:id/refund

# KREDITI
GET    /api/exclusive/leads/credits/balance
GET    /api/exclusive/leads/credits/history
POST   /api/exclusive/leads/credits/purchase

# ROI
GET    /api/exclusive/roi/dashboard
GET    /api/exclusive/roi/monthly-stats
GET    /api/exclusive/roi/top-leads

# VERIFIKACIJA
GET    /api/verification/status
POST   /api/verification/phone/send-code
POST   /api/verification/phone/verify-code
POST   /api/verification/company/verify

# PRETPLATA
GET    /api/subscriptions/plans
GET    /api/subscriptions/me
POST   /api/subscriptions/subscribe
```

---

## 🐛 Troubleshooting

### Legal statuses missing?
```bash
# Restart backend - auto-seed će se pokrenuti
# ILI
npm run seed:legal
```

### Insufficient credits?
```sql
-- Manual dodavanje (za testiranje)
UPDATE "Subscription" SET "creditsBalance" = 100 WHERE "userId" = 'USER_ID';
```

### Lead already assigned?
To je normalno! Ekskluzivni lead se može kupiti samo jednom.

---

## 📞 Support

**Greška?** Provjeri logove:
```bash
aws logs tail /ecs/uslugar --follow --region eu-north-1
```

**Pitanje?** Pogledaj dokumentaciju:
- `USLUGAR_EXCLUSIVE_README.md`
- `DEPLOYMENT_EXCLUSIVE.md`
- `USLUGAR_EXCLUSIVE_SUMMARY.md`

---

**Ready to go!** 🚀

