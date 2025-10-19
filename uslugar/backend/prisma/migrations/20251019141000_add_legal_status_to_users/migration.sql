-- AlterTable User - dodaj pravni status
ALTER TABLE "User" ADD COLUMN "legalStatusId" TEXT;
ALTER TABLE "User" ADD COLUMN "taxId" TEXT;
ALTER TABLE "User" ADD COLUMN "companyName" TEXT;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_legalStatusId_fkey" FOREIGN KEY ("legalStatusId") REFERENCES "LegalStatus"("id") ON DELETE SET NULL ON UPDATE CASCADE;

