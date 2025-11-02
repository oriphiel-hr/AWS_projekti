-- Add attachments field to ChatMessage model
-- This allows chat messages to include image attachments

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'ChatMessage' AND column_name = 'attachments') THEN
        ALTER TABLE "ChatMessage" ADD COLUMN "attachments" TEXT[] DEFAULT ARRAY[]::TEXT[];
    END IF;
END $$;

-- Create index for better query performance (optional)
CREATE INDEX IF NOT EXISTS "ChatMessage_attachments_idx" ON "ChatMessage" USING GIN ("attachments");

