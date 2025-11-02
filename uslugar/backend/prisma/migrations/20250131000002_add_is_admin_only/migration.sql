-- AlterTable: Dodaj isAdminOnly kolonu u DocumentationFeature
ALTER TABLE "DocumentationFeature" ADD COLUMN IF NOT EXISTS "isAdminOnly" BOOLEAN NOT NULL DEFAULT false;

-- Kreiraj index za brzo filtriranje admin-only funkcionalnosti
CREATE INDEX IF NOT EXISTS "DocumentationFeature_isAdminOnly_idx" ON "DocumentationFeature"("isAdminOnly");

