import { Router } from 'express';
import { prisma } from '../lib/prisma.js';
import { auth } from '../lib/auth.js';

const r = Router();

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

// get current provider profile
r.get('/me', auth(true, ['PROVIDER']), async (req, res, next) => {
  try {
    let provider = await prisma.providerProfile.findUnique({
      where: { userId: req.user.id },
      include: {
        user: true,
        categories: true
      }
    });

    // Ako profil ne postoji, kreiraj ga automatski
    if (!provider) {
      provider = await prisma.providerProfile.create({
        data: {
          userId: req.user.id,
          bio: '',
          specialties: [],
          experience: 0,
          website: '',
          serviceArea: '',
          isAvailable: true,
          portfolio: ''
        },
        include: {
          user: true,
          categories: true
        }
      });
    }

    // reviews summary
    const reviews = await prisma.review.findMany({
      where: { toUserId: req.user.id }
    });

    const ratingAvg = reviews.length > 0
      ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
      : 0;

    res.json({
      ...provider,
      ratingAvg,
      ratingCount: reviews.length
    });
  } catch (e) {
    next(e);
  }
});

// update provider profile
r.put('/me', auth(true, ['PROVIDER']), async (req, res, next) => {
  try {
    const { 
      bio, 
      serviceArea, 
      categoryIds = [], 
      specialties = [], 
      experience, 
      website, 
      isAvailable = true,
      portfolio 
    } = req.body;
    
    // VALIDACIJA: Kategorije su obavezne za pružatelje
    if (categoryIds.length === 0) {
      return res.status(400).json({ 
        error: 'Morate odabrati minimalno 1 kategoriju usluga kojima se bavite.',
        details: 'Kategorije su obavezne za pružatelje usluga kako bi klijenti mogli pronaći vaše usluge.'
      });
    }
    
    // VALIDACIJA: Provjeri da li kategorije postoje
    const existingCategories = await prisma.category.findMany({
      where: { id: { in: categoryIds } }
    });
    
    if (existingCategories.length !== categoryIds.length) {
      return res.status(400).json({ 
        error: 'Neke od odabranih kategorija ne postoje.',
        details: 'Molimo provjerite da li su sve kategorije valjane.'
      });
    }
    
    const prof = await prisma.providerProfile.upsert({
      where: { userId: req.user.id },
      create: { 
        userId: req.user.id, 
        bio: bio || '', 
        serviceArea: serviceArea || '',
        specialties: Array.isArray(specialties) ? specialties : [],
        experience: experience ? parseInt(experience) : null,
        website: website || null,
        isAvailable: Boolean(isAvailable),
        portfolio: portfolio || null
      },
      update: {
        bio: bio || undefined,
        serviceArea: serviceArea || undefined,
        specialties: Array.isArray(specialties) ? specialties : undefined,
        experience: experience ? parseInt(experience) : undefined,
        website: website || undefined,
        isAvailable: isAvailable !== undefined ? Boolean(isAvailable) : undefined,
        portfolio: portfolio || undefined,
        categories: { set: [], connect: categoryIds.map(id => ({ id })) }
      }
    });
    res.json(prof);
  } catch (e) { next(e); }
});

export default r;