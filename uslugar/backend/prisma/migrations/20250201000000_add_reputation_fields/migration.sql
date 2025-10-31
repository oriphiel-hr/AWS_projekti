-- Add reputation system fields to ProviderProfile
ALTER TABLE "ProviderProfile" 
ADD COLUMN IF NOT EXISTS "avgResponseTimeMinutes" DOUBLE PRECISION NOT NULL DEFAULT 0,
ADD COLUMN IF NOT EXISTS "totalResponseTimeTracked" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN IF NOT EXISTS "conversionRate" DOUBLE PRECISION NOT NULL DEFAULT 0;

-- Create index for faster reputation-based queries
CREATE INDEX IF NOT EXISTS "ProviderProfile_avgResponseTimeMinutes_idx" ON "ProviderProfile"("avgResponseTimeMinutes");
CREATE INDEX IF NOT EXISTS "ProviderProfile_conversionRate_idx" ON "ProviderProfile"("conversionRate");

