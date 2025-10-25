-- CreateTable
CREATE TABLE "SubscriptionPlan" (
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
CREATE UNIQUE INDEX "SubscriptionPlan_name_key" ON "SubscriptionPlan"("name");

-- CreateIndex
CREATE INDEX "SubscriptionPlan_isActive_idx" ON "SubscriptionPlan"("isActive");

-- CreateIndex
CREATE INDEX "SubscriptionPlan_displayOrder_idx" ON "SubscriptionPlan"("displayOrder");

-- AlterTable: Make Job.userId nullable for anonymous users
ALTER TABLE "Job" ALTER COLUMN "userId" DROP NOT NULL;

-- AlterTable: Add linking token fields for anonymous job posting
ALTER TABLE "Job" ADD COLUMN "linkingToken" TEXT,
ADD COLUMN "linkingTokenExpiresAt" TIMESTAMP(3);

-- AlterTable: Add cancelledAt to Subscription (if not exists)
DO $$  
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'Subscription' AND column_name = 'cancelledAt') THEN
        ALTER TABLE "Subscription" ADD COLUMN "cancelledAt" TIMESTAMP(3);
    END IF;
END $$;
