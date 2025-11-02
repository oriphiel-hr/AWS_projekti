-- Add STORNED status to InvoiceStatus enum
DO $$ BEGIN
    ALTER TYPE "InvoiceStatus" ADD VALUE IF NOT EXISTS 'STORNED';
EXCEPTION
    WHEN duplicate_object THEN NULL;
END $$;

-- Add storno fields to Invoice model
DO $$ BEGIN
    -- Add isStorno
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'Invoice' AND column_name = 'isStorno') THEN
        ALTER TABLE "Invoice" ADD COLUMN "isStorno" BOOLEAN NOT NULL DEFAULT false;
    END IF;

    -- Add originalInvoiceId
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'Invoice' AND column_name = 'originalInvoiceId') THEN
        ALTER TABLE "Invoice" ADD COLUMN "originalInvoiceId" TEXT;
    END IF;
END $$;

-- Add foreign key for storno relationship (self-referential)
DO $$ BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint 
        WHERE conname = 'Invoice_originalInvoiceId_fkey'
    ) THEN
        ALTER TABLE "Invoice" 
        ADD CONSTRAINT "Invoice_originalInvoiceId_fkey" 
        FOREIGN KEY ("originalInvoiceId") 
        REFERENCES "Invoice"("id") 
        ON DELETE SET NULL 
        ON UPDATE CASCADE;
    END IF;
END $$;

-- Create indexes
CREATE INDEX IF NOT EXISTS "Invoice_originalInvoiceId_idx" ON "Invoice"("originalInvoiceId");
CREATE INDEX IF NOT EXISTS "Invoice_isStorno_idx" ON "Invoice"("isStorno");

-- Update invoice number format comment (informational only, no schema change needed)

