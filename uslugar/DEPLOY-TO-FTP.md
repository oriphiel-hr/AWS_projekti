# 📤 Deployment na FTP (Hostinger)

## Što treba uploadati na FTP

### 1. **Backend** (Node.js API)
📁 Upload lokaciju: `/domains/uslugar.oriph.io/public_html/api/` (ili `/api/`)

**Fajlovi za upload:**
```
backend/
├── src/              ✅ SVI fajlovi
├── prisma/           ✅ SVI fajlovi
├── package.json      ✅
├── package-lock.json ✅
└── .env             ✅ (kreiraj na serveru)
```

**NE uploadaj:**
```
❌ node_modules/     (instaliraj na serveru: npm install)
❌ uploads/          (kreiraj prazan direktorij na serveru)
❌ Dockerfile*
❌ Deploy-*.ps1
❌ *.md fajlovi
```

### 2. **Frontend** (React Build)
📁 Upload lokaciju: `/domains/uslugar.oriph.io/public_html/`

**VAŽNO: Prvo build frontend!**
```bash
cd uslugar/frontend
npm run build
```

**Fajlovi za upload (iz `dist/` direktorija):**
```
frontend/dist/
├── index.html        ✅
├── assets/           ✅ SVE (CSS, JS, ikone)
└── *.ico            ✅
```

**Struktura na FTP-u:**
```
/domains/uslugar.oriph.io/public_html/
├── index.html           (frontend)
├── assets/              (frontend CSS/JS)
├── uslugar.ico          (frontend ikona)
└── api/                 (backend API)
    ├── src/
    ├── prisma/
    ├── package.json
    └── .env
```

## 🚀 Deployment Koraci

### Korak 1: Build Frontend
```powershell
cd uslugar/frontend
npm run build
```
Ovo kreira `dist/` direktorij sa optimiziranim fajlovima.

### Korak 2: Pripremi Backend
Prije uploada, provjeri da su svi novi fajlovi uključeni:
- ✅ `src/lib/upload.js`
- ✅ `src/lib/email.js`
- ✅ `src/lib/socket.js`
- ✅ `src/lib/notifications.js`
- ✅ `src/lib/geo.js`
- ✅ `src/routes/upload.js`
- ✅ `src/routes/chat.js`
- ✅ `src/routes/notifications.js`
- ✅ `src/routes/subscriptions.js`

### Korak 3: Upload na FTP

#### Opcija A: FileZilla (GUI)
1. Otvori FileZilla
2. Konektaj se na Hostinger FTP:
   - Host: `ftp.uslugar.oriph.io` (ili Hostinger FTP host)
   - Username: Tvoj FTP username
   - Password: Tvoj FTP password
   - Port: 21

3. **Upload Frontend:**
   - Lokalno: `C:\GIT_PROJEKTI\AWS\AWS_projekti\uslugar\frontend\dist\*`
   - Remote: `/domains/uslugar.oriph.io/public_html/`
   - Uploadaj: `index.html`, `assets/`, `*.ico`

4. **Upload Backend:**
   - Lokalno: `C:\GIT_PROJEKTI\AWS\AWS_projekti\uslugar\backend\`
   - Remote: `/domains/uslugar.oriph.io/public_html/api/`
   - Uploadaj: `src/`, `prisma/`, `package.json`, `package-lock.json`

#### Opcija B: PowerShell FTP Script
```powershell
# Deploy-FTP.ps1
$ftpServer = "ftp://ftp.uslugar.oriph.io"
$ftpUser = "YOUR_FTP_USERNAME"
$ftpPass = "YOUR_FTP_PASSWORD"

# Frontend
Write-Host "Uploading Frontend..."
$frontendFiles = Get-ChildItem "uslugar/frontend/dist" -Recurse -File
foreach ($file in $frontendFiles) {
    $relativePath = $file.FullName.Replace((Get-Location).Path + "\uslugar\frontend\dist\", "")
    $ftpPath = "$ftpServer/public_html/$relativePath"
    # ... FTP upload logic
}

# Backend
Write-Host "Uploading Backend..."
# ... upload backend files
```

### Korak 4: Setup na Hostingeru

#### 1. Kreiraj `.env` fajl na serveru
SSH ili File Manager:
```bash
cd /domains/uslugar.oriph.io/public_html/api
nano .env
```

Sadržaj `.env`:
```env
DATABASE_URL="postgresql://username:password@host:5432/dbname"
JWT_SECRET="your-production-secret-key-min-32-characters"
CORS_ORIGINS="https://uslugar.oriph.io"
FRONTEND_URL="https://uslugar.oriph.io"
SMTP_HOST="smtp.hostinger.com"
SMTP_PORT=587
SMTP_USER="noreply@uslugar.oriph.io"
SMTP_PASS="your-email-password"
PORT=4000
NODE_ENV="production"
```

#### 2. Instaliraj Node.js dependencies
```bash
cd /domains/uslugar.oriph.io/public_html/api
npm install --production
```

#### 3. Pokreni Prisma migracije
```bash
cd /domains/uslugar.oriph.io/public_html/api
npx prisma generate
npx prisma migrate deploy
```

#### 4. Kreiraj `uploads` direktorij
```bash
mkdir -p /domains/uslugar.oriph.io/public_html/api/uploads
chmod 755 /domains/uslugar.oriph.io/public_html/api/uploads
```

#### 5. Postavi Node.js aplikaciju
U Hostinger Control Panel:
- **Node.js App Manager**
- Odaberi Node version: **20.x** (ili najnoviju LTS)
- Application Root: `/domains/uslugar.oriph.io/public_html/api`
- Application URL: `https://uslugar.oriph.io/api`
- Application Startup File: `src/server.js`
- **Start/Restart** aplikaciju

### Korak 5: Postavi .htaccess za Frontend SPA routing
U `/domains/uslugar.oriph.io/public_html/.htaccess`:
```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  
  # Don't rewrite files or directories
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  
  # Don't rewrite API calls
  RewriteCond %{REQUEST_URI} !^/api/
  
  # Rewrite everything else to index.html
  RewriteRule ^ index.html [L]
</IfModule>
```

### Korak 6: Provjeri deployment
```bash
# Test frontend
curl https://uslugar.oriph.io

# Test backend health
curl https://uslugar.oriph.io/api/health

# Test API
curl https://uslugar.oriph.io/api/jobs
```

## 🔧 Troubleshooting

### Frontend se ne prikazuje
- Provjeri je li `index.html` u root direktoriju
- Provjeri putanje u `index.html` (trebaju biti relativne)
- Provjeri `.htaccess` za SPA routing

### Backend ne radi
- Provjeri Node.js verziju (min 20.x)
- Provjeri `.env` varijable
- Provjeri logove: Hostinger Control Panel > Node.js Apps > View Logs
- Provjeri je li aplikacija pokrenuta u Node.js App Manager

### 404 na API endpointima
- Provjeri Application URL u Node.js App Manager
- Provjeri je li backend aplikacija pokrenuta
- Provjeri CORS settings u backendu

### Upload slika ne radi
- Provjeri je li `uploads/` direktorij kreiran
- Provjeri permissions: `chmod 755 uploads/`
- Provjeri disk space

### Socket.io ne radi
- Socket.io možda neće raditi na shared hosting-u
- Razmislite o upgrade na VPS ili dedicated server
- Ili koristite vanjski Socket.io servis (Pusher, Ably)

## 📊 Checklist prije deploymenta

- [ ] Frontend build (`npm run build`)
- [ ] Backend testiran lokalno
- [ ] `.env` fajl pripremljen za produkciju
- [ ] Database connection string točan
- [ ] SMTP credentials točni
- [ ] CORS origins postavljeni na production domain
- [ ] JWT_SECRET promijenjen (min 32 znaka)
- [ ] Migrations spremne
- [ ] `uploads/` direktorij će biti kreiran na serveru

## 🔄 Update Procedure (nakon promjena)

### Frontend update:
```bash
cd uslugar/frontend
npm run build
# Upload samo `dist/*` fajlove na FTP
```

### Backend update:
```bash
# Upload promijenjene fajlove iz `backend/src/`
# SSH na server:
cd /domains/uslugar.oriph.io/public_html/api
# Restart app u Hostinger Node.js App Manager
```

### Database schema promjena:
```bash
# SSH na server:
cd /domains/uslugar.oriph.io/public_html/api
npx prisma migrate deploy
npx prisma generate
# Restart app
```

## 💡 Best Practices

1. **Uvijek buildiraj frontend prije uploada**
2. **Testiraj lokalno prije production deploymenta**
3. **Backup bazu prije migracija**
4. **Koristi environment-specific `.env` fajlove**
5. **Prati logove nakon deploymenta**
6. **Testiraj sve kritične funkcionalnosti nakon deploymenta**

## 📞 Support

Ako imate problema sa deploymentom:
1. Provjeri Hostinger documentation
2. Provjeri Node.js app logove
3. Provjeri browser console za frontend greške
4. Provjeri network tab za API call greške

