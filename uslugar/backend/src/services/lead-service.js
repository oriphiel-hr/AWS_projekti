// Lead Management Service - USLUGAR EXCLUSIVE
import { prisma } from '../lib/prisma.js';
import { deductCredits, refundCredits } from './credit-service.js';
import { notifyProvider, notifyClient } from '../lib/notifications.js';

/**
 * Kupi ekskluzivan lead
 */
export async function purchaseLead(jobId, providerId) {
  // 1. Provjeri postoji li job i je li dostupan
  const job = await prisma.job.findUnique({
    where: { id: jobId },
    include: {
      user: true,
      category: true
    }
  });

  if (!job) {
    throw new Error('Job not found');
  }

  if (!job.isExclusive) {
    throw new Error('This job is not exclusive');
  }

  if (job.leadStatus !== 'AVAILABLE') {
    throw new Error(`Lead is not available. Status: ${job.leadStatus}`);
  }

  if (job.assignedProviderId) {
    throw new Error('Lead already assigned to another provider');
  }

  // 2. Provjeri da provider nije vlasnik posta
  if (job.userId === providerId) {
    throw new Error('Cannot purchase your own job');
  }

  // 3. Provjeri je li provider već kupio ovaj lead
  const existingPurchase = await prisma.leadPurchase.findFirst({
    where: {
      jobId,
      providerId,
      status: { not: 'REFUNDED' }
    }
  });

  if (existingPurchase) {
    throw new Error('You already purchased this lead');
  }

  const leadPrice = job.leadPrice || 10;

  // 4. Potroši kredite
  try {
    const { balance, transaction } = await deductCredits(
      providerId,
      leadPrice,
      `Lead purchase: ${job.title}`,
      jobId
    );

    // 5. Kreiraj LeadPurchase zapis
    const purchase = await prisma.leadPurchase.create({
      data: {
        jobId,
        providerId,
        creditsSpent: leadPrice,
        leadPrice,
        status: 'ACTIVE'
      }
    });

    // 6. Ažuriraj Job - dodijeli provideru
    await prisma.job.update({
      where: { id: jobId },
      data: {
        assignedProviderId: providerId,
        leadStatus: 'ASSIGNED'
      }
    });

    // 7. Notify klijenta da je lead kupljen
    await notifyClient(job.userId, {
      title: 'Pružatelj zainteresiran!',
      message: `Pružatelj usluga je zainteresiran za vaš posao: ${job.title}`,
      type: 'NEW_OFFER',
      jobId
    });

    // 8. Ažuriraj ROI statistiku
    await updateProviderROI(providerId, {
      leadsPurchased: 1,
      creditsSpent: leadPrice
    });

    console.log(`[LEAD] Provider ${providerId} purchased lead ${jobId} for ${leadPrice} credits`);

    return {
      success: true,
      purchase,
      job,
      creditsRemaining: balance,
      message: 'Lead successfully purchased! Contact the client now.'
    };

  } catch (error) {
    console.error('[LEAD] Purchase failed:', error);
    throw error;
  }
}

/**
 * Označi lead kao kontaktiran
 */
export async function markLeadContacted(purchaseId, providerId) {
  const purchase = await prisma.leadPurchase.findUnique({
    where: { id: purchaseId }
  });

  if (!purchase) {
    throw new Error('Purchase not found');
  }

  if (purchase.providerId !== providerId) {
    throw new Error('Unauthorized');
  }

  if (purchase.status === 'CONTACTED' || purchase.status === 'CONVERTED') {
    return purchase; // Already marked
  }

  const updated = await prisma.leadPurchase.update({
    where: { id: purchaseId },
    data: {
      status: 'CONTACTED',
      contactedAt: new Date()
    }
  });

  // Ažuriraj Job status
  await prisma.job.update({
    where: { id: purchase.jobId },
    data: { leadStatus: 'CONTACTED' }
  });

  // Ažuriraj ROI statistiku
  await updateProviderROI(providerId, {
    leadsContacted: 1
  });

  return updated;
}

/**
 * Označi lead kao konvertiran (uspješno realiziran)
 */
export async function markLeadConverted(purchaseId, providerId, revenue = 0) {
  const purchase = await prisma.leadPurchase.findUnique({
    where: { id: purchaseId }
  });

  if (!purchase) {
    throw new Error('Purchase not found');
  }

  if (purchase.providerId !== providerId) {
    throw new Error('Unauthorized');
  }

  const updated = await prisma.leadPurchase.update({
    where: { id: purchaseId },
    data: {
      status: 'CONVERTED',
      convertedAt: new Date()
    }
  });

  // Ažuriraj Job status
  await prisma.job.update({
    where: { id: purchase.jobId },
    data: {
      leadStatus: 'CONVERTED',
      status: 'IN_PROGRESS'
    }
  });

  // Ažuriraj Subscription - povećaj broj konverzija
  await prisma.subscription.update({
    where: { userId: providerId },
    data: {
      lifetimeLeadsConverted: { increment: 1 }
    }
  });

  // Ažuriraj ROI statistiku
  await updateProviderROI(providerId, {
    leadsConverted: 1,
    revenue
  });

  return updated;
}

/**
 * Zatraži povrat za lead (klijent nije odgovorio)
 * 
 * PRAVNO: Platforma ne provodi povrate sredstava samostalno.
 * Povrati se provode isključivo putem ovlaštene platne institucije
 * (Stripe Payments Europe Ltd.) u skladu s PSD2 pravilima.
 * 
 * Ova funkcija priprema zahtjev za povrat i vraća interne kredite.
 * Ako lead kupnja koristi Stripe Payment Intent, refund se prosljeđuje Stripe-u.
 */
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

  // Napomena: Ako se u budućnosti lead kupnja radi kroz Stripe Payment Intent,
  // ovdje bi se dodao Stripe Refund API poziv:
  // if (purchase.stripePaymentIntentId) {
  //   await stripe.refunds.create({
  //     payment_intent: purchase.stripePaymentIntentId,
  //     amount: purchase.creditsSpent * 100, // u centima
  //     reason: 'requested_by_customer',
  //     metadata: { leadId: purchase.jobId, reason }
  //   });
  // }

  // Vrati interne kredite (za slučajeve gdje se koriste internal credits, ne Stripe direktno)
  // Ovaj korak se zadržava za kompatibilnost dok se ne implementira puni Stripe escrow model
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
      refundReason: reason
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

  console.log(`[LEAD] Zahtjev za povrat obrađen: ${purchase.creditsSpent} kredita vraćeno provideru ${providerId} za lead ${purchase.jobId}`);

  return updated;
}

/**
 * Ažuriraj ROI statistiku providera
 */
async function updateProviderROI(providerId, updates) {
  const roi = await prisma.providerROI.upsert({
    where: { providerId },
    create: {
      providerId,
      totalLeadsPurchased: updates.leadsPurchased || 0,
      totalLeadsContacted: updates.leadsContacted || 0,
      totalLeadsConverted: updates.leadsConverted || 0,
      totalCreditsSpent: updates.creditsSpent || 0,
      totalRevenue: updates.revenue || 0
    },
    update: {
      totalLeadsPurchased: updates.leadsPurchased ? { increment: updates.leadsPurchased } : undefined,
      totalLeadsContacted: updates.leadsContacted ? { increment: updates.leadsContacted } : undefined,
      totalLeadsConverted: updates.leadsConverted ? { increment: updates.leadsConverted } : undefined,
      totalCreditsSpent: updates.creditsSpent ? { increment: updates.creditsSpent } : undefined,
      totalRevenue: updates.revenue ? { increment: updates.revenue } : undefined,
      lastUpdated: new Date()
    }
  });

  // Izračunaj conversion rate i ROI
  if (roi.totalLeadsPurchased > 0) {
    const conversionRate = (roi.totalLeadsConverted / roi.totalLeadsPurchased) * 100;
    const avgCreditPrice = 10; // 10 EUR po kreditu (konfiguriše se)
    const totalInvested = roi.totalCreditsSpent * avgCreditPrice;
    const roiPercent = totalInvested > 0 ? ((roi.totalRevenue - totalInvested) / totalInvested) * 100 : 0;
    const avgLeadValue = roi.totalLeadsConverted > 0 ? roi.totalRevenue / roi.totalLeadsConverted : 0;

    await prisma.providerROI.update({
      where: { providerId },
      data: {
        conversionRate,
        roi: roiPercent,
        avgLeadValue
      }
    });
  }

  return roi;
}

/**
 * Dohvati dostupne leadove za kategoriju providera
 */
export async function getAvailableLeads(providerId, filters = {}) {
  const provider = await prisma.providerProfile.findUnique({
    where: { userId: providerId },
    include: { categories: true }
  });

  if (!provider) {
    throw new Error('Provider profile not found');
  }

  const categoryIds = provider.categories.map(c => c.id);

  const where = {
    isExclusive: true,
    leadStatus: 'AVAILABLE',
    assignedProviderId: null,
    categoryId: { in: categoryIds },
    userId: { not: providerId }, // Ne prikazuj vlastite poslove
    ...filters
  };

  const leads = await prisma.job.findMany({
    where,
    include: {
      user: {
        select: {
          fullName: true,
          city: true,
          clientVerification: true
        }
      },
      category: true
    },
    orderBy: [
      { qualityScore: 'desc' },
      { createdAt: 'desc' }
    ]
  });

  return leads;
}

/**
 * Dohvati kupljene leadove providera
 */
export async function getMyLeads(providerId, status = null) {
  const where = {
    providerId,
    ...(status && { status })
  };

  const purchases = await prisma.leadPurchase.findMany({
    where,
    include: {
      job: {
        include: {
          user: {
            select: {
              fullName: true,
              email: true,
              phone: true,
              city: true
            }
          },
          category: true
        }
      }
    },
    orderBy: { createdAt: 'desc' }
  });

  return purchases;
}

