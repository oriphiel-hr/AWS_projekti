-- CreateTable
CREATE TABLE IF NOT EXISTS "SubscriptionPlan" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "displayName" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'EUR',
    "credits" INTEGER NOT NULL,
    "features" TEXT[],
    "isPopular" BOOLEAN NOT NULL DEFAULT false,
    "displayOrder" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "description" TEXT,
    "savings" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SubscriptionPlan_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX IF NOT EXISTS "SubscriptionPlan_name_key" ON "SubscriptionPlan"("name");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "SubscriptionPlan_isActive_idx" ON "SubscriptionPlan"("isActive");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "SubscriptionPlan_displayOrder_idx" ON "SubscriptionPlan"("displayOrder");

-- AlterTable: Make Job.userId nullable for anonymous users
DO $$  
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'Job' AND column_name = 'userId' AND is_nullable = 'NO') THEN
        ALTER TABLE "Job" ALTER COLUMN "userId" DROP NOT NULL;
    END IF;
END $$;

-- AlterTable: Add linking token fields for anonymous job posting
DO $$  
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'Job' AND column_name = 'linkingToken') THEN
        ALTER TABLE "Job" ADD COLUMN "linkingToken" TEXT;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'Job' AND column_name = 'linkingTokenExpiresAt') THEN
        ALTER TABLE "Job" ADD COLUMN "linkingTokenExpiresAt" TIMESTAMP(3);
    END IF;
END $$;
