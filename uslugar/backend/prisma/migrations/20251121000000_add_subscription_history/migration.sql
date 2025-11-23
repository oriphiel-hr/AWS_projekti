-- CreateEnum
CREATE TYPE "SubscriptionHistoryAction" AS ENUM ('CREATED', 'UPGRADED', 'DOWNGRADED', 'RENEWED', 'CANCELLED', 'EXPIRED', 'REACTIVATED', 'PRORATED');

-- CreateTable
CREATE TABLE IF NOT EXISTS "SubscriptionHistory" (
    "id" TEXT NOT NULL,
    "subscriptionId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "action" "SubscriptionHistoryAction" NOT NULL,
    "previousPlan" TEXT,
    "newPlan" TEXT NOT NULL,
    "previousStatus" "SubscriptionStatus",
    "newStatus" "SubscriptionStatus" NOT NULL,
    "price" DOUBLE PRECISION,
    "proratedAmount" DOUBLE PRECISION,
    "discountAmount" DOUBLE PRECISION,
    "discountType" TEXT,
    "creditsAdded" INTEGER,
    "creditsBefore" INTEGER,
    "creditsAfter" INTEGER,
    "validFrom" TIMESTAMP(3),
    "validUntil" TIMESTAMP(3),
    "previousExpiresAt" TIMESTAMP(3),
    "reason" TEXT,
    "notes" TEXT,
    "metadata" JSONB,
    "changedBy" TEXT,
    "ipAddress" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SubscriptionHistory_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX IF NOT EXISTS "SubscriptionHistory_subscriptionId_createdAt_idx" ON "SubscriptionHistory"("subscriptionId", "createdAt");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "SubscriptionHistory_userId_createdAt_idx" ON "SubscriptionHistory"("userId", "createdAt");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "SubscriptionHistory_action_createdAt_idx" ON "SubscriptionHistory"("action", "createdAt");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "SubscriptionHistory_createdAt_idx" ON "SubscriptionHistory"("createdAt");

-- AddForeignKey
ALTER TABLE "SubscriptionHistory" ADD CONSTRAINT "SubscriptionHistory_subscriptionId_fkey" FOREIGN KEY ("subscriptionId") REFERENCES "Subscription"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SubscriptionHistory" ADD CONSTRAINT "SubscriptionHistory_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

