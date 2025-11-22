-- Add isSupportRoom field to ChatRoom for VIP 24/7 support chat

-- AlterTable: Add isSupportRoom to ChatRoom
ALTER TABLE "ChatRoom" ADD COLUMN IF NOT EXISTS "isSupportRoom" BOOLEAN NOT NULL DEFAULT false;

-- CreateIndex for better query performance
CREATE INDEX IF NOT EXISTS "ChatRoom_isSupportRoom_idx" ON "ChatRoom"("isSupportRoom");

COMMENT ON COLUMN "ChatRoom"."isSupportRoom" IS 'Da li je ovo support chat soba (VIP podrška 24/7)';

