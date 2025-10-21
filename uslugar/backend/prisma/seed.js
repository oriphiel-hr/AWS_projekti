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
  
  // Seed Legal Statuses (Hrvatski pravni oblici) - IDeve moraju biti isti kao u migraciji!
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