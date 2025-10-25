import { Router } from 'express';
import { prisma } from '../lib/prisma.js';
import { auth } from '../lib/auth.js';
import { notifyNewJob, notifyAcceptedOffer } from '../lib/notifications.js';

const r = Router();

// list jobs with filters
r.get('/', async (req, res, next) => {
  try {
    const { q, categoryId, city, latitude, longitude, distance = 50, urgency, jobSize, minBudget, maxBudget } = req.query;
    
    const whereClause = {
      status: 'OPEN',
      ...(categoryId ? { categoryId } : {}),
      ...(city ? { city: { contains: city, mode: 'insensitive' } } : {}),
      ...(urgency ? { urgency } : {}),
      ...(jobSize ? { jobSize } : {}),
      ...(minBudget ? { budgetMax: { gte: parseInt(minBudget) } } : {}),
      ...(maxBudget ? { budgetMin: { lte: parseInt(maxBudget) } } : {}),
      ...(q ? { OR: [{ title: { contains: q, mode: 'insensitive' } }, { description: { contains: q, mode: 'insensitive' } }] } : {})
    };
    
    let jobs = await prisma.job.findMany({
      where: whereClause,
      include: { 
        category: true, 
        offers: {
          include: {
            user: {
              select: { id: true, fullName: true, email: true }
            }
          }
        },
        user: {
          select: { id: true, fullName: true, email: true, phone: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
    
    // Filter by distance if coordinates provided
    if (latitude && longitude) {
      const userLat = parseFloat(latitude);
      const userLon = parseFloat(longitude);
      const maxDistance = parseFloat(distance);
      
      jobs = jobs.filter(job => {
        if (!job.latitude || !job.longitude) return false;
        const R = 6371; // Earth radius in km
        const dLat = (job.latitude - userLat) * Math.PI / 180;
        const dLon = (job.longitude - userLon) * Math.PI / 180;
        const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
                  Math.cos(userLat * Math.PI / 180) * Math.cos(job.latitude * Math.PI / 180) *
                  Math.sin(dLon/2) * Math.sin(dLon/2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
        const dist = R * c;
        job.distance = Math.round(dist * 10) / 10; // Round to 1 decimal
        return dist <= maxDistance;
      }).sort((a, b) => a.distance - b.distance);
    }
    
    res.json(jobs);
  } catch (e) { next(e); }
});

// create job (USER or PROVIDER can create jobs)
r.post('/', auth(true, ['USER', 'PROVIDER']), async (req, res, next) => {
  try {
    const { 
      title, 
      description, 
      categoryId,
      subcategoryId, // Use subcategory if provided, otherwise use category
      projectType,
      customFields,
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
    
    // If subcategory is provided, use it as the categoryId (subcategories are categories with parentId)
    const finalCategoryId = subcategoryId || categoryId;
    
    if (!title || !description || !finalCategoryId) return res.status(400).json({ error: 'Missing fields' });
    
    const job = await prisma.job.create({
      data: {
        title, 
        description, 
        categoryId: finalCategoryId, // Use subcategory if provided
        projectType: projectType || null,
        customFields: customFields || null,
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

// accept offer (USER or PROVIDER can accept offers on their jobs)
r.post('/:jobId/accept/:offerId', auth(true, ['USER', 'PROVIDER']), async (req, res, next) => {
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