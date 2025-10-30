-- CreateTable (with IF NOT EXISTS check)
CREATE TABLE IF NOT EXISTS "ProviderTeamLocation" (
    "id" TEXT NOT NULL,
    "providerId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "latitude" DOUBLE PRECISION,
    "longitude" DOUBLE PRECISION,
    "address" TEXT,
    "postalCode" TEXT,
    "radiusKm" INTEGER NOT NULL DEFAULT 50,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "isPrimary" BOOLEAN NOT NULL DEFAULT false,
    "notes" TEXT,
    "lastActiveAt" TIMESTAMP(3),
    "leadsReceived" INTEGER NOT NULL DEFAULT 0,
    "leadsAccepted" INTEGER NOT NULL DEFAULT 0,
    "leadsConverted" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ProviderTeamLocation_pkey" PRIMARY KEY ("id")
);

-- CreateIndex (with IF NOT EXISTS)
CREATE INDEX IF NOT EXISTS "ProviderTeamLocation_providerId_idx" ON "ProviderTeamLocation"("providerId");

CREATE INDEX IF NOT EXISTS "ProviderTeamLocation_isActive_idx" ON "ProviderTeamLocation"("isActive");

CREATE INDEX IF NOT EXISTS "ProviderTeamLocation_isPrimary_idx" ON "ProviderTeamLocation"("isPrimary");

CREATE INDEX IF NOT EXISTS "ProviderTeamLocation_city_idx" ON "ProviderTeamLocation"("city");

-- AddForeignKey (with IF NOT EXISTS check)
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'ProviderTeamLocation_providerId_fkey'
    ) THEN
        ALTER TABLE "ProviderTeamLocation" ADD CONSTRAINT "ProviderTeamLocation_providerId_fkey" 
        FOREIGN KEY ("providerId") REFERENCES "ProviderProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;
    END IF;
END $$;

