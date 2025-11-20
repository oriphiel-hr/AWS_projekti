-- CreateTable
CREATE TABLE IF NOT EXISTS "ChatbotSession" (
    "id" TEXT NOT NULL,
    "providerId" TEXT NOT NULL,
    "jobId" TEXT,
    "currentStep" INTEGER NOT NULL DEFAULT 1,
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    "lastTrigger" TEXT,
    "lastTriggeredAt" TIMESTAMP(3),
    "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ChatbotSession_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ChatbotSession" ADD CONSTRAINT "ChatbotSession_providerId_fkey" FOREIGN KEY ("providerId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChatbotSession" ADD CONSTRAINT "ChatbotSession_jobId_fkey" FOREIGN KEY ("jobId") REFERENCES "Job"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- CreateIndex
CREATE INDEX IF NOT EXISTS "ChatbotSession_providerId_status_idx" ON "ChatbotSession"("providerId", "status");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "ChatbotSession_status_idx" ON "ChatbotSession"("status");

-- AlterTable: Add isBotRoom to ChatRoom
ALTER TABLE "ChatRoom" ADD COLUMN IF NOT EXISTS "isBotRoom" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable: Add isBotMessage and botAction to ChatMessage
ALTER TABLE "ChatMessage" ADD COLUMN IF NOT EXISTS "isBotMessage" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "ChatMessage" ADD COLUMN IF NOT EXISTS "botAction" TEXT;

-- CreateIndex
CREATE INDEX IF NOT EXISTS "ChatMessage_isBotMessage_idx" ON "ChatMessage"("isBotMessage");

