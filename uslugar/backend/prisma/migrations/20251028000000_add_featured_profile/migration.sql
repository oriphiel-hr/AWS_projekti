-- Add Featured Profile Feature
-- PRO users automatically get isFeatured = true

-- Add isFeatured column
ALTER TABLE "ProviderProfile" ADD COLUMN IF NOT EXISTS "isFeatured" BOOLEAN NOT NULL DEFAULT false;

-- Create index for featured providers
CREATE INDEX IF NOT EXISTS "ProviderProfile_isFeatured_idx" ON "ProviderProfile"("isFeatured");

-- Auto-set isFeatured for PRO users
CREATE OR REPLACE FUNCTION update_featured_profile()
RETURNS TRIGGER AS $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM "Subscription" 
    WHERE "userId" = NEW."userId" 
    AND "plan" = 'PRO' 
    AND "status" = 'ACTIVE'
  ) THEN
    NEW."isFeatured" := true;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to auto-update on INSERT
DROP TRIGGER IF EXISTS trigger_featured_profile_insert ON "ProviderProfile";
CREATE TRIGGER trigger_featured_profile_insert
  BEFORE INSERT ON "ProviderProfile"
  FOR EACH ROW
  EXECUTE FUNCTION update_featured_profile();

-- Create trigger to auto-update on UPDATE
DROP TRIGGER IF EXISTS trigger_featured_profile_update ON "ProviderProfile";
CREATE TRIGGER trigger_featured_profile_update
  BEFORE UPDATE ON "ProviderProfile"
  FOR EACH ROW
  EXECUTE FUNCTION update_featured_profile();

COMMENT ON COLUMN "ProviderProfile"."isFeatured" IS 'PRO users automatically get featured status';

