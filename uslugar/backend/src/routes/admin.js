import { Router } from 'express';
import { prisma } from '../lib/prisma.js';
import { auth } from '../lib/auth.js';
import { deleteUserWithRelations } from '../lib/delete-helpers.js';

const r = Router();

// KYC Metrike - Admin Dashboard
r.get('/kyc-metrics', auth(true, ['ADMIN']), async (req, res, next) => {
  try {
    // Total registrations
    const totalRegistrations = await prisma.user.count({
      where: { role: 'PROVIDER' }
    });
    
    // Verified providers
    const verifiedProviders = await prisma.providerProfile.count({
      where: { kycVerified: true }
    });
    
    // Document uploaded (not yet verified)
    const withDocument = await prisma.providerProfile.count({
      where: { kycDocumentUrl: { not: null }, kycVerified: false }
    });
    
    // Never verified
    const neverVerified = totalRegistrations - verifiedProviders - withDocument;
    
    // By legal status
    const byStatus = await prisma.$queryRaw`
      SELECT ls.code, ls.name, COUNT(pp.id) as count
      FROM "ProviderProfile" pp
      JOIN "User" u ON pp."userId" = u."id"
      LEFT JOIN "LegalStatus" ls ON u."legalStatusId" = ls."id"
      WHERE u."role" = 'PROVIDER'
      GROUP BY ls.code, ls.name
      ORDER BY count DESC
    `;
    
    // Avg verification time
    const avgTime = await prisma.$queryRaw`
      SELECT AVG(EXTRACT(EPOCH FROM ("kycVerifiedAt" - "createdAt")) / 60) as avg_minutes
      FROM "ProviderProfile"
      WHERE "kycVerifiedAt" IS NOT NULL
    `;
    
    // Helper function to convert BigInt to Number
    const toNumber = (val) => typeof val === 'bigint' ? Number(val) : val;
    
    const metrics = {
      total: totalRegistrations,
      verified: verifiedProviders,
      pendingDocument: withDocument,
      neverVerified,
      verificationRate: totalRegistrations > 0 
        ? ((verifiedProviders / totalRegistrations) * 100).toFixed(1) + '%'
        : '0%',
      byStatus: byStatus.map(item => ({
        code: item.code,
        name: item.name,
        count: toNumber(item.count)
      })),
      avgVerificationMinutes: avgTime[0]?.avg_minutes 
        ? toNumber(avgTime[0].avg_minutes).toFixed(0) 
        : 'N/A'
    };
    
    res.json(metrics);
  } catch (err) {
    next(err);
  }
});

// Admin cleanup: delete non-master data, preserve ADMIN user and master tables
r.post('/cleanup/non-master', auth(true, ['ADMIN']), async (req, res, next) => {
  try {
    // Optional: preserveEmails array to keep certain users
    const { preserveEmails = [] } = req.body || {};

    const result = { deleted: {} };

    // 1) Delete chat messages and rooms first
    result.deleted.chatMessages = await prisma.chatMessage.deleteMany({});
    result.deleted.chatRooms = await prisma.chatRoom.deleteMany({});

    // 2) Reviews, Notifications
    result.deleted.reviews = await prisma.review.deleteMany({});
    result.deleted.notifications = await prisma.notification.deleteMany({});

    // 3) Offers, Jobs
    result.deleted.offers = await prisma.offer.deleteMany({});
    result.deleted.jobs = await prisma.job.deleteMany({});

    // 4) Subscriptions
    result.deleted.subscriptions = await prisma.subscription.deleteMany({});

    // 5) Provider profiles (disconnect categories per profile to clear m2m)
    const providers = await prisma.providerProfile.findMany({ select: { id: true, userId: true } });
    for (const p of providers) {
      await prisma.providerProfile.update({
        where: { id: p.id },
        data: { categories: { set: [] } }
      });
    }
    result.deleted.providerProfiles = await prisma.providerProfile.deleteMany({});

    // 6) WhiteLabel settings (if any)
    if (prisma.whiteLabel) {
      result.deleted.whiteLabels = await prisma.whiteLabel.deleteMany({});
    }

    // 7) Users except ADMIN and optionally preserved emails
    // Use delete helpers if needed per-user for safety; but relations already deleted above
    const usersToDelete = await prisma.user.findMany({
      where: {
        role: { not: 'ADMIN' },
        email: preserveEmails.length ? { notIn: preserveEmails } : undefined
      },
      select: { id: true }
    });

    let usersDeleted = 0;
    for (const u of usersToDelete) {
      // direct delete is safe as relations are already removed
      await prisma.user.delete({ where: { id: u.id } });
      usersDeleted++;
    }
    result.deleted.users = { count: usersDeleted };

    // IMPORTANT: Preserve testing data
    // Do NOT delete TestPlan/TestItem/TestRun/TestRunItem (explicitly ensured by not touching them here)
    // Note: Master data preserved: Category, SubscriptionPlan, LegalStatus, ADMIN user, and all Testing models
    res.json({ success: true, ...result });
  } catch (e) {
    next(e);
  }
});

// Dodaj nedostajuće kategorije - potpuno javni endpoint (MUST be before generic routes)
r.post('/add-categories', async (req, res, next) => {
  try {
    console.log('🌱 Pokretanje seed-a kategorija...');
    
    const categories = [
      // 🏗️ GRAĐEVINSKE USLUGE
      { name: "Građevina", description: "Opći građevinski radovi, renovacije, adaptacije", icon: "🏗️", nkdCode: "41.20", requiresLicense: true, licenseType: "Građevinska licenca", licenseAuthority: "Hrvatska komora inženjera građevinarstva" },
      { name: "Građevinski nadzor", description: "Nadzor nad izvođenjem građevinskih radova", icon: "👷", nkdCode: "71.12", requiresLicense: true, licenseType: "Licenca građevinskog nadzora", licenseAuthority: "Hrvatska komora inženjera građevinarstva" },
      { name: "Geodetske usluge", description: "Mjerenja, izrada geodetskih elaborata", icon: "📐", nkdCode: "71.12", requiresLicense: true, licenseType: "Geodetska licenca", licenseAuthority: "Hrvatska komora inženjera geodezije" },
      { name: "Energetski certifikati", description: "Izdavanje energetskih certifikata za zgrade", icon: "⚡", nkdCode: "71.12", requiresLicense: true, licenseType: "Licenca energetskog certifikata", licenseAuthority: "Hrvatska energetska agencija" },
      { name: "Legalizacija objekata", description: "Pomoć pri legalizaciji bespravno sagrađenih objekata", icon: "📋", nkdCode: "71.12", requiresLicense: false },

      // 🎨 DIZAJN I INTERIJER
      { name: "Dizajn interijera", description: "Uređenje i dizajn unutarnjih prostora", icon: "🎨", nkdCode: "74.10", requiresLicense: false },
      { name: "Arhitektonske usluge", description: "Projektiranje, izrada arhitektonskih planova", icon: "🏛️", nkdCode: "71.11", requiresLicense: true, licenseType: "Arhitektonska licenca", licenseAuthority: "Hrvatska komora arhitekata" },
      { name: "Landscape dizajn", description: "Uređenje vanjskih prostora, vrtovi", icon: "🌳", nkdCode: "71.12", requiresLicense: false },

      // 🔌 INSTALACIJE
      { name: "Električar", description: "Električne instalacije, popravak električnih uređaja", icon: "⚡", nkdCode: "43.21", requiresLicense: true, licenseType: "Elektrotehnička licenca", licenseAuthority: "Hrvatska komora inženjera elektrotehnike" },
      { name: "Vodoinstalater", description: "Vodovodne instalacije, popravak cijevi", icon: "🚿", nkdCode: "43.22", requiresLicense: true, licenseType: "Licenca za vodovodne instalacije", licenseAuthority: "Hrvatska komora inženjera građevinarstva" },
      { name: "Solarni sustavi", description: "Ugradnja solarnih panela i sustava", icon: "☀️", nkdCode: "43.21", requiresLicense: true, licenseType: "Elektrotehnička licenca", licenseAuthority: "Hrvatska komora inženjera elektrotehnike" },

      // 🎨 ZANATI
      { name: "Soboslikarstvo", description: "Soboslikarski radovi, bojanje zidova", icon: "🎨", nkdCode: "43.30", requiresLicense: false },
      { name: "Keramičar", description: "Položba keramike, pločica", icon: "🧱", nkdCode: "43.30", requiresLicense: false },

      // 💻 IT I DIGITALNE USLUGE
      { name: "IT usluge", description: "Općenite IT usluge, održavanje računala", icon: "💻", nkdCode: "62.01", requiresLicense: false },
      { name: "Web dizajn", description: "Izrada i dizajn web stranica", icon: "🌐", nkdCode: "62.01", requiresLicense: false },
      { name: "SEO usluge", description: "Optimizacija web stranica za pretraživače", icon: "🔍", nkdCode: "62.01", requiresLicense: false },
      { name: "Digitalni marketing", description: "Online marketing, društvene mreže", icon: "📱", nkdCode: "73.11", requiresLicense: false },
      { name: "E-commerce", description: "Izrada online trgovina", icon: "🛒", nkdCode: "62.01", requiresLicense: false },

      // 📸 MEDIJSKE USLUGE
      { name: "Fotografija", description: "Profesionalno fotografiranje za različite potrebe", icon: "📸", nkdCode: "74.20", requiresLicense: false },
      { name: "Drone snimanje", description: "Zračno snimanje dronovima", icon: "🚁", nkdCode: "74.20", requiresLicense: false },
      { name: "3D vizualizacija", description: "3D modeli, renderi, vizualizacije", icon: "🎬", nkdCode: "74.20", requiresLicense: false },

      // 🚚 LOGISTIKA I TRANSPORT
      { name: "Prijevoz", description: "Općenite prijevozne usluge", icon: "🚚", nkdCode: "49.41", requiresLicense: true, licenseType: "Licenca za prijevoz", licenseAuthority: "Ministarstvo mora, prometa i infrastrukture" },
      { name: "Dostava", description: "Dostava paketa, hrane, pošiljki", icon: "📦", nkdCode: "53.20", requiresLicense: false },
      { name: "Selidbe", description: "Usluge selidbe, premještanje namještaja", icon: "📦", nkdCode: "49.41", requiresLicense: false },
      { name: "Prijevoz putnika", description: "Taxi, prijevoz putnika", icon: "🚕", nkdCode: "49.32", requiresLicense: true, licenseType: "Licenca za prijevoz putnika", licenseAuthority: "Ministarstvo mora, prometa i infrastrukture" },

      // 🧹 ČIŠĆENJE I ODRŽAVANJE
      { name: "Čišćenje", description: "Općenite usluge čišćenja", icon: "🧹", nkdCode: "81.21", requiresLicense: false },
      { name: "Čišćenje kućanstva", description: "Čišćenje domova, stanova", icon: "🏠", nkdCode: "81.21", requiresLicense: false },
      { name: "Čišćenje ureda", description: "Čišćenje poslovnih prostora", icon: "🏢", nkdCode: "81.21", requiresLicense: false },
      { name: "Čišćenje nakon gradnje", description: "Čišćenje nakon građevinskih radova", icon: "🏗️", nkdCode: "81.21", requiresLicense: false },

      // 🏥 ZDRAVLJE I LJEPOTA
      { name: "Fizioterapija", description: "Fizioterapijske usluge, rehabilitacija", icon: "🏥", nkdCode: "86.90", requiresLicense: true, licenseType: "Licenca fizioterapeuta", licenseAuthority: "Hrvatska komora fizioterapeuta" },
      { name: "Masage", description: "Opuštajuće i terapeutske masaže", icon: "💆", nkdCode: "96.09", requiresLicense: false },
      { name: "Kozmetika", description: "Kozmetičke usluge, njega lica", icon: "💄", nkdCode: "96.02", requiresLicense: false },
      { name: "Manikura/Pedikura", description: "Njega noktiju ruku i nogu", icon: "💅", nkdCode: "96.02", requiresLicense: false },

      // 🎓 OBRAZOVANJE
      { name: "Instrukcije", description: "Poduka učenika, instrukcije", icon: "📚", nkdCode: "85.59", requiresLicense: false },
      { name: "Jezici", description: "Učenje stranih jezika", icon: "🗣️", nkdCode: "85.59", requiresLicense: false },
      { name: "Muzika", description: "Glazbena nastava, poduka", icon: "🎵", nkdCode: "85.59", requiresLicense: false },

      // ⚖️ PRAVNE I FINANCIJSKE USLUGE
      { name: "Pravo", description: "Općenite pravne usluge", icon: "⚖️", nkdCode: "69.10", requiresLicense: true, licenseType: "Odvjetnička licenca", licenseAuthority: "Hrvatska odvjetnička komora" },
      { name: "Računovodstvo", description: "Knjigovodstvo, računovodstvene usluge", icon: "📊", nkdCode: "69.20", requiresLicense: false },
      { name: "Osiguranje", description: "Osiguravajuće usluge", icon: "🛡️", nkdCode: "65.20", requiresLicense: true, licenseType: "Licenca osiguravajućeg agenta", licenseAuthority: "Hrvatska agencija za nadzor financijskih usluga" },

      // 🌱 EKOLOGIJA I ODRŽIVOST
      { name: "Energetska učinkovitost", description: "Energetski pregledi, optimizacija potrošnje", icon: "🌱", nkdCode: "71.12", requiresLicense: true, licenseType: "Licenca energetskog savjetnika", licenseAuthority: "Hrvatska energetska agencija" },
      { name: "Recikliranje", description: "Usluge recikliranja, odvoz otpada", icon: "♻️", nkdCode: "38.11", requiresLicense: false },

      // 🏠 DOMAĆI RADOVI
      { name: "Popravak kućanskih aparata", description: "Popravak perilica, sušilica, frižidera", icon: "🔧", nkdCode: "95.21", requiresLicense: false },
      { name: "Montaža namještaja", description: "Montaža namještaja, sklapanje", icon: "🪑", nkdCode: "43.30", requiresLicense: false },
      { name: "Montaža klima uređaja", description: "Ugradnja i servis klima uređaja", icon: "❄️", nkdCode: "43.22", requiresLicense: true, licenseType: "Licenca za klimatizaciju", licenseAuthority: "Hrvatska komora inženjera građevinarstva" }
    ];

    let addedCount = 0;
    let updatedCount = 0;
    
    for (const categoryData of categories) {
      try {
        const existing = await prisma.category.findUnique({
          where: { name: categoryData.name }
        });
        
        if (existing) {
          // Ažuriraj postojeću kategoriju s novim podacima
          await prisma.category.update({
            where: { name: categoryData.name },
            data: {
              description: categoryData.description,
              icon: categoryData.icon,
              nkdCode: categoryData.nkdCode,
              requiresLicense: categoryData.requiresLicense,
              licenseType: categoryData.licenseType,
              licenseAuthority: categoryData.licenseAuthority,
              isActive: true
            }
          });
          updatedCount++;
          console.log(`✅ Ažurirana: ${categoryData.name}`);
        } else {
          // Kreiraj novu kategoriju
          await prisma.category.create({
            data: {
              name: categoryData.name,
              description: categoryData.description,
              icon: categoryData.icon,
              nkdCode: categoryData.nkdCode,
              requiresLicense: categoryData.requiresLicense,
              licenseType: categoryData.licenseType,
              licenseAuthority: categoryData.licenseAuthority,
              isActive: true
            }
          });
          addedCount++;
          console.log(`➕ Dodana: ${categoryData.name}`);
        }
      } catch (error) {
        console.error(`❌ Greška za ${categoryData.name}:`, error.message);
      }
    }
    
    const totalCount = addedCount + updatedCount;
    
    console.log(`\n📊 REZULTAT:`);
    console.log(`➕ Dodano: ${addedCount} kategorija`);
    console.log(`✅ Ažurirano: ${updatedCount} kategorija`);
    console.log(`📋 Ukupno: ${totalCount} kategorija`);
    
    res.json({
      success: true,
      addedCount,
      updatedCount,
      totalCount,
      message: `Uspješno dodano ${addedCount} i ažurirano ${updatedCount} kategorija`
    });
    
  } catch (e) {
    console.error('❌ Greška pri seed-u kategorija:', e);
    next(e);
  }
});

// Verify license - Admin endpoint
r.patch('/licenses/:licenseId/verify', auth(true, ['ADMIN']), async (req, res, next) => {
  try {
    const { licenseId } = req.params;
    const { isVerified, notes } = req.body;

    // Get license
    const license = await prisma.providerLicense.findUnique({
      where: { id: licenseId },
      include: {
        provider: {
          include: {
            user: true
          }
        }
      }
    });

    if (!license) {
      return res.status(404).json({ error: 'License not found' });
    }

    // Update license
    const updatedLicense = await prisma.providerLicense.update({
      where: { id: licenseId },
      data: {
        isVerified: isVerified !== undefined ? Boolean(isVerified) : true,
        verifiedAt: isVerified !== undefined && Boolean(isVerified) ? new Date() : null,
        verifiedBy: isVerified !== undefined && Boolean(isVerified) ? req.user.id : null,
        notes: notes || undefined
      },
      include: {
        provider: {
          include: {
            user: {
              select: {
                id: true,
                email: true,
                fullName: true
              }
            }
          }
        }
      }
    });

    res.json({
      message: isVerified ? 'License verified successfully' : 'License verification removed',
      license: updatedLicense
    });
  } catch (e) {
    next(e);
  }
});

// Get all licenses (Admin)
r.get('/licenses', auth(true, ['ADMIN']), async (req, res, next) => {
  try {
    const { verified, providerId } = req.query;

    const where = {};
    if (verified !== undefined) {
      where.isVerified = verified === 'true';
    }
    if (providerId) {
      where.providerId = providerId;
    }

    const licenses = await prisma.providerLicense.findMany({
      where,
      include: {
        provider: {
          include: {
            user: {
              select: {
                id: true,
                email: true,
                fullName: true
              }
            }
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    res.json(licenses);
  } catch (e) {
    next(e);
  }
});

// Get pending providers (waiting for approval)
r.get('/providers/pending', auth(true, ['ADMIN']), async (req, res, next) => {
  try {
    const providers = await prisma.providerProfile.findMany({
      where: {
        approvalStatus: 'WAITING_FOR_APPROVAL'
      },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            fullName: true,
            phone: true,
            city: true,
            createdAt: true
          }
        },
        licenses: {
          orderBy: {
            createdAt: 'desc'
          }
        },
        categories: true,
        legalStatus: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    res.json(providers);
  } catch (e) {
    next(e);
  }
});

// Approve or reject provider
r.patch('/providers/:providerId/approval', auth(true, ['ADMIN']), async (req, res, next) => {
  try {
    const { providerId } = req.params;
    const { status, notes } = req.body; // status: 'APPROVED' | 'REJECTED'

    if (!status || !['APPROVED', 'REJECTED', 'INACTIVE'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status. Must be APPROVED, REJECTED, or INACTIVE' });
    }

    // Get provider with user info
    const provider = await prisma.providerProfile.findUnique({
      where: { id: providerId },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            fullName: true
          }
        },
        licenses: true
      }
    });

    if (!provider) {
      return res.status(404).json({ error: 'Provider not found' });
    }

    // Update approval status
    const updatedProvider = await prisma.providerProfile.update({
      where: { id: providerId },
      data: {
        approvalStatus: status,
        updatedAt: new Date()
      },
      include: {
        user: true,
        licenses: true,
        categories: true
      }
    });

    // Send notification to provider
    const message = status === 'APPROVED' 
      ? `Vaša registracija je odobrena! Sada možete koristiti TRIAL status i prikazivati svoje usluge.`
      : status === 'REJECTED'
      ? `Vaša registracija je odbijena. Razlog: ${notes || 'Nisu zadovoljeni uvjeti.'}`
      : `Vaš status je ažuriran na INACTIVE.`;

    await prisma.notification.create({
      data: {
        title: status === 'APPROVED' ? 'Registracija odobrena!' : status === 'REJECTED' ? 'Registracija odbijena' : 'Status ažuriran',
        message: message,
        type: 'SYSTEM',
        userId: provider.userId,
        jobId: null,
        offerId: null
      }
    });

    // If approved, ensure they have a subscription or set them to TRIAL
    if (status === 'APPROVED') {
      const existingSubscription = await prisma.subscription.findUnique({
        where: { userId: provider.userId }
      });

      if (!existingSubscription) {
        await prisma.subscription.create({
          data: {
            userId: provider.userId,
            plan: 'TRIAL',
            status: 'ACTIVE',
            credits: 0,
            creditsBalance: 0,
            // Set expiration to 30 days from now
            expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
          }
        });
      }
    }

    res.json({
      message: `Provider ${status === 'APPROVED' ? 'approved' : status === 'REJECTED' ? 'rejected' : 'updated'} successfully`,
      provider: updatedProvider
    });
  } catch (e) {
    next(e);
  }
});

// Generic CRUD routes for all models
const MODELS = {
  User: prisma.user,
  ProviderProfile: prisma.providerProfile,
  Category: prisma.category,
  Job: prisma.job,
  Offer: prisma.offer,
  Review: prisma.review,
  Notification: prisma.notification,
  ChatRoom: prisma.chatRoom,
  ChatMessage: prisma.chatMessage,
  Subscription: prisma.subscription,
  SubscriptionPlan: prisma.subscriptionPlan,
  LegalStatus: prisma.legalStatus
};

// Generic GET /:model - list with pagination
Object.keys(MODELS).forEach(modelName => {
  const model = MODELS[modelName];
  
  r.get(`/${modelName}`, auth(true, ['ADMIN']), async (req, res, next) => {
    try {
      const { skip = 0, take = 25, where: whereStr, include: includeStr } = req.query;
      
      const where = whereStr ? JSON.parse(whereStr) : {};
      
      // Default include based on model
      let defaultInclude = undefined;
      if (modelName === 'Notification') {
        defaultInclude = { user: true, job: true, offer: true };
      } else if (modelName === 'Job') {
        defaultInclude = { user: true, category: true, assignedProvider: true };
      } else if (modelName === 'Offer') {
        defaultInclude = { user: true, job: true };
      } else if (modelName === 'Review') {
        defaultInclude = { from: true, to: true };
      } else if (modelName === 'User') {
        defaultInclude = { providerProfile: true, legalStatus: true };
      } else if (modelName === 'ProviderProfile') {
        defaultInclude = { user: true, categories: true, legalStatus: true };
      }
      
      // Use provided include or default
      const include = includeStr ? JSON.parse(includeStr) : defaultInclude;
      
      const [items, total] = await Promise.all([
        model.findMany({
          where,
          include,
          skip: parseInt(skip),
          take: parseInt(take),
          orderBy: { createdAt: 'desc' }
        }),
        model.count({ where })
      ]);
      
      res.json({ items, total });
    } catch (e) {
      next(e);
    }
  });
  
  // Generic GET /:model/:id
  r.get(`/${modelName}/:id`, auth(true, ['ADMIN']), async (req, res, next) => {
    try {
      const { id } = req.params;
      const { include: includeStr } = req.query;
      
      // Default include based on model
      let defaultInclude = undefined;
      if (modelName === 'Notification') {
        defaultInclude = { user: true, job: true, offer: true };
      } else if (modelName === 'Job') {
        defaultInclude = { user: true, category: true, assignedProvider: true };
      } else if (modelName === 'Offer') {
        defaultInclude = { user: true, job: true };
      } else if (modelName === 'Review') {
        defaultInclude = { from: true, to: true };
      } else if (modelName === 'User') {
        defaultInclude = { providerProfile: true, legalStatus: true };
      } else if (modelName === 'ProviderProfile') {
        defaultInclude = { user: true, categories: true, legalStatus: true };
      }
      
      // Use provided include or default
      const include = includeStr ? JSON.parse(includeStr) : defaultInclude;
      
      const item = await model.findUnique({
        where: { id },
        include
      });
      
      if (!item) {
        return res.status(404).json({ error: 'Not found' });
      }
      
      res.json(item);
    } catch (e) {
      next(e);
    }
  });
  
  // Generic POST /:model
  r.post(`/${modelName}`, auth(true, ['ADMIN']), async (req, res, next) => {
    try {
      const data = req.body;
      const item = await model.create({ data });
      res.status(201).json(item);
    } catch (e) {
      next(e);
    }
  });
  
  // Generic PUT /:model/:id
  r.put(`/${modelName}/:id`, auth(true, ['ADMIN']), async (req, res, next) => {
    try {
      const { id } = req.params;
      const data = req.body;
      
      // Remove fields that shouldn't be updated
      delete data.id;
      delete data.createdAt;
      
      const item = await model.update({
        where: { id },
        data
      });
      
      res.json(item);
    } catch (e) {
      next(e);
    }
  });
  
  // Generic DELETE /:model/:id
  r.delete(`/${modelName}/:id`, auth(true, ['ADMIN']), async (req, res, next) => {
    try {
      const { id } = req.params;

      // Protect ADMIN user from deletion
      if (modelName === 'User') {
        const user = await prisma.user.findUnique({ where: { id }, select: { role: true, email: true } });
        if (!user) {
          return res.status(404).json({ error: 'Not found' });
        }
        if (user.role === 'ADMIN') {
          return res.status(400).json({ error: 'ADMIN korisnika nije moguće obrisati' });
        }
      }

      await model.delete({ where: { id } });
      res.json({ success: true });
    } catch (e) {
      next(e);
    }
  });
}); // Zatvaranje forEach petlje

// SMS Verifikacija - Reset pokušaja (izvan forEach petlje)
r.post('/users/:userId/reset-sms-attempts', auth(true, ['ADMIN']), async (req, res, next) => {
  try {
    const { userId } = req.params;
    
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        fullName: true,
        phone: true,
        phoneVerificationAttempts: true,
        phoneVerified: true
      }
    });
    
    if (!user) {
      return res.status(404).json({ error: 'Korisnik nije pronađen' });
    }
    
    // Reset pokušaja
    const updated = await prisma.user.update({
      where: { id: userId },
      data: {
        phoneVerificationAttempts: 0
      },
      select: {
        id: true,
        email: true,
        fullName: true,
        phone: true,
        phoneVerificationAttempts: true,
        phoneVerified: true
      }
    });
    
    res.json({
      success: true,
      message: `SMS pokušaji resetirani za korisnika ${user.email}`,
      user: updated
    });
  } catch (e) {
    next(e);
  }
});

export default r;