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
r.post('/', auth(true, ['USER']), async (req, res, next) => {
  try {
    const { toUserId, rating, comment } = req.body;
    if (!toUserId || !rating) return res.status(400).json({ error: 'Missing fields' });
    
    // Provjeri da li korisnik već ima review za ovog providera
    const existingReview = await prisma.review.findFirst({
      where: { fromUserId: req.user.id, toUserId }
    });
    
    if (existingReview) {
      return res.status(400).json({ error: 'Već ste ocijenili ovog izvođača radova' });
    }
    
    const review = await prisma.review.create({
      data: { 
        toUserId, 
        rating: Number(rating), 
        comment: comment || '', 
        fromUserId: req.user.id 
      },
      include: {
        from: { select: { id: true, fullName: true, email: true } },
        to: { select: { id: true, fullName: true, email: true } }
      }
    });

    // update aggregates
    const aggr = await prisma.review.aggregate({
      where: { toUserId },
      _avg: { rating: true },
      _count: { rating: true }
    });
    await prisma.providerProfile.updateMany({
      where: { userId: toUserId },
      data: { ratingAvg: aggr._avg.rating || 0, ratingCount: aggr._count.rating }
    });

    res.status(201).json(review);
  } catch (e) { next(e); }
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