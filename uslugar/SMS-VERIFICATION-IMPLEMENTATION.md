# SMS Verifikacija - Implementacija

## 📋 Pregled

Implementiran je kompletan SMS verifikacijski sustav koristeći Twilio za slanje SMS poruka. Korisnici mogu verificirati svoj broj telefona kroz jednostavan UI proces.

## ✅ Implementirano

### 1. Twilio Setup (~30 min)
- ✅ Instaliran `twilio` npm paket
- ✅ Ažuriran `sms-service.js` da koristi Twilio API
- ✅ Fallback na simulation mode ako Twilio nije konfiguriran

**Environment Variables:**
```env
TWILIO_ACCOUNT_SID=your_account_sid
TWILIO_AUTH_TOKEN=your_auth_token
TWILIO_PHONE_NUMBER=+1234567890
```

### 2. Prisma Schema Update (~5 min)
Dodana polja u `User` model:
- `phoneVerified` - Status verifikacije (Boolean)
- `phoneVerificationCode` - 6-znamenkasti kod (String, unique)
- `phoneVerificationExpires` - Istek koda (DateTime, 10 minuta)
- `phoneVerificationAttempts` - Broj pokušaja (Int, max 5)
- `phoneVerifiedAt` - Datum verifikacije (DateTime)

### 3. Backend Endpoints (~1 sat)
**`/api/sms-verification/send`** (POST)
- Validira format telefona (+385XXXXXXXXX)
- Generira 6-znamenkasti kod
- Šalje SMS preko Twilio
- Postavlja expiration (10 minuta)
- Rate limiting (max 5 pokušaja)

**`/api/sms-verification/verify`** (POST)
- Validira kod (6 znamenki)
- Provjerava expiration
- Provjerava pokušaje (max 5)
- Ažurira `phoneVerified = true`
- Ažurira `ProviderProfile.identityPhoneVerified` ako je provider

**`/api/sms-verification/status`** (GET)
- Vraća status verifikacije
- Prikazuje preostale pokušaje
- Provjerava aktivni kod

### 4. Frontend Integracija (~1-2 sata)

#### Komponenta `PhoneVerification.jsx`
- Automatski provjerava status verifikacije
- UI za slanje SMS koda
- Forma za unos i verifikaciju koda
- Countdown timer (60s za resend)
- Rate limiting UI (prikaz preostalih pokušaja)
- Success/error poruke

#### Integracija u `ProviderProfile.jsx`
- Dodana sekcija za telefon
- Prikaz PhoneVerification komponente
- Auto-refresh nakon verifikacije

#### API Client (`api/sms.js`)
- `sendVerificationCode(phone)`
- `verifyCode(code)`
- `getVerificationStatus()`

### 5. Migration (~5 min)
Kreiran SQL migration:
- Dodaje sva potrebna polja
- Kreira indekse za brže upite
- `IF NOT EXISTS` za siguran deployment

## 🔄 Kako radi

1. **Korisnik unese telefon** (pri registraciji ili u profilu)
2. **Klikne "Pošalji SMS kod"** → Backend:
   - Generira 6-znamenkasti kod
   - Šalje SMS preko Twilio
   - Sprema kod s expiration (10 min)
3. **Korisnik unese kod** → Backend:
   - Validira kod
   - Provjerava expiration
   - Provjerava pokušaje
   - Ažurira `phoneVerified = true`
4. **Success** → Frontend prikazuje potvrdu

## 📊 Sigurnost

- **Rate Limiting**: Max 5 pokušaja verifikacije
- **Expiration**: Kod vrijedi 10 minuta
- **Format Validation**: Hrvatski format (+385XXXXXXXXX)
- **Unique Codes**: Svaki kod je unique u bazi
- **Attempts Tracking**: Svi pokušaji se prate

## 🧪 Testiranje

### Development Mode
- Kod se prikazuje u console i response (ako je `NODE_ENV=development`)
- SMS se simulira u console

### Production Mode
- Kod se šalje stvarno preko Twilio
- Kod se ne vraća u response

### Test Scenarios
1. **Slanje koda** → Provjeri da SMS stiže
2. **Verifikacija s ispravnim kodom** → Success
3. **Verifikacija s neispravnim kodom** → Error + pokušaj se broji
4. **5 pogrešnih pokušaja** → Rate limit error
5. **Istekao kod** → Error zahtijeva novi kod
6. **Resend** → Novi kod se generira

## 🚀 Deployment

1. **Dodaj Twilio credentials u environment variables**:
   ```env
   TWILIO_ACCOUNT_SID=...
   TWILIO_AUTH_TOKEN=...
   TWILIO_PHONE_NUMBER=...
   ```

2. **Migration će se pokrenuti automatski** pri pokretanju containera

3. **Backend & Frontend** - standardni deployment proces

## 📝 Napomene

- U developmentu, kod se prikazuje u response za lakše testiranje
- Simulation mode radi ako Twilio nije konfiguriran
- Provider-ima se automatski ažurira `identityPhoneVerified` badge
- SMS se koristi i za notifikacije (leadovi, refund, itd.)

