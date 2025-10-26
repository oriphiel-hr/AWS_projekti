// Direct Database Fix - Add projectType columns
import { PrismaClient } from '@prisma/client';
import pg from 'pg';

const DATABASE_URL = "postgres://uslugar_user:Pastor123@uslugar-db.cr80o0eeg3gy.eu-north-1.rds.amazonaws.com:5432/uslugar";

async function fixDatabase() {
  console.log('🔧 Fixing production database...\n');
  
  const client = new pg.Client(DATABASE_URL);
  
  try {
    await client.connect();
    console.log('✅ Connected to production database\n');
    
    // Check if columns exist
    const checkQuery = `
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'Job' 
      AND column_name IN ('projectType', 'customFields')
    `;
    
    const result = await client.query(checkQuery);
    const existingColumns = result.rows.map(r => r.column_name);
    
    if (existingColumns.includes('projectType') && existingColumns.includes('customFields')) {
      console.log('✅ Columns already exist!');
      return;
    }
    
    // Add missing columns
    console.log('Adding missing columns...\n');
    
    if (!existingColumns.includes('projectType')) {
      await client.query('ALTER TABLE "Job" ADD COLUMN IF NOT EXISTS "projectType" TEXT');
      console.log('✅ Added projectType column');
    }
    
    if (!existingColumns.includes('customFields')) {
      await client.query('ALTER TABLE "Job" ADD COLUMN IF NOT EXISTS "customFields" JSONB');
      console.log('✅ Added customFields column');
    }
    
    console.log('\n✅ Database fix complete!');
    console.log('\nTest: https://uslugar.oriph.io/#leads');
    
  } catch (error) {
    console.error('\n❌ Database fix failed:', error.message);
    console.error('\nError details:', error);
  } finally {
    await client.end();
  }
}

fixDatabase();

