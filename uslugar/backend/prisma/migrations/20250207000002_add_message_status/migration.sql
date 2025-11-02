-- Add message status (SENT, DELIVERED, READ) to ChatMessage model

-- Create MessageStatus enum
DO $$ BEGIN
    CREATE TYPE "MessageStatus" AS ENUM ('SENT', 'DELIVERED', 'READ');
EXCEPTION
    WHEN duplicate_object THEN NULL;
END $$;

-- Add status field
DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'ChatMessage' AND column_name = 'status') THEN
        ALTER TABLE "ChatMessage" ADD COLUMN "status" "MessageStatus" NOT NULL DEFAULT 'SENT';
    END IF;
END $$;

-- Add readAt field
DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'ChatMessage' AND column_name = 'readAt') THEN
        ALTER TABLE "ChatMessage" ADD COLUMN "readAt" TIMESTAMP(3);
    END IF;
END $$;

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS "ChatMessage_roomId_createdAt_idx" ON "ChatMessage"("roomId", "createdAt");
CREATE INDEX IF NOT EXISTS "ChatMessage_status_idx" ON "ChatMessage"("status");

