import { Router } from 'express';
import { prisma } from '../lib/prisma.js';
import { auth } from '../lib/auth.js';

const r = Router();

// Subscription plans
const PLANS = {
  BASIC: {
    name: 'Basic',
    price: 0,
    credits: 5, // 5 odgovora mjesečno
    features: ['5 ponuda mjesečno', 'Osnovni profil', 'Email notifikacije']
  },
  PREMIUM: {
    name: 'Premium',
    price: 19.99,
    credits: 50, // 50 odgovora mjesečno
    features: ['50 ponuda mjesečno', 'Premium profil', 'Prioritetna podrška', 'Analitika']
  },
  PRO: {
    name: 'Pro',
    price: 49.99,
    credits: -1, // Neograničeno
    features: ['Neograničene ponude', 'Pro profil', 'VIP podrška', 'Napredna analitika', 'Featured listing']
  }
};

// Get current subscription
r.get('/me', auth(true, ['PROVIDER']), async (req, res, next) => {
  try {
    let subscription = await prisma.subscription.findUnique({
      where: { userId: req.user.id }
    });

    // Create default BASIC subscription if doesn't exist
    if (!subscription) {
      subscription = await prisma.subscription.create({
        data: {
          userId: req.user.id,
          plan: 'BASIC',
          status: 'ACTIVE',
          credits: PLANS.BASIC.credits
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

// Subscribe to a plan
r.post('/subscribe', auth(true, ['PROVIDER']), async (req, res, next) => {
  try {
    const { plan } = req.body;

    if (!['BASIC', 'PREMIUM', 'PRO'].includes(plan)) {
      return res.status(400).json({ error: 'Invalid plan' });
    }

    const planDetails = PLANS[plan];
    const expiresAt = new Date();
    expiresAt.setMonth(expiresAt.getMonth() + 1); // 1 mjesec

    const subscription = await prisma.subscription.upsert({
      where: { userId: req.user.id },
      create: {
        userId: req.user.id,
        plan,
        status: 'ACTIVE',
        credits: planDetails.credits,
        expiresAt
      },
      update: {
        plan,
        status: 'ACTIVE',
        credits: planDetails.credits,
        expiresAt
      }
    });

    // TODO: Integrate payment gateway here (Stripe, PayPal, etc.)
    // For now, we just activate the subscription

    // Create notification
    await prisma.notification.create({
      data: {
        title: 'Pretplata aktivirana',
        message: `Uspješno ste se pretplatili na ${planDetails.name} plan!`,
        type: 'SYSTEM',
        userId: req.user.id
      }
    });

    res.json({
      subscription,
      planDetails
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

