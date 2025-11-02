// Skripta za ekstraktiranje podataka iz Documentation.jsx i generiranje seed fajla
// Pokreni: node scripts/extract-documentation.js

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const documentationPath = path.join(__dirname, '../../frontend/src/pages/Documentation.jsx');

console.log('📖 Čitam Documentation.jsx...');

try {
  const content = fs.readFileSync(documentationPath, 'utf-8');
  
  // Ekstraktiraj _hardcodedFeatures
  const featuresMatch = content.match(/const _hardcodedFeatures = (\[[\s\S]*?\]);/);
  if (!featuresMatch) {
    throw new Error('Nije pronađen _hardcodedFeatures u Documentation.jsx');
  }

  // Ekstraktiraj fallbackFeatureDescriptions  
  const descriptionsMatch = content.match(/const fallbackFeatureDescriptions = (\{[\s\S]*?\});/);
  if (!descriptionsMatch) {
    throw new Error('Nije pronađen fallbackFeatureDescriptions u Documentation.jsx');
  }

  console.log('✅ Podaci ekstraktirani');
  console.log(`   Features: ${featuresMatch[1].split('category:').length - 1} kategorija`);
  console.log(`   Descriptions: ${Object.keys(JSON.parse(descriptionsMatch[1].replace(/\n/g, ' '))).length} opisa`);

  // Generiraj seed fajl
  const seedTemplate = `// Seed skripta za dokumentaciju funkcionalnosti
// Automatski generirano iz Documentation.jsx

import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

// Features struktura - ekstraktirano iz Documentation.jsx
const features = ${featuresMatch[1]};

// Feature descriptions - ekstraktirano iz fallbackFeatureDescriptions u Documentation.jsx
const featureDescriptions = ${descriptionsMatch[1]};

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

      // Provjeri da li je kreirana ili ažurirana (jednostavna heuristika)
      const wasJustCreated = category.createdAt.getTime() === category.updatedAt.getTime();
      if (wasJustCreated) {
        categoriesCreated++;
      } else {
        categoriesUpdated++;
      }

      console.log(\`✅ Kategorija: \${categoryData.category}\`);

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
            console.log(\`   📝 Ažuriran: \${item.name}\`);
          } else {
            await prisma.documentationFeature.create({
              data: featureData
            });
            featuresCreated++;
            console.log(\`   ➕ Kreiran: \${item.name}\`);
          }
        }
      }
    }

    console.log('');
    console.log('📊 REZULTAT SEED-a:');
    console.log(\`   Kategorije kreirane: \${categoriesCreated}\`);
    console.log(\`   Kategorije ažurirane: \${categoriesUpdated}\`);
    console.log(\`   Features kreirani: \${featuresCreated}\`);
    console.log(\`   Features ažurirani: \${featuresUpdated}\`);
    console.log('✅ Seed dokumentacije završen!');

  } catch (error) {
    console.error('❌ Greška pri seed-u dokumentacije:', error);
    throw error;
  }
}

// Pokreni seed ako se pozove direktno
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
`;

  const outputPath = path.join(__dirname, '../prisma/seeds/seed-documentation.js');
  fs.writeFileSync(outputPath, seedTemplate, 'utf-8');
  
  console.log(`✅ Seed fajl generiran: ${outputPath}`);
  console.log('');
  console.log('📝 Sljedeći koraci:');
  console.log('   1. Provjeri generirani seed fajl');
  console.log('   2. Pokreni migraciju: npx prisma migrate dev --name add_documentation_models');
  console.log('   3. Pokreni seed: npm run seed:documentation');
  
} catch (error) {
  console.error('❌ Greška:', error.message);
  process.exit(1);
}

