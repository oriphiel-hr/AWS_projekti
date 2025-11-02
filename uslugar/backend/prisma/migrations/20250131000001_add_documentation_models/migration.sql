-- CreateTable
CREATE TABLE IF NOT EXISTS "DocumentationCategory" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DocumentationCategory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE IF NOT EXISTS "DocumentationFeature" (
    "id" TEXT NOT NULL,
    "categoryId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "summary" TEXT,
    "details" TEXT,
    "implemented" BOOLEAN NOT NULL DEFAULT true,
    "deprecated" BOOLEAN NOT NULL DEFAULT false,
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DocumentationFeature_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX IF NOT EXISTS "DocumentationCategory_name_key" ON "DocumentationCategory"("name");

-- CreateIndex
CREATE UNIQUE INDEX IF NOT EXISTS "DocumentationFeature_categoryId_name_key" ON "DocumentationFeature"("categoryId", "name");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "DocumentationCategory_isActive_idx" ON "DocumentationCategory"("isActive");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "DocumentationCategory_order_idx" ON "DocumentationCategory"("order");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "DocumentationFeature_categoryId_idx" ON "DocumentationFeature"("categoryId");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "DocumentationFeature_implemented_idx" ON "DocumentationFeature"("implemented");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "DocumentationFeature_order_idx" ON "DocumentationFeature"("order");

-- AddForeignKey
ALTER TABLE "DocumentationFeature" ADD CONSTRAINT "DocumentationFeature_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "DocumentationCategory"("id") ON DELETE CASCADE ON UPDATE CASCADE;

