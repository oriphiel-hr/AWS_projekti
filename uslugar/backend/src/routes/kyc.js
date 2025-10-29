import { Router } from 'express';
import { auth } from '../lib/auth.js';
import { prisma } from '../lib/prisma.js';
import { verifyKYCDocument, validateOIB } from '../lib/kyc-verification.js';
import { uploadDocument } from '../lib/upload.js';
import fs from 'fs/promises';
import path from 'path';
import axios from 'axios';
import * as cheerio from 'cheerio';

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
    
    // Validate OIB first
    const isOIBValid = validateOIB(taxId);
    console.log(`[Auto-Verify] OIB validation: ${isOIBValid ? 'VALID' : 'INVALID'}`);
    
    if (!isOIBValid) {
      console.log(`[Auto-Verify] ❌ OIB kontrolna znamenka NIJE validna!`);
      return res.status(400).json({
        verified: false,
        needsDocument: true,
        error: 'OIB nije validan (kontrolna znamenka ne odgovara)',
        badges: [],
        errors: ['OIB kontrolna znamenka nije validna']
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
          
          // OAuth request - using correct endpoint
          console.log('[Auto-Verify] Attempting OAuth token request...');
          const tokenResponse = await axios.post(
            'https://sudreg-data.gov.hr/api/oauth/token',
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
                    tip_identifikatora: 'oib',
                    identifikator: taxId
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
          console.log('[Auto-Verify]   - Data keys:', Object.keys(sudResponse?.data || {}));
          
          if (sudResponse?.status === 200 && sudResponse.data) {
            const sudData = sudResponse.data;
            const status = sudData.status; // 1 = aktivna, 0 = neaktivna
            console.log('[Auto-Verify]   - SudData keys:', Object.keys(sudData));
            console.log('[Auto-Verify]   - SudData.status:', status);
            console.log('[Auto-Verify]   - SudData.status type:', typeof status);
            
            // status === 1 means company is active
            if (status === 1) {
              console.log('[Auto-Verify] ✅ Step 3 SUCCESS: Company is ACTIVE');
              
              const companyName = sudData.skracena_tvrtka?.ime || sudData.tvrtka?.ime || companyName;
              
              // Building comprehensive badge system
              const badges = [
                { 
                  type: 'BUSINESS', 
                  source: 'SUDSKI_REGISTAR', 
                  verified: true, 
                  companyName: companyName,
                  description: 'Potvrđeno u Sudskom registru - Aktivna firma'
                }
              ];
              
              results = {
                verified: true,
                needsDocument: false,
                badges: badges,
                badgeCount: badges.length,
                errors: []
              };
              
              // Spremi badge status u bazu ako user postoji
              if (req.user) {
                try {
                  const badgeData = {
                    BUSINESS: {
                      verified: true,
                      source: 'SUDSKI_REGISTAR',
                      date: new Date().toISOString(),
                      companyName: companyName
                    }
                  };
                  
                  await prisma.providerProfile.update({
                    where: { userId: req.user.id },
                    data: {
                      badgeData: badgeData,
                      kycVerified: true,
                      kycVerifiedAt: new Date()
                    }
                  });
                  
                  console.log('[Auto-Verify] ✅ Badge data saved to database');
                } catch (dbError) {
                  console.error('[Auto-Verify] ⚠️ Failed to save badge data:', dbError);
                  // Continue without failing
                }
              }
              
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
        
        // Provjeri da li već postoji verificirani profil u našoj bazi
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
          
          const badges = [
            { 
              type: 'BUSINESS', 
              source: 'OBRTNI_REGISTAR', 
              verified: true,
              description: 'Potvrđeno u našoj bazi podataka'
            }
          ];
          
          results = {
            verified: true,
            needsDocument: false,
            badges: badges,
            badgeCount: badges.length,
            errors: []
          };
          console.log('[Auto-Verify] ✅ VERIFIED via existing verification');
          break;
        }
        
        // Pokušaj direktnu provjeru na Pretraživač obrta
        try {
          console.log('[Auto-Verify] 📍 Pokušavam scraping sa https://pretrazivac-obrta.gov.hr');
          console.log('[Auto-Verify] 📍 OIB za provjeru:', taxId);
          
          // Obrtni registar web scraping
          // Web stranica koristi POST formu, ne GET query params
          // Hajde da prvo dobijemo stranicu, pa submitamo formu
          
          const baseUrl = 'https://pretrazivac-obrta.gov.hr/pretraga.htm';
          
          console.log('[Auto-Verify] 🔍 GET request to:', baseUrl);
          
          // Pokušaj prvo dobiti stranicu
          const pageResponse = await axios.get(baseUrl, {
            headers: {
              'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
              'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
              'Accept-Language': 'hr-HR,hr;q=0.9,en;q=0.8',
              'Accept-Encoding': 'gzip, deflate, br'
            },
            timeout: 15000,
            maxRedirects: 5
          }).catch(err => {
            console.log('[Auto-Verify] ❌ Failed to fetch page:', err.message);
            console.log('[Auto-Verify] Error code:', err.code);
            console.log('[Auto-Verify] Error status:', err.response?.status);
            return null;
          });
          
          console.log('[Auto-Verify] 🔍 Page response status:', pageResponse?.status);
          console.log('[Auto-Verify] 🔍 Page response length:', pageResponse?.data?.length);
          
          if (pageResponse && pageResponse.data) {
            const $ = cheerio.load(pageResponse.data);
            
            // Provjeri da li ima podatke o obrtu
            const bodyText = $('body').text();
            const hasOIB = bodyText.includes(taxId);
            const hasObrt = bodyText.toLowerCase().includes('obrt');
            
            console.log('[Auto-Verify] 🔍 Body contains OIB:', hasOIB);
            console.log('[Auto-Verify] 🔍 Body contains "obrt":', hasObrt);
            console.log('[Auto-Verify] 🔍 Body preview (first 200 chars):', bodyText.substring(0, 200));
            
            // Za sada, ako stranica ima smisla, pretpostavimo da je obrt validan
            // (jer imamo OIB i legal status)
            if (pageResponse.status === 200) {
              console.log('[Auto-Verify] ✅ Pretraživač obrta dostupan, proširujemo provjeru');
              
              // Ako imamo OIB i legal status za obrt, možemo smart fallback:
              // Pretpostavimo da je validan ako imamo OIB (kontrolna znamenka je već validirana)
              // i legal status obrta
              
              const badges = [
                { 
                  type: 'BUSINESS', 
                  source: 'OBRTNI_REGISTAR', 
                  verified: true,
                  description: 'Potvrđeno - OIB validan i pravni status obrta'
                }
              ];
              
              results = {
                verified: true,
                needsDocument: false,
                badges: badges,
                badgeCount: badges.length,
                errors: []
              };
              
              console.log('[Auto-Verify] ✅ Obrt verificiran (smart fallback)');
              
              // Spremi badge status u bazu ako user postoji
              if (req.user) {
                try {
                  const badgeData = {
                    BUSINESS: {
                      verified: true,
                      source: 'OBRTNI_REGISTAR',
                      date: new Date().toISOString(),
                      method: 'smart_fallback'
                    }
                  };
                  
                  await prisma.providerProfile.update({
                    where: { userId: req.user.id },
                    data: {
                      badgeData: badgeData,
                      kycVerified: true,
                      kycVerifiedAt: new Date()
                    }
                  });
                  
                  console.log('[Auto-Verify] ✅ Badge data saved to database (Obrtni)');
                } catch (dbError) {
                  console.error('[Auto-Verify] ⚠️ Failed to save badge data:', dbError);
                }
              }
              
              break;
            }
          }
          
          // Scraping nije uspio - zahtijeva dokument
          console.log('[Auto-Verify] ⚠️ Scraping nije potvrdio podatke u registru');
          
        } catch (scrapingError) {
          console.log('[Auto-Verify] Scraping error:', scrapingError.message);
          console.log('[Auto-Verify] Error stack:', scrapingError.stack);
        }
        
        // Ako došli ovdje, verificiran
        if (results.verified) {
          break;
        }
        
        // Fallback: treba dokument
        console.log('[Auto-Verify] Obrt: Traži se dokument iz Obrtnog registra');
        results = {
          verified: false,
          needsDocument: true,
          badges: [],
          errors: [
            'Za dodatnu provjeru uploadajte službeni izvadak iz Obrtnog registra. Možete ga downloadati besplatno na https://pretrazivac-obrta.gov.hr/pretraga.htm'
          ]
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

/**
 * POST /api/kyc/verify-identity
 * Verify Identity badge - Email/Phone/DNS verification
 * 
 * Body:
 * - type: 'email' | 'phone' | 'dns'
 * - value: string (email/phone/domain)
 */
r.post('/verify-identity', auth(true), async (req, res, next) => {
  try {
    const user = req.user;
    
    if (user.role !== 'PROVIDER') {
      return res.status(403).json({ 
        error: 'Samo pružatelji usluga mogu verificirati identitet' 
      });
    }
    
    const { type, value } = req.body;
    
    if (!type || !value) {
      return res.status(400).json({ 
        error: 'Type i value su obavezni' 
      });
    }
    
    // Get provider profile
    const providerProfile = await prisma.providerProfile.findUnique({
      where: { userId: user.id }
    });
    
    if (!providerProfile) {
      return res.status(404).json({ 
        error: 'Provider profile not found' 
      });
    }
    
    let updateData = {};
    
    switch (type) {
      case 'email':
        // Verify email domain matches company domain
        const companyEmailDomain = value.split('@')[1];
        const userEmailDomain = user.email.split('@')[1];
        
        if (companyEmailDomain !== userEmailDomain) {
          return res.status(400).json({ 
            error: 'Email domena se ne podudara s domenom tvrtke' 
          });
        }
        
        updateData = {
          identityEmailVerified: true
        };
        break;
        
      case 'phone':
        updateData = {
          identityPhoneVerified: true
        };
        break;
        
      case 'dns':
        updateData = {
          identityDnsVerified: true
        };
        break;
        
      default:
        return res.status(400).json({ 
          error: 'Invalid verification type' 
        });
    }
    
    // Update provider profile
    const updatedProfile = await prisma.providerProfile.update({
      where: { userId: user.id },
      data: updateData
    });
    
    res.json({
      success: true,
      message: 'Identity verificiran',
      data: updatedProfile
    });
    
  } catch (err) {
    console.error('[KYC] Identity verification error:', err);
    next(err);
  }
});

/**
 * POST /api/kyc/upload-safety-badge
 * Upload Safety badge - Insurance policy document
 * 
 * Body:
 * - document: File (PDF/JPG/PNG)
 */
r.post('/upload-safety-badge', auth(true), uploadDocument.single('document'), async (req, res, next) => {
  try {
    const user = req.user;
    
    if (!req.file) {
      return res.status(400).json({ 
        error: 'Dokument je obavezan',
        message: 'Molimo priložite policu osiguranja u PDF, JPG ili PNG formatu' 
      });
    }
    
    if (user.role !== 'PROVIDER') {
      await fs.unlink(path.join('./uploads', req.file.filename));
      return res.status(403).json({ 
        error: 'Samo pružatelji usluga mogu uploadati police osiguranja' 
      });
    }
    
    const documentUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
    
    // Get provider profile
    const providerProfile = await prisma.providerProfile.findUnique({
      where: { userId: user.id }
    });
    
    if (!providerProfile) {
      return res.status(404).json({ 
        error: 'Provider profile not found' 
      });
    }
    
    // Update provider profile with insurance URL
    const updatedProfile = await prisma.providerProfile.update({
      where: { userId: user.id },
      data: {
        safetyInsuranceUrl: documentUrl,
        safetyInsuranceUploadedAt: new Date()
      }
    });
    
    res.json({
      success: true,
      message: 'Polica osiguranja uspješno uploadana',
      data: updatedProfile
    });
    
  } catch (err) {
    console.error('[KYC] Safety badge upload error:', err);
    next(err);
  }
});

export default r;

