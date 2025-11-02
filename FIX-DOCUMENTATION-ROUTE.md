# ✅ FIX: Dokumentacija Route Deployment

## Problem:
- `/api/documentation` vraća **404**
- Route postoji u kodu ali nije deployan

## ✅ Rješenje:

### Korak 1: Provjeri da li route postoji lokalno
```powershell
Test-Path "uslugar/backend/src/routes/documentation.js"
# Trebalo bi vratiti: True
```

### Korak 2: Pokreni Prisma workflow (migracije + seed)
👉 https://github.com/oriphiel/AWS_projekti/actions/workflows/prisma-uslugar.yml

**Triggeri se automatski** kada se promijeni:
- `uslugar/backend/src/routes/documentation.js` ✅
- `uslugar/backend/prisma/**` ✅

**Ili ručno:**
1. Klikni "Run workflow"
2. Čekaj da završi (~5 minuta)

### Korak 3: Pokreni Backend workflow (deployment)
👉 https://github.com/oriphiel/AWS_projekti/actions/workflows/backend-uslugar-ecs.yml

**Triggeri se automatski** kada se promijeni:
- `uslugar/backend/**` ✅

**Ili ručno:**
1. Klikni "Run workflow"
2. Čekaj da završi (~8-12 minuta)

## 🔍 Provjera:

**Prisma workflow:**
- ✅ Primijeni migracije → Kreira `DocumentationCategory` i `DocumentationFeature` tablice
- ✅ Pokreni seed → Popuni tablice s podacima

**Backend workflow:**
- ✅ Build Docker image → Uključuje `src/routes/documentation.js`
- ✅ Deploy na ECS → Route postaje dostupan

## ⚠️ Ako i dalje ne radi:

1. **Provjeri da li su tablice kreirane:**
   - Pokreni Prisma workflow ako nisu

2. **Provjeri da li je route u Docker image-u:**
   - Backend workflow bi trebao kopirati `src` direktorij
   - `COPY src ./src` u Dockerfile.prod uključuje routes

3. **Provjeri CloudWatch logs:**
   - AWS Console → CloudWatch → `/ecs/uslugar`
   - Traži greške u backend log stream-ovima

---

**TL;DR:** Pokreni **Prisma workflow** → Zatim **Backend workflow** → Testiraj endpoint! 🚀

