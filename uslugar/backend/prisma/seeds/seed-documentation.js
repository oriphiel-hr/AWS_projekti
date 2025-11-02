// Seed skripta za dokumentaciju funkcionalnosti
// Ekstraktira podatke iz Documentation.jsx i unosi ih u bazu

import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

// Features struktura - ekstraktirano iz Documentation.jsx
// Za kompletnu migraciju, kopiraj _hardcodedFeatures iz Documentation.jsx
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
  // NOTE: Dodaj sve ostale kategorije iz _hardcodedFeatures u Documentation.jsx
  // Ova skripta će raditi s kompletnim podacima
];

// Feature descriptions - ekstraktirano iz fallbackFeatureDescriptions u Documentation.jsx
// Za kompletnu migraciju, kopiraj sve iz fallbackFeatureDescriptions
const featureDescriptions = {
  // NOTE: Dodaj sve opise iz fallbackFeatureDescriptions u Documentation.jsx
  // Primjer:
  // "Grafički prikaz statistika": {
  //   implemented: true,
  //   summary: "Interaktivni grafički prikazi vaših poslovnih rezultata kroz različite period.",
  //   details: `## Kako funkcionira:\n\n...`
  // }
};

async function seedDocumentation() {
  console.log('🌱 Počinje seed dokumentacije...');

  let categoriesCreated = 0;
  let categoriesUpdated = 0;
  let featuresCreated = 0;
  let featuresUpdated = 0;

  try {
    for (let catIndex = 0; catIndex < features.length; catIndex++) {
      const categoryData = features[catIndex];
      
      // Kreiraj ili ažuriraj kategoriju
      const category = await prisma.documentationCategory.upsert({
        where: { name: categoryData.category },
        update: {
          order: catIndex,
          isActive: true
        },
        create: {
          name: categoryData.category,
          order: catIndex,
          isActive: true
        }
      });

      if (category) {
        // Provjeri da li je kreirana ili ažurirana
        const existing = await prisma.documentationCategory.findUnique({
          where: { id: category.id }
        });
        if (existing && existing.createdAt.getTime() === existing.updatedAt.getTime()) {
          categoriesCreated++;
        } else {
          categoriesUpdated++;
        }
      }

      console.log(`✅ Kategorija: ${categoryData.category}`);

      // Kreiraj ili ažuriraj feature opise
      if (categoryData.items && Array.isArray(categoryData.items)) {
        for (let itemIndex = 0; itemIndex < categoryData.items.length; itemIndex++) {
          const item = categoryData.items[itemIndex];
          const description = featureDescriptions[item.name];

          const featureData = {
            categoryId: category.id,
            name: item.name,
            implemented: item.implemented !== undefined ? item.implemented : true,
            deprecated: item.deprecated || false,
            order: itemIndex,
            summary: description?.summary || null,
            details: description?.details || null
          };

          const existing = await prisma.documentationFeature.findFirst({
            where: {
              categoryId: category.id,
              name: item.name
            }
          });

          if (existing) {
            await prisma.documentationFeature.update({
              where: { id: existing.id },
              data: featureData
            });
            featuresUpdated++;
            console.log(`   📝 Ažuriran: ${item.name}`);
          } else {
            await prisma.documentationFeature.create({
              data: featureData
            });
            featuresCreated++;
            console.log(`   ➕ Kreiran: ${item.name}`);
          }
        }
      }
    }

    console.log('');
    console.log('📊 REZULTAT SEED-a:');
    console.log(`   Kategorije kreirane: ${categoriesCreated}`);
    console.log(`   Kategorije ažurirane: ${categoriesUpdated}`);
    console.log(`   Features kreirani: ${featuresCreated}`);
    console.log(`   Features ažurirani: ${featuresUpdated}`);
    console.log('✅ Seed dokumentacije završen!');

  } catch (error) {
    console.error('❌ Greška pri seed-u dokumentacije:', error);
    throw error;
  }
}

// Pokreni seed ako se pozove direktno
if (import.meta.url === `file://${process.argv[1]}`) {
  seedDocumentation()
    .then(async () => {
      await prisma.$disconnect();
      process.exit(0);
    })
    .catch(async (error) => {
      console.error('❌ Seed neuspješan:', error);
      await prisma.$disconnect();
      process.exit(1);
    });
}

export default seedDocumentation;

