-- Segmentni model paketa - dodavanje polja za segmentaciju po regiji/kategoriji
-- Omogućava definiranje različitih paketa prema regijama ili kategorijama

-- AlterTable: Add categoryId to SubscriptionPlan
ALTER TABLE "SubscriptionPlan" ADD COLUMN IF NOT EXISTS "categoryId" TEXT;

-- AlterTable: Add region to SubscriptionPlan
ALTER TABLE "SubscriptionPlan" ADD COLUMN IF NOT EXISTS "region" TEXT;

-- Drop existing unique constraint on name (we'll replace it with composite)
DROP INDEX IF EXISTS "SubscriptionPlan_name_key";

-- CreateIndex: Composite unique constraint (name, categoryId, region)
-- Omogućava više paketa s istim imenom ali različitim segmentacijama
CREATE UNIQUE INDEX IF NOT EXISTS "SubscriptionPlan_name_categoryId_region_key" 
ON "SubscriptionPlan"("name", "categoryId", "region");

-- CreateIndex: Index for categoryId
CREATE INDEX IF NOT EXISTS "SubscriptionPlan_categoryId_idx" 
ON "SubscriptionPlan"("categoryId");

-- CreateIndex: Index for region
CREATE INDEX IF NOT EXISTS "SubscriptionPlan_region_idx" 
ON "SubscriptionPlan"("region");

-- CreateIndex: Composite index for faster segmented package queries
CREATE INDEX IF NOT EXISTS "SubscriptionPlan_categoryId_region_idx" 
ON "SubscriptionPlan"("categoryId", "region");

-- AddForeignKey: Foreign key constraint to Category
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint 
        WHERE conname = 'SubscriptionPlan_categoryId_fkey'
    ) THEN
        ALTER TABLE "SubscriptionPlan" 
        ADD CONSTRAINT "SubscriptionPlan_categoryId_fkey" 
        FOREIGN KEY ("categoryId") 
        REFERENCES "Category"("id") 
        ON DELETE SET NULL 
        ON UPDATE CASCADE;
    END IF;
END $$;

