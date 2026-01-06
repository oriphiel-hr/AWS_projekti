-- CreateEnum (if not exists)
DO $$ BEGIN
  CREATE TYPE "SLASStatus" AS ENUM ('PENDING', 'MET', 'BREACHED');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- CreateTable ApiRequestLog
CREATE TABLE IF NOT EXISTS "ApiRequestLog" (
    "id" TEXT NOT NULL,
    "method" TEXT NOT NULL,
    "path" TEXT NOT NULL,
    "statusCode" INTEGER NOT NULL,
    "userId" TEXT,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "requestBody" JSONB,
    "responseTime" INTEGER NOT NULL,
    "errorMessage" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ApiRequestLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable ErrorLog
CREATE TABLE IF NOT EXISTS "ErrorLog" (
    "id" TEXT NOT NULL,
    "level" TEXT NOT NULL DEFAULT 'ERROR',
    "message" TEXT NOT NULL,
    "stack" TEXT,
    "endpoint" TEXT,
    "method" TEXT,
    "userId" TEXT,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "context" JSONB,
    "status" TEXT NOT NULL DEFAULT 'NEW',
    "resolvedAt" TIMESTAMP(3),
    "resolvedBy" TEXT,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ErrorLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable MessageSLA
CREATE TABLE IF NOT EXISTS "MessageSLA" (
    "id" TEXT NOT NULL,
    "messageId" TEXT NOT NULL,
    "roomId" TEXT NOT NULL,
    "expectedResponseMinutes" INTEGER NOT NULL DEFAULT 240,
    "respondedAt" TIMESTAMP(3),
    "responseTimeMinutes" INTEGER,
    "slaStatus" "SLASStatus" NOT NULL DEFAULT 'PENDING',
    "breachedAt" TIMESTAMP(3),
    "reminderSentAt" TIMESTAMP(3),
    "reminderCount" INTEGER NOT NULL DEFAULT 0,
    "lastReminderAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MessageSLA_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX IF NOT EXISTS "ApiRequestLog_method_path_idx" ON "ApiRequestLog"("method", "path");
CREATE INDEX IF NOT EXISTS "ApiRequestLog_statusCode_idx" ON "ApiRequestLog"("statusCode");
CREATE INDEX IF NOT EXISTS "ApiRequestLog_userId_createdAt_idx" ON "ApiRequestLog"("userId", "createdAt");
CREATE INDEX IF NOT EXISTS "ApiRequestLog_createdAt_idx" ON "ApiRequestLog"("createdAt");
CREATE INDEX IF NOT EXISTS "ApiRequestLog_path_createdAt_idx" ON "ApiRequestLog"("path", "createdAt");

CREATE INDEX IF NOT EXISTS "ErrorLog_level_idx" ON "ErrorLog"("level");
CREATE INDEX IF NOT EXISTS "ErrorLog_status_idx" ON "ErrorLog"("status");
CREATE INDEX IF NOT EXISTS "ErrorLog_userId_createdAt_idx" ON "ErrorLog"("userId", "createdAt");
CREATE INDEX IF NOT EXISTS "ErrorLog_endpoint_createdAt_idx" ON "ErrorLog"("endpoint", "createdAt");
CREATE INDEX IF NOT EXISTS "ErrorLog_createdAt_idx" ON "ErrorLog"("createdAt");

CREATE UNIQUE INDEX IF NOT EXISTS "MessageSLA_messageId_key" ON "MessageSLA"("messageId");
CREATE INDEX IF NOT EXISTS "MessageSLA_roomId_slaStatus_idx" ON "MessageSLA"("roomId", "slaStatus");
CREATE INDEX IF NOT EXISTS "MessageSLA_slaStatus_createdAt_idx" ON "MessageSLA"("slaStatus", "createdAt");
CREATE INDEX IF NOT EXISTS "MessageSLA_reminderSentAt_idx" ON "MessageSLA"("reminderSentAt");

-- AddForeignKey
DO $$ BEGIN
  ALTER TABLE "ApiRequestLog" ADD CONSTRAINT "ApiRequestLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  ALTER TABLE "ErrorLog" ADD CONSTRAINT "ErrorLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  ALTER TABLE "MessageSLA" ADD CONSTRAINT "MessageSLA_messageId_fkey" FOREIGN KEY ("messageId") REFERENCES "ChatMessage"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  ALTER TABLE "MessageSLA" ADD CONSTRAINT "MessageSLA_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "ChatRoom"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

