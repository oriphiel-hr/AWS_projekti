# 📋 FEATURES LIST U BAZI - Čemu Služi?

**Kratki odgovor**: Samo za prikaz na frontendu - marketing, edukacija, user onboarding!

---

## 🎯 **Gdje se Koristi?**

### **1. Subscription Plans Stranica** 📄

📁 `frontend/src/pages/SubscriptionPlans.jsx`

```javascript
// Dohvati planove iz baze
const [plans, setPlans] = useState({});

const loadData = async () => {
  const [plansRes, subRes] = await Promise.all([
    getSubscriptionPlans(),  // ← Dohvati iz BAZE
    getMySubscription()
  ]);
  setPlans(plansRes.data);  // ← PLAN.features iz baze!
};
```

```jsx
// Prikaži features iz baze
<ul className="space-y-3 mb-8">
  {plan.features.map((feature, idx) => (
    <li key={idx} className="flex items-start">
      <svg className="w-5 h-5 text-green-500 mr-2">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
      </svg>
      <span className="text-sm text-gray-700">{feature}</span>  ← IZ BAZE!
    </li>
  ))}
</ul>
```

**Rezultat:**
```
✅ Mini CRM za leadove
✅ ROI statistika
✅ Email notifikacije
✅ Refund ako klijent ne odgovori
...
```

---

### **2. Comparison Tabela** 📊

```jsx
<table className="w-full">
  <thead>
    <tr>
      <th>Feature</th>
      <th>BASIC</th>
      <th>PREMIUM ⭐</th>
      <th>PRO</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Ekskluzivni leadovi mjesečno</td>
      <td className="text-center">10</td>  ← Iz BAZE
      <td className="text-center font-semibold text-green-600">25</td>  ← Iz BAZE
      <td className="text-center">50</td>  ← Iz BAZE
    </tr>
    <tr>
      <td>CSV izvještaji</td>
      <td className="text-center">❌</td>
      <td className="text-center">✅</td>  ← Iz BAZE
      <td className="text-center">✅</td>
    </tr>
  </tbody>
</table>
```

---

### **3. API Endpoint** 🔌

📁 `backend/src/routes/subscriptions.js`

```javascript
// Get all available plans (from database)
r.get('/plans', async (req, res) => {
  const { plansObj, dbPlans } = await getPlansFromDB();
  res.json(dbPlans);  // ← Vrati planove IZ BAZE
});
```

**Frontend poziva:**
```javascript
GET /api/subscriptions/plans

Response:
[
  {
    name: 'BASIC',
    displayName: 'Basic',
    price: 39,
    credits: 10,
    features: [
      'Mini CRM za leadove',      ← IZ BAZE
      'ROI statistika',           ← IZ BAZE
      'Email notifikacije',       ← IZ BAZE
      // ...
    ]
  },
  {
    name: 'PREMIUM',
    displayName: 'Premium',
    price: 89,
    credits: 25,
    features: [
      'Prioritetna podrška',      ← IZ BAZE
      'AI prioritet',             ← IZ BAZE
      'SMS + Email',              ← IZ BAZE
      // ...
    ]
  }
]
```

---

## 🎨 **KORIŠTENJE**

### **1. Marketing/Pricing Page** 💰

```jsx
// SubscriptionPlans.jsx
<h1 className="text-4xl font-bold text-gray-900 mb-4">
  Odaberite Vaš Plan
</h1>

<div className="grid md:grid-cols-3 gap-8">
  {Object.entries(plans).map(([key, plan]) => (
    <div className="bg-white rounded-2xl shadow-xl">
      <h3>{plan.name}</h3>
      <div className="text-5xl font-bold">{plan.price}€</div>
      
      {/* Features iz BAZE */}
      <ul className="space-y-3">
        {plan.features.map((feature) => (
          <li>✅ {feature}</li>  ← Marketing tekst!
        ))}
      </ul>
      
      <button onClick={() => handleSubscribe(key)}>
        Pretplati se - {plan.price}€/mj
      </button>
    </div>
  ))}
</div>
```

---

### **2. User Education** 📚

Features lista objašnjava korisnicima:
- ✅ Što dobivaju u paketu
- ✅ Što mogu koristiti
- ✅ Zašto je paket vrijedan cijene

---

### **3. Lead Generation** 🎯

Prikaz features-ima može potaknuti upgrade:
```
BASIC:   Mini CRM, ROI stats
PREMIUM: Mini CRM, ROI stats, AI Priority, CSV Export, Prioritetna podrška  ← Više!
PRO:     Sve iz PREMIUM + VIP podrška 24/7, Featured profil  ← Još više!
```

---

## ⚠️ **ŠTO LISTA NIJE!**

### **❌ NE KORISTI SE ZA SIGURNOST**

```javascript
// ❌ OVAKO NIKAD!
const subscription = await getSubscription(userId);
const features = subscription.plan.features;

if (features.includes('CSV Export')) {  // ← SLABO!
  // Allow export
}
```

**Problem:**
- Može se izmijeniti iz baze
- Nije sigurno
- Teško maintain

---

### **❌ NE KORISTI SE ZA ACCESS CONTROL**

```javascript
// ❌ OVAKO NIKAD!
if (plan.features.includes('Prioritetna podrška')) {
  await sendPriorityTicket();  // ← SLABO!
}
```

---

## ✅ **ŠTO LISTA JESTE!**

### **✅ MARKETING**
- Prikaži što dobivaju
- Prodaj features
- Educate korisnike

### **✅ PRICING**
- Cjenik s features-ima
- Comparison tabela
- Value proposition

### **✅ USER EXPERIENCE**
- Onboarding
- Upgrade prompts
- Feature highlights

---

## 📊 **TABELA: KADA ŠTO KORISTI**

| Location | Što Koristi | Zašto |
|----------|-------------|-------|
| **Frontend** (SubscriptionPlans.jsx) | `plan.features` iz BAZE | Prikaz na stranici |
| **Backend** (subscription-auth.js) | Hardcoded tier | Sigurnost i enforcement |
| **API** (/subscriptions/plans) | Planove iz BAZE | Marketing |
| **API** (/exclusive/leads) | Hardcoded tier | Access control |

---

## 🎯 **ZAKLJUČAK**

### **FEATURES IZ BAZE = DISPLAY**
```javascript
// Samo za prikaz!
features: [
  'Mini CRM za leadove',  // ← MARKETING
  'ROI statistika',       // ← MARKETING  
  'Prioritetna podrška'   // ← MARKETING
]
```

### **FEATURES U KODU = SIGURNOST**
```javascript
// Za sigurnost!
const planHierarchy = { 'BASIC': 1, 'PREMIUM': 2, 'PRO': 3 };
requirePlan('PREMIUM');  // ← SIGURNO!
```

---

## 🔐 **BEST PRACTICE**

```
Baza (SubscriptionPlan) → Marketing/Display
Backend (subscription-auth.js) → Sigurnost/Enforcement
```

**Dva odvojena sustava za dva različita cilja!** ✅

