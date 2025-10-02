import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  const categories = ["Vodoinstalater", "Električar", "Stolar", "Moler"];
  await Promise.all(categories.map(name =>
    prisma.category.upsert({ where: { name }, update: {}, create: { name } })
  ));

  // demo user & provider
  const user = await prisma.user.upsert({
    where: { email: "kupac@example.com" },
    update: {},
    create: { email: "kupac@example.com", passwordHash: "x", fullName: "Kupac Kupac" }
  });
  const provUser = await prisma.user.upsert({
    where: { email: "majstor@example.com" },
    update: {},
    create: { email: "majstor@example.com", passwordHash: "x", fullName: "Majstor Majstor", role: "PROVIDER" }
  });
  const cat = await prisma.category.findFirst();

  await prisma.providerProfile.upsert({
    where: { userId: provUser.id },
    update: {},
    create: { userId: provUser.id, bio: "Radim super poslove", categories: { connect: [{ id: cat.id }] } }
  });

  await prisma.job.create({
    data: { title: "Ofarbati zid", description: "Sobni zid 20m2", userId: user.id, categoryId: cat.id, city: "Zagreb" }
  });
}
main().then(()=>process.exit(0)).catch(e=>{console.error(e); process.exit(1);});
