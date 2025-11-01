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
    const job = await prisma.job.findUnique({ 
      where: { id: jobId },
      include: { user: true }
    });
    if (!job || job.status !== 'OPEN') return res.status(400).json({ error: 'Job is not open' });
    
    // PREVENT SELF-ASSIGNMENT: Provider cannot create offer on their own job
    if (job.userId === req.user.id) {
      return res.status(403).json({ 
        error: 'Ne možete poslati ponudu na vlastiti posao',
        message: 'Ista tvrtka/obrt ne može sebi dodjeljivati posao.'
      });
    }
    
    // Additional check: same company by taxId or email
    const providerUser = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: { taxId: true, email: true }
    });
    
    if (providerUser && job.user) {
      // Same taxId - same company
      if (job.user.taxId && providerUser.taxId && job.user.taxId === providerUser.taxId) {
        return res.status(403).json({ 
          error: 'Ne možete poslati ponudu na posao iste tvrtke',
          message: 'Isti OIB ne može sebi dodjeljivati posao.'
        });
      }
      
      // Same email - same user account (even with different role)
      if (job.user.email && providerUser.email && job.user.email === providerUser.email) {
        return res.status(403).json({ 
          error: 'Ne možete poslati ponudu na vlastiti posao',
          message: 'Ista tvrtka/obrt ne može sebi dodjeljivati posao.'
        });
      }
    }
    
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

// Accept an offer
r.patch('/:offerId/accept', auth(true), async (req, res, next) => {
  try {
    const { offerId } = req.params;
    
    // Get offer and job
    const offer = await prisma.offer.findUnique({
      where: { id: offerId },
      include: {
        job: true,
        user: true
      }
    });
    
    if (!offer) {
      return res.status(404).json({ error: 'Offer not found' });
    }
    
    // Check if user owns the job
    if (offer.job.userId !== req.user.id) {
      return res.status(403).json({ error: 'Not authorized' });
    }
    
    // Check if job is still open
    if (offer.job.status !== 'OPEN') {
      return res.status(400).json({ error: 'Job is not open' });
    }
    
    // Check if offer is still pending
    if (offer.status !== 'PENDING') {
      return res.status(400).json({ error: 'Offer already processed' });
    }
    
    // Use transaction to update offer and job status
    const result = await prisma.$transaction(async (tx) => {
      // Update offer to ACCEPTED
      const updatedOffer = await tx.offer.update({
        where: { id: offerId },
        data: { status: 'ACCEPTED' }
      });
      
      // Reject all other offers for this job
      await tx.offer.updateMany({
        where: {
          jobId: offer.jobId,
          id: { not: offerId },
          status: 'PENDING'
        },
        data: { status: 'REJECTED' }
      });
      
      // Update job status to IN_PROGRESS
      const updatedJob = await tx.job.update({
        where: { id: offer.jobId },
        data: { status: 'IN_PROGRESS' }
      });
      
      return { updatedOffer, updatedJob };
    });
    
    // Send notification to provider
    await notifyAcceptedOffer(offer, offer.job);
    
    res.json({
      success: true,
      offer: result.updatedOffer,
      job: result.updatedJob
    });
  } catch (e) { next(e); }
});

// Reject an offer
r.patch('/:offerId/reject', auth(true), async (req, res, next) => {
  try {
    const { offerId } = req.params;
    
    const offer = await prisma.offer.findUnique({
      where: { id: offerId },
      include: { job: true }
    });
    
    if (!offer) {
      return res.status(404).json({ error: 'Offer not found' });
    }
    
    if (offer.job.userId !== req.user.id) {
      return res.status(403).json({ error: 'Not authorized' });
    }
    
    if (offer.status !== 'PENDING') {
      return res.status(400).json({ error: 'Offer already processed' });
    }
    
    const updatedOffer = await prisma.offer.update({
      where: { id: offerId },
      data: { status: 'REJECTED' }
    });
    
    res.json({ success: true, offer: updatedOffer });
  } catch (e) { next(e); }
});

export default r;