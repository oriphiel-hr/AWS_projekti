# 🚀 Freemium + Verified Geo-Dynamic Marketplace Model

## 📋 Pregled

Implementacijski plan za prelazak na **"Freemium + Verified Geo-Dynamic Marketplace"** model prema najnovijim tržišnim trendovima i korisničkim zahtjevima.

---

## ✅ Što je već implementirano

### 1. **Geo-Dynamic Team Locations**
- ✅ Više lokacija po provideru
- ✅ Radijus pokrivanja (km)
- ✅ Aktivacija/deaktivacija lokacija
- ✅ Geo-inteligentno filtriranje leadova
- ✅ Regionalne statistike

### 2. **Freemium Model (TRIAL)**
- ✅ Besplatni probni period (7 dana)
- ✅ 2 besplatna leada za nove providere
- ✅ Automatski aktiviran pri registraciji
- ✅ Ekskluzivni leadovi (1:1)

### 3. **Verification System**
- ✅ KYC-lite za providere (freelancere)
- ✅ Email verifikacija (klijenti i provideri)
- ✅ OIB validacija
- ✅ Admin approval workflow

### 4. **Lead System**
- ✅ Ekskluzivni leadovi (1:1 matching)
- ✅ AI quality score
- ✅ Refund sustav
- ✅ ROI tracking

### 5. **Subscription System**
- ✅ TRIAL (0€ - 2 leada)
- ✅ BASIC (39€ - 10 leadova)
- ✅ PREMIUM (89€ - 25 leadova)
- ✅ PRO (149€ - 50 leadova)

---

## 🔄 Što treba implementirati/poboljšati

### **Faza 1: Proširenje Freemium Modela**

#### 1.1 Povećanje besplatnih leadova u TRIAL-u
**Trenutno:** 2 leada  
**Prema modelu:** 3-5 leadova

**Izmjene potrebne:**
```javascript
// uslugar/backend/src/routes/subscriptions.js
// Line 49: Promijeni creditsBalance
creditsBalance: 5, // Umjesto 2 - 5 besplatnih leadova
```

**Korak:**
- [ ] Ažurirati `subscriptions.js` (line 49)
- [ ] Ažurirati dokumentaciju
- [ ] Ažurirati frontend (SubscriptionPlans.jsx, CreditsWidget.jsx)

#### 1.2 Proširenje trajanja TRIAL-a (opcionalno)
**Trenutno:** 7 dana  
**Prema modelu:** 7-14 dana (razmotriti)

**Status:** ✅ 7 dana je dovoljno

---

### **Faza 2: Klijentska Verifikacija**

#### 2.1 Email + SMS Verifikacija za klijente
**Trenutno:** Samo email verifikacija  
**Prema modelu:** Email + SMS verifikacija

**Implementacija:**

**Backend - Dodati SMS verifikaciju:**
```javascript
// uslugar/backend/src/routes/auth.js
// Dodati SMS verification endpoint

// 1. Pošalji SMS kod
POST /auth/verify-phone/send
{
  "phoneNumber": "+385912345678"
}

// 2. Potvrdi SMS kod
POST /auth/verify-phone/confirm
{
  "phoneNumber": "+385912345678",
  "code": "123456"
}
```

**Prisma Schema - Dodati polja:**
```prisma
model User {
  // ... existing fields
  phoneNumber      String?
  phoneVerified   Boolean  @default(false)
  phoneVerifiedAt DateTime?
}
```

**Koraci:**
- [ ] Dodati `phoneNumber`, `phoneVerified`, `phoneVerifiedAt` u User model
- [ ] Kreirati migration
- [ ] Integrirati SMS provider (Twilio/Hrvatski Telekom API)
- [ ] Dodati SMS endpoints u auth.js
- [ ] Ažurirati frontend - dodati SMS verifikaciju u registraciji
- [ ] Dodati SMS verifikaciju u Job form (provjeriti prije objave)

---

### **Faza 3: Pay-Per-Contact Model**

#### 3.1 Implementirati "Pay per contact" umjesto "Pay per lead"
**Trenutno:** Provider plaća prije nego vidi kontakt klijenta  
**Prema modelu:** Provider plaća samo kada želi kontaktirati klijenta

**Trenutni flow:**
1. Provider vidi lead u marketplace-u
2. Provider kupuje lead (plaća kredite) → vidi kontakt
3. Provider kontaktira klijenta

**Novi flow:**
1. Provider vidi lead u marketplace-u (bez kontakta)
2. Provider može vidjeti: naslov, opis, lokacija, AI score
3. Provider odluči da želi kontaktirati → plaća kredit → vidi kontakt
4. Provider kontaktira klijenta

**Implementacija:**

**Backend - Ažurirati Lead Purchase:**
```javascript
// uslugar/backend/src/routes/exclusive-leads.js

// Novo: Prikaži lead bez kontakta
GET /exclusive/leads/available
// Response: Vraća leadove BEZ phoneNumber i email

// Novo: Otvori kontakt (plaćanje)
POST /exclusive/leads/:jobId/unlock-contact
// Deduct credits, vrati puni lead s kontaktom
```

**Prisma Schema:**
```prisma
model LeadPurchase {
  // ... existing fields
  contactUnlocked Boolean @default(false) // Novo polje
  contactUnlockedAt DateTime?
}
```

**Koraci:**
- [ ] Ažurirati `getAvailableLeads` da skrije kontakt informacije
- [ ] Kreirati `/unlock-contact` endpoint
- [ ] Ažurirati frontend - prikaz leadova bez kontakta
- [ ] Dodati gumb "Otključaj kontakt" (cena: 1 kredit)
- [ ] Ažurirati LeadPurchase model

---

### **Faza 4: Reputacijski Sustav Poboljšanja**

#### 4.1 Prioritizacija leadova po reputaciji
**Trenutno:** Geo-match + kategorija  
**Prema modelu:** Geo-match + kategorija + reputacija (brzina odgovora, ocjena, konverzija)

**Implementacija:**

**Dodati polja u ProviderProfile:**
```prisma
model ProviderProfile {
  // ... existing fields
  averageResponseTime Int? // Prosječno vrijeme odgovora u minutama
  responseRate        Float? // % odgovora na leadove
  conversionRate      Float? // % konverzije leadova u poslove
}
```

**Ažurirati Lead Matching:**
```javascript
// uslugar/backend/src/services/lead-service.js

// Sortiraj providere po:
// 1. Geo udaljenosti (najbliži)
// 2. Reputaciji (ratingAvg)
// 3. Brzini odgovora (averageResponseTime)
// 4. Konverziji (conversionRate)
```

**Koraci:**
- [ ] Dodati nova polja u ProviderProfile model
- [ ] Kreirati migration
- [ ] Implementirati tracking response time
- [ ] Ažurirati lead matching algoritam
- [ ] Prikazati reputacijske metrike u provider profilu

---

### **Faza 5: Escrow Funkcionalnost (Kasnija faza - 12+ mjeseci)**

#### 5.1 Escrow za zaštitu obje strane
**Status:** 🔄 Planirano za kasniju fazu (nakon postizanja stabilnog prihoda)

**Preduvjeti:**
- ✅ PSD2 compliance (već implementirano za refundove)
- ✅ Integracija s payment gateway (Stripe)
- ✅ Pravna dokumentacija
- ✅ Trust mark (kredibilitet platforme)

**Implementacija (skica za budućnost):**
```prisma
model EscrowTransaction {
  id              String   @id @default(cuid())
  jobId           String
  clientId        String
  providerId      String
  amount          Float
  status          EscrowStatus // PENDING, RELEASED, REFUNDED, DISPUTED
  releasedAt      DateTime?
  refundedAt      DateTime?
  createdAt       DateTime @default(now())
}
```

**Koraci:**
- [ ] Pravna dokumentacija za Escrow
- [ ] Integracija s Stripe Connect
- [ ] Kreirati EscrowTransaction model
- [ ] Implementirati workflow (deposit → work → release/refund)
- [ ] Dispute resolution sistem

---

## 📊 Usporedba Modela

| Element | Trenutno | Prema Modelu | Status |
|---------|----------|--------------|--------|
| **Besplatni leadovi** | 2 | 3-5 | 🔄 Treba ažurirati |
| **Klijentska verifikacija** | Email | Email + SMS | ❌ Treba implementirati |
| **Pay-per model** | Pay-per-lead | Pay-per-contact | 🔄 Treba refaktorirati |
| **Geo-dynamic** | ✅ Implementirano | ✅ | ✅ Gotovo |
| **Reputacijski sustav** | Osnovni | Napredni (brzina, konverzija) | 🔄 Treba proširiti |
| **Escrow** | ❌ | Planirano | 📅 Kasnija faza |

---

## 🎯 Prioritet Implementacije

### **Visoki prioritet (1-2 tjedna)**
1. ✅ **Geo-dynamic locations** - Gotovo!
2. 🔄 **Povećanje besplatnih leadova** (2 → 5) - Lako
3. ❌ **SMS verifikacija za klijente** - Srednje

### **Srednji prioritet (1 mjesec)**
4. 🔄 **Pay-per-contact refactoring** - Kompleksno
5. 🔄 **Reputacijski sustav proširenje** - Srednje

### **Niski prioritet (6+ mjeseci)**
6. 📅 **Escrow funkcionalnost** - Kasnije

---

## 💰 Monetizacija Faze

### **Faza Start (0-6 mjeseci) - Trenutno**
- ✅ Besplatan period (TRIAL - 7 dana, 2 leada)
- ✅ Baza korisnika + recenzije
- ✅ Geo-dynamic matching

### **Faza Rast (6-12 mjeseci)**
- 🔄 **Pay per contact** (umjesto pay per lead)
- 🔄 Prošireni reputacijski sustav
- 🔄 SMS verifikacija za klijente

### **Faza Stabilizacija (12-18 mjeseci)**
- ✅ Pretplate (već implementirane)
- 🔄 Premium isticanje (napredni search)
- 🔄 AI prioritet (već planirano)

### **Faza Zrelost (18+ mjeseci)**
- 📅 Escrow naknade (2-5%)
- 📅 B2B projekti
- 📅 Enterprise plans

---

## 🔧 Tehnički Detalji

### **SMS Integration (Twilio ili Hrvatski Telekom)**

**Twilio (Preporučeno):**
```javascript
// uslugar/backend/src/lib/sms.js
import twilio from 'twilio';

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

export async function sendVerificationCode(phoneNumber, code) {
  await client.messages.create({
    body: `Vaš Uslugar verifikacijski kod: ${code}`,
    from: process.env.TWILIO_PHONE_NUMBER,
    to: phoneNumber
  });
}
```

**Environment Variables:**
```env
TWILIO_ACCOUNT_SID=xxx
TWILIO_AUTH_TOKEN=xxx
TWILIO_PHONE_NUMBER=+385...
```

---

## 📝 Copy za Marketing (Prema Modelu)

### **Za Izvođače:**
> 🧰 **Tražiš posao?**  
> Registriraj se besplatno i primi prvih **5 stvarnih upita** klijenata.  
> Nema kartice, nema ugovora – samo provjereni kontakti.

### **Za Klijente:**
> 🏠 **Tražiš majstora?**  
> Objavi upit besplatno. Dobiješ **2-3 ponude** unutar 24 sata – bez poziva i bez stresa.

---

## ✅ Checklist Implementacije

### Faza 1: Proširenje Freemium-a
- [x] Ažurirati TRIAL credits (2 → 5) ✅
- [x] Ažurirati frontend poruke ✅
- [x] Ažurirati dokumentaciju ✅

### Faza 2: SMS Verifikacija
- [ ] Dodati phone polja u User model
- [ ] Kreirati migration
- [ ] Integrirati SMS provider
- [ ] Dodati SMS endpoints
- [ ] Frontend SMS verifikacija

### Faza 3: Pay-Per-Contact
- [ ] Refaktorirati getAvailableLeads (skrij kontakt)
- [ ] Kreirati /unlock-contact endpoint
- [ ] Ažurirati LeadPurchase model
- [ ] Frontend "Otključaj kontakt" UI

### Faza 4: Reputacijski Sustav
- [ ] Dodati metrike u ProviderProfile
- [ ] Tracking response time
- [ ] Ažurirati lead matching algoritam
- [ ] Prikaz metrika u profilu

---

## 🎉 Zaključak

Platforma je već **80% implementirana** prema predloženom modelu! 

**Ključne prednosti:**
- ✅ Geo-dynamic matching (najmoćniji alat)
- ✅ Freemium model (privlači korisnike)
- ✅ Ekskluzivni leadovi (1:1)
- ✅ Refund sustav (povjerenje)

**Što još treba:**
- 🔄 SMS verifikacija (pouzdanost)
- 🔄 Pay-per-contact (fleksibilnost)
- 🔄 Napredni reputacijski sustav (kvaliteta)

**Vremenska procjena:**
- **Faza 1-2:** 2-3 tjedna
- **Faza 3-4:** 3-4 tjedna
- **Ukupno:** 5-7 tjedana za kompletan model

---

**Spreman za implementaciju!** 🚀

