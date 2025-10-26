-- White-Label Configuration - PRO users only

-- CreateTable WhiteLabel
CREATE TABLE IF NOT EXISTS "WhiteLabel" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL UNIQUE,
    "companyName" TEXT NOT NULL,
    "logoUrl" TEXT,
    "primaryColor" TEXT NOT NULL DEFAULT '#3B82F6',
    "secondaryColor" TEXT,
    "accentColor" TEXT,
    "faviconUrl" TEXT,
    "footerText" TEXT,
    "poweredByHidden" BOOLEAN NOT NULL DEFAULT false,
    "customDomain" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT "WhiteLabel_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- Create Indexes
CREATE INDEX IF NOT EXISTS "WhiteLabel_userId_idx" ON "WhiteLabel"("userId");
CREATE UNIQUE INDEX IF NOT EXISTS "WhiteLabel_userId_key" ON "WhiteLabel"("userId");

