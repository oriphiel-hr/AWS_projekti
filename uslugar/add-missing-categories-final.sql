-- USLUGAR - Dodavanje nedostajućih kategorija
-- ===========================================

INSERT INTO "Category" (id, name, description, icon, "nkdCode", "requiresLicense", "licenseType", "licenseAuthority", "isActive", "createdAt", "updatedAt")
VALUES (
    'cat_gradevina',
    'Građevina',
    'Opći građevinski radovi, renovacije, adaptacije',
    '🏗️',
    '41.20',
    true,
    'Građevinska licenca',
    'Hrvatska komora inženjera građevinarstva',
    true,
    NOW(),
    NOW()
) ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    icon = EXCLUDED.icon,
    "nkdCode" = EXCLUDED."nkdCode",
    "requiresLicense" = EXCLUDED."requiresLicense",
    "licenseType" = EXCLUDED."licenseType",
    "licenseAuthority" = EXCLUDED."licenseAuthority",
    "isActive" = EXCLUDED."isActive",
    "updatedAt" = NOW();

INSERT INTO "Category" (id, name, description, icon, "nkdCode", "requiresLicense", "licenseType", "licenseAuthority", "isActive", "createdAt", "updatedAt")
VALUES (
    'cat_gradevinski_nadzor',
    'Građevinski nadzor',
    'Nadzor nad izvođenjem građevinskih radova',
    '👷',
    '71.12',
    true,
    'Licenca građevinskog nadzora',
    'Hrvatska komora inženjera građevinarstva',
    true,
    NOW(),
    NOW()
) ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    icon = EXCLUDED.icon,
    "nkdCode" = EXCLUDED."nkdCode",
    "requiresLicense" = EXCLUDED."requiresLicense",
    "licenseType" = EXCLUDED."licenseType",
    "licenseAuthority" = EXCLUDED."licenseAuthority",
    "isActive" = EXCLUDED."isActive",
    "updatedAt" = NOW();

INSERT INTO "Category" (id, name, description, icon, "nkdCode", "requiresLicense", "licenseType", "licenseAuthority", "isActive", "createdAt", "updatedAt")
VALUES (
    'cat_geodetske_usluge',
    'Geodetske usluge',
    'Mjerenja, izrada geodetskih elaborata',
    '📐',
    '71.12',
    true,
    'Geodetska licenca',
    'Hrvatska komora inženjera geodezije',
    true,
    NOW(),
    NOW()
) ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    icon = EXCLUDED.icon,
    "nkdCode" = EXCLUDED."nkdCode",
    "requiresLicense" = EXCLUDED."requiresLicense",
    "licenseType" = EXCLUDED."licenseType",
    "licenseAuthority" = EXCLUDED."licenseAuthority",
    "isActive" = EXCLUDED."isActive",
    "updatedAt" = NOW();

INSERT INTO "Category" (id, name, description, icon, "nkdCode", "requiresLicense", "licenseType", "licenseAuthority", "isActive", "createdAt", "updatedAt")
VALUES (
    'cat_energetski_certifikati',
    'Energetski certifikati',
    'Izdavanje energetskih certifikata za zgrade',
    '⚡',
    '71.12',
    true,
    'Licenca energetskog certifikata',
    'Hrvatska energetska agencija',
    true,
    NOW(),
    NOW()
) ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    icon = EXCLUDED.icon,
    "nkdCode" = EXCLUDED."nkdCode",
    "requiresLicense" = EXCLUDED."requiresLicense",
    "licenseType" = EXCLUDED."licenseType",
    "licenseAuthority" = EXCLUDED."licenseAuthority",
    "isActive" = EXCLUDED."isActive",
    "updatedAt" = NOW();

INSERT INTO "Category" (id, name, description, icon, "nkdCode", "requiresLicense", "licenseType", "licenseAuthority", "isActive", "createdAt", "updatedAt")
VALUES (
    'cat_legalizacija_objekata',
    'Legalizacija objekata',
    'Pomoć pri legalizaciji bespravno sagrađenih objekata',
    '📋',
    '71.12',
    false,
    NULL,
    NULL,
    true,
    NOW(),
    NOW()
) ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    icon = EXCLUDED.icon,
    "nkdCode" = EXCLUDED."nkdCode",
    "requiresLicense" = EXCLUDED."requiresLicense",
    "licenseType" = EXCLUDED."licenseType",
    "licenseAuthority" = EXCLUDED."licenseAuthority",
    "isActive" = EXCLUDED."isActive",
    "updatedAt" = NOW();

INSERT INTO "Category" (id, name, description, icon, "nkdCode", "requiresLicense", "licenseType", "licenseAuthority", "isActive", "createdAt", "updatedAt")
VALUES (
    'cat_dizajn_interijera',
    'Dizajn interijera',
    'Uređenje i dizajn unutarnjih prostora',
    '🎨',
    '74.10',
    false,
    NULL,
    NULL,
    true,
    NOW(),
    NOW()
) ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    icon = EXCLUDED.icon,
    "nkdCode" = EXCLUDED."nkdCode",
    "requiresLicense" = EXCLUDED."requiresLicense",
    "licenseType" = EXCLUDED."licenseType",
    "licenseAuthority" = EXCLUDED."licenseAuthority",
    "isActive" = EXCLUDED."isActive",
    "updatedAt" = NOW();

INSERT INTO "Category" (id, name, description, icon, "nkdCode", "requiresLicense", "licenseType", "licenseAuthority", "isActive", "createdAt", "updatedAt")
VALUES (
    'cat_arhitektonske_usluge',
    'Arhitektonske usluge',
    'Projektiranje, izrada arhitektonskih planova',
    '🏛️',
    '71.11',
    true,
    'Arhitektonska licenca',
    'Hrvatska komora arhitekata',
    true,
    NOW(),
    NOW()
) ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    icon = EXCLUDED.icon,
    "nkdCode" = EXCLUDED."nkdCode",
    "requiresLicense" = EXCLUDED."requiresLicense",
    "licenseType" = EXCLUDED."licenseType",
    "licenseAuthority" = EXCLUDED."licenseAuthority",
    "isActive" = EXCLUDED."isActive",
    "updatedAt" = NOW();

INSERT INTO "Category" (id, name, description, icon, "nkdCode", "requiresLicense", "licenseType", "licenseAuthority", "isActive", "createdAt", "updatedAt")
VALUES (
    'cat_landscape_dizajn',
    'Landscape dizajn',
    'Uređenje vanjskih prostora, vrtovi',
    '🌳',
    '71.12',
    false,
    NULL,
    NULL,
    true,
    NOW(),
    NOW()
) ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    icon = EXCLUDED.icon,
    "nkdCode" = EXCLUDED."nkdCode",
    "requiresLicense" = EXCLUDED."requiresLicense",
    "licenseType" = EXCLUDED."licenseType",
    "licenseAuthority" = EXCLUDED."licenseAuthority",
    "isActive" = EXCLUDED."isActive",
    "updatedAt" = NOW();

INSERT INTO "Category" (id, name, description, icon, "nkdCode", "requiresLicense", "licenseType", "licenseAuthority", "isActive", "createdAt", "updatedAt")
VALUES (
    'cat_solarni_sustavi',
    'Solarni sustavi',
    'Ugradnja solarnih panela i sustava',
    '☀️',
    '43.21',
    true,
    'Elektrotehnička licenca',
    'Hrvatska komora inženjera elektrotehnike',
    true,
    NOW(),
    NOW()
) ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    icon = EXCLUDED.icon,
    "nkdCode" = EXCLUDED."nkdCode",
    "requiresLicense" = EXCLUDED."requiresLicense",
    "licenseType" = EXCLUDED."licenseType",
    "licenseAuthority" = EXCLUDED."licenseAuthority",
    "isActive" = EXCLUDED."isActive",
    "updatedAt" = NOW();

INSERT INTO "Category" (id, name, description, icon, "nkdCode", "requiresLicense", "licenseType", "licenseAuthority", "isActive", "createdAt", "updatedAt")
VALUES (
    'cat_web_dizajn',
    'Web dizajn',
    'Izrada i dizajn web stranica',
    '🌐',
    '62.01',
    false,
    NULL,
    NULL,
    true,
    NOW(),
    NOW()
) ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    icon = EXCLUDED.icon,
    "nkdCode" = EXCLUDED."nkdCode",
    "requiresLicense" = EXCLUDED."requiresLicense",
    "licenseType" = EXCLUDED."licenseType",
    "licenseAuthority" = EXCLUDED."licenseAuthority",
    "isActive" = EXCLUDED."isActive",
    "updatedAt" = NOW();

INSERT INTO "Category" (id, name, description, icon, "nkdCode", "requiresLicense", "licenseType", "licenseAuthority", "isActive", "createdAt", "updatedAt")
VALUES (
    'cat_seo_usluge',
    'SEO usluge',
    'Optimizacija web stranica za pretraživače',
    '🔍',
    '62.01',
    false,
    NULL,
    NULL,
    true,
    NOW(),
    NOW()
) ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    icon = EXCLUDED.icon,
    "nkdCode" = EXCLUDED."nkdCode",
    "requiresLicense" = EXCLUDED."requiresLicense",
    "licenseType" = EXCLUDED."licenseType",
    "licenseAuthority" = EXCLUDED."licenseAuthority",
    "isActive" = EXCLUDED."isActive",
    "updatedAt" = NOW();

INSERT INTO "Category" (id, name, description, icon, "nkdCode", "requiresLicense", "licenseType", "licenseAuthority", "isActive", "createdAt", "updatedAt")
VALUES (
    'cat_digitalni_marketing',
    'Digitalni marketing',
    'Online marketing, društvene mreže',
    '📱',
    '73.11',
    false,
    NULL,
    NULL,
    true,
    NOW(),
    NOW()
) ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    icon = EXCLUDED.icon,
    "nkdCode" = EXCLUDED."nkdCode",
    "requiresLicense" = EXCLUDED."requiresLicense",
    "licenseType" = EXCLUDED."licenseType",
    "licenseAuthority" = EXCLUDED."licenseAuthority",
    "isActive" = EXCLUDED."isActive",
    "updatedAt" = NOW();

INSERT INTO "Category" (id, name, description, icon, "nkdCode", "requiresLicense", "licenseType", "licenseAuthority", "isActive", "createdAt", "updatedAt")
VALUES (
    'cat_e-commerce',
    'E-commerce',
    'Izrada online trgovina',
    '🛒',
    '62.01',
    false,
    NULL,
    NULL,
    true,
    NOW(),
    NOW()
) ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    icon = EXCLUDED.icon,
    "nkdCode" = EXCLUDED."nkdCode",
    "requiresLicense" = EXCLUDED."requiresLicense",
    "licenseType" = EXCLUDED."licenseType",
    "licenseAuthority" = EXCLUDED."licenseAuthority",
    "isActive" = EXCLUDED."isActive",
    "updatedAt" = NOW();

INSERT INTO "Category" (id, name, description, icon, "nkdCode", "requiresLicense", "licenseType", "licenseAuthority", "isActive", "createdAt", "updatedAt")
VALUES (
    'cat_fotografija',
    'Fotografija',
    'Profesionalno fotografiranje za različite potrebe',
    '📸',
    '74.20',
    false,
    NULL,
    NULL,
    true,
    NOW(),
    NOW()
) ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    icon = EXCLUDED.icon,
    "nkdCode" = EXCLUDED."nkdCode",
    "requiresLicense" = EXCLUDED."requiresLicense",
    "licenseType" = EXCLUDED."licenseType",
    "licenseAuthority" = EXCLUDED."licenseAuthority",
    "isActive" = EXCLUDED."isActive",
    "updatedAt" = NOW();

INSERT INTO "Category" (id, name, description, icon, "nkdCode", "requiresLicense", "licenseType", "licenseAuthority", "isActive", "createdAt", "updatedAt")
VALUES (
    'cat_drone_snimanje',
    'Drone snimanje',
    'Zračno snimanje dronovima',
    '🚁',
    '74.20',
    false,
    NULL,
    NULL,
    true,
    NOW(),
    NOW()
) ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    icon = EXCLUDED.icon,
    "nkdCode" = EXCLUDED."nkdCode",
    "requiresLicense" = EXCLUDED."requiresLicense",
    "licenseType" = EXCLUDED."licenseType",
    "licenseAuthority" = EXCLUDED."licenseAuthority",
    "isActive" = EXCLUDED."isActive",
    "updatedAt" = NOW();

INSERT INTO "Category" (id, name, description, icon, "nkdCode", "requiresLicense", "licenseType", "licenseAuthority", "isActive", "createdAt", "updatedAt")
VALUES (
    'cat_3d_vizualizacija',
    '3D vizualizacija',
    '3D modeli, renderi, vizualizacije',
    '🎬',
    '74.20',
    false,
    NULL,
    NULL,
    true,
    NOW(),
    NOW()
) ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    icon = EXCLUDED.icon,
    "nkdCode" = EXCLUDED."nkdCode",
    "requiresLicense" = EXCLUDED."requiresLicense",
    "licenseType" = EXCLUDED."licenseType",
    "licenseAuthority" = EXCLUDED."licenseAuthority",
    "isActive" = EXCLUDED."isActive",
    "updatedAt" = NOW();

INSERT INTO "Category" (id, name, description, icon, "nkdCode", "requiresLicense", "licenseType", "licenseAuthority", "isActive", "createdAt", "updatedAt")
VALUES (
    'cat_dostava',
    'Dostava',
    'Dostava paketa, hrane, pošiljki',
    '📦',
    '53.20',
    false,
    NULL,
    NULL,
    true,
    NOW(),
    NOW()
) ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    icon = EXCLUDED.icon,
    "nkdCode" = EXCLUDED."nkdCode",
    "requiresLicense" = EXCLUDED."requiresLicense",
    "licenseType" = EXCLUDED."licenseType",
    "licenseAuthority" = EXCLUDED."licenseAuthority",
    "isActive" = EXCLUDED."isActive",
    "updatedAt" = NOW();

INSERT INTO "Category" (id, name, description, icon, "nkdCode", "requiresLicense", "licenseType", "licenseAuthority", "isActive", "createdAt", "updatedAt")
VALUES (
    'cat_prijevoz_putnika',
    'Prijevoz putnika',
    'Taxi, prijevoz putnika',
    '🚕',
    '49.32',
    true,
    'Licenca za prijevoz putnika',
    'Ministarstvo mora, prometa i infrastrukture',
    true,
    NOW(),
    NOW()
) ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    icon = EXCLUDED.icon,
    "nkdCode" = EXCLUDED."nkdCode",
    "requiresLicense" = EXCLUDED."requiresLicense",
    "licenseType" = EXCLUDED."licenseType",
    "licenseAuthority" = EXCLUDED."licenseAuthority",
    "isActive" = EXCLUDED."isActive",
    "updatedAt" = NOW();

INSERT INTO "Category" (id, name, description, icon, "nkdCode", "requiresLicense", "licenseType", "licenseAuthority", "isActive", "createdAt", "updatedAt")
VALUES (
    'cat_ciscenje_kucanstva',
    'Čišćenje kućanstva',
    'Čišćenje domova, stanova',
    '🏠',
    '81.21',
    false,
    NULL,
    NULL,
    true,
    NOW(),
    NOW()
) ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    icon = EXCLUDED.icon,
    "nkdCode" = EXCLUDED."nkdCode",
    "requiresLicense" = EXCLUDED."requiresLicense",
    "licenseType" = EXCLUDED."licenseType",
    "licenseAuthority" = EXCLUDED."licenseAuthority",
    "isActive" = EXCLUDED."isActive",
    "updatedAt" = NOW();

INSERT INTO "Category" (id, name, description, icon, "nkdCode", "requiresLicense", "licenseType", "licenseAuthority", "isActive", "createdAt", "updatedAt")
VALUES (
    'cat_ciscenje_ureda',
    'Čišćenje ureda',
    'Čišćenje poslovnih prostora',
    '🏢',
    '81.21',
    false,
    NULL,
    NULL,
    true,
    NOW(),
    NOW()
) ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    icon = EXCLUDED.icon,
    "nkdCode" = EXCLUDED."nkdCode",
    "requiresLicense" = EXCLUDED."requiresLicense",
    "licenseType" = EXCLUDED."licenseType",
    "licenseAuthority" = EXCLUDED."licenseAuthority",
    "isActive" = EXCLUDED."isActive",
    "updatedAt" = NOW();

INSERT INTO "Category" (id, name, description, icon, "nkdCode", "requiresLicense", "licenseType", "licenseAuthority", "isActive", "createdAt", "updatedAt")
VALUES (
    'cat_ciscenje_nakon_gradnje',
    'Čišćenje nakon gradnje',
    'Čišćenje nakon građevinskih radova',
    '🏗️',
    '81.21',
    false,
    NULL,
    NULL,
    true,
    NOW(),
    NOW()
) ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    icon = EXCLUDED.icon,
    "nkdCode" = EXCLUDED."nkdCode",
    "requiresLicense" = EXCLUDED."requiresLicense",
    "licenseType" = EXCLUDED."licenseType",
    "licenseAuthority" = EXCLUDED."licenseAuthority",
    "isActive" = EXCLUDED."isActive",
    "updatedAt" = NOW();

INSERT INTO "Category" (id, name, description, icon, "nkdCode", "requiresLicense", "licenseType", "licenseAuthority", "isActive", "createdAt", "updatedAt")
VALUES (
    'cat_fizioterapija',
    'Fizioterapija',
    'Fizioterapijske usluge, rehabilitacija',
    '🏥',
    '86.90',
    true,
    'Licenca fizioterapeuta',
    'Hrvatska komora fizioterapeuta',
    true,
    NOW(),
    NOW()
) ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    icon = EXCLUDED.icon,
    "nkdCode" = EXCLUDED."nkdCode",
    "requiresLicense" = EXCLUDED."requiresLicense",
    "licenseType" = EXCLUDED."licenseType",
    "licenseAuthority" = EXCLUDED."licenseAuthority",
    "isActive" = EXCLUDED."isActive",
    "updatedAt" = NOW();

INSERT INTO "Category" (id, name, description, icon, "nkdCode", "requiresLicense", "licenseType", "licenseAuthority", "isActive", "createdAt", "updatedAt")
VALUES (
    'cat_masage',
    'Masage',
    'Opuštajuće i terapeutske masaže',
    '💆',
    '96.09',
    false,
    NULL,
    NULL,
    true,
    NOW(),
    NOW()
) ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    icon = EXCLUDED.icon,
    "nkdCode" = EXCLUDED."nkdCode",
    "requiresLicense" = EXCLUDED."requiresLicense",
    "licenseType" = EXCLUDED."licenseType",
    "licenseAuthority" = EXCLUDED."licenseAuthority",
    "isActive" = EXCLUDED."isActive",
    "updatedAt" = NOW();

INSERT INTO "Category" (id, name, description, icon, "nkdCode", "requiresLicense", "licenseType", "licenseAuthority", "isActive", "createdAt", "updatedAt")
VALUES (
    'cat_kozmetika',
    'Kozmetika',
    'Kozmetičke usluge, njega lica',
    '💄',
    '96.02',
    false,
    NULL,
    NULL,
    true,
    NOW(),
    NOW()
) ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    icon = EXCLUDED.icon,
    "nkdCode" = EXCLUDED."nkdCode",
    "requiresLicense" = EXCLUDED."requiresLicense",
    "licenseType" = EXCLUDED."licenseType",
    "licenseAuthority" = EXCLUDED."licenseAuthority",
    "isActive" = EXCLUDED."isActive",
    "updatedAt" = NOW();

INSERT INTO "Category" (id, name, description, icon, "nkdCode", "requiresLicense", "licenseType", "licenseAuthority", "isActive", "createdAt", "updatedAt")
VALUES (
    'cat_manikura/pedikura',
    'Manikura/Pedikura',
    'Njega noktiju ruku i nogu',
    '💅',
    '96.02',
    false,
    NULL,
    NULL,
    true,
    NOW(),
    NOW()
) ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    icon = EXCLUDED.icon,
    "nkdCode" = EXCLUDED."nkdCode",
    "requiresLicense" = EXCLUDED."requiresLicense",
    "licenseType" = EXCLUDED."licenseType",
    "licenseAuthority" = EXCLUDED."licenseAuthority",
    "isActive" = EXCLUDED."isActive",
    "updatedAt" = NOW();

INSERT INTO "Category" (id, name, description, icon, "nkdCode", "requiresLicense", "licenseType", "licenseAuthority", "isActive", "createdAt", "updatedAt")
VALUES (
    'cat_instrukcije',
    'Instrukcije',
    'Poduka učenika, instrukcije',
    '📚',
    '85.59',
    false,
    NULL,
    NULL,
    true,
    NOW(),
    NOW()
) ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    icon = EXCLUDED.icon,
    "nkdCode" = EXCLUDED."nkdCode",
    "requiresLicense" = EXCLUDED."requiresLicense",
    "licenseType" = EXCLUDED."licenseType",
    "licenseAuthority" = EXCLUDED."licenseAuthority",
    "isActive" = EXCLUDED."isActive",
    "updatedAt" = NOW();

INSERT INTO "Category" (id, name, description, icon, "nkdCode", "requiresLicense", "licenseType", "licenseAuthority", "isActive", "createdAt", "updatedAt")
VALUES (
    'cat_jezici',
    'Jezici',
    'Učenje stranih jezika',
    '🗣️',
    '85.59',
    false,
    NULL,
    NULL,
    true,
    NOW(),
    NOW()
) ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    icon = EXCLUDED.icon,
    "nkdCode" = EXCLUDED."nkdCode",
    "requiresLicense" = EXCLUDED."requiresLicense",
    "licenseType" = EXCLUDED."licenseType",
    "licenseAuthority" = EXCLUDED."licenseAuthority",
    "isActive" = EXCLUDED."isActive",
    "updatedAt" = NOW();

INSERT INTO "Category" (id, name, description, icon, "nkdCode", "requiresLicense", "licenseType", "licenseAuthority", "isActive", "createdAt", "updatedAt")
VALUES (
    'cat_muzika',
    'Muzika',
    'Glazbena nastava, poduka',
    '🎵',
    '85.59',
    false,
    NULL,
    NULL,
    true,
    NOW(),
    NOW()
) ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    icon = EXCLUDED.icon,
    "nkdCode" = EXCLUDED."nkdCode",
    "requiresLicense" = EXCLUDED."requiresLicense",
    "licenseType" = EXCLUDED."licenseType",
    "licenseAuthority" = EXCLUDED."licenseAuthority",
    "isActive" = EXCLUDED."isActive",
    "updatedAt" = NOW();

INSERT INTO "Category" (id, name, description, icon, "nkdCode", "requiresLicense", "licenseType", "licenseAuthority", "isActive", "createdAt", "updatedAt")
VALUES (
    'cat_racunovodstvo',
    'Računovodstvo',
    'Knjigovodstvo, računovodstvene usluge',
    '📊',
    '69.20',
    false,
    NULL,
    NULL,
    true,
    NOW(),
    NOW()
) ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    icon = EXCLUDED.icon,
    "nkdCode" = EXCLUDED."nkdCode",
    "requiresLicense" = EXCLUDED."requiresLicense",
    "licenseType" = EXCLUDED."licenseType",
    "licenseAuthority" = EXCLUDED."licenseAuthority",
    "isActive" = EXCLUDED."isActive",
    "updatedAt" = NOW();

INSERT INTO "Category" (id, name, description, icon, "nkdCode", "requiresLicense", "licenseType", "licenseAuthority", "isActive", "createdAt", "updatedAt")
VALUES (
    'cat_osiguranje',
    'Osiguranje',
    'Osiguravajuće usluge',
    '🛡️',
    '65.20',
    true,
    'Licenca osiguravajućeg agenta',
    'Hrvatska agencija za nadzor financijskih usluga',
    true,
    NOW(),
    NOW()
) ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    icon = EXCLUDED.icon,
    "nkdCode" = EXCLUDED."nkdCode",
    "requiresLicense" = EXCLUDED."requiresLicense",
    "licenseType" = EXCLUDED."licenseType",
    "licenseAuthority" = EXCLUDED."licenseAuthority",
    "isActive" = EXCLUDED."isActive",
    "updatedAt" = NOW();

INSERT INTO "Category" (id, name, description, icon, "nkdCode", "requiresLicense", "licenseType", "licenseAuthority", "isActive", "createdAt", "updatedAt")
VALUES (
    'cat_energetska_ucinkovitost',
    'Energetska učinkovitost',
    'Energetski pregledi, optimizacija potrošnje',
    '🌱',
    '71.12',
    true,
    'Licenca energetskog savjetnika',
    'Hrvatska energetska agencija',
    true,
    NOW(),
    NOW()
) ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    icon = EXCLUDED.icon,
    "nkdCode" = EXCLUDED."nkdCode",
    "requiresLicense" = EXCLUDED."requiresLicense",
    "licenseType" = EXCLUDED."licenseType",
    "licenseAuthority" = EXCLUDED."licenseAuthority",
    "isActive" = EXCLUDED."isActive",
    "updatedAt" = NOW();

INSERT INTO "Category" (id, name, description, icon, "nkdCode", "requiresLicense", "licenseType", "licenseAuthority", "isActive", "createdAt", "updatedAt")
VALUES (
    'cat_recikliranje',
    'Recikliranje',
    'Usluge recikliranja, odvoz otpada',
    '♻️',
    '38.11',
    false,
    NULL,
    NULL,
    true,
    NOW(),
    NOW()
) ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    icon = EXCLUDED.icon,
    "nkdCode" = EXCLUDED."nkdCode",
    "requiresLicense" = EXCLUDED."requiresLicense",
    "licenseType" = EXCLUDED."licenseType",
    "licenseAuthority" = EXCLUDED."licenseAuthority",
    "isActive" = EXCLUDED."isActive",
    "updatedAt" = NOW();

INSERT INTO "Category" (id, name, description, icon, "nkdCode", "requiresLicense", "licenseType", "licenseAuthority", "isActive", "createdAt", "updatedAt")
VALUES (
    'cat_montaza_namjestaja',
    'Montaža namještaja',
    'Montaža namještaja, sklapanje',
    '🪑',
    '43.30',
    false,
    NULL,
    NULL,
    true,
    NOW(),
    NOW()
) ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    icon = EXCLUDED.icon,
    "nkdCode" = EXCLUDED."nkdCode",
    "requiresLicense" = EXCLUDED."requiresLicense",
    "licenseType" = EXCLUDED."licenseType",
    "licenseAuthority" = EXCLUDED."licenseAuthority",
    "isActive" = EXCLUDED."isActive",
    "updatedAt" = NOW();

INSERT INTO "Category" (id, name, description, icon, "nkdCode", "requiresLicense", "licenseType", "licenseAuthority", "isActive", "createdAt", "updatedAt")
VALUES (
    'cat_montaza_klima_uredaja',
    'Montaža klima uređaja',
    'Ugradnja i servis klima uređaja',
    '❄️',
    '43.22',
    true,
    'Licenca za klimatizaciju',
    'Hrvatska komora inženjera građevinarstva',
    true,
    NOW(),
    NOW()
) ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    icon = EXCLUDED.icon,
    "nkdCode" = EXCLUDED."nkdCode",
    "requiresLicense" = EXCLUDED."requiresLicense",
    "licenseType" = EXCLUDED."licenseType",
    "licenseAuthority" = EXCLUDED."licenseAuthority",
    "isActive" = EXCLUDED."isActive",
    "updatedAt" = NOW();

-- Provjeri rezultat
SELECT COUNT(*) as "Ukupno kategorija" FROM "Category" WHERE "isActive" = true;
