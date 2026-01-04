-- CreateEnum
CREATE TYPE "TestRunStatus" AS ENUM ('DRAFT', 'IN_PROGRESS', 'COMPLETED');

-- CreateEnum
CREATE TYPE "TestItemStatus" AS ENUM ('PENDING', 'PASS', 'FAIL', 'BLOCKED', 'NOT_APPLICABLE');

-- CreateTable
CREATE TABLE IF NOT EXISTS "TestPlan" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "category" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TestPlan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE IF NOT EXISTS "TestItem" (
    "id" TEXT NOT NULL,
    "planId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "expectedResult" TEXT,
    "dataVariations" JSONB,
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TestItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE IF NOT EXISTS "TestRun" (
    "id" TEXT NOT NULL,
    "planId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdById" TEXT,
    "status" "TestRunStatus" NOT NULL DEFAULT 'DRAFT',
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TestRun_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE IF NOT EXISTS "TestRunItem" (
    "id" TEXT NOT NULL,
    "runId" TEXT NOT NULL,
    "itemId" TEXT NOT NULL,
    "status" "TestItemStatus" NOT NULL DEFAULT 'PENDING',
    "comment" TEXT,
    "screenshots" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TestRunItem_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX IF NOT EXISTS "TestPlan_name_idx" ON "TestPlan"("name");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "TestItem_planId_idx" ON "TestItem"("planId");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "TestItem_order_idx" ON "TestItem"("order");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "TestRun_planId_idx" ON "TestRun"("planId");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "TestRun_status_idx" ON "TestRun"("status");

-- CreateIndex
CREATE UNIQUE INDEX IF NOT EXISTS "TestRunItem_runId_itemId_key" ON "TestRunItem"("runId", "itemId");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "TestRunItem_runId_idx" ON "TestRunItem"("runId");

-- AddForeignKey
ALTER TABLE "TestItem" ADD CONSTRAINT "TestItem_planId_fkey" FOREIGN KEY ("planId") REFERENCES "TestPlan"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TestRun" ADD CONSTRAINT "TestRun_planId_fkey" FOREIGN KEY ("planId") REFERENCES "TestPlan"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TestRun" ADD CONSTRAINT "TestRun_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TestRunItem" ADD CONSTRAINT "TestRunItem_runId_fkey" FOREIGN KEY ("runId") REFERENCES "TestRun"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TestRunItem" ADD CONSTRAINT "TestRunItem_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "TestItem"("id") ON DELETE CASCADE ON UPDATE CASCADE;

