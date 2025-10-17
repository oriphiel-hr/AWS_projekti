# DEPLOY BACKEND - Brzi vodič

## ⚠️ PROBLEM: Backend ne radi!

Trenutno dobijaš 404 greške jer backend nije deploy-ovan na `https://uslugar.api.oriph.io`

## 📦 Datoteke za Backend Deployment

Upload ove datoteke na FTP:

```
uslugar/backend/
├── src/                    ⭐ Cijeli folder
│   ├── lib/
│   ├── routes/
│   ├── services/
│   └── server.js
├── prisma/                 ⭐ Cijeli folder
│   ├── migrations/
│   ├── schema.prisma
│   └── seed.js
├── package.json            ⭐ Obavezno
├── package-lock.json       ⭐ Obavezno
└── .env                    ⭐ Kreiraj na serveru (NE commituj u Git!)
```

## 🎯 FTP Upload lokacija

**Opcija A:** Subdomena setup (PREPORUČENO)
- Upload na: `/domains/uslugar.api.oriph.io/public_html/`
- Backend će biti dostupan na: `https://uslugar.api.oriph.io`

**Opcija B:** Subfolder setup
- Upload na: `/domains/uslugar.oriph.io/public_html/api/`
- Backend će biti dostupan na: `https://uslugar.oriph.io/api`

## 📋 Koraci za Deployment

### 1. Upload datoteka na FTP
- Kopiraj sve iz `uslugar/backend/` (osim `node_modules/`)
- Lokacija: prema opciji A ili B iznad

### 2. SSH u server i setup:

```bash
# Idi u backend direktorij
cd /domains/uslugar.api.oriph.io/public_html/
# ili
cd /domains/uslugar.oriph.io/public_html/api/

# Install dependencies
npm install

# Generiraj Prisma client
npx prisma generate

# Deploy database migrations
npx prisma migrate deploy

# Kreiraj uploads direktorij
mkdir -p uploads
chmod 755 uploads
```

### 3. Kreiraj .env fajl:

```bash
nano .env
```

Kopiraj sadržaj iz `uslugar/backend/ENV_EXAMPLE.txt` i ažuriraj:

```env
# Database
DATABASE_URL=postgresql://user:password@host:port/database

# JWT
JWT_SECRET=tvoj_random_secret_key_ovdje

# Server
PORT=4000
NODE_ENV=production

# CORS
CORS_ORIGINS=https://uslugar.oriph.io

# SMTP (opciono)
SMTP_HOST=smtp.hostinger.com
SMTP_PORT=465
SMTP_SECURE=true
SMTP_USER=tvoj@email.com
SMTP_PASS=tvoja_lozinka
SMTP_FROM=tvoj@email.com
```

### 4. Restart Node.js App

**U Hostinger Control Panel:**
1. Idi na "Advanced" > "Node.js Apps"
2. Klikni "Create Application"
3. Postavi:
   - **Version:** 20.x (najnovija)
   - **Application mode:** Production
   - **Application root:** Odaberi backend direktorij
   - **Application URL:** `uslugar.api.oriph.io` ili `uslugar.oriph.io/api`
   - **Application startup file:** `src/server.js`
4. Klikni "Create"

### 5. Test Backend

```bash
# Health check
curl https://uslugar.api.oriph.io/health
# Očekuješ: "ok"

curl https://uslugar.api.oriph.io/api/health
# Očekuješ: {"ok":true,"ts":"..."}

# Categories endpoint
curl https://uslugar.api.oriph.io/api/categories
# Očekuješ: [] ili array kategorija

# Jobs endpoint
curl https://uslugar.api.oriph.io/api/jobs
# Očekuješ: [] ili array poslova
```

## ✅ Rezultat

Nakon što backend radi:
- Frontend će moći dohvatiti `/api/categories` ✅
- Frontend će moći dohvatiti `/api/jobs` ✅
- Admin panel će raditi (`/api/admin/*`) ✅
- CRUD će raditi (`/api/admin/jobs`, etc.) ✅

## 🔍 Troubleshooting

### Backend ne startuje:
1. Provjeri je li Node.js app kreiran u Hostinger Panel
2. Provjeri logove u Panel > Node.js Apps > View Logs
3. Provjeri je li `.env` pravilno postavljen
4. Provjeri je li `npm install` uspješno završio

### 404 greške:
1. Provjeri je li backend uopće pokrenut
2. Provjeri URL - `https://uslugar.api.oriph.io/api/...` ili `https://uslugar.oriph.io/api/...`
3. Provjeri CORS settings u backendu

### Database greške:
1. Provjeri DATABASE_URL u .env
2. Provjeri je li Prisma migrate deploy uspješno izvršen
3. Provjeri ima li PostgreSQL baza potrebne tablice

## 📞 Dodatna pomoć

Pogledaj detaljne vodiče:
- `FINAL-DEPLOYMENT-GUIDE.md` - Kompletni deployment guide
- `DEPLOYMENT-STATUS.md` - Status i checklist
- `backend/FEATURES_README.md` - Backend dokumentacija

