-- CreateEnum for new enums
CREATE TYPE "NotificationType" AS ENUM ('NEW_JOB', 'NEW_OFFER', 'OFFER_ACCEPTED', 'OFFER_REJECTED', 'JOB_COMPLETED', 'REVIEW_RECEIVED', 'SYSTEM');
CREATE TYPE "Urgency" AS ENUM ('LOW', 'NORMAL', 'HIGH', 'URGENT');
CREATE TYPE "JobSize" AS ENUM ('SMALL', 'MEDIUM', 'LARGE', 'EXTRA_LARGE');

-- AlterTable User - add missing columns
ALTER TABLE "User" ADD COLUMN "latitude" DOUBLE PRECISION;
ALTER TABLE "User" ADD COLUMN "longitude" DOUBLE PRECISION;
ALTER TABLE "User" ADD COLUMN "isVerified" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable ProviderProfile - add missing columns
ALTER TABLE "ProviderProfile" ADD COLUMN "specialties" TEXT[];
ALTER TABLE "ProviderProfile" ADD COLUMN "experience" INTEGER;
ALTER TABLE "ProviderProfile" ADD COLUMN "website" TEXT;
ALTER TABLE "ProviderProfile" ADD COLUMN "isAvailable" BOOLEAN NOT NULL DEFAULT true;
ALTER TABLE "ProviderProfile" ADD COLUMN "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE "ProviderProfile" ADD COLUMN "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable Category - add missing columns
ALTER TABLE "Category" ADD COLUMN "description" TEXT;
ALTER TABLE "Category" ADD COLUMN "parentId" TEXT;
ALTER TABLE "Category" ADD COLUMN "isActive" BOOLEAN NOT NULL DEFAULT true;
ALTER TABLE "Category" ADD COLUMN "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable Job - add missing columns
ALTER TABLE "Job" ADD COLUMN "latitude" DOUBLE PRECISION;
ALTER TABLE "Job" ADD COLUMN "longitude" DOUBLE PRECISION;
ALTER TABLE "Job" ADD COLUMN "urgency" "Urgency" NOT NULL DEFAULT 'NORMAL';
ALTER TABLE "Job" ADD COLUMN "jobSize" "JobSize";
ALTER TABLE "Job" ADD COLUMN "deadline" TIMESTAMP(3);
ALTER TABLE "Job" ADD COLUMN "images" TEXT[];

-- AlterTable Offer - add missing columns
ALTER TABLE "Offer" ADD COLUMN "isNegotiable" BOOLEAN NOT NULL DEFAULT true;
ALTER TABLE "Offer" ADD COLUMN "estimatedDays" INTEGER;
ALTER TABLE "Offer" ADD COLUMN "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- CreateTable Notification
CREATE TABLE "Notification" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "type" "NotificationType" NOT NULL,
    "isRead" BOOLEAN NOT NULL DEFAULT false,
    "userId" TEXT NOT NULL,
    "jobId" TEXT,
    "offerId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Notification_pkey" PRIMARY KEY ("id")
);

-- CreateTable ChatRoom
CREATE TABLE "ChatRoom" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "jobId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ChatRoom_pkey" PRIMARY KEY ("id")
);

-- CreateTable ChatMessage
CREATE TABLE "ChatMessage" (
    "id" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "senderId" TEXT NOT NULL,
    "roomId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ChatMessage_pkey" PRIMARY KEY ("id")
);

-- CreateTable Subscription
CREATE TABLE "Subscription" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "plan" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "credits" INTEGER NOT NULL DEFAULT 0,
    "expiresAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Subscription_pkey" PRIMARY KEY ("id")
);

-- CreateTable for ChatRoom participants (many-to-many)
CREATE TABLE "_participants" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Subscription_userId_key" ON "Subscription"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "_participants_AB_unique" ON "_participants"("A", "B");

-- CreateIndex
CREATE INDEX "_participants_B_index" ON "_participants"("B");

-- AddForeignKey
ALTER TABLE "Category" ADD CONSTRAINT "Category_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "Category"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChatRoom" ADD CONSTRAINT "ChatRoom_jobId_fkey" FOREIGN KEY ("jobId") REFERENCES "Job"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChatMessage" ADD CONSTRAINT "ChatMessage_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChatMessage" ADD CONSTRAINT "ChatMessage_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "ChatRoom"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_participants" ADD CONSTRAINT "_participants_A_fkey" FOREIGN KEY ("A") REFERENCES "ChatRoom"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_participants" ADD CONSTRAINT "_participants_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

