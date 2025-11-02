-- Add fiscalization fields to Invoice model
-- HR Fiskalizacija - ZKI i JIR support

DO $$ BEGIN
    -- Add ZKI Code
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'Invoice' AND column_name = 'zkiCode') THEN
        ALTER TABLE "Invoice" ADD COLUMN "zkiCode" TEXT;
    END IF;

    -- Add JIR Code
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'Invoice' AND column_name = 'jirCode') THEN
        ALTER TABLE "Invoice" ADD COLUMN "jirCode" TEXT;
    END IF;

    -- Add fiscalizedAt
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'Invoice' AND column_name = 'fiscalizedAt') THEN
        ALTER TABLE "Invoice" ADD COLUMN "fiscalizedAt" TIMESTAMP(3);
    END IF;

    -- Add fiscalizationStatus
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'Invoice' AND column_name = 'fiscalizationStatus') THEN
        ALTER TABLE "Invoice" ADD COLUMN "fiscalizationStatus" TEXT;
    END IF;

    -- Add fiscalizationError
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'Invoice' AND column_name = 'fiscalizationError') THEN
        ALTER TABLE "Invoice" ADD COLUMN "fiscalizationError" TEXT;
    END IF;

    -- Add qrCodeUrl
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'Invoice' AND column_name = 'qrCodeUrl') THEN
        ALTER TABLE "Invoice" ADD COLUMN "qrCodeUrl" TEXT;
    END IF;
END $$;

-- Create index on fiscalizationStatus for faster queries
CREATE INDEX IF NOT EXISTS "Invoice_fiscalizationStatus_idx" ON "Invoice"("fiscalizationStatus");

-- Create index on fiscalizedAt
CREATE INDEX IF NOT EXISTS "Invoice_fiscalizedAt_idx" ON "Invoice"("fiscalizedAt");

