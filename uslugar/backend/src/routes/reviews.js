import { Router } from 'express';
import { prisma } from '../lib/prisma.js';
import { auth } from '../lib/auth.js';

const r = Router();

r.post('/', auth(true, ['USER']), async (req, res, next) => {
  try {
    const { toUserId, rating, comment } = req.body;
    if (!toUserId || !rating) return res.status(400).json({ error: 'Missing fields' });
    const review = await prisma.review.create({
      data: { toUserId, rating: Number(rating), comment: comment || '', fromUserId: req.user.id }
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

export default r;