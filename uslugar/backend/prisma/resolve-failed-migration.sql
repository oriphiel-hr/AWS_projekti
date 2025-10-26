-- Resolve failed migration 20251021140000_add_support_tickets
-- Mark it as rolled back since auto-fix in server.js handles the table creation

-- First, check if the migration exists and mark it as rolled back
-- This will be run manually via ECS execute-command

-- The auto-fix in server.js already creates the SupportTicket table
-- So we just need to mark the migration as resolved

-- Step 1: Check if enums exist, if not create them
DO $$ BEGIN
    CREATE TYPE "SupportPriority" AS ENUM ('LOW', 'NORMAL', 'HIGH', 'URGENT');
EXCEPTION
    WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
    CREATE TYPE "SupportStatus" AS ENUM ('OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED');
EXCEPTION
    WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
    CREATE TYPE "SupportCategory" AS ENUM ('BILLING', 'TECHNICAL', 'REFUND', 'FEATURE_REQUEST', 'OTHER');
EXCEPTION
    WHEN duplicate_object THEN NULL;
END $$;

-- Step 2: Create SupportTicket table if it doesn't exist
CREATE TABLE IF NOT EXISTS "SupportTicket" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "subject" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "priority" "SupportPriority" NOT NULL DEFAULT 'NORMAL',
    "status" "SupportStatus" NOT NULL DEFAULT 'OPEN',
    "category" "SupportCategory" NOT NULL DEFAULT 'OTHER',
    "assignedTo" TEXT,
    "notes" TEXT,
    "resolvedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Step 3: Add indexes
CREATE INDEX IF NOT EXISTS "SupportTicket_userId_idx" ON "SupportTicket"("userId");
CREATE INDEX IF NOT EXISTS "SupportTicket_status_idx" ON "SupportTicket"("status");
CREATE INDEX IF NOT EXISTS "SupportTicket_priority_idx" ON "SupportTicket"("priority");
CREATE INDEX IF NOT EXISTS "SupportTicket_category_idx" ON "SupportTicket"("category");

-- Step 4: Add foreign key if not exists
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint 
        WHERE conname = 'SupportTicket_userId_fkey'
    ) THEN
        ALTER TABLE "SupportTicket" ADD CONSTRAINT "SupportTicket_userId_fkey" 
            FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
    END IF;
END $$;

-- Step 5: Update _prisma_migrations table to mark failed migration as resolved
UPDATE "_prisma_migrations" 
SET "finished_at" = NOW(), 
    "log_entries" = '["Resolved via manual fix and auto-create in server.js"]'
WHERE "migration_name" = '20251021140000_add_support_tickets' 
  AND "finished_at" IS NULL;

