-- Migration: Add CASCADE DELETE to all foreign keys
-- Date: 2025-10-20
-- Description: Dodaje onDelete: Cascade na sve foreign key relacije

-- Drop existing foreign keys and recreate with CASCADE
-- ProviderProfile
ALTER TABLE "ProviderProfile" DROP CONSTRAINT IF EXISTS "ProviderProfile_userId_fkey";
ALTER TABLE "ProviderProfile" ADD CONSTRAINT "ProviderProfile_userId_fkey" 
  FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Job
ALTER TABLE "Job" DROP CONSTRAINT IF EXISTS "Job_userId_fkey";
ALTER TABLE "Job" ADD CONSTRAINT "Job_userId_fkey" 
  FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Offer
ALTER TABLE "Offer" DROP CONSTRAINT IF EXISTS "Offer_jobId_fkey";
ALTER TABLE "Offer" ADD CONSTRAINT "Offer_jobId_fkey" 
  FOREIGN KEY ("jobId") REFERENCES "Job"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "Offer" DROP CONSTRAINT IF EXISTS "Offer_userId_fkey";
ALTER TABLE "Offer" ADD CONSTRAINT "Offer_userId_fkey" 
  FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Review
ALTER TABLE "Review" DROP CONSTRAINT IF EXISTS "Review_fromUserId_fkey";
ALTER TABLE "Review" ADD CONSTRAINT "Review_fromUserId_fkey" 
  FOREIGN KEY ("fromUserId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "Review" DROP CONSTRAINT IF EXISTS "Review_toUserId_fkey";
ALTER TABLE "Review" ADD CONSTRAINT "Review_toUserId_fkey" 
  FOREIGN KEY ("toUserId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Notification
ALTER TABLE "Notification" DROP CONSTRAINT IF EXISTS "Notification_userId_fkey";
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_userId_fkey" 
  FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- ChatRoom
ALTER TABLE "ChatRoom" DROP CONSTRAINT IF EXISTS "ChatRoom_jobId_fkey";
ALTER TABLE "ChatRoom" ADD CONSTRAINT "ChatRoom_jobId_fkey" 
  FOREIGN KEY ("jobId") REFERENCES "Job"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- ChatMessage
ALTER TABLE "ChatMessage" DROP CONSTRAINT IF EXISTS "ChatMessage_senderId_fkey";
ALTER TABLE "ChatMessage" ADD CONSTRAINT "ChatMessage_senderId_fkey" 
  FOREIGN KEY ("senderId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "ChatMessage" DROP CONSTRAINT IF EXISTS "ChatMessage_roomId_fkey";
ALTER TABLE "ChatMessage" ADD CONSTRAINT "ChatMessage_roomId_fkey" 
  FOREIGN KEY ("roomId") REFERENCES "ChatRoom"("id") ON DELETE CASCADE ON UPDATE CASCADE;

