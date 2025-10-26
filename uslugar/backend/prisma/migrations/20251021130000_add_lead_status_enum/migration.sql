-- CreateEnum for LeadStatus if it doesn't exist
DO $$ BEGIN
    CREATE TYPE "LeadStatus" AS ENUM ('AVAILABLE', 'ASSIGNED', 'CONTACTED', 'CONVERTED', 'REFUNDED');
EXCEPTION
    WHEN duplicate_object THEN NULL;
END $$;

