-- CreateEnum: Queue statuses
CREATE TYPE "LeadQueueStatus" AS ENUM ('WAITING', 'OFFERED', 'ACCEPTED', 'DECLINED', 'EXPIRED', 'SKIPPED');

-- CreateEnum: Queue responses
CREATE TYPE "QueueResponse" AS ENUM ('INTERESTED', 'NOT_INTERESTED', 'NO_RESPONSE');

-- AlterTable: Category - Add NKD and license fields
ALTER TABLE "Category" ADD COLUMN "nkdCode" TEXT;
ALTER TABLE "Category" ADD COLUMN "requiresLicense" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "Category" ADD COLUMN "licenseType" TEXT;
ALTER TABLE "Category" ADD COLUMN "licenseAuthority" TEXT;

-- AlterTable: ProviderProfile - Add license and category limits
ALTER TABLE "ProviderProfile" ADD COLUMN "maxCategories" INTEGER NOT NULL DEFAULT 5;
ALTER TABLE "ProviderProfile" ADD COLUMN "nkdCodes" TEXT[];

-- CreateTable: ProviderLicense
CREATE TABLE "ProviderLicense" (
    "id" TEXT NOT NULL,
    "providerId" TEXT NOT NULL,
    "licenseType" TEXT NOT NULL,
    "licenseNumber" TEXT NOT NULL,
    "issuingAuthority" TEXT NOT NULL,
    "issuedAt" TIMESTAMP(3) NOT NULL,
    "expiresAt" TIMESTAMP(3),
    "documentUrl" TEXT,
    "isVerified" BOOLEAN NOT NULL DEFAULT false,
    "verifiedAt" TIMESTAMP(3),
    "verifiedBy" TEXT,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ProviderLicense_pkey" PRIMARY KEY ("id")
);

-- CreateTable: LeadQueue
CREATE TABLE "LeadQueue" (
    "id" TEXT NOT NULL,
    "jobId" TEXT NOT NULL,
    "providerId" TEXT NOT NULL,
    "position" INTEGER NOT NULL,
    "status" "LeadQueueStatus" NOT NULL DEFAULT 'WAITING',
    "offeredAt" TIMESTAMP(3),
    "respondedAt" TIMESTAMP(3),
    "expiresAt" TIMESTAMP(3),
    "response" "QueueResponse",
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "LeadQueue_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ProviderLicense_providerId_idx" ON "ProviderLicense"("providerId");
CREATE INDEX "ProviderLicense_isVerified_idx" ON "ProviderLicense"("isVerified");

-- CreateIndex
CREATE INDEX "LeadQueue_jobId_position_idx" ON "LeadQueue"("jobId", "position");
CREATE INDEX "LeadQueue_providerId_status_idx" ON "LeadQueue"("providerId", "status");
CREATE INDEX "LeadQueue_status_idx" ON "LeadQueue"("status");

-- CreateIndex: Unique constraint for LeadQueue
CREATE UNIQUE INDEX "LeadQueue_jobId_providerId_key" ON "LeadQueue"("jobId", "providerId");

-- AddForeignKey
ALTER TABLE "ProviderLicense" ADD CONSTRAINT "ProviderLicense_providerId_fkey" FOREIGN KEY ("providerId") REFERENCES "ProviderProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LeadQueue" ADD CONSTRAINT "LeadQueue_jobId_fkey" FOREIGN KEY ("jobId") REFERENCES "Job"("id") ON DELETE CASCADE ON UPDATE CASCADE;

