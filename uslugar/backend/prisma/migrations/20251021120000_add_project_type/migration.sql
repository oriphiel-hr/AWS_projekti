-- Add projectType and customFields to Job table
-- Migration: 20251021120000_add_project_type

-- AlterTable: Add projectType column
ALTER TABLE "Job" ADD COLUMN "projectType" TEXT;

-- AlterTable: Add customFields column  
ALTER TABLE "Job" ADD COLUMN "customFields" JSONB;

