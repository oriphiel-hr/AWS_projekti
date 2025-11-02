-- Create LeadPurchaseStatus enum and convert status column
-- Migration: 20250208000001_add_lead_purchase_status_enum

-- 1. Create enum if it doesn't exist
DO $$ BEGIN
    CREATE TYPE "LeadPurchaseStatus" AS ENUM ('ACTIVE', 'CONTACTED', 'CONVERTED', 'REFUNDED', 'EXPIRED', 'CANCELLED');
EXCEPTION
    WHEN duplicate_object THEN NULL;
END $$;

-- 2. Update CreditTransactionType enum if ADMIN_ADJUST doesn't exist (add missing value)
-- Note: PostgreSQL doesn't support IF NOT EXISTS for ALTER TYPE ADD VALUE
-- So we check if value exists by trying to add it and catching the error
DO $$ 
BEGIN
    -- Try to add ADMIN_ADJUST if it doesn't exist
    -- This will fail silently if the value already exists or if enum doesn't exist
    IF EXISTS (SELECT 1 FROM pg_type WHERE typname = 'CreditTransactionType') THEN
        BEGIN
            ALTER TYPE "CreditTransactionType" ADD VALUE 'ADMIN_ADJUST';
        EXCEPTION
            WHEN duplicate_object THEN NULL;
            WHEN others THEN NULL;
        END;
    END IF;
END $$;

-- 3. Convert LeadPurchase.status from TEXT to enum
-- Using USING clause with CASE for safe conversion
ALTER TABLE "LeadPurchase" 
  ALTER COLUMN "status" TYPE "LeadPurchaseStatus" 
  USING CASE 
    WHEN "status"::text = 'ACTIVE' THEN 'ACTIVE'::"LeadPurchaseStatus"
    WHEN "status"::text = 'CONTACTED' THEN 'CONTACTED'::"LeadPurchaseStatus"
    WHEN "status"::text = 'CONVERTED' THEN 'CONVERTED'::"LeadPurchaseStatus"
    WHEN "status"::text = 'REFUNDED' THEN 'REFUNDED'::"LeadPurchaseStatus"
    WHEN "status"::text = 'EXPIRED' THEN 'EXPIRED'::"LeadPurchaseStatus"
    WHEN "status"::text = 'CANCELLED' THEN 'CANCELLED'::"LeadPurchaseStatus"
    ELSE 'ACTIVE'::"LeadPurchaseStatus" -- Default za nepoznate vrijednosti
  END;

