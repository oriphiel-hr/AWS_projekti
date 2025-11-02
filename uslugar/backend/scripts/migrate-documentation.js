// Skripta za migraciju hardkodiranih podataka dokumentacije u bazu
// Pokreni: node scripts/migrate-documentation.js

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Hardkodirani podaci iz Documentation.jsx (privremeno, dok ne migriramo)
const features = [
  {
    category: "Registracija i Autentifikacija",
    items: [
      { name: "Registracija korisnika usluge", implemented: true },
      { name: "Registracija pružatelja usluga", implemented: true },
      { name: "Prijava korisnika", implemented: true },
      { name: "Email verifikacija", implemented: true },
      { name: "Resetiranje lozinke", implemented: true },
      { name: "Zaboravljena lozinka", implemented: true },
      { name: "JWT token autentifikacija", implemented: true },
      { name: "Različite uloge korisnika (USER, PROVIDER, ADMIN)", implemented: true }
    ]
  }
  // Dodati sve ostale kategorije...
];

async function migrate() {
  try {
    console.log('🚀 Počinje migracija dokumentacije...');

    // Ovo će biti zamijenjeno stvarnim podacima iz komponente
    // Za sada koristimo minimalni set za testiranje
    
    let categoriesCreated = 0;
    let featuresCreated = 0;
    let featuresUpdated = 0;

    // Importujemo podatke iz frontend komponente
    // Ovo je privremeno rješenje - trebamo ekstraktirati podatke iz Documentation.jsx
    console.log('⚠️  Napomena: Trebate ekstraktirati features i featureDescriptions iz Documentation.jsx');
    console.log('⚠️  Trenutno skripta koristi samo test podatke');

    console.log('✅ Migracija završena (test mode)');
    console.log(`   Kategorije kreirane: ${categoriesCreated}`);
    console.log(`   Features kreirani: ${featuresCreated}`);
    console.log(`   Features ažurirani: ${featuresUpdated}`);

  } catch (error) {
    console.error('❌ Greška pri migraciji:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

migrate()
  .then(() => {
    console.log('✅ Migracija uspješno završena');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Migracija neuspješna:', error);
    process.exit(1);
  });

