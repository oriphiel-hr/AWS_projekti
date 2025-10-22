# 🚀 Primjena Queue Model Migracije na AWS

Sve promjene su commitane i pushane na GitHub! ✅

Sada postoje 3 načina da primijeniš migraciju na AWS:

---

## Metoda 1: Pusti da se automatski pokrene pri sljedećem deployment-u ⭐ (NAJLAKŠE)

Dockerfile je već konfiguriran da automatski pokrene migraciju pri startu!

**Kada god buildaš i deployaš novi image, migracija će se automatski pokrenuti.**

Kada budeš spreman (npr. kada pokreneš Docker Desktop):

```powershell
# Pokreni Docker Desktop prvo!

cd C:\GIT_PROJEKTI\AWS\AWS_projekti\uslugar\backend

# Build
docker build -t uslugar-backend:latest .

# Login to ECR
aws ecr get-login-password --region eu-north-1 | docker login --username AWS --password-stdin 339713096106.dkr.ecr.eu-north-1.amazonaws.com

# Tag & Push
docker tag uslugar-backend:latest 339713096106.dkr.ecr.eu-north-1.amazonaws.com/uslugar-backend:latest
docker push 339713096106.dkr.ecr.eu-north-1.amazonaws.com/uslugar-backend:latest

# Deploy
aws ecs update-service --cluster uslugar-cluster --service uslugar-backend-service --force-new-deployment --region eu-north-1
```

Migracija će se pokrenuti automatski! 🎉

---

## Metoda 2: Ručno iz AWS Console (BEZ Docker-a)

### Korak 1: Otvori RDS Query Editor

1. Idi na AWS Console → RDS
2. Odaberi `uslugar-db`
3. Klikni **"Query Editor"**
4. Connect s:
   - Username: `uslugar_user`
   - Password: `Pastor123`

### Korak 2: Kopiraj i Izvrši SQL

Otvori file:
```
C:\GIT_PROJEKTI\AWS\AWS_projekti\uslugar\backend\prisma\migrations\20251021_add_queue_model_and_licenses\migration.sql
```

Kopiraj cijeli sadržaj i izvrši ga u Query Editor-u.

### Korak 3: Seed Kategorije

Nakon SQL-a, trebaš seedati kategorije. Ima 2 opcije:

**A) SSH u ECS Task**
```bash
# Get running task
aws ecs list-tasks --cluster uslugar-cluster --region eu-north-1

# Execute command
aws ecs execute-command \
  --cluster uslugar-cluster \
  --task <TASK_ID> \
  --container uslugar-backend \
  --interactive \
  --command "/bin/sh" \
  --region eu-north-1

# Inside container:
node prisma/seeds/seed-categories.js
```

**B) Privremeno dodaj u server.js**

Dodaj u `src/server.js` nakon linije 177 (prije `httpServer.listen`):

```javascript
// Seed categories if needed
if (process.env.SEED_CATEGORIES === 'true') {
  const { execSync } = require('child_process');
  console.log('🌱 Seeding categories...');
  execSync('node prisma/seeds/seed-categories.js', { stdio: 'inherit' });
}
```

Postavi environment variable u ECS Task Definition:
```
SEED_CATEGORIES=true
```

Redeploy, pa makni SEED_CATEGORIES nakon što se pokrene jednom.

---

## Metoda 3: GitHub Actions (Ako imaš setup)

Ako imaš GitHub Actions setup, CI/CD će automatski buildati i deployati.

---

## Verifikacija Migracije

Nakon primjene, provjeri:

### 1. Provjeri Tablice u RDS Query Editor

```sql
-- Check new tables
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('ProviderLicense', 'LeadQueue')
ORDER BY table_name;

-- Should return:
-- LeadQueue
-- ProviderLicense
```

### 2. Provjeri Category NKD kodove

```sql
SELECT name, "nkdCode", "requiresLicense", "licenseType" 
FROM "Category" 
WHERE "nkdCode" IS NOT NULL 
LIMIT 10;

-- Should show categories like Električar, Vodoinstalater, etc.
```

### 3. Provjeri API

```bash
curl https://uslugar-api.oriph.io/api/health

# Ako radi, testiraj queue endpoints:
curl https://uslugar-api.oriph.io/api/lead-queue/stats \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## Preporučeni Plan

**Za sada (bez Docker-a):**
1. Primijeni SQL migraciju ručno preko RDS Query Editor-a (Metoda 2, Korak 1-2)
2. Seed kategorije preko ECS SSH (Metoda 2, Korak 3A)

**Kasnije (kada pokreneš Docker):**
1. Build i deploy novi image (Metoda 1)
2. Sve će se automatski ažurirati

---

## SQL za Ručnu Primjenu

Evo kompletnog SQL-a koji trebaš izvršiti:

```sql
-- CreateEnum: Queue statuses
CREATE TYPE "LeadQueueStatus" AS ENUM ('WAITING', 'OFFERED', 'ACCEPTED', 'DECLINED', 'EXPIRED', 'SKIPPED');

-- CreateEnum: Queue responses
CREATE TYPE "QueueResponse" AS ENUM ('INTERESTED', 'NOT_INTERESTED', 'NO_RESPONSE');

-- AlterTable: Category - Add NKD and license fields
ALTER TABLE "Category" ADD COLUMN IF NOT EXISTS "nkdCode" TEXT;
ALTER TABLE "Category" ADD COLUMN IF NOT EXISTS "requiresLicense" BOOLEAN DEFAULT false;
ALTER TABLE "Category" ADD COLUMN IF NOT EXISTS "licenseType" TEXT;
ALTER TABLE "Category" ADD COLUMN IF NOT EXISTS "licenseAuthority" TEXT;

-- AlterTable: ProviderProfile - Add license and category limits
ALTER TABLE "ProviderProfile" ADD COLUMN IF NOT EXISTS "maxCategories" INTEGER DEFAULT 5;
ALTER TABLE "ProviderProfile" ADD COLUMN IF NOT EXISTS "nkdCodes" TEXT[];

-- CreateTable: ProviderLicense
CREATE TABLE IF NOT EXISTS "ProviderLicense" (
    "id" TEXT NOT NULL,
    "providerId" TEXT NOT NULL,
    "licenseType" TEXT NOT NULL,
    "licenseNumber" TEXT NOT NULL,
    "issuingAuthority" TEXT NOT NULL,
    "issuedAt" TIMESTAMP(3) NOT NULL,
    "expiresAt" TIMESTAMP(3),
    "documentUrl" TEXT,
    "isVerified" BOOLEAN NOT NULL DEFAULT false,
    "verifiedAt" TIMESTAMP(3),
    "verifiedBy" TEXT,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "ProviderLicense_pkey" PRIMARY KEY ("id")
);

-- CreateTable: LeadQueue
CREATE TABLE IF NOT EXISTS "LeadQueue" (
    "id" TEXT NOT NULL,
    "jobId" TEXT NOT NULL,
    "providerId" TEXT NOT NULL,
    "position" INTEGER NOT NULL,
    "status" "LeadQueueStatus" NOT NULL DEFAULT 'WAITING',
    "offeredAt" TIMESTAMP(3),
    "respondedAt" TIMESTAMP(3),
    "expiresAt" TIMESTAMP(3),
    "response" "QueueResponse",
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "LeadQueue_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX IF NOT EXISTS "ProviderLicense_providerId_idx" ON "ProviderLicense"("providerId");
CREATE INDEX IF NOT EXISTS "ProviderLicense_isVerified_idx" ON "ProviderLicense"("isVerified");
CREATE INDEX IF NOT EXISTS "LeadQueue_jobId_position_idx" ON "LeadQueue"("jobId", "position");
CREATE INDEX IF NOT EXISTS "LeadQueue_providerId_status_idx" ON "LeadQueue"("providerId", "status");
CREATE INDEX IF NOT EXISTS "LeadQueue_status_idx" ON "LeadQueue"("status");

-- CreateIndex: Unique constraint for LeadQueue
CREATE UNIQUE INDEX IF NOT EXISTS "LeadQueue_jobId_providerId_key" ON "LeadQueue"("jobId", "providerId");

-- AddForeignKey
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'ProviderLicense_providerId_fkey'
    ) THEN
        ALTER TABLE "ProviderLicense" ADD CONSTRAINT "ProviderLicense_providerId_fkey" 
        FOREIGN KEY ("providerId") REFERENCES "ProviderProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;
    END IF;
END $$;

DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'LeadQueue_jobId_fkey'
    ) THEN
        ALTER TABLE "LeadQueue" ADD CONSTRAINT "LeadQueue_jobId_fkey" 
        FOREIGN KEY ("jobId") REFERENCES "Job"("id") ON DELETE CASCADE ON UPDATE CASCADE;
    END IF;
END $$;
```

---

## 🎉 Završetak

Nakon što primijeniš migraciju (bilo kojom metodom), Queue Model je aktivan!

**Što radi automatski:**
- ✅ Queue Scheduler provjerava istekle ponude svaki sat
- ✅ API endpoints su dostupni
- ✅ NKD validacija je aktivna
- ✅ Provider licence se prate

**Sljedeći korak:** Frontend komponente za prikazivanje queue-a! 🚀

---

**Pitanja?** Javi mi kako želiš nastaviti!

