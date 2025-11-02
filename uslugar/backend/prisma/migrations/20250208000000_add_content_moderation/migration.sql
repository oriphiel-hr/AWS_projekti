-- CreateEnum
CREATE TYPE "ModerationStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- AlterTable: Job - Add moderation fields
ALTER TABLE "Job" ADD COLUMN "moderationStatus" "ModerationStatus" NOT NULL DEFAULT 'PENDING';
ALTER TABLE "Job" ADD COLUMN "moderationReviewedBy" TEXT;
ALTER TABLE "Job" ADD COLUMN "moderationReviewedAt" TIMESTAMP(3);
ALTER TABLE "Job" ADD COLUMN "moderationRejectionReason" TEXT;
ALTER TABLE "Job" ADD COLUMN "moderationNotes" TEXT;
CREATE INDEX "Job_moderationStatus_idx" ON "Job"("moderationStatus");

-- AlterTable: Review - Add moderation fields
ALTER TABLE "Review" ADD COLUMN "moderationStatus" "ModerationStatus" NOT NULL DEFAULT 'PENDING';
ALTER TABLE "Review" ADD COLUMN "moderationReviewedBy" TEXT;
ALTER TABLE "Review" ADD COLUMN "moderationReviewedAt" TIMESTAMP(3);
ALTER TABLE "Review" ADD COLUMN "moderationRejectionReason" TEXT;
ALTER TABLE "Review" ADD COLUMN "moderationNotes" TEXT;
CREATE INDEX "Review_moderationStatus_idx" ON "Review"("moderationStatus");

-- AlterTable: Offer - Add moderation fields
ALTER TABLE "Offer" ADD COLUMN "moderationStatus" "ModerationStatus" NOT NULL DEFAULT 'PENDING';
ALTER TABLE "Offer" ADD COLUMN "moderationReviewedBy" TEXT;
ALTER TABLE "Offer" ADD COLUMN "moderationReviewedAt" TIMESTAMP(3);
ALTER TABLE "Offer" ADD COLUMN "moderationRejectionReason" TEXT;
ALTER TABLE "Offer" ADD COLUMN "moderationNotes" TEXT;
CREATE INDEX "Offer_moderationStatus_idx" ON "Offer"("moderationStatus");

-- AlterTable: ChatMessage - Add moderation fields (optional, only for reported messages)
ALTER TABLE "ChatMessage" ADD COLUMN "moderationStatus" "ModerationStatus";
ALTER TABLE "ChatMessage" ADD COLUMN "moderationReportedBy" TEXT;
ALTER TABLE "ChatMessage" ADD COLUMN "moderationReportedAt" TIMESTAMP(3);
ALTER TABLE "ChatMessage" ADD COLUMN "moderationReviewedBy" TEXT;
ALTER TABLE "ChatMessage" ADD COLUMN "moderationReviewedAt" TIMESTAMP(3);
ALTER TABLE "ChatMessage" ADD COLUMN "moderationRejectionReason" TEXT;
ALTER TABLE "ChatMessage" ADD COLUMN "moderationNotes" TEXT;
CREATE INDEX "ChatMessage_moderationStatus_idx" ON "ChatMessage"("moderationStatus");

