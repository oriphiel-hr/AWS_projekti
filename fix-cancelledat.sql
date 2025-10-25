-- Add cancelledAt column to Subscription table
ALTER TABLE "Subscription" ADD COLUMN IF NOT EXISTS "cancelledAt" TIMESTAMP(3);
