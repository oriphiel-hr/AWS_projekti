# 💳 Payment Implementation Plan - HR Paketi

**Datum**: Listopad 2025  
**Status**: Payment gateway ne implementiran (TODO)

---

## 📋 Trenutno Stanje

### **Paketi i Cijene**:
- **BASIC**: 39€/mjesečno - 10 kredita
- **PREMIUM**: 89€/mjesečno - 25 kredita  
- **PRO**: 149€/mjesečno - 50 kredita
- **TRIAL**: 0€ - 2 kredita (7 dana)

### **Trenutna Implementacija**:
```javascript
// backend/src/routes/subscriptions.js line 122
// TODO: Integrate payment gateway here (Stripe/CorvusPay)
// Za sada simuliramo uspješnu uplatu
```

**Problem**: Plaćanje nije implementirano - subscription se aktivira bez stvarne uplate!

---

## 🎯 Preporučeni Payment Gateway za Hrvatsku

### **Opcije**:

1. **Stripe** (Najbolji izbor) ✅
   - ✅ Podržava Hrvatsku
   - ✅ EUR currency
   - ✅ SEPA Direct Debit (bank account)
   - ✅ Credit/Debit cards (Visa, Mastercard, Diners)
   - ✅ Recurring subscriptions
   - ✅ Webhook support
   - ✅ Dokumentacija na HR vjezbi

2. **PayPal** 
   - ✅ Podržava HR
   - ⚠️ Manje popularno u HR
   - ✅ EUR currency

3. **CorvusPay** (Hrvatski gateway)
   - ✅ Hrvatski gateway
   - ✅ Podržava SEPA i kartice
   - ⚠️ Manje dokumentacije

---

## 🚀 Implementacijski Plan

### **Faza 1: Stripe Setup** (Preporučeno)

#### 1.1 Instalacija
```bash
npm install stripe
```

#### 1.2 Environment Variables
```env
STRIPE_SECRET_KEY=sk_live_...  # Production
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_WEBHOOK_ENDPOINT=/api/payments/stripe/webhook
```

#### 1.3 Subscription Flow

**A. Create Checkout Session** (Frontend → Backend)
```
POST /api/payments/stripe/create-checkout
Body: { plan: 'PRO', planId: 'plan_xxx' }
Response: { sessionId: 'cs_xxx', url: 'https://checkout.stripe.com/...' }
```

**B. User završi plaćanje** (Stripe redirects back)
```
GET /api/subscriptions/success?session_id=cs_xxx
```

**C. Webhook potvrđuje plaćanje** (Stripe → Backend)
```
POST /api/payments/stripe/webhook
Body: event.type === 'checkout.session.completed'
Backend: Activate subscription
```

#### 1.4 Backend Routes (TODO)

```javascript
// backend/src/routes/payments.js
import Stripe from 'stripe';
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Create checkout session
r.post('/stripe/create-checkout', async (req, res) => {
  const { plan, userId } = req.body;
  
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card', 'sepa_debit'], // Kartice + bank account
    mode: 'subscription',
    customer_email: req.user.email,
    line_items: [{
      price: planPriceId,
      quantity: 1,
    }],
    success_url: `${CLIENT_URL}/subscription/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${CLIENT_URL}/subscription/plans`,
    metadata: {
      userId: req.user.id,
      plan: plan
    }
  });
  
  res.json({ sessionId: session.id, url: session.url });
});

// Handle webhook
r.post('/stripe/webhook', async (req, res) => {
  const sig = req.headers['stripe-signature'];
  const event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
  
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    const userId = session.metadata.userId;
    const plan = session.metadata.plan;
    
    // Activate subscription
    await activateSubscription(userId, plan);
  }
  
  res.json({ received: true });
});
```

---

### **Faza 2: Načini Plaćanja**

#### **Opcija A: Kartice** (Visa, Mastercard, Diners)
```
✅ Jednostavno
✅ Instant
✅ Stripe payment element
```

#### **Opcija B: Bank Transfer (SEPA Direct Debit)**
```
✅ Stripe podržava SEPA
✅ User autorizira bank transfer
✅ Auto-debit svaki mjesec
✅ Bolje za recurrence subscriptions
```

#### **Opcija C: Pay by Link (IBAN)**
```
📧 Pošalji IBAN na email
📝 Manual processing (treba admin)
⏰ Delayed (1-3 dana)
⚠️ Ne automatski
```

---

### **Faza 3: Frontend Implementation**

#### **Component**: `SubscribeButton.jsx`

```jsx
import { loadStripe } from '@stripe/stripe-js';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';

const stripePromise = loadStripe('pk_live_...');

function SubscribeButton({ plan }) {
  const stripe = useStripe();
  
  const handleSubscribe = async () => {
    // 1. Kreiraj checkout session
    const { data } = await api.post('/payments/stripe/create-checkout', {
      plan: plan.name
    });
    
    // 2. Redirect na Stripe
    window.location.href = data.url;
  };
  
  return (
    <button onClick={handleSubscribe}>
      Pretplatite se na {plan.displayName} - {plan.price}€
    </button>
  );
}
```

---

## 📦 HR-Specific Payment Methods

### **Preporučene Opcije za Hrvatsku**:

1. **Kartice** (Visa, Mastercard, Diners)
   - ✅ Najučestalije
   - ✅ Instant
   - ✅ Stripe nativno podržava

2. **SEPA Direct Debit**
   - ✅ Stripe podržava
   - ✅ Auto-recurring
   - ✅ Pošalji email potvrdnom kodu
   - ⏰ Prvi transfer 4-7 dana (mandat)

3. **Pay by Link (IBAN)** - Manual
   - 📧 Slanje email s IBAN-om
   - 📝 Admin potvrđuje uplatu
   - ⏰ Delay 1-3 dana
   - ⚠️ Nije automatski

---

## 🎯 Preporučen Plan Implementacije

### **Korak 1: Stripe + Kartice** (Brzo, JEDNOSTAVNO)
```bash
1. Install Stripe SDK
2. Create Stripe account
3. Get API keys
4. Implement checkout session
5. Webhook handler
6. Frontend checkout
```

**Timeline**: 2-3 dana

### **Korak 2: SEPA Direct Debit** (Napredno, automatsko)
```bash
1. Enable SEPA u Stripe dashboard
2. Add SEPA payment method
3. Handle mandate approval
4. Setup recurring charges
```

**Timeline**: +2 dana

### **Korak 3: Pay by Link** (Alternativa)
```bash
1. Email s IBAN
2. Admin panel za potvrdu
3. Manual subscription activation
```

---

## 💡 Quick Start

**Najbrža implementacija - Stripe Checkout**:

1. Kreiraj Stripe account: https://stripe.com/hr
2. Dodaj API keys u `.env`
3. Install: `npm install stripe`
4. Implement checkout session (gore naveden kod)
5. Test sa test cards: https://stripe.com/docs/testing

**Test Cards**:
```
Success: 4242 4242 4242 4242
Decline: 4000 0000 0000 0002
3D Secure: 4000 0025 0000 3155
```

---

## ✅ Action Items

- [ ] Setup Stripe account
- [ ] Install Stripe SDK
- [ ] Add API keys to environment
- [ ] Implement checkout creation
- [ ] Implement webhook handler
- [ ] Update frontend with subscribe button
- [ ] Test sa test cards
- [ ] Go live

---

**Recommended**: Implementiraj Stripe prvo (kartice), dodaj SEPA kasnije ako treba.

