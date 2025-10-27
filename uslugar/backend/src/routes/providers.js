import { Router } from 'express';
import { prisma } from '../lib/prisma.js';
import { auth } from '../lib/auth.js';
import { uploadDocument, getImageUrl } from '../lib/upload.js';

const r = Router();

// get current provider profile - MUST be before /:userId route
r.get('/me', auth(true, ['PROVIDER']), async (req, res, next) => {
  try {
    let provider = await prisma.providerProfile.findUnique({
      where: { userId: req.user.id },
      include: {
        user: true,
        categories: true,
        licenses: {
          orderBy: {
            createdAt: 'desc'
          }
        }
      }
    });

    // Ako profil ne postoji, kreiraj ga automatski
    if (!provider) {
      console.log(`🔍 ProviderProfile ne postoji za korisnika: ${req.user.email} (${req.user.id})`);
      
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

      if (!user) {
        console.log(`❌ Korisnik nije pronađen: ${req.user.id}`);
        return res.status(404).json({ error: 'User not found' });
      }

      try {
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
      } catch (createError) {
        console.error(`❌ Greška pri kreiranju ProviderProfile:`, createError);
        return res.status(500).json({ error: 'Failed to create provider profile' });
      }
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

// get provider profile by userId
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

// Upload license document
r.post('/upload-license', auth(true, ['PROVIDER']), uploadDocument.single('file'), async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const { categoryId, docType } = req.body;

    if (!categoryId) {
      return res.status(400).json({ error: 'Category ID is required' });
    }

    // Verify category exists and requires license
    const category = await prisma.category.findUnique({
      where: { id: categoryId }
    });

    if (!category) {
      return res.status(404).json({ error: 'Category not found' });
    }

    if (!category.requiresLicense) {
      return res.status(400).json({ error: 'This category does not require a license' });
    }

    // Get provider profile
    const provider = await prisma.providerProfile.findUnique({
      where: { userId: req.user.id },
      include: { user: true }
    });

    if (!provider) {
      return res.status(404).json({ error: 'Provider profile not found' });
    }

    // Create or update license
    const documentUrl = getImageUrl(req, req.file.filename);

    const licenseData = {
      providerId: provider.id,
      licenseType: category.licenseType || docType || 'Licenca',
      licenseNumber: '',
      issuingAuthority: category.licenseAuthority || 'N/A',
      issuedAt: new Date(),
      documentUrl: documentUrl,
      isVerified: false
    };

    const license = await prisma.providerLicense.create({
      data: licenseData
    });

    // Update approval status to WAITING_FOR_APPROVAL
    await prisma.providerProfile.update({
      where: { userId: req.user.id },
      data: { 
        approvalStatus: 'WAITING_FOR_APPROVAL'
      }
    });

    // Notify admins that a new provider is waiting for approval
    const admins = await prisma.user.findMany({
      where: { role: 'ADMIN' }
    });

    for (const admin of admins) {
      await prisma.notification.create({
        data: {
          title: 'Novi pružatelj čeka odobrenje',
          message: `${provider.user.fullName} (${provider.user.email}) je registrirao lice za kategoriju ${category.name}`,
          type: 'SYSTEM',
          userId: admin.id,
          jobId: null,
          offerId: null
        }
      });
    }

    res.json({
      message: 'License document uploaded successfully. Your license is pending admin approval.',
      url: documentUrl,
      license: {
        id: license.id,
        documentUrl: documentUrl,
        licenseType: license.licenseType,
        isVerified: license.isVerified
      }
    });
  } catch (e) {
    next(e);
  }
});

export default r;