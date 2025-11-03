# 🔍 Provjera Statusa Workflow-a

## 📊 Što je pokrenuto:

### 1. Prisma Workflow
**URL:** https://github.com/oriphiel/AWS_projekti/actions/workflows/prisma-uslugar.yml

**Triggeri se kada se promijeni:**
- ✅ `uslugar/backend/prisma/**` (schema, migrations, seeds)
- ✅ `uslugar/backend/src/routes/documentation.js`
- ✅ `uslugar/frontend/src/pages/Documentation.jsx`

**Što radi:**
1. Build Prisma Docker image
2. **Primijeni migracije** → Dodaje `isAdminOnly` kolonu
3. **Pokreni seed** → Dodaje 23 admin funkcionalnosti s detaljnim opisima

**Timeline:** ~5-7 minuta

### 2. Backend Workflow
**URL:** https://github.com/oriphiel/AWS_projekti/actions/workflows/backend-uslugar-ecs.yml

**Triggeri se kada se promijeni:**
- ✅ `uslugar/backend/**` (sve backend promjene)

**Što radi:**
1. Build Docker image s novim route-om
2. Push na AWS ECR
3. Deploy na ECS → `/api/documentation/admin` dostupan

**Timeline:** ~8-12 minuta

### 3. Frontend Workflow
**URL:** https://github.com/oriphiel/AWS_projekti/actions/workflows/frontend-uslugar.yml

**Triggeri se kada se promijeni:**
- ✅ `uslugar/frontend/**` (AdminDocumentation.jsx)

**Što radi:**
1. Build frontend
2. Deploy na Hostinger → Admin dokumentacija dostupna

**Timeline:** ~3-5 minuta

## ✅ Provjeri Status:

1. **Otvori GitHub Actions:**
   https://github.com/oriphiel/AWS_projekti/actions

2. **Provjeri da li su workflow-i pokrenuti:**
   - Traži najnovije workflow run-ove
   - Provjeri da li su zelena ✅ (uspješno) ili crvena ❌ (greška)

3. **Ako workflow NIJE pokrenut:**
   - Provjeri da li je commit pushan
   - Provjeri da li se promijenio neki file iz `paths` liste

## 🔍 Ručno Pokretanje:

Ako workflow nije automatski pokrenut, možeš ga pokrenuti ručno:

1. **Prisma workflow:**
   - Idi na: https://github.com/oriphiel/AWS_projekti/actions/workflows/prisma-uslugar.yml
   - Klikni "Run workflow" → "Run workflow"

2. **Backend workflow:**
   - Idi na: https://github.com/oriphiel/AWS_projekti/actions/workflows/backend-uslugar-ecs.yml
   - Klikni "Run workflow" → "Run workflow"

---

**Status:** ⏳ Provjeri GitHub Actions da vidiš status workflow-a! 🚀

