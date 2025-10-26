# 💳 Stripe Payment Setup - Final Instructions

## ✅ Što je Implementirano:

1. ✅ Stripe SDK instaliran (`npm install stripe`)
2. ✅ Payment routes kreirani (`/api/payments/*`)
3. ✅ Checkout session creation
4. ✅ Webhook handler za potvrdu plaćanja
5. ✅ Auto-activate subscription after payment

---

## 📝 Setup Instructions:

### **1. API Keys** (Dodaj u AWS Secrets Manager):
```
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_... (dobij od webhook setup)
CLIENT_URL=https://uslugar.oriph.io
```

### **2. Webhook Setup**:
1. Stripe Dashboard > Webhooks
2. Add endpoint: `https://uslugar.api.oriph.io/api/payments/webhook`
3. Events: `checkout.session.completed`, `invoice.payment_succeeded`, `invoice.payment_failed`

### **3. Frontend Implementation** (TODO):
```javascript
// Install Stripe.js
npm install @stripe/stripe-js @stripe/react-stripe-js

// Usage
import { loadStripe } from '@stripe/stripe-js';

const stripe = await loadStripe('pk_test_...');

// Redirect to checkout
const { data } = await fetch('/api/payments/create-checkout', {
  method: 'POST',
  body: JSON.stringify({ plan: 'PRO' })
});
window.location.href = data.url;
```

---

## 🧪 Test Cards:
```
✅ Success: 4242 4242 4242 4242
❌ Decline: 4000 0000 0000 0002
🔐 3D Secure: 4000 0025 0000 3155
```

---

## 🎯 Next Steps:

- [ ] Dodaj keys u AWS Secrets Manager
- [ ] Setup webhook u Stripe
- [ ] Implement frontend checkout button
- [ ] Test sa test cards
- [ ] Go live sa Live keys

**Status**: ✅ Backend ready, needs AWS setup + frontend button

