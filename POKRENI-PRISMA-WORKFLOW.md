# 🚀 Kako pokrenuti Prisma Workflow

## Automatski (preporučeno)

Workflow se automatski pokreće kada pushaš promjene u:
- `uslugar/backend/prisma/**`
- `uslugar/frontend/src/pages/Documentation.jsx`
- `uslugar/backend/src/routes/documentation.js`

### Koraci:

```powershell
# 1. Dodaj promjene
git add -A

# 2. Commit
git commit -m "chore: Trigger Prisma workflow - dokumentacija iz baze"

# 3. Push
git push origin main
```

Nakon push-a, workflow će se automatski pokrenuti na GitHub Actions.

## Ručno kroz GitHub UI

1. Idi na: https://github.com/oriphiel/AWS_projekti/actions
2. Klikni na **"Prisma - Build/Push & Migrate (ECR→ECS)"**
3. Klikni **"Run workflow"** → odaberi **"main"** → **"Run workflow"**

## Ručno kroz GitHub CLI

```bash
gh workflow run .github/workflows/prisma-uslugar.yml
```

## Što workflow radi

1. **prisma job**:
   - Builda Prisma Docker image
   - Pusha na AWS ECR
   - Primjenjuje migracije (`npx prisma migrate deploy`)
   - Kreira tablice `DocumentationCategory` i `DocumentationFeature`

2. **seed job**:
   - Pokreće `npx prisma db seed`
   - Seed dokumentacije će se automatski pokrenuti
   - Dodaje sve kategorije i features iz `seed-documentation.js`
   - Dodaje statistiku "238 Implementirane funkcionalnosti"

## Provjeri status

- **GitHub Actions**: https://github.com/oriphiel/AWS_projekti/actions
- **CloudWatch logs**: `/ecs/uslugar/prisma` (u AWS Console)

## Nakon završetka

Kada workflow završi:
1. Tablice `DocumentationCategory` i `DocumentationFeature` će biti kreirane
2. Podaci iz dokumentacije će biti seedani
3. Frontend će moći učitati podatke preko `/api/documentation` endpoint-a
4. Stranica https://uslugar.oriph.io/#documentation će prikazati podatke iz baze

