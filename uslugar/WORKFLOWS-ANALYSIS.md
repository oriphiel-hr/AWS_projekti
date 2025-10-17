# 🔍 GitHub Actions Workflows - Analiza i Konfiguracija

**Datum:** 17. listopada 2025.

---

## 📊 Dostupni Workflow-i

### 1. **`frontend-uslugar.yml`** ✅ GLAVNI WORKFLOW

**Naziv:** Frontend - Build & Deploy (Hostinger)  
**Status:** ✅ **SPREMAN - Koristi ovaj!**

#### Kada se pokreće:
- ✅ Push na `main` branch (promjene u `uslugar/frontend/**`)
- ✅ Ručno (workflow_dispatch)

#### Što radi:
1. **Detektira framework** → Vite
2. **Builda frontend** → `npm ci && npm run build`
3. **Kreira** → `dist/` direktorij
4. **Deploya na FTP** → `public_html/` (root domene)

#### FTP Deploy konfiguracija:
```yaml
server: HOSTINGER_HOST           # Secret
username: HOSTINGER_USERNAME     # Secret
password: HOSTINGER_PASSWORD     # Secret
protocol: ftps
port: 21
local-dir: uslugar/frontend/dist/
server-dir: public_html/          # ✅ FIXED - root domene
dangerous-clean-slate: true       # Briše stare fajlove
```

#### Exclude pattern:
```
**/.git*
**/node_modules/**
**/.DS_Store
```

#### Output:
- **Frontend dostupan na:** `https://uslugar.oriph.io/` ✅

---

### 2. **`uslugar-hostinger-ftp.yml`** (Novi - samo frontend)

**Naziv:** Uslugar - Deploy Frontend to Hostinger  
**Status:** ✅ **Backup workflow**

#### Razlika od `frontend-uslugar.yml`:
- Jednostavnija verzija
- Nije aggressive cleanup (`dangerous-clean-slate: false`)
- Direktni build bez framework detekcije

**Koristi:** Ako želite sigurniji deployment (ne briše sve stare fajlove)

---

### 3. **`backend-uslugar-ecs.yml`** (AWS deployment)

**Naziv:** Backend - Reuse existing Task Definition (ECR→ECS)  
**Status:** ✅ **Za AWS ECS** (alternativa Hostingeru)

#### Kada se pokreće:
- Push na `main` (promjene u `uslugar/backend/**`)
- **NE** deploya na Hostinger FTP
- Deploya Docker container na AWS ECS

#### Koristi:
- Ako želite backend na AWS umjesto Hostingera
- Za production sa scalability

---

## 🔑 GitHub Secrets - Što trebate

Za Hostinger FTP deployment potrebni su:

```
HOSTINGER_HOST=ftp.uslugar.oriph.io
HOSTINGER_USERNAME=vaš_ftp_username
HOSTINGER_PASSWORD=vaš_ftp_password
```

**Opcionalno:**
```
HOSTINGER_SERVER_DIR=public_html/    # Default ako nije postavljen
```

### Kako dodati Secrets:

1. GitHub repo → **Settings**
2. **Secrets and variables** → **Actions**
3. **New repository secret**
4. Dodaj svaki secret

---

## 📁 Deploy Struktura - `frontend-uslugar.yml`

### Lokalno (prije build-a):
```
uslugar/frontend/
├── src/
├── public/
├── index.html
├── package.json
└── vite.config.js
```

### Nakon build-a:
```
uslugar/frontend/dist/
├── index.html
└── assets/
    ├── index-[hash].css
    └── index-[hash].js
```

### Na FTP serveru:
```
/domains/uslugar.oriph.io/public_html/
├── index.html              ← iz dist/
└── assets/                 ← iz dist/assets/
    ├── index-[hash].css
    └── index-[hash].js
```

### Rezultat:
- **URL:** `https://uslugar.oriph.io/`
- **API:** `https://uslugar.oriph.io/api/` (backend već postavljen ručno)

---

## ✅ Preporuke za Korištenje

### Za Production:

**Koristi:** `frontend-uslugar.yml`

**Razlozi:**
- ✅ Automatska framework detekcija
- ✅ Aggressive cleanup (`dangerous-clean-slate: true`)
- ✅ Debug output (lista build artifakata)
- ✅ Robustan error handling

### Deployment Flow:

```bash
# 1. Napravi promjene u frontendu
cd uslugar/frontend/src
# ... edit fajlove ...

# 2. Test lokalno
npm run dev
# ... test promjene ...

# 3. Commit i push
git add .
git commit -m "Update frontend: [opis promjene]"
git push origin main

# 4. Prati deployment
# GitHub > Actions tab
# Klikni na zadnji workflow run
# Prati output

# 5. Provjeri live site
curl https://uslugar.oriph.io
# ili otvori u browseru
```

---

## 🐛 Troubleshooting

### ❌ Workflow ne startuje

**Problem:** Push ne triggerira workflow

**Provjeri:**
1. Je li push na `main` branch?
   ```bash
   git branch  # Trebao bi pokazati * main
   ```

2. Jesu li promijenjeni fajlovi u `uslugar/frontend/**`?
   ```bash
   git status
   git log -1 --stat
   ```

3. Je li workflow fajl ispravan?
   ```bash
   # Provjeri syntax na: https://www.yamllint.com/
   ```

### ❌ Build fails

**Greška:** `npm ci` ili `npm run build` failuje

**Debug:**
```bash
# Lokalno:
cd uslugar/frontend
rm -rf node_modules package-lock.json
npm install
npm run build
# Ako lokalno radi, problem je u GitHub Actions
```

**Provjeri:**
- `package.json` je committan
- `package-lock.json` postoji (ili će biti auto-kreiran)

### ❌ FTP upload fails

**Greška:** Connection refused ili authentication failed

**Provjeri:**
1. GitHub Secrets su točni
   ```
   Settings > Secrets > Actions
   - HOSTINGER_HOST
   - HOSTINGER_USERNAME  
   - HOSTINGER_PASSWORD
   ```

2. FTP je aktivan na Hostingeru
   - Hostinger Panel > FTP Accounts

3. Port 21 nije blokiran
   - Workflow koristi FTPS na port 21

### ❌ Site ne radi nakon deploymenta

**Problem:** 404 ili stara verzija

**Rješenja:**
1. **Očisti browser cache**
   ```
   Ctrl + Shift + R (hard refresh)
   ```

2. **Provjeri FTP upload**
   - FileZilla > Connect > `/public_html/`
   - Provjeri jesu li novi fajlovi tamo

3. **Provjeri .htaccess za SPA routing**
   ```apache
   # /public_html/.htaccess
   RewriteEngine On
   RewriteCond %{REQUEST_FILENAME} !-f
   RewriteCond %{REQUEST_FILENAME} !-d
   RewriteCond %{REQUEST_URI} !^/api/
   RewriteRule ^ index.html [L]
   ```

---

## 📊 Workflow Comparison

| Feature | frontend-uslugar.yml | uslugar-hostinger-ftp.yml |
|---------|---------------------|---------------------------|
| **Framework detection** | ✅ Automatski | ❌ Ručno |
| **Cleanup** | ✅ Aggressive | ⚠️ Partial |
| **Debug output** | ✅ Extensive | ⚠️ Basic |
| **Error handling** | ✅ Robust | ⚠️ Simple |
| **Recommended** | ✅ **DA** | Backup |

---

## 🎯 Quick Commands

### Ručni Trigger Workflow:
```bash
# GitHub UI:
# Actions > Frontend - Build & Deploy > Run workflow > Run workflow
```

### Provjeri Deployment Status:
```bash
# Test site
curl https://uslugar.oriph.io

# Check API (backend)
curl https://uslugar.oriph.io/api/health

# Detaljno
curl -I https://uslugar.oriph.io  # Headers
```

### View Logs:
```bash
# GitHub:
# Actions > [workflow run] > [job] > Expand steps

# Hostinger (backend logs):
# Control Panel > Node.js Apps > View Logs
```

---

## ✅ Finalni Status

| Workflow | Status | Koristi za |
|----------|--------|-----------|
| `frontend-uslugar.yml` | ✅ **READY** | Frontend deployment |
| `uslugar-hostinger-ftp.yml` | ✅ Backup | Alternative frontend |
| `backend-uslugar-ecs.yml` | ✅ AWS Only | Backend na AWS |

---

## 📝 Zaključak

**Za production deployment frontend-a na Hostinger:**

1. ✅ **Koristi:** `frontend-uslugar.yml`
2. ✅ **Postavlja:** GitHub Secrets (HOSTINGER_*)
3. ✅ **Push na:** `main` branch
4. ✅ **Automatski deploya na:** `https://uslugar.oriph.io/`

**Backend:**
- Deploya se ručno preko FTP ili SSH
- Ili koristi AWS ECS workflow za containerized deployment

---

**Sve je konfigurirano i spremno! 🚀**

