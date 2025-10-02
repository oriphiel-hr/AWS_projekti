import { Router } from 'express';
import { prisma } from '../lib/prisma.js';
import { auth } from '../lib/auth.js';

const r = Router();

r.get("/", async (req, res) => {
  const { categoryId, city } = req.query;
  const providers = await prisma.providerProfile.findMany({
    where: {
      ...(categoryId ? { categories: { some: { id: categoryId } } } : {}),
      ...(city ? { user: { city } } : {})
    },
    include: { user: true, categories: true },
    orderBy: [{ ratingAvg: "desc" }]
  });
  res.json(providers);
});

// get provider profile
r.get('/:userId', async (req, res, next) => {
  try {
    const { userId } = req.params;
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { providerProfile: { include: { categories: true } } }
    });
    if (!user || user.role !== 'PROVIDER') return res.status(404).json({ error: 'Provider not found' });
    // reviews summary
    const reviews = await prisma.review.findMany({ where: { toUserId: userId } });
    res.json({ user, reviews });
  } catch (e) { next(e); }
});

// update provider profile
r.put('/me', auth(true, ['PROVIDER']), async (req, res, next) => {
  try {
    const { bio, serviceArea, categoryIds = [] } = req.body;
    const prof = await prisma.providerProfile.upsert({
      where: { userId: req.user.id },
      create: { userId: req.user.id, bio: bio || '', serviceArea: serviceArea || '' },
      update: {
        bio: bio || undefined,
        serviceArea: serviceArea || undefined,
        categories: { set: [], connect: categoryIds.map(id => ({ id })) }
      }
    });
    res.json(prof);
  } catch (e) { next(e); }
});

export default r;