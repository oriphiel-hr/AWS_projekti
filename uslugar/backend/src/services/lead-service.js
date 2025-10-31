// Lead Management Service - USLUGAR EXCLUSIVE
import { prisma } from '../lib/prisma.js';
import { deductCredits, refundCredits } from './credit-service.js';
import { notifyProvider, notifyClient } from '../lib/notifications.js';
import { isWithinRadius, findClosestTeamLocation, sortJobsByDistance } from '../lib/geo-utils.js';

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

    // 5. Kreiraj LeadPurchase zapis (BEZ otključavanja kontakta - pay-per-contact)
    const purchase = await prisma.leadPurchase.create({
      data: {
        jobId,
        providerId,
        creditsSpent: leadPrice,
        leadPrice,
        status: 'ACTIVE',
        contactUnlocked: false // Kontakt nije otključan - provider mora plaćati dodatno
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
      job: {
        ...job,
        user: {
          ...job.user,
          // Skrij kontakt informacije - pay-per-contact model
          email: undefined,
          phone: undefined
        }
      },
      creditsRemaining: balance,
      message: 'Lead successfully purchased! Unlock contact to see client details.'
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

  const now = new Date();
  const updated = await prisma.leadPurchase.update({
    where: { id: purchaseId },
    data: {
      status: 'CONTACTED',
      contactedAt: now
    }
  });

  // REPUTATION: Izračunaj response time
  // Response time = vrijeme između unlock-a kontakta (ili kupovine ako nije unlock-ano) i kontakta
  const referenceTime = updated.contactUnlockedAt || purchase.createdAt;
  const responseTimeMinutes = Math.round((now.getTime() - referenceTime.getTime()) / (1000 * 60)); // u minutama

  // Ažuriraj ProviderProfile - avgResponseTimeMinutes
  if (responseTimeMinutes > 0 && responseTimeMinutes < 10080) { // Valid range: 0-7 dana (sprječava outlier-e)
    const profile = await prisma.providerProfile.findUnique({
      where: { userId: providerId },
      select: { avgResponseTimeMinutes: true, totalResponseTimeTracked: true }
    });

    if (profile) {
      // Rolling average: (stari_prosjek * broj_uzoraka + novi_response) / (broj_uzoraka + 1)
      const newCount = profile.totalResponseTimeTracked + 1;
      const newAvg = ((profile.avgResponseTimeMinutes * profile.totalResponseTimeTracked) + responseTimeMinutes) / newCount;

      await prisma.providerProfile.update({
        where: { userId: providerId },
        data: {
          avgResponseTimeMinutes: newAvg,
          totalResponseTimeTracked: newCount
        }
      });

      console.log(`[REPUTATION] Provider ${providerId} response time: ${responseTimeMinutes}min (avg: ${newAvg.toFixed(1)}min)`);
    }
  }

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

  // Re-fetch da dobijemo ažurirane vrijednosti
  const updatedRoi = await prisma.providerROI.findUnique({
    where: { providerId }
  });

  // Izračunaj conversion rate i ROI
  let conversionRate = 0;
  if (updatedRoi && updatedRoi.totalLeadsPurchased > 0) {
    conversionRate = (updatedRoi.totalLeadsConverted / updatedRoi.totalLeadsPurchased) * 100;
    const avgCreditPrice = 10; // 10 EUR po kreditu (konfiguriše se)
    const totalInvested = updatedRoi.totalCreditsSpent * avgCreditPrice;
    const roiPercent = totalInvested > 0 ? ((updatedRoi.totalRevenue - totalInvested) / totalInvested) * 100 : 0;
    const avgLeadValue = updatedRoi.totalLeadsConverted > 0 ? updatedRoi.totalRevenue / updatedRoi.totalLeadsConverted : 0;

    await prisma.providerROI.update({
      where: { providerId },
      data: {
        conversionRate,
        roi: roiPercent,
        avgLeadValue
      }
    });

    // REPUTATION: Cache conversionRate u ProviderProfile za brzi pristup
    await prisma.providerProfile.update({
      where: { userId: providerId },
      data: { conversionRate }
    }).catch(() => {
      // Ignoriraj ako profile ne postoji (ne bi trebalo, ali za sigurnost)
      console.warn(`[REPUTATION] ProviderProfile not found for ${providerId}`);
    });
  }

  return updatedRoi || roi;
}

/**
 * Dohvati dostupne leadove za kategoriju providera (GEO-INTELIGENTNO)
 * Filtrira po aktivnim tim lokacijama i radijusu pokrivanja
 */
export async function getAvailableLeads(providerId, filters = {}) {
  const provider = await prisma.providerProfile.findUnique({
    where: { userId: providerId },
    include: { 
      categories: true,
      teamLocations: {
        where: { isActive: true } // Samo aktivne lokacije
      }
    }
  });

  if (!provider) {
    throw new Error('Provider profile not found');
  }

  const categoryIds = provider.categories.map(c => c.id);

  if (categoryIds.length === 0) {
    return []; // Nema kategorija = nema leadova
  }

  // Osnovni filter
  const where = {
    isExclusive: true,
    leadStatus: 'AVAILABLE',
    assignedProviderId: null,
    categoryId: { in: categoryIds },
    userId: { not: providerId }, // Ne prikazuj vlastite poslove
    ...filters
  };

  // Dohvati sve leadove koji odgovaraju kategoriji
  let leads = await prisma.job.findMany({
    where,
    include: {
      user: {
        select: {
          fullName: true,
          city: true,
          clientVerification: true,
          email: true, // Treba nam za provjeru unlock statusa
          phone: true // Treba nam za provjeru unlock statusa
        }
      },
      category: true,
      leadPurchases: {
        where: {
          providerId,
          status: { not: 'REFUNDED' }
        },
        select: {
          contactUnlocked: true,
          id: true
        }
      }
    }
  });

  // Ako provider ima aktivne tim lokacije, filtriraj po geo-udaljenosti
  if (provider.teamLocations && provider.teamLocations.length > 0) {
    leads = leads.filter(job => {
      // Provjeri je li job u radijusu bilo koje aktivne lokacije
      return provider.teamLocations.some(location => {
        const result = isWithinRadius(location, job);
        return result.isWithinRadius;
      });
    });

    // Sortiraj po udaljenosti do najbliže lokacije
    leads = sortJobsByDistance(leads, provider.teamLocations);
  } else {
    // Fallback: ako nema tim lokacije, sortiraj po quality score
    leads = leads.sort((a, b) => (b.qualityScore || 0) - (a.qualityScore || 0));
  }

  // Pay-per-contact: Skrij kontakt informacije (kontakt se otključava nakon kupovine + unlock)
  leads = leads.map(lead => {
    const purchase = lead.leadPurchases?.[0];
    // Kontakt je vidljiv samo ako:
    // - Lead je već kupljen I kontakt je otključan
    // Inače je skriven (prije kupovine ili nakon kupovine bez unlock-a)
    const isContactUnlocked = purchase?.contactUnlocked === true;
    
    return {
      ...lead,
      user: {
        ...lead.user,
        email: isContactUnlocked ? lead.user.email : undefined,
        phone: isContactUnlocked ? lead.user.phone : undefined,
        // Dodaj flag da frontend zna je li kontakt otključan
        contactUnlocked: isContactUnlocked,
        purchaseId: purchase?.id || null
      },
      leadPurchases: undefined // Ne vraćamo leadPurchases u response
    };
  });

  return leads;
}

/**
 * Otključaj kontakt za lead (Pay-per-contact model)
 * Naplaćuje 1 kredit za otključavanje kontakta
 */
export async function unlockContact(jobId, providerId) {
  // 1. Provjeri postoji li job
  const job = await prisma.job.findUnique({
    where: { id: jobId },
    include: {
      user: {
        select: {
          fullName: true,
          email: true,
          phone: true,
          city: true,
          clientVerification: true
        }
      },
      category: true
    }
  });

  if (!job) {
    throw new Error('Job not found');
  }

  // 2. Provjeri postoji li LeadPurchase (provider mora prvo kupiti lead)
  let purchase = await prisma.leadPurchase.findFirst({
    where: {
      jobId,
      providerId,
      status: { not: 'REFUNDED' }
    }
  });

  if (!purchase) {
    throw new Error('You must purchase this lead first before unlocking contact');
  }

  // 3. Provjeri je li kontakt već otključan
  if (purchase.contactUnlocked) {
    // Vrati puni lead s kontaktom
    return {
      success: true,
      purchase,
      job,
      message: 'Contact already unlocked'
    };
  }

  // 4. Naplati 1 kredit za otključavanje kontakta
  const unlockCost = 1; // 1 kredit za otključavanje kontakta
  
  try {
    const { balance, transaction } = await deductCredits(
      providerId,
      unlockCost,
      `Unlock contact: ${job.title}`,
      jobId,
      purchase.id
    );

    // 5. Ažuriraj LeadPurchase - označi kontakt kao otključan
    purchase = await prisma.leadPurchase.update({
      where: { id: purchase.id },
      data: {
        contactUnlocked: true,
        contactUnlockedAt: new Date(),
        creditsSpent: purchase.creditsSpent + unlockCost // Dodaj unlock cost na ukupan iznos
      }
    });

    // 6. Ažuriraj ROI statistiku
    await updateProviderROI(providerId, {
      creditsSpent: unlockCost
    });

    console.log(`[LEAD] Provider ${providerId} unlocked contact for lead ${jobId} (cost: ${unlockCost} credits)`);

    return {
      success: true,
      purchase,
      job,
      creditsRemaining: balance,
      message: 'Contact unlocked successfully! You can now contact the client.'
    };

  } catch (error) {
    console.error('[LEAD] Unlock contact failed:', error);
    throw error;
  }
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
          city: true,
          clientVerification: true
        }
      },
          category: true
        }
      }
    },
    orderBy: { createdAt: 'desc' }
  });

  // Pay-per-contact: Skrij kontakt informacije ako nisu otključane
  return purchases.map(purchase => ({
    ...purchase,
    job: {
      ...purchase.job,
      user: {
        ...purchase.job.user,
        email: purchase.contactUnlocked ? purchase.job.user.email : undefined,
        phone: purchase.contactUnlocked ? purchase.job.user.phone : undefined
      }
    }
  }));
}

