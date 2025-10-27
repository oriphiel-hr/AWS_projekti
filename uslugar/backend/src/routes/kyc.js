import { Router } from 'express';
import { auth } from '../lib/auth.js';
import { prisma } from '../lib/prisma.js';
import { verifyKYCDocument, validateOIB } from '../lib/kyc-verification.js';
import { uploadDocument } from '../lib/upload.js';
import fs from 'fs/promises';
import path from 'path';

const r = Router();

/**
 * POST /api/kyc/upload-document
 * Upload Rješenja Porezne uprave za verifikaciju
 * 
 * Body:
 * - document: File (PDF/JPG/PNG)
 * - publicConsent: boolean (Izjava korisnika)
 */
r.post('/upload-document', auth(true), uploadDocument.single('document'), async (req, res, next) => {
  try {
    const user = req.user;
    
    if (!req.file) {
      return res.status(400).json({ 
        error: 'Dokument je obavezan',
        message: 'Molimo priložite dokument u PDF, JPG ili PNG formatu' 
      });
    }
    
    const publicConsent = req.body.publicConsent === 'true' || req.body.publicConsent === true;
    
    // Pročitaj fajl
    const filePath = path.join('./uploads', req.file.filename);
    const fileBuffer = await fs.readFile(filePath);
    
    // Kreiraj URL
    const documentUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
    
    // Provjeri da je korisnik PROVIDER
    if (user.role !== 'PROVIDER') {
      await fs.unlink(filePath); // Obriši fajl
      return res.status(403).json({ 
        error: 'Samo pružatelji usluga mogu uploadati dokumente za verifikaciju' 
      });
    }
    
    console.log(`[KYC] User ${user.id} uploading document: ${req.file.filename}`);
    
    // Izvrši verifikaciju
    const verificationResult = await verifyKYCDocument(user, fileBuffer, documentUrl);
    
    if (!verificationResult.success) {
      await fs.unlink(filePath);
      return res.status(400).json({ 
        error: verificationResult.error 
      });
    }
    
    // Ažuriraj publicConsent
    await prisma.providerProfile.update({
      where: { userId: user.id },
      data: { kycPublicConsent: publicConsent }
    });
    
    res.json({
      success: true,
      message: 'Dokument je uspješno uploadan i verificiran',
      data: {
        extractedOIB: verificationResult.data.extractedOIB,
        extractedName: verificationResult.data.extractedName,
        nameMatches: verificationResult.data.nameMatches,
        ocrVerified: verificationResult.data.ocrVerified,
        oibValidated: verificationResult.data.oibValidated,
        documentUrl
      }
    });
    
  } catch (err) {
    console.error('[KYC] Upload error:', err);
    next(err);
  }
});

/**
 * GET /api/kyc/status
 * Dohvati KYC status za trenutnog korisnika
 */
r.get('/status', auth(true), async (req, res, next) => {
  try {
    const user = req.user;
    
    const providerProfile = await prisma.providerProfile.findUnique({
      where: { userId: user.id },
      select: {
        kycVerified: true,
        kycDocumentUrl: true,
        kycExtractedOib: true,
        kycExtractedName: true,
        kycDocumentType: true,
        kycPublicConsent: true,
        kycVerificationNotes: true,
        kycVerifiedAt: true,
        kycOcrVerified: true,
        kycOibValidated: true,
        kycObrtnRegChecked: true,
        kycKamaraChecked: true,
        kycViesChecked: true
      }
    });
    
    if (!providerProfile) {
      return res.json({
        kycVerified: false,
        kycDocumentUploaded: false
      });
    }
    
    res.json({
      kycVerified: providerProfile.kycVerified,
      kycDocumentUploaded: !!providerProfile.kycDocumentUrl,
      data: providerProfile
    });
    
  } catch (err) {
    console.error('[KYC] Status error:', err);
    next(err);
  }
});

/**
 * POST /api/kyc/update-consent
 * Ažuriraj izjavu korisnika (publicConsent)
 */
r.post('/update-consent', auth(true), async (req, res, next) => {
  try {
    const user = req.user;
    const { publicConsent } = req.body;
    
    if (typeof publicConsent !== 'boolean') {
      return res.status(400).json({ 
        error: 'publicConsent mora biti boolean' 
      });
    }
    
    await prisma.providerProfile.update({
      where: { userId: user.id },
      data: { kycPublicConsent: publicConsent }
    });
    
    res.json({
      success: true,
      message: 'Izjava je uspješno ažurirana',
      publicConsent
    });
    
  } catch (err) {
    console.error('[KYC] Consent update error:', err);
    next(err);
  }
});

/**
 * POST /api/kyc/auto-verify (PUBLIC - može se koristiti prije registracije)
 * Automatska provjera javnih registara
 */
r.post('/auto-verify', async (req, res, next) => {
  try {
    const { taxId, legalStatusId, companyName } = req.body;
    
    if (!taxId || !validateOIB(taxId)) {
      return res.status(400).json({
        verified: false,
        needsDocument: true,
        error: 'OIB nije validan',
        badges: []
      });
    }
    
    // Get legal status
    const legalStatus = await prisma.legalStatus.findUnique({
      where: { id: legalStatusId }
    });
    
    if (!legalStatus) {
      return res.status(400).json({
        verified: false,
        needsDocument: true,
        error: 'Pravni status nije odabran'
      });
    }
    
    // Auto-verify based on legal status
    let results = {
      verified: false,
      needsDocument: true,
      badges: [],
      errors: []
    };
    
    console.log(`[Auto-Verify] Legal status: ${legalStatus.code}`);
    
    switch(legalStatus.code) {
      case 'DOO':
      case 'JDOO':
        // Sudski registar (simulacija)
        results = {
          verified: true,
          needsDocument: false,
          badges: [{ type: 'SUDSKI', verified: true }],
          errors: []
        };
        break;
        
      case 'SOLE_TRADER':
      case 'PAUSAL':
        // Obrtni registar (simulacija)
        results = {
          verified: true,
          needsDocument: false,
          badges: [{ type: 'OBRTNI', verified: true }],
          errors: []
        };
        break;
        
      case 'FREELANCER':
        // Freelancer: odmah traži dokument
        results = {
          verified: false,
          needsDocument: true,
          badges: [],
          errors: ['Freelancer: Potrebno Rješenje Porezne uprave']
        };
        break;
    }
    
    // Ako je verificiran i korisnik je logiran - postavi kycVerified
    // (kod se može koristiti i prije registracije za provjeru)
    if (results.verified && req.user) {
      await prisma.providerProfile.update({
        where: { userId: req.user.id },
        data: {
          kycVerified: true,
          kycVerifiedAt: new Date(),
          kycOibValidated: true
        }
      });
    }
    
    res.json(results);
    
  } catch (err) {
    console.error('[Auto-Verify] Error:', err);
    next(err);
  }
});

/**
 * ADMIN ONLY: POST /api/kyc/verify/:userId
 * Ručna verifikacija od strane admina
 */
r.post('/verify/:userId', auth(true), async (req, res, next) => {
  try {
    const adminUser = req.user;
    
    // Provjeri da je admin
    if (adminUser.role !== 'ADMIN') {
      return res.status(403).json({ 
        error: 'Samo admin može verificirati korisnike' 
      });
    }
    
    const { userId } = req.params;
    const { notes } = req.body;
    
    const providerProfile = await prisma.providerProfile.update({
      where: { userId },
      data: {
        kycVerified: true,
        kycVerifiedAt: new Date(),
        kycVerificationNotes: notes || null
      }
    });
    
    res.json({
      success: true,
      message: 'Korisnik je uspješno verificiran',
      data: providerProfile
    });
    
  } catch (err) {
    console.error('[KYC] Admin verification error:', err);
    next(err);
  }
});

export default r;

