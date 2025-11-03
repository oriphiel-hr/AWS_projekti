# Deployment - Technical Details

## Status
✅ `technicalDetails` dodani za sve javne funkcionalnosti u `seed-documentation.js`

## Deployment koraci

### 1. Commit i Push
```powershell
cd C:\GIT_PROJEKTI\AWS\AWS_projekti
git add uslugar/backend/prisma/seeds/seed-documentation.js
git commit -m "feat: Dodani technicalDetails za sve javne funkcionalnosti"
git push origin main
```

### 2. Pokreni Prisma Workflow

**Opcija A: Automatski (preporučeno)**
- Workflow se automatski pokreće na push u `uslugar/backend/prisma/**`
- Provjeri: https://github.com/oriphiel/AWS_projekti/actions/workflows/prisma-uslugar.yml

**Opcija B: Ručno (ako se ne pokrene automatski)**
- Idi na: https://github.com/oriphiel/AWS_projekti/actions/workflows/prisma-uslugar.yml
- Klikni "Run workflow" → "Run workflow"

**Opcija C: GitHub CLI**
```powershell
gh workflow run prisma-uslugar.yml
```

### 3. Čekanje
- Workflow traje ~4-5 minuta
- Uključuje:
  - Build Docker image-a
  - Push u ECR
  - Pokretanje ECS task-a za `npx prisma migrate deploy`
  - Pokretanje ECS task-a za `npx prisma db seed`

### 4. Provjera
Nakon što workflow završi:
- Baza će imati sve `technicalDetails` u `DocumentationFeature` tablici
- API endpoint `/api/documentation` će vratiti `technicalDetails` za admin
- Admin dokumentacija će prikazivati tehnčke detalje

## Što je promijenjeno

- **File:** `uslugar/backend/prisma/seeds/seed-documentation.js`
- **Promjene:** Dodani `technicalDetails` za sve javne funkcionalnosti
- **Struktura:** Svaki `technicalDetails` sadrži:
  - Frontend komponente i route-ove
  - Backend route-ove i endpointe
  - Prisma queries i modele
  - Baza podataka tablice, polja, indekse
  - API pozive s primjerima

## Testiranje nakon deploymenta

1. **Provjeri API:**
   ```bash
   curl https://uslugar.api.oriph.io/api/documentation/admin
   ```
   Trebao bi vratiti `technicalDetails` za admin funkcionalnosti.

2. **Provjeri Admin dokumentaciju:**
   - Otvori: https://uslugar.oriph.io/admin/documentation
   - Trebao bi vidjeti "🔧 Tehnički Detalji" sekcije

3. **Provjeri bazu:**
   - Query: `SELECT COUNT(*) FROM "DocumentationFeature" WHERE "technicalDetails" IS NOT NULL;`
   - Trebao bi vratiti broj funkcionalnosti s `technicalDetails`

