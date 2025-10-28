-- Add Badge System fields to ProviderProfile
ALTER TABLE "ProviderProfile" 
  ADD COLUMN IF NOT EXISTS "badgeData" JSONB,
  ADD COLUMN IF NOT EXISTS "identityEmailVerified" BOOLEAN DEFAULT false,
  ADD COLUMN IF NOT EXISTS "identityPhoneVerified" BOOLEAN DEFAULT false,
  ADD COLUMN IF NOT EXISTS "identityDnsVerified" BOOLEAN DEFAULT false,
  ADD COLUMN IF NOT EXISTS "safetyInsuranceUrl" TEXT,
  ADD COLUMN IF NOT EXISTS "safetyInsuranceUploadedAt" TIMESTAMP(3);

