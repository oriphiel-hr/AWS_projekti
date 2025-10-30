-- CreateTable
CREATE TABLE "ProviderTeamLocation" (
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

-- CreateIndex
CREATE INDEX "ProviderTeamLocation_providerId_idx" ON "ProviderTeamLocation"("providerId");

-- CreateIndex
CREATE INDEX "ProviderTeamLocation_isActive_idx" ON "ProviderTeamLocation"("isActive");

-- CreateIndex
CREATE INDEX "ProviderTeamLocation_isPrimary_idx" ON "ProviderTeamLocation"("isPrimary");

-- CreateIndex
CREATE INDEX "ProviderTeamLocation_city_idx" ON "ProviderTeamLocation"("city");

-- AddForeignKey
ALTER TABLE "ProviderTeamLocation" ADD CONSTRAINT "ProviderTeamLocation_providerId_fkey" FOREIGN KEY ("providerId") REFERENCES "ProviderProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

