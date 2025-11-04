# 🚀 Deployment Instructions - Technical Details

## Brzi način

**Pokreni ovu skriptu direktno u PowerShell:**
```powershell
cd C:\GIT_PROJEKTI\AWS\AWS_projekti
.\DEPLOY-NOW-SIMPLE.ps1
```

## Ili ručno:

```powershell
cd C:\GIT_PROJEKTI\AWS\AWS_projekti

# 1. Add file
git add uslugar/backend/prisma/seeds/seed-documentation.js

# 2. Commit
git commit -m "feat: Dodani technicalDetails za sve javne funkcionalnosti"

# 3. Push (automatski triggera workflow)
git push origin main

# 4. Pokreni workflow ručno (opcionalno)
gh workflow run prisma-uslugar.yml
```

## Provjera

1. **Workflow status:**
   https://github.com/oriphiel/AWS_projekti/actions/workflows/prisma-uslugar.yml

2. **Nakon ~5 minuta, provjeri:**
   - Admin docs: https://uslugar.oriph.io/admin/documentation
   - API: `curl https://uslugar.api.oriph.io/api/documentation/admin`

## Što će se dogoditi

✅ Workflow će:
1. Build Docker image
2. Push u ECR
3. Pokrenuti `prisma migrate deploy`
4. Pokrenuti `prisma db seed` (s novim technicalDetails)

✅ Rezultat:
- Svi `technicalDetails` u bazi podataka
- Admin dokumentacija prikazuje "🔧 Tehnički Detalji"
- API vraća `technicalDetails` za admin funkcionalnosti

