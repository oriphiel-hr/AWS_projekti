import { Router } from 'express';
import { prisma } from '../lib/prisma.js';
import { auth } from '../lib/auth.js';

// Legacy route - deprecated, use /api/payments/create-checkout instead

const r = Router();

// Helper function to get plans from database
async function getPlansFromDB() {
  const dbPlans = await prisma.subscriptionPlan.findMany({
    where: { isActive: true },
    orderBy: { displayOrder: 'asc' }
  });
  
  // Transform to legacy format for backward compatibility
  const plansObj = {};
  dbPlans.forEach(plan => {
    plansObj[plan.name] = {
      name: plan.displayName,
      price: plan.price,
      credits: plan.credits,
      creditsPerLead: 1,
      avgLeadPrice: plan.price / plan.credits,
      features: plan.features,
      savings: plan.savings,
      popular: plan.isPopular
    };
  });
  
  return { dbPlans, plansObj };
}

// Get current subscription
// Dozvoljeno za PROVIDER, ADMIN i USER-e koji su tvrtke/obrti (imaju legalStatusId)
r.get('/me', auth(true, ['PROVIDER', 'ADMIN', 'USER']), async (req, res, next) => {
  try {
    // Provjeri da li USER ima legalStatusId (tvrtka/obrt)
    if (req.user.role === 'USER') {
      const userCheck = await prisma.user.findUnique({
        where: { id: req.user.id },
        select: { legalStatusId: true }
      });
      
      if (!userCheck || !userCheck.legalStatusId) {
        return res.status(403).json({ 
          error: 'Nemate pristup',
          message: 'Ovaj endpoint je dostupan samo za tvrtke/obrte ili pružatelje usluga.'
        });
      }
    }
    
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
          creditsBalance: 5, // 5 besplatnih leadova za probati
          expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 dana trial
        }
      });
      
      // Notify o trial-u
      await prisma.notification.create({
        data: {
          title: 'Dobrodošli u Uslugar EXCLUSIVE!',
          message: 'Dobili ste 5 besplatnih leadova da probate našu platformu. Nadogradite pretplatu za više.',
          type: 'SYSTEM',
          userId: req.user.id
        }
      });
    }

    // Check if subscription expired (MORATE PLATITI - ne automatski prelazak!)
    if (subscription.expiresAt && new Date() > subscription.expiresAt && subscription.status === 'ACTIVE') {
      // Samo označi kao EXPIRED - NIJE automatski BASIC!
      subscription = await prisma.subscription.update({
        where: { userId: req.user.id },
        data: {
          status: 'EXPIRED',
          creditsBalance: 0, // Nema kredita dok ne plate
          plan: 'TRIAL' // Ostaje TRIAL dok ne plate
        }
      });
      
      // Notifika o isteku
      await prisma.notification.create({
        data: {
          title: 'TRIAL je istekao',
          message: 'Vaš besplatni trial je istekao. Plati we pretplatu da nastaviš koristiti Uslugar EXCLUSIVE.',
          type: 'SYSTEM',
          userId: req.user.id
        }
      });
    }

    const { plansObj } = await getPlansFromDB();
    res.json({
      subscription,
      planDetails: plansObj[subscription.plan] || null
    });
  } catch (e) {
    next(e);
  }
});

// Get all available plans (from database)
r.get('/plans', async (req, res) => {
  try {
    const { plansObj, dbPlans } = await getPlansFromDB();
    // Return database format
    res.json(dbPlans);
  } catch (e) {
    next(e);
  }
});

// Subscribe to a plan (USLUGAR EXCLUSIVE)
r.post('/subscribe', auth(true, ['PROVIDER']), async (req, res, next) => {
  try {
    const { plan, paymentIntentId } = req.body;

    const { plansObj } = await getPlansFromDB();
    
    if (!plansObj[plan]) {
      return res.status(400).json({ error: 'Invalid plan' });
    }

    const planDetails = plansObj[plan];
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
    // Get current subscription
    const existingSubscription = await prisma.subscription.findUnique({
      where: { userId: req.user.id }
    });

    if (!existingSubscription) {
      return res.status(404).json({ error: 'No active subscription found' });
    }

    // If it's a paid subscription (not TRIAL), we should cancel the Stripe subscription too
    // TODO: Integrate Stripe subscription cancellation
    // For now, just mark as cancelled locally
    
    const subscription = await prisma.subscription.update({
      where: { userId: req.user.id },
      data: {
        status: 'CANCELLED',
        cancelledAt: new Date()
      }
    });

    // Create notification
    await prisma.notification.create({
      data: {
        title: 'Pretplata otkazana',
        message: 'Vaša pretplata je otkazana. Zadržavate postojeće kredite do kraja periode.',
        type: 'SYSTEM',
        userId: req.user.id
      }
    });

    console.log(`[SUBSCRIPTION] User ${req.user.id} cancelled subscription`);

    res.json({ 
      success: true,
      subscription,
      message: 'Pretplata je uspješno otkazana.' 
    });
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

