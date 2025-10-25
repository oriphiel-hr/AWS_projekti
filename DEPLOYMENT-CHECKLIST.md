# Deploy Checklist - Anonimno objavljivanje poslova

## ✅ Što je implementirano:

1. **Backend (`uslugar/backend/src/routes/jobs.js`)**:
   - ✅ `POST /api/jobs` - Podržava anonimne korisnike (bez autentifikacije)
   - ✅ Generira `linkingToken` za anonimne korisnike (7 dana valjanost)
   - ✅ Šalje email notifikaciju s linkom za registraciju

2. **Email Template (`uslugar/backend/src/lib/email.js`)**:
   - ✅ `sendAnonymousJobConfirmationEmail()` - Poziva korisnika na registraciju
   - ✅ Sadrži `linkingToken` za povezivanje posla s računom

3. **Linkovanje posla (`uslugar/backend/src/routes/auth.js`)**:
   - ✅ `POST /api/auth/link-job` - Povezuje anonimni posao s korisničkim računom

4. **Database Schema (`uslugar/backend/prisma/schema.prisma`)**:
   - ✅ `Job.userId` - Nullable (omogućava anonimne korisnike)
   - ✅ `Job.linkingToken` - Token za povezivanje
   - ✅ `Job.linkingTokenExpiresAt` - Istek tokena (7 dana)

---

## 🚀 Deployment Steps:

### 1. Database Migration
```bash
cd uslugar/backend
npx prisma migrate dev --name add_anonymous_job_support
# ili
npx prisma db push
```

**Promjene u bazi:**
- `ALTER TABLE "Job" ADD COLUMN "linkingToken" TEXT`
- `ALTER TABLE "Job" ADD COLUMN "linkingTokenExpiresAt" TIMESTAMP`
- `ALTER TABLE "Job" ALTER COLUMN "userId" TYPE TEXT USING "userId"::TEXT` (omogućava NULL)

### 2. Deploy Backend
- Push koda na GitHub → GitHub Actions će deployati
- Ili ručno: upload `uslugar/backend/src/*` na server

### 3. Testiranje

#### Test 1: Anonimni korisnik objavi posao
```bash
curl -X POST https://uslugar.api.oriph.io/api/jobs \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Test posao",
    "description": "Test opis",
    "categoryId": "cat_xxx",
    "anonymous": true,
    "contactEmail": "test@example.com",
    "contactPhone": "0991234567",
    "contactName": "Test Korisnik"
  }'
```

**Očekivano:**
- ✅ Posao se kreira s `userId: null`
- ✅ Email se šalje na `test@example.com`
- ✅ Email sadrži link s `linkingToken`

#### Test 2: Registracija i povezivanje posla
1. Otvori email i klikni na link za registraciju
2. Popuni formu za registraciju
3. Posao se automatski povezuje s novim računom

**Endpoint za ručno povezivanje:**
```bash
curl -X POST https://uslugar.api.oriph.io/api/auth/link-job \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "jobId": "job_xxx",
    "token": "linking_token_from_email"
  }'
```

#### Test 3: Prijavljeni korisnik objavi posao
```bash
curl -X POST https://uslugar.api.oriph.io/api/jobs \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Posao od prijavljenog korisnika",
    "description": "Opis",
    "categoryId": "cat_xxx"
  }'
```

**Očekivano:**
- ✅ Posao se kreira s `userId` prijavljenog korisnika
- ✅ Email se NE šalje (jer nije anonimni korisnik)

---

## ⚠️ Mogući problemi:

### Problem 1: Email se ne šalje
**Razlog:** SMTP nije konfiguriran
**Rješenje:** Provjeri `.env` fajl:
```env
SMTP_HOST=smtp.hostinger.com
SMTP_PORT=587
SMTP_USER=noreply@uslugar.oriph.io
SMTP_PASS=your-password
FRONTEND_URL=https://uslugar.oriph.io
```

### Problem 2: Linking token je istekao
**Razlog:** Token istječe nakon 7 dana
**Rješenje:** Korisnik mora kontaktirati support ili kreirati novi posao

### Problem 3: Prisma error: "userId cannot be null"
**Razlog:** Stari model ne podržava nullable `userId`
**Rješenje:** Pokreni migraciju:
```bash
npx prisma migrate dev
```

---

## 📧 Email Template Preview:

Subject: **Hvala na upitu - Uslugar**

Body:
```
Hvala na upitu! 👋

Poštovani/a [Ime korisnika],

Vaš upit za "[Naslov posla]" je uspješno kreiran! 🎉

Pružatelji usluga su sada u mogućnosti vidjeti vaš upit i poslati vam ponude!

Što dalje?
• Pružatelji usluga će vidjeti vaš upit i moći će vam poslati ponude
• Primit ćete notifikacije o novim ponudama na email [email]
• Možete pregledati i usporediti ponude dok ne odaberete najbolju

💡 Prijava na Uslugar:
Prijavite se za lakše upravljanje upitima i pregled ponuda!

[Button: Registriraj se i poveži upit]

Link ističe za 7 dana.
```

---

## ✅ Checklist prije Production:

- [ ] Database migracija pokrenuta
- [ ] SMTP konfiguriran u `.env`
- [ ] Frontend URL konfiguriran u `.env`
- [ ] Test anonimnog posla prošao
- [ ] Test email notifikacije prošao
- [ ] Test povezivanja posla s računom prošao
- [ ] Logs provjereni (nema error-a)
- [ ] Dokumentacija ažurirana

---

## 📝 Dodatne napomene:

1. **Anonimni poslovi** (`userId: null`) mogu ostati u bazi neograničeno
2. **Linking token** se briše nakon uspješnog povezivanja
3. **Email se ne šalje** ako SMTP nije konfiguriran (graceful fallback)
4. **Frontend** treba dodati UI za anonimne korisnike (check "Nisam registriran")
