import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const categories = [
    'Soboslikarstvo', 'Keramičar', 'Električar', 'Vodoinstalater',
    'Građevina', 'Prijevoz', 'Čišćenje', 'IT usluge', 'Pravo'
  ];
  for (const name of categories) {
    await prisma.category.upsert({ where: { name }, update: {}, create: { name } });
  }
  console.log('Seeded categories.');
}

main().finally(async () => { await prisma.$disconnect(); });