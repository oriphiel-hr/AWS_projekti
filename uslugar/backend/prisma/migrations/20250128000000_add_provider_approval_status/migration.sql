-- CreateEnum
CREATE TYPE "ProviderApprovalStatus" AS ENUM ('WAITING_FOR_APPROVAL', 'APPROVED', 'REJECTED', 'INACTIVE');

-- AlterTable
ALTER TABLE "ProviderProfile" ADD COLUMN "approvalStatus" "ProviderApprovalStatus" DEFAULT 'WAITING_FOR_APPROVAL';
