# ✅ Riješenje: Workflow + Prisma Seed

## 📋 Što je napravljeno:

### 1️⃣ Prisma Workflow → Migracije + Seed

**File:** `.github/workflows/prisma-uslugar.yml`

**Što radi:**
1. **Migracije** → Primijeni `add_documentation_models` migraciju
   - Kreira `DocumentationCategory` tablicu
   - Kreira `DocumentationFeature` tablicu

2. **Seed** → Pokreni `npx prisma db seed`
   - Poziva `prisma/seed.js`
   - `seed.js` poziva `prisma/seeds/seed-documentation.js`
   - Popunjava tablice s podacima iz `seed-documentation.js`

**Provjeri:**
👉 https://github.com/oriphiel/AWS_projekti/actions/workflows/prisma-uslugar.yml

**Timeline:** ~5-7 minuta

### 2️⃣ Backend Workflow → AWS ECS Deployment

**File:** `.github/workflows/backend-uslugar-ecs.yml`

**Što radi:**
1. Build Docker image (`Dockerfile.prod`)
   - Kopira `src/routes/documentation.js` ✅
   - Kopira `src/server.js` (route je registriran) ✅

2. Push na AWS ECR
   - Image tag: `uslugar:latest`

3. Deploy na AWS ECS
   - Service: `uslugar-service-2gk1f1mv`
   - Cluster: `apps-cluster`
   - Route dostupan na: `https://uslugar.api.oriph.io/api/documentation`

**Provjeri:**
👉 https://github.com/oriphiel/AWS_projekti/actions/workflows/backend-uslugar-ecs.yml

**Timeline:** ~8-12 minuta

## 🏗️ Arhitektura:

```
┌─────────────────┐
│   Frontend       │
│  (Hostinger)     │
│ uslugar.oriph.io│
└────────┬─────────┘
         │
         │ HTTP → /api/documentation
         │
         ▼
┌─────────────────┐
│   Nginx Proxy    │
│  (frontend host) │
└────────┬─────────┘
         │
         │ proxy_pass → https://uslugar.api.oriph.io/api/documentation
         │
         ▼
┌─────────────────┐
│  Backend API     │
│ (AWS ECS)        │
│uslugar.api.oriph.io│
└────────┬─────────┘
         │
         │ Prisma Client
         │
         ▼
┌─────────────────┐
│  PostgreSQL     │
│  (AWS RDS)      │
│  + Tablice:     │
│  - DocumentationCategory│
│  - DocumentationFeature │
└─────────────────┘
```

## ✅ Provjera:

### Nakon Prisma workflow-a:
- ✅ Tablice `DocumentationCategory` i `DocumentationFeature` postoje
- ✅ Podaci su seedani (uključujući "238 Implementirane funkcionalnosti")

### Nakon Backend workflow-a:
- ✅ Route `/api/documentation` dostupan na `uslugar.api.oriph.io`
- ✅ Vraća JSON s `features` i `featureDescriptions`

### Test:
```powershell
# Direktni backend API
curl https://uslugar.api.oriph.io/api/documentation

# Kroz Nginx proxy (frontend)
curl https://uslugar.oriph.io/api/documentation
```

**Očekivano:**
```json
{
  "features": [...],
  "featureDescriptions": {...}
}
```

## ⏱️ Timeline:

1. **Prisma workflow** pokrenut → ~5-7 minuta
2. **Backend workflow** pokrenut → ~8-12 minuta
3. **Ukupno:** ~15 minuta

## 🔍 Debug:

**Ako ne radi:**

1. **Provjeri Prisma workflow:**
   - Da li je migracija primijenjena?
   - Da li je seed uspješan?
   - CloudWatch logs: `/ecs/uslugar/prisma`

2. **Provjeri Backend workflow:**
   - Da li je Docker build uspješan?
   - Da li je ECS deployment uspješan?
   - CloudWatch logs: `/ecs/uslugar`

3. **Provjeri tablice:**
   - AWS RDS → Provjeri da li tablice postoje
   - Ili kroz Prisma Studio lokalno

---

**Status:** ⏳ Workflow-i se pokreću... Čekaj ~15 minuta! 🚀

