# 🚀 Kako pokrenuti Prisma Workflow

## Automatski (preporučeno)

Workflow se automatski pokreće kada pushaš promjene u:
- `uslugar/backend/prisma/**`
- `uslugar/backend/src/routes/documentation.js`
- `uslugar/frontend/src/pages/Documentation.jsx`
- `uslugar/backend/scripts/extract-documentation.js`

## Ručno kroz GitHub UI

1. Idi na: https://github.com/oriphiel/AWS_projekti/actions
2. Klikni na "Prisma - Build/Push & Migrate (ECR→ECS)"
3. Klikni "Run workflow" → odaberi "main" → "Run workflow"

## Ručno kroz GitHub CLI

```bash
gh workflow run .github/workflows/prisma-uslugar.yml
```

## Provjeri status

Nakon pokretanja, provjeri:
- GitHub Actions: https://github.com/oriphiel/AWS_projekti/actions
- CloudWatch logs: `/ecs/uslugar/prisma`

## Što workflow radi

1. **prisma job**: 
   - Builda Prisma Docker image
   - Pusha na ECR
   - Primjenjuje migracije (`npx prisma migrate deploy`)

2. **seed job**:
   - Pokreće `npx prisma db seed`
   - Seed dokumentacije će se automatski pokrenuti
   - Dodaje sve kategorije i features
   - Dodaje statistiku "238 Implementirane funkcionalnosti"

