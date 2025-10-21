# 🚀 USLUGAR EXCLUSIVE - Ekskluzivni Leadovi Platform

**Verzija**: 1.0  
**Datum**: Listopad 2025

## 📋 Pregled

**Uslugar EXCLUSIVE** je prva hrvatska digitalna platforma za **ekskluzivne leadove** - gdje **1 lead = 1 izvođač** bez konkurencije.

### Ključne razlike od konkurencije (Trebam.hr, Emajstor.hr):
- ✅ **Ekskluzivnost**: Lead se dodjeljuje samo jednom pružatelju
- ✅ **Refund system**: Automatska refundacija ako klijent ne odgovori
- ✅ **AI kvaliteta**: Svaki lead ima AI quality score (0-100)
- ✅ **ROI tracking**: Detaljne statistike profitabilnosti
- ✅ **Client verification**: Verifikacija klijenata za pouzdanost
- ✅ **Pay-per-lead ili pretplata**: Fleksibilnost plaćanja

---

## 🎯 Poslovni Model

### Subscription Planovi

| Plan | Cijena | Krediti | Features |
|------|--------|---------|----------|
| **TRIAL** | 0€ | 2 leada | 7 dana probno |
| **BASIC** | 39€/mj | 10 leadova | Ekskluzivni, refund, ROI |
| **PREMIUM** | 89€/mj | 25 leadova | + AI prioritet, analitika, SMS |
| **PRO** | 149€/mj | 50 leadova | + Premium kvaliteta, VIP podrška |

### Pay-per-lead cijena
- 5-20 kredita po leadu (ovisno o AI quality score)
- 1 kredit ≈ 10€
- Prosječno: **10€ po ekskluzivnom leadu**

---

## 🏗️ Arhitektura

### Backend Stack
```
- Node.js + Express
- Prisma ORM
- PostgreSQL (AWS RDS)
- Socket.io (real-time)
- AWS ECS (deployment)
```

### Novi Modeli (Prisma Schema)

**LeadPurchase** - Kupljeni ekskluzivni leadovi
```prisma
model LeadPurchase {
  id              String    @id
  jobId           String
  providerId      String
  creditsSpent    Int
  leadPrice       Int
  status          LeadPurchaseStatus // ACTIVE, CONTACTED, CONVERTED, REFUNDED
  contactedAt     DateTime?
  convertedAt     DateTime?
  refundedAt      DateTime?
  refundReason    String?
}
```

**ProviderROI** - ROI statistika
```prisma
model ProviderROI {
  id                    String   @id
  providerId            String   @unique
  totalLeadsPurchased   Int
  totalLeadsContacted   Int
  totalLeadsConverted   Int
  totalCreditsSpent     Int
  totalRevenue          Int
  conversionRate        Float
  roi                   Float
  avgLeadValue          Float
}
```

**CreditTransaction** - Povijest kredita
```prisma
model CreditTransaction {
  id          String    @id
  userId      String
  type        CreditTransactionType
  amount      Int
  balance     Int
  description String?
}
```

**ClientVerification** - Verifikacija klijenata
```prisma
model ClientVerification {
  id              String    @id
  userId          String    @unique
  phoneVerified   Boolean
  emailVerified   Boolean
  idVerified      Boolean
  companyVerified Boolean
  trustScore      Int       // 0-100
}
```

---

## 🔌 API Endpoints

### Exclusive Leads

```http
GET    /api/exclusive/leads/available         # Dohvati dostupne leadove
POST   /api/exclusive/leads/:jobId/purchase   # Kupi lead
GET    /api/exclusive/leads/my-leads          # Moji kupljeni leadovi
POST   /api/exclusive/leads/purchases/:id/contacted   # Označi kao kontaktiran
POST   /api/exclusive/leads/purchases/:id/converted   # Označi kao konvertiran
POST   /api/exclusive/leads/purchases/:id/refund      # Zatraži refund
```

### Credits

```http
GET    /api/exclusive/leads/credits/balance   # Trenutni balans
GET    /api/exclusive/leads/credits/history   # Povijest transakcija
POST   /api/exclusive/leads/credits/purchase  # Kupi kredite
```

### ROI Dashboard

```http
GET    /api/exclusive/roi/dashboard           # ROI pregled
GET    /api/exclusive/roi/monthly-stats       # Mjesečna statistika
GET    /api/exclusive/roi/top-leads           # Najbolji leadovi
```

### Client Verification

```http
GET    /api/verification/status               # Status verifikacije
POST   /api/verification/phone/send-code      # Pošalji SMS kod
POST   /api/verification/phone/verify-code    # Potvrdi telefon
POST   /api/verification/id/upload            # Upload osobne
POST   /api/verification/company/verify       # Verifikacija firme
```

### Subscriptions

```http
GET    /api/subscriptions/plans               # Dostupni planovi
GET    /api/subscriptions/me                  # Moja pretplata
POST   /api/subscriptions/subscribe           # Pretplati se
POST   /api/subscriptions/cancel              # Otkaži pretplatu
```

---

## 🧠 AI Lead Quality Scoring

Svaki lead dobiva **quality score od 0-100** na osnovu:

| Faktor | Bodovi |
|--------|--------|
| Client verification (phone, email, ID, company) | +30 |
| Definiran budget | +15 |
| Kvaliteta opisa (50-100+ riječi) | +10 |
| Slike priložene (1-3+) | +10 |
| Urgency (HIGH/URGENT) | +10 |
| Deadline definiran | +5 |
| Lokacija navedena | +5 |
| Veličina posla (LARGE/EXTRA_LARGE) | +10 |
| Account age (30+ dana) | +5 |

**Kategorije:**
- 80-100: 🟢 EXCELLENT (vrhunski lead) - 20 kredita
- 60-79: 🔵 GOOD (dobar lead) - 15 kredita
- 40-59: 🟡 AVERAGE (prosječan lead) - 10 kredita
- 0-39: 🔴 LOW (slab lead) - 5 kredita

---

## 🚀 Deployment

### 1. Database Migration

```bash
cd uslugar/backend
npm run migrate:deploy
```

### 2. Seed Legal Statuses (automatski pri server startu)

Server automatski inicijalizira legal statuses ako ne postoje.

### 3. Environment Variables

```env
DATABASE_URL="postgresql://user:pass@endpoint:5432/db"
JWT_SECRET="your-secret"
STRIPE_SECRET_KEY="sk_test_..." # Za plaćanja
TWILIO_ACCOUNT_SID="..." # Za SMS verifikaciju
NODE_ENV="production"
```

### 4. Deploy Backend

```bash
# Build Docker image
docker build -t uslugar-exclusive-api .

# Push to ECR
aws ecr get-login-password --region eu-north-1 | docker login --username AWS --password-stdin 666203386231.dkr.ecr.eu-north-1.amazonaws.com
docker tag uslugar-exclusive-api:latest 666203386231.dkr.ecr.eu-north-1.amazonaws.com/uslugar-api:exclusive
docker push 666203386231.dkr.ecr.eu-north-1.amazonaws.com/uslugar-api:exclusive

# Update ECS service
aws ecs update-service --cluster uslugar-cluster --service uslugar-service --force-new-deployment --region eu-north-1
```

---

## 🧪 Testiranje

### Test Flow:

1. **Registracija providera** → Dobije TRIAL (2 free leada)
2. **Pregled dostupnih leadova** → AI scoring vidljiv
3. **Kupovina leada** → Potroši 1 kredit
4. **Kontaktiranje klijenta** → Označi kao "contacted"
5. **Konverzija ili refund** → Ažuriranje ROI statistike
6. **Nadogradnja pretplate** → Dobije više kredita

### Test API Calls:

```bash
# Login
TOKEN=$(curl -X POST http://localhost:4000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"provider@test.com","password":"pass123"}' \
  | jq -r '.token')

# Dohvati dostupne leadove
curl http://localhost:4000/api/exclusive/leads/available \
  -H "Authorization: Bearer $TOKEN"

# Kupi lead
curl -X POST http://localhost:4000/api/exclusive/leads/JOB_ID/purchase \
  -H "Authorization: Bearer $TOKEN"

# ROI Dashboard
curl http://localhost:4000/api/exclusive/roi/dashboard \
  -H "Authorization: Bearer $TOKEN"
```

---

## 📊 Monitoring & Analytics

### Ključne metrike za praćenje:

- **Conversion Rate**: Postotak kupljenih leadova koji se konvertiraju
- **ROI**: Return on Investment za providere
- **Refund Rate**: Postotak refundiranih leadova
- **Avg Lead Value**: Prosječna zarada po leadu
- **Client Trust Score**: Prosječni trust score klijenata
- **AI Accuracy**: Koliko često visoki quality score = konverzija

---

## 🔒 Security

- ✅ JWT authentication
- ✅ Role-based access (USER, PROVIDER, ADMIN)
- ✅ Email verification obavezna
- ✅ Phone verification za veći trust score
- ✅ ID verification opcijalno
- ✅ Rate limiting na API calls
- ✅ SQL injection protection (Prisma)
- ✅ XSS protection

---

## 📈 Roadmap

### Q4 2025 (Pilot)
- ✅ Core EXCLUSIVE features
- ✅ Credit system
- ✅ AI scoring
- ✅ ROI dashboard
- 🔄 Stripe payment integration
- 🔄 SMS verification (Twilio)

### Q1 2026
- WhatsApp integration za leadove
- Mobile app (React Native)
- Advanced AI - predictive scoring
- White-label opcija za agencije

### Q2 2026
- Regija expansion (SLO, BiH, SRB)
- Multi-language support
- Provider marketplace

---

## 🤝 Support

**Email**: support@uslugar.hr  
**Documentation**: https://docs.uslugar.hr  
**Status**: https://status.uslugar.hr

---

## 📝 License

Copyright © 2025 Uslugar EXCLUSIVE  
All rights reserved.

---

**🎯 Cilj do kraja 2026:**  
Postati vodeći lead-provider ekskluzivnih kontakata u Hrvatskoj!

