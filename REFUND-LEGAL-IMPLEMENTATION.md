# 💰 Refund Implementation - Legal & Technical Guide

## ✅ **PRAVNI ODGOVOR**

**Da, možeš implementirati Stripe refund API uz postojeću izjavu.**

### Objašnjenje:

1. **Izjava kaže**: "Platforma ne provodi povrate sredstava samostalno"
   - ✅ **Točno**: Ti pozivaš Stripe API, ne provodiš refund direktno

2. **Izjava kaže**: "Povrati se provode isključivo putem ovlaštene platne institucije (Stripe Payments Europe Ltd.)"
   - ✅ **Točno**: Stripe refund API automatski komunicira s bankama kroz Stripe infrastrukturu

3. **PSD2 Compliance**:
   - ✅ Stripe je licencirani payment processor u EU
   - ✅ Stripe refund API automatski poštuje PSD2 pravila
   - ✅ Ti samo iniciraš refund, Stripe ga provodi

---

## 🔧 **TEHNIČKA IMPLEMENTACIJA**

### **Korak 1: Dodaj `stripePaymentIntentId` u LeadPurchase model**

```prisma
// backend/prisma/schema.prisma
model LeadPurchase {
  // ... postojeći fields
  stripePaymentIntentId String? // Stripe Payment Intent ID (za refund)
  stripeRefundId        String? // Stripe Refund ID (nakon refund-a)
}
```

### **Korak 2: Ažuriraj `purchaseLead()` da koristi Stripe Payment Intent**

Kada provider kupi lead, umjesto samo dodavanja kredita, kreiraj Stripe Payment Intent:

```javascript
// backend/src/services/lead-service.js
import Stripe from 'stripe';
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function purchaseLead(jobId, providerId) {
  // ... postojeća logika do provjere kredita ...
  
  const leadPrice = job.leadPrice || 10;
  const priceInCents = leadPrice * 10; // 1 kredit = 10 EUR = 1000 cents
  
  // Kreiraj Stripe Payment Intent (umjesto samo dodavanja kredita)
  const paymentIntent = await stripe.paymentIntents.create({
    amount: priceInCents,
    currency: 'eur',
    customer: provider.stripeCustomerId, // Treba dodati u User model
    metadata: {
      jobId,
      providerId,
      leadPrice: leadPrice.toString(),
      type: 'lead_purchase'
    },
    description: `Lead purchase: ${job.title}`
  });
  
  // Kreiraj LeadPurchase sa Payment Intent ID
  const purchase = await prisma.leadPurchase.create({
    data: {
      jobId,
      providerId,
      creditsSpent: leadPrice,
      leadPrice,
      status: 'ACTIVE',
      stripePaymentIntentId: paymentIntent.id, // ✅ Sačuvaj za refund
      contactUnlocked: false
    }
  });
  
  return { purchase, paymentIntent };
}
```

### **Korak 3: Implementiraj Stripe Refund u `refundLead()`**

```javascript
// backend/src/services/lead-service.js
export async function refundLead(purchaseId, providerId, reason = 'Client unresponsive') {
  const purchase = await prisma.leadPurchase.findUnique({
    where: { id: purchaseId },
    include: { job: true }
  });

  if (!purchase) {
    throw new Error('Purchase not found');
  }

  if (purchase.providerId !== providerId) {
    throw new Error('Unauthorized');
  }

  if (purchase.status === 'REFUNDED') {
    throw new Error('Zahtjev za povrat već je obrađen');
  }

  if (purchase.status === 'CONVERTED') {
    throw new Error('Ne može se zatražiti povrat za uspješno konvertirani lead');
  }

  // ✅ STRIPE REFUND API - Ovo je legalno uz izjavu!
  let stripeRefund = null;
  if (purchase.stripePaymentIntentId && stripe) {
    try {
      // Stripe refund API - platforma ne provodi refund, Stripe ga provodi
      stripeRefund = await stripe.refunds.create({
        payment_intent: purchase.stripePaymentIntentId,
        amount: purchase.creditsSpent * 1000, // u centima (1 kredit = 10 EUR = 1000 cents)
        reason: 'requested_by_customer',
        metadata: {
          leadId: purchase.jobId,
          purchaseId: purchase.id,
          reason: reason,
          refundedBy: providerId
        }
      });
      
      console.log(`[STRIPE] Refund created: ${stripeRefund.id} for payment intent ${purchase.stripePaymentIntentId}`);
    } catch (stripeError) {
      console.error('[STRIPE] Refund failed:', stripeError);
      // Ako Stripe refund ne uspije, vrati interne kredite kao fallback
      // (za kompatibilnost s postojećim sistemom)
    }
  }

  // Vrati interne kredite (za UX i slučajeve gdje Stripe refund ne uspije)
  await refundCredits(
    providerId,
    purchase.creditsSpent,
    `Zahtjev za povrat: ${purchase.job.title} - ${reason}`,
    purchase.id
  );

  // Ažuriraj purchase status
  const updated = await prisma.leadPurchase.update({
    where: { id: purchaseId },
    data: {
      status: 'REFUNDED',
      refundedAt: new Date(),
      refundReason: reason,
      stripeRefundId: stripeRefund?.id || null // ✅ Sačuvaj Stripe refund ID
    }
  });

  // Ažuriraj Job - oslobodi lead za druge providere
  await prisma.job.update({
    where: { id: purchase.jobId },
    data: {
      assignedProviderId: null,
      leadStatus: 'AVAILABLE'
    }
  });

  return updated;
}
```

---

## 📋 **Database Migration**

```sql
-- backend/prisma/migrations/XXXXXX_add_stripe_refund_fields/migration.sql
ALTER TABLE "LeadPurchase" ADD COLUMN "stripePaymentIntentId" TEXT;
ALTER TABLE "LeadPurchase" ADD COLUMN "stripeRefundId" TEXT;

CREATE INDEX "LeadPurchase_stripePaymentIntentId_idx" ON "LeadPurchase"("stripePaymentIntentId");
```

---

## ✅ **PRAVNO PRAZNJENJE ODOGOVORNOSTI**

Izjava u kodu je **točna** čak i sa Stripe refund implementacijom:

```javascript
/**
 * PRAVNO: Platforma ne provodi povrate sredstava samostalno.
 * Povrati se provode isključivo putem ovlaštene platne institucije
 * (Stripe Payments Europe Ltd.) u skladu s PSD2 pravilima.
 * 
 * Ova funkcija poziva Stripe Refund API koji provodi refund kroz
 * Stripe infrastrukturu. Platforma samo inicira refund zahtjev,
 * a Stripe provodi stvarni povrat sredstava korisniku.
 */
```

**Objašnjenje**:
- ✅ Platforma **ne provodi refund direktno** - samo poziva Stripe API
- ✅ Stripe **provodi refund** kroz svoju licenciranu infrastrukturu
- ✅ Platforma vraća **interne kredite** samo za UX (konzistentnost)

---

## 🎯 **ZAKLJUČAK**

**Da, možeš legalno implementirati Stripe refund API uz postojeću izjavu.**

Stripe refund API je standardni način rukovanja refundovima i u potpunosti je u skladu s tvojom izjavom jer:
1. Ti ne provodiš refund direktno
2. Stripe (licencirani payment processor) provodi refund
3. Platforma samo inicira zahtjev

**Preporuka**: Implementiraj Stripe refund API - to je najbolja praksa i potpuno legalno.

