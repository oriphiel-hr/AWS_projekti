-- Add Director & Team Management fields to ProviderProfile
-- This enables company team structure where one provider is the director
-- and others are team members

-- Add isDirector field (default false - most providers are not directors)
ALTER TABLE "ProviderProfile" ADD COLUMN IF NOT EXISTS "isDirector" BOOLEAN NOT NULL DEFAULT false;

-- Add companyId field (self-reference for team members to link to director)
ALTER TABLE "ProviderProfile" ADD COLUMN IF NOT EXISTS "companyId" TEXT;

-- Add foreign key constraint for companyId (self-reference)
-- This allows team members to reference their director's ProviderProfile
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint 
    WHERE conname = 'ProviderProfile_companyId_fkey'
  ) THEN
    ALTER TABLE "ProviderProfile" 
    ADD CONSTRAINT "ProviderProfile_companyId_fkey" 
    FOREIGN KEY ("companyId") 
    REFERENCES "ProviderProfile"("id") 
    ON DELETE SET NULL 
    ON UPDATE CASCADE;
  END IF;
END $$;

-- Create index for faster queries on isDirector
CREATE INDEX IF NOT EXISTS "ProviderProfile_isDirector_idx" ON "ProviderProfile"("isDirector");

-- Create index for faster queries on companyId (team member lookups)
CREATE INDEX IF NOT EXISTS "ProviderProfile_companyId_idx" ON "ProviderProfile"("companyId");

-- Add comments for documentation
COMMENT ON COLUMN "ProviderProfile"."isDirector" IS 'Da li je direktor/administrator profila tvrtke';
COMMENT ON COLUMN "ProviderProfile"."companyId" IS 'ID tvrtke (ako je član tima, povezuje se s direktorom)';

