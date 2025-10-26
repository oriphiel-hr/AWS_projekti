# Fix Failed Migration

**Problem**: Migration `20251021140000_add_support_tickets` failed

## Solution

### Option 1: Run the resolve script manually
```bash
# Connect to database and run the SQL script
psql "postgresql://uslugar_user:Pastor123@uslugar-db.cr80o0eeg3gy.eu-north-1.rds.amazonaws.com:5432/uslugar" -f prisma/resolve-failed-migration.sql
```

### Option 2: Update migration directly via AWS ECS
```bash
# Execute command on running ECS task
aws ecs execute-command \
  --cluster apps-cluster \
  --task <TASK_ID> \
  --container prisma \
  --interactive \
  --command "psql \$DATABASE_URL -f prisma/resolve-failed-migration.sql"
```

### Option 3: Mark migration as rolled back
```sql
-- Update _prisma_migrations table
UPDATE "_prisma_migrations" 
SET "finished_at" = NOW(), 
    "rolled_back_at" = NOW()
WHERE "migration_name" = '20251021140000_add_support_tickets' 
  AND "finished_at" IS NULL;
```

After resolving, run:
```bash
npx prisma migrate deploy
```

