-- Add refund request status tracking to LeadPurchase model
-- Allows admin approval workflow for refunds

-- Create RefundRequestStatus enum
DO $$ BEGIN
    CREATE TYPE "RefundRequestStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');
EXCEPTION
    WHEN duplicate_object THEN NULL;
END $$;

-- Add refund request fields to LeadPurchase
DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'LeadPurchase' AND column_name = 'refundRequestStatus') THEN
        ALTER TABLE "LeadPurchase" ADD COLUMN "refundRequestStatus" "RefundRequestStatus";
    END IF;
END $$;

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'LeadPurchase' AND column_name = 'refundRequestedAt') THEN
        ALTER TABLE "LeadPurchase" ADD COLUMN "refundRequestedAt" TIMESTAMP(3);
    END IF;
END $$;

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'LeadPurchase' AND column_name = 'refundApprovedBy') THEN
        ALTER TABLE "LeadPurchase" ADD COLUMN "refundApprovedBy" TEXT;
    END IF;
END $$;

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'LeadPurchase' AND column_name = 'refundApprovedAt') THEN
        ALTER TABLE "LeadPurchase" ADD COLUMN "refundApprovedAt" TIMESTAMP(3);
    END IF;
END $$;

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'LeadPurchase' AND column_name = 'refundRejectedReason') THEN
        ALTER TABLE "LeadPurchase" ADD COLUMN "refundRejectedReason" TEXT;
    END IF;
END $$;

-- Create index for better query performance
CREATE INDEX IF NOT EXISTS "LeadPurchase_refundRequestStatus_idx" ON "LeadPurchase"("refundRequestStatus");

