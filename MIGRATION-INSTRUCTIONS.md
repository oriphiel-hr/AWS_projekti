# KYC Verifikacija - Migracija Uputstva

## 📋 Što je Urađeno

Implementirani su KYC verifikacijski feature-i:
- ✅ Backend library (`kyc-verification.js`)
- ✅ Backend routes (`kyc.js`)
- ✅ Frontend komponenta (`KYCVerification.jsx`)
- ✅ Provider badge update
- ✅ SQL migracija kreirana

## 🚀 Pokretanje Migracije

### Opcija 1: Automatski via GitHub Actions

Commit i push promjene:

```bash
cd C:\GIT_PROJEKTI\AWS\AWS_projekti
git add .
git commit -m "feat: add KYC-lite verification for freelancers"
git push origin main
```

GitHub Actions će automatski:
1. Pokrenuti `prisma-uslugar.yml` workflow
2. Build & push Docker image
3. Pokrenuti `prisma migrate deploy`
4. Pokrenuti `npm run seed`

### Opcija 2: Ručno na Serveru

SSH na server i pokreni:

```bash
cd /path/to/uslugar/backend
psql -U postgres uslugar_db < prisma/migrations/20251027210000_add_kyc_verification/migration.sql
```

### Opcija 3: Lokalno Testiranje

```bash
cd uslugar/backend
npm run migrate:dev --name add_kyc_verification
```

## 📝 Fajlovi Za Commit

```
uslugar/backend/prisma/schema.prisma
uslugar/backend/prisma/migrations/20251027210000_add_kyc_verification/migration.sql
uslugar/backend/src/lib/kyc-verification.js
uslugar/backend/src/routes/kyc.js
uslugar/backend/src/server.js
uslugar/backend/package.json
uslugar/backend/package-lock.json
uslugar/frontend/src/components/KYCVerification.jsx
uslugar/frontend/src/components/ProviderCard.jsx
```

## ✅ Gotovo!

Kada push-ate promjene, migracija će se automatski pokrenuti kroz GitHub Actions workflow.

