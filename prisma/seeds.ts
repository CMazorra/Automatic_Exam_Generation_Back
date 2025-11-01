import { PrismaClient } from '@prisma/client';
import { seed_exams } from './seeds/seeds_Exam';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando carga de semillas...');
  await seed_exams(prisma);
}

main()
  .catch((e) => {
    console.error('❌ Error en la semilla:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });