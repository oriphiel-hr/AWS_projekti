-- AlterTable
-- Add updatedAt if it doesn't exist
DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'ChatMessage' AND column_name = 'updatedAt') THEN
        ALTER TABLE "ChatMessage" ADD COLUMN "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
    END IF;
END $$;

-- Add isEdited if it doesn't exist
DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'ChatMessage' AND column_name = 'isEdited') THEN
        ALTER TABLE "ChatMessage" ADD COLUMN "isEdited" BOOLEAN NOT NULL DEFAULT false;
    END IF;
END $$;

-- Add editedAt if it doesn't exist
DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'ChatMessage' AND column_name = 'editedAt') THEN
        ALTER TABLE "ChatMessage" ADD COLUMN "editedAt" TIMESTAMP(3);
    END IF;
END $$;

-- CreateTable
CREATE TABLE "MessageVersion" (
    "id" TEXT NOT NULL,
    "messageId" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "attachments" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "version" INTEGER NOT NULL,
    "editedById" TEXT NOT NULL,
    "editedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "reason" TEXT,

    CONSTRAINT "MessageVersion_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX IF NOT EXISTS "MessageVersion_messageId_version_idx" ON "MessageVersion"("messageId", "version");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "MessageVersion_editedAt_idx" ON "MessageVersion"("editedAt");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "ChatMessage_isEdited_idx" ON "ChatMessage"("isEdited");

-- AddForeignKey
DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints 
                   WHERE constraint_name = 'MessageVersion_messageId_fkey') THEN
        ALTER TABLE "MessageVersion" ADD CONSTRAINT "MessageVersion_messageId_fkey" 
            FOREIGN KEY ("messageId") REFERENCES "ChatMessage"("id") ON DELETE CASCADE ON UPDATE CASCADE;
    END IF;
END $$;

-- AddForeignKey
DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints 
                   WHERE constraint_name = 'MessageVersion_editedById_fkey') THEN
        ALTER TABLE "MessageVersion" ADD CONSTRAINT "MessageVersion_editedById_fkey" 
            FOREIGN KEY ("editedById") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
    END IF;
END $$;

