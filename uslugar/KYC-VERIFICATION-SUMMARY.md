# KYC-lite Verifikacija - Implementacija

## 📋 Pregled

Implementirana je **KYC-lite verifikacijska** funkcionalnost za freelancere/samostalne djelatnike koji su registrirani kao **"Samostalni djelatnik"** ili **"Freelancer"**.

Cilj: Provjerljivost identiteta pružatelja usluga bez kršenja GDPR propisa i bez potrebe za kompleksnom KYC verifikacijom.

---

## 🎯 Implementirano

### 1. Backend

#### A. Prisma Schema (`uslugar/backend/prisma/schema.prisma`)
- Dodata polja u `ProviderProfile` model:
  - `kycVerified` - Status verifikacije
  - `kycDocumentUrl` - URL uploadanog dokumenta
  - `kycExtractedOib` - OIB extrahiran OCR-om
  - `kycExtractedName` - Ime extrahirano OCR-om
  - `kycDocumentType` - Tip dokumenta (RPO_SOLUTION, OBRT_REGISTRY, etc.)
  - `kycPublicConsent` - Privola korisnika
  - `kycVerificationNotes` - Admin bilješke
  - `kycVerifiedAt` - Datum verifikacije
  - `kycOcrVerified` - OCR validacija
  - `kycOibValidated` - OIB algoritamska validacija
  - `kycObrtnRegChecked` - Provjera Obrtnog registra
  - `kycKamaraChecked` - Provjera komorskog imenika
  - `kycViesChecked` - VIES provjera (PDV)

#### B. KYC Verifikacija Library (`uslugar/backend/src/lib/kyc-verification.js`)
- **`validateOIB(oib)`** - Validacija OIB-a (algoritamska kontrolna znamenka)
- **`extractOIBFromText(text)`** - Extraktiranje OIB-a iz OCR teksta
- **`containsRPOSolutionKeywords(text)`** - Provjera ključnih fraza iz Rješenja Porezne uprave
- **`checkNameMatch(extractedName, profileName)`** - Podudarnost imena
- **`performOCR(imageBuffer)`** - OCR simulacija (za produkciju integracija Tesseract.js/cloud OCR)
- **`verifyKYCDocument(user, documentBuffer, documentUrl)`** - Kompletna verifikacija

#### C. KYC Routes (`uslugar/backend/src/routes/kyc.js`)
- **`POST /api/kyc/upload-document`** - Upload Rješenja Porezne uprave
- **`GET /api/kyc/status`** - Dohvati KYC status
- **`POST /api/kyc/update-consent`** - Ažuriraj izjavu korisnika
- **`POST /api/kyc/verify/:userId`** - Admin ručna verifikacija

#### D. Upload Library (`uslugar/backend/src/lib/upload.js`)
- `uploadDocument` - Multer konfiguracija za PDF/DOC/DOCX/JPG/PNG fajlove (max 10MB)
- Podrška za OCR simlaciju i stvarno OCR u produkciji

#### E. Server Updates (`uslugar/backend/src/server.js`)
- Registrirana KYC ruta: `app.use('/api/kyc', kycRouter)`

---

### 2. Frontend

#### A. KYCVerification Component (`uslugar/frontend/src/components/KYCVerification.jsx`)
- Upload forma za Rješenje Porezne uprave
- File upload (drag & drop ili click)
- Checkbox za public consent (GDPR privola)
- Status prikaz (Verificiran / Čeka odobrenje)
- Toast notifikacije

**Features:**
- Validacija tipa fajla (PDF, JPG, PNG)
- Validacija veličine fajla (max 10MB)
- Automatski OCR processing nakon uploada
- OIB validacija (algoritamska kontrola)
- Name matching validacija

#### B. ProviderCard Component Updates (`uslugar/frontend/src/components/ProviderCard.jsx`)
- Dodan **"✓ Verificiran"** badge za verificirane providere
- Zeleni badge sa tooltip-om

---

## 🔧 Kako Koristiti

### Za Pružatelje Usluga (Freelancere):

1. **Upload Rješenja Porezne uprave**:
   - Idi na Provider Profile
   - Sekcija "KYC-lite Verifikacija"
   - Odaberi PDF/JPG/PNG fajl (Rješenje Porezne uprave)
   - Checkbox: "Dopuštam prikaz podataka na profilu"

2. **Automatska Verifikacija**:
   - OCR extrahira OIB iz dokumenta
   - Validira OIB (kontrolna znamenka)
   - Provjerava podudarnost imena
   - Ažurira profil sa extrahiranim podacima

3. **Admin Odobrenje**:
   - Dokument čeka admin verifikaciju
   - Admin može ručno verificirati ili odbaciti
   - Badge "Verificiran" se pojavljuje nakon odobrenja

### Za Admine:

```
POST /api/kyc/verify/:userId
Body: { notes: "Verificiran - dokument OK" }
```

---

## 📝 GDPR Uskladičnost

✅ **Pravna osnova**: Privola korisnika (GDPR članak 6. stavak 1. točka a)

✅ **Transparencija**: Korisnik daje **eksplicitnu privolu** (checkbox) za prikaz osnovnih podataka na profilu

✅ **Minimalnost podataka**: Samo OIB i ime - bez punog adresnog podatka ili drugih osjetljivih podataka

✅ **Svrha**: Provjerljivost pružatelja usluga javnoj javnosti (klijenti)

✅ **Sigurnost**: Dokumenti se čuvaju sigurno na serveru, OIB se ne kriptira (to je javni broj)

---

## 🔮 Buduće Funkcionalnosti

1. **Stvarni OCR** (Tesseract.js ili cloud OCR API):
   ```javascript
   // Zamijeniti mockOCR sa stvarnim implementacijom
   // Opcije:
   // - Tesseract.js (open-source, lokalno)
   // - Google Vision API
   // - AWS Textract
   // - Azure Form Recognizer
   ```

2. **Dodatne Javne Evidencije**:
   - **Obrtni Registar** (automatska provjera)
   - **Komorski imenik** (odvjetnik/liječnik/arhitekt)
   - **VIES provjera** (PDV - HR PDV ID)

3. **Različiti Tipovi Dokumentata**:
   - OBRT_REGISTRY (Obrtni registar)
   - KAMARA (Komorski imenik)
   - VIES (PDV potvrda)

4. **Automatska Verifikacija s Javnih Registara**:
   - Integracija sa Obrtnim registrom API (ako postoji)
   - Integracija sa komorskim imenikom API (ako postoji)
   - VIES API provjera

---

## 📊 Database Migration

```bash
cd uslugar/backend
npx prisma migrate dev --name add_kyc_verification_fields
```

**Note**: Ako baza nije pokrenuta lokacijski, treba ažurirati bazu preko cloud instance ili manuelno dodati kolone.

---

## 🎉 Status

✅ Schema ažurirana
✅ Backend library kreirana
✅ Backend rute kreirane i registrirane
✅ Frontend komponenta kreirana
✅ Provider badge dodano

**TODO za produkciju**:
- [ ] Integrirati stvarni OCR (Tesseract.js ili cloud API)
- [ ] Kreirati migraciju i pokrenuti na produkciji
- [ ] Testirati na staging okruženju
- [ ] Dodati error handling za edge cases
- [ ] Implementirati Obrtni registar / Komorski imenik / VIES provjere

