import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  // Seed Original Categories
  const categories = [
    'Soboslikarstvo', 'Keramičar', 'Električar', 'Vodoinstalater',
    'Građevina', 'Prijevoz', 'Čišćenje', 'IT usluge', 'Pravo'
  ];
  for (const name of categories) {
    await prisma.category.upsert({ where: { name }, update: {}, create: { name } });
  }
  console.log('Seeded original categories.');
  
  // Seed NEW 58 Categories
  const newCategories = [
    // ARHITEKTURA I DIZAJN
    { id: 'arch_001', name: 'Arhitekti', description: 'Projektiranje građevina, renovacije, legalizacije', isActive: false, icon: '🏗️', requiresLicense: true, nkdCode: '71.11' },
    { id: 'arch_002', name: 'Dizajneri interijera', description: 'Dizajn interijera, namještaj, dekor', isActive: false, icon: '🎨', requiresLicense: false, nkdCode: '74.10' },
    { id: 'arch_003', name: '3D vizualizacija', description: '3D modeli, renderi, virtualne turneje', isActive: false, icon: '🖼️', requiresLicense: false, nkdCode: '74.20' },
    { id: 'arch_004', name: 'Projektiranje građevina', description: 'Građevinski projekti, statika, instalacije', isActive: false, icon: '🏛️', requiresLicense: true, nkdCode: '71.12' },
    { id: 'arch_005', name: 'Vrtni dizajn', description: 'Dizajn vrtova, krajobrazno uređenje', isActive: false, icon: '🌳', requiresLicense: false, nkdCode: '71.12' },
    
    // IT I WEB USLUGE
    { id: 'it_001', name: 'Web dizajn', description: 'Dizajn web stranica, UI/UX', isActive: false, icon: '💻', requiresLicense: false, nkdCode: '62.01' },
    { id: 'it_002', name: 'Programiranje', description: 'Razvoj aplikacija, software', isActive: false, icon: '🔧', requiresLicense: false, nkdCode: '62.01' },
    { id: 'it_003', name: 'Mobilne aplikacije', description: 'iOS, Android aplikacije', isActive: false, icon: '📱', requiresLicense: false, nkdCode: '62.01' },
    { id: 'it_004', name: 'SEO optimizacija', description: 'Optimizacija za tražilice', isActive: false, icon: '🔍', requiresLicense: false, nkdCode: '62.02' },
    { id: 'it_005', name: 'Cyber sigurnost', description: 'Sigurnost IT sustava', isActive: false, icon: '🛡️', requiresLicense: false, nkdCode: '62.02' },
    { id: 'it_006', name: 'Cloud servisi', description: 'Cloud infrastruktura, migracije', isActive: false, icon: '☁️', requiresLicense: false, nkdCode: '62.02' },
    { id: 'it_007', name: 'IT konzulting', description: 'IT savjetovanje, implementacija', isActive: false, icon: '📊', requiresLicense: false, nkdCode: '62.03' },
    
    // ZDRAVSTVENE USLUGE
    { id: 'health_001', name: 'Fizioterapija', description: 'Fizikalna terapija, rehabilitacija', isActive: false, icon: '🏥', requiresLicense: true, nkdCode: '86.90' },
    { id: 'health_002', name: 'Nutricionizam', description: 'Prehrambena savjetovanja', isActive: false, icon: '🥗', requiresLicense: true, nkdCode: '86.90' },
    { id: 'health_003', name: 'Mentalno zdravlje', description: 'Psihološke usluge, savjetovanje', isActive: false, icon: '🧘', requiresLicense: true, nkdCode: '86.90' },
    { id: 'health_004', name: 'Kućni liječnik', description: 'Kućni posjeti, pregledi', isActive: false, icon: '👨‍⚕️', requiresLicense: true, nkdCode: '86.21' },
    { id: 'health_005', name: 'Stomatologija', description: 'Zubarske usluge', isActive: false, icon: '🦷', requiresLicense: true, nkdCode: '86.23' },
    { id: 'health_006', name: 'Optometristi', description: 'Pregled vida, naočale', isActive: false, icon: '👁️', requiresLicense: true, nkdCode: '86.90' },
    
    // EDUKACIJA I TRENING
    { id: 'edu_001', name: 'Jezični tečajevi', description: 'Strani jezici, hrvatski jezik', isActive: false, icon: '🎓', requiresLicense: false, nkdCode: '85.52' },
    { id: 'edu_002', name: 'Poslovni trening', description: 'Soft skills, leadership', isActive: false, icon: '💼', requiresLicense: false, nkdCode: '85.52' },
    { id: 'edu_003', name: 'Glazbena nastava', description: 'Glazbeni instrumenti, pjevanje', isActive: false, icon: '🎵', requiresLicense: false, nkdCode: '85.52' },
    { id: 'edu_004', name: 'Sportska nastava', description: 'Treniranje, fitness instruktori', isActive: false, icon: '🏃', requiresLicense: false, nkdCode: '85.52' },
    { id: 'edu_005', name: 'Umjetnička nastava', description: 'Slikanje, kiparstvo, dizajn', isActive: false, icon: '🎨', requiresLicense: false, nkdCode: '85.52' },
    { id: 'edu_006', name: 'Online edukacija', description: 'E-learning, webinari', isActive: false, icon: '📚', requiresLicense: false, nkdCode: '85.52' },
    
    // TURISTIČKE USLUGE
    { id: 'tourism_001', name: 'Turistički vodiči', description: 'Vodstvo turista, objašnjavanje', isActive: false, icon: '🗺️', requiresLicense: true, nkdCode: '79.90' },
    { id: 'tourism_002', name: 'Turistički agenti', description: 'Organizacija putovanja', isActive: false, icon: '✈️', requiresLicense: false, nkdCode: '79.11' },
    { id: 'tourism_003', name: 'Hotelijerske usluge', description: 'Smeštaj, konferencije', isActive: false, icon: '🏨', requiresLicense: false, nkdCode: '55.10' },
    { id: 'tourism_004', name: 'Prijevoz turista', description: 'Autobusni prijevoz, transferi', isActive: false, icon: '🚌', requiresLicense: false, nkdCode: '49.39' },
    { id: 'tourism_005', name: 'Event organizacija', description: 'Organizacija događanja, konferencija', isActive: false, icon: '🎯', requiresLicense: false, nkdCode: '82.30' },
    
    // FINANCIJSKE USLUGE
    { id: 'finance_001', name: 'Investicijski savjeti', description: 'Savjetovanje o investicijama', isActive: false, icon: '💰', requiresLicense: true, nkdCode: '66.30' },
    { id: 'finance_002', name: 'Bankovne usluge', description: 'Bankovni proizvodi, krediti', isActive: false, icon: '🏦', requiresLicense: true, nkdCode: '64.19' },
    { id: 'finance_003', name: 'Financijsko planiranje', description: 'Osobno financijsko planiranje', isActive: false, icon: '📈', requiresLicense: false, nkdCode: '66.30' },
    { id: 'finance_004', name: 'Hipotekarni savjeti', description: 'Savjetovanje o hipotekama', isActive: false, icon: '🏠', requiresLicense: false, nkdCode: '66.30' },
    { id: 'finance_005', name: 'Osiguranje', description: 'Osiguravajući proizvodi', isActive: false, icon: '💳', requiresLicense: true, nkdCode: '65.20' },
    
    // MARKETING I PR
    { id: 'marketing_001', name: 'Marketing agencije', description: 'Kompletni marketing servisi', isActive: false, icon: '📢', requiresLicense: false, nkdCode: '73.11' },
    { id: 'marketing_002', name: 'Reklamne usluge', description: 'Kreiranje reklama, kampanje', isActive: false, icon: '📺', requiresLicense: false, nkdCode: '73.11' },
    { id: 'marketing_003', name: 'Social media marketing', description: 'Upravljanje društvenim mrežama', isActive: false, icon: '📱', requiresLicense: false, nkdCode: '73.11' },
    { id: 'marketing_004', name: 'PR usluge', description: 'Odnosi s javnošću, komunikacija', isActive: false, icon: '📰', requiresLicense: false, nkdCode: '73.12' },
    { id: 'marketing_005', name: 'Branding', description: 'Kreiranje brenda, identiteta', isActive: false, icon: '🎯', requiresLicense: false, nkdCode: '73.11' },
    
    // TRANSPORT I LOGISTIKA
    { id: 'transport_001', name: 'Kamionski prijevoz', description: 'Prijevoz tereta kamionima', isActive: false, icon: '🚛', requiresLicense: true, nkdCode: '49.41' },
    { id: 'transport_002', name: 'Kurirske usluge', description: 'Dostava paketa, kuriri', isActive: false, icon: '📦', requiresLicense: false, nkdCode: '53.20' },
    { id: 'transport_003', name: 'Međunarodni transport', description: 'Prijevoz između zemalja', isActive: false, icon: '🚢', requiresLicense: true, nkdCode: '49.41' },
    { id: 'transport_004', name: 'Skladišne usluge', description: 'Skladištenje, logistika', isActive: false, icon: '🏭', requiresLicense: false, nkdCode: '52.10' },
    { id: 'transport_005', name: 'Specijalizirani transport', description: 'Prijevoz opasnih materijala', isActive: false, icon: '🚚', requiresLicense: true, nkdCode: '49.41' },
    
    // OSTALE USLUGE
    { id: 'other_001', name: 'Zabavne usluge', description: 'Animatori, DJ, zabavljači', isActive: false, icon: '🎪', requiresLicense: false, nkdCode: '90.03' },
    { id: 'other_002', name: 'Umjetničke usluge', description: 'Kiparstvo, slikanje, umjetnost', isActive: false, icon: '🎭', requiresLicense: false, nkdCode: '90.03' },
    { id: 'other_003', name: 'Trgovinske usluge', description: 'Prodaja, trgovina', isActive: false, icon: '🏪', requiresLicense: false, nkdCode: '47.11' },
    { id: 'other_004', name: 'Poslovne usluge', description: 'Administrativne usluge', isActive: false, icon: '🏢', requiresLicense: false, nkdCode: '82.11' },
    { id: 'other_005', name: 'Popravak opreme', description: 'Popravak različite opreme', isActive: false, icon: '🔧', requiresLicense: false, nkdCode: '95.11' },
    
    // DODATNE GLAVNE KATEGORIJE ZA PODKATEGORIJE
    { id: 'garden_001', name: 'Vrtni radovi', description: 'Vrtni radovi i baštanska njega', isActive: true, icon: '🌿', requiresLicense: false, nkdCode: '81.30' },
    { id: 'clean_001', name: 'Čistoća i održavanje', description: 'Čišćenje i održavanje prostora', isActive: true, icon: '🧹', requiresLicense: false, nkdCode: '81.21' },
    { id: 'it_support_001', name: 'IT podrška', description: 'IT usluge i tehnička podrška', isActive: true, icon: '🖥️', requiresLicense: false, nkdCode: '62.03' }
  ];

  for (const category of newCategories) {
    await prisma.category.upsert({
      where: { id: category.id },
      update: category,
      create: category
    });
  }
  console.log(`✅ Seeded ${newCategories.length} new categories.`);

  // Seed Subcategories
  const subCategories = [
    // VRTNI RADOVI - 4 podkategorije
    { name: 'Uređivanje vrta', description: 'Dizajn i uređivanje vrtnih prostora', parentCategoryName: 'Vrtni radovi', icon: '🌿', isActive: true },
    { name: 'Sadnja biljaka', description: 'Sadnja cvijeća, grmlja i drveća', parentCategoryName: 'Vrtni radovi', icon: '🌱', isActive: true },
    { name: 'Održavanje vrta', description: 'Košenje, obrezivanje, zalijevanje', parentCategoryName: 'Vrtni radovi', icon: '✂️', isActive: true },
    { name: 'Automatsko zalijevanje', description: 'Ugradnja sustava automatskog zalijevanja', parentCategoryName: 'Vrtni radovi', icon: '💧', isActive: true },

    // ČISTOĆA I ODRŽAVANJE - 4 podkategorije
    { name: 'Čišćenje kuće', description: 'Redovno čišćenje stanova i kuća', parentCategoryName: 'Čistoća i održavanje', icon: '🧹', isActive: true },
    { name: 'Čišćenje ureda', description: 'Poslovni prostori i uredi', parentCategoryName: 'Čistoća i održavanje', icon: '🏢', isActive: true },
    { name: 'Čišćenje nakon gradnje', description: 'Čišćenje nakon renovacije i gradnje', parentCategoryName: 'Čistoća i održavanje', icon: '🏗️', isActive: true },
    { name: 'Čišćenje tepiha', description: 'Profesionalno čišćenje tepiha i tapeta', parentCategoryName: 'Čistoća i održavanje', icon: '🪣', isActive: true },

    // IT PODRŠKA - 4 podkategorije
    { name: 'Popravak računala', description: 'Servis desktop i laptop računala', parentCategoryName: 'IT podrška', icon: '💻', isActive: true },
    { name: 'Mrežne instalacije', description: 'Ugradnja WiFi mreža i kabeliranje', parentCategoryName: 'IT podrška', icon: '📶', isActive: true },
    { name: 'Sigurnosni sustavi', description: 'Kamere, alarmi, kontrolni sustavi', parentCategoryName: 'IT podrška', icon: '🔒', isActive: true },
    { name: 'Software podrška', description: 'Instalacija programa i tehnička podrška', parentCategoryName: 'IT podrška', icon: '⚙️', isActive: true },

    // PRIJEVOZ - 4 podkategorije
    { name: 'Selidba', description: 'Selidba stanova i kuća', parentCategoryName: 'Prijevoz', icon: '📦', isActive: true },
    { name: 'Prijevoz namještaja', description: 'Transport namještaja i velikih predmeta', parentCategoryName: 'Prijevoz', icon: '🚚', isActive: true },
    { name: 'Prijevoz građevinskog materijala', description: 'Transport cementa, pijeska, cigle', parentCategoryName: 'Prijevoz', icon: '🧱', isActive: true },
    { name: 'Prijevoz otpada', description: 'Odvoz građevinskog i komunalnog otpada', parentCategoryName: 'Prijevoz', icon: '🗑️', isActive: true }
  ];

  for (const subcategory of subCategories) {
    const parent = await prisma.category.findFirst({
      where: { name: subcategory.parentCategoryName }
    });
    
    if (parent) {
      const { parentCategoryName, ...subcategoryData } = subcategory;
      await prisma.category.upsert({
        where: { 
          name: subcategory.name
        },
        update: {
          ...subcategoryData,
          parentId: parent.id
        },
        create: {
          ...subcategoryData,
          parentId: parent.id
        }
      });
    }
  }
  console.log(`✅ Seeded ${subCategories.length} subcategories.`);
  
  // Seed Legal Statuses (Hrvatski pravni oblici) - IDevi moraju biti isti kao u migraciji!
  const legalStatuses = [
    {
      id: 'cls1_individual',
      code: 'INDIVIDUAL',
      name: 'Fizička osoba',
      description: 'Privatna osoba bez registrirane djelatnosti',
      isActive: true
    },
    {
      id: 'cls2_sole_trader',
      code: 'SOLE_TRADER',
      name: 'Obrtnik',
      description: 'Registrirani obrt - fizička osoba s OIB-om',
      isActive: true
    },
    {
      id: 'cls3_pausal',
      code: 'PAUSAL',
      name: 'Paušalni obrt',
      description: 'Obrt s paušalnim oporezivanjem',
      isActive: true
    },
    {
      id: 'cls4_doo',
      code: 'DOO',
      name: 'd.o.o.',
      description: 'Društvo s ograničenom odgovornošću',
      isActive: true
    },
    {
      id: 'cls5_jdoo',
      code: 'JDOO',
      name: 'j.d.o.o.',
      description: 'Jednostavno društvo s ograničenom odgovornošću',
      isActive: true
    },
    {
      id: 'cls6_freelancer',
      code: 'FREELANCER',
      name: 'Samostalni djelatnik',
      description: 'Freelancer s paušalnim oporezivanjem',
      isActive: true
    }
  ];
  
  for (const status of legalStatuses) {
    await prisma.legalStatus.upsert({
      where: { id: status.id },
      update: status,
      create: status
    });
  }
  console.log('Seeded legal statuses.');
}

main().finally(async () => { await prisma.$disconnect(); });