-- Add jobId to Review table
ALTER TABLE "Review" ADD COLUMN IF NOT EXISTS "jobId" TEXT;

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_jobId_fkey" FOREIGN KEY ("jobId") REFERENCES "Job"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- CreateIndex
CREATE INDEX IF NOT EXISTS "Review_jobId_idx" ON "Review"("jobId");
CREATE INDEX IF NOT EXISTS "Review_toUserId_idx" ON "Review"("toUserId");

-- Create unique constraint - jedan review po job-u od svake strane
CREATE UNIQUE INDEX IF NOT EXISTS "Review_jobId_fromUserId_key" ON "Review"("jobId", "fromUserId");

