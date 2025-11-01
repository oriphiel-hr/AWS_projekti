-- Add Stripe refund fields to LeadPurchase model
-- Pravno: Platforma ne provodi povrate sredstava samostalno.
-- Povrati se provode isključivo putem ovlaštene platne institucije
-- (Stripe Payments Europe Ltd.) u skladu s PSD2 pravilima.

ALTER TABLE "LeadPurchase" ADD COLUMN IF NOT EXISTS "stripePaymentIntentId" TEXT;
ALTER TABLE "LeadPurchase" ADD COLUMN IF NOT EXISTS "stripeRefundId" TEXT;

-- Add index for faster lookups
CREATE INDEX IF NOT EXISTS "LeadPurchase_stripePaymentIntentId_idx" ON "LeadPurchase"("stripePaymentIntentId");
CREATE INDEX IF NOT EXISTS "LeadPurchase_stripeRefundId_idx" ON "LeadPurchase"("stripeRefundId");

