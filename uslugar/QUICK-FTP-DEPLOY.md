# 🚀 BRZI FTP DEPLOYMENT GUIDE

## ✅ Frontend je BUILDAN i spreman!

Lokacija: `uslugar/frontend/dist/`

## 📤 ŠTO UPLOADATI NA FTP

### 1. FRONTEND (Glavni direktorij)
**FTP Lokacija:** `/domains/uslugar.oriph.io/public_html/`

**Upload ove fajlove iz `frontend/dist/`:**
```
✅ index.html
✅ assets/ (cijeli direktorij)
   ├── index-BD2def_i.css
   └── index-DOaH2sXb.js
✅ uslugar.ico (ako postoji)
```

### 2. BACKEND (API direktorij)
**FTP Lokacija:** `/domains/uslugar.oriph.io/public_html/api/`

**Upload ove direktorije/fajlove iz `backend/`:**
```
✅ src/ (cijeli direktorij sa SVIM novim fajlovima!)
   ├── lib/
   │   ├── auth.js
   │   ├── email.js ⭐ NOVO - POPRAVLJENO
   │   ├── geo.js ⭐ NOVO
   │   ├── notifications.js ⭐ NOVO
   │   ├── prisma.js
   │   ├── socket.js ⭐ NOVO
   │   └── upload.js ⭐ NOVO
   ├── routes/
   │   ├── admin.js
   │   ├── auth.js
   │   ├── categories.js
   │   ├── chat.js ⭐ NOVO
   │   ├── jobs.js (ažuriran)
   │   ├── notifications.js ⭐ NOVO
   │   ├── offers.js (ažuriran)
   │   ├── providers.js
   │   ├── reviews.js
   │   ├── subscriptions.js ⭐ NOVO
   │   ├── upload.js ⭐ NOVO
   │   └── users.js
   └── server.js (ažuriran)

✅ prisma/ (cijeli direktorij)
   ├── schema.prisma (ažuriran)
   └── migrations/

✅ package.json (ažuriran sa novim dependencies)
✅ package-lock.json
```

**⚠️ NE UPLOADAJ:**
```
❌ node_modules/ (instaliraj na serveru)
❌ uploads/ (kreiraj prazan na serveru)
❌ .env (kreiraj direktno na serveru)
❌ *.md fajlovi
❌ Dockerfile*
❌ *.ps1 skripte
```

## 🔧 NAKON UPLOADA - Na serveru (SSH ili Terminal)

### 1. Install Dependencies
```bash
cd /domains/uslugar.oriph.io/public_html/api
npm install
```

Ovo će instalirati nove pakete:
- nodemailer
- multer
- socket.io
- uuid

### 2. Pokreni Prisma
```bash
npx prisma generate
npx prisma migrate deploy
```

### 3. Kreiraj uploads direktorij
```bash
mkdir -p uploads
chmod 755 uploads
```

### 4. Provjeri/kreiraj .env
```bash
nano .env
```

Sadržaj (provjeri sve vrijednosti):
```env
DATABASE_URL="postgresql://user:pass@host:5432/dbname"
JWT_SECRET="super-secret-key-min-32-characters-production"
CORS_ORIGINS="https://uslugar.oriph.io"
FRONTEND_URL="https://uslugar.oriph.io"
SMTP_HOST="smtp.hostinger.com"
SMTP_PORT=587
SMTP_USER="noreply@uslugar.oriph.io"
SMTP_PASS="your-email-password"
PORT=4000
NODE_ENV="production"
```

### 5. Restart Node.js App
U Hostinger Control Panel:
- **Node.js App Manager**
- Klikni **Restart** ili **Stop** pa **Start**

## ✅ PROVJERA

### Test Frontend:
```bash
curl https://uslugar.oriph.io
```
Trebali biste vidjeti HTML kod.

### Test Backend:
```bash
curl https://uslugar.oriph.io/api/health
```
Trebali biste dobiti: `{"ok":true,"ts":"..."}`

### Test Jobs endpoint:
```bash
curl https://uslugar.oriph.io/api/jobs
```
Trebali biste dobiti JSON array poslova.

### Test novi Upload endpoint:
```bash
curl https://uslugar.oriph.io/api/upload/single
```
Trebali biste dobiti 401 (potrebna autorizacija) - što znači da endpoint postoji!

## 🐛 Ako nešto ne radi

### Backend greška "Cannot find module"
```bash
# Na serveru:
cd /domains/uslugar.oriph.io/public_html/api
rm -rf node_modules
npm install
# Restart app
```

### Frontend pokazuje staru verziju
- Očisti browser cache (Ctrl+Shift+R)
- Provjeri je li `index.html` zaista nov
- Provjeri `assets/` direktorij - trebaju biti novi fajlovi

### API vraća 404
- Provjeri je li Node.js app pokrenut u Hostinger Panel
- Provjeri Application URL: mora biti `/api` ili što god ste konfigurirali
- Provjeri `.htaccess` u root-u

### Socket.io ne radi
- Socket.io možda ne radi na shared hosting-u
- Trebat će upgrade na VPS ili dedicated server
- Ili koristite vanjski servis (Pusher, Ably)

## 📋 CHECKLIST

Prije deploymenta:
- [x] Frontend build gotov (`npm run build`)
- [x] Nodemailer greška popravljena
- [ ] Svi fajlovi kopirani na FTP
- [ ] `npm install` pokrenut na serveru
- [ ] Prisma migrate i generate pokrenut
- [ ] `.env` kreiran/ažuriran
- [ ] `uploads/` direktorij kreiran
- [ ] Node.js app restartan
- [ ] Sve testne URL-ove provjerene

## 🎉 GOTOVO!

Ako sve gore prođe, vaša aplikacija je live sa SVIM novim funkcionalnostima:
- ✅ Upload slika
- ✅ Email notifikacije
- ✅ Geolokacija
- ✅ Chat (ako VPS)
- ✅ Subscriptions/Freemium
- ✅ Napredne notifikacije

---

**Datum:** 17. listopada 2025
**Status:** SPREMAN ZA DEPLOYMENT 🚀

