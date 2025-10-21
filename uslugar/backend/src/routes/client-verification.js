// Client Verification System - USLUGAR EXCLUSIVE
import { Router } from 'express';
import { auth } from '../lib/auth.js';
import { prisma } from '../lib/prisma.js';

const r = Router();

// Dohvati status verifikacije
r.get('/status', auth(true), async (req, res, next) => {
  try {
    let verification = await prisma.clientVerification.findUnique({
      where: { userId: req.user.id }
    });
    
    if (!verification) {
      // Kreiraj prazan verification record
      verification = await prisma.clientVerification.create({
        data: {
          userId: req.user.id,
          phoneVerified: false,
          emailVerified: req.user.isVerified || false,
          idVerified: false,
          companyVerified: false,
          trustScore: 0
        }
      });
    }
    
    res.json(verification);
  } catch (e) {
    next(e);
  }
});

// Verifikacija telefona - pošalji SMS kod
r.post('/phone/send-code', auth(true), async (req, res, next) => {
  try {
    const { phone } = req.body;
    
    if (!phone) {
      return res.status(400).json({ error: 'Phone number required' });
    }
    
    // TODO: Integracija sa Twilio SMS servisom
    // Za sada samo simulacija
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
    
    // Spremi kod u bazu (ili cache)
    await prisma.user.update({
      where: { id: req.user.id },
      data: { phone }
    });
    
    console.log(`[VERIFICATION] SMS code for ${phone}: ${verificationCode}`);
    
    res.json({
      success: true,
      message: 'Verification code sent via SMS',
      // U development-u vrati kod (u produkciji ne!)
      ...(process.env.NODE_ENV === 'development' && { code: verificationCode })
    });
  } catch (e) {
    next(e);
  }
});

// Verifikacija telefona - potvrdi SMS kod
r.post('/phone/verify-code', auth(true), async (req, res, next) => {
  try {
    const { code } = req.body;
    
    if (!code) {
      return res.status(400).json({ error: 'Verification code required' });
    }
    
    // TODO: Provjeri kod iz cache/baze
    // Za sada samo simulacija - prihvati svaki 6-znamenkasti kod
    if (code.length !== 6) {
      return res.status(400).json({ error: 'Invalid verification code' });
    }
    
    // Ažuriraj verification status
    const verification = await prisma.clientVerification.upsert({
      where: { userId: req.user.id },
      create: {
        userId: req.user.id,
        phoneVerified: true,
        emailVerified: req.user.isVerified || false,
        trustScore: 20
      },
      update: {
        phoneVerified: true,
        trustScore: { increment: 20 }
      }
    });
    
    res.json({
      success: true,
      message: 'Phone verified successfully',
      verification
    });
  } catch (e) {
    next(e);
  }
});

// Verifikacija osobne (ID upload)
r.post('/id/upload', auth(true), async (req, res, next) => {
  try {
    const { idImageFront, idImageBack } = req.body;
    
    if (!idImageFront) {
      return res.status(400).json({ error: 'ID image required' });
    }
    
    // TODO: Implementacija upload-a i AI provjere legitimnosti ID-a
    // Za sada samo označavanje kao verified
    
    const verification = await prisma.clientVerification.upsert({
      where: { userId: req.user.id },
      create: {
        userId: req.user.id,
        idVerified: true,
        trustScore: 40
      },
      update: {
        idVerified: true,
        verifiedAt: new Date(),
        trustScore: { increment: 30 },
        notes: 'ID verification pending manual review'
      }
    });
    
    res.json({
      success: true,
      message: 'ID uploaded. Verification pending.',
      verification
    });
  } catch (e) {
    next(e);
  }
});

// Verifikacija firme (OIB + sudski registar)
r.post('/company/verify', auth(true), async (req, res, next) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id }
    });
    
    if (!user.taxId || !user.companyName) {
      return res.status(400).json({
        error: 'Company tax ID and name required',
        message: 'Please update your profile with company details first'
      });
    }
    
    // TODO: API integracija sa FINA/Sudskim registrom za provjeru OIB-a
    // Za sada samo simulacija
    
    const verification = await prisma.clientVerification.upsert({
      where: { userId: req.user.id },
      create: {
        userId: req.user.id,
        companyVerified: true,
        trustScore: 50
      },
      update: {
        companyVerified: true,
        verifiedAt: new Date(),
        trustScore: { increment: 40 },
        notes: `Company verified: ${user.companyName} (OIB: ${user.taxId})`
      }
    });
    
    res.json({
      success: true,
      message: 'Company verification successful',
      verification
    });
  } catch (e) {
    next(e);
  }
});

// Admin - ručna verifikacija
r.post('/admin/verify/:userId', auth(true, ['ADMIN']), async (req, res, next) => {
  try {
    const { userId } = req.params;
    const { phoneVerified, emailVerified, idVerified, companyVerified, trustScore, notes } = req.body;
    
    const verification = await prisma.clientVerification.upsert({
      where: { userId },
      create: {
        userId,
        phoneVerified: phoneVerified || false,
        emailVerified: emailVerified || false,
        idVerified: idVerified || false,
        companyVerified: companyVerified || false,
        trustScore: trustScore || 0,
        notes,
        verifiedAt: new Date()
      },
      update: {
        phoneVerified,
        emailVerified,
        idVerified,
        companyVerified,
        trustScore,
        notes,
        verifiedAt: new Date()
      }
    });
    
    res.json({
      success: true,
      message: 'Client verification updated by admin',
      verification
    });
  } catch (e) {
    next(e);
  }
});

// Dohvati listu neverificiranih klijenata (za admin)
r.get('/admin/pending', auth(true, ['ADMIN']), async (req, res, next) => {
  try {
    const unverified = await prisma.clientVerification.findMany({
      where: {
        OR: [
          { phoneVerified: false },
          { emailVerified: false },
          { idVerified: false },
          { trustScore: { lt: 50 } }
        ]
      },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            fullName: true,
            phone: true,
            companyName: true,
            createdAt: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
    
    res.json({
      total: unverified.length,
      verifications: unverified
    });
  } catch (e) {
    next(e);
  }
});

export default r;

