-- Add KYC-lite verification fields to ProviderProfile table

-- Add KYC verification fields
ALTER TABLE "ProviderProfile" ADD COLUMN IF NOT EXISTS "kycVerified" BOOLEAN DEFAULT false;
ALTER TABLE "ProviderProfile" ADD COLUMN IF NOT EXISTS "kycDocumentUrl" TEXT;
ALTER TABLE "ProviderProfile" ADD COLUMN IF NOT EXISTS "kycExtractedOib" TEXT;
ALTER TABLE "ProviderProfile" ADD COLUMN IF NOT EXISTS "kycExtractedName" TEXT;
ALTER TABLE "ProviderProfile" ADD COLUMN IF NOT EXISTS "kycDocumentType" TEXT;
ALTER TABLE "ProviderProfile" ADD COLUMN IF NOT EXISTS "kycPublicConsent" BOOLEAN DEFAULT false;
ALTER TABLE "ProviderProfile" ADD COLUMN IF NOT EXISTS "kycVerificationNotes" TEXT;
ALTER TABLE "ProviderProfile" ADD COLUMN IF NOT EXISTS "kycVerifiedAt" TIMESTAMP(3);
ALTER TABLE "ProviderProfile" ADD COLUMN IF NOT EXISTS "kycOcrVerified" BOOLEAN DEFAULT false;
ALTER TABLE "ProviderProfile" ADD COLUMN IF NOT EXISTS "kycOibValidated" BOOLEAN DEFAULT false;
ALTER TABLE "ProviderProfile" ADD COLUMN IF NOT EXISTS "kycObrtnRegChecked" BOOLEAN DEFAULT false;
ALTER TABLE "ProviderProfile" ADD COLUMN IF NOT EXISTS "kycKamaraChecked" BOOLEAN DEFAULT false;
ALTER TABLE "ProviderProfile" ADD COLUMN IF NOT EXISTS "kycViesChecked" BOOLEAN DEFAULT false;

-- Add comments for documentation
COMMENT ON COLUMN "ProviderProfile"."kycVerified" IS 'Verificiran status pružatelja usluga';
COMMENT ON COLUMN "ProviderProfile"."kycDocumentUrl" IS 'URL Rješenja Porezne uprave';
COMMENT ON COLUMN "ProviderProfile"."kycExtractedOib" IS 'OIB extrahiran iz dokumenta OCR-om';
COMMENT ON COLUMN "ProviderProfile"."kycExtractedName" IS 'Ime extrahirano iz dokumenta OCR-om';
COMMENT ON COLUMN "ProviderProfile"."kycDocumentType" IS 'Tip dokumenta (RPO_SOLUTION, OBRT_REGISTRY, etc.)';
COMMENT ON COLUMN "ProviderProfile"."kycPublicConsent" IS 'Izjava korisnika za javni prikaz podataka (GDPR)';
COMMENT ON COLUMN "ProviderProfile"."kycVerificationNotes" IS 'Admin bilješke o verifikaciji';
COMMENT ON COLUMN "ProviderProfile"."kycVerifiedAt" IS 'Datum verifikacije';
COMMENT ON COLUMN "ProviderProfile"."kycOcrVerified" IS 'OCR verifikacija prošla';
COMMENT ON COLUMN "ProviderProfile"."kycOibValidated" IS 'OIB algoritamski validiran';
COMMENT ON COLUMN "ProviderProfile"."kycObrtnRegChecked" IS 'Provjeren Obrtnim registrom';
COMMENT ON COLUMN "ProviderProfile"."kycKamaraChecked" IS 'Provjeren komorskim imenikom (odvjetnik/liječnik/arhitekt)';
COMMENT ON COLUMN "ProviderProfile"."kycViesChecked" IS 'Provjeren VIES (PDV)';

