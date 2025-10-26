# 🔒 SUBSCRIPTION SECURITY - Baza vs Backend

**Pitanje**: Ako u bazi stavim "Prioritetna podrška" za BASIC plan, može li BASIC pristupiti?

**Kratki odgovor**: NE! Backend enforcement je nezavisan od baze podataka.

---

## 📊 KAKO TO FUNKCIONIRA?

### **1. Baza podataka (SubscriptionPlan) - SAMO ZA PRIKAZ**

📁 `backend/prisma/seed.js`

```javascript
const plans = [
  {
    name: 'BASIC',
    features: [
      'Prioritetna podrška',  // ← DODAJEMO OVO
      'Mini CRM',
      'ROI statistika',
      // ...
    ]
  }
];
```

⚠️ **Ovo je SAMO tekst za prikaz na frontendu!**

---

### **2. Backend enforcement (HARDCODED) - STVARNA SIGURNOST**

📁 `backend/src/lib/subscription-auth.js`

```javascript
// HARDCODED hierarchy
const planHierarchy = { 
  'BASIC': 1,      // ← Tier 1
  'PREMIUM': 2,    // ← Tier 2
  'PRO': 3         // ← Tier 3
};

export function requirePlan(requiredPlan) {
  return async (req, res, next) => {
    const subscription = await prisma.subscription.findUnique({
      where: { userId: req.user.id }
    });
    
    // Provjeri TIER, ne features iz baze!
    const userTier = planHierarchy[subscription.plan] || 0;
    const requiredTier = planHierarchy[requiredPlan] || 999;
    
    if (userTier < requiredTier) {
      return res.status(403).json({
        error: 'Upgrade required',
        currentPlan: subscription.plan,  // ← "BASIC"
        requiredPlan: requiredPlan        // ← "PREMIUM"
      });
    }
  };
}
```

🔒 **Ovo je PRAVA provjera - hardcoded u kodu!**

---

## 🧪 SCENARIJI

### **SCENARIJ 1: Dodaš "Prioritetna podrška" u BASIC features**

```javascript
// seed.js
{
  name: 'BASIC',
  features: [
    'Prioritetna podrška',  // ← Dodano
    'Mini CRM',
    // ...
  ]
}
```

**Rezultat:**

| Location | Rezultat |
|----------|----------|
| **Frontend** | ✅ Prikazati će "Prioritetna podrška" u BASIC planu |
| **Backend** | ❌ JOŠ UVJEK BLOKIRA BASIC korisnike! |

**Zašto?**
```javascript
// Backend koristi hardcoded tier
const userTier = planHierarchy['BASIC'];        // = 1
const requiredTier = planHierarchy['PREMIUM'];   // = 2

if (1 < 2) {  // TRUE → BLOKIRANO!
  return res.status(403).json({ error: 'Upgrade required' });
}
```

---

### **SCENARIJ 2: Basic korisnik pokuša pristupiti**

```bash
# Request
GET /api/exclusive/leads/export/my-leads
Authorization: Bearer BASIC_USER_TOKEN

# Response
{
  "error": "Upgrade required",
  "message": "This feature requires PREMIUM plan. Your current plan: BASIC",
  "currentPlan": "BASIC",
  "requiredPlan": "PREMIUM",
  "upgradeUrl": "/subscription"
}
```

❌ **Blokirano bez obzira što piše u bazi!**

---

### **SCENARIJ 3: Gdje se koristi backend enforcement?**

```javascript
// backend/src/routes/exclusive-leads.js
import { requirePlan } from '../lib/subscription-auth.js';

// CSV Export - zahtijeva PREMIUM
r.get('/export/my-leads', 
  auth(true, ['PROVIDER']), 
  requirePlan('PREMIUM'),  // ← BLOKIRA BASIC!
  async (req, res) => {
    // Export functionality
  }
);

// AI Priority - zahtijeva PREMIUM
r.get('/leads/ai-priority', 
  auth(true, ['PROVIDER']), 
  requirePlan('PREMIUM'),  // ← BLOKIRA BASIC!
  async (req, res) => {
    // AI prioritized leads
  }
);

// Premium Quality Leads - zahtijeva PRO
r.get('/leads/premium', 
  auth(true, ['PROVIDER']), 
  requirePlan('PRO'),  // ← BLOKIRA BASIC I PREMIUM!
  async (req, res) => {
    // Only 80+ quality score leads
  }
);
```

---

## 🔐 SIGURNOST

### **PROBLEM: Ako features zavise od baze?**

```javascript
// ❌ SLABO - NE KORISTI OVO!
r.get('/export/my-leads', async (req, res) => {
  const subscription = await prisma.subscription.findUnique({
    where: { userId: req.user.id },
    include: { planDetails: true }
  });
  
  const features = subscription.planDetails.features;
  
  if (!features.includes('CSV Export')) {
    return res.status(403).json({ error: 'Not available' });
  }
  
  // Export...
});
```

**Zašto je SLABO?**
- Mogu izmijeniti bazu i dodati feature
- Features lista nije sigurna
- Teško maintain

---

### **RJEŠENJE: Hardcoded enforcement!**

```javascript
// ✅ SIGURNO - KORISTI OVO!
r.get('/export/my-leads', 
  requirePlan('PREMIUM'),  // ← Hardcoded u kodu
  async (req, res) => {
    // Export...
  }
);
```

**Zašto je SIGURNO?**
- Ne može se "izmjeniti" iz baze
- Enforcement je u Git repozitoriju
- Code review kontrolira sigurnost
- Predvidljivo ponašanje

---

## 📋 COMPARISON

### **FEATURES IZ BAZE (seed.js)**
```javascript
// Backend: subscriptions.js
async function getPlansFromDB() {
  const dbPlans = await prisma.subscriptionPlan.findMany({
    where: { isActive: true }
  });
  
  return dbPlans;  // ← Samo za FRONTEND prikaz!
}
```

**Koristi se za:**
- ✅ Prikaz cjenika na frontendu
- ✅ Marketing tekstovi
- ✅ User education (što dobivaju)

**NE koristi se za:**
- ❌ Sigurnost
- ❌ Access control
- ❌ Feature enforcement

---

### **FEATURES U KODU (subscription-auth.js)**
```javascript
// Backend: subscription-auth.js
const planHierarchy = { 'BASIC': 1, 'PREMIUM': 2, 'PRO': 3 };

export function requirePlan(requiredPlan) {
  // ← Hardcoded u kodu!
  // ← NE može se izmijeniti iz baze!
  // ← SIGURNO!
}
```

**Koristi se za:**
- ✅ Access control
- ✅ Sigurnost
- ✅ Feature enforcement
- ✅ Backend routes protection

---

## 🎯 ODGOVOR NA PITANJE

**"Ako u bazi stavim Prioritetna podrška za BASIC?"**

**Odgovor**: 
- ✅ Frontend će ga prikazati
- ❌ Backend JOŠ UVIJEK blokira BASIC korisnike
- 🔒 Sigurnost je u backend kodu, ne u bazi!

---

## ✅ BEST PRACTICE

### **Split: Display vs Security**

1. **Baza** → Prikaz features (marketing)
2. **Backend** → Sigurnost i enforcement

**Zaključak**: Features u bazi su SAMO za marketing/display. Sigurnost je u kodu!

---

## 🚀 KAKO PROMIJENITI ACCESS?

**Ako ŽELIŠ da BASIC dobije "Prioritetna podrška":**

1. **Izmijeni backend kod:**
```javascript
// backend/src/lib/subscription-auth.js
const planHierarchy = { 
  'BASIC': 2,       // ← POVEĆAJ tier
  'PREMIUM': 2,     // ← 
  'PRO': 3
};
```

2. **Ili dodaj feature u BASIC:**
```javascript
export function hasFeatureAccess(featureName, userPlan) {
  const featureAccess = {
    'PRIORITY_SUPPORT': ['BASIC', 'PREMIUM', 'PRO'],  // ← Dodaj BASIC
    // ...
  };
}
```

3. **Commit i deploy:**
```bash
git commit -m "feat: Add priority support to BASIC plan"
git push
# Deploy na AWS
```

---

**Vidite? Sigurnost je u kodu, ne u bazi!** 🔒

