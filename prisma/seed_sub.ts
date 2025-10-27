import { PrismaClient } from '@prisma/client';
import { seed_subjects_questions } from './seeds/seed_d';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando carga de semillas...');
  await seed_subjects_questions();
  console.log('✅ Todas las semillas se ejecutaron correctamente.');
}

main()
  .catch((e) => {
    console.error('❌ Error en la semilla:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
