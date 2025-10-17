import { Router } from 'express';
import { prisma } from '../lib/prisma.js';
import { auth } from '../lib/auth.js';
import { notifyNewOffer, notifyAcceptedOffer } from '../lib/notifications.js';
import { deductCredit } from './subscriptions.js';

const r = Router();

// create offer
r.post('/', auth(true, ['PROVIDER']), async (req, res, next) => {
  try {
    const { jobId, amount, message, isNegotiable = true, estimatedDays } = req.body;
    if (!jobId || !amount) return res.status(400).json({ error: 'Missing fields' });
    const job = await prisma.job.findUnique({ where: { id: jobId } });
    if (!job || job.status !== 'OPEN') return res.status(400).json({ error: 'Job is not open' });
    
    // Check subscription and credits
    const subscription = await prisma.subscription.findUnique({
      where: { userId: req.user.id }
    });
    
    if (subscription && subscription.credits !== -1 && subscription.credits <= 0) {
      return res.status(403).json({ 
        error: 'Insufficient credits', 
        message: 'Nemate dovoljno kredita za slanje ponude. Nadogradite svoju pretplatu.' 
      });
    }
    
    const offer = await prisma.offer.create({ 
      data: { 
        jobId, 
        amount: parseInt(amount), 
        message: message || '', 
        userId: req.user.id,
        isNegotiable,
        estimatedDays: estimatedDays ? parseInt(estimatedDays) : null
      } 
    });
    
    // Deduct credit
    await deductCredit(req.user.id);
    
    // Pošalji notifikaciju vlasniku posla
    await notifyNewOffer(offer, job);
    
    res.status(201).json(offer);
  } catch (e) { next(e); }
});

// list offers for a job (owner or provider self)
r.get('/job/:jobId', auth(true), async (req, res, next) => {
  try {
    const { jobId } = req.params;
    const offers = await prisma.offer.findMany({ where: { jobId }, include: { user: true } });
    res.json(offers);
  } catch (e) { next(e); }
});

export default r;