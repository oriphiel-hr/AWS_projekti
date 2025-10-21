-- USLUGAR EXCLUSIVE - Ekskluzivni leadovi, krediti, refundacije
-- Migration: 20251021000000_uslugar_exclusive

-- 1. Dodaj kredite u Subscription
ALTER TABLE "Subscription" ADD COLUMN "creditsBalance" INTEGER NOT NULL DEFAULT 0;
ALTER TABLE "Subscription" ADD COLUMN "lifetimeCreditsUsed" INTEGER NOT NULL DEFAULT 0;
ALTER TABLE "Subscription" ADD COLUMN "lifetimeLeadsConverted" INTEGER NOT NULL DEFAULT 0;

-- 2. Proširenje Job modela za ekskluzivne leadove
ALTER TABLE "Job" ADD COLUMN "isExclusive" BOOLEAN NOT NULL DEFAULT true;
ALTER TABLE "Job" ADD COLUMN "leadPrice" INTEGER DEFAULT 0;
ALTER TABLE "Job" ADD COLUMN "assignedProviderId" TEXT;
ALTER TABLE "Job" ADD COLUMN "leadStatus" TEXT DEFAULT 'AVAILABLE';
ALTER TABLE "Job" ADD COLUMN "clientVerified" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "Job" ADD COLUMN "qualityScore" INTEGER DEFAULT 0;

-- 3. Kreiranje LeadPurchase tabele (kupljeni leadovi)
CREATE TABLE "LeadPurchase" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "jobId" TEXT NOT NULL,
    "providerId" TEXT NOT NULL,
    "creditsSpent" INTEGER NOT NULL,
    "leadPrice" INTEGER NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    "contactedAt" TIMESTAMP(3),
    "convertedAt" TIMESTAMP(3),
    "refundedAt" TIMESTAMP(3),
    "refundReason" TEXT,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT "LeadPurchase_jobId_fkey" FOREIGN KEY ("jobId") REFERENCES "Job"("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "LeadPurchase_providerId_fkey" FOREIGN KEY ("providerId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- 4. Kreiranje ProviderROI tabele (statistika providera)
CREATE TABLE "ProviderROI" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "providerId" TEXT NOT NULL UNIQUE,
    "totalLeadsPurchased" INTEGER NOT NULL DEFAULT 0,
    "totalLeadsContacted" INTEGER NOT NULL DEFAULT 0,
    "totalLeadsConverted" INTEGER NOT NULL DEFAULT 0,
    "totalCreditsSpent" INTEGER NOT NULL DEFAULT 0,
    "totalRevenue" INTEGER NOT NULL DEFAULT 0,
    "conversionRate" DECIMAL(5,2) DEFAULT 0.00,
    "roi" DECIMAL(5,2) DEFAULT 0.00,
    "avgLeadValue" DECIMAL(10,2) DEFAULT 0.00,
    "lastUpdated" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT "ProviderROI_providerId_fkey" FOREIGN KEY ("providerId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- 5. Kreiranje CreditTransaction tabele (history kredita)
CREATE TABLE "CreditTransaction" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "amount" INTEGER NOT NULL,
    "balance" INTEGER NOT NULL,
    "description" TEXT,
    "relatedJobId" TEXT,
    "relatedPurchaseId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT "CreditTransaction_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "CreditTransaction_relatedJobId_fkey" FOREIGN KEY ("relatedJobId") REFERENCES "Job"("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "CreditTransaction_relatedPurchaseId_fkey" FOREIGN KEY ("relatedPurchaseId") REFERENCES "LeadPurchase"("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- 6. Kreiranje ClientVerification tabele (verifikacija klijenata)
CREATE TABLE "ClientVerification" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "phoneVerified" BOOLEAN NOT NULL DEFAULT false,
    "emailVerified" BOOLEAN NOT NULL DEFAULT false,
    "idVerified" BOOLEAN NOT NULL DEFAULT false,
    "companyVerified" BOOLEAN NOT NULL DEFAULT false,
    "trustScore" INTEGER NOT NULL DEFAULT 0,
    "verifiedAt" TIMESTAMP(3),
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT "ClientVerification_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "ClientVerification_userId_unique" UNIQUE("userId")
);

-- 7. Indexes za performanse
CREATE INDEX "LeadPurchase_jobId_idx" ON "LeadPurchase"("jobId");
CREATE INDEX "LeadPurchase_providerId_idx" ON "LeadPurchase"("providerId");
CREATE INDEX "LeadPurchase_status_idx" ON "LeadPurchase"("status");
CREATE INDEX "LeadPurchase_createdAt_idx" ON "LeadPurchase"("createdAt");

CREATE INDEX "CreditTransaction_userId_idx" ON "CreditTransaction"("userId");
CREATE INDEX "CreditTransaction_type_idx" ON "CreditTransaction"("type");
CREATE INDEX "CreditTransaction_createdAt_idx" ON "CreditTransaction"("createdAt");

CREATE INDEX "Job_leadStatus_idx" ON "Job"("leadStatus");
CREATE INDEX "Job_assignedProviderId_idx" ON "Job"("assignedProviderId");
CREATE INDEX "Job_isExclusive_idx" ON "Job"("isExclusive");

-- 8. Dodaj Foreign Key za assignedProviderId
ALTER TABLE "Job" ADD CONSTRAINT "Job_assignedProviderId_fkey" 
    FOREIGN KEY ("assignedProviderId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- 9. Update subscription planova sa default kreditima
UPDATE "Subscription" SET "creditsBalance" = 10 WHERE "plan" = 'BASIC' AND "creditsBalance" = 0;
UPDATE "Subscription" SET "creditsBalance" = 25 WHERE "plan" = 'PREMIUM' AND "creditsBalance" = 0;
UPDATE "Subscription" SET "creditsBalance" = 50 WHERE "plan" = 'PRO' AND "creditsBalance" = 0;

-- 10. Dodaj komentare za dokumentaciju
COMMENT ON COLUMN "Job"."isExclusive" IS 'Da li je lead ekskluzivan (1 provider)';
COMMENT ON COLUMN "Job"."leadPrice" IS 'Cijena leada u kreditima (10-20 kredita)';
COMMENT ON COLUMN "Job"."leadStatus" IS 'Status leada: AVAILABLE, ASSIGNED, CONTACTED, CONVERTED, REFUNDED';
COMMENT ON COLUMN "Job"."clientVerified" IS 'Da li je klijent verificiran';
COMMENT ON COLUMN "Job"."qualityScore" IS 'AI score kvalitete leada (0-100)';

COMMENT ON TABLE "LeadPurchase" IS 'Kupljeni ekskluzivni leadovi - 1 lead = 1 provider';
COMMENT ON TABLE "ProviderROI" IS 'ROI statistika za providere - konverzija, profit, itd.';
COMMENT ON TABLE "CreditTransaction" IS 'Povijest transakcija kredita';
COMMENT ON TABLE "ClientVerification" IS 'Verifikacija klijenata za kvalitetne leadove';

