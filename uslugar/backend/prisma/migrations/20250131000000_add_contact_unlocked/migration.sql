-- Add contactUnlocked fields to LeadPurchase (Pay-per-contact model)
-- Migration: 20250131000000_add_contact_unlocked

-- Add contactUnlocked column
ALTER TABLE "LeadPurchase" 
ADD COLUMN IF NOT EXISTS "contactUnlocked" BOOLEAN NOT NULL DEFAULT false;

-- Add contactUnlockedAt column
ALTER TABLE "LeadPurchase" 
ADD COLUMN IF NOT EXISTS "contactUnlockedAt" TIMESTAMP(3);

-- Update existing LeadPurchases to have contactUnlocked = true (backward compatibility)
-- Ako lead već postoji, pretpostavljamo da je kontakt već bio dostupan
UPDATE "LeadPurchase" 
SET "contactUnlocked" = true, 
    "contactUnlockedAt" = "createdAt"
WHERE "contactUnlocked" = false 
  AND "status" != 'REFUNDED'
  AND "contactUnlockedAt" IS NULL;

-- Add comment for documentation
COMMENT ON COLUMN "LeadPurchase"."contactUnlocked" IS 'Pay-per-contact: je li kontakt otključan (naplaćuje se dodatno)';
COMMENT ON COLUMN "LeadPurchase"."contactUnlockedAt" IS 'Kada je kontakt otključan';

