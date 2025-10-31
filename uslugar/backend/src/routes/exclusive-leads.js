// USLUGAR EXCLUSIVE - Rute za ekskluzivne leadove
import { Router } from 'express';
import { auth } from '../lib/auth.js';
import { requirePlan } from '../lib/subscription-auth.js';
import {
  purchaseLead,
  markLeadContacted,
  markLeadConverted,
  refundLead,
  getAvailableLeads,
  getMyLeads,
  unlockContact
} from '../services/lead-service.js';
import {
  getCreditsBalance,
  getCreditHistory,
  addCredits
} from '../services/credit-service.js';

const r = Router();

// ============================================================
// LEADOVI - Pregled i kupovina
// ============================================================

// Dohvati dostupne ekskluzivne leadove za providera
r.get('/available', auth(true, ['PROVIDER']), async (req, res, next) => {
  try {
    const { city, categoryId, minBudget, maxBudget } = req.query;
    
    const filters = {};
    if (city) filters.city = city;
    if (categoryId) filters.categoryId = categoryId;
    if (minBudget) filters.budgetMin = { gte: parseInt(minBudget) };
    if (maxBudget) filters.budgetMax = { lte: parseInt(maxBudget) };
    
    const leads = await getAvailableLeads(req.user.id, filters);
    
    res.json({
      total: leads.length,
      leads
    });
  } catch (e) {
    next(e);
  }
});

// Kupi ekskluzivan lead (pay-per-contact: NE otključava kontakt)
r.post('/:jobId/purchase', auth(true, ['PROVIDER']), async (req, res, next) => {
  try {
    const { jobId } = req.params;
    const providerId = req.user.id;
    
    const result = await purchaseLead(jobId, providerId);
    
    res.status(201).json(result);
  } catch (e) {
    const status = e.message.includes('Insufficient credits') ? 402 :
                   e.message.includes('not available') ? 410 :
                   e.message.includes('already') ? 409 : 400;
    res.status(status).json({ error: e.message });
  }
});

// Otključaj kontakt za kupljeni lead (Pay-per-contact: naplaćuje 1 kredit)
r.post('/:jobId/unlock-contact', auth(true, ['PROVIDER']), async (req, res, next) => {
  try {
    const { jobId } = req.params;
    const providerId = req.user.id;
    
    const result = await unlockContact(jobId, providerId);
    
    res.json(result);
  } catch (e) {
    const status = e.message.includes('Insufficient credits') ? 402 :
                   e.message.includes('must purchase') ? 400 :
                   e.message.includes('not found') ? 404 : 400;
    res.status(status).json({ error: e.message });
  }
});

// Dohvati moje kupljene leadove
r.get('/my-leads', auth(true, ['PROVIDER']), async (req, res, next) => {
  try {
    const { status } = req.query;
    const leads = await getMyLeads(req.user.id, status || null);
    
    res.json({
      total: leads.length,
      leads
    });
  } catch (e) {
    next(e);
  }
});

// Označi lead kao kontaktiran
r.post('/purchases/:purchaseId/contacted', auth(true, ['PROVIDER']), async (req, res, next) => {
  try {
    const { purchaseId } = req.params;
    const updated = await markLeadContacted(purchaseId, req.user.id);
    
    res.json({
      success: true,
      purchase: updated,
      message: 'Lead marked as contacted'
    });
  } catch (e) {
    next(e);
  }
});

// Označi lead kao konvertiran
r.post('/purchases/:purchaseId/converted', auth(true, ['PROVIDER']), async (req, res, next) => {
  try {
    const { purchaseId } = req.params;
    const { revenue } = req.body; // Prihod od posla (opcionalno)
    
    const updated = await markLeadConverted(purchaseId, req.user.id, revenue || 0);
    
    res.json({
      success: true,
      purchase: updated,
      message: 'Congratulations! Lead converted to job.'
    });
  } catch (e) {
    next(e);
  }
});

// Zatraži povrat za lead (Request Refund)
// PRAVNO: Platforma ne provodi povrate sredstava samostalno.
// Povrati se provode putem ovlaštene platne institucije u skladu s PSD2 pravilima.
r.post('/purchases/:purchaseId/refund', auth(true, ['PROVIDER']), async (req, res, next) => {
  try {
    const { purchaseId } = req.params;
    const { reason } = req.body;
    
    const updated = await refundLead(purchaseId, req.user.id, reason || 'Client unresponsive');
    
    res.json({
      success: true,
      purchase: updated,
      message: 'Zahtjev za povrat je poslan. Povrati se provode putem ovlaštene platne institucije (Stripe Payments Europe Ltd.) u skladu s PSD2 pravilima. Krediti će biti vraćeni u skladu s pravilima pružatelja usluga plaćanja.'
    });
  } catch (e) {
    next(e);
  }
});

// ============================================================
// KREDITI - Upravljanje kreditima
// ============================================================

// Dohvati trenutni balans kredita
r.get('/credits/balance', auth(true, ['PROVIDER']), async (req, res, next) => {
  try {
    const balance = await getCreditsBalance(req.user.id);
    res.json(balance);
  } catch (e) {
    next(e);
  }
});

// Dohvati povijest transakcija
r.get('/credits/history', auth(true, ['PROVIDER']), async (req, res, next) => {
  try {
    const { limit } = req.query;
    const history = await getCreditHistory(req.user.id, limit ? parseInt(limit) : 50);
    
    res.json({
      total: history.length,
      transactions: history
    });
  } catch (e) {
    next(e);
  }
});

// Kupi kredite (pay-per-credit) - ADMIN ili PAYMENT GATEWAY
r.post('/credits/purchase', auth(true, ['PROVIDER']), async (req, res, next) => {
  try {
    const { amount, paymentIntentId } = req.body;
    
    if (!amount || amount < 1 || amount > 100) {
      return res.status(400).json({ error: 'Invalid amount. Must be between 1 and 100 credits.' });
    }
    
    // TODO: Integracija sa Stripe/CorvusPay payment gateway
    // Za sada simuliram uspješnu uplatu
    
    const result = await addCredits(
      req.user.id,
      amount,
      'PURCHASE',
      `Purchased ${amount} credits`,
      null
    );
    
    res.json({
      success: true,
      creditsAdded: amount,
      newBalance: result.balance,
      message: `Successfully purchased ${amount} credits`
    });
  } catch (e) {
    next(e);
  }
});

// ============================================================
// EXPORT - CSV Export za leadove
// ============================================================

// Export mojih leadova u CSV (PREMIUM/PRO feature)
r.get('/export/my-leads', auth(true, ['PROVIDER']), requirePlan('PREMIUM'), async (req, res, next) => {
  try {
    const leads = await getMyLeads(req.user.id, null);
    
    // Generiraj CSV
    const csvHeader = 'ID,Naziv,Kategorija,Grad,Budžet,Status,Kontaktirano,Konvertirano,Refundirano,Cijena,Potrošeno kredita,Created At\n';
    const csvRows = leads.map(p => {
      const job = p.job || {};
      const user = (job.user || {});
      return [
        p.id,
        `"${job.title || ''}"`,
        `"${(job.category || {}).name || ''}"`,
        `"${job.city || ''}"`,
        `${job.budgetMin || 0}-${job.budgetMax || 0} EUR`,
        p.status,
        p.contactedAt ? new Date(p.contactedAt).toISOString() : '',
        p.convertedAt ? new Date(p.convertedAt).toISOString() : '',
        p.refundedAt ? new Date(p.refundedAt).toISOString() : '',
        `${p.leadPrice} credits`,
        p.creditsSpent,
        new Date(p.createdAt).toISOString()
      ].join(',');
    }).join('\n');
    
    const csv = csvHeader + csvRows;
    
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="my-leads.csv"');
    res.send(csv);
  } catch (e) {
    next(e);
  }
});

// Export kreditnih transakcija u CSV (PREMIUM/PRO feature)
r.get('/export/credits-history', auth(true, ['PROVIDER']), requirePlan('PREMIUM'), async (req, res, next) => {
  try {
    const history = await getCreditHistory(req.user.id, 1000);
    
    const csvHeader = 'ID,Type,Amount,Balance,Description,Related Job,Related Purchase,Created At\n';
    const csvRows = history.map(t => [
      t.id,
      t.type,
      t.amount,
      t.balance,
      `"${t.description || ''}"`,
      t.relatedJobId || '',
      t.relatedPurchaseId || '',
      new Date(t.createdAt).toISOString()
    ].join(',')).join('\n');
    
    const csv = csvHeader + csvRows;
    
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="credit-history.csv"');
    res.send(csv);
  } catch (e) {
    next(e);
  }
});

export default r;

