// Fix failed migration 20251021140000_add_support_tickets
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function fixMigration() {
  try {
    console.log('🔧 Marking failed migration as resolved...');
    
    const result = await prisma.$executeRaw`
      UPDATE "_prisma_migrations" 
      SET "finished_at" = NOW(), 
          "log_entries" = '[{"Resolved": "table created by auto-fix in server.js"}]'
      WHERE "migration_name" = '20251021140000_add_support_tickets' 
        AND "finished_at" IS NULL
    `;
    
    console.log(`✅ Updated ${result} migration record(s)`);
    
    // Verify
    const migrations = await prisma.$queryRaw`
      SELECT "migration_name", "finished_at", "applied_steps_count" 
      FROM "_prisma_migrations" 
      WHERE "migration_name" = '20251021140000_add_support_tickets'
    `;
    
    console.log('📊 Migration status:', migrations);
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

fixMigration();

