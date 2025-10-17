# 🚨 FIX: AWS Backend 404 Problem

## Problem
Frontend dobiva 404 greške za sve API pozive:
- `GET https://uslugar.api.oriph.io/api/categories` → 404
- `GET https://uslugar.api.oriph.io/api/jobs` → 404
- `GET https://uslugar.api.oriph.io/api/admin/*` → 404

## Uzrok
Backend je na AWS ECS ali:
1. Možda nije ponovno deploy-ovan sa novim route-ima
2. Ili ima runtime problem (env vars, database, itd.)
3. Ili ECS service nije pokrenut

---

## 🔧 RJEŠENJE - Koraci

### 1️⃣ Provjeri GitHub Actions Status

**Idi na:** https://github.com/TVOJ_USERNAME/AWS_projekti/actions

Provjeri:
- Je li workflow `Backend - Reuse existing Task Definition (ECR→ECS)` pokrenut nakon commit-a `0ab2ba8`?
- Je li prošao uspješno? (zelena kvačica ✅)
- Ako je crveni X ❌ - klikni na njega i pogledaj logove

### 2️⃣ Ako workflow NIJE pokrenut ili failed

**Ručno triggeri deployment:**

```bash
# Dodaj malu promjenu u backend-u da triggeruješ workflow
cd uslugar/backend
echo "# Force redeploy" >> README_DEPLOY.txt
git add .
git commit -m "Force backend redeploy to AWS"
git push origin main
```

GitHub Actions će automatski:
1. Build-ovati Docker image
2. Push-ovati na AWS ECR
3. Update-ovati ECS service

**Trajanje:** 5-10 minuta

### 3️⃣ Provjeri AWS ECS Service

**Idi u AWS Console:**

1. **ECS → Clusters** → `apps-cluster`
2. **Services** → `uslugar-service-2gk1f1mv`
3. Provjeri:
   - **Status:** ACTIVE ✅
   - **Running count:** 1 ✅
   - **Desired count:** 1 ✅

Ako je **Running count = 0**:
- Klikni **Update Service**
- Postavi **Number of tasks** na **1**
- Klikni **Update**

### 4️⃣ Provjeri CloudWatch Logs (Debugging)

**AWS Console:**

1. **CloudWatch → Log groups** → `/ecs/uslugar`
2. Klikni na najnoviji **log stream**
3. Traži greške:
   - ❌ `DATABASE_URL` not configured
   - ❌ `Cannot connect to database`
   - ❌ `CORS` errors
   - ❌ Port binding errors

**Najčešće greške:**

#### DATABASE_URL nije postavljen:
```
Error: DATABASE_URL environment variable is not set
```

**Fix:**
1. Idi na **AWS Secrets Manager**
2. Provjeri: `uslugar-db-secret`
3. Provjeri da sadrži valjan `DATABASE_URL`

#### CORS Problem:
```
CORS policy: No 'Access-Control-Allow-Origin' header
```

**Fix:**
U `uslugar/backend/src/server.js` (već je ispravno ali provjeri):
```javascript
const ALLOWED_ORIGINS = (process.env.CORS_ORIGINS || 'https://uslugar.oriph.io')
  .split(',').map(s => s.trim())
```

Trebao bi uključivati: `https://uslugar.oriph.io`

### 5️⃣ Test Backend Health

**Testovi (izvršiti u browseru ili curl):**

```bash
# 1. Health check (ne treba /api prefix)
https://uslugar.api.oriph.io/health
# Očekivano: "ok"

# 2. API Health
https://uslugar.api.oriph.io/api/health
# Očekivano: {"ok":true,"ts":"..."}

# 3. Categories
https://uslugar.api.oriph.io/api/categories
# Očekivano: [] ili array kategorija

# 4. Jobs
https://uslugar.api.oriph.io/api/jobs
# Očekivano: [] ili array poslova
```

### 6️⃣ Ako NIŠTA ne radi - Restart ECS Task

**AWS Console:**

1. **ECS → Clusters** → `apps-cluster`
2. **Services** → `uslugar-service-2gk1f1mv`
3. **Tasks** tab
4. Selektiraj running task
5. Klikni **Stop** (ECS će automatski pokrenuti novi task)

**PAZI:** Ovo će uzrokovati downtime od ~30 sekundi

---

## 🎯 FINALNI TESTOVI

Nakon što backend radi:

### 1. Test u browseru:
Otvori: `https://uslugar.oriph.io`

**Očekivano:**
- ✅ Favicon se učitava (nema 404 greške)
- ✅ Categories dropdown ima opcije
- ✅ Poslovi se prikazuju
- ✅ Admin panel radi

### 2. Provjeri Network tab (F12):
- ✅ API pozivi vraćaju **200 OK**
- ✅ CORS headeri su prisutni
- ✅ Response ima podatke (JSON)

---

## 📊 Quick Checklist

- [ ] GitHub Actions workflow prošao uspješno
- [ ] ECS service je ACTIVE sa 1 running task
- [ ] CloudWatch logs ne pokazuju greške
- [ ] `/health` endpoint vraća "ok"
- [ ] `/api/health` endpoint vraća JSON
- [ ] `/api/categories` vraća podatke (ili [])
- [ ] Frontend u browseru ne pokazuje 404 greške

---

## 🆘 Ako ništa ne pomaže

### Debug lokalno:

```bash
# 1. Pull-aj najnovije promjene
git pull origin main

# 2. Idi u backend direktorij
cd uslugar/backend

# 3. Instaliraj dependencies
npm install

# 4. Postavi .env
cp ENV_EXAMPLE.txt .env
# Ažuriraj DATABASE_URL sa pravim connection stringom

# 5. Generiraj Prisma client
npx prisma generate

# 6. Pokreni lokalno
npm run dev
```

**Test lokalno:**
```
http://localhost:4000/api/health
http://localhost:4000/api/categories
http://localhost:4000/api/jobs
```

Ako radi lokalno ali ne na AWS → **Problem je u AWS konfiguraciji** (env vars, secrets, itd.)

---

## 📞 Dodatna Pomoć

- GitHub Actions docs: `.github/workflows/backend-uslugar-ecs.yml`
- AWS ECS docs: `uslugar/README-DEPLOY-ECS.md`
- Backend features: `uslugar/backend/FEATURES_README.md`

---

**Autor:** AI Assistant  
**Datum:** 2025-10-17

