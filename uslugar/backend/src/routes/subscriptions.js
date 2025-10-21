import { Router } from 'express';
import { prisma } from '../lib/prisma.js';
import { auth } from '../lib/auth.js';

const r = Router();

// USLUGAR EXCLUSIVE - Subscription plans sa kreditima za ekskluzivne leadove
const PLANS = {
  BASIC: {
    name: 'Basic',
    price: 39, // EUR mjesečno
    credits: 10, // 10 ekskluzivnih leadova
    creditsPerLead: 1, // 1 lead = 1 kredit (prosječno 10€ per lead)
    avgLeadPrice: 10, // EUR
    features: [
      '10 ekskluzivnih leadova mjesečno',
      '1 lead = 1 izvođač (bez konkurencije)',
      'Refund ako klijent ne odgovori',
      'ROI statistika',
      'Email notifikacije',
      'Mini CRM za leadove'
    ],
    savings: 'Ušteda 10€ vs pay-per-lead'
  },
  PREMIUM: {
    name: 'Premium',
    price: 89, // EUR mjesečno
    credits: 25, // 25 ekskluzivnih leadova
    creditsPerLead: 1,
    avgLeadPrice: 10,
    features: [
      '25 ekskluzivnih leadova mjesečno',
      '1 lead = 1 izvođač (bez konkurencije)',
      'Refund ako klijent ne odgovori',
      'AI prioritet - viđeni prvi',
      'ROI statistika + analitika',
      'SMS + Email notifikacije',
      'Mini CRM za leadove',
      'Prioritetna podrška'
    ],
    savings: 'Ušteda 161€ vs pay-per-lead (36% popust)',
    popular: true
  },
  PRO: {
    name: 'Pro',
    price: 149, // EUR mjesečno
    credits: 50, // 50 ekskluzivnih leadova
    creditsPerLead: 1,
    avgLeadPrice: 10,
    features: [
      '50 ekskluzivnih leadova mjesečno',
      '1 lead = 1 izvođač (bez konkurencije)',
      'Refund ako klijent ne odgovori',
      'AI prioritet - viđeni prvi',
      'Premium kvaliteta leadova (80+ score)',
      'ROI statistika + napredna analitika',
      'SMS + Email + Push notifikacije',
      'CRM + izvještaji',
      'VIP podrška 24/7',
      'Featured profil',
      'White-label opcija'
    ],
    savings: 'Ušteda 351€ vs pay-per-lead (47% popust)'
  }
};

// Get current subscription
r.get('/me', auth(true, ['PROVIDER']), async (req, res, next) => {
  try {
    let subscription = await prisma.subscription.findUnique({
      where: { userId: req.user.id }
    });

    // Create default subscription if doesn't exist (FREE TRIAL)
    if (!subscription) {
      subscription = await prisma.subscription.create({
        data: {
          userId: req.user.id,
          plan: 'TRIAL',
          status: 'ACTIVE',
          credits: 0,
          creditsBalance: 2, // 2 besplatna leada za probati
          expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 dana trial
        }
      });
      
      // Notify o trial-u
      await prisma.notification.create({
        data: {
          title: 'Dobrodošli u Uslugar EXCLUSIVE!',
          message: 'Dobili ste 2 besplatna leada da probate našu platformu. Nadogradite pretplatu za više.',
          type: 'SYSTEM',
          userId: req.user.id
        }
      });
    }

    // Check if subscription expired
    if (subscription.expiresAt && new Date() > subscription.expiresAt) {
      subscription = await prisma.subscription.update({
        where: { userId: req.user.id },
        data: {
          status: 'EXPIRED',
          plan: 'BASIC',
          credits: PLANS.BASIC.credits
        }
      });
    }

    res.json({
      subscription,
      planDetails: PLANS[subscription.plan]
    });
  } catch (e) {
    next(e);
  }
});

// Get all available plans
r.get('/plans', async (req, res) => {
  res.json(PLANS);
});

// Subscribe to a plan (USLUGAR EXCLUSIVE)
r.post('/subscribe', auth(true, ['PROVIDER']), async (req, res, next) => {
  try {
    const { plan, paymentIntentId } = req.body;

    if (!['BASIC', 'PREMIUM', 'PRO'].includes(plan)) {
      return res.status(400).json({ error: 'Invalid plan' });
    }

    const planDetails = PLANS[plan];
    const expiresAt = new Date();
    expiresAt.setMonth(expiresAt.getMonth() + 1); // 1 mjesec

    // TODO: Integrate payment gateway here (Stripe/CorvusPay)
    // Za sada simuliramo uspješnu uplatu

    // Dohvati postojeću pretplatu
    const existingSubscription = await prisma.subscription.findUnique({
      where: { userId: req.user.id }
    });

    const subscription = await prisma.subscription.upsert({
      where: { userId: req.user.id },
      create: {
        userId: req.user.id,
        plan,
        status: 'ACTIVE',
        credits: planDetails.credits, // Legacy
        creditsBalance: planDetails.credits, // EXCLUSIVE - novi krediti
        expiresAt
      },
      update: {
        plan,
        status: 'ACTIVE',
        creditsBalance: existingSubscription 
          ? existingSubscription.creditsBalance + planDetails.credits 
          : planDetails.credits, // Dodaj kredite na postojeće
        expiresAt
      }
    });

    // Kreiraj credit transaction
    await prisma.creditTransaction.create({
      data: {
        userId: req.user.id,
        type: 'SUBSCRIPTION',
        amount: planDetails.credits,
        balance: subscription.creditsBalance,
        description: `${planDetails.name} subscription - ${planDetails.credits} credits`
      }
    });

    // Create notification
    await prisma.notification.create({
      data: {
        title: 'Pretplata aktivirana!',
        message: `Uspješno ste se pretplatili na ${planDetails.name} plan! Dodano ${planDetails.credits} kredita.`,
        type: 'SYSTEM',
        userId: req.user.id
      }
    });

    console.log(`[SUBSCRIPTION] User ${req.user.id} subscribed to ${plan}. Credits: ${subscription.creditsBalance}`);

    res.json({
      success: true,
      subscription,
      planDetails,
      message: `Welcome to ${planDetails.name}! You have ${subscription.creditsBalance} credits.`
    });
  } catch (e) {
    next(e);
  }
});

// Cancel subscription
r.post('/cancel', auth(true, ['PROVIDER']), async (req, res, next) => {
  try {
    const subscription = await prisma.subscription.update({
      where: { userId: req.user.id },
      data: {
        status: 'CANCELLED',
        plan: 'BASIC',
        credits: PLANS.BASIC.credits
      }
    });

    // Create notification
    await prisma.notification.create({
      data: {
        title: 'Pretplata otkazana',
        message: 'Vaša pretplata je otkazana. Vraćeni ste na Basic plan.',
        type: 'SYSTEM',
        userId: req.user.id
      }
    });

    res.json({ subscription });
  } catch (e) {
    next(e);
  }
});

// Check if user can send offer (has credits)
r.get('/can-send-offer', auth(true, ['PROVIDER']), async (req, res, next) => {
  try {
    const subscription = await prisma.subscription.findUnique({
      where: { userId: req.user.id }
    });

    if (!subscription) {
      return res.json({ canSend: true, credits: PLANS.BASIC.credits });
    }

    // Check if expired
    if (subscription.expiresAt && new Date() > subscription.expiresAt) {
      await prisma.subscription.update({
        where: { userId: req.user.id },
        data: {
          status: 'EXPIRED',
          plan: 'BASIC',
          credits: PLANS.BASIC.credits
        }
      });
      return res.json({ canSend: PLANS.BASIC.credits > 0, credits: PLANS.BASIC.credits });
    }

    // PRO plan has unlimited credits (-1)
    if (subscription.credits === -1) {
      return res.json({ canSend: true, credits: -1, unlimited: true });
    }

    res.json({
      canSend: subscription.credits > 0,
      credits: subscription.credits
    });
  } catch (e) {
    next(e);
  }
});

// Deduct credit (called when offer is sent)
export const deductCredit = async (userId) => {
  const subscription = await prisma.subscription.findUnique({
    where: { userId }
  });

  if (!subscription || subscription.credits === -1) {
    return; // No subscription or unlimited credits
  }

  if (subscription.credits > 0) {
    await prisma.subscription.update({
      where: { userId },
      data: {
        credits: subscription.credits - 1
      }
    });
  }
};

export default r;

