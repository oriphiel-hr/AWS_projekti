-- Insert pravni statusi (Legal Statuses) za Uslugar aplikaciju
-- Ovo treba izvršiti na AWS RDS bazi

-- Prvo obriši stare ako postoje (opcionalno)
DELETE FROM "LegalStatus" WHERE code IN ('OBRT', 'DOO', 'JDOO', 'DD', 'ZDR', 'VD', 'KD', 'PAUSALAC');

-- Insert novi pravni statusi sa točnim ID-evima
INSERT INTO "LegalStatus" ("id", "code", "name", "description", "isActive", "createdAt") VALUES
('cls1_individual', 'INDIVIDUAL', 'Fizička osoba', 'Privatna osoba bez registrirane djelatnosti', true, CURRENT_TIMESTAMP),
('cls2_sole_trader', 'SOLE_TRADER', 'Obrtnik', 'Registrirani obrt - fizička osoba s OIB-om', true, CURRENT_TIMESTAMP),
('cls3_pausal', 'PAUSAL', 'Paušalni obrt', 'Obrt s paušalnim oporezivanjem', true, CURRENT_TIMESTAMP),
('cls4_doo', 'DOO', 'd.o.o.', 'Društvo s ograničenom odgovornošću', true, CURRENT_TIMESTAMP),
('cls5_jdoo', 'JDOO', 'j.d.o.o.', 'Jednostavno društvo s ograničenom odgovornošću', true, CURRENT_TIMESTAMP),
('cls6_freelancer', 'FREELANCER', 'Samostalni djelatnik', 'Freelancer s paušalnim oporezivanjem', true, CURRENT_TIMESTAMP)
ON CONFLICT ("id") DO UPDATE SET
  "code" = EXCLUDED."code",
  "name" = EXCLUDED."name",
  "description" = EXCLUDED."description",
  "isActive" = EXCLUDED."isActive";

-- Provjeri je li uspjelo
SELECT * FROM "LegalStatus" ORDER BY "id";

