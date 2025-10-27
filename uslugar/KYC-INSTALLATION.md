# KYC-lite Verifikacija - Instalacija i Pokretanje

## 📦 Instalacija

### 1. Instaliraj Dependencies

```bash
cd uslugar/backend
npm install
```

To će instalirati:
- `tesseract.js` - OCR engine
- `sharp` - Image processing

### 2. Pokretanje Migracije

#### Ako je baza LOKALNO dostupna:

```bash
# Razvoj okruženje
npm run migrate:dev --name add_kyc_verification

# Produkcija
npm run migrate:deploy
```

#### Ako baza NIJE dostupna lokacijski:

**Opcija 1: Via SSH na server**
```bash
ssh user@server
cd /path/to/uslugar/backend
psql -U postgres uslugar_db < prisma/migrations/add_kyc_verification/migration.sql
```

**Opcija 2: Direktno SQL poziv**
```bash
# Kopiraj SQL iz migration.sql i izvrši na produkciji
```

**Opcija 3: Cloud Shell (Google/AWS)**
```bash
# Upload migraciju fajl
# Ili copy-paste SQL komande u psql
```

### 3. Testiranje

```bash
npm start
```

Backend će pokrenuti sa Tesseract.js OCR funkcijom.

---

## 🧪 Testiranje KYC Verifikacije

### 1. Start Backend Server

```bash
cd uslugar/backend
npm start
```

### 2. Test Frontend (ako je dostupan)

Otvorite `http://localhost:3000` (ili vaš frontend URL)

### 3. KYC Upload Test

**Metod 1: Via Frontend**
1. Login kao PROVIDER
2. Idi na "KYC Verifikacija" sekciju
3. Upload sample dokument (PDF/JPG/PNG Rješenje Porezne uprave)
4. Checkbox: "Dopuštam prikaz podataka"
5. Click "Upload"

**Metod 2: Via cURL**

```bash
# Test upload dokumenta
curl -X POST http://localhost:4000/api/kyc/upload-document \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "document=@sample-document.pdf" \
  -F "publicConsent=true"
```

**Metod 3: Via Postman**
1. POST: `http://localhost:4000/api/kyc/upload-document`
2. Headers: `Authorization: Bearer YOUR_TOKEN`
3. Body: form-data
   - `document`: (file upload)
   - `publicConsent`: true

---

## 🔧 Konfiguracija

### Environment Variables

U `.env` fajlu:

```env
# KYC Verifikacija
KYC_OCR_ENGINE=tesseract  # ili 'cloud' za cloud OCR
KYC_MIN_CONFIDENCE=70     # OCR confidence threshold (0-100)

# Obrtni Registar (opcionalno)
OBRT_API_URL=https://api.obrt.hr/v1
OBRT_API_KEY=your-key

# Komorski Imenik (opcionalno)
KAMARA_API_URL=https://api.hok.hr/v1
KAMARA_API_KEY=your-key

# VIES (opcionalno)
VIES_API_URL=http://ec.europa.eu/taxation_customs/vies
```

---

## 🚀 Deploy na Produkciju

### 1. AWS ECS / Cloud Instance

```bash
# SSH na server
ssh ec2-user@your-server

# Navigate to backend
cd /var/www/uslugar/backend

# Pull latest code
git pull origin main

# Install dependencies
npm install

# Run migration
npm run migrate:deploy

# Restart server
pm2 restart uslugar-backend
# ili
systemctl restart uslugar-backend
```

### 2. Docker / Container

```dockerfile
# Dockerfile već ima npm install
# Samo rebuild i restart container:
docker-compose down
docker-compose up -d --build
```

---

## 📊 Monitoring

### Provjeriti da li OCR radi:

```bash
# Log check
tail -f logs/kyc-verification.log

# Ili ako koristi server logs:
pm2 logs uslugar-backend | grep OCR
```

### Provjeriti da li su polja dodana u DB:

```sql
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'ProviderProfile' 
AND column_name LIKE 'kyc%';
```

---

## 🐛 Troubleshooting

### Problem: Tesseract.js nije instaliran

**Rješenje:**
```bash
npm install tesseract.js
```

### Problem: OCR greška "Worker failed to initialize"

**Rješenje:**
- Provjeri da li je `tesseract.js` instaliran
- Ako ne radi, system će fallback na simulaciju

### Problem: Migracija ne radi

**Rješenje:**
```bash
# Ručno pokreni SQL
psql -U postgres uslugar_db < prisma/migrations/add_kyc_verification/migration.sql
```

### Problem: Frontend ne prikazuje KYC formu

**Rješenje:**
- Provjeri da li je `KYCVerification.jsx` importan u app
- Provjeri da li API vraća `kycVerified` field

---

## ✅ Checklist za Deploy

- [ ] Dependencies instalirane (`npm install`)
- [ ] Migracija pokrenuta (`npm run migrate:deploy`)
- [ ] Environment variables postavljene
- [ ] Backend restarted
- [ ] Frontend rebuilt (ako ima)
- [ ] Test upload jedan dokument
- [ ] Provjeri logs za OCR errors
- [ ] Provjeri da li se badge pojavljuje

---

## 📞 Support

Ako imate problema:
1. Provjeri logs: `tail -f logs/kyc-verification.log`
2. Provjeri API: `curl http://localhost:4000/api/kyc/status`
3. Contact: support@uslugar.hr

