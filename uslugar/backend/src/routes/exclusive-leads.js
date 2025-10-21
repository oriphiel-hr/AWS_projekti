// USLUGAR EXCLUSIVE - Rute za ekskluzivne leadove
import { Router } from 'express';
import { auth } from '../lib/auth.js';
import {
  purchaseLead,
  markLeadContacted,
  markLeadConverted,
  refundLead,
  getAvailableLeads,
  getMyLeads
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

// Kupi ekskluzivan lead
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

// Zatraži refund za lead
r.post('/purchases/:purchaseId/refund', auth(true, ['PROVIDER']), async (req, res, next) => {
  try {
    const { purchaseId } = req.params;
    const { reason } = req.body;
    
    const updated = await refundLead(purchaseId, req.user.id, reason || 'Client unresponsive');
    
    res.json({
      success: true,
      purchase: updated,
      message: 'Credits refunded successfully'
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

export default r;

