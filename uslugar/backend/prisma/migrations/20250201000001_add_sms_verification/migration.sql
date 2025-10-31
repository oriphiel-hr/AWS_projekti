-- Add SMS verification fields to User table
ALTER TABLE "User" 
ADD COLUMN IF NOT EXISTS "phoneVerified" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN IF NOT EXISTS "phoneVerificationCode" TEXT UNIQUE,
ADD COLUMN IF NOT EXISTS "phoneVerificationExpires" TIMESTAMP(3),
ADD COLUMN IF NOT EXISTS "phoneVerificationAttempts" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN IF NOT EXISTS "phoneVerifiedAt" TIMESTAMP(3);

-- Create index for faster verification lookups
CREATE INDEX IF NOT EXISTS "User_phoneVerificationCode_idx" ON "User"("phoneVerificationCode");
CREATE INDEX IF NOT EXISTS "User_phoneVerified_idx" ON "User"("phoneVerified");

