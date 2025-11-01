-- CreateEnum (idempotent - ako već postoji, preskače se)
DO $$ BEGIN
    CREATE TYPE "InvoiceType" AS ENUM ('SUBSCRIPTION', 'LEAD_PURCHASE');
EXCEPTION
    WHEN duplicate_object THEN NULL;
END $$;

-- CreateEnum (idempotent - ako već postoji, preskače se)
DO $$ BEGIN
    CREATE TYPE "InvoiceStatus" AS ENUM ('DRAFT', 'SENT', 'PAID', 'CANCELLED');
EXCEPTION
    WHEN duplicate_object THEN NULL;
END $$;

-- CreateTable (idempotent - ako već postoji, preskače se)
DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_tables WHERE tablename = 'Invoice') THEN
        CREATE TABLE "Invoice" (
            "id" TEXT NOT NULL,
            "userId" TEXT NOT NULL,
            "invoiceNumber" TEXT NOT NULL,
            "type" "InvoiceType" NOT NULL,
            "status" "InvoiceStatus" NOT NULL DEFAULT 'DRAFT',
            "amount" INTEGER NOT NULL,
            "currency" TEXT NOT NULL DEFAULT 'EUR',
            "taxAmount" INTEGER NOT NULL DEFAULT 0,
            "totalAmount" INTEGER NOT NULL,
            "subscriptionId" TEXT,
            "leadPurchaseId" TEXT,
            "stripePaymentIntentId" TEXT,
            "stripeInvoiceId" TEXT,
            "issueDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
            "dueDate" TIMESTAMP(3),
            "paidAt" TIMESTAMP(3),
            "pdfUrl" TEXT,
            "pdfGeneratedAt" TIMESTAMP(3),
            "emailSentAt" TIMESTAMP(3),
            "emailSentTo" TEXT,
            "notes" TEXT,
            "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
            "updatedAt" TIMESTAMP(3) NOT NULL,

            CONSTRAINT "Invoice_pkey" PRIMARY KEY ("id")
        );
    END IF;
END $$;

-- CreateIndex (idempotent)
CREATE UNIQUE INDEX IF NOT EXISTS "Invoice_invoiceNumber_key" ON "Invoice"("invoiceNumber");
CREATE INDEX IF NOT EXISTS "Invoice_userId_idx" ON "Invoice"("userId");
CREATE INDEX IF NOT EXISTS "Invoice_type_idx" ON "Invoice"("type");
CREATE INDEX IF NOT EXISTS "Invoice_status_idx" ON "Invoice"("status");
CREATE INDEX IF NOT EXISTS "Invoice_issueDate_idx" ON "Invoice"("issueDate");

-- AddForeignKey (idempotent)
DO $$ BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'Invoice_userId_fkey'
    ) THEN
        ALTER TABLE "Invoice" ADD CONSTRAINT "Invoice_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
    END IF;
END $$;

DO $$ BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'Invoice_subscriptionId_fkey'
    ) THEN
        ALTER TABLE "Invoice" ADD CONSTRAINT "Invoice_subscriptionId_fkey" FOREIGN KEY ("subscriptionId") REFERENCES "Subscription"("id") ON DELETE SET NULL ON UPDATE CASCADE;
    END IF;
END $$;

DO $$ BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'Invoice_leadPurchaseId_fkey'
    ) THEN
        ALTER TABLE "Invoice" ADD CONSTRAINT "Invoice_leadPurchaseId_fkey" FOREIGN KEY ("leadPurchaseId") REFERENCES "LeadPurchase"("id") ON DELETE SET NULL ON UPDATE CASCADE;
    END IF;
END $$;

