-- Add company email verification fields to ProviderProfile
ALTER TABLE "ProviderProfile" ADD COLUMN IF NOT EXISTS "identityEmailAddress" TEXT;
ALTER TABLE "ProviderProfile" ADD COLUMN IF NOT EXISTS "identityEmailToken" TEXT;
ALTER TABLE "ProviderProfile" ADD COLUMN IF NOT EXISTS "identityEmailTokenExpiresAt" TIMESTAMP(3);

-- Create unique index for identityEmailToken
CREATE UNIQUE INDEX IF NOT EXISTS "ProviderProfile_identityEmailToken_key" ON "ProviderProfile"("identityEmailToken");

