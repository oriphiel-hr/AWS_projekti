import { Router } from 'express';
import { prisma } from '../lib/prisma.js';
import { auth } from '../lib/auth.js';
import { notifyNewJob, notifyAcceptedOffer } from '../lib/notifications.js';

const r = Router();

// list jobs with filters
r.get('/', async (req, res, next) => {
  try {
    const { q, categoryId, city } = req.query;
    const jobs = await prisma.job.findMany({
      where: {
        status: 'OPEN',
        ...(categoryId ? { categoryId } : {}),
        ...(city ? { city } : {}),
        ...(q ? { OR: [{ title: { contains: q, mode: 'insensitive' } }, { description: { contains: q, mode: 'insensitive' } }] } : {})
      },
      include: { category: true, offers: true }
    });
    res.json(jobs);
  } catch (e) { next(e); }
});

// create job
r.post('/', auth(true, ['USER']), async (req, res, next) => {
  try {
    const { 
      title, 
      description, 
      categoryId, 
      budgetMin, 
      budgetMax, 
      city, 
      latitude, 
      longitude, 
      urgency = 'NORMAL', 
      jobSize, 
      deadline, 
      images = [] 
    } = req.body;
    
    if (!title || !description || !categoryId) return res.status(400).json({ error: 'Missing fields' });
    
    const job = await prisma.job.create({
      data: {
        title, 
        description, 
        categoryId, 
        budgetMin: budgetMin ? parseInt(budgetMin) : null, 
        budgetMax: budgetMax ? parseInt(budgetMax) : null,
        city: city || null, 
        latitude: latitude ? parseFloat(latitude) : null,
        longitude: longitude ? parseFloat(longitude) : null,
        urgency,
        jobSize,
        deadline: deadline ? new Date(deadline) : null,
        images: Array.isArray(images) ? images : [],
        userId: req.user.id
      }
    });
    
    // Pošalji notifikacije pružateljima u kategoriji
    await notifyNewJob(job, categoryId);
    
    res.status(201).json(job);
  } catch (e) { next(e); }
});

// accept offer
r.post('/:jobId/accept/:offerId', auth(true, ['USER']), async (req, res, next) => {
  try {
    const { jobId, offerId } = req.params;
    const job = await prisma.job.findUnique({ where: { id: jobId } });
    if (!job || job.userId !== req.user.id) return res.status(404).json({ error: 'Job not found' });
    
    const offer = await prisma.offer.findUnique({ where: { id: offerId } });
    if (!offer) return res.status(404).json({ error: 'Offer not found' });
    
    await prisma.offer.update({ where: { id: offerId }, data: { status: 'ACCEPTED' } });
    await prisma.job.update({ where: { id: jobId }, data: { status: 'IN_PROGRESS', acceptedOfferId: offerId } });
    
    // Pošalji notifikaciju pružatelju
    await notifyAcceptedOffer(offer, job);
    
    res.json({ ok: true });
  } catch (e) { next(e); }
});

export default r;