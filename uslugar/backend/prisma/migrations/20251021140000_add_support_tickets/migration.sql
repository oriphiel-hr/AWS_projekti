-- Support Ticket System - VIP podrška 24/7

-- CreateEnum for Support Priority
DO $$ BEGIN
    CREATE TYPE "SupportPriority" AS ENUM ('LOW', 'NORMAL', 'HIGH', 'URGENT');
EXCEPTION
    WHEN duplicate_object THEN NULL;
END $$;

-- CreateEnum for Support Status
DO $$ BEGIN
    CREATE TYPE "SupportStatus" AS ENUM ('OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED');
EXCEPTION
    WHEN duplicate_object THEN NULL;
END $$;

-- CreateEnum for Support Category
DO $$ BEGIN
    CREATE TYPE "SupportCategory" AS ENUM ('BILLING', 'TECHNICAL', 'REFUND', 'FEATURE_REQUEST', 'OTHER');
EXCEPTION
    WHEN duplicate_object THEN NULL;
END $$;

-- CreateTable SupportTicket
CREATE TABLE IF NOT EXISTS "SupportTicket" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "subject" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "priority" "SupportPriority" NOT NULL DEFAULT 'NORMAL',
    "status" "SupportStatus" NOT NULL DEFAULT 'OPEN',
    "category" "SupportCategory" NOT NULL DEFAULT 'OTHER',
    "assignedTo" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "resolvedAt" TIMESTAMP(3),
    "notes" TEXT,
    
    CONSTRAINT "SupportTicket_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX IF NOT EXISTS "SupportTicket_userId_idx" ON "SupportTicket"("userId");
CREATE INDEX IF NOT EXISTS "SupportTicket_status_idx" ON "SupportTicket"("status");
CREATE INDEX IF NOT EXISTS "SupportTicket_priority_idx" ON "SupportTicket"("priority");
CREATE INDEX IF NOT EXISTS "SupportTicket_category_idx" ON "SupportTicket"("category");

-- AddForeignKey
ALTER TABLE "SupportTicket" ADD CONSTRAINT "SupportTicket_userId_fkey" 
    FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

COMMENT ON TABLE "SupportTicket" IS 'Support ticket system za VIP podršku 24/7';
COMMENT ON COLUMN "SupportTicket"."priority" IS 'VIP = URGENT, PREMIUM = HIGH, BASIC = NORMAL';
COMMENT ON COLUMN "SupportTicket"."status" IS 'Status ticket-a';
COMMENT ON COLUMN "SupportTicket"."category" IS 'Kategorija problema';

