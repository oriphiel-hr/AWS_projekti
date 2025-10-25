-- Check if SubscriptionPlan table exists
SELECT tablename 
FROM pg_tables 
WHERE schemaname = 'public' AND tablename = 'SubscriptionPlan';

-- Check Job table userId column
SELECT column_name, is_nullable, data_type 
FROM information_schema.columns 
WHERE table_name = 'Job' AND column_name = 'userId';

-- Check for linkingToken columns
SELECT column_name, data_type, is_nullable
FROM information_schema.columns 
WHERE table_name = 'Job' AND column_name IN ('linkingToken', 'linkingTokenExpiresAt');

-- Check migration history
SELECT migration_name, applied_steps_count, started_at, finished_at 
FROM _prisma_migrations 
WHERE migration_name LIKE '%20250121%' OR migration_name LIKE '%subscription%' 
ORDER BY started_at DESC;
