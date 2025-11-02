-- Manual fix for LeadPurchaseStatus enum
-- Run this directly on the database if the migration failed
-- 
-- Usage: 
--   psql $DATABASE_URL -f fix-lead-purchase-status-enum-direct.sql
--   OR connect via AWS RDS query editor and run this

-- Step 1: Create enum if it doesn't exist
DO $$ BEGIN
    CREATE TYPE "LeadPurchaseStatus" AS ENUM ('ACTIVE', 'CONTACTED', 'CONVERTED', 'REFUNDED', 'EXPIRED', 'CANCELLED');
EXCEPTION
    WHEN duplicate_object THEN 
        RAISE NOTICE 'Enum LeadPurchaseStatus already exists';
END $$;

-- Step 2: Add ADMIN_ADJUST to CreditTransactionType if needed
DO $$ 
BEGIN
    IF EXISTS (SELECT 1 FROM pg_type WHERE typname = 'CreditTransactionType') THEN
        BEGIN
            ALTER TYPE "CreditTransactionType" ADD VALUE 'ADMIN_ADJUST';
            RAISE NOTICE 'Added ADMIN_ADJUST to CreditTransactionType';
        EXCEPTION
            WHEN duplicate_object THEN 
                RAISE NOTICE 'ADMIN_ADJUST already exists in CreditTransactionType';
            WHEN others THEN 
                RAISE NOTICE 'Could not add ADMIN_ADJUST: %', SQLERRM;
        END;
    END IF;
END $$;

-- Step 3: Convert LeadPurchase.status column
-- First check if column is already enum type
DO $$
DECLARE
    col_type text;
BEGIN
    SELECT data_type INTO col_type 
    FROM information_schema.columns 
    WHERE table_name = 'LeadPurchase' 
      AND column_name = 'status';
    
    IF col_type = 'USER-DEFINED' THEN
        -- Check if it's already LeadPurchaseStatus enum
        SELECT pg_typeof("status")::text INTO col_type 
        FROM "LeadPurchase" LIMIT 1;
        
        IF col_type LIKE '%LeadPurchaseStatus%' THEN
            RAISE NOTICE 'Column status is already LeadPurchaseStatus enum, skipping conversion';
        ELSE
            RAISE NOTICE 'Column status is enum but not LeadPurchaseStatus, converting...';
            
            -- Drop default
            ALTER TABLE "LeadPurchase" ALTER COLUMN "status" DROP DEFAULT;
            
            -- Convert type
            ALTER TABLE "LeadPurchase" 
              ALTER COLUMN "status" TYPE "LeadPurchaseStatus" 
              USING CASE 
                WHEN "status"::text = 'ACTIVE' THEN 'ACTIVE'::"LeadPurchaseStatus"
                WHEN "status"::text = 'CONTACTED' THEN 'CONTACTED'::"LeadPurchaseStatus"
                WHEN "status"::text = 'CONVERTED' THEN 'CONVERTED'::"LeadPurchaseStatus"
                WHEN "status"::text = 'REFUNDED' THEN 'REFUNDED'::"LeadPurchaseStatus"
                WHEN "status"::text = 'EXPIRED' THEN 'EXPIRED'::"LeadPurchaseStatus"
                WHEN "status"::text = 'CANCELLED' THEN 'CANCELLED'::"LeadPurchaseStatus"
                ELSE 'ACTIVE'::"LeadPurchaseStatus"
              END;
            
            -- Restore default
            ALTER TABLE "LeadPurchase" ALTER COLUMN "status" SET DEFAULT 'ACTIVE'::"LeadPurchaseStatus";
        END IF;
    ELSIF col_type = 'text' OR col_type = 'character varying' THEN
        RAISE NOTICE 'Converting status column from TEXT to LeadPurchaseStatus enum...';
        
        -- Drop default
        ALTER TABLE "LeadPurchase" ALTER COLUMN "status" DROP DEFAULT;
        
        -- Convert type
        ALTER TABLE "LeadPurchase" 
          ALTER COLUMN "status" TYPE "LeadPurchaseStatus" 
          USING CASE 
            WHEN "status"::text = 'ACTIVE' THEN 'ACTIVE'::"LeadPurchaseStatus"
            WHEN "status"::text = 'CONTACTED' THEN 'CONTACTED'::"LeadPurchaseStatus"
            WHEN "status"::text = 'CONVERTED' THEN 'CONVERTED'::"LeadPurchaseStatus"
            WHEN "status"::text = 'REFUNDED' THEN 'REFUNDED'::"LeadPurchaseStatus"
            WHEN "status"::text = 'EXPIRED' THEN 'EXPIRED'::"LeadPurchaseStatus"
            WHEN "status"::text = 'CANCELLED' THEN 'CANCELLED'::"LeadPurchaseStatus"
            ELSE 'ACTIVE'::"LeadPurchaseStatus"
          END;
        
        -- Restore default
        ALTER TABLE "LeadPurchase" ALTER COLUMN "status" SET DEFAULT 'ACTIVE'::"LeadPurchaseStatus";
        
        RAISE NOTICE 'Conversion complete!';
    ELSE
        RAISE NOTICE 'Column status type is: %, not converting', col_type;
    END IF;
EXCEPTION
    WHEN others THEN
        RAISE EXCEPTION 'Error converting status column: %', SQLERRM;
END $$;

-- Step 4: Mark migration as applied (if using Prisma)
-- This updates Prisma's _prisma_migrations table
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = '_prisma_migrations') THEN
        -- Check if migration is already marked
        IF NOT EXISTS (
            SELECT 1 FROM "_prisma_migrations" 
            WHERE migration_name = '20250208000001_add_lead_purchase_status_enum'
        ) THEN
            INSERT INTO "_prisma_migrations" (migration_name, finished_at, applied_steps_count)
            VALUES ('20250208000001_add_lead_purchase_status_enum', NOW(), 1)
            ON CONFLICT (migration_name) DO NOTHING;
            
            RAISE NOTICE 'Migration marked as applied in _prisma_migrations';
        ELSE
            RAISE NOTICE 'Migration already exists in _prisma_migrations';
        END IF;
    ELSE
        RAISE NOTICE '_prisma_migrations table does not exist, skipping migration tracking';
    END IF;
END $$;

-- Verification
DO $$
DECLARE
    enum_exists boolean;
    col_is_enum boolean;
BEGIN
    -- Check if enum exists
    SELECT EXISTS (
        SELECT 1 FROM pg_type WHERE typname = 'LeadPurchaseStatus'
    ) INTO enum_exists;
    
    -- Check if column is enum type
    SELECT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'LeadPurchase' 
          AND column_name = 'status'
          AND udt_name = 'LeadPurchaseStatus'
    ) INTO col_is_enum;
    
    IF enum_exists AND col_is_enum THEN
        RAISE NOTICE '✅ SUCCESS: LeadPurchaseStatus enum exists and status column is converted!';
    ELSIF enum_exists THEN
        RAISE WARNING '⚠️  Enum exists but column is not converted yet';
    ELSE
        RAISE WARNING '⚠️  Enum does not exist';
    END IF;
END $$;

