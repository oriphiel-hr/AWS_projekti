import { Router } from 'express';
import { auth } from '../lib/auth.js';
import { prisma } from '../lib/prisma.js';
import { verifyKYCDocument, validateOIB } from '../lib/kyc-verification.js';
import { uploadDocument } from '../lib/upload.js';
import fs from 'fs/promises';
import path from 'path';
import axios from 'axios';

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
        // Sudski registar - DEBUGGING MODE
        console.log('[Auto-Verify] 🔍 DEBUGGING: DOO/JDOO API verification');
        
        try {
          const clientId = process.env.SUDREG_CLIENT_ID;
          const clientSecret = process.env.SUDREG_CLIENT_SECRET;
          
          console.log('[Auto-Verify] 📋 Step 1: Checking credentials');
          console.log('[Auto-Verify]   - clientId exists:', !!clientId);
          console.log('[Auto-Verify]   - clientSecret exists:', !!clientSecret);
          console.log('[Auto-Verify]   - clientId value:', clientId?.substring(0, 10) + '...');
          console.log('[Auto-Verify]   - clientSecret value:', clientSecret?.substring(0, 10) + '...');
          
          if (!clientId || !clientSecret) {
            console.log('[Auto-Verify] ❌ Step 1 FAILED: Missing credentials');
            throw new Error('Missing SUDREG credentials');
          }
          
          console.log('[Auto-Verify] ✅ Step 1 SUCCESS: Credentials found');
          console.log('[Auto-Verify] 📞 Step 2: Requesting OAuth token...');
          
          // OAuth request - simple and clean approach
          console.log('[Auto-Verify] Attempting OAuth token request...');
          const tokenResponse = await axios.post(
            'https://sudreg-data.gov.hr/ords/srn_rep/oauth/token',
            'grant_type=client_credentials',
            {
              auth: {
                username: clientId,
                password: clientSecret
              },
              headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
              }
            }
          ).catch(err => {
            console.log('[Auto-Verify] ❌ Step 2 FAILED: OAuth request error');
            console.log('[Auto-Verify]   - Status:', err.response?.status);
            console.log('[Auto-Verify]   - StatusText:', err.response?.statusText);
            console.log('[Auto-Verify]   - Data:', JSON.stringify(err.response?.data));
            console.log('[Auto-Verify]   - Message:', err.message);
            throw err;
          });
          
          console.log('[Auto-Verify] Step 2 Response received');
          console.log('[Auto-Verify]   - Status:', tokenResponse?.status);
          console.log('[Auto-Verify]   - Has access_token:', !!tokenResponse?.data?.access_token);
          
          if (!tokenResponse?.data?.access_token) {
            console.log('[Auto-Verify] ❌ Step 2 FAILED: No access token in response');
            throw new Error('No access token received');
          }
          
          const accessToken = tokenResponse.data.access_token;
          console.log('[Auto-Verify] ✅ Step 2 SUCCESS: Token received');
          console.log('[Auto-Verify] 🏢 Step 3: Checking OIB in Sudski registar:', taxId);
          
          // Try API call with retry logic (Sudreg database may be down)
          let sudResponse = null;
          let lastError = null;
          
          for (let attempt = 1; attempt <= 3; attempt++) {
            console.log(`[Auto-Verify]   Attempt ${attempt}/3...`);
            
            try {
              sudResponse = await axios.get(
                `https://sudreg-data.gov.hr/api/javni/detalji_subjekta`,
                {
                  params: {
                    OIB: taxId
                  },
                  headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Accept': 'application/json'
                  },
                  timeout: 10000 // 10 second timeout
                }
              );
              
              // Success - break out of retry loop
              console.log(`[Auto-Verify]   ✅ Attempt ${attempt} succeeded!`);
              break;
              
            } catch (err) {
              lastError = err;
              console.log(`[Auto-Verify]   ❌ Attempt ${attempt} failed:`, err.response?.status);
              
              // If 503 (Service Unavailable), retry after delay
              if (err.response?.status === 503 && attempt < 3) {
                console.log('[Auto-Verify]   ⏳ Sudreg database is down, retrying in 2 seconds...');
                await new Promise(resolve => setTimeout(resolve, 2000));
                continue;
              }
              
              // Other errors or max retries reached
              console.log('[Auto-Verify]   Error details:', {
                status: err.response?.status,
                statusText: err.response?.statusText,
                data: err.response?.data,
                message: err.message
              });
              
              // If it's 503 and not last attempt, retry
              if (err.response?.status === 503 && attempt < 3) {
                continue;
              }
              
              // Otherwise break (non-retryable error or max attempts)
              break;
            }
          }
          
          // After retry loop
          if (!sudResponse && lastError) {
            console.log('[Auto-Verify] ❌ All 3 attempts failed');
            console.log('[Auto-Verify] Last error status:', lastError.response?.status);
            console.log('[Auto-Verify] Last error data:', JSON.stringify(lastError.response?.data));
            throw lastError;
          }
          
          console.log('[Auto-Verify] Step 3 Response received');
          console.log('[Auto-Verify]   - Status:', sudResponse?.status);
          console.log('[Auto-Verify]   - Data:', JSON.stringify(sudResponse?.data));
          
          if (sudResponse?.status === 200 && sudResponse.data) {
            const sudData = sudResponse.data;
            const status = sudData.STATUS?.toUpperCase();
            console.log('[Auto-Verify]   - Company status:', status);
            
            if (status === 'AKTIVAN' || status === 'AKTIVNA') {
              console.log('[Auto-Verify] ✅ Step 3 SUCCESS: Company is ACTIVE');
              results = {
                verified: true,
                needsDocument: false,
                badges: [{ type: 'SUDSKI', verified: true, companyName: sudData.NAZIV || companyName }],
                errors: []
              };
              break;
            } else {
              console.log('[Auto-Verify] ⚠️ Step 3: Company not active, status:', status);
            }
          }
          
          console.log('[Auto-Verify] ⚠️ Step 3: Did not confirm active status');
          
        } catch (apiError) {
          console.log('[Auto-Verify] ❌ CRITICAL ERROR in API verification');
          console.log('[Auto-Verify] Error type:', apiError.name);
          console.log('[Auto-Verify] Error message:', apiError.message);
          console.log('[Auto-Verify] Error stack:', apiError.stack);
        }
        
        // Fallback: require document
        results = {
          verified: false,
          needsDocument: true,
          badges: [],
          errors: ['Za automatsku provjeru unesite službeni izvadak iz Sudskog registra.']
        };
        break;
        
      case 'SOLE_TRADER':
      case 'PAUSAL':
        // Obrtni registar - POKUŠAVAMO provjeru
        console.log('[Auto-Verify] Obrt/Pausalni: Pokušavam provjeriti Obrtni registar...');
        
        try {
          // Obrtni registar: https://www.obrti.hr/pretraga
          // Opcija 1: Web scraping (legalno, javni podaci)
          // Opcija 2: API ako postoji
          
          // Za sada: provjeriti da li OIB postoji u našoj bazi (provjera iz profila)
          const existingOIB = await prisma.user.findFirst({
            where: {
              taxId: taxId,
              role: 'PROVIDER'
            },
            include: {
              providerProfile: true
            }
          });
          
          if (existingOIB && existingOIB.providerProfile?.kycVerified) {
            console.log('[Auto-Verify] OIB već verificiran u našoj bazi');
            results = {
              verified: true,
              needsDocument: false,
              badges: [{ type: 'OBRTNI', verified: true }],
              errors: []
            };
            console.log('[Auto-Verify] ✅ VERIFIED via existing verification');
            break;
          }
          
          // VIES provjera ako postoji PDV ID
          if (user?.pdvId && user.pdvId.startsWith('HR')) {
            try {
              console.log('[Auto-Verify] Checking VIES for PDV:', user.pdvId);
              const viesResponse = await axios.post('http://ec.europa.eu/taxation_customs/vies/checkVatService', {
                headers: {
                  'Content-Type': 'application/xml'
                },
                data: `<?xml version="1.0"?>
                  <soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
                    <soap:Body>
                      <checkVat xmlns="urn:ec.europa.eu:taxud:vies:services:checkVat:types">
                        <countryCode>HR</countryCode>
                        <vatNumber>${user.pdvId.substring(2)}</vatNumber>
                      </checkVat>
                    </soap:Body>
                  </soap:Envelope>`
              }).catch(() => null);
              
              if (viesResponse && viesResponse.data) {
                console.log('[Auto-Verify] VIES verified');
              }
            } catch (viesError) {
              console.log('[Auto-Verify] VIES nije dostupan:', viesError.message);
            }
          }
          
        } catch (apiError) {
          console.log('[Auto-Verify] Obrtni registar API nije dostupan:', apiError.message);
        }
        
        // Fallback: treba dokument
        results = {
          verified: false,
          needsDocument: true,
          badges: [],
          errors: ['Obrtni registar provjera nije dostupna. Učitajte službeni izvadak iz Obrtnog registra.']
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

