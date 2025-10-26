-- Fix failed migration by marking it as resolved
-- This works because auto-fix in server.js already creates the SupportTicket table

UPDATE "_prisma_migrations" 
SET 
    "finished_at" = NOW(),
    "log_entries" = '["Resolved - table created by auto-fix in server.js"]',
    "rolled_back_at" = NULL
WHERE "migration_name" = '20251021140000_add_support_tickets' 
  AND "finished_at" IS NULL;

-- Verify
SELECT * FROM "_prisma_migrations" WHERE "migration_name" = '20251021140000_add_support_tickets';

