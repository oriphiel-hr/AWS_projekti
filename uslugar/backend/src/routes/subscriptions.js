import { Router } from 'express';
import { prisma } from '../lib/prisma.js';
import { auth } from '../lib/auth.js';

// Legacy route - deprecated, use /api/payments/create-checkout instead

const r = Router();

// Helper function to get plans from database
// Podržava segmentaciju po regiji i kategoriji
async function getPlansFromDB(filters = {}) {
  const { categoryId, region } = filters;
  
  // Build where clause for segmentation
  const where = { isActive: true };
  
  // Ako je specificirana kategorija ili regija, filtriraj pakete
  // null vrijednosti znače "sve kategorije/regije"
  if (categoryId !== undefined) {
    where.categoryId = categoryId || null;
  }
  if (region !== undefined) {
    where.region = region || null;
  }
  
  const dbPlans = await prisma.subscriptionPlan.findMany({
    where,
    include: {
      category: {
        select: {
          id: true,
          name: true
        }
      }
    },
    orderBy: { displayOrder: 'asc' }
  });
  
  // Transform to legacy format for backward compatibility
  // Za segmentirane pakete, koristimo kombinaciju name + category + region kao ključ
  const plansObj = {};
  dbPlans.forEach(plan => {
    const key = plan.categoryId || plan.region 
      ? `${plan.name}_${plan.categoryId || ''}_${plan.region || ''}` 
      : plan.name;
    
    plansObj[key] = {
      id: plan.id,
      name: plan.displayName,
      planName: plan.name,
      price: plan.price,
      credits: plan.credits,
      creditsPerLead: 1,
      avgLeadPrice: plan.price / plan.credits,
      features: plan.features,
      savings: plan.savings,
      popular: plan.isPopular,
      categoryId: plan.categoryId,
      category: plan.category ? { id: plan.category.id, name: plan.category.name } : null,
      region: plan.region,
      description: plan.description
    };
  });
  
  return { dbPlans, plansObj };
}

/**
 * Automatski vraća korisnika na BASIC plan nakon isteka pretplate
 * Zadržava postojeće kredite i povijest leadova, ali deaktivira premium značajke
 * @param {String} userId - ID korisnika
 * @param {String} previousPlan - Prethodni plan (PREMIUM, PRO, itd.)
 * @returns {Promise<Object>} - Ažurirana pretplata
 */
export async function downgradeToBasic(userId, previousPlan = null) {
  try {
    const subscription = await prisma.subscription.findUnique({
      where: { userId },
      include: {
        user: {
          select: {
            id: true,
            fullName: true,
            email: true
          }
        }
      }
    });

    if (!subscription) {
      throw new Error('Subscription not found');
    }

    // Ako je već BASIC ili TRIAL, ne treba downgrade
    if (subscription.plan === 'BASIC' || subscription.plan === 'TRIAL') {
      return subscription;
    }

    // Ako je već EXPIRED ili CANCELLED, možda je već downgrade-ano
    // Ali ipak ćemo postaviti na BASIC ako nije već
    if (subscription.status === 'EXPIRED' || subscription.status === 'CANCELLED') {
      if (subscription.plan !== 'BASIC') {
        // Ažuriraj na BASIC plan
        const updatedSubscription = await prisma.subscription.update({
          where: { userId },
          data: {
            plan: 'BASIC',
            status: 'ACTIVE', // Aktiviraj BASIC plan
            // Zadržavamo postojeće kredite (creditsBalance ostaje isti)
            // Premium značajke će se automatski deaktivirati jer je plan BASIC
          }
        });

        // Kreiraj notifikaciju
        await prisma.notification.create({
          data: {
            title: 'Pretplata vraćena na BASIC plan',
            message: `Vaša pretplata (${previousPlan || subscription.plan}) je istekla. Automatski ste vraćeni na BASIC plan s osnovnim funkcionalnostima. Vaši postojeći krediti i povijest leadova su zadržani.`,
            type: 'SYSTEM',
            userId: userId
          }
        });

        console.log(`[SUBSCRIPTION] User ${userId} downgraded from ${subscription.plan} to BASIC plan`);

        return updatedSubscription;
      }
      return subscription;
    }

    // Ako je aktivan, ali je istekao, downgrade na BASIC
    const updatedSubscription = await prisma.subscription.update({
      where: { userId },
      data: {
        plan: 'BASIC',
        status: 'ACTIVE', // Aktiviraj BASIC plan
        // Zadržavamo postojeće kredite (creditsBalance ostaje isti)
        // Premium značajke će se automatski deaktivirati jer je plan BASIC
      }
    });

    // Kreiraj notifikaciju
    await prisma.notification.create({
      data: {
        title: 'Pretplata vraćena na BASIC plan',
        message: `Vaša pretplata (${previousPlan || subscription.plan}) je istekla. Automatski ste vraćeni na BASIC plan s osnovnim funkcionalnostima. Vaši postojeći krediti i povijest leadova su zadržani.`,
        type: 'SYSTEM',
        userId: userId
      }
    });

    console.log(`[SUBSCRIPTION] User ${userId} downgraded from ${subscription.plan} to BASIC plan`);

    return updatedSubscription;
  } catch (error) {
    console.error(`[SUBSCRIPTION] Error downgrading user ${userId} to BASIC:`, error);
    throw error;
  }
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

    // Check if subscription expired - automatski vraćanje na BASIC plan
    if (subscription.expiresAt && new Date() > subscription.expiresAt) {
      const previousPlan = subscription.plan;
      
      // Ako je TRIAL plan, samo označi kao EXPIRED (ne vraća se na BASIC)
      if (subscription.plan === 'TRIAL') {
        if (subscription.status === 'ACTIVE') {
          subscription = await prisma.subscription.update({
            where: { userId: req.user.id },
            data: {
              status: 'EXPIRED',
              creditsBalance: 0, // Nema kredita dok ne plate
              plan: 'TRIAL' // Ostaje TRIAL dok ne plate
            }
          });
          
          // Notifika o isteku TRIAL-a
          await prisma.notification.create({
            data: {
              title: 'TRIAL je istekao',
              message: 'Vaš besplatni trial je istekao. Plati we pretplatu da nastaviš koristiti Uslugar EXCLUSIVE.',
              type: 'SYSTEM',
              userId: req.user.id
            }
          });
        }
      } else {
        // Za sve ostale planove (PREMIUM, PRO), automatski vraćanje na BASIC
        // Premium značajke će se automatski deaktivirati jer je plan BASIC
        subscription = await downgradeToBasic(req.user.id, previousPlan);
      }
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
// Podržava filtriranje po regiji i kategoriji za segmentni model paketa
// Query params: ?categoryId=xxx&region=Zagreb
r.get('/plans', async (req, res, next) => {
  try {
    const { categoryId, region } = req.query;
    
    const filters = {};
    if (categoryId !== undefined) {
      filters.categoryId = categoryId === 'null' || categoryId === '' ? null : categoryId;
    }
    if (region !== undefined) {
      filters.region = region === 'null' || region === '' ? null : region;
    }
    
    const { plansObj, dbPlans } = await getPlansFromDB(filters);
    
    // Return database format with category info
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
    const transaction = await prisma.creditTransaction.create({
      data: {
        userId: req.user.id,
        type: 'SUBSCRIPTION',
        amount: planDetails.credits,
        balance: subscription.creditsBalance,
        description: `${planDetails.name} subscription - ${planDetails.credits} credits`
      }
    });

    // Create notification (subscription activation)
    await prisma.notification.create({
      data: {
        title: 'Pretplata aktivirana!',
        message: `Uspješno ste se pretplatili na ${planDetails.name} plan! Dodano ${planDetails.credits} kredita.`,
        type: 'SYSTEM',
        userId: req.user.id
      }
    });
    
    // Also send transaction-specific notification
    await prisma.notification.create({
      data: {
        userId: req.user.id,
        type: 'SYSTEM',
        title: 'Krediti iz pretplate',
        message: `Dodano vam je ${planDetails.credits} kredita iz pretplate ${planKey}. Novo stanje: ${subscription.creditsBalance} kredita.`,
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
    
    const previousPlan = existingSubscription.plan;
    
    // Ako nije TRIAL, automatski vraćanje na BASIC plan
    if (existingSubscription.plan !== 'TRIAL') {
      const subscription = await downgradeToBasic(req.user.id, previousPlan);
      
      // Ažuriraj cancelledAt
      await prisma.subscription.update({
        where: { userId: req.user.id },
        data: {
          cancelledAt: new Date()
        }
      });

      console.log(`[SUBSCRIPTION] User ${req.user.id} cancelled ${previousPlan} subscription, downgraded to BASIC`);

      return res.json({ 
        success: true,
        subscription,
        message: 'Pretplata je uspješno otkazana. Automatski ste vraćeni na BASIC plan s osnovnim funkcionalnostima.' 
      });
    } else {
      // Za TRIAL, samo označi kao CANCELLED
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

      console.log(`[SUBSCRIPTION] User ${req.user.id} cancelled TRIAL subscription`);

      return res.json({ 
        success: true,
        subscription,
        message: 'Pretplata je uspješno otkazana.' 
      });
    }
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

/**
 * Provjerava istekle pretplate i automatski vraća na BASIC plan
 * Ova funkcija se može pozivati periodično (npr. svaki sat) kroz cron job ili scheduled task
 * @returns {Promise<Object>} - Statistika obrade
 */
export async function checkAndDowngradeExpiredSubscriptions() {
  try {
    const now = new Date();
    
    // Pronađi sve pretplate koje su istekle, ali još nisu downgrade-ane na BASIC
    const expiredSubscriptions = await prisma.subscription.findMany({
      where: {
        expiresAt: {
          lt: now // Istečeno prije sada
        },
        status: {
          in: ['ACTIVE', 'EXPIRED'] // Aktivan ili već označen kao EXPIRED
        },
        plan: {
          not: 'BASIC' // Nije već BASIC
        }
      },
      include: {
        user: {
          select: {
            id: true,
            fullName: true,
            email: true
          }
        }
      }
    });

    let downgradedCount = 0;
    let skippedCount = 0;

    for (const subscription of expiredSubscriptions) {
      try {
        // Ako je TRIAL, preskoči (TRIAL se ne vraća na BASIC)
        if (subscription.plan === 'TRIAL') {
          skippedCount++;
          continue;
        }

        // Downgrade na BASIC
        await downgradeToBasic(subscription.userId, subscription.plan);
        downgradedCount++;
        
        console.log(`[SUBSCRIPTION] Auto-downgraded user ${subscription.userId} from ${subscription.plan} to BASIC`);
      } catch (error) {
        console.error(`[SUBSCRIPTION] Error downgrading user ${subscription.userId}:`, error);
      }
    }

    console.log(`[SUBSCRIPTION] Checked expired subscriptions: ${downgradedCount} downgraded, ${skippedCount} skipped (TRIAL)`);

    return {
      checked: expiredSubscriptions.length,
      downgraded: downgradedCount,
      skipped: skippedCount
    };
  } catch (error) {
    console.error('[SUBSCRIPTION] Error checking expired subscriptions:', error);
    throw error;
  }
}

export default r;

