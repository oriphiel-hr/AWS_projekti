// Helper skripta koja će generirati kompletan seed fajl
// Koristi se za automatsko generiranje seed-a s kompletnim podacima

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const docPath = path.join(__dirname, '../../frontend/src/pages/Documentation.jsx');
const seedPath = path.join(__dirname, '../prisma/seeds/seed-documentation.js');

console.log('📖 Generiranje seed fajla iz Documentation.jsx...');

try {
  const content = fs.readFileSync(docPath, 'utf-8');
  
  // Nađi _hardcodedFeatures
  const featuresMatch = content.match(/const _hardcodedFeatures = (\[[\s\S]*?\]);/);
  if (!featuresMatch) {
    throw new Error('Nije pronađen _hardcodedFeatures');
  }

  // Nađi fallbackFeatureDescriptions (može biti dugačak, pa koristimo multiline match)
  const descStart = content.indexOf('const fallbackFeatureDescriptions = {');
  if (descStart === -1) {
    throw new Error('Nije pronađen fallbackFeatureDescriptions');
  }
  
  // Pronađi zatvaranje objekta - tražimo prvi } koji je pravilno zatvoren
  let braceCount = 0;
  let descEnd = descStart;
  for (let i = descStart + 'const fallbackFeatureDescriptions = '.length; i < content.length; i++) {
    if (content[i] === '{') braceCount++;
    if (content[i] === '}') {
      braceCount--;
      if (braceCount === 0) {
        descEnd = i + 1;
        break;
      }
    }
  }
  
  const descriptionsMatch = content.substring(descStart, descEnd);
  const descriptionsCode = descriptionsMatch.replace(/^const fallbackFeatureDescriptions = /, '').replace(/;?\s*$/, '');

  // Generiraj seed fajl
  const seedTemplate = `// Seed skripta za dokumentaciju funkcionalnosti
// Automatski generirano iz Documentation.jsx

import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

// Features struktura - ekstraktirano iz Documentation.jsx
const features = ${featuresMatch[1]};

// Feature descriptions - ekstraktirano iz fallbackFeatureDescriptions
const featureDescriptions = ${descriptionsCode};

async function seedDocumentation() {
  console.log('🌱 Počinje seed dokumentacije...');

  // Provjeri da li tablice postoje
  try {
    await prisma.$queryRaw\`SELECT 1 FROM "DocumentationCategory" LIMIT 1\`;
    await prisma.$queryRaw\`SELECT 1 FROM "DocumentationFeature" LIMIT 1\`;
    console.log('✅ Tablice DocumentationCategory i DocumentationFeature postoje');
  } catch (error) {
    console.error('❌ Tablice ne postoje! Prvo primijeni migraciju:');
    console.error('   npx prisma migrate dev --name add_documentation_models');
    throw new Error('Tablice ne postoje - primijeni migraciju prvo');
  }

  let categoriesCreated = 0;
  let categoriesUpdated = 0;
  let featuresCreated = 0;
  let featuresUpdated = 0;
  let totalFeatures = 0;
  let implementedFeatures = 0;

  try {
    for (let catIndex = 0; catIndex < features.length; catIndex++) {
      const categoryData = features[catIndex];
      
      const category = await prisma.documentationCategory.upsert({
        where: { name: categoryData.category },
        update: { order: catIndex, isActive: true },
        create: { name: categoryData.category, order: catIndex, isActive: true }
      });

      const wasJustCreated = category.createdAt.getTime() === category.updatedAt.getTime();
      if (wasJustCreated) categoriesCreated++; else categoriesUpdated++;

      console.log(\`✅ Kategorija: \${categoryData.category}\`);

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
            where: { categoryId: category.id, name: item.name }
          });

          if (existing) {
            await prisma.documentationFeature.update({
              where: { id: existing.id },
              data: featureData
            });
            featuresUpdated++;
          } else {
            await prisma.documentationFeature.create({ data: featureData });
            featuresCreated++;
          }
          
          totalFeatures++;
          if (item.implemented) implementedFeatures++;
        }
      }
    }

    // Dodaj statistiku
    console.log('');
    console.log('📊 Dodavanje statistike...');
    const statsCategory = await prisma.documentationCategory.upsert({
      where: { name: 'Statistike Implementacije' },
      update: { order: 999, isActive: true },
      create: { name: 'Statistike Implementacije', order: 999, isActive: true }
    });

    const statsFeature = await prisma.documentationFeature.upsert({
      where: {
        categoryId_name: {
          categoryId: statsCategory.id,
          name: \`\${implementedFeatures} Implementirane funkcionalnosti\`
        }
      },
      update: {
        summary: \`Ukupno \${implementedFeatures} od \${totalFeatures} funkcionalnosti je implementirano.\`,
        details: \`## Statistika Implementacije:\\n\\n- **Ukupno funkcionalnosti:** \${totalFeatures}\\n- **Implementirane:** \${implementedFeatures}\\n- **Postotak:** \${Math.round((implementedFeatures / totalFeatures) * 100)}%\\n\\nOva statistika se automatski ažurira pri svakom seed-u dokumentacije.\`,
        implemented: true,
        order: 0
      },
      create: {
        categoryId: statsCategory.id,
        name: \`\${implementedFeatures} Implementirane funkcionalnosti\`,
        summary: \`Ukupno \${implementedFeatures} od \${totalFeatures} funkcionalnosti je implementirano.\`,
        details: \`## Statistika Implementacije:\\n\\n- **Ukupno funkcionalnosti:** \${totalFeatures}\\n- **Implementirane:** \${implementedFeatures}\\n- **Postotak:** \${Math.round((implementedFeatures / totalFeatures) * 100)}%\\n\\nOva statistika se automatski ažurira pri svakom seed-u dokumentacije.\`,
        implemented: true,
        order: 0
      }
    });

    console.log(\`✅ Statistika dodana: \${implementedFeatures} Implementirane funkcionalnosti\`);

    console.log('');
    console.log('📊 REZULTAT SEED-a:');
    console.log(\`   Kategorije kreirane: \${categoriesCreated}\`);
    console.log(\`   Kategorije ažurirane: \${categoriesUpdated}\`);
    console.log(\`   Features kreirani: \${featuresCreated}\`);
    console.log(\`   Features ažurirani: \${featuresUpdated}\`);
    console.log(\`   Ukupno funkcionalnosti: \${totalFeatures}\`);
    console.log(\`   Implementirane: \${implementedFeatures} (\${Math.round((implementedFeatures / totalFeatures) * 100)}%)\`);
    console.log('✅ Seed dokumentacije završen!');

  } catch (error) {
    console.error('❌ Greška pri seed-u dokumentacije:', error);
    throw error;
  }
}

// Pokreni seed ako se pozove direktno
if (import.meta.url === \`file://\${process.argv[1]}\`) {
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
`;

  fs.writeFileSync(seedPath, seedTemplate, 'utf-8');
  console.log(`✅ Seed fajl generiran: ${seedPath}`);
  
} catch (error) {
  console.error('❌ Greška:', error.message);
  process.exit(1);
}

