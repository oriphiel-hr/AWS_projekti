-- USLUGAR - Dodavanje nedostajućih kategorija
-- ===========================================

-- Dodaj nove kategorije
INSERT INTO "Category" (id, name, description, "parentId", "nkdCode", "requiresLicense", "licenseType", "licenseAuthority", icon, "isActive", "createdAt")
VALUES 
-- 🏗️ GRAĐEVINSKE USLUGE
('cat_grad_001', 'Građevina', 'Opći građevinski radovi, renovacije, adaptacije', NULL, '41.20', true, 'Građevinska licenca', 'Hrvatska komora inženjera građevinarstva', '🏗️', true, NOW()),
('cat_grad_002', 'Građevinski nadzor', 'Nadzor nad izvođenjem građevinskih radova', NULL, '71.12', true, 'Licenca građevinskog nadzora', 'Hrvatska komora inženjera građevinarstva', '👷', true, NOW()),
('cat_grad_003', 'Geodetske usluge', 'Mjerenja, izrada geodetskih elaborata', NULL, '71.12', true, 'Geodetska licenca', 'Hrvatska komora inženjera geodezije', '📐', true, NOW()),
('cat_grad_004', 'Energetski certifikati', 'Izdavanje energetskih certifikata za zgrade', NULL, '71.12', true, 'Licenca energetskog certifikata', 'Hrvatska energetska agencija', '⚡', true, NOW()),
('cat_grad_005', 'Legalizacija objekata', 'Pomoć pri legalizaciji bespravno sagrađenih objekata', NULL, '71.12', false, NULL, NULL, '📋', true, NOW()),

-- 🎨 DIZAJN I INTERIJER
('cat_diz_001', 'Dizajn interijera', 'Uređenje i dizajn unutarnjih prostora', NULL, '74.10', false, NULL, NULL, '🎨', true, NOW()),
('cat_diz_002', 'Arhitektonske usluge', 'Projektiranje, izrada arhitektonskih planova', NULL, '71.11', true, 'Arhitektonska licenca', 'Hrvatska komora arhitekata', '🏛️', true, NOW()),
('cat_diz_003', 'Landscape dizajn', 'Uređenje vanjskih prostora, vrtovi', NULL, '71.12', false, NULL, NULL, '🌳', true, NOW()),

-- 🔌 INSTALACIJE
('cat_inst_001', 'Solarni sustavi', 'Ugradnja solarnih panela i sustava', NULL, '43.21', true, 'Elektrotehnička licenca', 'Hrvatska komora inženjera elektrotehnike', '☀️', true, NOW()),

-- 💻 IT I DIGITALNE USLUGE
('cat_it_001', 'Web dizajn', 'Izrada i dizajn web stranica', NULL, '62.01', false, NULL, NULL, '🌐', true, NOW()),
('cat_it_002', 'SEO usluge', 'Optimizacija web stranica za pretraživače', NULL, '62.01', false, NULL, NULL, '🔍', true, NOW()),
('cat_it_003', 'Digitalni marketing', 'Online marketing, društvene mreže', NULL, '73.11', false, NULL, NULL, '📱', true, NOW()),
('cat_it_004', 'E-commerce', 'Izrada online trgovina', NULL, '62.01', false, NULL, NULL, '🛒', true, NOW()),

-- 📸 MEDIJSKE USLUGE
('cat_med_001', 'Fotografija', 'Profesionalno fotografiranje za različite potrebe', NULL, '74.20', false, NULL, NULL, '📸', true, NOW()),
('cat_med_002', 'Drone snimanje', 'Zračno snimanje dronovima', NULL, '74.20', false, NULL, NULL, '🚁', true, NOW()),
('cat_med_003', '3D vizualizacija', '3D modeli, renderi, vizualizacije', NULL, '74.20', false, NULL, NULL, '🎬', true, NOW()),

-- 🚚 LOGISTIKA I TRANSPORT
('cat_log_001', 'Dostava', 'Dostava paketa, hrane, pošiljki', NULL, '53.20', false, NULL, NULL, '📦', true, NOW()),
('cat_log_002', 'Prijevoz putnika', 'Taxi, prijevoz putnika', NULL, '49.32', true, 'Licenca za prijevoz putnika', 'Ministarstvo mora, prometa i infrastrukture', '🚕', true, NOW()),

-- 🧹 ČIŠĆENJE I ODRŽAVANJE
('cat_cis_001', 'Čišćenje kućanstva', 'Čišćenje domova, stanova', NULL, '81.21', false, NULL, NULL, '🏠', true, NOW()),
('cat_cis_002', 'Čišćenje ureda', 'Čišćenje poslovnih prostora', NULL, '81.21', false, NULL, NULL, '🏢', true, NOW()),
('cat_cis_003', 'Čišćenje nakon gradnje', 'Čišćenje nakon građevinskih radova', NULL, '81.21', false, NULL, NULL, '🏗️', true, NOW()),

-- 🏥 ZDRAVLJE I LJEPOTA
('cat_zdrav_001', 'Fizioterapija', 'Fizioterapijske usluge, rehabilitacija', NULL, '86.90', true, 'Licenca fizioterapeuta', 'Hrvatska komora fizioterapeuta', '🏥', true, NOW()),
('cat_zdrav_002', 'Masage', 'Opuštajuće i terapeutske masaže', NULL, '96.09', false, NULL, NULL, '💆', true, NOW()),
('cat_zdrav_003', 'Kozmetika', 'Kozmetičke usluge, njega lica', NULL, '96.02', false, NULL, NULL, '💄', true, NOW()),
('cat_zdrav_004', 'Manikura/Pedikura', 'Njega noktiju ruku i nogu', NULL, '96.02', false, NULL, NULL, '💅', true, NOW()),

-- 🎓 OBRAZOVANJE
('cat_obr_001', 'Instrukcije', 'Poduka učenika, instrukcije', NULL, '85.59', false, NULL, NULL, '📚', true, NOW()),
('cat_obr_002', 'Jezici', 'Učenje stranih jezika', NULL, '85.59', false, NULL, NULL, '🗣️', true, NOW()),
('cat_obr_003', 'Muzika', 'Glazbena nastava, poduka', NULL, '85.59', false, NULL, NULL, '🎵', true, NOW()),

-- ⚖️ PRAVNE I FINANCIJSKE USLUGE
('cat_prav_001', 'Računovodstvo', 'Knjigovodstvo, računovodstvene usluge', NULL, '69.20', false, NULL, NULL, '📊', true, NOW()),
('cat_prav_002', 'Osiguranje', 'Osiguravajuće usluge', NULL, '65.20', true, 'Licenca osiguravajućeg agenta', 'Hrvatska agencija za nadzor financijskih usluga', '🛡️', true, NOW()),

-- 🌱 EKOLOGIJA I ODRŽIVOST
('cat_eko_001', 'Energetska učinkovitost', 'Energetski pregledi, optimizacija potrošnje', NULL, '71.12', true, 'Licenca energetskog savjetnika', 'Hrvatska energetska agencija', '🌱', true, NOW()),
('cat_eko_002', 'Recikliranje', 'Usluge recikliranja, odvoz otpada', NULL, '38.11', false, NULL, NULL, '♻️', true, NOW()),

-- 🏠 DOMAĆI RADOVI
('cat_dom_001', 'Popravak kućanskih aparata', 'Popravak perilica, sušilica, frižidera', NULL, '95.21', false, NULL, NULL, '🔧', true, NOW()),
('cat_dom_002', 'Montaža namještaja', 'Montaža namještaja, sklapanje', NULL, '43.30', false, NULL, NULL, '🪑', true, NOW()),
('cat_dom_003', 'Montaža klima uređaja', 'Ugradnja i servis klima uređaja', NULL, '43.22', true, 'Licenca za klimatizaciju', 'Hrvatska komora inženjera građevinarstva', '❄️', true, NOW())

ON CONFLICT (name) DO UPDATE SET
  description = EXCLUDED.description,
  icon = EXCLUDED.icon,
  "nkdCode" = EXCLUDED."nkdCode",
  "requiresLicense" = EXCLUDED."requiresLicense",
  "licenseType" = EXCLUDED."licenseType",
  "licenseAuthority" = EXCLUDED."licenseAuthority",
  "isActive" = EXCLUDED."isActive",
  "updatedAt" = NOW();

-- Ažuriraj postojeće kategorije s novim podacima
UPDATE "Category" SET 
  description = 'Električne instalacije, popravak električnih uređaja, LED rasvjeta',
  icon = '⚡',
  "nkdCode" = '43.21',
  "requiresLicense" = true,
  "licenseType" = 'Elektrotehnička licenca',
  "licenseAuthority" = 'Hrvatska komora inženjera elektrotehnike (HKIE)',
  "isActive" = true
WHERE name = 'Električar';

UPDATE "Category" SET 
  description = 'Vodovodne instalacije, popravak cijevi, sanitarije',
  icon = '🚿',
  "nkdCode" = '43.22',
  "requiresLicense" = true,
  "licenseType" = 'Licenca za vodovodne instalacije',
  "licenseAuthority" = 'Hrvatska komora inženjera građevinarstva',
  "isActive" = true
WHERE name = 'Vodoinstalater';

UPDATE "Category" SET 
  description = 'Soboslikarski radovi, bojanje zidova, dekorativno slikanje',
  icon = '🎨',
  "nkdCode" = '43.30',
  "requiresLicense" = false,
  "isActive" = true
WHERE name = 'Soboslikarstvo';

UPDATE "Category" SET 
  description = 'Položba keramike, pločica, sanitarije',
  icon = '🧱',
  "nkdCode" = '43.30',
  "requiresLicense" = false,
  "isActive" = true
WHERE name = 'Keramičar';

UPDATE "Category" SET 
  description = 'Opći građevinski radovi, renovacije, adaptacije',
  icon = '🏗️',
  "nkdCode" = '41.20',
  "requiresLicense" = true,
  "licenseType" = 'Građevinska licenca',
  "licenseAuthority" = 'Hrvatska komora inženjera građevinarstva',
  "isActive" = true
WHERE name = 'Građevina';

UPDATE "Category" SET 
  description = 'Općenite prijevozne usluge, dostava',
  icon = '🚚',
  "nkdCode" = '49.41',
  "requiresLicense" = true,
  "licenseType" = 'Licenca za prijevoz',
  "licenseAuthority" = 'Ministarstvo mora, prometa i infrastrukture',
  "isActive" = true
WHERE name = 'Prijevoz';

UPDATE "Category" SET 
  description = 'Općenite usluge čišćenja, održavanje',
  icon = '🧹',
  "nkdCode" = '81.21',
  "requiresLicense" = false,
  "isActive" = true
WHERE name = 'Čišćenje';

UPDATE "Category" SET 
  description = 'Općenite IT usluge, održavanje računala',
  icon = '💻',
  "nkdCode" = '62.01',
  "requiresLicense" = false,
  "isActive" = true
WHERE name = 'IT usluge';

UPDATE "Category" SET 
  description = 'Općenite pravne usluge, savjetovanje',
  icon = '⚖️',
  "nkdCode" = '69.10',
  "requiresLicense" = true,
  "licenseType" = 'Odvjetnička licenca',
  "licenseAuthority" = 'Hrvatska odvjetnička komora',
  "isActive" = true
WHERE name = 'Pravo';
