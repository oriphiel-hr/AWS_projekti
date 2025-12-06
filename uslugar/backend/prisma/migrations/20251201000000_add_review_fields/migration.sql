-- Add missing Review fields
-- Migration: 20251201000000_add_review_fields
-- Description: Dodaje sva nedostajuća polja u Review tabelu prema Prisma schema

-- Create enums if they don't exist
DO $$ BEGIN
    CREATE TYPE "ModerationStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE "ReportStatus" AS ENUM ('PENDING', 'REVIEWED', 'DISMISSED', 'ACCEPTED');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- RECIPROCAL DELAY - Simultana objava ocjena
ALTER TABLE "Review" ADD COLUMN IF NOT EXISTS "isPublished" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "Review" ADD COLUMN IF NOT EXISTS "publishedAt" TIMESTAMP(3);
ALTER TABLE "Review" ADD COLUMN IF NOT EXISTS "reviewDeadline" TIMESTAMP(3);

-- REPLY - Odgovor na recenziju (1x dozvoljen)
ALTER TABLE "Review" ADD COLUMN IF NOT EXISTS "replyText" TEXT;
ALTER TABLE "Review" ADD COLUMN IF NOT EXISTS "repliedAt" TIMESTAMP(3);
ALTER TABLE "Review" ADD COLUMN IF NOT EXISTS "hasReplied" BOOLEAN NOT NULL DEFAULT false;

-- MODERATION
ALTER TABLE "Review" ADD COLUMN IF NOT EXISTS "moderationStatus" "ModerationStatus" NOT NULL DEFAULT 'PENDING';
ALTER TABLE "Review" ADD COLUMN IF NOT EXISTS "moderationReviewedBy" TEXT;
ALTER TABLE "Review" ADD COLUMN IF NOT EXISTS "moderationReviewedAt" TIMESTAMP(3);
ALTER TABLE "Review" ADD COLUMN IF NOT EXISTS "moderationRejectionReason" TEXT;
ALTER TABLE "Review" ADD COLUMN IF NOT EXISTS "moderationNotes" TEXT;

-- REPORT - Prijava lažnih ocjena
ALTER TABLE "Review" ADD COLUMN IF NOT EXISTS "isReported" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "Review" ADD COLUMN IF NOT EXISTS "reportedBy" TEXT;
ALTER TABLE "Review" ADD COLUMN IF NOT EXISTS "reportedAt" TIMESTAMP(3);
ALTER TABLE "Review" ADD COLUMN IF NOT EXISTS "reportReason" TEXT;
ALTER TABLE "Review" ADD COLUMN IF NOT EXISTS "reportStatus" "ReportStatus";
ALTER TABLE "Review" ADD COLUMN IF NOT EXISTS "reportReviewedBy" TEXT;
ALTER TABLE "Review" ADD COLUMN IF NOT EXISTS "reportReviewedAt" TIMESTAMP(3);
ALTER TABLE "Review" ADD COLUMN IF NOT EXISTS "reportReviewNotes" TEXT;

-- Create indexes if they don't exist
CREATE INDEX IF NOT EXISTS "Review_moderationStatus_idx" ON "Review"("moderationStatus");
CREATE INDEX IF NOT EXISTS "Review_isPublished_idx" ON "Review"("isPublished");
CREATE INDEX IF NOT EXISTS "Review_reviewDeadline_idx" ON "Review"("reviewDeadline");
CREATE INDEX IF NOT EXISTS "Review_isReported_idx" ON "Review"("isReported");
CREATE INDEX IF NOT EXISTS "Review_reportStatus_idx" ON "Review"("reportStatus");

-- Create unique constraint if it doesn't exist
CREATE UNIQUE INDEX IF NOT EXISTS "Review_jobId_fromUserId_key" ON "Review"("jobId", "fromUserId");

