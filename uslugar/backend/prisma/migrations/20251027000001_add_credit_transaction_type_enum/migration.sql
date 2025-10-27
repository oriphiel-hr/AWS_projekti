-- Add CreditTransactionType enum
CREATE TYPE "CreditTransactionType" AS ENUM ('PURCHASE', 'LEAD_PURCHASE', 'REFUND', 'BONUS', 'SUBSCRIPTION');

-- Update CreditTransaction table to use the enum
ALTER TABLE "CreditTransaction" 
  ALTER COLUMN "type" TYPE "CreditTransactionType" USING "type"::"CreditTransactionType";

