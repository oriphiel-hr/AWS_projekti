-- CreateTable LegalStatus
CREATE TABLE "LegalStatus" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "LegalStatus_pkey" PRIMARY KEY ("id")
);

-- AlterTable ProviderProfile - dodaj pravni status
ALTER TABLE "ProviderProfile" ADD COLUMN "legalStatusId" TEXT;
ALTER TABLE "ProviderProfile" ADD COLUMN "taxId" TEXT;
ALTER TABLE "ProviderProfile" ADD COLUMN "companyName" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "LegalStatus_code_key" ON "LegalStatus"("code");

-- AddForeignKey
ALTER TABLE "ProviderProfile" ADD CONSTRAINT "ProviderProfile_legalStatusId_fkey" FOREIGN KEY ("legalStatusId") REFERENCES "LegalStatus"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- Seed početnih pravnih statusa
INSERT INTO "LegalStatus" ("id", "code", "name", "description") VALUES
('cls1_individual', 'INDIVIDUAL', 'Fizička osoba', 'Privatna osoba bez registrirane djelatnosti'),
('cls2_sole_trader', 'SOLE_TRADER', 'Obrtnik', 'Registrirani obrt - fizička osoba s OIB-om'),
('cls3_pausal', 'PAUSAL', 'Paušalni obrt', 'Obrt s paušalnim oporezivanjem'),
('cls4_doo', 'DOO', 'd.o.o.', 'Društvo s ograničenom odgovornošću'),
('cls5_jdoo', 'JDOO', 'j.d.o.o.', 'Jednostavno društvo s ograničenom odgovornošću'),
('cls6_freelancer', 'FREELANCER', 'Samostalni djelatnik', 'Freelancer s paušalnim oporezivanjem');

