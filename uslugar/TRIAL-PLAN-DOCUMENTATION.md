# 🎁 TRIAL Plan - Kompletan Vodič

## 📋 **O TRIAL-U**

TRIAL je besplatni probni period za nove providere koji žele isprobati Uslugar EXCLUSIVE.

---

## ✅ **Što dobivate (TRIAL plan)**

| Feature | TRIAL | Basic | Premium | Pro |
|---------|-------|-------|---------|-----|
| **Krediti** | 2 besplatna | 10 | 25 | 50 |
| **Trajanje** | 7 dana | 1 mjesec | 1 mjesec | 1 mjesec |
| **Cijena** | 0€ (besplatno) | 39€ | 89€ | 149€ |
| **Leadovi** | Ekskluzivni (1:1) | ✅ | ✅ | ✅ |
| **ROI statistika** | ✅ | ✅ | ✅ | ✅ |
| **Refund** | ✅ | ✅ | ✅ | ✅ |
| **CSV export** | ❌ | ❌ | ✅ | ✅ |
| **SMS notifikacije** | ❌ | ❌ | ✅ | ✅ |
| **AI prioritet** | ❌ | ❌ | ✅ | ✅ |

---

## ⏱️ **Koliko dugo TRIAL vrijedi?**

**7 dana** (168 sati)

Počinje trenutkom kada se provider **prvi put logira** na platformu.

---

## 💰 **Kako se dobivaju krediti?**

### **AUTOMATSKI pri registraciji:**

```javascript
// Prilikom prvog login-a, TRIAL se automatski kreira:
subscription = await prisma.subscription.create({
  data: {
    userId: req.user.id,
    plan: 'TRIAL',
    status: 'ACTIVE',
    credits: 0,
    creditsBalance: 2, // 👈 2 BESPLATNA LEADA
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 dana
  }
});
```

### **Kad se koriste krediti:**

1. **Prilikom kupnje leada** (2 kredita po leadu u TRIAL-u)
2. **Prilikom slanja ponude** (1 kredit u legacy sistemu)

---

## 🎯 **Što možeš raditi s TRIAL-om?**

### ✅ **Moguće:**
- Kupiti **2 leada** (1 kredit = 1 lead)
- Izabrati leadove koji ti odgovaraju
- Kontaktirati klijente
- Prati **ROI statistiku**
- Zatražiti **refund** ako klijent ne odgovori

### ❌ **Nije moguće:**
- CSV export leadova
- SMS notifikacije
- AI prioritet u pretraživanju
- Privatna podrška

---

## 🔄 **Što se događa nakon isteka?**

**Nakon 7 dana:**

```javascript
if (subscription.expiresAt && new Date() > subscription.expiresAt && subscription.status === 'ACTIVE') {
  subscription = await prisma.subscription.update({
    where: { userId: req.user.id },
    data: {
      status: 'EXPIRED',
      creditsBalance: 0, // 👈 Nema kredita dok ne plate!
      plan: 'TRIAL' // Ostaje TRIAL dok ne plate
    }
  });
}
```

**Rezultat:**
- Status: **EXPIRED**
- Krediti: **0** (NEMA DOSTUPA dok ne plate!)
- **MORAŠ PLATITI** da bi dobio kredite
- **NEMA automatskog BASIC** plana - besplatno!

---

## 📊 **Kako funkcionira TRIAL u bazi?**

### **Database Schema:**

```prisma
model Subscription {
  id                  String             @id @default(cuid())
  userId              String             @unique
  plan                String             @default("BASIC")
  status              SubscriptionStatus @default(ACTIVE)
  credits             Int                @default(0) // Legacy
  creditsBalance      Int                @default(0) // Trenutni balans
  lifetimeCreditsUsed Int                @default(0) // Statistika
  lifetimeLeadsConverted Int             @default(0) // Statistika
  expiresAt           DateTime?          // 👈 Kada istječe
  cancelledAt         DateTime?
  createdAt           DateTime           @default(now())
  updatedAt           DateTime           @updatedAt
}
```

### **TRIAL Example:**

```json
{
  "id": "abc123",
  "userId": "user456",
  "plan": "TRIAL",
  "status": "ACTIVE",
  "credits": 0,
  "creditsBalance": 2,
  "expiresAt": "2024-11-01T12:00:00.000Z", // 7 dana od kreacije
  "createdAt": "2024-10-25T12:00:00.000Z"
}
```

---

## 🚀 **Kako se nadograditi nakon TRIAL-a?**

### **Opcija 1: Automatski BASIC**
- Nakon isteka, automatski dobivaš **BASIC** plan
- **10 kredita** mjesečno

### **Opcija 2: Plaćena pretplata**
- Možeš nadograditi na **PREMIUM** (89€) ili **PRO** (149€)
- Dobivaš više kredita + dodatne features

---

## 💡 **Marketing tekstovi**

### **Dobrodošnica:**

```
Dobrodošli u Uslugar EXCLUSIVE!
Dobili ste 2 besplatna leada da probate našu platformu.
Nadogradite pretplatu za više.
```

### **Promocija:**

```
🎁 Besplatni TRIAL - 7 dana!
✅ 2 besplatna leada
✅ Ekskluzivni leadovi (bez konkurencije)
✅ ROI statistika
✅ Refund garancija

Probajte odmah!
```

---

## 📈 **Bodovi/krediti u TRIAL-U**

### **Kako se dobivaju:**
- **Automatski pri registraciji:** 2 kredita
- **Nitišto više** - TRIAL je besplatan i ne može se extendovati

### **Kako se troše:**
- **1 kredit = 1 lead** (kupnja ekskluzivnog leada)
- Kad potrošiš **2 kredita**, moraš nadograditi

### **Nadogradnja:**
- Basic: 39€/mj → 10 kredita
- Premium: 89€/mj → 25 kredita
- Pro: 149€/mj → 50 kredita

---

## 🎯 **Provjera statusa:**

### **API Endpoint:**

```bash
GET /api/subscriptions/me
```

**Response:**

```json
{
  "subscription": {
    "id": "abc123",
    "plan": "TRIAL",
    "status": "ACTIVE",
    "creditsBalance": 2,
    "expiresAt": "2024-11-01T12:00:00.000Z"
  },
  "planDetails": null // TRIAL nije u bazi jer je automatski
}
```

---

## ⚠️ **IMPORTANT NOTES**

1. **TRIAL se kreira automatski** - nema opcije "potvrditi pretplatu"
2. **1 kredit = 1 lead** - jednostavno
3. **7 dana je fiksno** - ne može se produžiti
4. **Nakon isteka → BASIC** - besplatno, ali bez kredita ako ne uplatiš
5. **TRIAL nije u database** (`SubscriptionPlan`) - generira se runtime

---

## 🛠️ **Implementation Details**

**File:** `uslugar/backend/src/routes/subscriptions.js`

```javascript
// Line 39-61: Auto-create TRIAL
if (!subscription) {
  subscription = await prisma.subscription.create({
    data: {
      userId: req.user.id,
      plan: 'TRIAL',
      status: 'ACTIVE',
      credits: 0,
      creditsBalance: 2, // ← 2 FREE LEADS
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // ← 7 DAYS
    }
  });
  
  // Send notification
  await prisma.notification.create({
    data: {
      title: 'Dobrodošli u Uslugar EXCLUSIVE!',
      message: 'Dobili ste 2 besplatna leada da probate našu platformu. Nadogradite pretplatu za više.',
      type: 'SYSTEM',
      userId: req.user.id
    }
  });
}
```

---

## ✅ **SUMMARY**

### **TRIAL =**
- ✅ **2 kredita** besplatno
- ✅ **7 dana** vrijeme
- ✅ **Automatski** aktiviran pri registraciji
- ✅ **Ekskluzivni leadovi** (1:1)
- ✅ **ROI statistika** dostupna
- ✅ **Refund** moguć

### **Nakon TRIAL-a:**
- → **AUTOMATSKI BASIC** plan (besplatno, no krediti moraju biti kupljeni)

### **Nadogradnja:**
- **Basic**: 39€ → 10 kredita
- **Premium**: 89€ → 25 kredita
- **Pro**: 149€ → 50 kredita

---

**🎉 TRIAL je dizajniran da providere privuče i pruži im priliku da probaju bez rizika!**

