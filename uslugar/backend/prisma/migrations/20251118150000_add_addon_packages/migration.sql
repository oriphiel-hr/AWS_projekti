-- Add-on paketi - proširenje osnovnog plana s regijama, kategorijama ili kreditima
-- Lifecycle: ACTIVE → LOW_BALANCE → EXPIRED/DEPLETED → GRACE_MODE → RENEWED

-- CreateEnum: AddonType
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'AddonType') THEN
        CREATE TYPE "AddonType" AS ENUM ('REGION', 'CATEGORY', 'CREDITS');
    END IF;
END $$;

-- CreateEnum: AddonStatus
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'AddonStatus') THEN
        CREATE TYPE "AddonStatus" AS ENUM ('ACTIVE', 'LOW_BALANCE', 'EXPIRED', 'DEPLETED', 'GRACE_MODE', 'CANCELLED');
    END IF;
END $$;

-- AlterEnum: InvoiceType - dodaj ADDON
DO $$
BEGIN
    -- Provjeri postoji li ADDON u enumu
    IF NOT EXISTS (
        SELECT 1 FROM pg_enum 
        WHERE enumlabel = 'ADDON' 
        AND enumtypid = (SELECT oid FROM pg_type WHERE typname = 'InvoiceType')
    ) THEN
        ALTER TYPE "InvoiceType" ADD VALUE 'ADDON';
    END IF;
END $$;

-- CreateTable: AddonSubscription
CREATE TABLE IF NOT EXISTS "AddonSubscription" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" "AddonType" NOT NULL,
    "scope" TEXT NOT NULL,
    "displayName" TEXT NOT NULL,
    "categoryId" TEXT,
    "creditsAmount" INTEGER,
    "status" "AddonStatus" NOT NULL DEFAULT 'ACTIVE',
    "autoRenew" BOOLEAN NOT NULL DEFAULT false,
    "validFrom" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "validUntil" TIMESTAMP(3) NOT NULL,
    "graceUntil" TIMESTAMP(3),
    "price" DOUBLE PRECISION NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'EUR',
    "stripeSubscriptionId" TEXT,
    "stripePriceId" TEXT,
    "notes" TEXT,
    "cancelledAt" TIMESTAMP(3),
    "cancelledReason" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AddonSubscription_pkey" PRIMARY KEY ("id")
);

-- CreateTable: AddonUsage
CREATE TABLE IF NOT EXISTS "AddonUsage" (
    "id" TEXT NOT NULL,
    "addonId" TEXT NOT NULL,
    "consumed" INTEGER NOT NULL DEFAULT 0,
    "remaining" INTEGER NOT NULL,
    "percentageUsed" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "leadsReceived" INTEGER NOT NULL DEFAULT 0,
    "leadsConverted" INTEGER NOT NULL DEFAULT 0,
    "notifiedAt80" TIMESTAMP(3),
    "notifiedAt50" TIMESTAMP(3),
    "notifiedAt20" TIMESTAMP(3),
    "notifiedExpiring" TIMESTAMP(3),
    "lastUpdated" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AddonUsage_pkey" PRIMARY KEY ("id")
);

-- CreateTable: AddonEventLog
CREATE TABLE IF NOT EXISTS "AddonEventLog" (
    "id" TEXT NOT NULL,
    "addonId" TEXT NOT NULL,
    "eventType" TEXT NOT NULL,
    "oldStatus" "AddonStatus",
    "newStatus" "AddonStatus",
    "metadata" JSONB,
    "occurredAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AddonEventLog_pkey" PRIMARY KEY ("id")
);

-- AlterTable: Invoice - dodaj addonId
ALTER TABLE "Invoice" ADD COLUMN IF NOT EXISTS "addonId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX IF NOT EXISTS "AddonSubscription_userId_type_scope_key" 
ON "AddonSubscription"("userId", "type", "scope");

CREATE INDEX IF NOT EXISTS "AddonSubscription_userId_idx" 
ON "AddonSubscription"("userId");

CREATE INDEX IF NOT EXISTS "AddonSubscription_type_idx" 
ON "AddonSubscription"("type");

CREATE INDEX IF NOT EXISTS "AddonSubscription_status_idx" 
ON "AddonSubscription"("status");

CREATE INDEX IF NOT EXISTS "AddonSubscription_validUntil_idx" 
ON "AddonSubscription"("validUntil");

CREATE INDEX IF NOT EXISTS "AddonSubscription_categoryId_idx" 
ON "AddonSubscription"("categoryId");

CREATE UNIQUE INDEX IF NOT EXISTS "AddonUsage_addonId_key" 
ON "AddonUsage"("addonId");

CREATE INDEX IF NOT EXISTS "AddonUsage_addonId_idx" 
ON "AddonUsage"("addonId");

CREATE INDEX IF NOT EXISTS "AddonUsage_percentageUsed_idx" 
ON "AddonUsage"("percentageUsed");

CREATE INDEX IF NOT EXISTS "AddonEventLog_addonId_idx" 
ON "AddonEventLog"("addonId");

CREATE INDEX IF NOT EXISTS "AddonEventLog_eventType_idx" 
ON "AddonEventLog"("eventType");

CREATE INDEX IF NOT EXISTS "AddonEventLog_occurredAt_idx" 
ON "AddonEventLog"("occurredAt");

-- AddForeignKey
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint 
        WHERE conname = 'AddonSubscription_userId_fkey'
    ) THEN
        ALTER TABLE "AddonSubscription" 
        ADD CONSTRAINT "AddonSubscription_userId_fkey" 
        FOREIGN KEY ("userId") 
        REFERENCES "User"("id") 
        ON DELETE CASCADE 
        ON UPDATE CASCADE;
    END IF;
END $$;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint 
        WHERE conname = 'AddonSubscription_categoryId_fkey'
    ) THEN
        ALTER TABLE "AddonSubscription" 
        ADD CONSTRAINT "AddonSubscription_categoryId_fkey" 
        FOREIGN KEY ("categoryId") 
        REFERENCES "Category"("id") 
        ON DELETE SET NULL 
        ON UPDATE CASCADE;
    END IF;
END $$;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint 
        WHERE conname = 'AddonUsage_addonId_fkey'
    ) THEN
        ALTER TABLE "AddonUsage" 
        ADD CONSTRAINT "AddonUsage_addonId_fkey" 
        FOREIGN KEY ("addonId") 
        REFERENCES "AddonSubscription"("id") 
        ON DELETE CASCADE 
        ON UPDATE CASCADE;
    END IF;
END $$;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint 
        WHERE conname = 'AddonEventLog_addonId_fkey'
    ) THEN
        ALTER TABLE "AddonEventLog" 
        ADD CONSTRAINT "AddonEventLog_addonId_fkey" 
        FOREIGN KEY ("addonId") 
        REFERENCES "AddonSubscription"("id") 
        ON DELETE CASCADE 
        ON UPDATE CASCADE;
    END IF;
END $$;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint 
        WHERE conname = 'Invoice_addonId_fkey'
    ) THEN
        ALTER TABLE "Invoice" 
        ADD CONSTRAINT "Invoice_addonId_fkey" 
        FOREIGN KEY ("addonId") 
        REFERENCES "AddonSubscription"("id") 
        ON DELETE SET NULL 
        ON UPDATE CASCADE;
    END IF;
END $$;


