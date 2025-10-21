import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  // Seed Categories
  const categories = [
    'Soboslikarstvo', 'Keramičar', 'Električar', 'Vodoinstalater',
    'Građevina', 'Prijevoz', 'Čišćenje', 'IT usluge', 'Pravo'
  ];
  for (const name of categories) {
    await prisma.category.upsert({ where: { name }, update: {}, create: { name } });
  }
  console.log('Seeded categories.');
  
  // Seed Legal Statuses (Hrvatski pravni oblici)
  const legalStatuses = [
    {
      code: 'OBRT',
      name: 'Obrt',
      description: 'Obrtništvo - samostalna djelatnost fizičke osobe',
      isActive: true
    },
    {
      code: 'DOO',
      name: 'd.o.o.',
      description: 'Društvo s ograničenom odgovornošću',
      isActive: true
    },
    {
      code: 'JDOO',
      name: 'j.d.o.o.',
      description: 'Jednostavno društvo s ograničenom odgovornošću',
      isActive: true
    },
    {
      code: 'DD',
      name: 'd.d.',
      description: 'Dioničko društvo',
      isActive: true
    },
    {
      code: 'ZDR',
      name: 'Zadruga',
      description: 'Zadruga - gospodarski subjekt',
      isActive: true
    },
    {
      code: 'VD',
      name: 'v.d.',
      description: 'Javno trgovačko društvo (vl. društvo)',
      isActive: true
    },
    {
      code: 'KD',
      name: 'k.d.',
      description: 'Komanditno društvo',
      isActive: true
    },
    {
      code: 'PAUSALAC',
      name: 'Paušalno oporezivanje',
      description: 'Samostalna djelatnost - paušalno oporezivanje',
      isActive: true
    }
  ];
  
  for (const status of legalStatuses) {
    await prisma.legalStatus.upsert({
      where: { code: status.code },
      update: status,
      create: status
    });
  }
  console.log('Seeded legal statuses.');
}

main().finally(async () => { await prisma.$disconnect(); });