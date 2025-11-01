-- Add identity verification date fields to ProviderProfile

ALTER TABLE "ProviderProfile" 
ADD COLUMN IF NOT EXISTS "identityEmailVerifiedAt" TIMESTAMP(3),
ADD COLUMN IF NOT EXISTS "identityPhoneVerifiedAt" TIMESTAMP(3),
ADD COLUMN IF NOT EXISTS "identityDnsVerifiedAt" TIMESTAMP(3);

