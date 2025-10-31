# Napredni Reputacijski Sustav - Implementacija

## 📋 Pregled

Implementiran je napredni reputacijski sustav koji prati:
- **Response Time** - Prosječno vrijeme odgovora providera na leadove
- **Conversion Rate** - Stopa konverzije leadova u uspešne poslove
- **Rating** - Postojeći sustav ocjena (sačuvan)

## ✅ Implementirano

### 1. Prisma Schema (`uslugar/backend/prisma/schema.prisma`)
Dodana polja u `ProviderProfile`:
- `avgResponseTimeMinutes` - Prosječno vrijeme odgovora u minutama
- `totalResponseTimeTracked` - Broj trackanih odgovora (za izračun prosjeka)
- `conversionRate` - Stopa konverzije (cached iz ProviderROI za brzi pristup)

### 2. Migration (`uslugar/backend/prisma/migrations/20250201000000_add_reputation_fields/migration.sql`)
- Dodana 3 nova polja u `ProviderProfile` tablicu
- Kreirani indeksi za brže upite po reputaciji

### 3. Backend Tracking (`uslugar/backend/src/services/lead-service.js`)

#### Response Time Tracking
- **`markLeadContacted()`** - Računa response time kada provider označi lead kao kontaktiran
  - Response time = razlika između `contactUnlockedAt` (ili `createdAt`) i `contactedAt`
  - Ažurira `avgResponseTimeMinutes` koristeći rolling average
  - Validira podatke (0-7 dana) da spriječi outlier-e

#### Conversion Rate Tracking
- **`updateProviderROI()`** - Ažurira `conversionRate` u `ProviderProfile`
  - Izračunava conversion rate iz `ProviderROI` podataka
  - Cache-ira rezultat u `ProviderProfile` za brži pristup

### 4. Lead Matching Algoritam (`uslugar/backend/src/lib/leadQueueManager.js`)
Ažuriran `findTopProviders()` da koristi **Reputation Score**:

**Formula:**
- **Rating (40% weight)**: `ratingAvg * 0.4 + (ratingCount bonus) * 0.4`
- **Response Time (30% weight)**: Normalizacija (0-60min = 1.0, 60-240min = 0.5, 240+ = 0.1)
- **Conversion Rate (30% weight)**: `conversionRate / 100`

**Final Score** = `(Rating * 0.4) + (ResponseTime * 0.3) + (ConversionRate * 0.3)`

Providers s višim scoreom dobivaju prioritet u lead queue-u.

### 5. Frontend Prikaz (`uslugar/frontend/src/components/ProviderProfile.jsx` i `pages/ProviderProfile.jsx`)

#### Komponenta ProviderProfile
- Dodana sekcija "⚡ Reputacija" s kartama za:
  - **Prosječno vrijeme odgovora** (min/h/d format)
  - **Stopa konverzije** (%)
  - Badge "✓ Brz odgovor" ako je < 60 min
  - Badge "✓ Iznad prosjeka" ako je conversion rate ≥ 50%

#### Stranica ProviderProfile (moj profil)
- Dodano u sekciju "Statistike":
  - Vrijeme odgovora (ako postoji)
  - Stopa konverzije (ako postoji)
  - Fallback na kategorije/iskustvo ako metrike nisu dostupne

## 🔄 Kako radi

1. **Provider kupi lead** → `purchaseLead()` kreira `LeadPurchase`
2. **Provider otključi kontakt** → `unlockContact()` postavlja `contactUnlockedAt`
3. **Provider kontaktira klijenta** → `markLeadContacted()`:
   - Računa response time
   - Ažurira `avgResponseTimeMinutes` u `ProviderProfile`
4. **Lead se konvertira** → `markLeadConverted()` → `updateProviderROI()`:
   - Ažurira `conversionRate` u `ProviderProfile`
5. **Lead matching** → `findTopProviders()` koristi reputation score za sortiranje

## 📊 Metrike

### Response Time
- Mjeri se u minutama
- Rolling average: `(stari_prosjek * broj_uzoraka + novi_response) / (broj_uzoraka + 1)`
- Validacija: 0-10080 minuta (0-7 dana) - sprječava outlier-e

### Conversion Rate
- Izračun: `(totalLeadsConverted / totalLeadsPurchased) * 100`
- Cache-iran u `ProviderProfile` za brzi pristup
- Ažurira se automatski pri svakom update-u ROI-a

## 🚀 Deployment

1. **Migration će se automatski pokrenuti** pri pokretanju containera (Dockerfile ima `prisma migrate deploy`)
2. **Backend** - commit i push, Docker build, ECR push, ECS update
3. **Frontend** - commit i push, GitHub Actions auto-deploy

## 🧪 Testiranje

1. **Response Time:**
   - Provider kupi lead
   - Otključi kontakt
   - Označi kao kontaktiran
   - Provjeri da se `avgResponseTimeMinutes` ažurira

2. **Conversion Rate:**
   - Provider konvertira lead
   - Provjeri da se `conversionRate` ažurira

3. **Lead Matching:**
   - Kreiraj job s kategorijom
   - Provjeri da providers s boljom reputacijom dobivaju prioritet

4. **Frontend:**
   - Otvori provider profil
   - Provjeri da se prikazuju metrike (ako postoje)

## 📝 Napomene

- Reputacija se gradi postupno - novi providers nemaju metrike dok ne izvrše akcije
- Response time tracking zahtijeva da provider označi lead kao kontaktiran
- Conversion rate ovisi o tome da provider označi lead kao konvertiran
- Lead matching algoritam je konfigurabilan (weights mogu se mijenjati)

