-- Migration: Allow same email for different roles, but unique per role
-- This allows companies to register as both USER and PROVIDER

-- Step 1: Drop existing unique constraint on email
ALTER TABLE "User" DROP CONSTRAINT IF EXISTS "User_email_key";

-- Step 2: Create composite unique constraint on email + role
-- This allows same email for different roles (e.g., USER and PROVIDER)
-- but prevents duplicate email within same role
CREATE UNIQUE INDEX IF NOT EXISTS "User_email_role_key" ON "User"("email", "role");

-- Note: If there are existing duplicate emails within same role, 
-- this migration will fail. Clean up duplicates first if needed:
-- DELETE FROM "User" WHERE id IN (
--   SELECT id FROM (
--     SELECT id, ROW_NUMBER() OVER (PARTITION BY email, role ORDER BY "createdAt") as rn
--     FROM "User"
--   ) t WHERE rn > 1
-- );

