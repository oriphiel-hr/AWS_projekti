// Pokretanje seed dokumentacije s detaljnom provjerom
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  try {
    console.log('🚀 Pokretanje seed dokumentacije...');
    console.log('');

    // Provjeri da li tablice postoje
    try {
      await prisma.$queryRaw`SELECT 1 FROM "DocumentationCategory" LIMIT 1`;
      console.log('✅ Tablice postoje');
    } catch (error) {
      console.error('❌ Tablice ne postoje! Prvo primijeni migraciju.');
      console.error('   npx prisma migrate deploy --schema=prisma/schema.prisma');
      process.exit(1);
    }

    // Uvezi i pokreni seed
    const seedDocumentation = await import('../prisma/seeds/seed-documentation.js');
    await seedDocumentation.default();

    // Provjeri rezultate
    const categories = await prisma.documentationCategory.count();
    const features = await prisma.documentationFeature.count();
    const statsCategory = await prisma.documentationCategory.findFirst({
      where: { name: 'Statistike Implementacije' },
      include: { features: true }
    });

    console.log('');
    console.log('📊 FINALNA PROVJERA:');
    console.log(`   Kategorije: ${categories}`);
    console.log(`   Features: ${features}`);
    if (statsCategory && statsCategory.features.length > 0) {
      console.log(`   Statistika: ${statsCategory.features[0].name}`);
    }

  } catch (error) {
    console.error('❌ Greška:', error.message);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

main()
  .then(() => process.exit(0))
  .catch(() => process.exit(1));

