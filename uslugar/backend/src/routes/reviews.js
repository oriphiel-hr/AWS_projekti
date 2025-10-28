import { Router } from 'express';
import { prisma } from '../lib/prisma.js';
import { auth } from '../lib/auth.js';

const r = Router();

// GET /api/reviews - Lista svih review-a (za admin panel)
r.get('/', auth(true, ['ADMIN']), async (req, res, next) => {
  try {
    const { page = 1, limit = 50, toUserId, fromUserId } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    const where = {};
    if (toUserId) where.toUserId = toUserId;
    if (fromUserId) where.fromUserId = fromUserId;
    
    const [reviews, total] = await Promise.all([
      prisma.review.findMany({
        where,
        include: {
          job: { select: { id: true, title: true } },
          from: { select: { id: true, fullName: true, email: true } },
          to: { select: { id: true, fullName: true, email: true } }
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: parseInt(limit)
      }),
      prisma.review.count({ where })
    ]);
    
    res.json({ reviews, total, page: parseInt(page), limit: parseInt(limit) });
  } catch (e) { next(e); }
});

// GET /api/reviews/user/:userId - Review-i za određenog korisnika
r.get('/user/:userId', async (req, res, next) => {
  try {
    const { userId } = req.params;
    const { page = 1, limit = 20 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    const [reviews, total] = await Promise.all([
      prisma.review.findMany({
        where: { toUserId: userId },
        include: {
          job: { select: { id: true, title: true } },
          from: { select: { id: true, fullName: true, email: true } }
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: parseInt(limit)
      }),
      prisma.review.count({ where: { toUserId: userId } })
    ]);
    
    res.json({ reviews, total, page: parseInt(page), limit: parseInt(limit) });
  } catch (e) { next(e); }
});

// POST /api/reviews - Kreiranje novog review-a
r.post('/', auth(true), async (req, res, next) => {
  try {
    const { toUserId, rating, comment, jobId } = req.body;
    if (!toUserId || !rating || !jobId) {
      return res.status(400).json({ 
        error: 'Missing required fields: toUserId, rating, jobId' 
      });
    }
    
    // Provjeri da li job postoji i da su useri uključeni u transakciju
    const job = await prisma.job.findUnique({
      where: { id: jobId },
      include: {
        user: true,
        assignedProvider: true,
        acceptedOffer: true
      }
    });
    
    if (!job) {
      return res.status(404).json({ error: 'Job not found' });
    }
    
    // Validacija: Provjeri da su korisnici povezani preko job-a
    let isValidReview = false;
    
    if (req.user.role === 'USER') {
      // Korisnik mora biti vlasnik job-a
      if (job.userId === req.user.id && job.assignedProviderId === toUserId) {
        isValidReview = true;
      }
    } else if (req.user.role === 'PROVIDER') {
      // Pružatelj mora biti assignedProvider
      if (job.assignedProviderId === req.user.id && job.userId === toUserId) {
        isValidReview = true;
      }
    }
    
    if (!isValidReview) {
      return res.status(403).json({ 
        error: 'Niste autorizirani da ostavite recenziju za ovog korisnika. Morate biti povezani preko job-a.' 
      });
    }
    
    // Provjeri da li korisnik već ima review za ovaj job
    const existingReview = await prisma.review.findFirst({
      where: { 
        fromUserId: req.user.id, 
        jobId 
      }
    });
    
    if (existingReview) {
      return res.status(400).json({ error: 'Već ste ocijenili ovaj posao' });
    }
    
    const review = await prisma.review.create({
      data: { 
        jobId,
        toUserId, 
        rating: Number(rating), 
        comment: comment || '', 
        fromUserId: req.user.id 
      },
      include: {
        job: {
          select: { id: true, title: true }
        },
        from: { select: { id: true, fullName: true, email: true } },
        to: { select: { id: true, fullName: true, email: true } }
      }
    });

    // Update aggregates - samo za provider profile
    const toUser = await prisma.user.findUnique({ where: { id: toUserId } });
    if (toUser?.role === 'PROVIDER') {
      const aggr = await prisma.review.aggregate({
        where: { toUserId },
        _avg: { rating: true },
        _count: { rating: true }
      });
      await prisma.providerProfile.updateMany({
        where: { userId: toUserId },
        data: { ratingAvg: aggr._avg.rating || 0, ratingCount: aggr._count.rating }
      });
    }

    res.status(201).json(review);
  } catch (e) { 
    console.error('[REVIEWS] Error creating review:', e);
    next(e); 
  }
});

// PUT /api/reviews/:id - Ažuriranje review-a
r.put('/:id', auth(true, ['USER']), async (req, res, next) => {
  try {
    const { id } = req.params;
    const { rating, comment } = req.body;
    
    const review = await prisma.review.findFirst({
      where: { id, fromUserId: req.user.id }
    });
    
    if (!review) {
      return res.status(404).json({ error: 'Review not found or access denied' });
    }
    
    const updatedReview = await prisma.review.update({
      where: { id },
      data: { rating: Number(rating), comment: comment || '' },
      include: {
        from: { select: { id: true, fullName: true, email: true } },
        to: { select: { id: true, fullName: true, email: true } }
      }
    });

    // update aggregates
    const aggr = await prisma.review.aggregate({
      where: { toUserId: review.toUserId },
      _avg: { rating: true },
      _count: { rating: true }
    });
    await prisma.providerProfile.updateMany({
      where: { userId: review.toUserId },
      data: { ratingAvg: aggr._avg.rating || 0, ratingCount: aggr._count.rating }
    });

    res.json(updatedReview);
  } catch (e) { next(e); }
});

// DELETE /api/reviews/:id - Brisanje review-a
r.delete('/:id', auth(true, ['USER', 'ADMIN']), async (req, res, next) => {
  try {
    const { id } = req.params;
    
    const review = await prisma.review.findFirst({
      where: { 
        id, 
        ...(req.user.role !== 'ADMIN' ? { fromUserId: req.user.id } : {})
      }
    });
    
    if (!review) {
      return res.status(404).json({ error: 'Review not found or access denied' });
    }
    
    await prisma.review.delete({ where: { id } });

    // update aggregates
    const aggr = await prisma.review.aggregate({
      where: { toUserId: review.toUserId },
      _avg: { rating: true },
      _count: { rating: true }
    });
    await prisma.providerProfile.updateMany({
      where: { userId: review.toUserId },
      data: { ratingAvg: aggr._avg.rating || 0, ratingCount: aggr._count.rating }
    });

    res.status(204).send();
  } catch (e) { next(e); }
});

export default r;