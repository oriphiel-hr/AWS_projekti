-- AlterTable: Add cancelledAt to Subscription
ALTER TABLE "Subscription" ADD COLUMN IF NOT EXISTS "cancelledAt" TIMESTAMP(3);
