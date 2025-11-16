/**
 * Billing Adjustment Service - Dinamički billing po volumenu leadova
 *
 * Uspoređuje očekivani (BillingPlan.expectedLeads) i stvarno isporučeni
 * volumen leadova (LeadPurchase) po korisniku/kategoriji/regiji i periodu
 * te generira BillingAdjustment zapise.
 */

import { prisma } from '../lib/prisma.js';

/**
 * Izračunaj broj isporučenih leadova za određeni billing plan i period.
 *
 * @param {Object} plan - BillingPlan zapis
 * @param {Date} periodStart - Početak obračunskog perioda
 * @param {Date} periodEnd - Kraj obračunskog perioda (exclusivno)
 * @returns {Promise<number>} - Broj leadova
 */
async function calculateDeliveredLeadsForPlan(plan, periodStart, periodEnd) {
  const where = {
    providerId: plan.userId,
    createdAt: {
      gte: periodStart,
      lt: periodEnd
    },
    ...(plan.categoryId || plan.region
      ? {
          job: {
            ...(plan.categoryId ? { categoryId: plan.categoryId } : {}),
            ...(plan.region
              ? { city: { contains: plan.region, mode: 'insensitive' } }
              : {})
          }
        }
      : {})
  };

  const count = await prisma.leadPurchase.count({ where });
  return count;
}

/**
 * Generira ili ažurira BillingAdjustment za jedan BillingPlan i period.
 *
 * @param {Object} plan - BillingPlan zapis
 * @param {Date} periodStart
 * @param {Date} periodEnd
 * @returns {Promise<Object|null>} - Kreirani ili ažurirani BillingAdjustment ili null ako nema korekcije
 */
export async function calculateAdjustmentForPlan(plan, periodStart, periodEnd) {
  const deliveredLeads = await calculateDeliveredLeadsForPlan(plan, periodStart, periodEnd);
  const expectedLeads = plan.expectedLeads || 0;

  // Ako je uključen guarantee, minimalni prag je guaranteedMinLeads (ako je postavljen),
  // inače koristimo expectedLeads kao garantirani minimum.
  const guaranteedMinLeads =
    plan.guaranteeEnabled && typeof plan.guaranteedMinLeads === 'number'
      ? plan.guaranteedMinLeads
      : expectedLeads;

  // Ako nema očekivanja ili je sve u okviru ±10%, možemo samo logirati NONE
  if (expectedLeads <= 0) {
    return null;
  }

  const diff = deliveredLeads - expectedLeads;
  const guaranteeDiff = deliveredLeads - guaranteedMinLeads;

  let adjustmentType = 'NONE';
  let adjustmentCredits = 0;
  let notes = '';

  // Poseban slučaj: nema nijednog leada u periodu → agresivnija kompenzacija / snižavanje cijene
  if (deliveredLeads === 0) {
    adjustmentType = 'CREDIT';
    adjustmentCredits = expectedLeads; // puni credit za cijelu kvotu
    notes = `Automatsko snižavanje cijene: u ovom obračunskom periodu nije isporučen nijedan lead (0/${expectedLeads}). Klijentu se odobrava ${adjustmentCredits} kredita (pun povrat kvote).`;
  } else if (diff === 0 && (!plan.guaranteeEnabled || guaranteeDiff === 0)) {
  if (deliveredLeads === 0) {
    // već postavljeno gore
  } else if (diff === 0 && (!plan.guaranteeEnabled || guaranteeDiff === 0)) {
    adjustmentType = 'NONE';
    notes = 'Isporučen volumen odgovara očekivanom / garantiranim kvotama.';
  } else if (diff < 0 || (plan.guaranteeEnabled && guaranteeDiff < 0)) {
    // Isporuka manja od očekivanog ili garantirane kvote → CREDIT
    const baseMissing = Math.max(0, expectedLeads - deliveredLeads);
    const guaranteeMissing = Math.max(0, guaranteedMinLeads - deliveredLeads);
    adjustmentType = 'CREDIT';
    adjustmentCredits = Math.max(baseMissing, guaranteeMissing); // npr. 1 lead = 1 kredit

    if (plan.guaranteeEnabled) {
      notes = `Garancija minimalnog broja leadova aktivna. Isporučeno ${deliveredLeads}, garantirano minimalno ${guaranteedMinLeads}, očekivano ${expectedLeads}. Klijentu se odobrava ${adjustmentCredits} kredita.`;
    } else {
      notes = `Isporučeno ${deliveredLeads} od očekivanih ${expectedLeads} leadova. Klijentu se odobrava ${adjustmentCredits} kredita.`;
    }
  } else if (diff > 0) {
    // Isporuka veća od očekivane → SURCHARGE (ili preporuka za viši paket)
    adjustmentType = 'SURCHARGE';
    adjustmentCredits = diff;
    notes = `Isporučeno ${deliveredLeads} leadova, očekivano ${expectedLeads}. Moguća dodatna naplata za ${adjustmentCredits} leadova ili prijedlog za viši paket.`;
  }

  // Ako je NONE, možemo i dalje spremiti zapis radi transparentnosti
  const existing = await prisma.billingAdjustment.findFirst({
    where: {
      billingPlanId: plan.id,
      periodStart,
      periodEnd
    }
  });

  if (existing) {
    return await prisma.billingAdjustment.update({
      where: { id: existing.id },
      data: {
        expectedLeads,
        deliveredLeads,
        adjustmentType,
        adjustmentCredits,
        notes
      }
    });
  }

  return await prisma.billingAdjustment.create({
    data: {
      billingPlanId: plan.id,
      userId: plan.userId,
      periodStart,
      periodEnd,
      expectedLeads,
      deliveredLeads,
      adjustmentType,
      adjustmentCredits,
      notes
    }
  });
}

/**
 * Izračunaj korekcije za sve aktivne billing planove u danom periodu.
 *
 * @param {Date} periodStart
 * @param {Date} periodEnd
 * @returns {Promise<Array>} - Lista BillingAdjustment zapisa
 */
export async function calculateBillingAdjustmentsForPeriod(periodStart, periodEnd) {
  const plans = await prisma.billingPlan.findMany({
    where: {
      isActive: true
    }
  });

  const adjustments = [];

  for (const plan of plans) {
    const adj = await calculateAdjustmentForPlan(plan, periodStart, periodEnd);
    if (adj) {
      adjustments.push(adj);
    }
  }

  console.log(`[BILLING] Izračunate korekcije za period ${periodStart.toISOString()} - ${periodEnd.toISOString()}: ${adjustments.length} zapisa.`);

  return adjustments;
}

/**
 * Helper za mjesečni obračun: uzima prethodni mjesec kao obračunski period.
 */
export async function calculateMonthlyAdjustments() {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth(); // 0-11

  // Prethodni mjesec
  const periodEnd = new Date(year, month, 1); // prvi dan tekućeg mjeseca
  const periodStart = new Date(periodEnd);
  periodStart.setMonth(periodStart.getMonth() - 1); // prvi dan prethodnog mjeseca

  return await calculateBillingAdjustmentsForPeriod(periodStart, periodEnd);
}

/**
 * Dohvati sažetak volumena za jedan BillingPlan i period.
 */
export async function getPlanVolumeSummary(planId, periodStart, periodEnd) {
  const plan = await prisma.billingPlan.findUnique({
    where: { id: planId },
    include: {
      user: {
        select: {
          id: true,
          fullName: true,
          email: true
        }
      },
      category: {
        select: {
          id: true,
          name: true
        }
      }
    }
  });

  if (!plan) {
    throw new Error('BillingPlan not found');
  }

  const deliveredLeads = await calculateDeliveredLeadsForPlan(plan, periodStart, periodEnd);

  return {
    plan: {
      id: plan.id,
      name: plan.name,
      userId: plan.userId,
      userName: plan.user?.fullName || null,
      category: plan.category ? { id: plan.category.id, name: plan.category.name } : null,
      region: plan.region,
      expectedLeads: plan.expectedLeads,
      period: plan.period
    },
    period: {
      start: periodStart,
      end: periodEnd
    },
    deliveredLeads,
    expectedLeads: plan.expectedLeads,
    diff: deliveredLeads - plan.expectedLeads
  };
}

/**
 * Dohvati sažetak billing korekcija za direktora (provider) - za direktor dashboard.
 *
 * @param {String} userId - ID direktora (User)
 */
export async function getDirectorBillingSummary(userId) {
  const plans = await prisma.billingPlan.findMany({
    where: {
      userId,
      isActive: true
    },
    include: {
      category: {
        select: {
          id: true,
          name: true
        }
      }
    }
  });

  const adjustments = await prisma.billingAdjustment.findMany({
    where: {
      userId
    },
    orderBy: {
      periodStart: 'desc'
    },
    take: 50
  });

  return {
    plans: plans.map(p => ({
      id: p.id,
      name: p.name,
      category: p.category ? { id: p.category.id, name: p.category.name } : null,
      region: p.region,
      expectedLeads: p.expectedLeads,
      period: p.period,
      createdAt: p.createdAt,
      isActive: p.isActive
    })),
    adjustments
  };
}


