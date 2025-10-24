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
      // Dohvati korisničke podatke za kreiranje profila
      const user = await prisma.user.findUnique({
        where: { id: req.user.id },
        select: {
          city: true,
          legalStatusId: true,
          taxId: true,
          companyName: true
        }
      });

      provider = await prisma.providerProfile.create({
        data: {
          userId: req.user.id,
          bio: '',
          specialties: [],
          experience: 0,
          website: '',
          serviceArea: user?.city || '',
          legalStatusId: user?.legalStatusId,
          taxId: user?.taxId,
          companyName: user?.companyName,
          isAvailable: true,
          portfolio: null
        },
        include: {
          user: true,
          categories: true
        }
      });
      
      console.log(`✅ Automatski kreiran ProviderProfile za korisnika: ${req.user.email}`);
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

// Fix missing ProviderProfile for current user
r.post('/fix-profile', auth(true, ['PROVIDER', 'ADMIN']), async (req, res, next) => {
  try {
    // Admin može kreirati profil za bilo kojeg korisnika
    const userId = req.user.role === 'ADMIN' && req.body.userId ? req.body.userId : req.user.id;
    
    // Provjeri da li već postoji profil
    const existingProfile = await prisma.providerProfile.findUnique({
      where: { userId },
      include: {
        user: true,
        categories: true
      }
    });

    if (existingProfile) {
      return res.json({ 
        message: 'Provider profil već postoji',
        profile: existingProfile
      });
    }

    // Kreiraj novi profil
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        city: true,
        legalStatusId: true,
        taxId: true,
        companyName: true
      }
    });

    if (!user) {
      return res.status(404).json({ error: 'Korisnik nije pronađen' });
    }

    const newProfile = await prisma.providerProfile.create({
      data: {
        userId: userId,
        bio: '',
        serviceArea: user.city || '',
        legalStatusId: user.legalStatusId,
        taxId: user.taxId,
        companyName: user.companyName,
        specialties: [],
        experience: 0,
        website: '',
        isAvailable: true,
        portfolio: null
      },
      include: {
        user: true,
        categories: true
      }
    });

    res.json({
      message: 'Provider profil uspješno kreiran',
      profile: newProfile
    });
  } catch (e) {
    next(e);
  }
});

// Fix all missing provider profiles (admin endpoint)
r.post('/fix-all-profiles', auth(true, ['ADMIN']), async (req, res, next) => {
  try {
    console.log('🔍 Tražim PROVIDER korisnike bez ProviderProfile...');
    
    // Pronađi sve PROVIDER korisnike koji nemaju ProviderProfile
    const providersWithoutProfile = await prisma.user.findMany({
      where: {
        role: 'PROVIDER',
        providerProfile: null
      },
      select: {
        id: true,
        email: true,
        fullName: true,
        city: true,
        legalStatusId: true,
        taxId: true,
        companyName: true
      }
    });

    console.log(`📊 Pronađeno ${providersWithoutProfile.length} PROVIDER korisnika bez profila`);

    if (providersWithoutProfile.length === 0) {
      return res.json({ 
        message: 'Svi PROVIDER korisnici već imaju profile!',
        created: 0,
        users: []
      });
    }

    const createdProfiles = [];
    const errors = [];

    // Kreiraj ProviderProfile za svakog korisnika
    for (const user of providersWithoutProfile) {
      try {
        console.log(`🔄 Kreiram ProviderProfile za: ${user.email} (${user.fullName})`);
        
        const providerProfile = await prisma.providerProfile.create({
          data: {
            userId: user.id,
            bio: '',
            specialties: [],
            experience: 0,
            website: '',
            serviceArea: user.city || '',
            legalStatusId: user.legalStatusId,
            taxId: user.taxId,
            companyName: user.companyName,
            isAvailable: true,
            portfolio: null
          }
        });

        createdProfiles.push({
          userId: user.id,
          email: user.email,
          fullName: user.fullName
        });

        console.log(`✅ ProviderProfile kreiran za: ${user.email}`);
      } catch (error) {
        console.error(`❌ Greška pri kreiranju profila za ${user.email}:`, error.message);
        errors.push({
          userId: user.id,
          email: user.email,
          error: error.message
        });
      }
    }

    console.log('🎉 Završeno kreiranje ProviderProfile-a za postojeće korisnike!');

    res.json({
      message: `Kreirano ${createdProfiles.length} ProviderProfile-a`,
      created: createdProfiles.length,
      errors: errors.length,
      users: createdProfiles,
      errorDetails: errors
    });

  } catch (e) {
    next(e);
  }
});

export default r;