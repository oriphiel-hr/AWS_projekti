# 🤖 GitHub Actions Automatic Deployment

## 📋 Pregled

Postoje **2 workflow-a** za deployment Uslugar aplikacije:

### 1. **Hostinger FTP Deployment** (NOVI) ⭐
- **Workflow:** `.github/workflows/uslugar-hostinger-ftp.yml`
- **Kada se pokreće:** Push na `main` branch (frontend/backend promjene) ili ručno
- **Što radi:** 
  - Builda React frontend
  - Deploya frontend na Hostinger FTP
  - Deploya backend fajlove na Hostinger FTP
- **Platforma:** Hostinger Shared Hosting

### 2. **AWS ECS Deployment** (Postojeći)
- **Workflow:** `.github/workflows/backend-uslugar-ecs.yml`
- **Kada se pokreće:** Push na `main` branch (samo backend promjene)
- **Što radi:**
  - Builda Docker image
  - Pusha na AWS ECR
  - Deploya na AWS ECS
- **Platforma:** AWS (Elastic Container Service)

---

## 🚀 Hostinger FTP Deployment (Preporučeno za production)

### Setup - GitHub Secrets

Dodaj ove secrets u GitHub repo settings (`Settings` > `Secrets and variables` > `Actions`):

```
HOSTINGER_HOST=ftp.uslugar.oriph.io
HOSTINGER_USERNAME=vaš_ftp_username
HOSTINGER_PASSWORD=vaš_ftp_password
HOSTINGER_PUBLIC_HTML=public_html/    # Optional, default vrijednost
HOSTINGER_API_DIR=public_html/api/    # Optional, default vrijednost
```

### Kako radi

#### Automatski Deployment:
```bash
# 1. Napravi promjene u kodu
git add .
git commit -m "Update features"
git push origin main

# 2. GitHub Actions će automatski:
#    - Detektirati promjene u uslugar/frontend/** ili uslugar/backend/**
#    - Pokrenuti workflow
#    - Buildati frontend (npm run build)
#    - Uploadati dist/ na FTP (frontend)
#    - Uploadati src/, prisma/, package.json na FTP (backend)
```

#### Ručni Deployment:
1. Idi na GitHub repo
2. Klikni **Actions** tab
3. Odaberi **Uslugar - Deploy to Hostinger**
4. Klikni **Run workflow** > **Run workflow**

### Što se deploya

#### Frontend:
```
uslugar/frontend/dist/ → /public_html/
├── index.html
└── assets/
    ├── *.css
    └── *.js
```

#### Backend:
```
uslugar/backend/ → /public_html/api/
├── src/          ✅ SVI fajlovi
├── prisma/       ✅ Schema + migrations
├── package.json  ✅
└── package-lock.json ✅

EXCLUDES:
❌ node_modules/
❌ uploads/
❌ .env
❌ Dockerfile*
❌ *.md fajlovi
```

### Nakon deploymenta - Obavezni koraci na serveru

**SSH na Hostinger:**
```bash
ssh username@uslugar.oriph.io

cd /domains/uslugar.oriph.io/public_html/api

# 1. Install dependencies (NOVO!)
npm install

# 2. Prisma setup
npx prisma generate
npx prisma migrate deploy

# 3. Kreiraj uploads direktorij
mkdir -p uploads
chmod 755 uploads

# 4. Provjeri .env
cat .env
# Ako ne postoji ili treba update:
nano .env
# (kopiraj iz ENV_EXAMPLE.txt)

# 5. Restart Node.js app
# Idi u Hostinger Control Panel > Node.js Apps > Restart
```

### Monitoring

Nakon deployment-a, provjeri logove:

**GitHub Actions:**
- Idi na **Actions** tab u repo
- Klikni na zadnji workflow run
- Pogledaj output svakog step-a

**Hostinger:**
- Control Panel > Node.js Apps > **View Logs**
- Provjeri za greške u startup-u

### Troubleshooting

#### ❌ Build fails
```bash
# Lokalno:
cd uslugar/frontend
npm ci
npm run build
# Ako lokalno radi, push će također raditi
```

#### ❌ FTP connection fails
- Provjeri GitHub Secrets (HOSTINGER_*)
- Provjeri da je FTP aktivan u Hostinger panelu
- Provjeri da koristiš ispravne credentials

#### ❌ Backend ne startuje nakon deploymenta
```bash
# SSH na server:
cd /public_html/api
npm install  # ⚠️ KLJUČNO!
npx prisma generate
# Restart app
```

#### ❌ "Cannot find module" greške
```bash
# Nova dependencies nisu instalirane
cd /public_html/api
rm -rf node_modules package-lock.json
npm install
# Restart
```

---

## ⚙️ AWS ECS Deployment (Za VPS/kontejnere)

Ako želite koristiti AWS umjesto Hostinger-a:

### Setup - AWS OIDC Role
Trebate AWS IAM Role sa OIDC trust policy za GitHub Actions.

### GitHub Secrets za AWS:
```
AWS_OIDC_ROLE_ARN=arn:aws:iam::123456789:role/GitHubActionsRole
AWS_REGION=eu-north-1
```

### Workflow
- Automatski se pokreće na push kad se mijenja `uslugar/backend/**`
- Builda Docker image koristeći `Dockerfile.prod`
- Pusha na AWS ECR
- Deploya na ECS cluster

---

## 🔄 Deployment Workflow Comparison

| Feature | Hostinger FTP | AWS ECS |
|---------|--------------|---------|
| **Platform** | Shared Hosting | Container Service |
| **Setup Complexity** | ⭐ Jednostavno | ⭐⭐⭐ Napredno |
| **Cost** | 💰 Nisko | 💰💰💰 Više |
| **Scalability** | Limitirano | Visoko |
| **Socket.io Support** | ❌ Ne | ✅ Da |
| **Auto-scaling** | ❌ Ne | ✅ Da |
| **Deployment Speed** | ⚡ Brzo (FTP) | 🐢 Sporije (Docker) |
| **Best For** | MVP, Small Apps | Production, High Traffic |

---

## 📝 Workflow Files Lokacije

```
.github/workflows/
├── uslugar-hostinger-ftp.yml    ⭐ NOVI - Za Hostinger
├── frontend-uslugar.yml          (Stari - samo frontend)
└── backend-uslugar-ecs.yml       (Za AWS ECS)
```

---

## ✅ Best Practices

### 1. Testiranje prije push-a
```bash
# Frontend
cd uslugar/frontend
npm ci
npm run build
npm run preview  # Test build lokalno

# Backend
cd uslugar/backend
npm ci
node src/server.js  # Test server lokalno
```

### 2. Incremental deployment
```bash
# Samo frontend
git add uslugar/frontend/
git commit -m "Update frontend"
git push

# Samo backend
git add uslugar/backend/
git commit -m "Update backend API"
git push
```

### 3. Rollback strategy
```bash
# Ako deployment fails, rollback:
git revert HEAD
git push
# Ili deploy prethodnu verziju ručno kroz GitHub Actions
```

### 4. Monitor deployments
- Uvijek provjeri GitHub Actions status nakon push-a
- Provjeri Hostinger logs nakon deploymenta
- Test sve kritične endpointe

---

## 🎯 Quick Start

### Prvi put setup:

1. **Dodaj GitHub Secrets:**
   - Repository > Settings > Secrets and variables > Actions
   - Dodaj HOSTINGER_HOST, HOSTINGER_USERNAME, HOSTINGER_PASSWORD

2. **Push kod:**
   ```bash
   git add .
   git commit -m "Initial deployment"
   git push origin main
   ```

3. **Prati deployment:**
   - GitHub > Actions tab
   - Čekaj da završi (obično 2-5 min)

4. **SSH i završi setup:**
   ```bash
   ssh user@server
   cd /public_html/api
   npm install
   npx prisma generate
   npx prisma migrate deploy
   mkdir -p uploads && chmod 755 uploads
   ```

5. **Restart app:**
   - Hostinger Control Panel > Node.js Apps > Restart

6. **Test:**
   ```bash
   curl https://uslugar.oriph.io
   curl https://uslugar.oriph.io/api/health
   ```

---

## 📞 Support

- **GitHub Actions greške:** Provjeri workflow logs u Actions tab
- **FTP greške:** Provjeri Hostinger FTP credentials i permissions
- **Runtime greške:** SSH na server i provjeri Node.js app logs

---

**Status:** ✅ Workflow spreman za korištenje!  
**Datum:** 17. listopada 2025.

